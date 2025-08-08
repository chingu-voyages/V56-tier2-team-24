// Server Configuration Constants

// Time Constants (in milliseconds)
export const TIME_CONSTANTS = {
  MINUTE_IN_MS: 60 * 1000,
  HOUR_IN_MS: 60 * 60 * 1000,
  DAY_IN_MS: 24 * 60 * 60 * 1000,
  WEEK_IN_MS: 7 * 24 * 60 * 60 * 1000,
} as const;

// Security Configuration
export const SECURITY_CONFIG = {
  // Token Settings
  TOKEN_EXPIRY_HOURS: 1,
  TOKEN_BYTES: 32,
  TOKEN_SALT_ROUNDS: 10,
  
  // Password Settings
  PASSWORD_SALT_ROUNDS: 12,
  PASSWORD_MIN_LENGTH: 8,
  
  // Rate Limiting
  MAX_RESET_ATTEMPTS: 5,
  RESET_COOLDOWN_MINUTES: 15,
} as const;

// Email Configuration
export const EMAIL_CONFIG = {
  // Frontend URL
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  
  // Email Templates
  RESET_EMAIL_SUBJECT: 'Password Reset Request',
  RESET_EMAIL_TEMPLATE: 'reset-password-template.html',
  
  // Email Settings
  EMAIL_TIMEOUT: 10000,
  MAX_RETRY_ATTEMPTS: 3,
} as const;

// Validation Configuration
export const VALIDATION_CONFIG = {
  // Email Validation
  EMAIL_MAX_LENGTH: 254,
  EMAIL_LOCAL_MAX_LENGTH: 64,
  
  // Password Validation Patterns
  PASSWORD_PATTERNS: {
    lowercase: /[a-z]/,
    uppercase: /[A-Z]/,
    number: /\d/,
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
  },
  
  // Token Validation
  TOKEN_MIN_LENGTH: 32,
  TOKEN_MAX_LENGTH: 64,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  // Validation Errors
  INVALID_EMAIL: 'Please provide a valid email address',
  INVALID_TOKEN: 'Invalid or expired reset token',
  TOKEN_EXPIRED: 'Reset token has expired',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters long',
  PASSWORD_REQUIREMENTS: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  
  // Server Errors
  USER_NOT_FOUND: 'User not found',
  EMAIL_SEND_FAILED: 'Failed to send reset email',
  INTERNAL_ERROR: 'Internal server error',
  
  // Rate Limiting
  TOO_MANY_ATTEMPTS: 'Too many reset attempts. Please try again later.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  PASSWORD_RESET: 'Password reset successfully',
  EMAIL_SENT: 'Password reset link sent successfully',
  TOKEN_VALID: 'Token is valid',
} as const;

// Development Mode
export const isDevelopmentMode = (): boolean => {
  return process.env.NODE_ENV === 'development';
}; 