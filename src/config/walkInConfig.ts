import { VendorType, WalkInTransactionTypeOption, WalkInVendorOption } from '../types';

export const CONFIGURED_VENDOR_TYPES: { id: VendorType; label: string; description: string }[] = [
  {
    id: 'MNO',
    label: 'MNO',
    description: 'Mobile Network Operators (MTN, Airtel, Zamtel, ZedMobile)',
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
    usesUssd: false,
    defaultFee: 'ZMW 5.00',
  },
];

export const CONFIGURED_VENDORS: WalkInVendorOption[] = [
  // MNO Vendors (4 Options)
  {
    id: 'mtn',
    name: 'MTN',
    type: 'MNO',
    code: 'MTN',
    accentColor: '#eab308',
    supportedCurrencies: ['ZMW'],
  },
  {
    id: 'airtel',
    name: 'Airtel',
    type: 'MNO',
    code: 'Airtel',
    accentColor: '#ef4444',
    supportedCurrencies: ['ZMW'],
  },
  {
    id: 'zamtel',
    name: 'Zamtel',
    type: 'MNO',
    code: 'Zamtel',
    accentColor: '#22c55e',
    supportedCurrencies: ['ZMW'],
  },
  {
    id: 'zedmobile',
    name: 'ZedMobile',
    type: 'MNO',
    code: 'ZedMobile',
    accentColor: '#8b5cf6',
    supportedCurrencies: ['ZMW'],
  },
  // Bank Vendors (5 Options)
  {
    id: 'zanaco',
    name: 'Zanaco',
    type: 'Bank',
    code: 'Zanaco',
    accentColor: '#0284c7',
    supportedCurrencies: ['ZMW'],
  },
  {
    id: 'fnb',
    name: 'FNB',
    type: 'Bank',
    code: 'FNB',
    accentColor: '#0d9488',
    supportedCurrencies: ['ZMW'],
  },
  {
    id: 'indo',
    name: 'INDO',
    type: 'Bank',
    code: 'INDO',
    accentColor: '#4f46e5',
    supportedCurrencies: ['ZMW'],
  },
  {
    id: 'stanbic',
    name: 'Stanbic',
    type: 'Bank',
    code: 'Stanbic',
    accentColor: '#0284c7',
    supportedCurrencies: ['ZMW'],
  },
  {
    id: 'access',
    name: 'Access',
    type: 'Bank',
    code: 'Access',
    accentColor: '#ea580c',
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
