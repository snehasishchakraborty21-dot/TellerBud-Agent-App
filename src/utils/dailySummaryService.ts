import {
  DailySummaryReportData,
  DailySummaryPartnerRow,
  RecordedTransaction,
  WalkInTransactionRecord,
  AgentDailySummaryReportPreviewState,
} from '../types';
import { CONFIGURED_VENDORS } from '../config/walkInConfig';

/**
 * Formats a Date object or ISO string into the standard report date format (e.g. "18 August 2026")
 */
export function formatReportDisplayDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return String(date);
  
  const day = d.getDate();
  const month = d.toLocaleDateString('en-US', { month: 'long' });
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

/**
 * Returns ISO date key "YYYY-MM-DD"
 */
export function getISODateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Interface for historical daily datasets
 */
interface SeedDailyDataset {
  booth: string;
  store: string;
  business: string;
  counts: Record<string, { deposits: number; withdrawals: number; purchases: number }>;
}

/**
 * Authoritative Historical Shift Data by date offset relative to project base date (2026-08-18)
 */
const HISTORICAL_BOOTH_DATA: Record<string, SeedDailyDataset> = {
  // Today (Day 0) - Booth 03
  '2026-08-18': {
    booth: 'Booth 03 — Main Atrium',
    store: 'Central Mall Branch #104',
    business: 'Apex Retail Group',
    counts: {
      mtn: { deposits: 25, withdrawals: 18, purchases: 12 },
      airtel: { deposits: 20, withdrawals: 15, purchases: 8 },
      zamtel: { deposits: 8, withdrawals: 6, purchases: 4 },
      zanaco: { deposits: 4, withdrawals: 3, purchases: 2 },
    },
  },
  // Yesterday (Day -1) - Booth 03
  '2026-08-17': {
    booth: 'Booth 03 — Main Atrium',
    store: 'Central Mall Branch #104',
    business: 'Apex Retail Group',
    counts: {
      mtn: { deposits: 22, withdrawals: 16, purchases: 10 },
      airtel: { deposits: 18, withdrawals: 12, purchases: 6 },
      zamtel: { deposits: 7, withdrawals: 5, purchases: 3 },
      zanaco: { deposits: 3, withdrawals: 2, purchases: 1 },
    },
  },
  // Day -2 - Booth 02 (Historical different booth)
  '2026-08-16': {
    booth: 'Booth 02 — North Concourse',
    store: 'Central Mall Branch #104',
    business: 'Apex Retail Group',
    counts: {
      mtn: { deposits: 20, withdrawals: 14, purchases: 8 },
      airtel: { deposits: 15, withdrawals: 10, purchases: 5 },
      zamtel: { deposits: 6, withdrawals: 4, purchases: 2 },
      zanaco: { deposits: 2, withdrawals: 2, purchases: 1 },
    },
  },
  // Day -3 - Booth 02
  '2026-08-15': {
    booth: 'Booth 02 — North Concourse',
    store: 'Central Mall Branch #104',
    business: 'Apex Retail Group',
    counts: {
      mtn: { deposits: 18, withdrawals: 12, purchases: 7 },
      airtel: { deposits: 14, withdrawals: 9, purchases: 4 },
      zamtel: { deposits: 5, withdrawals: 3, purchases: 2 },
      zanaco: { deposits: 2, withdrawals: 1, purchases: 1 },
    },
  },
  // Day -4 - Booth 01 — West Entrance
  '2026-08-14': {
    booth: 'Booth 01 — West Entrance',
    store: 'Central Mall Branch #104',
    business: 'Apex Retail Group',
    counts: {
      mtn: { deposits: 15, withdrawals: 10, purchases: 6 },
      airtel: { deposits: 12, withdrawals: 8, purchases: 4 },
      zamtel: { deposits: 4, withdrawals: 3, purchases: 1 },
      zanaco: { deposits: 1, withdrawals: 1, purchases: 0 },
    },
  },
};

/**
 * Returns available selectable dates for the Agent Daily Summary Report
 */
export function getSelectableReportDates(baseDate: Date = new Date()): {
  iso: string;
  label: string;
  isToday: boolean;
  isYesterday: boolean;
}[] {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - i);
    const iso = getISODateKey(d);
    const isToday = i === 0;
    const isYesterday = i === 1;
    let label = formatReportDisplayDate(d);
    if (isToday) label = `Today (${d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })})`;
    else if (isYesterday) label = `Yesterday (${d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })})`;
    
    dates.push({
      iso,
      label,
      isToday,
      isYesterday,
    });
  }
  return dates;
}

