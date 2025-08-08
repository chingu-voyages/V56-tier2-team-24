import React from 'react';

interface ErrorMessageProps {
  error: string;
  variant?: 'error' | 'warning' | 'info';
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  error, 
  variant = 'error',
  className = ''
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'error':
      default:
        return 'bg-red-50 border-red-200 text-red-800';
    }
  };

  if (!error) return null;

  return (
    <div className={`border rounded-md p-4 ${getVariantStyles()} ${className}`}>
      <p className="text-sm">{error}</p>
    </div>
  );
};

export default ErrorMessage; 