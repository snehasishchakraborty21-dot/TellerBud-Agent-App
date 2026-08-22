import React from 'react';
import { UserCheck } from 'lucide-react';

interface TellerBudTextFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  value: string;
  onChangeValue: (val: string) => void;
  error?: string;
  id?: string;
}

export const TellerBudTextField: React.FC<TellerBudTextFieldProps> = ({
  label,
  value,
  onChangeValue,
  error,
  id = 'agent-id-input',
  placeholder = 'e.g. AGT-8402',
  disabled = false,
  onBlur,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeValue(e.target.value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Auto-trim trailing/leading whitespace on blur for agent ID
    onChangeValue(e.target.value.trim());
    if (onBlur) {
      onBlur(e);
    }
  };

  return (
    <div className="w-full flex flex-col gap-1">
      <label
        htmlFor={id}
        className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-0.5 select-none flex items-center justify-between"
      >
        <span>{label}</span>
      </label>

      <div className="relative w-full flex items-center">
        <div className="absolute left-3.5 inset-y-0 flex items-center pointer-events-none text-slate-400">
          <UserCheck className="w-5 h-5 text-slate-400 stroke-[2]" />
        </div>

        <input
          id={id}
          type="text"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete="username"
          autoCorrect="off"
          autoCapitalize="characters"
          className={`
            w-full h-[50px] min-h-[48px] pl-11 pr-4 rounded-xl text-[14.5px] font-medium text-slate-900 bg-slate-50
            placeholder:text-slate-400 placeholder:font-normal
            border transition-all duration-150 ease-in-out focus:outline-none
            ${
              error
                ? 'border-red-500 ring-2 ring-red-100 text-red-950 bg-red-50/20'
                : 'border-slate-200 focus:border-[#0052CC] focus:bg-white focus:ring-2 focus:ring-[#0052CC]/15 hover:border-slate-300'
            }
            ${disabled ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : ''}
          `}
          {...props}
        />
      </div>

      {error ? (
        <p className="text-[12px] leading-tight font-medium text-red-600 pl-0.5 pt-0.5 animate-fadeIn flex items-center gap-1">
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
};
