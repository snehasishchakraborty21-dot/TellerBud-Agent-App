import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface TellerBudPasscodeFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  value: string;
  onChangeValue: (val: string) => void;
  error?: string;
  id?: string;
  isRequired?: boolean;
  showRequiredIndicator?: boolean;
  requiredLabel?: boolean;
}

export const TellerBudPasscodeField: React.FC<TellerBudPasscodeFieldProps> = ({
  label,
  value,
  onChangeValue,
  error,
  id = 'agent-passcode-input',
  placeholder = '••••••',
  disabled = false,
  isRequired = false,
  showRequiredIndicator = false,
  requiredLabel = false,
  onBlur,
  ...props
}) => {
  const [showPasscode, setShowPasscode] = useState(false);

  const toggleVisibility = () => {
    setShowPasscode((prev) => !prev);
  };

  return (
    <div className="w-full flex flex-col gap-1">
      <div className="flex items-center justify-between ml-0.5 select-none">
        <label
          htmlFor={id}
          className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center"
        >
          <span>{label}</span>
          {(isRequired || requiredLabel) && (
            <span className="text-red-500 font-bold ml-1 text-sm leading-none">*</span>
          )}
        </label>

        {showRequiredIndicator && (
          <span className="text-[11px] font-semibold text-red-600 animate-fadeIn">
            Required
          </span>
        )}
      </div>

      <div className="relative w-full flex items-center">
        <div className="absolute left-3.5 inset-y-0 flex items-center pointer-events-none text-slate-400">
          <Lock className="w-5 h-5 text-slate-400 stroke-[2]" />
        </div>

        <input
          id={id}
          type={showPasscode ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChangeValue(e.target.value)}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete="current-password"
          inputMode="numeric"
          className={`
            w-full h-[50px] min-h-[48px] pl-11 pr-12 rounded-xl text-[14.5px] font-medium text-slate-900 bg-slate-50
            placeholder:text-slate-400 placeholder:font-normal
            border transition-all duration-150 ease-in-out focus:outline-none
            ${
              error || showRequiredIndicator
                ? 'border-red-500 ring-2 ring-red-100 text-red-950 bg-red-50/20'
                : 'border-slate-200 focus:border-[#0052CC] focus:bg-white focus:ring-2 focus:ring-[#0052CC]/15 hover:border-slate-300'
            }
            ${disabled ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : ''}
          `}
          {...props}
        />

        <button
          type="button"
          onClick={toggleVisibility}
          disabled={disabled}
          tabIndex={0}
          aria-label={showPasscode ? 'Hide passcode' : 'Show passcode'}
          title={showPasscode ? 'Hide passcode' : 'Show passcode'}
          className="absolute right-3.5 inset-y-0 flex items-center justify-center text-[#0052CC] hover:text-[#0041a3] p-1.5 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0052CC]"
        >
          {showPasscode ? (
            <EyeOff className="w-5 h-5 stroke-[2]" />
          ) : (
            <Eye className="w-5 h-5 stroke-[2]" />
          )}
        </button>
      </div>

      {error ? (
        <p className="text-[12px] leading-tight font-medium text-red-600 pl-0.5 pt-0.5 animate-fadeIn flex items-center gap-1">
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
};
