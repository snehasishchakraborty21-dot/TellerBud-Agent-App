import React, { useState } from 'react';
import { TellerBudLogo } from '../components/TellerBudLogo';
import { TellerBudTextField } from '../components/ui/TellerBudTextField';
import { TellerBudPasscodeField } from '../components/ui/TellerBudPasscodeField';
import { TellerBudPrimaryButton } from '../components/ui/TellerBudPrimaryButton';
import { TellerBudInlineMessage } from '../components/ui/TellerBudInlineMessage';
import { AuthState, FieldErrors } from '../types';
import { getActiveAgentPasscode, DEFAULT_AGENT_ID } from '../utils/authConfig';

interface AgentLoginScreenProps {
  onSuccessNavigate?: (agentId: string) => void;
  forcedAuthState?: AuthState;
}

export const AgentLoginScreen: React.FC<AgentLoginScreenProps> = ({
  onSuccessNavigate,
  forcedAuthState,
}) => {
  const [agentId, setAgentId] = useState('');
  const [passcode, setPasscode] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<{ agentId?: boolean; passcode?: boolean }>({});
  const [authState, setAuthState] = useState<AuthState>(forcedAuthState || 'idle');

  const currentAuthState = forcedAuthState !== undefined ? forcedAuthState : authState;

  // Validate fields
  const validate = (idVal: string, passVal: string): FieldErrors => {
    const errs: FieldErrors = {};
    if (!idVal.trim()) {
      errs.agentId = 'Enter your Agent ID.';
    }
    if (!passVal) {
      errs.passcode = 'Enter your passcode.';
    }
    return errs;
  };

  const handleAgentIdChange = (val: string) => {
    setAgentId(val);
    if (currentAuthState !== 'idle' && currentAuthState !== 'submitting') {
      setAuthState('idle');
    }
    if (touched.agentId) {
      setErrors((prev) => ({
        ...prev,
        agentId: val.trim() ? undefined : 'Enter your Agent ID.',
      }));
    }
  };

  const handlePasscodeChange = (val: string) => {
    setPasscode(val);
    if (currentAuthState !== 'idle' && currentAuthState !== 'submitting') {
      setAuthState('idle');
    }
    if (touched.passcode) {
      setErrors((prev) => ({
        ...prev,
        passcode: val ? undefined : 'Enter your passcode.',
      }));
    }
  };

  const handleAgentIdBlur = () => {
    setTouched((prev) => ({ ...prev, agentId: true }));
    if (!agentId.trim()) {
      setErrors((prev) => ({ ...prev, agentId: 'Enter your Agent ID.' }));
    }
  };

  const handlePasscodeBlur = () => {
    setTouched((prev) => ({ ...prev, passcode: true }));
    if (!passcode) {
      setErrors((prev) => ({ ...prev, passcode: 'Enter your passcode.' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedId = agentId.trim();
    const validationErrors = validate(trimmedId, passcode);

    setTouched({ agentId: true, passcode: true });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setAuthState('submitting');

    // Simulate authentication handling with centralized passcode validation
    setTimeout(() => {
      const lowerId = trimmedId.toLowerCase();
      const upperId = trimmedId.toUpperCase();
      const activePasscode = getActiveAgentPasscode();

      if (lowerId === 'offline' || lowerId === 'net') {
        setAuthState('connectivity_error');
      } else if (lowerId === 'inactive' || lowerId === 'disabled') {
        setAuthState('account_inactive');
      } else if (lowerId === 'nobooth' || lowerId === 'unassigned') {
        setAuthState('missing_assignment');
      } else if (upperId === DEFAULT_AGENT_ID && passcode === activePasscode) {
        setAuthState('success');
        if (onSuccessNavigate) {
          onSuccessNavigate(DEFAULT_AGENT_ID);
        }
      } else {
        // Any mismatch in Agent ID or Passcode fails with general invalid_credentials
        setAuthState('invalid_credentials');
      }
    }, 1000);
  };

  const isFormValid = agentId.trim().length > 0 && passcode.length > 0;
  const isSubmitting = currentAuthState === 'submitting';

  return (
    <div className="w-full h-full min-h-full bg-white flex flex-col justify-between overflow-hidden px-5 py-3 sm:px-6 sm:py-4 text-slate-900 select-none">
      {/* Main Content Group */}
      <div className="w-full max-w-sm mx-auto flex flex-col items-center my-auto">
        {/* Brand Area */}
        <div className="flex flex-col items-center text-center mb-3">
          <TellerBudLogo size="lg" className="w-24 h-24 mb-2 drop-shadow-xs" />
          <h1 className="text-[#001A41] text-[22px] sm:text-2xl font-bold tracking-tight">
            TellerBud
          </h1>
        </div>

        {/* Section Heading */}
        <div className="w-full text-left mb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-0.5">Agent Sign In</h2>
          <p className="text-slate-500 text-xs sm:text-sm">Sign in to start your work session.</p>
        </div>

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2.5">
          {/* Status Message (if any failure state active) */}
          {currentAuthState !== 'idle' &&
            currentAuthState !== 'submitting' &&
            currentAuthState !== 'success' && (
              <TellerBudInlineMessage type={currentAuthState} />
            )}

          {/* Credential Fields */}
          <div className="flex flex-col gap-2.5">
            <TellerBudTextField
              label="Agent ID"
              value={agentId}
              onChangeValue={handleAgentIdChange}
              onBlur={handleAgentIdBlur}
              error={errors.agentId}
              disabled={isSubmitting}
              placeholder="Enter your Agent ID"
            />

            <TellerBudPasscodeField
              label="Passcode"
              value={passcode}
              onChangeValue={handlePasscodeChange}
              onBlur={handlePasscodeBlur}
              error={errors.passcode}
              disabled={isSubmitting}
              placeholder="Enter your passcode"
            />
          </div>

          {/* Primary CTA */}
          <div className="pt-1">
            <TellerBudPrimaryButton
              type="submit"
              isLoading={isSubmitting}
              isDisabled={!isFormValid || isSubmitting}
            >
              Sign In
            </TellerBudPrimaryButton>
          </div>

          {/* Account / Assignment Information */}
          <div className="pt-0.5">
            <TellerBudInlineMessage type="managed_account" />
          </div>
        </form>
      </div>
    </div>
  );
};