export interface GetDailySummaryParams {
  date: Date | string;
  agentName?: string;
  agentId?: string;
  currentBooth?: string;
  currentStore?: string;
  currentBusiness?: string;
  liveRecordedCustomerTxn?: RecordedTransaction | null;
  liveRecordedWalkInTxn?: WalkInTransactionRecord | null;
  previewState?: AgentDailySummaryReportPreviewState;
}

/**
 * Build centralized authoritatively categorized Daily Summary Report Data
 */
export function getDailySummaryReport({
  date,
  agentName = 'Marcus Vance',
  agentId = 'AG-88421',
  currentBooth = 'Booth 03 — Main Atrium',
  currentStore = 'Central Mall Branch #104',
  currentBusiness = 'Apex Retail Group',
  liveRecordedCustomerTxn,
  liveRecordedWalkInTxn,
  previewState = 'default',
}: GetDailySummaryParams): DailySummaryReportData {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  const isoKey = getISODateKey(parsedDate);
  const displayDate = formatReportDisplayDate(parsedDate);

  // If preview state is strictly 'no_transactions', return 0 counts
  if (previewState === 'no_transactions') {
    return {
      reportDate: isoKey,
      displayDate,
      agentName,
      agentId,
      booth: currentBooth,
      store: currentStore,
      business: currentBusiness,
      rows: [],
      totalDeposits: 0,
      totalWithdrawals: 0,
      totalPurchases: 0,
      grandTotal: 0,
    };
  }

  // Look up historical data or fallback to today's base
  const historical = HISTORICAL_BOOTH_DATA[isoKey] || (isoKey === getISODateKey(new Date()) ? HISTORICAL_BOOTH_DATA['2026-08-18'] : undefined);

  if (!historical) {
    // If no records exist for this past date
    return {
      reportDate: isoKey,
      displayDate,
      agentName,
      agentId,
      booth: currentBooth,
      store: currentStore,
      business: currentBusiness,
      rows: [],
      totalDeposits: 0,
      totalWithdrawals: 0,
      totalPurchases: 0,
      grandTotal: 0,
    };
  }

  const effectiveBooth = historical.booth || currentBooth;
  const effectiveStore = historical.store || currentStore;
  const effectiveBusiness = historical.business || currentBusiness;

  // Build rows from CONFIGURED_VENDORS
  const rows: DailySummaryPartnerRow[] = CONFIGURED_VENDORS.map((vendor) => {
    const key = vendor.id.toLowerCase();
    const counts = historical.counts[key] || { deposits: 0, withdrawals: 0, purchases: 0 };
    
    let deposits = counts.deposits;
    let withdrawals = counts.withdrawals;
    let purchases = counts.purchases;

    // If today's report, integrate any live recorded transactions
    const isToday = isoKey === getISODateKey(new Date()) || isoKey === '2026-08-18';
    if (isToday) {
      // Customer transaction integration
      if (liveRecordedCustomerTxn && liveRecordedCustomerTxn.vendor?.toLowerCase() === key) {
        // Customer Cash In / Deposit vs Withdrawal
        const typeLower = (liveRecordedCustomerTxn.serviceType || '').toLowerCase();
        if (typeLower.includes('pickup') || typeLower.includes('cash_in')) {
          deposits += 1;
        } else {
          withdrawals += 1;
        }
      }

      // Walk-In transaction integration
      if (liveRecordedWalkInTxn && liveRecordedWalkInTxn.vendor?.toLowerCase() === key) {
        const typeLower = (liveRecordedWalkInTxn.transactionType || '').toLowerCase();
        if (typeLower.includes('deposit') || typeLower.includes('cash in') || typeLower.includes('cash_in')) {
          deposits += 1;
        } else if (typeLower.includes('withdrawal') || typeLower.includes('cash out') || typeLower.includes('cash_out')) {
          withdrawals += 1;
        } else if (typeLower.includes('purchase')) {
          purchases += 1;
        }
      }
    }

    const totalTransactions = deposits + withdrawals + purchases;

    return {
      partnerId: vendor.id,
      partnerName: vendor.name,
      deposits,
      withdrawals,
      purchases,
      totalTransactions,
    };
  });

  const totalDeposits = rows.reduce((sum, r) => sum + r.deposits, 0);
  const totalWithdrawals = rows.reduce((sum, r) => sum + r.withdrawals, 0);
  const totalPurchases = rows.reduce((sum, r) => sum + r.purchases, 0);
  const grandTotal = rows.reduce((sum, r) => sum + r.totalTransactions, 0);

  return {
    reportDate: isoKey,
    displayDate,
    agentName,
    agentId,
    booth: effectiveBooth,
    store: effectiveStore,
    business: effectiveBusiness,
    rows,
    totalDeposits,
    totalWithdrawals,
    totalPurchases,
    grandTotal,
  };
}
