import React, { useState, useEffect } from 'react';
import {
  Truck,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Info,
  X,
  AlertTriangle,
  ChevronRight,
  User,
  Coins,
  TrendingUp,
} from 'lucide-react';
import { TellerBudLogo } from '../components/TellerBudLogo';
import { IncomingCustomerRequest, RequestDetailPreviewState } from '../types';
import { PoweredByCinitecFooter } from '../components/PoweredByCinitecFooter';
import {
  RESPONSE_WINDOW_SECONDS,
  getOrCreateOfferExpiresAt,
  calculateRemainingSeconds,
  formatCountdownDigits,
  relayCustomerRequest,
} from '../utils/requestDispatchService';

import { getVendorType, getVendorLogo } from '../config/walkInConfig';

interface IncomingCustomerRequestScreenProps {
  request?: IncomingCustomerRequest;
  previewState?: RequestDetailPreviewState;
  assignment?: {
    business?: string;
    store?: string;
    booth?: string;
    location?: string;
    agentName?: string;
    agentId?: string;
  };
  onBack?: () => void;
  onAcceptSuccess?: (requestId: string) => void;
  onViewAssignedService?: (requestId: string) => void;
  onRejectSuccess?: () => void;
}

const defaultPickupRequest: IncomingCustomerRequest = {
  id: 'REQ-9088',
  requestReference: 'REQ-9088',
  requestOrigin: 'Customer',
  customerName: 'John Banda',
  serviceType: 'pickup',
  transactionType: 'Withdrawal',
  vendorType: 'MNO',
  vendor: 'MTN',
  amount: 'ZMW 15,000.00',
  location: 'Booth 03 — Main Atrium',
  agentLocation: 'Booth 03 — Main Atrium',
  timing: 'Scheduled (Within 15 mins)',
  expiresAtSeconds: RESPONSE_WINDOW_SECONDS,
  reservationFee: 'ZMW 30.00',
  agentEarnings: 'ZMW 30.00',
};

// Phase 2 placeholder delivery request retained internally for future development
const defaultDeliveryRequest: IncomingCustomerRequest = {
  id: 'REQ-9082',
  requestReference: 'REQ-9082',
  requestOrigin: 'Customer',
  customerName: 'John Banda',
  serviceType: 'pickup', // Phase 1 normal request is Pickup
  transactionType: 'Withdrawal',
  vendorType: 'MNO',
  vendor: 'MTN',
  amount: 'ZMW 15,000.00',
  location: 'Booth 03 — Main Atrium',
  agentLocation: 'Booth 03 — Main Atrium',
  expiresAtSeconds: RESPONSE_WINDOW_SECONDS,
  reservationFee: 'ZMW 30.00',
  agentEarnings: 'ZMW 30.00',
};

type InternalStatus =
  | 'AVAILABLE'
  | 'RESPONDING'
  | 'ASSIGNED_TO_AGENT'
  | 'ASSIGNED_ELSEWHERE'
  | 'TIMED_OUT'
  | 'REJECTED_BY_AGENT'
  | 'CONNECTION_ISSUE';

export const IncomingCustomerRequestScreen: React.FC<
  IncomingCustomerRequestScreenProps
