import { useState, useEffect } from 'react';
import { AttendanceRecord, WalletActivityItem } from '../types';

/**
 * Shared Clock Hook
 * Provides a live updating Date object synchronized across all container components.
 */
export function useSharedClock(intervalMs: number = 1000): Date {
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);

  return currentDate;
}

/**
 * Formats time for Android status bar (e.g. "04:54" or "16:54")
 */
export function formatStatusBarTime(date: Date): string {
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/**
 * Formats time for user-facing app timestamps (e.g. "04:54 am", "05:42 pm")
 */
export function formatAppTime(date: Date | string | number): string {
  if (typeof date === 'string') {
    // If already formatted like "08:30 am", return as is
    if (/^\d{1,2}:\d{2}\s*(am|pm)$/i.test(date.trim())) {
      return date.trim().toLowerCase();
    }
    const parsed = new Date(date);
    if (!isNaN(parsed.getTime())) {
      return parsed.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    }
    return date;
  }
  const d = typeof date === 'number' ? new Date(date) : date;
  return d.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Parse a time string like "08:30 am" or "5:42 pm" or timestamp into minute-of-day
 */
export function parseTimeToMinutes(timeStr: string): number | null {
  if (!timeStr) return null;
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(am|pm)?$/i);
  if (!match) return null;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3]?.toLowerCase();

  if (period === 'pm' && hours < 12) {
    hours += 12;
  } else if (period === 'am' && hours === 12) {
    hours = 0;
  }
  return hours * 60 + minutes;
}

/**
 * Formats duration in minutes into standard human string (e.g. "47 min", "9 hrs 12 min", "12 hrs 00 min")
 */
export function formatDurationMinutes(totalMinutes: number): string {
  const safeMinutes = Math.max(0, Math.floor(totalMinutes));
  const hours = Math.floor(safeMinutes / 60);
  const mins = safeMinutes % 60;

  if (hours === 0) {
    return `${mins} min`;
  }
  const minsStr = mins < 10 ? `0${mins}` : `${mins}`;
  const hrLabel = hours === 1 ? '1 hr' : `${hours} hrs`;
  return `${hrLabel} ${minsStr} min`;
}

/**
 * Calculates working duration between two timestamps/time strings
 */
export function calculateWorkingDuration(
  start: Date | string | number,
  end: Date | string | number
): string {
  // If both are Date or number
  if (
    (start instanceof Date || typeof start === 'number') &&
    (end instanceof Date || typeof end === 'number')
  ) {
    const startMs = start instanceof Date ? start.getTime() : start;
    const endMs = end instanceof Date ? end.getTime() : end;
    const diffMinutes = Math.max(0, (endMs - startMs) / 60000);
    return formatDurationMinutes(diffMinutes);
  }

  // If start is Date/number and end is string or vice versa
  if (typeof start === 'string' && typeof end === 'string') {
    const startMin = parseTimeToMinutes(start);
    const endMin = parseTimeToMinutes(end);
    if (startMin !== null && endMin !== null) {
      let diff = endMin - startMin;
      if (diff < 0) {
        // Shift crossed midnight
        diff += 24 * 60;
      }
      return formatDurationMinutes(diff);
    }
  }

  // Fallback: try parsing strings as full dates
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
    const diffMinutes = Math.max(0, (endDate.getTime() - startDate.getTime()) / 60000);
    return formatDurationMinutes(diffMinutes);
  }

  return '0 min';
}

/**
 * Format relative date information dynamically based on referenceDate (e.g. "Today, Aug 14", "Yesterday, Aug 13", "Mon, Aug 11")
 */
export function formatAttendanceRecordDate(
  recordDate: Date | string | number,
  referenceDate: Date = new Date()
): { dateLabel: string; dateGroup: 'today' | 'yesterday' | 'earlier' } {
  const recDate =
    typeof recordDate === 'string' || typeof recordDate === 'number'
      ? new Date(recordDate)
      : recordDate;

  if (isNaN(recDate.getTime())) {
    return { dateLabel: String(recordDate), dateGroup: 'earlier' };
  }

  const refMidnight = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate()
  );
  const recMidnight = new Date(
    recDate.getFullYear(),
    recDate.getMonth(),
    recDate.getDate()
  );

  const diffMs = refMidnight.getTime() - recMidnight.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  const monthDay = recDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  if (diffDays === 0) {
    return {
      dateLabel: `Today, ${monthDay}`,
      dateGroup: 'today',
    };
  }

  if (diffDays === 1) {
    return {
      dateLabel: `Yesterday, ${monthDay}`,
      dateGroup: 'yesterday',
    };
  }

  const weekday = recDate.toLocaleDateString('en-US', { weekday: 'short' });
  return {
    dateLabel: `${weekday}, ${monthDay}`,
    dateGroup: 'earlier',
  };
}

