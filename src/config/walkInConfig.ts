import { VendorType, WalkInTransactionTypeOption, WalkInVendorOption } from '../types';

export const CONFIGURED_VENDOR_TYPES: { id: VendorType; label: string; description: string }[] = [
  {
    id: 'MNO',
    label: 'MNO',
    description: 'Mobile Network Operators (MTN, Airtel, Zamtel)',
  },
  {
    id: 'Bank',
    label: 'Bank',
    description: 'Commercial Banking Institutions (Zanaco, FNB, INDO, Stanbic, Access)',
  },
];

export const CONFIGURED_TRANSACTION_TYPES: WalkInTransactionTypeOption[] = [
  {
    id: 'deposit',
    label: 'Deposit',
    requiresVendor: true,
    usesUssd: true,
    defaultFee: 'ZMW 5.00',
  },
  {
    id: 'withdrawal',
    label: 'Withdrawal',
    requiresVendor: true,
    usesUssd: false,
    defaultFee: 'ZMW 5.00',
  },
  {
    id: 'purchase',
    label: 'Purchase',
    requiresVendor: true,
    usesUssd: true,
    defaultFee: 'ZMW 5.00',
  },
];

export const MNO_LOGOS: Record<string, string> = {
  MTN: 'assets/vendor-logos/mno/mtn.png',
  Airtel: 'assets/vendor-logos/mno/airtel.jpg',
  Zamtel: 'assets/vendor-logos/mno/zamtel.png',
};

export const BANK_LOGOS: Record<string, string> = {
  Zanaco: 'assets/vendor-logos/banks/zanaco.png',
  FNB: 'assets/vendor-logos/banks/fnb.png',
  INDO: 'assets/vendor-logos/banks/indo.png',
  Stanbic: 'assets/vendor-logos/banks/stanbic.png',
  Access: 'assets/vendor-logos/banks/access.jpg',
};

export const getVendorLogo = (vendorNameOrId?: string): string | undefined => {
  if (!vendorNameOrId) return undefined;
  const lower = vendorNameOrId.toLowerCase().trim();
  if (lower === 'mtn' || lower.includes('mtn')) return MNO_LOGOS.MTN;
  if (lower === 'airtel' || lower.includes('airtel')) return MNO_LOGOS.Airtel;
  if (lower === 'zamtel' || lower.includes('zamtel')) return MNO_LOGOS.Zamtel;
  if (lower === 'zanaco' || lower.includes('zanaco')) return BANK_LOGOS.Zanaco;
  if (lower === 'fnb' || lower.includes('fnb')) return BANK_LOGOS.FNB;
  if (lower === 'indo' || lower.includes('indo')) return BANK_LOGOS.INDO;
  if (lower === 'stanbic' || lower.includes('stanbic')) return BANK_LOGOS.Stanbic;
  if (lower === 'access' || lower.includes('access')) return BANK_LOGOS.Access;
  return undefined;
};

export interface VendorLogoDisplayConfig {
  scale: number;
  bgColor?: string;
  isBank?: boolean;
}

export const VENDOR_LOGO_DISPLAY: Record<string, VendorLogoDisplayConfig> = {
  MTN: {
    scale: 2.05,
    bgColor: '#fdb913',
    isBank: false,
  },
  Airtel: {
    scale: 1.95,
    bgColor: '#ed1b24',
    isBank: false,
  },
  Zamtel: {
    scale: 1.75,
    bgColor: '#ffffff',
    isBank: false,
  },
  Zanaco: {
    scale: 1.65,
    bgColor: '#ffffff',
    isBank: true,
  },
  FNB: {
    scale: 1.55,
    bgColor: '#ffffff',
    isBank: true,
  },
  INDO: {
    scale: 1.6,
    bgColor: '#ffffff',
    isBank: true,
  },
  Stanbic: {
    scale: 1.6,
    bgColor: '#ffffff',
    isBank: true,
  },
  Access: {
    scale: 1.6,
    bgColor: '#ffffff',
    isBank: true,
  },
};

export const getVendorLogoDisplayConfig = (
  vendorNameOrId?: string
): VendorLogoDisplayConfig => {
  if (!vendorNameOrId) return { scale: 1.5, bgColor: '#ffffff' };
  const lower = vendorNameOrId.toLowerCase().trim();
  if (lower === 'mtn' || lower.includes('mtn')) return VENDOR_LOGO_DISPLAY.MTN;
  if (lower === 'airtel' || lower.includes('airtel')) return VENDOR_LOGO_DISPLAY.Airtel;
  if (lower === 'zamtel' || lower.includes('zamtel')) return VENDOR_LOGO_DISPLAY.Zamtel;
  if (lower === 'zanaco' || lower.includes('zanaco')) return VENDOR_LOGO_DISPLAY.Zanaco;
  if (lower === 'fnb' || lower.includes('fnb')) return VENDOR_LOGO_DISPLAY.FNB;
  if (lower === 'indo' || lower.includes('indo')) return VENDOR_LOGO_DISPLAY.INDO;
  if (lower === 'stanbic' || lower.includes('stanbic')) return VENDOR_LOGO_DISPLAY.Stanbic;
  if (lower === 'access' || lower.includes('access')) return VENDOR_LOGO_DISPLAY.Access;
  return { scale: 1.5, bgColor: '#ffffff' };
};

