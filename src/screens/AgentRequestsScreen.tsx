import React, { useState, useEffect } from 'react';
import {
  Home,
  FileText,
  CreditCard,
  MoreHorizontal,
  Bell,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  Plus,
  RefreshCw,
  AlertCircle,
  Inbox,
  UserCheck,
  Building2,
  Coins,
  Wallet,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import { TellerBudLogo } from '../components/TellerBudLogo';
import { isServiceEnabled } from '../utils/serviceConfig';
import { normalizeZmwAmount } from '../config/currencyConfig';
import {
  RESPONSE_WINDOW_SECONDS,
} from '../utils/requestDispatchService';
import {
  AgentRequestsPreviewState,
  IncomingCustomerRequest,
  IncomingAgentLiquidityRequestItem,
  MyAgentLiquidityRequestItem,
  BusinessOwnerRequestItem,
} from '../types';
import { PoweredByCinitecFooter } from '../components/PoweredByCinitecFooter';

interface AgentRequestsScreenProps {
  previewState?: AgentRequestsPreviewState;
  initialSegment?: 'incoming' | 'my_requests';
  initialMyRequestsCategory?: 'agent_liquidity' | 'business_owner';
  isOffline?: boolean;
  customerRequests?: IncomingCustomerRequest[];
  incomingAgentRequests?: IncomingAgentLiquidityRequestItem[];
  myAgentRequests?: MyAgentLiquidityRequestItem[];
  businessOwnerRequests?: BusinessOwnerRequestItem[];
  onSelectTab?: (tab: 'home' | 'requests' | 'transactions' | 'more') => void;
  onViewCustomerRequest?: (requestId: string) => void;
  onViewAgentLiquidityRequest?: (requestId: string) => void;
  onViewMyAgentLiquidityRequest?: (requestId: string) => void;
  onViewBusinessOwnerRequest?: (requestId: string) => void;
  onRequestLiquidity?: () => void;
}

// Sample Data Sets for Preview States
const defaultCustomerRequests: IncomingCustomerRequest[] = [
  {
    id: 'REQ-8812',
    serviceType: 'pickup',
    vendor: 'MTN',
    amount: 'ZMW 25,000.00',
    location: 'Booth 03 — Main Atrium',
    timing: 'Express Cash Pickup',
    expiresAtSeconds: RESPONSE_WINDOW_SECONDS,
    reservationFee: 'ZMW 30.00',
    agentEarnings: 'ZMW 30.00',
  },
  {
    id: 'REQ-9088',
    serviceType: 'pickup',
    vendor: 'Airtel',
    amount: 'ZMW 15,000.00',
    location: 'Booth 03 — Main Atrium',
    timing: 'Scheduled (Within 15 mins)',
    expiresAtSeconds: RESPONSE_WINDOW_SECONDS,
    reservationFee: 'ZMW 25.00',
    agentEarnings: 'ZMW 25.00',
  },
];

const defaultIncomingAgentLiquidity: IncomingAgentLiquidityRequestItem[] = [
  {
    id: 'AL-1004',
    requestType: 'cash',
    amount: 'ZMW 50,000.00',
    location: 'Zone B - Apex Supermarket Booth',
    requestingAgentName: 'Agent Samuel O.',
    status: 'available_to_respond',
    responseDeadlineSeconds: RESPONSE_WINDOW_SECONDS,
  },
  {
    id: 'AL-1008',
    requestType: 'float',
    amount: 'ZMW 100,000.00',
    location: 'Central Mall Station',
    requestingAgentName: 'Agent David K.',
    status: 'available_to_respond',
    responseDeadlineSeconds: RESPONSE_WINDOW_SECONDS,
  },
];

const mockMyAgentRequests: MyAgentLiquidityRequestItem[] = [
  {
    id: 'MAL-501',
    requestType: 'float',
    amount: 'ZMW 75,000.00',
    createdAt: 'Today, 11:20 AM',
    status: 'searching',
  },
  {
    id: 'MAL-492',
    requestType: 'cash',
    amount: 'ZMW 30,000.00',
    createdAt: 'Yesterday, 04:15 PM',
    status: 'completed',
    matchedAgentName: 'Agent Michael A.',
  },
];

const mockBusinessOwnerRequests: BusinessOwnerRequestItem[] = [
  {
    id: 'BO-201',
    requestType: 'cash',
    amount: 'ZMW 200,000.00',
    boothContext: 'Apex Supermarket #104 Booth',
    submittedAt: 'Today, 09:15 AM',
    status: 'pending_review',
  },
  {
    id: 'BO-198',
    requestType: 'float',
    amount: 'ZMW 150,000.00',
    boothContext: 'Ikeja Mall Booth #2',
    submittedAt: 'Today, 08:30 AM',
    status: 'pending_payment',
  },
  {
    id: 'BO-185',
    requestType: 'cash',
    amount: 'ZMW 100,000.00',
    boothContext: 'Apex Supermarket #104 Booth',
    submittedAt: 'Yesterday, 02:00 PM',
    status: 'paid',
    amountSupplied: 'ZMW 100,000.00',
    handoverRecordedAt: 'Yesterday, 02:45 PM',
  },
  {
    id: 'BO-172',
    requestType: 'cash',
    amount: 'ZMW 120,000.00',
    boothContext: 'Apex Supermarket #104 Booth',
    submittedAt: 'Aug 14, 09:00 AM',
    status: 'returned',
    amountSupplied: 'ZMW 120,000.00',
    handoverRecordedAt: 'Aug 14, 09:30 AM',
    returnedAt: 'Aug 14, 05:15 PM',
  },
  {
    id: 'BO-165',
    requestType: 'float',
    amount: 'ZMW 80,000.00',
    boothContext: 'Central Mall Branch #104',
    submittedAt: 'Aug 13, 08:00 AM',
    status: 'business_admin_confirmed',
    amountSupplied: 'ZMW 80,000.00',
    handoverRecordedAt: 'Aug 13, 08:30 AM',
    returnedAt: 'Aug 13, 05:00 PM',
    adminConfirmedAt: 'Aug 13, 05:30 PM',
  },
];

export const AgentRequestsScreen: React.FC<AgentRequestsScreenProps> = ({
  previewState = 'incoming_mixed',
  initialSegment,
  initialMyRequestsCategory,
  isOffline = false,
  customerRequests = defaultCustomerRequests,
  incomingAgentRequests = defaultIncomingAgentLiquidity,
  myAgentRequests = mockMyAgentRequests,
  businessOwnerRequests = mockBusinessOwnerRequests,
  onSelectTab,
  onViewCustomerRequest,
  onViewAgentLiquidityRequest,
  onViewMyAgentLiquidityRequest,
  onViewBusinessOwnerRequest,
  onRequestLiquidity,
}) => {
  const [nowTimestamp, setNowTimestamp] = useState<number>(() => Date.now());
  const [initialMountTime] = useState<number>(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNowTimestamp(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getAgentLiquidityState = (req: IncomingAgentLiquidityRequestItem) => {
    if (req.status === 'timed_out') {
      return {
        isTimedOut: true,
        badgeText: 'Timed Out',
        statusLabel: 'Status: Request Timed Out',
      };
    }

    let expiresAt: number | undefined = req.expiresAtTimestamp;
    if (!expiresAt && req.responseDeadlineSeconds && req.responseDeadlineSeconds > 0) {
      expiresAt = initialMountTime + req.responseDeadlineSeconds * 1000;
    }

    if (expiresAt) {
      const remainingMs = expiresAt - nowTimestamp;
      const remainingSecs = Math.max(0, Math.floor(remainingMs / 1000));
      if (remainingSecs <= 0) {
        return {
          isTimedOut: true,
          badgeText: 'Timed Out',
          statusLabel: 'Status: Request Timed Out',
        };
      }
      const mins = Math.floor(remainingSecs / 60);
      const secs = remainingSecs % 60;
      let badgeText = '';
      if (mins > 0) {
        badgeText = mins === 1 ? '1 min remaining' : `${mins} mins remaining`;
      } else {
        badgeText = secs === 1 ? '1 sec remaining' : `${secs} secs remaining`;
      }
      return {
        isTimedOut: false,
        badgeText,
        statusLabel: 'Status: Available to respond',
      };
    }

    return {
      isTimedOut: false,
      badgeText: 'Available to respond',
      statusLabel: 'Status: Available to respond',
    };
  };
  // Main Top Segmented Control: 'incoming' | 'my_requests'
  const [activeSegment, setActiveSegment] = useState<'incoming' | 'my_requests'>(() => {
    if (initialSegment) return initialSegment;
    if (
      previewState === 'my_agent_requests' ||
      previewState === 'business_owner_requests' ||
      previewState === 'empty_my_requests'
    ) {
      return 'my_requests';
    }
    return 'incoming';
  });

  // Filters within Incoming: 'all' | 'customer' | 'agent_liquidity'
  const [incomingFilter, setIncomingFilter] = useState<'all' | 'customer' | 'agent_liquidity'>(
    () => {
      if (previewState === 'customer_requests') return 'customer';
      if (previewState === 'agent_liquidity_incoming') return 'agent_liquidity';
      return 'all';
    }
  );

  // Categories within My Requests: 'agent_liquidity' | 'business_owner'
  const [myRequestsCategory, setMyRequestsCategory] = useState<
    'agent_liquidity' | 'business_owner'
  >(() => {
    if (initialMyRequestsCategory) return initialMyRequestsCategory;
    if (previewState === 'business_owner_requests') return 'business_owner';
    return 'agent_liquidity';
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sync when external previewState changes
  useEffect(() => {
    if (
      previewState === 'my_agent_requests' ||
      previewState === 'business_owner_requests' ||
      previewState === 'empty_my_requests'
    ) {
      setActiveSegment('my_requests');
    } else {
      setActiveSegment('incoming');
    }

    if (previewState === 'customer_requests') {
      setIncomingFilter('customer');
    } else if (previewState === 'agent_liquidity_incoming') {
      setIncomingFilter('agent_liquidity');
    } else {
      setIncomingFilter('all');
    }

    if (previewState === 'business_owner_requests') {
      setMyRequestsCategory('business_owner');
    } else {
      setMyRequestsCategory('agent_liquidity');
    }
  }, [previewState]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  const isConnectionIssue = previewState === 'connection_issue';
  const isIncomingEmpty = previewState === 'empty_incoming';
  const isMyRequestsEmpty = previewState === 'empty_my_requests';

  const getBusinessOwnerStatusExplanation = (status: BusinessOwnerRequestItem['status']) => {
    switch (status) {
      case 'pending_review':
        return 'Waiting for Business Owner review.';
      case 'approved':
        return 'Approved. Cash/Float has not yet been supplied.';
      case 'rejected':
        return 'Declined by Business Owner.';
      case 'pending_payment':
        return 'Physical handover is being arranged.';
      case 'paid':
        return 'Cash/Float handover recorded as completed.';
      case 'returned':
        return 'Cash/Float return recorded, awaiting confirmation.';
      case 'business_admin_confirmed':
        return 'Returned Cash/Float confirmed by Business Admin.';
      case 'cancelled':
        return 'Request cancelled.';
      default:
        return '';
    }
  };

  // Business Owner status badge styling helper
  const renderBusinessOwnerStatusBadge = (status: BusinessOwnerRequestItem['status']) => {
    switch (status) {
      case 'pending_review':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100/90 text-amber-900 border border-amber-200/80">
            Pending Review
          </span>
        );
      case 'approved':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-[#0052CC] border border-blue-200">
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800 border border-red-200">
            Rejected
          </span>
        );
      case 'pending_payment':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-200/80">
            Pending Payment
          </span>
        );
      case 'paid':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
            Paid
          </span>
        );
      case 'returned':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
            Returned
          </span>
        );
      case 'business_admin_confirmed':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
            Admin Confirmed
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  // Agent Liquidity status badge styling helper
  const renderAgentLiquidityStatusBadge = (status: MyAgentLiquidityRequestItem['status']) => {
    switch (status) {
      case 'searching':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100/90 text-amber-900 border border-amber-200/80">
            Searching
          </span>
        );
      case 'matched':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-[#0052CC] border border-blue-200">
            Matched
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200">
            In Progress
          </span>
        );
      case 'completed':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
            Completed
          </span>
        );
      case 'timed_out':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
            Timed Out
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 border border-slate-200">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full min-h-full bg-slate-50 flex flex-col justify-between text-slate-900 select-none overflow-hidden font-sans relative">
      {/* 1. Root Screen Header */}
      <header className="px-3.5 pt-3 pb-2.5 bg-white border-b border-slate-200/80 flex items-center justify-between shrink-0 z-10 shadow-2xs">
        <div className="flex items-center gap-2">
          <TellerBudLogo size="sm" />
          <span className="text-sm font-extrabold text-[#002244] tracking-tight">
            TellerBud
          </span>
        </div>

        <div className="text-xs font-bold text-slate-800 tracking-tight">
          Requests
        </div>

        <button
          aria-label="Notifications"
          className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#0052CC] ring-2 ring-white" />
        </button>
      </header>

      {/* 2. Top Segmented Control & Sub-filters */}
      <div className="bg-white border-b border-slate-200/80 px-3.5 pt-3 pb-2.5 shrink-0 space-y-2.5 z-10">
        {/* Main Segmented Control: [ Incoming | My Requests ] */}
        <div className="grid grid-cols-2 p-1 bg-slate-100/90 rounded-xl border border-slate-200/70">
          <button
            onClick={() => setActiveSegment('incoming')}
            className={`py-1.5 px-3 rounded-lg text-xs font-extrabold transition-all text-center flex items-center justify-center gap-1.5 ${
              activeSegment === 'incoming'
                ? 'bg-white text-[#002244] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5 text-[#0052CC]" />
            <span>Incoming</span>
          </button>

          <button
            onClick={() => setActiveSegment('my_requests')}
            className={`py-1.5 px-3 rounded-lg text-xs font-extrabold transition-all text-center flex items-center justify-center gap-1.5 ${
              activeSegment === 'my_requests'
                ? 'bg-white text-[#002244] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-[#0052CC]" />
            <span>My Requests</span>
          </button>
        </div>

        {/* Sub-filters / Categories */}
        {activeSegment === 'incoming' ? (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              onClick={() => setIncomingFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                incomingFilter === 'all'
                  ? 'bg-[#0052CC] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Incoming
            </button>
            <button
              onClick={() => setIncomingFilter('customer')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                incomingFilter === 'customer'
                  ? 'bg-[#0052CC] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Customer Service
            </button>
            <button
              onClick={() => setIncomingFilter('agent_liquidity')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                incomingFilter === 'agent_liquidity'
                  ? 'bg-[#0052CC] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Agent Liquidity
            </button>
          </div>
        ) : (
          <div className="space-y-2.5 pt-0.5">
            {/* ROW 1 — CATEGORY SELECTOR */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="tab-my-requests-agent-liquidity"
                onClick={() => setMyRequestsCategory('agent_liquidity')}
                className={`w-full min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center cursor-pointer ${
                  myRequestsCategory === 'agent_liquidity'
                    ? 'bg-[#0052CC] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Agent Liquidity
              </button>
              <button
                type="button"
                id="tab-my-requests-business-owner"
                onClick={() => setMyRequestsCategory('business_owner')}
                className={`w-full min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center cursor-pointer ${
                  myRequestsCategory === 'business_owner'
                    ? 'bg-[#0052CC] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Business Owner
              </button>
            </div>

            {/* ROW 2 — CREATE REQUEST ACTION */}
            <button
              type="button"
              id="btn-request-cash-float"
              onClick={() => {
                if (onRequestLiquidity) onRequestLiquidity();
              }}
              className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-[#0052CC] hover:bg-[#0043A8] active:bg-[#003B94] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-[0.99]"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Request Cash / Float</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. Main Vertically Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-3.5 py-3 space-y-3 pb-16">
        {/* Connection Issue Banner */}
        {isConnectionIssue && (
          <div className="bg-amber-50/90 border border-amber-200/90 rounded-xl p-3 flex items-start justify-between gap-2 shadow-2xs">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-amber-950">
                  Connection issue
                </div>
                <p className="text-[11px] text-amber-800 leading-tight mt-0.5">
                  Some requests couldn&apos;t be refreshed.
                </p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-2.5 py-1 rounded-lg bg-white border border-amber-200/90 text-amber-900 text-[10px] font-extrabold flex items-center gap-1 hover:bg-amber-50 shadow-2xs shrink-0"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* INCOMING TAB CONTENT */}
        {activeSegment === 'incoming' && (
          <>
            {isOffline ? (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-center space-y-2.5 shadow-2xs my-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <Inbox className="w-5 h-5" />
                </div>
                <div className="text-xs font-extrabold text-slate-900">
                  You're Currently Offline
                </div>
                <p className="text-[11px] text-slate-500 max-w-[240px] mx-auto leading-relaxed">
                  When you are Offline, you do not receive new Customer or Agent liquidity requests. Go Online in Availability Setup to receive incoming requests.
                </p>
              </div>
            ) : isIncomingEmpty ? (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-center space-y-2 shadow-2xs my-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <Inbox className="w-5 h-5" />
                </div>
                <div className="text-xs font-extrabold text-slate-900">
                  No incoming requests
                </div>
                <p className="text-[11px] text-slate-500 max-w-[220px] mx-auto leading-relaxed">
                  Eligible Customer or Agent liquidity requests will appear here when available.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* 1. Customer Incoming Requests */}
                {(incomingFilter === 'all' || incomingFilter === 'customer') &&
                  customerRequests
                    .filter((req) => isServiceEnabled(req.serviceType))
                    .map((req) => (
                    <div
                      key={req.id}
                      className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-2xs space-y-2.5 hover:border-slate-300 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#0052CC] border border-blue-200/60 flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            <span>Customer {req.serviceType}</span>
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            #{req.id}
                          </span>
                        </div>

                        <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-medium border border-amber-200/60 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Eligible Request</span>
                        </span>
                      </div>

                      <div className="flex items-baseline justify-between pt-0.5">
                        <div className="text-sm font-black text-[#002244] font-mono">
                          {normalizeZmwAmount(req.amount)}
                        </div>
                        <div className="text-xs font-bold text-slate-800">
                          {req.vendor}
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-500 truncate border-t border-slate-100 pt-2">
                        📍 {req.location}
                      </p>

                      <div className="pt-1 flex items-center justify-end border-t border-slate-100">
                        <button
                          onClick={() => {
                            if (onViewCustomerRequest) onViewCustomerRequest(req.id);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#0052CC] hover:bg-[#0043A8] text-white text-xs font-extrabold flex items-center gap-1 shadow-2xs transition-colors active:scale-95"
                        >
                          <span>View Request</span>
                          <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                      </div>
                    </div>
                  ))}

                {/* 2. Agent-to-Agent Incoming Liquidity Requests */}
                {(incomingFilter === 'all' || incomingFilter === 'agent_liquidity') &&
                  incomingAgentRequests.map((req) => {
                    const liquidityState = getAgentLiquidityState(req);
                    return (
                      <div
                        key={req.id}
                        className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-2xs space-y-2.5 hover:border-slate-300 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200/60 flex items-center gap-1">
                              <Coins className="w-3 h-3" />
                              <span>Agent {req.requestType}</span>
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              #{req.id}
                            </span>
                          </div>

                          <span
                            className={`text-[10px] font-medium px-2 py-0.5 rounded border ${
                              liquidityState.isTimedOut
                                ? 'bg-slate-100 text-slate-500 border-slate-200/80'
                                : 'bg-slate-100 text-slate-600 border-slate-200/60'
                            }`}
                          >
                            {liquidityState.badgeText}
                          </span>
                        </div>

                        <div className="flex items-baseline justify-between pt-0.5">
                          <div className="text-sm font-black text-[#002244] font-mono">
                            {normalizeZmwAmount(req.amount)}
                          </div>
                          <div className="text-xs font-bold text-slate-800">
                            {req.requestingAgentName}
                          </div>
                        </div>

                        {req.location && (
                          <p className="text-[11px] text-slate-500 truncate border-t border-slate-100 pt-2">
                            📍 {req.location}
                          </p>
                        )}

                        <div className="pt-1 flex items-center justify-end border-t border-slate-100">
                          {liquidityState.isTimedOut ? (
                            <button
                              disabled
                              className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-400 text-xs font-bold border border-slate-200 cursor-not-allowed"
                            >
                              <span>Timed Out</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                if (onViewAgentLiquidityRequest) onViewAgentLiquidityRequest(req.id);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold flex items-center gap-1 shadow-2xs transition-colors active:scale-95"
                            >
                              <span>View Request</span>
                              <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </>
        )}

        {/* MY REQUESTS TAB CONTENT */}
        {activeSegment === 'my_requests' && (
          <>
            {isMyRequestsEmpty ? (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-center space-y-3 shadow-2xs my-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <Wallet className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-extrabold text-slate-900">
                    No requests yet
                  </div>
                  <p className="text-[11px] text-slate-500 max-w-[220px] mx-auto leading-relaxed">
                    Cash or float requests you create will appear here.
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (onRequestLiquidity) onRequestLiquidity();
                  }}
                  className="px-4 py-2 rounded-xl bg-[#0052CC] hover:bg-[#0043A8] text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow-2xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Request Cash / Float</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {/* 1. My Agent Liquidity Requests */}
                {myRequestsCategory === 'agent_liquidity' && (
                  myAgentRequests.length === 0 ? (
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-center space-y-3 shadow-2xs my-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                        <Coins className="w-5 h-5 text-slate-500" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs font-extrabold text-slate-900">
                          No agent liquidity requests
                        </div>
                        <p className="text-[11px] text-slate-500 max-w-[220px] mx-auto leading-relaxed">
                          Agent-to-Agent liquidity requests will appear here.
                        </p>
                      </div>
                    </div>
                  ) : (
                    myAgentRequests.map((req) => (
                      <div
                        key={req.id}
                        className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-2xs space-y-2.5 hover:border-slate-300 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200/60 flex items-center gap-1">
                              <Coins className="w-3 h-3" />
                              <span>Agent {req.requestType}</span>
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              #{req.id}
                            </span>
                          </div>

                          {renderAgentLiquidityStatusBadge(req.status)}
                        </div>

                        <div className="flex items-baseline justify-between pt-0.5">
                          <div className="text-sm font-black text-[#002244] font-mono">
                            {normalizeZmwAmount(req.amount)}
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium">
                            {req.createdAt}
                          </div>
                        </div>

                        {req.matchedAgentName && (
                          <p className="text-[11px] text-slate-600 border-t border-slate-100 pt-2 flex items-center gap-1">
                            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Matched with <strong>{req.matchedAgentName}</strong></span>
                          </p>
                        )}

                        <div className="pt-1 flex items-center justify-end border-t border-slate-100">
                          <button
                            onClick={() => {
                              if (onViewMyAgentLiquidityRequest) onViewMyAgentLiquidityRequest(req.id);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1 transition-colors"
                          >
                            <span>View Details</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )
                )}

                {/* 2. Business Owner Requests */}
                {myRequestsCategory === 'business_owner' && (
                  (() => {
                    const activeBOStatuses = ['pending_review', 'approved', 'pending_payment'];
                    const sortedBusinessOwnerRequests = [...businessOwnerRequests].sort((a, b) => {
                      const aActive = activeBOStatuses.includes(a.status);
                      const bActive = activeBOStatuses.includes(b.status);
                      if (aActive && !bActive) return -1;
                      if (!aActive && bActive) return 1;
                      return 0;
                    });

                    if (sortedBusinessOwnerRequests.length === 0) {
                      return (
                        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-center space-y-3 shadow-2xs my-4">
                          <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-slate-500" />
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs font-extrabold text-slate-900">
                              No Business Owner requests
                            </div>
                            <p className="text-[11px] text-slate-500 max-w-[220px] mx-auto leading-relaxed">
                              Cash or float requests sent to your Business Owner will appear here.
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              if (onRequestLiquidity) onRequestLiquidity();
                            }}
                            className="px-4 py-2 rounded-xl bg-[#0052CC] hover:bg-[#0043A8] text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow-2xs transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Request Cash / Float</span>
                          </button>
                        </div>
                      );
                    }

                    return sortedBusinessOwnerRequests.map((req) => (
                      <div
                        key={req.id}
                        className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-2xs space-y-2.5 hover:border-slate-300 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-200 flex items-center gap-1">
                              <Building2 className="w-3 h-3 text-[#0052CC]" />
                              <span>{req.requestType.toUpperCase()} REQUEST</span>
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              #{req.id}
                            </span>
                          </div>

                          {renderBusinessOwnerStatusBadge(req.status)}
                        </div>

                        <div className="flex items-baseline justify-between pt-0.5">
                          <div className="text-sm font-black text-[#002244] font-mono">
                            {normalizeZmwAmount(req.amount)}
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium">
                            Submitted: {req.submittedAt}
                          </div>
                        </div>

                        {req.boothContext && (
                          <p className="text-[11px] text-slate-500 truncate border-t border-slate-100 pt-2">
                            🏬 {req.boothContext}
                          </p>
                        )}

                        <div className="pt-2 flex items-center justify-end border-t border-slate-100">
                          <button
                            onClick={() => {
                              if (onViewBusinessOwnerRequest) onViewBusinessOwnerRequest(req.id);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1 transition-colors shrink-0"
                          >
                            <span>View Details</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ));
                  })()
                )}
              </div>
            )}
          </>
        )}

        <PoweredByCinitecFooter className="py-2" />
      </div>

      {/* 4. Fixed Operational 4-Tab Bottom Navigation */}
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
          className="flex flex-col items-center gap-0.5 text-[#0052CC] font-extrabold py-0.5 px-3"
        >
          <FileText className="w-5 h-5 stroke-[2.5]" />
          <span className="text-[10px]">Requests</span>
        </button>

        <button
          onClick={() => {
            if (onSelectTab) onSelectTab('transactions');
          }}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 transition-colors py-0.5 px-3"
        >
          <CreditCard className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Transactions</span>
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
