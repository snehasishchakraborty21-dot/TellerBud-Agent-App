export interface OperatingCountryConfig {
  code: string; // ISO 2-letter code e.g. 'NG'
  name: string; // 'Nigeria'
  callingCode: string; // '+234'
  currencyCode: string; // 'NGN'
  currencySymbol: string; // '₦'
  phonePlaceholder: string; // '0801 234 5678'
  samplePhoneNumber: string; // '0803 123 4567'
  phoneDigitsCount: number | number[]; // e.g. 10 or 11 digits
  // Validation function for domestic or international input
  validatePhone: (input: string) => boolean;
  // Format entered number for clean display
  formatPhoneInput: (input: string) => string;
  // Normalization for transaction record storage
  normalizePhone: (input: string) => string;
}

export const OPERATING_COUNTRIES: Record<string, OperatingCountryConfig> = {
  NG: {
    code: 'NG',
    name: 'Nigeria',
    callingCode: '+234',
    currencyCode: 'NGN',
    currencySymbol: '₦',
    phonePlaceholder: '0801 234 5678',
    samplePhoneNumber: '0803 123 4567',
    phoneDigitsCount: [10, 11],
    validatePhone: (input: string): boolean => {
      if (!input) return false;
      const clean = input.replace(/[\s\-()]/g, '');
      // Accepts:
      // 1. Local format: 070..., 080..., 081..., 090..., 091... (11 digits starting with 0)
      if (/^0[789]\d{9}$/.test(clean)) return true;
      // 2. 10-digit subscriber format without leading trunk zero: 80XXXXXXXX, 70XXXXXXXX, 90XXXXXXXX, 81XXXXXXXX, 91XXXXXXXX
      if (/^[789]\d{9}$/.test(clean)) return true;
      // 3. International format: +234XXXXXXXXXX or 234XXXXXXXXXX (with optional trunk 0)
      if (/^\+?2340?[789]\d{9}$/.test(clean)) return true;
      return false;
    },
    formatPhoneInput: (input: string): string => {
      return input.replace(/[^\d+]/g, '');
    },
    normalizePhone: (input: string): string => {
      const clean = input.replace(/[\s\-()]/g, '');
      let digits = clean;
      if (digits.startsWith('+234')) {
        digits = digits.slice(4);
      } else if (digits.startsWith('234')) {
        digits = digits.slice(3);
      }
      if (digits.startsWith('0')) {
        digits = digits.slice(1);
      }
      if (digits.length === 10) {
        return `+234 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
      }
      return `+234 ${digits}`;
    },
  },
  ZM: {
    code: 'ZM',
    name: 'Zambia',
    callingCode: '+260',
    currencyCode: 'ZMW',
    currencySymbol: 'ZMW',
    phonePlaceholder: '970 000 000',
    samplePhoneNumber: '970000000',
    phoneDigitsCount: [9, 10],
    validatePhone: (input: string): boolean => {
      if (!input) return false;
      const clean = input.replace(/[\s\-()]/g, '');
      // Accepts:
      // 1. 9-digit subscriber format: 97XXXXXXX, 96XXXXXXX, 95XXXXXXX, 77XXXXXXX, 76XXXXXXX, 75XXXXXXX
      if (/^[79]\d{8}$/.test(clean)) return true;
      // 2. 10-digit local format with trunk 0: 097XXXXXXX, 096XXXXXXX, 077XXXXXXX, etc.
      if (/^0[79]\d{8}$/.test(clean)) return true;
      // 3. International format: +260XXXXXXXXX or 260XXXXXXXXX (with optional trunk 0)
      if (/^\+?2600?[79]\d{8}$/.test(clean)) return true;
      return false;
    },
    formatPhoneInput: (input: string): string => {
      return input.replace(/[^\d+]/g, '');
    },
    normalizePhone: (input: string): string => {
      const clean = input.replace(/[\s\-()]/g, '');
      let digits = clean;
      if (digits.startsWith('+260')) {
        digits = digits.slice(4);
      } else if (digits.startsWith('260')) {
        digits = digits.slice(3);
      }
      if (digits.startsWith('0')) {
        digits = digits.slice(1);
      }
      if (digits.length === 9) {
        return `+260 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
      }
      return `+260 ${digits}`;
    },
  },
  GH: {
    code: 'GH',
    name: 'Ghana',
    callingCode: '+233',
    currencyCode: 'GHS',
    currencySymbol: 'GH₵',
    phonePlaceholder: '024 123 4567',
    samplePhoneNumber: '024 123 4567',
    phoneDigitsCount: [9, 10],
    validatePhone: (input: string): boolean => {
      if (!input) return false;
      const clean = input.replace(/[\s\-()]/g, '');
      // 9 digits subscriber (e.g. 241234567, 541234567, 201234567)
      if (/^[25]\d{8}$/.test(clean)) return true;
      // 10 digits local (e.g. 0241234567, 0541234567, 0201234567)
      if (/^0[25]\d{8}$/.test(clean)) return true;
      // International format: +233XXXXXXXXX or 233XXXXXXXXX (with optional trunk 0)
      if (/^\+?2330?[25]\d{8}$/.test(clean)) return true;
      return false;
    },
    formatPhoneInput: (input: string): string => {
      return input.replace(/[^\d+]/g, '');
    },
    normalizePhone: (input: string): string => {
      const clean = input.replace(/[\s\-()]/g, '');
      let digits = clean;
      if (digits.startsWith('+233')) {
        digits = digits.slice(4);
      } else if (digits.startsWith('233')) {
        digits = digits.slice(3);
      }
      if (digits.startsWith('0')) {
        digits = digits.slice(1);
      }
      if (digits.length === 9) {
        return `+233 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
      }
      return `+233 ${digits}`;
    },
  },
  KE: {
    code: 'KE',
    name: 'Kenya',
    callingCode: '+254',
    currencyCode: 'KES',
    currencySymbol: 'KSh',
    phonePlaceholder: '0712 345 678',
    samplePhoneNumber: '0712 345 678',
    phoneDigitsCount: [9, 10],
    validatePhone: (input: string): boolean => {
      if (!input) return false;
      const clean = input.replace(/[\s\-()]/g, '');
      // 9 digits subscriber (e.g. 712345678, 112345678)
      if (/^[17]\d{8}$/.test(clean)) return true;
      // 10 digits local (e.g. 0712345678, 0112345678)
      if (/^0[17]\d{8}$/.test(clean)) return true;
      // International format: +254XXXXXXXXX or 254XXXXXXXXX (with optional trunk 0)
      if (/^\+?2540?[17]\d{8}$/.test(clean)) return true;
      return false;
    },
    formatPhoneInput: (input: string): string => {
      return input.replace(/[^\d+]/g, '');
    },
    normalizePhone: (input: string): string => {
      const clean = input.replace(/[\s\-()]/g, '');
      let digits = clean;
      if (digits.startsWith('+254')) {
        digits = digits.slice(4);
      } else if (digits.startsWith('254')) {
        digits = digits.slice(3);
      }
      if (digits.startsWith('0')) {
        digits = digits.slice(1);
      }
      if (digits.length === 9) {
        return `+254 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
      }
      return `+254 ${digits}`;
    },
  },
};