> = ({
  request: initialRequest,
  previewState,
  assignment,
  onBack,
  onAcceptSuccess,
  onViewAssignedService,
  onRejectSuccess,
}) => {
  const currentAgentId = assignment?.agentId || 'AG-88421';

  // Phase 1 is strictly Pickup-only for incoming customer requests
  const baseRequest: IncomingCustomerRequest = initialRequest
    ? {
        ...initialRequest,
        customerName: initialRequest.customerName || 'John Banda',
        serviceType: 'pickup' as const,
        requestOrigin: 'Customer' as const,
        transactionType: initialRequest.transactionType || 'Withdrawal',
        vendor: initialRequest.vendor || 'MTN',
        agentLocation: initialRequest.agentLocation || assignment?.booth || 'Booth 03 — Main Atrium',
        timing: initialRequest.timing || 'Scheduled (Within 15 mins)',
        expiresAtSeconds: initialRequest.expiresAtSeconds || RESPONSE_WINDOW_SECONDS,
        reservationFee: initialRequest.reservationFee || initialRequest.agentEarnings || 'ZMW 30.00',
        agentEarnings: initialRequest.agentEarnings || initialRequest.reservationFee || 'ZMW 30.00',
      }
    : defaultPickupRequest;

  const effectiveRequest: IncomingCustomerRequest = {
    ...baseRequest,
    vendor: baseRequest.vendor === 'Apex Supermarket #104' ? 'MTN' : baseRequest.vendor || 'MTN',
    agentLocation: baseRequest.agentLocation || assignment?.booth || 'Booth 03 — Main Atrium',
  };

  // Authoritative expiration timestamp (persisted across re-renders and navigation)
  const [offerExpiresAt] = useState<number>(() => {
    if (previewState === 'timed_out') return Date.now() - 1000;
    return getOrCreateOfferExpiresAt(
      effectiveRequest.id,
      effectiveRequest.offerExpiresAtTimestamp,
      RESPONSE_WINDOW_SECONDS
    );
  });

  // Internal status management
  const [status, setStatus] = useState<InternalStatus>(() => {
    if (previewState === 'timed_out') return 'TIMED_OUT';
    if (previewState === 'assigned_elsewhere' || previewState === 'unavailable') return 'ASSIGNED_ELSEWHERE';
    if (previewState === 'responding' || previewState === 'accepting') return 'RESPONDING';
    if (previewState === 'assigned_to_you') return 'ASSIGNED_TO_AGENT';
    if (previewState === 'rejected') return 'REJECTED_BY_AGENT';
    if (previewState === 'connection_issue') return 'CONNECTION_ISSUE';
    return 'AVAILABLE';
  });

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(() => {
    if (previewState === 'timed_out') return 0;
    return calculateRemainingSeconds(offerExpiresAt);
  });
  const [relayedToAgentName, setRelayedToAgentName] = useState<string | null>(null);

  // Synchronize status with external previewState overrides
  useEffect(() => {
    if (!previewState) return;
    switch (previewState) {
      case 'delivery_request':
      case 'pickup_request':
        setStatus('AVAILABLE');
        setSecondsLeft(calculateRemainingSeconds(offerExpiresAt));
        break;
      case 'responding':
      case 'accepting':
        setStatus('RESPONDING');
        break;
      case 'assigned_to_you':
        setStatus('ASSIGNED_TO_AGENT');
        break;
      case 'assigned_elsewhere':
      case 'unavailable':
        setStatus('ASSIGNED_ELSEWHERE');
        break;
      case 'timed_out':
        setStatus('TIMED_OUT');
        setSecondsLeft(0);
        break;
      case 'connection_issue':
        setStatus('CONNECTION_ISSUE');
        break;
      case 'rejected':
        setStatus('REJECTED_BY_AGENT');
        break;
      default:
        setStatus('AVAILABLE');
    }
  }, [previewState, offerExpiresAt]);

  // Authoritative real-time countdown timer effect based on offerExpiresAt
  useEffect(() => {
    if (status !== 'AVAILABLE') return;

    const tick = () => {
      const remaining = calculateRemainingSeconds(offerExpiresAt);
      setSecondsLeft(remaining);

      if (remaining <= 0) {
        setStatus('TIMED_OUT');
        setShowRejectModal(false);
        // Automatically relay the underlying customer request to next eligible agent
        const relayResult = relayCustomerRequest(effectiveRequest, currentAgentId, 'timeout');
        setRelayedToAgentName(relayResult.nextAgent.name);
      }
    };

    tick();
    const interval = setInterval(tick, 500);
    return () => clearInterval(interval);
  }, [status, offerExpiresAt, effectiveRequest, currentAgentId]);

  // Auto-dismiss reject modal if request status is no longer AVAILABLE
  useEffect(() => {
    if (status !== 'AVAILABLE' && showRejectModal) {
      setShowRejectModal(false);
    }
  }, [status, showRejectModal]);

  // Handle Accept Request action: automatic assignment
  const handleAcceptRequest = () => {
    const remaining = calculateRemainingSeconds(offerExpiresAt);
    if (status !== 'AVAILABLE' && status !== 'CONNECTION_ISSUE') return;
    if (remaining <= 0 || previewState === 'timed_out') {
      setStatus('TIMED_OUT');
      return;
    }

    setStatus('RESPONDING');

    // Simulate atomic verification and assignment
    setTimeout(() => {
      if (previewState === 'assigned_elsewhere' || previewState === 'unavailable') {
        setStatus('ASSIGNED_ELSEWHERE');
        return;
      }
      if (previewState === 'timed_out' || calculateRemainingSeconds(offerExpiresAt) <= 0) {
        setStatus('TIMED_OUT');
        return;
      }
      if (previewState === 'connection_issue') {
        setStatus('CONNECTION_ISSUE');
        return;
      }

      setStatus('ASSIGNED_TO_AGENT');

      if (onAcceptSuccess) {
        onAcceptSuccess(effectiveRequest.id);
      } else if (onViewAssignedService) {
        onViewAssignedService(effectiveRequest.id);
      }
    }, 600);
  };

  // Confirm rejection in modal with live availability revalidation & immediate relay
  const handleConfirmReject = () => {
    setShowRejectModal(false);
    const remaining = calculateRemainingSeconds(offerExpiresAt);

    if (status !== 'AVAILABLE' || remaining <= 0) {
      if (remaining <= 0) {
        setStatus('TIMED_OUT');
      }
      return;
    }

    setStatus('REJECTED_BY_AGENT');
    // Relay immediately to next eligible agent
    const relayResult = relayCustomerRequest(effectiveRequest, currentAgentId, 'declined');
    setRelayedToAgentName(relayResult.nextAgent.name);

    setTimeout(() => {
      if (onRejectSuccess) {
        onRejectSuccess();
      } else if (onBack) {
        onBack();
      }
    }, 900);
  };

  const earningAmount =
    effectiveRequest.reservationFee || effectiveRequest.agentEarnings || 'ZMW 30.00';

  return (
    <div className="w-full h-full min-h-full bg-slate-50 flex flex-col justify-between text-slate-900 select-none overflow-hidden font-sans relative">
      {/* 1. Header (Compact Authenticated Detail Header) */}
      <header className="px-3.5 pt-3 pb-2.5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-900 tracking-tight">
            Incoming Request
          </span>
          {(effectiveRequest.requestReference || effectiveRequest.id) && (
            <span className="text-[10px] font-mono text-slate-400 bg-slate-200/60 px-1.5 py-0.5 rounded">
              #{effectiveRequest.requestReference || effectiveRequest.id}
            </span>
          )}
        </div>

        <TellerBudLogo size="sm" />
      </header>

      {/* 2. Vertically Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-3.5 py-3 space-y-3 pb-3">
        {/* Status Banners for Transition / Terminal States */}
        {status === 'RESPONDING' && (
          <div className="bg-blue-50/90 border border-blue-200/80 rounded-xl p-3 flex items-center gap-2.5">
            <Loader2 className="w-4 h-4 text-[#0052CC] animate-spin shrink-0" />
            <div className="text-xs font-bold text-[#002244]">Accepting request...</div>
          </div>
        )}

        {status === 'ASSIGNED_TO_AGENT' && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <div className="text-xs font-bold text-emerald-950">
              Assigned to You
            </div>
          </div>
        )}

        {status === 'ASSIGNED_ELSEWHERE' && (
          <div className="bg-slate-100 border border-slate-300 rounded-xl p-3 flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-slate-200 text-slate-600 flex items-center justify-center shrink-0">
              <Info className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <div className="text-xs font-bold text-slate-900">
              Request no longer available
            </div>
          </div>
        )}

        {status === 'TIMED_OUT' && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <div className="text-xs font-bold text-amber-950">
              Request Expired
            </div>
          </div>
        )}

        {status === 'REJECTED_BY_AGENT' && (
          <div className="bg-slate-100 border border-slate-300 rounded-xl p-3 flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-slate-200 text-slate-600 flex items-center justify-center shrink-0">
              <XCircle className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <div className="text-xs font-bold text-slate-900">Request Declined</div>
          </div>
        )}

        {status === 'CONNECTION_ISSUE' && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-red-500/10 text-red-600 flex items-center justify-center shrink-0">
              <AlertCircle className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <div className="text-xs font-bold text-red-950">
              Unable to accept request
            </div>
          </div>
        )}

        {/* Hero Service Summary Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-700 border border-emerald-100 shrink-0">
                <ShoppingBag className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block text-[10px]">
                  Service Type
                </span>
                <span className="text-sm font-extrabold text-[#002244] tracking-tight whitespace-nowrap block">
                  Pickup Request
                </span>
              </div>
            </div>

            {status === 'AVAILABLE' && (
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all shrink-0 ${
                  secondsLeft <= 10
                    ? 'bg-amber-100 text-amber-900 border border-amber-300 ring-2 ring-amber-200/60'
                    : 'bg-blue-50 text-[#0052CC] border border-blue-200/80'
                }`}
              >
                <Clock className={`w-3.5 h-3.5 ${secondsLeft <= 10 ? 'text-amber-700 animate-pulse' : 'text-[#0052CC]'}`} />
                <span>{formatCountdownDigits(secondsLeft)}</span>
              </div>
            )}
          </div>

          {/* Requested Amount Display (Compact Height) */}
          <div className="flex flex-col items-center justify-center bg-slate-50/80 border border-slate-100 rounded-xl py-2 px-3 mt-2.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-none mb-1">
              Requested Service Amount
            </span>
            <span className="text-xl font-black text-[#002244] tracking-tight leading-tight">
              {effectiveRequest.amount}
            </span>
          </div>
        </div>

        {/* Request Details Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-extrabold text-slate-900 tracking-tight uppercase tracking-wider text-[11px]">
              Request Information
            </h3>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-extrabold">
              <User className="w-3 h-3 text-indigo-600" />
              <span>CUSTOMER REQUEST</span>
            </div>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-500 font-medium">From</span>
              <span className="font-bold text-slate-900">
                {effectiveRequest.customerName || 'John Banda'}
              </span>
            </div>

            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Transaction Type</span>
              <span className="font-extrabold text-[#002244] bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                {effectiveRequest.transactionType || 'Withdrawal'}
              </span>
            </div>

            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Vendor</span>
              <span className="font-bold text-slate-900 text-right flex items-center gap-1.5">
                {getVendorLogo(effectiveRequest.vendor || 'MTN') && (
                  <div className="w-4 h-4 rounded bg-white border border-slate-200 p-0.5 flex items-center justify-center shrink-0 overflow-hidden">
                    <img
                      src={getVendorLogo(effectiveRequest.vendor || 'MTN')}
                      alt={effectiveRequest.vendor || 'MTN'}
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
                <span>{effectiveRequest.vendor || 'MTN'}</span>
              </span>
            </div>

            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Amount</span>
              <span className="font-extrabold text-[#002244] font-mono">
                {effectiveRequest.amount}
              </span>
            </div>
          </div>
        </div>

        {/* AGENT EARNINGS SECTION */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-lg bg-blue-50 text-[#0052CC] flex items-center justify-center border border-blue-100">
                <Coins className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-extrabold text-[#002244] uppercase tracking-wider">
                Agent Earnings
              </span>
            </div>
            <span className="text-[10px] font-semibold text-[#0052CC] bg-blue-50 border border-blue-200/70 px-2 py-0.5 rounded-full flex items-center gap-1">
              <TrendingUp className="w-2.5 h-2.5 text-[#0052CC]" />
              Your Fee
            </span>
          </div>

          <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl px-3.5 py-2.5 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0052CC]">
              Reservation Fee
            </span>
            <span className="text-base font-black font-mono text-[#002244] tracking-tight">
              {earningAmount}
            </span>
          </div>
        </div>

        <PoweredByCinitecFooter className="py-1" />
      </div>

      {/* 3. Sticky Response Action Area at Bottom (NO Bottom Navigation Bar on Screen 05) */}
      <div className="px-3.5 py-3 bg-white border-t border-slate-200/90 shadow-lg shrink-0 z-20 space-y-2">
        {status === 'AVAILABLE' && (
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowRejectModal(true)}
              className="w-1/3 py-3 px-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 active:scale-[0.98]"
            >
              <X className="w-3.5 h-3.5 text-slate-500" />
              <span>Reject</span>
            </button>

            <button
              onClick={handleAcceptRequest}
              className="flex-1 py-3 px-4 rounded-xl bg-[#0052CC] hover:bg-[#0043A8] active:bg-[#003585] text-white font-extrabold text-xs transition-colors shadow-sm flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <span>Accept Request</span>
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        )}

        {status === 'RESPONDING' && (
          <button
            disabled
            className="w-full py-3.5 px-4 rounded-xl bg-[#0052CC]/80 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-not-allowed"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Accepting request...</span>
          </button>
        )}

        {status === 'ASSIGNED_TO_AGENT' && (
          <button
            onClick={() => {
              if (onViewAssignedService) {
                onViewAssignedService(effectiveRequest.id);
              } else {
                console.log('Contract trigger: onViewAssignedService', effectiveRequest.id);
              }
            }}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <span>View Assigned Service</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {(status === 'ASSIGNED_ELSEWHERE' ||
          status === 'TIMED_OUT' ||
          status === 'REJECTED_BY_AGENT') && (
          <button
            onClick={onBack}
            className="w-full py-3 px-4 rounded-xl bg-slate-900 text-white font-extrabold text-xs hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            <span>Back</span>
          </button>
        )}

        {status === 'CONNECTION_ISSUE' && (
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="w-1/3 py-3 px-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
            >
              Back
            </button>
            <button
              onClick={handleAcceptRequest}
              className="flex-1 py-3 px-4 rounded-xl bg-[#0052CC] text-white font-extrabold text-xs flex items-center justify-center gap-2"
            >
              <span>Retry Response</span>
            </button>
          </div>
        )}
      </div>

      {/* 4. Rejection Confirmation Bottom Sheet Modal */}
      {showRejectModal && (
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex flex-col justify-end p-3 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-4 space-y-3 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Reject this request?</span>
              </div>
              <button
                onClick={() => setShowRejectModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-2 flex items-center gap-2.5">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 py-2.5 px-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                Keep Request
              </button>
              <button
                onClick={handleConfirmReject}
                className="flex-1 py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs transition-colors shadow-xs"
              >
                Reject Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
