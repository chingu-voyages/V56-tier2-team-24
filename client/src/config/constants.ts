// API Configuration
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4004',
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000,
} as const;

// Password Requirements
export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  patterns: {
    lowercase: /[a-z]/,
    uppercase: /[A-Z]/,
    number: /\d/,
    special: /[^A-Za-z0-9]/
  }
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/password/forgot',
  RESET_PASSWORD: '/password/reset',
  RESET_SUCCESS: '/password/reset-success',
  RESET_LINK_SENT: '/password/reset-link-sent',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  VALIDATION_FAILED: 'Validation failed. Please check your input.',
  INVALID_TOKEN: 'Invalid or expired reset token.',
  PASSWORDS_DONT_MATCH: 'Passwords do not match.',
  PASSWORD_REQUIREMENTS: 'Password does not meet requirements.',
  UNEXPECTED_ERROR: 'An unexpected error occurred. Please try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  PASSWORD_RESET: 'Password reset successfully.',
  EMAIL_SENT: 'Password reset link sent successfully.',
  TOKEN_VALID: 'Token is valid.',
} as const;

// Development Mode
export const isDevelopmentMode = (): boolean => {
  return import.meta.env.DEV;
};

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  TOKEN: 'token',
  USER: 'user',
} as const; 