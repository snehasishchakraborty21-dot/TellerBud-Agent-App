import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Truck,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  ShieldAlert,
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

import { getVendorType } from '../config/walkInConfig';

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
  serviceType: 'pickup',
  transactionType: 'Withdrawal',
  vendorType: 'MNO',
  vendor: 'MTN',
  amount: 'ZMW 15,000.00',
  location: 'Booth 03 — Main Atrium',
  agentLocation: 'Booth 03 — Main Atrium',
  timing: 'Scheduled (Within 15 mins)',
  expiresAtSeconds: 120,
  reservationFee: 'ZMW 30.00',
  agentEarnings: 'ZMW 30.00',
};

// Phase 2 placeholder delivery request retained internally for future development
const defaultDeliveryRequest: IncomingCustomerRequest = {
  id: 'REQ-9082',
  requestReference: 'REQ-9082',
  requestOrigin: 'Customer',
  serviceType: 'pickup', // Phase 1 normal request is Pickup
  transactionType: 'Withdrawal',
  vendorType: 'MNO',
  vendor: 'MTN',
  amount: 'ZMW 15,000.00',
  location: 'Booth 03 — Main Atrium',
  agentLocation: 'Booth 03 — Main Atrium',
  expiresAtSeconds: 90,
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
  // Phase 1 is strictly Pickup-only for incoming customer requests
  const baseRequest: IncomingCustomerRequest = initialRequest
    ? {
        ...initialRequest,
        serviceType: 'pickup' as const,
        requestOrigin: 'Customer' as const,
        transactionType: initialRequest.transactionType || 'Withdrawal',
        vendor: initialRequest.vendor || 'MTN',
        agentLocation: initialRequest.agentLocation || assignment?.booth || 'Booth 03 — Main Atrium',
        timing: initialRequest.timing || 'Scheduled (Within 15 mins)',
        reservationFee: initialRequest.reservationFee || initialRequest.agentEarnings || 'ZMW 30.00',
        agentEarnings: initialRequest.agentEarnings || initialRequest.reservationFee || 'ZMW 30.00',
      }
    : defaultPickupRequest;

  const effectiveRequest: IncomingCustomerRequest = {
    ...baseRequest,
    vendor: baseRequest.vendor === 'Apex Supermarket #104' ? 'MTN' : baseRequest.vendor || 'MTN',
    agentLocation: baseRequest.agentLocation || assignment?.booth || 'Booth 03 — Main Atrium',
  };

  // Internal status management
  const [status, setStatus] = useState<InternalStatus>('AVAILABLE');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(
    effectiveRequest.expiresAtSeconds ?? null
  );

  useEffect(() => {
    setSecondsLeft(effectiveRequest.expiresAtSeconds ?? null);
  }, [effectiveRequest.expiresAtSeconds, previewState]);

  // Synchronize status with external previewState overrides
  useEffect(() => {
    if (!previewState) return;
    switch (previewState) {
      case 'delivery_request':
      case 'pickup_request':
        setStatus('AVAILABLE');
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
  }, [previewState]);

  // Countdown timer effect
  useEffect(() => {
    if (status !== 'AVAILABLE' || secondsLeft === null) return;
    if (secondsLeft <= 0) {
      setStatus('TIMED_OUT');
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          setStatus('TIMED_OUT');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status, secondsLeft]);

  // Format countdown mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder
      .toString()
      .padStart(2, '0')}`;
  };

  // Auto-dismiss reject modal if request status is no longer AVAILABLE
  useEffect(() => {
    if (status !== 'AVAILABLE' && showRejectModal) {
      setShowRejectModal(false);
    }
  }, [status, showRejectModal]);

  // Handle Accept Request action: automatic assignment
  const handleAcceptRequest = () => {
    if (status !== 'AVAILABLE' && status !== 'CONNECTION_ISSUE') return;

    setStatus('RESPONDING');

    // Simulate quick atomic check and automatic assignment
    setTimeout(() => {
      if (previewState === 'assigned_elsewhere' || previewState === 'unavailable') {
        setStatus('ASSIGNED_ELSEWHERE');
        return;
      }
      if (previewState === 'timed_out' || (secondsLeft !== null && secondsLeft <= 0)) {
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

  // Confirm rejection in modal with live availability revalidation
  const handleConfirmReject = () => {
    setShowRejectModal(false);

    if (status !== 'AVAILABLE' || (secondsLeft !== null && secondsLeft <= 0)) {
      if (secondsLeft !== null && secondsLeft <= 0) {
        setStatus('TIMED_OUT');
      }
      return;
    }

    setStatus('REJECTED_BY_AGENT');
    setTimeout(() => {
      if (onRejectSuccess) {
        onRejectSuccess();
      } else if (onBack) {
        onBack();
      }
    }, 800);
  };

  const earningAmount =
    effectiveRequest.reservationFee || effectiveRequest.agentEarnings || 'ZMW 30.00';

  return (
    <div className="w-full h-full min-h-full bg-slate-50 flex flex-col justify-between text-slate-900 select-none overflow-hidden font-sans relative">
      {/* 1. Header (Compact Authenticated Detail Header) */}
      <header className="px-3.5 pt-3 pb-2.5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between shrink-0 z-10">
        <button
          onClick={onBack}
          aria-label="Back"
          className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
        </button>

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
      <div className="flex-1 overflow-y-auto no-scrollbar px-3.5 py-3 space-y-3 pb-24">
        {/* Status Banners for Transition / Terminal States */}
        {status === 'RESPONDING' && (
          <div className="bg-blue-50/90 border border-blue-200/80 rounded-xl p-3 flex items-center gap-2.5">
            <Loader2 className="w-4 h-4 text-[#0052CC] animate-spin shrink-0" />
            <div>
              <div className="text-xs font-bold text-[#002244]">Accepting request...</div>
              <p className="text-[11px] text-slate-600">
                Confirming automatic assignment with TellerBud.
              </p>
            </div>
          </div>
        )}

        {status === 'ASSIGNED_TO_AGENT' && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-950">
                Assigned to You
              </div>
              <p className="text-[11px] text-emerald-700 mt-0.5 leading-tight">
                You are confirmed as the assigned Agent for this service.
              </p>
            </div>
          </div>
        )}

        {status === 'ASSIGNED_ELSEWHERE' && (
          <div className="bg-slate-100 border border-slate-300 rounded-xl p-3 flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
              <Info className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">
                Request no longer available
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-tight">
                This request has already been taken or is no longer active.
              </p>
            </div>
          </div>
        )}

        {status === 'TIMED_OUT' && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-950">
                Request Timed Out
              </div>
              <p className="text-[11px] text-amber-800 mt-0.5 leading-tight">
                The response window for this request has ended.
              </p>
            </div>
          </div>
        )}

        {status === 'REJECTED_BY_AGENT' && (
          <div className="bg-slate-100 border border-slate-300 rounded-xl p-3 flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
              <XCircle className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Request Declined</div>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-tight">
                You declined to respond to this request.
              </p>
            </div>
          </div>
        )}

        {status === 'CONNECTION_ISSUE' && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-red-500/10 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
              <AlertCircle className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-xs font-bold text-red-950">
                Unable to accept request
              </div>
              <p className="text-[11px] text-red-700 mt-0.5 leading-tight">
                Check your connection and try again.
              </p>
            </div>
          </div>
        )}

        {/* Hero Service Summary Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-700 border border-emerald-100">
                <ShoppingBag className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block text-[10px]">
                  Service Type
                </span>
                <span className="text-sm font-extrabold text-[#002244] tracking-tight">
                  Pickup Request
                </span>
              </div>
            </div>

            {status === 'AVAILABLE' && (
              secondsLeft !== null ? (
                <div className="flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200/80 px-2.5 py-1 rounded-lg text-xs font-mono font-bold">
                  <Clock className="w-3 h-3 text-amber-600" />
                  <span>{formatTime(secondsLeft)}</span>
                </div>
              ) : (
                <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/80">
                  Respond before expiry
                </span>
              )
            )}
          </div>

          {/* Requested Amount Display */}
          <div className="pt-3.5 flex flex-col items-center justify-center bg-slate-50/80 border border-slate-100 rounded-xl py-3 mt-1">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-0.5">
              Requested Service Amount
            </span>
            <span className="text-2xl font-black text-[#002244] tracking-tight">
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
              <span className="font-bold text-slate-900 flex items-center gap-1">
                <span>Customer</span>
              </span>
            </div>

            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Service</span>
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pickup</span>
              </span>
            </div>

            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Transaction Type</span>
              <span className="font-extrabold text-[#002244] bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                {effectiveRequest.transactionType || 'Withdrawal'}
              </span>
            </div>

            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Vendor Type</span>
              <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                {effectiveRequest.vendorType || getVendorType(effectiveRequest.vendor) || 'MNO'}
              </span>
            </div>

            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Vendor</span>
              <span className="font-bold text-slate-900 text-right">
                {effectiveRequest.vendor || 'MTN'}
              </span>
            </div>

            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Amount</span>
              <span className="font-extrabold text-[#002244] font-mono">
                {effectiveRequest.amount}
              </span>
            </div>

            <div className="py-2 flex items-start justify-between gap-3">
              <span className="text-slate-500 font-medium shrink-0 pt-0.5">Pickup Location</span>
              <span className="font-semibold text-slate-800 text-right text-[11.5px] leading-snug">
                {effectiveRequest.agentLocation || assignment?.booth || 'Booth 03 — Main Atrium'}
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

          <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0052CC] block mb-0.5">
                Reservation Fee
              </span>
              <span className="text-[10.5px] text-slate-500 font-medium">
                Agent earnings for service
              </span>
            </div>
            <span className="text-base font-black font-mono text-[#002244] tracking-tight">
              {earningAmount}
            </span>
          </div>
        </div>

        {/* Response Helper Reminder */}
        <div className="p-3 bg-slate-100/80 rounded-xl border border-slate-200/60 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-slate-400 shrink-0" />
          <p className="text-[11px] text-slate-600 leading-tight">
            Accepting automatically assigns this request to you. No fee is charged for accepting or rejecting.
          </p>
        </div>
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

            <p className="text-xs text-slate-600 leading-relaxed">
              You won&apos;t be considered for this request after rejecting it. Other available requests will continue to reach you.
            </p>

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