export const CONFIGURED_VENDORS: WalkInVendorOption[] = [
  // MNO Vendors (3 Approved Options)
  {
    id: 'mtn',
    name: 'MTN',
    type: 'MNO',
    code: 'MTN',
    accentColor: '#eab308',
    logoUrl: MNO_LOGOS.MTN,
    supportedCurrencies: ['ZMW'],
  },
  {
    id: 'airtel',
    name: 'Airtel',
    type: 'MNO',
    code: 'Airtel',
    accentColor: '#ef4444',
    logoUrl: MNO_LOGOS.Airtel,
    supportedCurrencies: ['ZMW'],
  },
  {
    id: 'zamtel',
    name: 'Zamtel',
    type: 'MNO',
    code: 'Zamtel',
    accentColor: '#22c55e',
    logoUrl: MNO_LOGOS.Zamtel,
    supportedCurrencies: ['ZMW'],
  },
  // Bank Vendors (5 Options)
  {
    id: 'zanaco',
    name: 'Zanaco',
    type: 'Bank',
    code: 'Zanaco',
    accentColor: '#0284c7',
    logoUrl: BANK_LOGOS.Zanaco,
    supportedCurrencies: ['ZMW'],
  },
  {
    id: 'fnb',
    name: 'FNB',
    type: 'Bank',
    code: 'FNB',
    accentColor: '#0d9488',
    logoUrl: BANK_LOGOS.FNB,
    supportedCurrencies: ['ZMW'],
  },
  {
    id: 'indo',
    name: 'INDO',
    type: 'Bank',
    code: 'INDO',
    accentColor: '#4f46e5',
    logoUrl: BANK_LOGOS.INDO,
    supportedCurrencies: ['ZMW'],
  },
  {
    id: 'stanbic',
    name: 'Stanbic',
    type: 'Bank',
    code: 'Stanbic',
    accentColor: '#0284c7',
    logoUrl: BANK_LOGOS.Stanbic,
    supportedCurrencies: ['ZMW'],
  },
  {
    id: 'access',
    name: 'Access',
    type: 'Bank',
    code: 'Access',
    accentColor: '#ea580c',
    logoUrl: BANK_LOGOS.Access,
    supportedCurrencies: ['ZMW'],
  },
];

export const getVendorsByType = (vendorType?: VendorType | string): WalkInVendorOption[] => {
  if (!vendorType) return [];
  const normalized = vendorType.toUpperCase().trim();
  return CONFIGURED_VENDORS.filter((v) => v.type.toUpperCase() === normalized);
};

export const getVendorType = (vendorNameOrId?: string): VendorType | undefined => {
  if (!vendorNameOrId) return undefined;
  const vendor = getVendorConfigOption(vendorNameOrId);
  return vendor?.type;
};

export const isVendorCurrencyCompatible = (
  vendorIdOrName?: string,
  currencyCode?: string
): { isCompatible: boolean; errorMessage?: string } => {
  if (!vendorIdOrName || !currencyCode) {
    return { isCompatible: true };
  }
  const vendor = getVendorConfigOption(vendorIdOrName);
  if (!vendor || !vendor.supportedCurrencies || vendor.supportedCurrencies.length === 0) {
    return { isCompatible: true };
  }
  const code = currencyCode.toUpperCase().trim();
  const compatible = vendor.supportedCurrencies.includes(code);
  if (!compatible) {
    return {
      isCompatible: false,
      errorMessage: `${vendor.name} does not support ${code} transactions. Supported: ${vendor.supportedCurrencies.join(', ')}`,
    };
  }
  return { isCompatible: true };
};

export const getTransactionTypeConfig = (
  typeIdOrLabel?: string
): WalkInTransactionTypeOption | undefined => {
  if (!typeIdOrLabel) return undefined;
  const lower = typeIdOrLabel.toLowerCase();
  return CONFIGURED_TRANSACTION_TYPES.find(
    (t) =>
      t.id.toLowerCase() === lower ||
      t.label.toLowerCase().includes(lower) ||
      lower.includes(t.id.toLowerCase())
  );
};

export const getVendorConfigOption = (
  vendorNameOrId?: string
): WalkInVendorOption | undefined => {
  if (!vendorNameOrId) return undefined;
  const lower = vendorNameOrId.toLowerCase();
  return CONFIGURED_VENDORS.find(
    (v) =>
      v.id.toLowerCase() === lower ||
      v.name.toLowerCase() === lower ||
      v.code.toLowerCase() === lower
  );
};
