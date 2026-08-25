import { AgentEarningsSummary, RecordedTransaction, WalkInTransactionRecord } from '../types';
import { formatZmwAmount } from '../config/currencyConfig';

/**
 * Parses numeric currency value from fee or commission strings (e.g. "ZMW 30.00" -> 30)
 */
export function extractCommissionAmount(feeStr?: string): number {
  if (!feeStr) return 0;
  const clean = feeStr
    .toString()
    .replace(/^(?:ZK|ZMW|NGN|₦|USD|\$|\s)+/i, '')
    .replace(/,/g, '')
    .trim();
  const val = parseFloat(clean);
  return isNaN(val) ? 0 : val;
}

/**
 * Baseline qualifying historical TellerBud commission values (before dynamically adding live session records)
 */
const BASE_COMMISSION = {
  today: 350.0, // Qualifying completed commissions earlier today
  thisWeek: 1420.0, // Qualifying completed commissions this week up to now
  thisMonth: 4850.0, // Qualifying completed commissions this month up to now
};

/**
 * Calculates dynamic TellerBud Commission Summary (Today, This Week, This Month)
 * from qualifying completed transactions.
 *
 * Rules:
 * - Includes only completed qualifying transactions.
 * - Today: Current calendar day (00:00 to now).
 * - This Week: Monday 00:00 of current calendar week to now.
 * - This Month: 1st day 00:00 of current calendar month to now.
 * - TellerBud Commission only (excludes vendor/MNO commissions).
 * - Always formatted in ZMW (e.g., ZMW 350.00).
 */
export function calculateAgentEarningsSummary(
  recordedTxns?: (RecordedTransaction | WalkInTransactionRecord | null | undefined)[],
  referenceDate: Date = new Date()
): AgentEarningsSummary {
  let extraToday = 0;
  let extraThisWeek = 0;
  let extraThisMonth = 0;

  const now = referenceDate;
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

  // Calendar week boundary: Monday 00:00:00 through Sunday 23:59:59
  const currentDayOfWeek = now.getDay(); // 0 is Sun, 1 is Mon, ... 6 is Sat
  const daysSinceMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysSinceMonday, 0, 0, 0, 0);

  // Calendar month boundary: 1st of current month at 00:00:00
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);

  if (recordedTxns && recordedTxns.length > 0) {
    for (const txn of recordedTxns) {
      if (!txn) continue;

      // Only count qualifying completed transactions
      if (txn.status && txn.status !== 'completed' && txn.status !== 'recorded') {
        continue;
      }

      // Extract qualifying TellerBud commission (serviceFee or reservationFee or default ZMW 30.00)
      const fee =
        txn.serviceFee ||
        ('reservationFee' in txn ? (txn as any).reservationFee : '') ||
        ('agentEarnings' in txn ? (txn as any).agentEarnings : '') ||
        'ZMW 30.00';
      const commissionAmount = extractCommissionAmount(fee);

      if (commissionAmount <= 0) continue;

      // Transaction date calculation
      let txnDate = now;
      if (txn.rawDate) {
        txnDate = typeof txn.rawDate === 'string' ? new Date(txn.rawDate) : txn.rawDate;
        if (isNaN(txnDate.getTime())) txnDate = now;
      }

      if (txnDate >= todayStart) {
        extraToday += commissionAmount;
      }
      if (txnDate >= weekStart) {
        extraThisWeek += commissionAmount;
      }
      if (txnDate >= monthStart) {
        extraThisMonth += commissionAmount;
      }
    }
  }

  const todayTotal = BASE_COMMISSION.today + extraToday;
  const thisWeekTotal = BASE_COMMISSION.thisWeek + extraThisWeek;
  const thisMonthTotal = BASE_COMMISSION.thisMonth + extraThisMonth;

  return {
    today: formatZmwAmount(todayTotal),
    thisWeek: formatZmwAmount(thisWeekTotal),
    thisMonth: formatZmwAmount(thisMonthTotal),
    currencySymbol: 'ZMW',
  };
}
