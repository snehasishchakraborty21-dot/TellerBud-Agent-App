import React, { useState, useMemo } from 'react';
import { TellerBudLogo } from '../components/TellerBudLogo';
import {
  Bell,
  Home,
  FileText,
  CreditCard,
  MoreHorizontal,
  ChevronRight,
  Truck,
  Store,
  Coins,
  Zap,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  Inbox,
  User,
} from 'lucide-react';
import {
  AgentTransactionsPreviewState,
  TransactionFilterCategory,
  AgentTransactionItem,
  RecordedTransaction,
  AgentLiquidityRequestDetail,
  WalkInTransactionRecord,
  VendorType,
} from '../types';
import { PoweredByCinitecFooter } from '../components/PoweredByCinitecFooter';
import { getVendorType, getVendorLogo } from '../config/walkInConfig';

interface AgentTransactionsScreenProps {
  previewState?: AgentTransactionsPreviewState;
  completedCustomerTxn?: RecordedTransaction | null;
  completedLiquidityRequest?: AgentLiquidityRequestDetail | null;
  completedWalkInTxn?: WalkInTransactionRecord | null;
  onSelectTab?: (tab: 'home' | 'requests' | 'transactions' | 'more') => void;
  onViewTransactionDetail?: (transactionId: string) => void;
  onRetry?: () => void;
}

// Canonical mock transaction records matching prior workflows
const defaultMockTransactions: AgentTransactionItem[] = [
  {
    id: 'TXN-901',
    transactionReference: 'TRX-829104',
    requestReference: 'CR-8012',
    category: 'customer',
    serviceType: 'delivery',
    transactionType: 'Withdrawal',
    vendorType: 'MNO',
    vendor: 'MTN',
    amount: 'ZMW 15,000.00',
    currencySymbol: 'ZMW',
    status: 'completed',
    hasSmsConfirmation: true,
    timestamp: 'Today, 11:30 AM',
    dateGroup: 'Today',
    serviceFee: 'ZMW 150.00',
  },
  {
    id: 'TXN-902',
    transactionReference: 'AL-9042',
    requestReference: 'AL-9042',
    category: 'agent_liquidity',
    liquidityType: 'cash',
    matchedAgentName: 'Michael Adeleke',
    matchedAgentId: 'AGT-7721',
    exchangeLocation: 'Sector B Hub',
    amount: 'ZMW 50,000.00',
    currencySymbol: 'ZMW',
    status: 'completed',
    timestamp: 'Today, 10:45 AM',
    dateGroup: 'Today',
  },
  {
    id: 'TXN-903',
    transactionReference: 'TRX-798412',
    requestReference: 'CR-7984',
    category: 'customer',
    serviceType: 'pickup',
    transactionType: 'Cash In',
    vendorType: 'MNO',
    vendor: 'Airtel',
    amount: 'ZMW 20,000.00',
    currencySymbol: 'ZMW',
    status: 'completed',
    hasSmsConfirmation: true,
    timestamp: 'Today, 09:15 AM',
    dateGroup: 'Today',
    serviceFee: 'ZMW 200.00',
  },
  {
    id: 'TXN-904',
    transactionReference: 'WI-20418',
    category: 'walk_in',
    walkInType: 'Withdrawal',
    vendorType: 'MNO',
    vendor: 'MTN',
    amount: 'ZMW 10,000.00',
    currencySymbol: 'ZMW',
    status: 'recorded',
    timestamp: 'Yesterday, 03:20 PM',
    dateGroup: 'Yesterday',
  },
  {
    id: 'TXN-905',
    transactionReference: 'AL-8831',
    requestReference: 'AL-8831',
    category: 'agent_liquidity',
    liquidityType: 'float',
    vendorType: 'MNO',
    vendor: 'MTN',
    matchedAgentName: 'Sarah Kalu',
    matchedAgentId: 'AGT-6510',
    exchangeLocation: 'Central Mall Kiosk #02',
    amount: 'ZMW 75,000.00',
    currencySymbol: 'ZMW',
    status: 'completed',
    timestamp: 'Yesterday, 11:40 AM',
    dateGroup: 'Yesterday',
  },
  {
    id: 'TXN-906',
    transactionReference: 'TRX-661042',
    requestReference: 'CR-7450',
    category: 'customer',
    serviceType: 'delivery',
    transactionType: 'Deposit',
    vendorType: 'Bank',
    vendor: 'Zanaco',
    amount: 'ZMW 35,000.00',
    currencySymbol: 'ZMW',
    status: 'completed',
    hasSmsConfirmation: true,
    timestamp: '12 Aug, 04:10 PM',
    dateGroup: 'Earlier',
    serviceFee: 'ZMW 350.00',
  },
  {
    id: 'TXN-907',
    transactionReference: 'WI-20419',
    category: 'walk_in',
    walkInType: 'Deposit',
    vendorType: 'Bank',
    vendor: 'FNB',
    amount: 'ZMW 18,500.00',
    currencySymbol: 'ZMW',
    status: 'recorded',
    timestamp: '11 Aug, 02:15 PM',
    dateGroup: 'Earlier',
  },
  {
    id: 'TXN-908',
    transactionReference: 'AL-8832',
    requestReference: 'AL-8832',
    category: 'agent_liquidity',
    liquidityType: 'float',
    vendorType: 'Bank',
    vendor: 'Stanbic',
    matchedAgentName: 'John Phiri',
    matchedAgentId: 'AGT-4402',
    exchangeLocation: 'Manda Hill Agent Booth',
    amount: 'ZMW 40,000.00',
    currencySymbol: 'ZMW',
    status: 'completed',
    timestamp: '10 Aug, 11:00 AM',
    dateGroup: 'Earlier',
  },
];

