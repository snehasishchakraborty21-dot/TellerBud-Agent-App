import { AvailabilityBand, BandOption } from '../types';

/**
 * Centralized Availability Band Configuration
 * 
 * Supports configured monetary amount ranges for Cash and Float availability
 * on Screen 02 (Availability Setup) and Screen 03 (Operational Status).
 * 
 * Operating market: Zambia (ZMW)
 */

export interface MarketCurrencyConfig {
  country: string;
  currencyCode: string;
  currencySymbol: string;
}

export const DEFAULT_MARKET_CURRENCY: MarketCurrencyConfig = {
  country: 'Zambia',
  currencyCode: 'ZMW',
  currencySymbol: 'ZMW',
};

/**
 * Helper to build display labels for monetary ranges.
 * Format: "ZMW 0 – 2,000", "ZMW 2,001 – 5,000", "ZMW 5,001 – 10,000", "ZMW 10,000+"
 */
export const formatRangeLabel = (
  min: number,
  max: number | null,
  currencySymbol = DEFAULT_MARKET_CURRENCY.currencySymbol
): string => {
  const formattedMin = min.toLocaleString('en-US');
  if (max === null) {
    return `${currencySymbol} ${formattedMin}+`;
  }
  const formattedMax = max.toLocaleString('en-US');
  return `${currencySymbol} ${formattedMin} – ${formattedMax}`;
};

/**
 * Centrally configured Cash Availability Ranges (ZMW)
 * Exactly 4 Client-approved ranges:
 * - ZMW 0 – 2,000
 * - ZMW 2,001 – 5,000
 * - ZMW 5,001 – 10,000
 * - ZMW 10,000+
 */
export const DEFAULT_CASH_AVAILABILITY_RANGES: AvailabilityBand[] = [
  {
    id: 'cash_range_0_2000',
    bandType: 'cash',
    minimumAmount: 0,
    maximumAmount: 2000,
    currencyCode: 'ZMW',
    currencySymbol: 'ZMW',
    displayLabel: 'ZMW 0 – 2,000',
  },
  {
    id: 'cash_range_2001_5000',
    bandType: 'cash',
    minimumAmount: 2001,
    maximumAmount: 5000,
    currencyCode: 'ZMW',
    currencySymbol: 'ZMW',
    displayLabel: 'ZMW 2,001 – 5,000',
  },
  {
    id: 'cash_range_5001_10000',
    bandType: 'cash',
    minimumAmount: 5001,
    maximumAmount: 10000,
    currencyCode: 'ZMW',
    currencySymbol: 'ZMW',
    displayLabel: 'ZMW 5,001 – 10,000',
  },
  {
    id: 'cash_range_10000_plus',
    bandType: 'cash',
    minimumAmount: 10000,
    maximumAmount: null,
    currencyCode: 'ZMW',
    currencySymbol: 'ZMW',
    displayLabel: 'ZMW 10,000+',
  },
];

/**
 * Centrally configured Float Availability Ranges (ZMW)
 * Architecturally independent from Cash ranges.
 * Exactly 4 Client-approved ranges:
 * - ZMW 0 – 2,000
 * - ZMW 2,001 – 5,000
 * - ZMW 5,001 – 10,000
 * - ZMW 10,000+
 */
export const DEFAULT_FLOAT_AVAILABILITY_RANGES: AvailabilityBand[] = [
  {
    id: 'float_range_0_2000',
    bandType: 'float',
    minimumAmount: 0,
    maximumAmount: 2000,
    currencyCode: 'ZMW',
    currencySymbol: 'ZMW',
    displayLabel: 'ZMW 0 – 2,000',
  },
  {
    id: 'float_range_2001_5000',
    bandType: 'float',
    minimumAmount: 2001,
    maximumAmount: 5000,
    currencyCode: 'ZMW',
    currencySymbol: 'ZMW',
    displayLabel: 'ZMW 2,001 – 5,000',
  },
  {
    id: 'float_range_5001_10000',
    bandType: 'float',
    minimumAmount: 5001,
    maximumAmount: 10000,
    currencyCode: 'ZMW',
    currencySymbol: 'ZMW',
    displayLabel: 'ZMW 5,001 – 10,000',
  },
  {
    id: 'float_range_10000_plus',
    bandType: 'float',
    minimumAmount: 10000,
    maximumAmount: null,
    currencyCode: 'ZMW',
    currencySymbol: 'ZMW',
    displayLabel: 'ZMW 10,000+',
  },
];

/**
 * Convert AvailabilityBand items to BandOption interface for component props.
 */