/**
 * Seed initial historical attendance records that are guaranteed to be mathematically and chronologically consistent with referenceDate.
 */
export function createSeedAttendanceRecords(referenceDate: Date = new Date()): AttendanceRecord[] {
  const refTime = referenceDate.getTime();

  // 1. Yesterday's shift (Completed)
  const yesterdayDate = new Date(refTime - 1 * 24 * 60 * 60 * 1000);
  const yesterdayInfo = formatAttendanceRecordDate(yesterdayDate, referenceDate);
  const rec1Duration = calculateWorkingDuration('08:30 am', '05:42 pm'); // 9 hrs 12 min

  // 2. 3 days ago (Auto-Logout)
  const daysAgo3Date = new Date(refTime - 3 * 24 * 60 * 60 * 1000);
  const daysAgo3Info = formatAttendanceRecordDate(daysAgo3Date, referenceDate);
  const rec2Duration = calculateWorkingDuration('08:30 am', '08:30 pm'); // 12 hrs 00 min

  // 3. 5 days ago (Completed)
  const daysAgo5Date = new Date(refTime - 5 * 24 * 60 * 60 * 1000);
  const daysAgo5Info = formatAttendanceRecordDate(daysAgo5Date, referenceDate);
  const rec3Duration = calculateWorkingDuration('08:35 am', '04:50 pm'); // 8 hrs 15 min

  // 4. 7 days ago (Missed Logout - No fabricated logout time)
  const daysAgo7Date = new Date(refTime - 7 * 24 * 60 * 60 * 1000);
  const daysAgo7Info = formatAttendanceRecordDate(daysAgo7Date, referenceDate);

  return [
    {
      id: 'att-rec-001',
      date: yesterdayInfo.dateLabel,
      dateGroup: yesterdayInfo.dateGroup,
      rawDate: yesterdayDate.toISOString(),
      booth: 'Booth 03 — Main Atrium',
      store: 'Central Mall Branch #104',
      business: 'Apex Retail Group',
      loginTime: '08:28 am',
      sessionStart: '08:30 am',
      sessionEnd: '05:42 pm',
      workDuration: rec1Duration,
      status: 'completed',
      declarationStatus: 'completed',
    },
    {
      id: 'att-rec-002',
      date: daysAgo3Info.dateLabel,
      dateGroup: daysAgo3Info.dateGroup,
      rawDate: daysAgo3Date.toISOString(),
      booth: 'Booth 03 — Main Atrium',
      store: 'Central Mall Branch #104',
      business: 'Apex Retail Group',
      loginTime: '08:30 am',
      sessionStart: '08:30 am',
      sessionEnd: '08:30 pm',
      workDuration: rec2Duration,
      status: 'auto_logout',
      declarationStatus: 'missing',
    },
    {
      id: 'att-rec-003',
      date: daysAgo5Info.dateLabel,
      dateGroup: daysAgo5Info.dateGroup,
      rawDate: daysAgo5Date.toISOString(),
      booth: 'Booth 01 — Express Counter',
      store: 'Central Mall Branch #104',
      business: 'Apex Retail Group',
      loginTime: '08:35 am',
      sessionStart: '08:35 am',
      sessionEnd: '04:50 pm',
      workDuration: rec3Duration,
      status: 'completed',
      declarationStatus: 'completed',
    },
    {
      id: 'att-rec-004',
      date: daysAgo7Info.dateLabel,
      dateGroup: daysAgo7Info.dateGroup,
      rawDate: daysAgo7Date.toISOString(),
      booth: 'Booth 03 — Main Atrium',
      store: 'Central Mall Branch #104',
      business: 'Apex Retail Group',
      loginTime: '09:00 am',
      sessionStart: '09:00 am',
      sessionEnd: undefined, // Missed logout has no fabricated logout time
      workDuration: '—',
      status: 'missed_logout',
      declarationStatus: 'pending_review',
    },
  ];
}

/**
 * Seed initial historical Wallet Activity records that are mathematically and chronologically consistent with referenceDate.
 */
