// Error types
export interface AppError {
  message: string;
  code?: string;
  status?: number;
  details?: any[];
}

// Error handling utilities
export const handleApiError = (error: any): AppError => {
  if (error?.response?.data) {
    return {
      message: error.response.data.error || 'An error occurred',
      status: error.response.status,
      code: error.response.data.code,
      details: error.response.data.details
    };
  }
  
  if (error?.message) {
    return {
      message: error.message,
      code: error.code
    };
  }
  
  return {
    message: 'An unexpected error occurred'
  };
};

export const isNetworkError = (error: any): boolean => {
  return !error?.response && error?.request;
};

export const isValidationError = (error: any): boolean => {
  return error?.response?.status === 400 && error?.response?.data?.details;
};

export const isAuthError = (error: any): boolean => {
  return error?.response?.status === 401 || error?.response?.status === 403;
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  AUTH_ERROR: 'Authentication failed. Please log in again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNKNOWN_ERROR: 'An unexpected error occurred.'
} as const;

// Get user-friendly error message
export const getErrorMessage = (error: any): string => {
  if (isNetworkError(error)) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }
  
  if (isValidationError(error)) {
    return ERROR_MESSAGES.VALIDATION_ERROR;
  }
  
  if (isAuthError(error)) {
    return ERROR_MESSAGES.AUTH_ERROR;
  }
  
  if (error?.response?.status >= 500) {
    return ERROR_MESSAGES.SERVER_ERROR;
  }
  
  return error?.message || ERROR_MESSAGES.UNKNOWN_ERROR;
}; 