export const AgentTransactionsScreen: React.FC<AgentTransactionsScreenProps> = ({
  previewState = 'mixed_transactions',
  completedCustomerTxn,
  completedLiquidityRequest,
  completedWalkInTxn,
  onSelectTab,
  onViewTransactionDetail,
  onRetry,
}) => {
  // Category filter state
  const [activeFilter, setActiveFilter] = useState<TransactionFilterCategory>(() => {
    if (previewState === 'customer_transactions') return 'customer';
    if (previewState === 'agent_liquidity') return 'agent_liquidity';
    if (previewState === 'walk_in') return 'walk_in';
    return 'all';
  });

  // Re-sync filter when previewState prop changes
  React.useEffect(() => {
    if (previewState === 'customer_transactions') setActiveFilter('customer');
    else if (previewState === 'agent_liquidity') setActiveFilter('agent_liquidity');
    else if (previewState === 'walk_in') setActiveFilter('walk_in');
  }, [previewState]);

  // Merge live completed workflows into the centralized transactions list
  const allTransactions = useMemo(() => {
    if (previewState === 'empty') {
      return [];
    }

    const list = [...defaultMockTransactions];

    // Merge completed customer transaction from Screen 09 if present
    if (completedCustomerTxn) {
      const exists = list.some(
        (t) => t.id === completedCustomerTxn.id || t.requestReference === completedCustomerTxn.requestReference
      );
      if (!exists) {
        list.unshift({
          id: completedCustomerTxn.id || 'TXN-LIVE-CUST',
          transactionReference: completedCustomerTxn.requestReference
            ? `TRX-${completedCustomerTxn.requestReference.replace('CR-', '')}`
            : 'TRX-LIVE',
          requestReference: completedCustomerTxn.requestReference || 'CR-8012',
          category: 'customer',
          serviceType: completedCustomerTxn.serviceType || 'delivery',
          transactionType: 'Withdrawal',
          vendorType: completedCustomerTxn.vendorType || (completedCustomerTxn.vendor ? getVendorType(completedCustomerTxn.vendor) : undefined) || 'MNO',
          vendor: completedCustomerTxn.vendor || 'MTN',
          amount: completedCustomerTxn.amount || 'ZMW 15,000.00',
          currencySymbol: 'ZMW',
          status: 'completed',
          hasSmsConfirmation: true,
          timestamp: completedCustomerTxn.timestamp || 'Today, Just now',
          dateGroup: 'Today',
          serviceFee: completedCustomerTxn.serviceFee,
        });
      }
    }

    // Merge completed liquidity exchange from Screen 15 if present
    if (completedLiquidityRequest && completedLiquidityRequest.status === 'completed') {
      const exists = list.some(
        (t) => t.id === completedLiquidityRequest.id || t.transactionReference === completedLiquidityRequest.id
      );
      if (!exists) {
        list.unshift({
          id: completedLiquidityRequest.id || 'TXN-LIVE-LIQ',
          transactionReference: completedLiquidityRequest.id || 'AL-9042',
          requestReference: completedLiquidityRequest.requestReference || completedLiquidityRequest.id,
          category: 'agent_liquidity',
          liquidityType: completedLiquidityRequest.requestType || 'cash',
          vendorType: completedLiquidityRequest.vendorType || (completedLiquidityRequest.vendor ? getVendorType(completedLiquidityRequest.vendor) : undefined),
          vendor: completedLiquidityRequest.vendor,
          matchedAgentName: completedLiquidityRequest.matchedAgent?.name || 'Michael Adeleke',
          matchedAgentId: completedLiquidityRequest.matchedAgent?.agentId || 'AGT-7721',
          exchangeLocation: completedLiquidityRequest.exchangeLocation || 'Sector B Hub',
          amount: completedLiquidityRequest.amount || 'ZMW 50,000.00',
          currencySymbol: 'ZMW',
          status: 'completed',
          timestamp: completedLiquidityRequest.completedAt || 'Today, Just now',
          dateGroup: 'Today',
        });
      }
    }

    // Merge completed walk-in transaction from Screen 22 if present
    if (completedWalkInTxn && (completedWalkInTxn.status === 'recorded' || completedWalkInTxn.status === 'completed')) {
      const exists = list.some(
        (t) => t.id === completedWalkInTxn.id || t.transactionReference === completedWalkInTxn.transactionReference
      );
      if (!exists) {
        list.unshift({
          id: completedWalkInTxn.id || 'TXN-LIVE-WI',
          transactionReference: completedWalkInTxn.transactionReference,
          category: 'walk_in',
          walkInType: completedWalkInTxn.transactionType,
          vendorType: completedWalkInTxn.vendorType || (completedWalkInTxn.vendor ? getVendorType(completedWalkInTxn.vendor) : undefined) || 'MNO',
          vendor: completedWalkInTxn.vendor,
          amount: completedWalkInTxn.amount,
          currencySymbol: completedWalkInTxn.currencySymbol || 'ZMW',
          status: 'recorded',
          timestamp: completedWalkInTxn.recordedAt || 'Today, Just now',
          dateGroup: 'Today',
          serviceFee: completedWalkInTxn.serviceFee,
        });
      }
    }

    return list;
  }, [previewState, completedCustomerTxn, completedLiquidityRequest, completedWalkInTxn]);

  // Filter transactions based on active category
  const filteredTransactions = useMemo(() => {
    if (previewState === 'empty') return [];

    let filtered = allTransactions;
    if (activeFilter === 'customer') {
      filtered = allTransactions.filter((t) => t.category === 'customer');
    } else if (activeFilter === 'agent_liquidity') {
      filtered = allTransactions.filter((t) => t.category === 'agent_liquidity');
    } else if (activeFilter === 'walk_in') {
      filtered = allTransactions.filter((t) => t.category === 'walk_in');
    }

    return filtered;
  }, [allTransactions, activeFilter, previewState]);

  // Natural chronological date groupings
  const groupedTransactions = useMemo(() => {
    const groups: { [key: string]: AgentTransactionItem[] } = {
      Today: [],
      Yesterday: [],
      Earlier: [],
    };

    filteredTransactions.forEach((txn) => {
      const group = txn.dateGroup || 'Earlier';
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(txn);
    });

    return Object.entries(groups).filter(([_, items]) => items.length > 0);
  }, [filteredTransactions]);

  // Count for compact summary (today's activity)
  const todayCount = useMemo(() => {
    return allTransactions.filter((t) => t.dateGroup === 'Today').length;
  }, [allTransactions]);

  const isConnectionIssue = previewState === 'connection_issue';

  // Status visual badge styling helper
  const renderStatusBadge = (status: AgentTransactionItem['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
            Completed
          </span>
        );
      case 'recorded':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-[#0052CC] border border-blue-200">
            Recorded
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200">
            In Progress
          </span>
        );
      case 'failed':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
            Failed
          </span>
        );
      default:
        return null;
    }
  };

  // Category Icon & Background Helper
  const renderTransactionIcon = (txn: AgentTransactionItem) => {
    if (txn.category === 'customer') {
      if (txn.serviceType === 'delivery') {
        return (
          <div className="w-8 h-8 rounded-xl bg-sky-50 text-[#0052CC] border border-sky-100 flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4" />
          </div>
        );
      }
      return (
        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
          <Store className="w-4 h-4" />
        </div>
      );
    }

    if (txn.category === 'agent_liquidity') {
      if (txn.liquidityType === 'cash') {
        return (
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center shrink-0">
            <Coins className="w-4 h-4" />
          </div>
        );
      }
      return (
        <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center shrink-0">
          <Zap className="w-4 h-4" />
        </div>
      );
    }

    // Walk-In
    return (
      <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center shrink-0">
        <UserCheck className="w-4 h-4" />
      </div>
    );
  };

  // Primary Transaction Title Helper (Line 1: Service / Category)
  const getPrimaryTitle = (txn: AgentTransactionItem) => {
    if (txn.category === 'customer') {
      return txn.serviceType === 'delivery' ? 'Customer Delivery' : 'Customer Pickup';
    }
    if (txn.category === 'agent_liquidity') {
      return txn.liquidityType === 'cash' ? 'Cash Exchange' : 'Float Exchange';
    }
    if (txn.category === 'walk_in') {
      return 'Walk-In';
    }
    return 'Transaction';
  };

  // Secondary Transaction Type Helper (Line 2: Transaction Type)
  const getSecondaryType = (txn: AgentTransactionItem) => {
    if (txn.category === 'customer') {
      return txn.transactionType || (txn.serviceType === 'delivery' ? 'Withdrawal' : 'Cash In');
    }
    if (txn.category === 'walk_in') {
      return txn.walkInType || 'Cash Out';
    }
    if (txn.category === 'agent_liquidity') {
      return txn.transactionType || undefined;
    }
    return undefined;
  };

  return (
    <div className="w-full h-full min-h-full bg-slate-50 flex flex-col justify-between text-slate-900 select-none overflow-hidden font-sans relative">
      {/* 1. Root Screen Header (Same family as Screen 04 / Screen 10) */}
      <header className="px-3.5 pt-3 pb-2.5 bg-white border-b border-slate-200/80 flex items-center justify-between shrink-0 z-10 shadow-2xs">
        <div className="flex items-center gap-2">
          <TellerBudLogo size="sm" />
          <span className="text-sm font-extrabold text-[#002244] tracking-tight">
            TellerBud
          </span>
        </div>

        <div className="text-xs font-bold text-slate-800 tracking-tight">
          Transactions
        </div>

        <button
          aria-label="Notifications"
          onClick={() => onSelectTab?.('requests')}
          className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors relative"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {isConnectionIssue && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#0052CC] ring-2 ring-white" />
          )}
        </button>
      </header>

      {/* 2. Compact Horizontal Category Filter */}
      <div className="bg-white border-b border-slate-200/80 px-3.5 py-2.5 shrink-0 z-10 space-y-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs transition-all whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-[#0052CC] text-white font-bold shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter('customer')}
            className={`px-3 py-1.5 rounded-xl text-xs transition-all whitespace-nowrap ${
              activeFilter === 'customer'
                ? 'bg-[#0052CC] text-white font-bold shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold'
            }`}
          >
            Customer
          </button>
          <button
            onClick={() => setActiveFilter('agent_liquidity')}
            className={`px-3 py-1.5 rounded-xl text-xs transition-all whitespace-nowrap ${
              activeFilter === 'agent_liquidity'
                ? 'bg-[#0052CC] text-white font-bold shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold'
            }`}
          >
            Agent Liquidity
          </button>
          <button
            onClick={() => setActiveFilter('walk_in')}
            className={`px-3 py-1.5 rounded-xl text-xs transition-all whitespace-nowrap ${
              activeFilter === 'walk_in'
                ? 'bg-[#0052CC] text-white font-bold shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold'
            }`}
          >
            Walk-In
          </button>
        </div>

        {/* Compact Summary Line (Section 21: only if count exists) */}
        {allTransactions.length > 0 && !isConnectionIssue && previewState !== 'empty' && (
          <div className="flex items-center justify-between pt-0.5 text-[11px] text-slate-500 font-medium px-0.5">
            <span>Today's activity</span>
            <span className="font-bold text-slate-700">
              {todayCount} transaction{todayCount === 1 ? '' : 's'} recorded
            </span>
          </div>
        )}
      </div>

      {/* 3. Main Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-3.5 py-3 space-y-4">
        {/* Connection Issue Warning Banner */}
        {isConnectionIssue && (
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200/90 text-amber-900 flex items-start gap-2.5 shadow-2xs">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs">
              <span className="font-bold block text-amber-900">
                Some transactions couldn't be refreshed.
              </span>
              <span className="text-[11px] text-amber-800 block mt-0.5">
                Displaying cached transaction records. Check network or retry.
              </span>
              <button
                onClick={() => {
                  if (onRetry) onRetry();
                }}
                className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] transition-colors shadow-2xs"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Retry</span>
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredTransactions.length === 0 ? (
          <div className="py-12 px-4 text-center flex flex-col items-center justify-center space-y-2.5">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-1">
              <Inbox className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No transactions yet</h3>
            <p className="text-xs text-slate-500 max-w-[240px] leading-relaxed">
              Completed and recorded transaction activity will appear here.
            </p>
          </div>
        ) : (
          /* Chronologically Grouped List */
          <div className="space-y-4">
            {groupedTransactions.map(([groupName, items]) => (
              <div key={groupName} className="space-y-2">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">
                  {groupName}
                </div>

                <div className="space-y-2">
                  {items.map((txn) => (
                    <div
                      key={txn.id}
                      onClick={() => {
                        if (onViewTransactionDetail) {
                          onViewTransactionDetail(txn.id);
                        }
                      }}
                      className="bg-white border border-slate-200/90 hover:border-[#0052CC]/40 rounded-2xl p-3 shadow-2xs transition-all cursor-pointer active:scale-[0.99] space-y-2"
                    >
                      {/* Top Row: Category Icon + Title/Type/Ref + Amount */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5 min-w-0 flex-1">
                          {renderTransactionIcon(txn)}
                          <div className="min-w-0 flex-1">
                            {/* Primary Title (Line 1) */}
                            <span className="text-xs font-bold text-slate-900 block leading-tight">
                              {getPrimaryTitle(txn)}
                            </span>
                            {/* Secondary Transaction Type (Line 2) */}
                            {getSecondaryType(txn) && (
                              <span className="text-[11px] font-semibold text-slate-600 block leading-tight mt-0.5">
                                {getSecondaryType(txn)}
                              </span>
                            )}
                            {/* Reference */}
                            <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                              #{txn.transactionReference || txn.id}
                            </span>
                          </div>
                        </div>

                        {/* Amount */}
                        <div className="text-right shrink-0 pt-0.5">
                          <span className="text-sm font-extrabold text-[#002244] tracking-tight block">
                            {txn.amount}
                          </span>
                        </div>
                      </div>

                      {/* Middle Row: Relevant Secondary Details */}
                      <div className="pt-1 border-t border-slate-100 flex items-center justify-between gap-2 text-[11px] text-slate-600">
                        {/* Customer Secondary Info */}
                        {txn.category === 'customer' && (
                          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                            {txn.vendor && (
                              <div className="flex items-center gap-1">
                                {(txn.vendorType || getVendorType(txn.vendor)) && (
                                  <span className="font-bold text-[#0052CC] bg-blue-50 px-1.5 py-0.5 rounded text-[9.5px] border border-blue-100">
                                    {txn.vendorType || getVendorType(txn.vendor)}
                                  </span>
                                )}
                                <span className="font-semibold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded text-[10px] flex items-center gap-1">
                                  {getVendorLogo(txn.vendor) && (
                                    <div className="w-3.5 h-3.5 rounded-xs bg-white border border-slate-200 p-[1px] flex items-center justify-center shrink-0 overflow-hidden">
                                      <img
                                        src={getVendorLogo(txn.vendor)}
                                        alt={txn.vendor}
                                        className="w-full h-full object-contain"
                                        referrerPolicy="no-referrer"
                                      />
                                    </div>
                                  )}
                                  <span>{txn.vendor}</span>
                                </span>
                              </div>
                            )}
                            {txn.hasSmsConfirmation && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                <span>Vendor confirmation captured</span>
                              </span>
                            )}
                          </div>
                        )}

                        {/* Agent Liquidity Secondary Info */}
                        {txn.category === 'agent_liquidity' && (
                          <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                            {txn.vendor && (
                              <div className="flex items-center gap-1">
                                {(txn.vendorType || getVendorType(txn.vendor)) && (
                                  <span className="font-bold text-[#0052CC] bg-blue-50 px-1.5 py-0.5 rounded text-[9.5px] border border-blue-100">
                                    {txn.vendorType || getVendorType(txn.vendor)}
                                  </span>
                                )}
                                <span className="font-semibold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded text-[10px] flex items-center gap-1">
                                  {getVendorLogo(txn.vendor) && (
                                    <div className="w-3.5 h-3.5 rounded-xs bg-white border border-slate-200 p-[1px] flex items-center justify-center shrink-0 overflow-hidden">
                                      <img
                                        src={getVendorLogo(txn.vendor)}
                                        alt={txn.vendor}
                                        className="w-full h-full object-contain"
                                        referrerPolicy="no-referrer"
                                      />
                                    </div>
                                  )}
                                  <span>{txn.vendor}</span>
                                </span>
                              </div>
                            )}
                            <div className="flex items-center gap-1 min-w-0">
                              <User className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="text-slate-700 font-medium truncate">
                                {txn.matchedAgentName || 'Matched Agent'}
                                {txn.matchedAgentId ? ` (${txn.matchedAgentId})` : ''}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Walk-In Secondary Info */}
                        {txn.category === 'walk_in' && (
                          <div className="flex items-center gap-2 flex-wrap">
                            {txn.vendor && (
                              <div className="flex items-center gap-1">
                                {(txn.vendorType || getVendorType(txn.vendor)) && (
                                  <span className="font-bold text-[#0052CC] bg-blue-50 px-1.5 py-0.5 rounded text-[9.5px] border border-blue-100">
                                    {txn.vendorType || getVendorType(txn.vendor)}
                                  </span>
                                )}
                                <span className="font-semibold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded text-[10px] flex items-center gap-1">
                                  {getVendorLogo(txn.vendor) && (
                                    <div className="w-3.5 h-3.5 rounded-xs bg-white border border-slate-200 p-[1px] flex items-center justify-center shrink-0 overflow-hidden">
                                      <img
                                        src={getVendorLogo(txn.vendor)}
                                        alt={txn.vendor}
                                        className="w-full h-full object-contain"
                                        referrerPolicy="no-referrer"
                                      />
                                    </div>
                                  )}
                                  <span>{txn.vendor}</span>
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Bottom Row: Status Badge + Timestamp + Chevron */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2">
                          {renderStatusBadge(txn.status)}
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            {txn.timestamp}
                          </span>
                        </div>

                        <div className="flex items-center text-slate-400 hover:text-slate-600 text-xs font-semibold">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <PoweredByCinitecFooter className="py-2" />
      </div>

      {/* 4. Fixed Operational 4-Tab Bottom Navigation (Transactions Active) */}
      <nav className="bg-white border-t border-slate-200/90 px-3 py-2 flex items-center justify-around shrink-0 z-20 shadow-lg">
        <button
          onClick={() => {
            if (onSelectTab) onSelectTab('home');
          }}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 transition-colors py-0.5 px-3"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Home</span>
        </button>

        <button
          onClick={() => {
            if (onSelectTab) onSelectTab('requests');
          }}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 transition-colors py-0.5 px-3"
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Requests</span>
        </button>

        <button
          onClick={() => {
            if (onSelectTab) onSelectTab('transactions');
          }}
          className="flex flex-col items-center gap-0.5 text-[#0052CC] font-extrabold py-0.5 px-3"
        >
          <CreditCard className="w-5 h-5 stroke-[2.5]" />
          <span className="text-[10px]">Transactions</span>
        </button>

        <button
          onClick={() => {
            if (onSelectTab) onSelectTab('more');
          }}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 transition-colors py-0.5 px-3"
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[10px] font-semibold">More</span>
        </button>
      </nav>
    </div>
  );
};
