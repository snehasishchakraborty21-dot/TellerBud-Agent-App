import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronLeft,
  Calendar,
  AlertCircle,
  RefreshCw,
  Clock,
  Store,
  User,
  ChevronDown,
  FileSpreadsheet,
  Inbox,
  Check,
} from 'lucide-react';
import { TellerBudLogo } from '../components/TellerBudLogo';
import {
  AgentDailySummaryReportPreviewState,
  DailySummaryReportData,
  WorkAssignment,
  RecordedTransaction,
  WalkInTransactionRecord,
} from '../types';
import { PoweredByCinitecFooter } from '../components/PoweredByCinitecFooter';
import {
  getDailySummaryReport,
  getSelectableReportDates,
  formatReportDisplayDate,
  getISODateKey,
} from '../utils/dailySummaryService';

export interface AgentDailySummaryReportScreenProps {
  previewState?: AgentDailySummaryReportPreviewState;
  assignment?: WorkAssignment | null;
  liveRecordedCustomerTxn?: RecordedTransaction | null;
  liveRecordedWalkInTxn?: WalkInTransactionRecord | null;
  onBack?: () => void;
  onRetry?: () => void;
}

export const AgentDailySummaryReportScreen: React.FC<AgentDailySummaryReportScreenProps> = ({
  previewState = 'default',
  assignment,
  liveRecordedCustomerTxn,
  liveRecordedWalkInTxn,
  onBack,
  onRetry,
}) => {
  // Base date initialized to today
  const today = useMemo(() => new Date(), []);
  
  // Historical date preset for previewState === 'historical_date'
  const initialDate = useMemo(() => {
    if (previewState === 'historical_date') {
      const d = new Date(today);
      d.setDate(d.getDate() - 4); // 14 August 2026 (Day -4)
      return d;
    }
    return today;
  }, [previewState, today]);

  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(previewState === 'loading');
  const [hasConnectionIssue, setHasConnectionIssue] = useState(
    previewState === 'connection_issue'
  );

  // Sync with preview state updates
  useEffect(() => {
    if (previewState === 'loading') {
      setIsLoading(true);
      setHasConnectionIssue(false);
    } else if (previewState === 'connection_issue') {
      setHasConnectionIssue(true);
      setIsLoading(false);
    } else if (previewState === 'historical_date') {
      const d = new Date(today);
      d.setDate(d.getDate() - 4);
      setSelectedDate(d);
      setIsLoading(false);
      setHasConnectionIssue(false);
    } else {
      setIsLoading(false);
      setHasConnectionIssue(false);
    }
  }, [previewState, today]);

  // Handle date selection with brief loading feedback
  const handleSelectDate = (dateObj: Date) => {
    setIsDatePickerOpen(false);
    if (dateObj.getTime() === selectedDate.getTime()) return;

    setIsLoading(true);
    setSelectedDate(dateObj);
    setHasConnectionIssue(false);

    setTimeout(() => {
      setIsLoading(false);
    }, 280);
  };

  // Derive report data authoritatively from service
  const reportData: DailySummaryReportData = useMemo(() => {
    const currentAgentName = assignment?.agentName || 'Marcus Vance';
    const currentAgentId = assignment?.agentId || 'AG-88421';
    const currentBooth = assignment?.booth || 'Booth 03 — Main Atrium';
    const currentStore = assignment?.store || 'Central Mall Branch #104';
    const currentBusiness = assignment?.business || 'Apex Retail Group';

    return getDailySummaryReport({
      date: selectedDate,
      agentName: currentAgentName,
      agentId: currentAgentId,
      currentBooth,
      currentStore,
      currentBusiness,
      liveRecordedCustomerTxn,
      liveRecordedWalkInTxn,
      previewState: previewState === 'no_transactions' ? 'no_transactions' : undefined,
    });
  }, [
    selectedDate,
    assignment,
    liveRecordedCustomerTxn,
    liveRecordedWalkInTxn,
    previewState,
  ]);

  const selectableDates = useMemo(
    () => getSelectableReportDates(today),
    [today]
  );

  const isSelectedDateToday =
    getISODateKey(selectedDate) === getISODateKey(today);

  return (
    <div className="w-full h-full min-h-full bg-slate-50 flex flex-col justify-between text-slate-900 select-none overflow-hidden font-sans relative">
      {/* 1. Header (Compact Detail Header) */}
      <header className="px-3 pt-3 pb-2.5 bg-white border-b border-slate-200/90 flex items-center justify-between shrink-0 z-20 shadow-2xs">
        <button
          onClick={onBack}
          aria-label="Back to More menu"
          className="flex items-center gap-1 py-1 px-1.5 -ml-1 text-slate-700 hover:text-slate-900 active:text-slate-950 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-slate-600 shrink-0" />
          <span className="text-xs font-bold tracking-tight">Back</span>
        </button>

        <div className="flex-1 text-center px-1 truncate">
          <h1 className="text-xs font-extrabold text-[#002244] tracking-tight truncate">
            Daily Summary Report
          </h1>
        </div>

        <div className="flex items-center justify-end shrink-0">
          <TellerBudLogo size="sm" />
        </div>
      </header>

      {/* 2. Scrollable Body Content */}
      <main className="flex-1 overflow-y-auto no-scrollbar px-3.5 py-3 space-y-3">
        {/* Connection Error Banner (if triggered) */}
        {hasConnectionIssue && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 shadow-2xs space-y-2">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <h3 className="text-xs font-bold text-rose-900">
                  Daily summary couldn't be loaded.
                </h3>
                <p className="text-[11px] text-rose-700 font-medium mt-0.5">
                  Unable to connect to the reporting service. Please check your network and try again.
                </p>
              </div>
            </div>
            <div className="pt-1 flex justify-end">
              <button
                onClick={() => {
                  setIsLoading(true);
                  setHasConnectionIssue(false);
                  setTimeout(() => {
                    setIsLoading(false);
                    if (onRetry) onRetry();
                  }, 400);
                }}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            </div>
          </div>
        )}

        {/* Report Context Card (Read-Only) */}
        <section
          aria-label="Report Context"
          className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-2xs space-y-2.5"
        >
          {/* Agent Information */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-600 shrink-0">
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Agent
                </span>
                <span className="text-xs font-extrabold text-[#002244] tracking-tight truncate block">
                  {reportData.agentName}
                </span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-100 text-[#0052CC] font-mono text-[10px] font-bold">
                {reportData.agentId || 'AG-88421'}
              </span>
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Booth Information */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-600 shrink-0">
              <Store className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Booth
              </span>
              <span className="text-xs font-bold text-slate-800 tracking-tight truncate block">
                {reportData.booth}
              </span>
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Date Selector Trigger (Read-only Agent report, interactive date selection) */}
          <div className="flex items-center justify-between gap-2 pt-0.5">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0052CC] shrink-0">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Date
                </span>
                <span className="text-xs font-extrabold text-[#002244] tracking-tight block">
                  {reportData.displayDate}
                </span>
              </div>
            </div>

            {/* Compact Date Picker Trigger Button */}
            <button
              onClick={() => setIsDatePickerOpen((prev) => !prev)}
              aria-label="Change Report Date"
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 text-xs font-bold flex items-center gap-1.5 border border-slate-200/90 transition-colors shrink-0"
            >
              <span>{isSelectedDateToday ? 'Today' : 'Change Date'}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
                  isDatePickerOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>

          {/* Date Selector Dropdown Tray */}
          {isDatePickerOpen && (
            <div className="pt-2 border-t border-slate-100 space-y-1.5 animate-fadeIn">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1">
                Select Report Date (Past 7 Days)
              </div>
              <div className="grid grid-cols-1 gap-1 max-h-48 overflow-y-auto no-scrollbar">
                {selectableDates.map((item) => {
                  const isCurrent =
                    getISODateKey(selectedDate) === item.iso;
                  return (
                    <button
                      key={item.iso}
                      onClick={() => {
                        const [y, m, d] = item.iso.split('-').map(Number);
                        const newDate = new Date(y, m - 1, d);
                        handleSelectDate(newDate);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between border transition-all ${
                        isCurrent
                          ? 'bg-[#0052CC] text-white border-[#0052CC] font-bold shadow-2xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/70'
                      }`}
                    >
                      <span className="truncate">{item.label}</span>
                      {isCurrent && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* Loading Overlay / Content */}
        {isLoading ? (
          <div className="bg-white border border-slate-200/90 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-3 shadow-2xs min-h-[220px]">
            <RefreshCw className="w-6 h-6 text-[#0052CC] animate-spin" />
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-slate-800">Loading daily summary...</p>
              <p className="text-[11px] text-slate-500 font-medium">
                Fetching verified counts for {reportData.displayDate}
              </p>
            </div>
          </div>
        ) : !hasConnectionIssue && reportData.rows.length === 0 ? (
          /* Empty Report State */
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-3 shadow-2xs min-h-[200px]">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-400">
              <Inbox className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-extrabold text-slate-900">
                No transactions for this date
              </h3>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed max-w-[240px]">
                Your daily transaction summary will appear here when transactions are recorded.
              </p>
            </div>
          </div>
        ) : !hasConnectionIssue ? (
          /* Standard Client-Provided Table Structure */
          <section
            aria-label="Daily Summary Table"
            className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs divide-y divide-slate-100"
          >
            {/* Table Header / Legend */}
            <div className="p-3 bg-slate-50/70 flex items-center justify-between border-b border-slate-200/80">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#002244] tracking-tight">
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#0052CC]" />
                <span>Transaction Breakdown</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-500">
                Counts
              </span>
            </div>

            {/* Mobile Table Container (Tailored for fixed 360px without horizontal page break) */}
            <div className="w-full overflow-x-auto no-scrollbar">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-slate-200/90 text-slate-600 text-[10px] uppercase font-bold tracking-wider">
                    <th scope="col" className="py-2.5 pl-3 pr-1 font-bold text-left min-w-[70px]">
                      Partner
                    </th>
                    <th
                      scope="col"
                      className="py-2.5 px-1 text-center min-w-[42px]"
                      title="Deposits"
                    >
                      Dep.
                    </th>
                    <th
                      scope="col"
                      className="py-2.5 px-1 text-center min-w-[42px]"
                      title="Withdrawals"
                    >
                      W/d
                    </th>
                    <th
                      scope="col"
                      className="py-2.5 px-1 text-center min-w-[48px]"
                      title="Purchases"
                    >
                      Purch.
                    </th>
                    <th
                      scope="col"
                      className="py-2.5 pl-1 pr-3 text-right font-extrabold min-w-[46px] text-[#002244]"
                      title="Total Transactions"
                    >
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800 font-medium text-xs">
                  {reportData.rows.map((row) => (
                    <tr
                      key={row.partnerId}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-2.5 pl-3 pr-1 font-bold text-slate-900 truncate">
                        {row.partnerName}
                      </td>
                      <td className="py-2.5 px-1 text-center font-mono text-slate-700">
                        {row.deposits}
                      </td>
                      <td className="py-2.5 px-1 text-center font-mono text-slate-700">
                        {row.withdrawals}
                      </td>
                      <td className="py-2.5 px-1 text-center font-mono text-slate-700">
                        {row.purchases}
                      </td>
                      <td className="py-2.5 pl-1 pr-3 text-right font-mono font-extrabold text-[#002244]">
                        {row.totalTransactions}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  {/* Visually Strong Final TOTAL Row */}
                  <tr className="bg-slate-50 border-t-2 border-slate-200 text-xs font-extrabold text-slate-900">
                    <td className="py-2.5 pl-3 pr-1 font-extrabold text-[#002244] uppercase tracking-wide text-[11px]">
                      TOTAL
                    </td>
                    <td className="py-2.5 px-1 text-center font-mono font-extrabold text-slate-900">
                      {reportData.totalDeposits}
                    </td>
                    <td className="py-2.5 px-1 text-center font-mono font-extrabold text-slate-900">
                      {reportData.totalWithdrawals}
                    </td>
                    <td className="py-2.5 px-1 text-center font-mono font-extrabold text-slate-900">
                      {reportData.totalPurchases}
                    </td>
                    <td className="py-2.5 pl-1 pr-3 text-right font-mono font-black text-[#0052CC]">
                      {reportData.grandTotal}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Unobtrusive column abbreviation key for clear accessibility */}
            <div className="px-3 py-2 bg-slate-50/50 text-[10px] text-slate-500 font-medium flex items-center justify-between border-t border-slate-100">
              <span>Dep. = Deposits • W/d = Withdrawals • Purch. = Purchases</span>
            </div>
          </section>
        ) : null}

        {/* 3. Grand Total Summary Card */}
        <section
          aria-label="Grand Total Summary"
          className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between gap-3"
        >
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Transactions
            </span>
            <span className="text-xs font-semibold text-slate-600 block mt-0.5">
              All categories & partners
            </span>
          </div>

          <div className="text-right">
            <span className="text-2xl font-black text-[#002244] font-mono tracking-tight block">
              {reportData.grandTotal}
            </span>
          </div>
        </section>

        <PoweredByCinitecFooter className="py-2" />
      </main>
    </div>
  );
};
