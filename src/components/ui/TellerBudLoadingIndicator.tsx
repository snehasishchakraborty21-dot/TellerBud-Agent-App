import React from 'react';

interface TellerBudLoadingIndicatorProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: 'white' | 'blue' | 'slate';
}

export const TellerBudLoadingIndicator: React.FC<TellerBudLoadingIndicatorProps> = ({
  size = 'md',
  className = '',
  color = 'white',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 stroke-[3]',
    md: 'w-5 h-5 stroke-[2.5]',
    lg: 'w-6 h-6 stroke-[2]',
  };

  const colorClasses = {
    white: 'text-white/30 stroke-white',
    blue: 'text-blue-200 stroke-blue-600',
    slate: 'text-slate-200 stroke-slate-600',
  };

  return (
    <svg
      className={`animate-spin ${sizeClasses[size]} ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Loading indicator"
      role="status"
    >
      <circle
        className={colorClasses[color].split(' ')[0]}
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
      />
      <path
        className={colorClasses[color].split(' ')[1]}
        d="M12 2C6.47715 2 2 6.47715 2 12C2 14.238 2.7358 16.304 3.98038 17.9733"
        strokeLinecap="round"
      />
    </svg>
  );
};
