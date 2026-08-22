import React from 'react';
import { TellerBudLoadingIndicator } from './TellerBudLoadingIndicator';

interface TellerBudPrimaryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading?: boolean;
  isDisabled?: boolean;
  className?: string;
}

export const TellerBudPrimaryButton: React.FC<TellerBudPrimaryButtonProps> = ({
  children,
  isLoading = false,
  isDisabled = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const disabled = isDisabled || isLoading;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        relative w-full h-[50px] min-h-[48px] px-6 rounded-xl font-bold text-[15px] tracking-wide
        flex items-center justify-center gap-2.5 transition-all duration-150 ease-in-out select-none
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0052CC] focus-visible:ring-offset-2
        ${
          disabled
            ? 'bg-slate-200 text-slate-400 border border-slate-200 shadow-none cursor-not-allowed'
            : 'bg-[#0052CC] hover:bg-[#0041a3] active:scale-[0.98] text-white shadow-md shadow-blue-200'
        }
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <TellerBudLoadingIndicator size="md" color="white" />
          <span>Signing in...</span>
        </span>
      ) : (
        <span>{children}</span>
      )}
    </button>
  );
};
