// Types
interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  resetUrl?: string;
  note?: string;
}

interface PasswordResetRequest {
  email: string;
}

interface PasswordResetResponse {
  message: string;
  email: string;
  resetUrl?: string;
  note?: string;
}

interface PasswordResetConfirm {
  token: string;
  email: string;
  password: string;
}

interface TokenVerification {
  token: string;
  email: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

// Configuration
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4004',
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000,
} as const;

// Error types
class ApiError extends Error {
  public status?: number;
  public code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

class NetworkError extends ApiError {
  constructor(message: string = 'Network error. Please check your connection.') {
    super(message);
    this.name = 'NetworkError';
  }
}

class ValidationError extends ApiError {
  public details?: any[];

  constructor(message: string, details?: any[]) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
  }
}

class ApiService {
  private baseURL: string;
  private timeout: number;
  private retryAttempts: number;
  private retryDelay: number;

  constructor(config: typeof API_CONFIG) {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout;
    this.retryAttempts = config.retryAttempts;
    this.retryDelay = config.retryDelay;
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private createHeaders(customHeaders?: Record<string, string>): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    const token = this.getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  private async timeoutPromise<T>(promise: Promise<T>, ms: number): Promise<T> {
    const timeout = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new NetworkError('Request timeout')), ms);
    });
    return Promise.race([promise, timeout]);
  }

  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    attempts: number = this.retryAttempts
  ): Promise<T> {
    try {
      return await requestFn();
    } catch (error) {
      if (attempts > 1 && error instanceof NetworkError) {
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        return this.retryRequest(requestFn, attempts - 1);
      }
      throw error;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    return this.retryRequest(async () => {
      try {
        const url = `${this.baseURL}${endpoint}`;
        const config: RequestInit = {
          headers: this.createHeaders(options.headers as Record<string, string>),
          ...options,
        };

        const response = await this.timeoutPromise(
          fetch(url, config),
          this.timeout
        );

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 400 && data.details) {
            throw new ValidationError(data.error || 'Validation failed', data.details);
          }
          throw new ApiError(
            data.error || 'An error occurred',
            response.status,
            data.code
          );
        }

        return { data };
      } catch (error) {
        if (error instanceof ApiError || error instanceof ValidationError) {
          throw error;
        }
        throw new NetworkError();
      }
    });
  }

  // Password reset endpoints
  async forgotPassword(email: string): Promise<ApiResponse<PasswordResetResponse>> {
    const payload: PasswordResetRequest = { email };
    return this.request<PasswordResetResponse>('/password/forgot', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async resetPassword(token: string, email: string, password: string): Promise<ApiResponse<{ message: string }>> {
    const payload: PasswordResetConfirm = { token, email, password };
    return this.request<{ message: string }>('/password/reset', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async verifyResetToken(token: string, email: string): Promise<ApiResponse<{ message: string }>> {
    const payload: TokenVerification = { token, email };
    return this.request<{ message: string }>('/password/verify-token', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Auth endpoints (for future use)
  async login(email: string, password: string): Promise<ApiResponse<any>> {
    const payload: LoginRequest = { email, password };
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async register(email: string, password: string, name: string): Promise<ApiResponse<any>> {
    const payload: RegisterRequest = { email, password, name };
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string; message: string }>> {
    return this.request<{ status: string; message: string }>('/health');
  }
}

// Create and export singleton instance
const apiService = new ApiService(API_CONFIG);

export default apiService;
export { ApiError, NetworkError, ValidationError };
export type { ApiResponse, PasswordResetResponse }; 