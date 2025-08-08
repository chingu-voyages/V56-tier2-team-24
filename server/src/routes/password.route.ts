import express from 'express';
import { body, validationResult } from 'express-validator';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { sendPasswordResetEmail } from '../services/emailService';
import UserModel from '../models/user.model';
import { 
  TIME_CONSTANTS, 
  SECURITY_CONFIG, 
  EMAIL_CONFIG, 
  ERROR_MESSAGES, 
  SUCCESS_MESSAGES,
  isDevelopmentMode 
} from '../config/constants';

const router = express.Router();

// Types
interface TokenData {
  token: string;
  expiresAt: Date;
}

interface ValidationError {
  error: string;
  details?: any[];
}

// In-memory storage for reset tokens (in production, use database)
const resetTokens = new Map<string, TokenData>();

// Utility functions
const generateResetToken = (): string => {
  return crypto.randomBytes(SECURITY_CONFIG.TOKEN_BYTES).toString('hex');
};

const createResetUrl = (token: string, email: string): string => {
  return `${EMAIL_CONFIG.FRONTEND_URL}/password/reset?token=${token}&email=${encodeURIComponent(email)}`;
};

const handleValidationErrors = (req: express.Request): ValidationError | null => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return {
      error: 'Validation failed',
      details: errors.array()
    };
  }
  return null;
};

const validateToken = async (email: string, token: string): Promise<{ valid: boolean; error?: string }> => {
  const tokenData = resetTokens.get(email);
  
  if (!tokenData) {
    return { valid: false, error: 'Invalid or expired reset token' };
  }

  if (new Date() > tokenData.expiresAt) {
    resetTokens.delete(email);
    return { valid: false, error: 'Reset token has expired' };
  }

  const isValidToken = await bcrypt.compare(token, tokenData.token);
  if (!isValidToken) {
    return { valid: false, error: 'Invalid reset token' };
  }

  return { valid: true };
};

const cleanupExpiredTokens = (): void => {
  const now = new Date();
  for (const [email, tokenData] of resetTokens.entries()) {
    if (now > tokenData.expiresAt) {
      resetTokens.delete(email);
    }
  }
};

// Middleware to clean up expired tokens
const cleanupTokens = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  cleanupExpiredTokens();
  next();
};

// Validation schemas
const emailValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address')
];

const resetPasswordValidation = [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

const tokenValidation = [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required')
];

// Forgot Password - Send reset link
router.post('/forgot', cleanupTokens, emailValidation, async (req: express.Request, res: express.Response) => {
  try {
    const validationError = handleValidationErrors(req);
    if (validationError) {
      return res.status(400).json(validationError);
    }

    const { email } = req.body;

    // TODO: Check if user exists in database
    // const user = await UserModel.findOne({ email });
    // if (!user) {
    //   return res.status(404).json({ error: 'User not found' });
    // }

    // Generate and store reset token
    const resetToken = generateResetToken();
    const hashedToken = await bcrypt.hash(resetToken, SECURITY_CONFIG.TOKEN_SALT_ROUNDS);
    const expiresAt = new Date(Date.now() + SECURITY_CONFIG.TOKEN_EXPIRY_HOURS * TIME_CONSTANTS.HOUR_IN_MS);
    
    resetTokens.set(email, {
      token: hashedToken,
      expiresAt
    });

    const resetUrl = createResetUrl(resetToken, email);

    // Attempt to send email
    let emailSent = false;
    console.log('Email config check:', {
      EMAIL_SERVICE: process.env.EMAIL_SERVICE,
      EMAIL_USER: process.env.EMAIL_USER ? 'SET' : 'NOT SET',
      EMAIL_APP_PASSWORD: process.env.EMAIL_APP_PASSWORD ? 'SET' : 'NOT SET'
    });
    
    if (process.env.EMAIL_SERVICE === 'gmail' && process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD) {
      console.log('Attempting to send email...');
      emailSent = await sendPasswordResetEmail(email, resetUrl);
      console.log('Email sent result:', emailSent);
    } else {
      console.log('Email service not configured properly');
    }

    // Prepare response based on email status
    const response: any = {
      message: emailSent 
        ? 'Password reset link sent successfully'
        : 'Failed to send reset email. Please try again.',
      email
    };

    if (!emailSent && !isDevelopmentMode()) {
      return res.status(500).json({ error: 'Failed to send reset email' });
    }

    res.json(response);

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reset Password - Verify token and update password
router.post('/reset', cleanupTokens, resetPasswordValidation, async (req: express.Request, res: express.Response) => {
  try {
    const validationError = handleValidationErrors(req);
    if (validationError) {
      return res.status(400).json(validationError);
    }

    const { token, email, password } = req.body;

    // Validate token
    const tokenValidation = await validateToken(email, token);
    if (!tokenValidation.valid) {
      return res.status(400).json({ error: tokenValidation.error });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, SECURITY_CONFIG.PASSWORD_SALT_ROUNDS);
    
    // In development mode without database, just simulate password update
    if (isDevelopmentMode()) {
      console.log(`[DEV MODE] Password would be updated for email: ${email}`);
      console.log(`[DEV MODE] Hashed password: ${hashedPassword}`);
      
      // Remove used token
      resetTokens.delete(email);
      
      res.json({ 
        message: 'Password reset successfully (development mode)',
        note: 'In production, this would update the user password in the database.'
      });
    } else {
      // Production mode - update user in database
      const updatedUser = await UserModel.findOneAndUpdate(
        { email },
        { 
          password: hashedPassword,
          updatedAt: new Date()
        },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Remove used token
      resetTokens.delete(email);

      res.json({ message: 'Password reset successfully' });
    }

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify reset token (for frontend validation)
router.post('/verify-token', cleanupTokens, tokenValidation, async (req: express.Request, res: express.Response) => {
  try {
    const validationError = handleValidationErrors(req);
    if (validationError) {
      return res.status(400).json(validationError);
    }

    const { token, email } = req.body;

    const tokenValidation = await validateToken(email, token);
    if (!tokenValidation.valid) {
      return res.status(400).json({ error: tokenValidation.error });
    }

    res.json({ message: 'Token is valid' });

  } catch (error) {
    console.error('Verify token error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 