// Default configured operating country for current review deployment (Zambia)
export const DEFAULT_OPERATING_COUNTRY_CODE = 'ZM';

export const SUPPORTED_OPERATING_COUNTRIES: OperatingCountryConfig[] = Object.values(OPERATING_COUNTRIES);

export const getOperatingCountryConfig = (
  countryCodeOrLocation?: string
): OperatingCountryConfig => {
  if (!countryCodeOrLocation) {
    return OPERATING_COUNTRIES[DEFAULT_OPERATING_COUNTRY_CODE];
  }

  const upper = countryCodeOrLocation.toUpperCase().trim();
  if (OPERATING_COUNTRIES[upper]) {
    return OPERATING_COUNTRIES[upper];
  }

  // Check location string keywords
  if (upper.includes('NIGERIA') || upper.includes('LAGOS') || upper.includes('ABUJA') || upper === 'NG') {
    return OPERATING_COUNTRIES.NG;
  }
  if (upper.includes('ZAMBIA') || upper.includes('LUSAKA') || upper === 'ZM') {
    return OPERATING_COUNTRIES.ZM;
  }
  if (upper.includes('GHANA') || upper.includes('ACCRA') || upper === 'GH') {
    return OPERATING_COUNTRIES.GH;
  }
  if (upper.includes('KENYA') || upper.includes('NAIROBI') || upper === 'KE') {
    return OPERATING_COUNTRIES.KE;
  }

  return OPERATING_COUNTRIES[DEFAULT_OPERATING_COUNTRY_CODE];
};

export interface PhoneValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export const validateCustomerPhoneNumber = (
  phoneNumber: string,
  countryConfig?: OperatingCountryConfig
): PhoneValidationResult => {
  const trimmed = phoneNumber.trim();
  if (!trimmed) {
    return {
      isValid: false,
      errorMessage: 'Required',
    };
  }

  const config = countryConfig || OPERATING_COUNTRIES[DEFAULT_OPERATING_COUNTRY_CODE];
  const isValid = config.validatePhone(trimmed);

  if (!isValid) {
    return {
      isValid: false,
      errorMessage: 'Enter a valid phone number.',
    };
  }

  return {
    isValid: true,
  };
};
