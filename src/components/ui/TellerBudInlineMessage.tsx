import React from 'react';
import { AlertCircle, WifiOff, ShieldAlert, FileQuestion, Building2 } from 'lucide-react';
import { AuthState } from '../../types';

interface TellerBudInlineMessageProps {
  type: AuthState | 'managed_account';
  customText?: string;
  className?: string;
}

export const TellerBudInlineMessage: React.FC<TellerBudInlineMessageProps> = ({
  type,
  customText,
  className = '',
}) => {
  if (type === 'idle' || type === 'submitting' || type === 'success') {
    return null;
  }

  let icon = <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />;
  let containerStyles = 'bg-red-50 border-red-200 text-red-800';
  let defaultText = '';

  switch (type) {
    case 'invalid_credentials':
      icon = <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />;
      containerStyles = 'bg-red-50/80 border-red-200/80 text-red-900';
      defaultText = 'Incorrect Agent ID or passcode.';
      break;

    case 'connectivity_error':
      icon = <WifiOff className="w-5 h-5 shrink-0 text-amber-600" />;
      containerStyles = 'bg-amber-50/80 border-amber-200/80 text-amber-900';
      defaultText = 'Unable to connect. Check your connection and try again.';
      break;

    case 'account_inactive':
      icon = <ShieldAlert className="w-5 h-5 shrink-0 text-slate-600" />;
      containerStyles = 'bg-slate-100/90 border-slate-200 text-slate-800';
      defaultText =
        'Your TellerBud access is currently unavailable. Please contact your business administrator.';
      break;

    case 'missing_assignment':
      icon = <FileQuestion className="w-5 h-5 shrink-0 text-slate-600" />;
      containerStyles = 'bg-slate-100/90 border-slate-200 text-slate-800';
      defaultText =
        'No active work assignment was found. Please contact your business administrator.';
      break;

    case 'managed_account':
      icon = <Building2 className="w-4 h-4 shrink-0 text-slate-500" />;
      containerStyles = 'bg-slate-50 border-slate-200/80 text-slate-600';
      defaultText =
        'Your TellerBud access and work assignment are managed by your business administrator.';
      break;
  }

  const messageText = customText || defaultText;

  if (type === 'managed_account') {
    return (
      <div
        className={`w-full p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-center transition-all ${className}`}
      >
        <p className="text-[12px] leading-relaxed text-slate-500">
          Your <span className="font-semibold text-slate-700">TellerBud</span> access and work assignment are managed by your business administrator.
        </p>
      </div>
    );
  }

  return (
    <div
      role="alert"
      className={`w-full p-3.5 rounded-xl border flex items-start gap-3 text-[13px] leading-snug font-medium transition-all duration-150 animate-fadeIn ${containerStyles} ${className}`}
    >
      {icon}
      <p className="flex-1">{messageText}</p>
    </div>
  );
};
