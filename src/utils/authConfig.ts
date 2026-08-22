/**
 * Centralized Authentication & Passcode Security Configuration
 * 
 * Configured for the Google AI Studio interactive UI/UX prototype:
 * Default Valid Review Account:
 * Agent ID: AG-88421 (Marcus Vance)
 * Passcode: 1234
 */

export interface PasscodeSecurityConfig {
  passcodeLength?: number;
  numericOnly?: boolean;
  minimumLength?: number;
  maximumLength?: number;
}

export const DEFAULT_PASSCODE_SECURITY_CONFIG: PasscodeSecurityConfig = {
  passcodeLength: 4,
  numericOnly: true,
  minimumLength: 4,
  maximumLength: 4,
};

export const DEFAULT_AGENT_ID = 'AG-88421';
export const DEFAULT_AGENT_NAME = 'Marcus Vance';
export const DEFAULT_AGENT_PASSCODE = '1234';

/**
 * Validates a passcode against the security policy configuration.
 */
export function validatePasscodePolicy(
  passcode: string,
  config: PasscodeSecurityConfig = DEFAULT_PASSCODE_SECURITY_CONFIG
): { isValid: boolean; errorMessage?: string } {
  if (!passcode) {
    return { isValid: false, errorMessage: 'Enter your passcode.' };
  }

  if (config.numericOnly && !/^\d+$/.test(passcode)) {
    return {
      isValid: false,
      errorMessage: config.passcodeLength
        ? `Passcode must contain ${config.passcodeLength} digits.`
        : 'Passcode must contain numbers only.',
    };
  }

  if (config.passcodeLength && passcode.length !== config.passcodeLength) {
    return {
      isValid: false,
      errorMessage: `Passcode must contain ${config.passcodeLength} digits.`,
    };
  }

  if (config.minimumLength && passcode.length < config.minimumLength) {
    return {
      isValid: false,
      errorMessage: `Passcode must be at least ${config.minimumLength} digits.`,
    };
  }

  if (config.maximumLength && passcode.length > config.maximumLength) {
    return {
      isValid: false,
      errorMessage: `Passcode must not exceed ${config.maximumLength} digits.`,
    };
  }

  return { isValid: true };
}

// In-memory active passcode store for prototype session lifecycle
let activeAgentPasscode = DEFAULT_AGENT_PASSCODE;

export function getActiveAgentPasscode(): string {
  return activeAgentPasscode;
}

export function setActiveAgentPasscode(newPasscode: string): void {
  activeAgentPasscode = newPasscode;
}

export function resetPasscodeStore(): void {
  activeAgentPasscode = DEFAULT_AGENT_PASSCODE;
}
