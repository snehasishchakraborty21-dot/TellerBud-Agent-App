import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  Clock,
  Inbox,
  Sparkles,
  ArrowUpCircle,
  X,
  Send,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { TellerBudLogo } from '../components/TellerBudLogo';
import { AgentWalletPreviewState, WalletActivityItem, WalletTopUpRequestRecord } from '../types';
import { PoweredByCinitecFooter } from '../components/PoweredByCinitecFooter';
import {
  useSharedClock,
  formatAppTime,
  formatAttendanceRecordDate,
  createSeedWalletActivities,
} from '../utils/timeUtils';

export interface AgentWalletScreenProps {
  previewState?: AgentWalletPreviewState;
  balance?: number | string;
  currencySymbol?: string;
  activities?: WalletActivityItem[];
  agentInfo?: {
    agentId?: string;
    agentName?: string;
    booth?: string;
    store?: string;
    business?: string;
  };
  onBack?: () => void;
  onRetryRefresh?: () => void;
  onSelectActivity?: (activityId: string) => void;
  onRequestTopUp?: (requestRecord: WalletTopUpRequestRecord) => void;
}

export const AgentWalletScreen: React.FC<AgentWalletScreenProps> = ({
  previewState = 'default',
  balance = '25,000.00',
  currencySymbol = 'ZMW',
  activities: initialActivities,
  agentInfo,
  onBack,
  onRetryRefresh,
  onSelectActivity,
  onRequestTopUp,
}) => {
  const sharedClock = useSharedClock(1000);
  const [internalFilter, setInternalFilter] = useState<'all' | 'credits' | 'service_fees'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isConnectionError, setIsConnectionError] = useState(false);

  // Top-Up Request Modal State
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [isSubmittingTopUp, setIsSubmittingTopUp] = useState(false);
  const [topUpSuccessBanner, setTopUpSuccessBanner] = useState<string | null>(null);

  // Maintain stable fallback activities if not passed in props
  const [fallbackActivities] = useState<WalletActivityItem[]>(() =>
    createSeedWalletActivities(new Date(), currencySymbol)
  );

  const seedActivities = useMemo(() => {
    return initialActivities && initialActivities.length > 0
      ? initialActivities
      : fallbackActivities;
  }, [initialActivities, fallbackActivities]);

  // Determine active filter based on preview state or internal selection
  const activeFilter = useMemo(() => {
    if (previewState === 'credits_only') return 'credits';
    if (previewState === 'service_fees_only') return 'service_fees';
    return internalFilter;
  }, [previewState, internalFilter]);

  // Handle balance display format - strictly single row with ZMW
  const formattedBalance = useMemo(() => {
    const rawVal: unknown = balance;
    if (typeof rawVal === 'number') {
      return `ZMW ${Number(rawVal).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }
    const strVal = typeof rawVal === 'string' ? rawVal : '25,000.00';
    const cleanNum = strVal.replace(/^(?:ZK|ZMW|NGN|₦|\s)+/i, '').trim();
    return `ZMW ${cleanNum || '25,000.00'}`;
  }, [balance]);

  const isBalanceUnavailable = previewState === 'balance_unavailable';
  const showConnectionBanner = previewState === 'connection_issue' || isConnectionError;

  const handleSendTopUpRequest = () => {
    setIsSubmittingTopUp(true);

    setTimeout(() => {
      setIsSubmittingTopUp(false);
      const record: WalletTopUpRequestRecord = {
        id: `TOPUP-${Date.now().toString().slice(-6)}`,
        agentId: agentInfo?.agentId || 'AG-88421',
        agentName: agentInfo?.agentName || 'Marcus Vance',
        booth: agentInfo?.booth || 'Booth 03 — Main Atrium',
        store: agentInfo?.store || 'Central Mall Branch #104',
        business: agentInfo?.business || 'Apex Retail Group',
        message: 'Please top up the wallet to allow for transactions.',
        timestamp: formatAppTime(new Date()),
        rawDate: new Date().toISOString(),
        status: 'pending_admin_funding',
      };

      onRequestTopUp?.(record);
      setShowTopUpModal(false);

      // Show transient confirmation banner without altering wallet balance
      setTopUpSuccessBanner('Top-Up request sent');
      setTimeout(() => {
        setTopUpSuccessBanner(null);
      }, 3500);
    }, 350);
  };

  // Filter activities
  const filteredActivities = useMemo(() => {
    if (previewState === 'no_activity') {
      return [];
    }

    let list = [...seedActivities];

    if (activeFilter === 'credits') {
      list = list.filter((act) => act.type === 'credit');
    } else if (activeFilter === 'service_fees') {
      list = list.filter((act) => act.type === 'service_fee');
    }

    return list;
  }, [seedActivities, activeFilter, previewState]);

  // Group by date bucket dynamically derived from activity timestamp relative to shared clock date
  const { todayActivities, yesterdayActivities, earlierActivities } = useMemo(() => {
    const today: WalletActivityItem[] = [];
    const yesterday: WalletActivityItem[] = [];
    const earlier: WalletActivityItem[] = [];

    filteredActivities.forEach((item) => {
      const dateVal = item.createdAt || item.rawDate;
      const group = dateVal
        ? formatAttendanceRecordDate(dateVal, sharedClock).dateGroup
        : item.dateGroup || 'earlier';

      if (group === 'today') {
        today.push(item);
      } else if (group === 'yesterday') {
        yesterday.push(item);
      } else {
        earlier.push(item);
      }
    });

    return {
      todayActivities: today,
      yesterdayActivities: yesterday,
      earlierActivities: earlier,
    };
  }, [filteredActivities, sharedClock]);

  const handleRetry = () => {
    setIsRefreshing(true);
    if (onRetryRefresh) {
      onRetryRefresh();
    }
    setTimeout(() => {
      setIsRefreshing(false);
      setIsConnectionError(false);
    }, 900);
  };

  const renderActivityCard = (item: WalletActivityItem) => {
    const isCredit = item.type === 'credit';

    // Normalize item amount to strip legacy currency symbols and format strictly as ZMW
    const rawAmount = (item.amount || '0.00')
      .replace(/^[+-]/, '')
      .replace(/^(?:ZK|ZMW|NGN|₦|\s)+/i, '')
      .trim();
    const formattedAmountText = isCredit
      ? `+ZMW ${rawAmount}`
      : `-ZMW ${rawAmount}`;

    return (
      <div
        key={item.id}
        onClick={() => onSelectActivity?.(item.id)}
        className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-2xs hover:border-slate-300 transition-all flex items-start justify-between gap-3 cursor-default active:scale-[0.99]"
      >
        {/* Type Icon */}
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
            isCredit
              ? 'bg-blue-50 text-[#0052CC] border-blue-200/70'
              : 'bg-slate-100 text-slate-700 border-slate-200/70'
          }`}
        >
          {isCredit ? (
            <ArrowDownLeft className="w-4 h-4 text-[#0052CC] stroke-[2.2]" />
          ) : (
            <ArrowUpRight className="w-4 h-4 text-slate-600 stroke-[2.2]" />
          )}
        </div>

        {/* Activity Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-xs font-bold text-[#002244] leading-tight truncate">
              {item.title}
            </h4>
            {/* Amount */}
            <span
              className={`text-xs font-extrabold font-mono tracking-tight shrink-0 ${
                isCredit ? 'text-[#0052CC]' : 'text-[#002244]'
              }`}
            >
              {formattedAmountText}
            </span>
          </div>

          {/* Context Line */}
          <div className="flex items-center justify-between gap-2 mt-1">
            <span className="text-[11px] font-medium text-slate-600 truncate">
              {isCredit
                ? `Funded by ${item.fundedBy || 'Business Owner'}`
                : item.context || 'Transaction Fee'}
            </span>

            {/* Status Badge */}
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                isCredit
                  ? 'bg-blue-50 text-[#0052CC] border border-blue-200/70'
                  : 'bg-slate-100 text-slate-600 border border-slate-200/60'
              }`}
            >
              {item.status || (isCredit ? 'Completed' : 'Applied')}
            </span>
          </div>

          {/* Subcontext & Reference / Timestamp Line */}
          <div className="flex items-center justify-between gap-2 mt-1 pt-1.5 border-t border-slate-100 text-[10px] text-slate-400">
            <span className="font-mono truncate">
              {item.subContext ? `${item.subContext} • ` : ''}
              {item.reference || `#ACT-${item.id.slice(-4)}`}
            </span>
            <span className="font-medium shrink-0 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              {item.timestamp || (item.createdAt ? formatAppTime(item.createdAt) : '')}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full min-h-full bg-slate-50 flex flex-col justify-between text-slate-900 select-none overflow-hidden font-sans relative">
      {/* 1. Authenticated Detail Header */}
      <header className="px-3.5 pt-3 pb-2.5 bg-white border-b border-slate-200/80 flex items-center justify-between shrink-0 z-10 shadow-2xs">
        <button
          onClick={() => {
            if (onBack) onBack();
          }}
          className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors active:scale-95"
          title="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="text-xs font-bold text-slate-900 tracking-tight text-center truncate px-2">
          TellerBud Wallet
        </div>

        <div className="flex items-center justify-center shrink-0">
          <TellerBudLogo size="sm" />
        </div>
      </header>

      {/* 2. Main Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-3.5 py-3 space-y-3.5">
        {/* Transient Top-Up Success Banner */}
        {topUpSuccessBanner && (
          <div className="bg-blue-50 border border-blue-200 text-blue-950 rounded-xl p-3 shadow-2xs flex items-center justify-between gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-center gap-2 min-w-0">
              <CheckCircle2 className="w-4 h-4 text-[#0052CC] shrink-0" />
              <span className="text-xs font-bold truncate">{topUpSuccessBanner}</span>
            </div>
            <button
              onClick={() => setTopUpSuccessBanner(null)}
              className="text-[#0052CC] hover:text-blue-900 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Connection Issue Warning Banner */}
        {showConnectionBanner && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5 shadow-2xs animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <div className="font-bold">Wallet activity couldn't be refreshed.</div>
              <p className="text-[11px] text-amber-800 leading-normal">
                Showing latest cached balance and activity. Check connection and retry.
              </p>
              <button
                onClick={handleRetry}
                disabled={isRefreshing}
                className="mt-1 px-2.5 py-1 rounded-md bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] inline-flex items-center gap-1 transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Retry</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. Hero Balance Card (Deep luxury blue gradient) */}
        <div className="bg-linear-to-br from-[#002244] via-[#0A3666] to-[#001830] text-white rounded-2xl p-4 shadow-sm relative overflow-hidden">
          {/* Top Label & Shared Badge */}
          <div className="flex items-center justify-between gap-2 relative z-10">
            <div className="flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span className="text-[11px] font-bold text-slate-200 uppercase tracking-wider">
                TellerBud Wallet
              </span>
            </div>

            {/* Shared Indicator Chip */}
            <span className="px-2 py-0.5 rounded-md bg-white/10 border border-white/15 text-[10px] font-semibold text-sky-200 tracking-tight shrink-0 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-sky-300" />
              Shared across Agents
            </span>
          </div>

          {/* Current Balance Display & Top-Up Action */}
          <div className="mt-3.5 mb-2 relative z-10 flex items-end justify-between gap-2.5">
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Current Balance
              </span>
              {isBalanceUnavailable ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-amber-300">
                    Balance unavailable
                  </span>
                  <button
                    onClick={handleRetry}
                    disabled={isRefreshing}
                    className="text-xs text-sky-300 hover:text-white font-semibold underline inline-flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                    <span>Retry</span>
                  </button>
                </div>
              ) : (
                <span className="text-[22px] font-extrabold tracking-tight text-white font-mono whitespace-nowrap leading-tight">
                  {formattedBalance}
                </span>
              )}
            </div>

            {/* Top-Up Action Button inside Blue Card */}
            <button
              type="button"
              id="wallet-topup-btn"
              onClick={() => setShowTopUpModal(true)}
              className="h-10 px-3.5 py-2 rounded-xl bg-white/12 hover:bg-white/20 active:bg-white/25 border border-white/25 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] shadow-xs shrink-0 whitespace-nowrap"
            >
              <ArrowUpCircle className="w-4 h-4 text-[#38BDF8] shrink-0" />
              <span>Top-Up</span>
            </button>
          </div>

          {/* Decorative background glow */}
          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-[#0052CC]/30 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* 4. Wallet Activity Section */}
        <div className="space-y-2.5">
          {/* Section Header & Compact Filters */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Wallet Activity
            </h3>

            {/* Filter Pills */}
            <div className="flex items-center p-0.5 rounded-lg bg-slate-200/70 text-[11px] font-bold">
              <button
                onClick={() => setInternalFilter('all')}
                className={`px-2 py-0.5 rounded-md transition-all ${
                  activeFilter === 'all'
                    ? 'bg-white text-[#0052CC] shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setInternalFilter('credits')}
                className={`px-2 py-0.5 rounded-md transition-all ${
                  activeFilter === 'credits'
                    ? 'bg-white text-[#0052CC] shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Credits
              </button>
              <button
                onClick={() => setInternalFilter('service_fees')}
                className={`px-2 py-0.5 rounded-md transition-all ${
                  activeFilter === 'service_fees'
                    ? 'bg-white text-[#0052CC] shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Service Fees
              </button>
            </div>
          </div>

          {/* Activity List or Empty State */}
          {filteredActivities.length === 0 ? (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs text-center space-y-2">
              <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto border border-slate-200/60">
                <Inbox className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-extrabold text-[#002244]">
                No Wallet activity yet
              </h4>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed max-w-[240px] mx-auto">
                Wallet funding and applicable service-fee activity will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {/* Today Group */}
              {todayActivities.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                    Today
                  </div>
                  {todayActivities.map((act) => renderActivityCard(act))}
                </div>
              )}

              {/* Yesterday Group */}
              {yesterdayActivities.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                    Yesterday
                  </div>
                  {yesterdayActivities.map((act) => renderActivityCard(act))}
                </div>
              )}

              {/* Earlier Group */}
              {earlierActivities.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                    Earlier
                  </div>
                  {earlierActivities.map((act) => renderActivityCard(act))}
                </div>
              )}
            </div>
          )}
        </div>

        <PoweredByCinitecFooter className="py-2" />
      </div>

      {/* Top-Up Request Confirmation Modal */}
      {showTopUpModal && (
        <div
          id="wallet-topup-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
        >
          <div className="bg-white w-full max-w-xs rounded-2xl p-5 shadow-2xl border border-slate-100 flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0052CC] flex items-center justify-center border border-blue-100">
              <ArrowUpCircle className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Top-Up Request</h3>
              <p className="text-xs text-slate-600 mt-2 font-medium leading-relaxed">
                Please top up the wallet to allow for transactions.
              </p>
            </div>
            <div className="w-full flex flex-col gap-2 pt-1">
              <button
                type="button"
                id="confirm-send-topup-btn"
                onClick={handleSendTopUpRequest}
                disabled={isSubmittingTopUp}
                className="w-full py-3 px-4 rounded-xl bg-[#0052CC] hover:bg-[#0043A8] active:bg-[#003585] text-white font-extrabold text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-70"
              >
                {isSubmittingTopUp ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </>
                )}
              </button>
              <button
                type="button"
                id="cancel-topup-btn"
                onClick={() => setShowTopUpModal(false)}
                disabled={isSubmittingTopUp}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
