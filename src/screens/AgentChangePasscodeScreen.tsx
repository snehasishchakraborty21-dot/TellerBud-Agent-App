import React, { useState, useEffect } from 'react';
import { TellerBudLogo } from '../components/TellerBudLogo';
import { TellerBudPasscodeField } from '../components/ui/TellerBudPasscodeField';
import { TellerBudPrimaryButton } from '../components/ui/TellerBudPrimaryButton';
import {
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  WifiOff,
  HelpCircle,
  RefreshCw,
} from 'lucide-react';
import { AgentChangePasscodePreviewState, FieldErrors } from '../types';
import { PoweredByCinitecFooter } from '../components/PoweredByCinitecFooter';
import {
  validatePasscodePolicy,
  setActiveAgentPasscode,
} from '../utils/authConfig';

interface AgentChangePasscodeScreenProps {
  previewState?: AgentChangePasscodePreviewState;
  agentId?: string;
  onBackToMore?: () => void;
  onSuccess?: () => void;
}

export const AgentChangePasscodeScreen: React.FC<AgentChangePasscodeScreenProps> = ({
  previewState = 'default',
  agentId,
  onBackToMore,
  onSuccess,
}) => {
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [statusUnknown, setStatusUnknown] = useState(false);

  // Form validity check: exactly 4 numeric digits and matching confirm passcode
  const isFormValid =
    newPasscode.length === 4 &&
    /^\d{4}$/.test(newPasscode) &&
    confirmPasscode.length === 4 &&
    /^\d{4}$/.test(confirmPasscode) &&
    newPasscode === confirmPasscode;

  // Sync with preview state
  useEffect(() => {
    if (previewState === 'validation_error') {
      setNewPasscode('12');
      setConfirmPasscode('');
      setSubmitted(true);
      setErrors({
        newPasscode: 'Passcode must contain 4 digits.',
        confirmPasscode: 'Required',
      });
      setIsSuccess(false);
      setIsSaving(false);
      setConnectionError(false);
      setStatusUnknown(false);
    } else if (previewState === 'mismatch_error') {
      setNewPasscode('1234');
      setConfirmPasscode('4321');
      setSubmitted(true);
      setErrors({
        confirmPasscode: 'Passcodes do not match',
      });
      setIsSuccess(false);
      setIsSaving(false);
      setConnectionError(false);
      setStatusUnknown(false);
    } else if (previewState === 'saving') {
      setNewPasscode('5678');
      setConfirmPasscode('5678');
      setIsSaving(true);
      setIsSuccess(false);
      setConnectionError(false);
      setStatusUnknown(false);
      setErrors({});
    } else if (previewState === 'passcode_updated') {
      setIsSuccess(true);
      setIsSaving(false);
      setConnectionError(false);
      setStatusUnknown(false);
      setErrors({});
    } else if (previewState === 'connection_issue') {
      setNewPasscode('5678');
      setConfirmPasscode('5678');
      setConnectionError(true);
      setIsSuccess(false);
      setIsSaving(false);
      setStatusUnknown(false);
      setErrors({});
    } else if (previewState === 'status_unknown') {
      setNewPasscode('5678');
      setConfirmPasscode('5678');
      setStatusUnknown(true);
      setConnectionError(false);
      setIsSuccess(false);
      setIsSaving(false);
      setErrors({});
    } else {
      // Default: Clean blank form
      setNewPasscode('');
      setConfirmPasscode('');
      setErrors({});
      setSubmitted(false);
      setIsSaving(false);
      setIsSuccess(false);
      setConnectionError(false);
      setStatusUnknown(false);
    }
  }, [previewState]);

  const handleNewPasscodeChange = (rawVal: string) => {
    // Sanitize input: only digits, max 4 chars
    const val = rawVal.replace(/\D/g, '').slice(0, 4);
    setNewPasscode(val);
    if (connectionError) setConnectionError(false);
    if (statusUnknown) setStatusUnknown(false);

    if (submitted) {
      if (!val) {
        setErrors((prev) => ({ ...prev, newPasscode: 'Required' }));
      } else if (val.length !== 4) {
        setErrors((prev) => ({ ...prev, newPasscode: 'Passcode must contain 4 digits.' }));
      } else {
        setErrors((prev) => ({ ...prev, newPasscode: undefined }));
      }

      // Revalidate match if confirm is filled
      if (confirmPasscode && val !== confirmPasscode) {
        setErrors((prev) => ({ ...prev, confirmPasscode: 'Passcodes do not match' }));
      } else if (confirmPasscode && val === confirmPasscode) {
        setErrors((prev) => ({ ...prev, confirmPasscode: undefined }));
      }
    }
  };

  const handleConfirmPasscodeChange = (rawVal: string) => {
    // Sanitize input: only digits, max 4 chars
    const val = rawVal.replace(/\D/g, '').slice(0, 4);
    setConfirmPasscode(val);
    if (connectionError) setConnectionError(false);
    if (statusUnknown) setStatusUnknown(false);

    if (submitted) {
      if (!val) {
        setErrors((prev) => ({ ...prev, confirmPasscode: 'Required' }));
      } else if (val.length !== 4) {
        setErrors((prev) => ({ ...prev, confirmPasscode: 'Passcode must contain 4 digits.' }));
      } else if (val !== newPasscode) {
        setErrors((prev) => ({ ...prev, confirmPasscode: 'Passcodes do not match' }));
      } else {
        setErrors((prev) => ({ ...prev, confirmPasscode: undefined }));
      }
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const nextErrors: FieldErrors = {};

    // 1. Mandatory 4-digit validation
    if (!newPasscode) {
      nextErrors.newPasscode = 'Required';
    } else if (newPasscode.length !== 4 || !/^\d{4}$/.test(newPasscode)) {
      nextErrors.newPasscode = 'Passcode must contain 4 digits.';
    }

    if (!confirmPasscode) {
      nextErrors.confirmPasscode = 'Required';
    } else if (confirmPasscode.length !== 4 || !/^\d{4}$/.test(confirmPasscode)) {
      nextErrors.confirmPasscode = 'Passcode must contain 4 digits.';
    } else if (newPasscode && confirmPasscode && newPasscode !== confirmPasscode) {
      nextErrors.confirmPasscode = 'Passcodes do not match';
    }

    if (Object.keys(nextErrors).length > 0 || !isFormValid) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSaving(true);
    setConnectionError(false);
    setStatusUnknown(false);

    // Simulate save request
    setTimeout(() => {
      setIsSaving(false);
      // Persist the new active credential
      setActiveAgentPasscode(newPasscode);
      setIsSuccess(true);
      if (onSuccess) onSuccess();
    }, 1000);
  };

  const handleBack = () => {
    // Reset state and return to More
    setNewPasscode('');
    setConfirmPasscode('');
    setErrors({});
    setSubmitted(false);
    if (onBackToMore) onBackToMore();
  };

  return (
    <div className="w-full h-full min-h-full bg-slate-50 flex flex-col justify-between overflow-hidden select-none">
      {/* 1. Top App Header */}
      <header className="bg-[#001A41] text-white px-3 py-2.5 flex items-center justify-between shadow-md shrink-0 z-20">
        <button
          onClick={handleBack}
          className="flex items-center gap-1 text-xs font-semibold text-slate-200 hover:text-white transition-colors py-1 px-1.5 -ml-1 rounded active:bg-white/10"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <h1 className="text-sm font-bold tracking-tight text-white">Change Passcode</h1>

        <div className="flex items-center justify-center shrink-0">
          <TellerBudLogo size="sm" className="drop-shadow-xs" />
        </div>
      </header>

      {/* 2. Scrollable Body Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5 flex flex-col justify-start">
        {/* Success View State */}
        {isSuccess ? (
          <div className="my-auto flex flex-col items-center text-center py-6 px-2 animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 shadow-sm border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h2 className="text-lg font-bold text-slate-900 mb-1">Passcode updated</h2>
            <p className="text-xs text-slate-600 max-w-[250px] mb-6 leading-relaxed">
              Your new passcode has been saved. Use it the next time you sign in to TellerBud.
            </p>

            <div className="w-full max-w-xs">
              <TellerBudPrimaryButton onClick={handleBack}>
                Back to More
              </TellerBudPrimaryButton>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Header / Instructions */}
            <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                Passcode Security
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Create a new passcode for your TellerBud sign-in.
              </p>
            </div>

            {/* Connection Issue Inline Banner */}
            {connectionError && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-rose-900 flex items-start gap-2.5 shadow-sm animate-fadeIn">
                <WifiOff className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold">Unable to update passcode</div>
                  <div className="text-[11px] text-rose-700 mt-0.5">
                    Check your connection and try again.
                  </div>
                </div>
              </div>
            )}

            {/* Status Unknown Inline Banner */}
            {statusUnknown && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-900 flex items-start gap-2.5 shadow-sm animate-fadeIn">
                <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold">Passcode update status not confirmed</div>
                  <div className="text-[11px] text-amber-800 mt-0.5">
                    We couldn't confirm if your passcode was updated. Check status before trying again.
                  </div>
                </div>
              </div>
            )}

            {/* Change Passcode Form */}
            <form onSubmit={handleSave} className="flex flex-col gap-3.5">
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col gap-3.5">
                {/* Field 1: New Passcode */}
                <TellerBudPasscodeField
                  id="new-passcode-field"
                  label="New Passcode"
                  value={newPasscode}
                  onChangeValue={handleNewPasscodeChange}
                  error={errors.newPasscode}
                  isRequired={true}
                  showRequiredIndicator={submitted && !newPasscode}
                  placeholder="Enter 4-digit passcode"
                  maxLength={4}
                  inputMode="numeric"
                  disabled={isSaving}
                />

                {/* Field 2: Confirm Passcode */}
                <TellerBudPasscodeField
                  id="confirm-passcode-field"
                  label="Confirm Passcode"
                  value={confirmPasscode}
                  onChangeValue={handleConfirmPasscodeChange}
                  error={errors.confirmPasscode}
                  isRequired={true}
                  showRequiredIndicator={submitted && !confirmPasscode}
                  placeholder="Re-enter 4-digit passcode"
                  maxLength={4}
                  inputMode="numeric"
                  disabled={isSaving}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-1">
                <TellerBudPrimaryButton
                  type="submit"
                  isLoading={isSaving}
                  isDisabled={isSaving || !isFormValid}
                  loadingText="Updating Passcode"
                >
                  Update Passcode
                </TellerBudPrimaryButton>

                {connectionError && (
                  <button
                    type="button"
                    onClick={handleSave}
                    className="w-full py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Retry</span>
                  </button>
                )}

                {statusUnknown && (
                  <button
                    type="button"
                    onClick={() => {
                      setStatusUnknown(false);
                      setIsSuccess(true);
                    }}
                    className="w-full py-2.5 rounded-xl border border-amber-300 bg-amber-50/60 text-xs font-bold text-amber-900 hover:bg-amber-100 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Check Status</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        <PoweredByCinitecFooter className="py-2" />
      </div>
    </div>
  );
};
