// Email validation utilities
export const validateEmail = (email: string): boolean => {
  // More comprehensive email validation
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
};

export const validateEmailFormat = (email: string): { isValid: boolean; error?: string } => {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }
  
  if (!validateEmail(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  // Additional checks
  if (email.length > 254) {
    return { isValid: false, error: 'Email is too long' };
  }
  
  const [localPart] = email.split('@');
  if (localPart.length > 64) {
    return { isValid: false, error: 'Email local part is too long' };
  }
  
  return { isValid: true };
};

// Password validation utilities
export interface PasswordValidationResult {
  isValid: boolean;
  score: number;
  feedback: string[];
  missingRequirements: string[];
}

export const validatePassword = (password: string): PasswordValidationResult => {
  const requirements = {
    minLength: 8,
    maxLength: 128,
    patterns: {
      lowercase: /[a-z]/,
      uppercase: /[A-Z]/,
      number: /\d/,
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
    }
  };

  const feedback: string[] = [];
  const missingRequirements: string[] = [];
  let score = 0;

  // Length check
  if (password.length < requirements.minLength) {
    missingRequirements.push(`At least ${requirements.minLength} characters`);
  } else if (password.length > requirements.maxLength) {
    missingRequirements.push(`No more than ${requirements.maxLength} characters`);
  } else {
    score++;
  }

  // Character type checks
  if (!requirements.patterns.lowercase.test(password)) {
    missingRequirements.push('One lowercase letter');
  } else {
    score++;
  }

  if (!requirements.patterns.uppercase.test(password)) {
    missingRequirements.push('One uppercase letter');
  } else {
    score++;
  }

  if (!requirements.patterns.number.test(password)) {
    missingRequirements.push('One number');
  } else {
    score++;
  }

  if (!requirements.patterns.special.test(password)) {
    missingRequirements.push('One special character');
  } else {
    score++;
  }

  // Additional strength checks
  if (password.length >= 12) score++;
  if (/(.)\1{2,}/.test(password)) {
    feedback.push('Avoid repeated characters');
  }

  const isValid = score >= 4 && password.length >= requirements.minLength && password.length <= requirements.maxLength;

  return {
    isValid,
    score: Math.min(score, 6), // Cap at 6
    feedback,
    missingRequirements
  };
};

// Token validation utilities
export const validateToken = (token: string): { isValid: boolean; error?: string } => {
  if (!token) {
    return { isValid: false, error: 'Token is required' };
  }
  
  // Basic token format validation (hex string)
  const tokenRegex = /^[a-fA-F0-9]{32,}$/;
  if (!tokenRegex.test(token)) {
    return { isValid: false, error: 'Invalid token format' };
  }
  
  return { isValid: true };
};

// URL validation utilities
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Input sanitization utilities
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const sanitizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
}; 