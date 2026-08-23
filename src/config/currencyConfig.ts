export interface CurrencyConfig {
  code: string; // ISO 3-letter currency code e.g. 'ZMW'
  symbol: string; // Symbol or display token e.g. 'ZMW'
  name: string; // Full display name e.g. 'Zambian Kwacha'
  countryCode?: string; // Associated country e.g. 'ZM'
}

export const CURRENT_MARKET = {
  countryCode: 'ZM',
  countryName: 'Zambia',
  phonePrefix: '+260',
  currencyCode: 'ZMW',
  currencySymbol: 'ZMW',
  currencyName: 'Zambian Kwacha',
};

export const CONFIGURED_CURRENCIES: CurrencyConfig[] = [
  {
    code: 'ZMW',
    symbol: 'ZMW',
    name: 'Zambian Kwacha',
    countryCode: 'ZM',
  },
];

export const DEFAULT_CURRENCY_CODE = 'ZMW';

export const getCurrencyConfig = (
  _codeOrSymbol?: string
): CurrencyConfig => {
  return CONFIGURED_CURRENCIES[0];
};

export const getDefaultCurrencyForCountry = (
  _countryCode?: string
): CurrencyConfig => {
  return CONFIGURED_CURRENCIES[0];
};

export const formatZmwAmount = (val: string | number): string => {
  if (typeof val === 'number') {
    if (isNaN(val)) return 'ZMW 0.00';
    return `ZMW ${val.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  if (!val) return 'ZMW 0.00';
  const cleanStr = val
    .toString()
    .replace(/^(?:ZK|ZMW|NGN|₦|GHS|GH₵|KES|KSh|UGX|USh|USD|\$|EUR|€|GBP|£|\s)+/i, '')
    .replace(/,/g, '')
    .trim();
  const num = parseFloat(cleanStr);
  if (isNaN(num)) return val.startsWith('ZMW') ? val : `ZMW ${val}`;
  return `ZMW ${num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const formatCurrencyValue = (
  val: string | number,
  currencySymbol: string = 'ZMW'
): string => {
  const num = typeof val === 'number' ? val : parseFloat(val);
  if (isNaN(num)) return `${currencySymbol} 0.00`;
  return `${currencySymbol} ${num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const normalizeZmwAmount = (val: string | number): string => {
  return formatZmwAmount(val);
};
