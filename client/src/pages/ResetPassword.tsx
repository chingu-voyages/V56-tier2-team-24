import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import loginImg from "/static/images/login.svg";
import apiService, { ApiError, NetworkError, ValidationError } from "../services/api";
import { validatePassword } from "../utils/validation";

// Types
interface FormData {
  password: string;
  confirmPassword: string;
}

interface PasswordStrength {
  score: number;
  feedback: string;
  isValid: boolean;
}

interface TokenValidationState {
  isValid: boolean;
  isValidating: boolean;
  error: string;
}



// Custom hooks
const usePasswordStrength = () => {
  const [strength, setStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: "",
    isValid: false
  });

  const checkPasswordStrength = useCallback((password: string): PasswordStrength => {
    const validation = validatePassword(password);
    
    return {
      score: validation.score,
      feedback: validation.missingRequirements.length > 0 
        ? `Missing: ${validation.missingRequirements.join(", ")}` 
        : "Strong password",
      isValid: validation.isValid
    };
  }, []);

  const updateStrength = useCallback((password: string) => {
    const newStrength = checkPasswordStrength(password);
    setStrength(newStrength);
  }, [checkPasswordStrength]);

  return { strength, updateStrength };
};

const useTokenValidation = (token: string | null, email: string | null) => {
  const [state, setState] = useState<TokenValidationState>({
    isValid: false,
    isValidating: true,
    error: ""
  });

  const validateToken = useCallback(async () => {
    if (!token || !email) {
      setState({
        isValid: false,
        isValidating: false,
        error: 'Invalid reset link. Please request a new password reset.'
      });
      return;
    }

    try {
      const response = await apiService.verifyResetToken(token, email);
      
      if (response.error) {
        setState({
          isValid: false,
          isValidating: false,
          error: response.error
        });
      } else {
        setState({
          isValid: true,
          isValidating: false,
          error: ""
        });
      }
    } catch (error) {
      let errorMessage = 'Failed to validate reset link. Please try again.';
      
      if (error instanceof ValidationError) {
        errorMessage = error.message;
      } else if (error instanceof NetworkError) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error instanceof ApiError) {
        errorMessage = error.message;
      }

      setState({
        isValid: false,
        isValidating: false,
        error: errorMessage
      });
    }
  }, [token, email]);

  useEffect(() => {
    validateToken();
  }, [validateToken]);

  return state;
};

// Utility functions
const getStrengthColor = (score: number): string => {
  if (score <= 2) return "text-red-500";
  if (score <= 3) return "text-yellow-500";
  if (score <= 4) return "text-blue-500";
  return "text-green-500";
};

const getStrengthBarColor = (score: number): string => {
  if (score <= 2) return "bg-red-500";
  if (score <= 3) return "bg-yellow-500";
  if (score <= 4) return "bg-blue-500";
  return "bg-green-500";
};

// Main component
export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [formData, setFormData] = useState<FormData>({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const { strength, updateStrength } = usePasswordStrength();
  const { isValid, isValidating, error: tokenError } = useTokenValidation(token, email);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setFormData(prev => ({ ...prev, password: newPassword }));
    updateStrength(newPassword);
  }, [updateStrength]);

  const handleConfirmPasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, confirmPassword: e.target.value }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token || !email) {
      setError('Invalid reset link. Please request a new password reset.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!strength.isValid) {
      setError('Password does not meet requirements');
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await apiService.resetPassword(token, email, formData.password);
      
      if (response.error) {
        setError(response.error);
      } else {
        navigate('/password/reset-success');
      }
    } catch (error) {
      let errorMessage = 'Failed to reset password. Please try again.';
      
      if (error instanceof ValidationError) {
        errorMessage = error.message;
      } else if (error instanceof NetworkError) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error instanceof ApiError) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [token, email, formData, strength.isValid, navigate]);

  // Show loading state while validating token
  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Validating reset link...</p>
        </div>
      </div>
    );
  }

  // Show error if token is invalid
  if (!isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Reset Password</h2>
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <p className="text-red-800">{tokenError}</p>
              {process.env.NODE_ENV === 'development' && token && email && (
                <p className="text-sm text-red-600 mt-2">
                  Development Mode: Reset URL - http://localhost:5173/password/reset?token={token}&email={email}
                </p>
              )}
            </div>
            <p className="text-gray-600 mb-6">
              The password reset link is invalid or has expired. Please request a new one.
            </p>
            <Link
              to="/password/forgot"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Request New Reset Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Main content */}
      <div className="flex flex-1 items-center justify-center px-4 py-4 min-h-0">
        <div className="flex flex-col lg:flex-row w-full max-w-7xl bg-white rounded-lg overflow-hidden">
          {/* Left Image */}
          <div className="w-full lg:w-2/3 flex justify-center items-center p-6 pr-16">
            <img src={loginImg} alt="Login visual" className="w-full h-auto max-h-[450px] object-cover rounded-lg" />
          </div>

          {/* Right Form */}
          <div className="w-full lg:w-1/2 p-8 flex flex-col justify-center">
            <div className="mb-8">
              <h2 className="text-4xl font-nunito font-bold text-[#3A3A3A] mb-6">Reset Password</h2>
              <p className="text-gray-600 mb-6 font-nunito text-base">
                Enter your new password below
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="font-nunito font-semibold text-[#3A3A3A]">
                  New Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handlePasswordChange}
                  className="p-4 rounded-lg border border-gray-300 font-nunito focus:outline-none focus:border-[#082368]"
                  placeholder="Enter your new password"
                  disabled={loading}
                />
                
                {/* Password strength indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getStrengthBarColor(strength.score)}`}
                          style={{ width: `${(strength.score / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span className={`text-xs font-medium ${getStrengthColor(strength.score)}`}>
                        {strength.score}/5
                      </span>
                    </div>
                    <p className={`text-xs ${getStrengthColor(strength.score)}`}>
                      {strength.feedback}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="confirmPassword" className="font-nunito font-semibold text-[#3A3A3A]">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className="p-4 rounded-lg border border-gray-300 font-nunito focus:outline-none focus:border-[#082368]"
                  placeholder="Confirm your new password"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !strength.isValid || formData.password !== formData.confirmPassword}
                className="w-full bg-[#082368] text-white py-4 px-6 rounded-lg font-nunito font-semibold hover:bg-[#061a4a] focus:outline-none focus:ring-2 focus:ring-[#082368] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Resetting Password...
                  </div>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>

            <div className="text-center mt-6">
              <Link
                to="/login"
                className="text-[#082368] hover:text-[#061a4a] font-nunito font-semibold"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 