export const toBandOption = (band: AvailabilityBand): BandOption => ({
  id: band.id,
  label: band.displayLabel,
  description: band.description,
  minAmount: band.minimumAmount,
  maxAmount: band.maximumAmount,
  currencyCode: band.currencyCode,
  currencySymbol: band.currencySymbol,
});

export const toBandOptions = (bands: AvailabilityBand[]): BandOption[] =>
  bands.map(toBandOption);

export const DEFAULT_CASH_BAND_OPTIONS: BandOption[] = toBandOptions(
  DEFAULT_CASH_AVAILABILITY_RANGES
);

export const DEFAULT_FLOAT_BAND_OPTIONS: BandOption[] = toBandOptions(
  DEFAULT_FLOAT_AVAILABILITY_RANGES
);

export const getCashAvailabilityRanges = (): AvailabilityBand[] =>
  DEFAULT_CASH_AVAILABILITY_RANGES;

export const getFloatAvailabilityRanges = (): AvailabilityBand[] =>
  DEFAULT_FLOAT_AVAILABILITY_RANGES;

/**
 * Lookup Cash range by ID with legacy ID mapping safety.
 */
export const getCashBandById = (id?: string): AvailabilityBand | undefined => {
  if (!id) return undefined;
  const direct = DEFAULT_CASH_AVAILABILITY_RANGES.find((b) => b.id === id);
  if (direct) return direct;

  // Legacy ID mapping fallbacks
  if (id === 'cash_range_0_500' || id === 'cash_band_a') return DEFAULT_CASH_AVAILABILITY_RANGES[0];
  if (id === 'cash_range_501_1000' || id === 'cash_band_b') return DEFAULT_CASH_AVAILABILITY_RANGES[1];
  if (id === 'cash_range_1001_2500' || id === 'cash_band_c') return DEFAULT_CASH_AVAILABILITY_RANGES[2];
  if (id === 'cash_range_2501_5000') return DEFAULT_CASH_AVAILABILITY_RANGES[1];
  if (id === 'cash_range_5001_plus') return DEFAULT_CASH_AVAILABILITY_RANGES[2];

  return undefined;
};

/**
 * Lookup Float range by ID with legacy ID mapping safety.
 */
export const getFloatBandById = (id?: string): AvailabilityBand | undefined => {
  if (!id) return undefined;
  const direct = DEFAULT_FLOAT_AVAILABILITY_RANGES.find((b) => b.id === id);
  if (direct) return direct;

  // Legacy ID mapping fallbacks
  if (id === 'float_range_0_500' || id === 'float_band_a') return DEFAULT_FLOAT_AVAILABILITY_RANGES[0];
  if (id === 'float_range_501_1000' || id === 'float_band_b') return DEFAULT_FLOAT_AVAILABILITY_RANGES[1];
  if (id === 'float_range_1001_2500' || id === 'float_band_c') return DEFAULT_FLOAT_AVAILABILITY_RANGES[2];
  if (id === 'float_range_2501_5000') return DEFAULT_FLOAT_AVAILABILITY_RANGES[1];
  if (id === 'float_range_5001_plus') return DEFAULT_FLOAT_AVAILABILITY_RANGES[2];

  return undefined;
};

/**
 * Get ready-to-display label for Cash availability band.
 */
export const getCashBandLabel = (
  id?: string,
  rawLabel?: string,
  fallback = 'ZMW 2,001 – 5,000'
): string => {
  if (rawLabel && (rawLabel.includes('–') || rawLabel.includes('+') || rawLabel.includes('ZMW'))) {
    // If rawLabel has old ZK, replace with ZMW
    return rawLabel.replace('ZK', 'ZMW');
  }
  const band = getCashBandById(id);
  if (band) return band.displayLabel;
  return fallback;
};

/**
 * Get ready-to-display label for Float availability band.
 */
export const getFloatBandLabel = (
  id?: string,
  rawLabel?: string,
  fallback = 'ZMW 5,001 – 10,000'
): string => {
  if (rawLabel && (rawLabel.includes('–') || rawLabel.includes('+') || rawLabel.includes('ZMW'))) {
    // If rawLabel has old ZK, replace with ZMW
    return rawLabel.replace('ZK', 'ZMW');
  }
  const band = getFloatBandById(id);
  if (band) return band.displayLabel;
  return fallback;
};

/**
 * Default initial review state IDs
 * Recommended review state: Cash = ZMW 2,001 – 5,000, Float = ZMW 5,001 – 10,000
 */
export const DEFAULT_REVIEW_CASH_BAND_ID = 'cash_range_2001_5000';
export const DEFAULT_REVIEW_FLOAT_BAND_ID = 'float_range_5001_10000';