export function createSeedWalletActivities(
  referenceDate: Date = new Date(),
  currencySymbol: string = 'ZMW'
): WalletActivityItem[] {
  const refTime = referenceDate.getTime();

  // 1. Today items - MUST be strictly <= current simulated referenceDate / device time
  const act1Date = new Date(refTime - 25 * 60 * 1000); // 25 minutes ago
  const act2Date = new Date(refTime - 95 * 60 * 1000); // 1 hr 35 min ago

  const act1Info = formatAttendanceRecordDate(act1Date, referenceDate);
  const act2Info = formatAttendanceRecordDate(act2Date, referenceDate);

  // 2. Yesterday items - Calendar date exactly 1 day before referenceDate
  const yesterdayDate = new Date(refTime - 1 * 24 * 60 * 60 * 1000);
  const act3Date = new Date(yesterdayDate);
  act3Date.setHours(14, 15, 0, 0); // 02:15 pm on yesterday
  const act3Info = formatAttendanceRecordDate(act3Date, referenceDate);

  const act4Date = new Date(yesterdayDate);
  act4Date.setHours(10, 30, 0, 0); // 10:30 am on yesterday
  const act4Info = formatAttendanceRecordDate(act4Date, referenceDate);

  // 3. Earlier items - 4 days ago
  const daysAgo4Date = new Date(refTime - 4 * 24 * 60 * 60 * 1000);
  const act5Date = new Date(daysAgo4Date);
  act5Date.setHours(9, 0, 0, 0); // 09:00 am 4 days ago
  const act5Info = formatAttendanceRecordDate(act5Date, referenceDate);

  const act6Date = new Date(daysAgo4Date);
  act6Date.setHours(16, 10, 0, 0); // 04:10 pm 4 days ago
  const act6Info = formatAttendanceRecordDate(act6Date, referenceDate);

  return [
    {
      id: 'act-001',
      type: 'service_fee',
      title: 'Service Fee',
      amount: `${currencySymbol} 150.00`,
      numericAmount: -150,
      currencySymbol,
      context: 'Customer Pickup',
      subContext: 'MTN Withdrawal',
      reference: '#TRX-8842',
      status: 'Applied',
      timestamp: formatAppTime(act1Date),
      date: act1Info.dateLabel,
      dateGroup: act1Info.dateGroup,
      rawDate: act1Date.toISOString(),
      createdAt: act1Date.toISOString(),
    },
    {
      id: 'act-002',
      type: 'service_fee',
      title: 'Service Fee',
      amount: `${currencySymbol} 200.00`,
      numericAmount: -200,
      currencySymbol,
      context: 'Cash Exchange',
      subContext: 'Agent Liquidity',
      reference: '#AL-4091',
      status: 'Applied',
      timestamp: formatAppTime(act2Date),
      date: act2Info.dateLabel,
      dateGroup: act2Info.dateGroup,
      rawDate: act2Date.toISOString(),
      createdAt: act2Date.toISOString(),
    },
    {
      id: 'act-003',
      type: 'credit',
      title: 'Wallet Funding',
      amount: `${currencySymbol} 25,000.00`,
      numericAmount: 25000,
      currencySymbol,
      fundedBy: 'Business Owner',
      reference: '#WF-99214',
      status: 'Completed',
      timestamp: formatAppTime(act3Date),
      date: act3Info.dateLabel,
      dateGroup: act3Info.dateGroup,
      rawDate: act3Date.toISOString(),
      createdAt: act3Date.toISOString(),
    },
    {
      id: 'act-004',
      type: 'service_fee',
      title: 'Service Fee',
      amount: `${currencySymbol} 150.00`,
      numericAmount: -150,
      currencySymbol,
      context: 'Customer Pickup',
      subContext: 'Airtel Cash Out',
      reference: '#TRX-8102',
      status: 'Applied',
      timestamp: formatAppTime(act4Date),
      date: act4Info.dateLabel,
      dateGroup: act4Info.dateGroup,
      rawDate: act4Date.toISOString(),
      createdAt: act4Date.toISOString(),
    },
    {
      id: 'act-005',
      type: 'credit',
      title: 'Wallet Funding',
      amount: `${currencySymbol} 50,000.00`,
      numericAmount: 50000,
      currencySymbol,
      fundedBy: 'Business Admin',
      reference: '#WF-98012',
      status: 'Completed',
      timestamp: formatAppTime(act5Date),
      date: act5Info.dateLabel,
      dateGroup: act5Info.dateGroup,
      rawDate: act5Date.toISOString(),
      createdAt: act5Date.toISOString(),
    },
    {
      id: 'act-006',
      type: 'service_fee',
      title: 'Service Fee',
      amount: `${currencySymbol} 150.00`,
      numericAmount: -150,
      currencySymbol,
      context: 'Walk-In • Cash Out',
      subContext: 'POS Service',
      reference: '#TRX-7420',
      status: 'Applied',
      timestamp: formatAppTime(act6Date),
      date: act6Info.dateLabel,
      dateGroup: act6Info.dateGroup,
      rawDate: act6Date.toISOString(),
      createdAt: act6Date.toISOString(),
    },
  ];
}
