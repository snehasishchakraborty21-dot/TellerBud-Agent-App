export interface CurrencyConfig {
  code: string; // ISO 3-letter currency code e.g. 'ZMW'
  symbol: string; // Symbol or display token e.g. 'ZMW'
  name: string; // Full display name e.g. 'Zambian Kwacha'
  countryCode?: string; // Optional associated country e.g. 'ZM'
}

export const CONFIGURED_CURRENCIES: CurrencyConfig[] = [
  {
    code: 'ZMW',
    symbol: 'ZMW',
    name: 'Zambian Kwacha',
    countryCode: 'ZM',
  },
  {
    code: 'NGN',
    symbol: '₦',
    name: 'Nigerian Naira',
    countryCode: 'NG',
  },
  {
    code: 'GHS',
    symbol: 'GH₵',
    name: 'Ghanaian Cedi',
    countryCode: 'GH',
  },
  {
    code: 'KES',
    symbol: 'KSh',
    name: 'Kenyan Shilling',
    countryCode: 'KE',
  },
  {
    code: 'UGX',
    symbol: 'USh',
    name: 'Ugandan Shilling',
    countryCode: 'UG',
  },
  {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    countryCode: 'US',
  },
  {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    countryCode: 'EU',
  },
  {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    countryCode: 'GB',
  },
];

export const DEFAULT_CURRENCY_CODE = 'ZMW';

export const getCurrencyConfig = (
  codeOrSymbol?: string
): CurrencyConfig | undefined => {
  if (!codeOrSymbol) return undefined;
  const clean = codeOrSymbol.trim().toUpperCase();
  return CONFIGURED_CURRENCIES.find(
    (c) =>
      c.code.toUpperCase() === clean ||
      c.symbol.toUpperCase() === clean ||
      c.name.toUpperCase().includes(clean)
  );
};

export const getDefaultCurrencyForCountry = (
  countryCode?: string
): CurrencyConfig => {
  if (!countryCode) {
    return (
      getCurrencyConfig(DEFAULT_CURRENCY_CODE) ||
      CONFIGURED_CURRENCIES.find((c) => c.code === 'ZMW') ||
      CONFIGURED_CURRENCIES[0]
    );
  }
  const upper = countryCode.toUpperCase().trim();
  const matched = CONFIGURED_CURRENCIES.find(
    (c) => c.countryCode === upper || c.code.startsWith(upper)
  );
  return (
    matched ||
    getCurrencyConfig(DEFAULT_CURRENCY_CODE) ||
    CONFIGURED_CURRENCIES[0]
  );
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

