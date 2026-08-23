import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Coins,
  Clock,
  MapPin,
  Building2,
  UserCheck,
  AlertCircle,
  CheckCircle2,
  Loader2,
  RefreshCw,
  X,
  ShieldCheck,
  ChevronRight,
  Info,
} from 'lucide-react';
import { TellerBudLogo } from '../components/TellerBudLogo';
import {
  AgentLiquidityIncomingPreviewState,
  AgentLiquidityRequestDetail,
  IncomingAgentLiquidityRequestItem,
  WorkAssignment,
} from '../types';
import {
  formatNaturalSubmittedTime,
  formatMatchedProximity,
} from './AgentLiquidityRequestDetailScreen';
import { normalizeZmwAmount } from '../config/currencyConfig';

interface AgentLiquidityIncomingDetailScreenProps {
  request?: AgentLiquidityRequestDetail | IncomingAgentLiquidityRequestItem;
  previewState?: AgentLiquidityIncomingPreviewState;
  assignment?: WorkAssignment | null;
  currentAgentId?: string;
  onBack?: () => void;
  onBackToRequests?: () => void;
  onAcceptSuccess?: (matchedRequest: AgentLiquidityRequestDetail) => void;
  onRejectSuccess?: (requestId: string) => void;
  onRetry?: () => void;
}

const defaultIncomingCashRequest: AgentLiquidityRequestDetail = {
  id: 'AL-1004',
  requestReference: 'AL-1004',
  requestType: 'cash',
  amount: 'ZMW 50,000.00',
  reason: 'High customer cash withdrawal demand at booth register.',
  location: 'Zone B — Apex Supermarket Booth, Cairo Road, Lusaka, Zambia',
  booth: 'Zone B — Booth 02',
  submittedAt: formatNaturalSubmittedTime(),
  status: 'available_to_respond',
  notificationsSent: true,
  responseDeadlineSeconds: 120,
  requesterName: 'Samuel Olawale',
  requesterReference: 'AG-70231',
  requesterBooth: 'Zone B — Apex Supermarket Booth #104',
  distance: '65 m away',
  estimatedTravelTime: '2 min away',
};

const defaultIncomingFloatRequest: AgentLiquidityRequestDetail = {
  id: 'AL-1008',
  requestReference: 'AL-1008',
  requestType: 'float',
  amount: 'ZMW 100,000.00',
  reason: 'Float replenishment for urgent customer utility and wallet transfers.',
  location: 'Central Mall Station, Lusaka, Zambia',
  booth: 'Booth 01 — West Wing',
  submittedAt: formatNaturalSubmittedTime(),
  status: 'available_to_respond',
  notificationsSent: true,
  responseDeadlineSeconds: 90,
  requesterName: 'David Kalu',
  requesterReference: 'AG-66190',
  requesterBooth: 'Central Mall Station Booth #01',
  distance: '180 m away',
  estimatedTravelTime: '4 min away',
};

export const AgentLiquidityIncomingDetailScreen: React.FC<
  AgentLiquidityIncomingDetailScreenProps
> = ({
  request,
  previewState = 'incoming_cash',
  assignment,
  currentAgentId,
  onBack,
  onBackToRequests,
  onAcceptSuccess,
  onRejectSuccess,
  onRetry,
}) => {
  // Normalize input request or choose baseline by previewState
  const getBaseRequest = (): AgentLiquidityRequestDetail => {
    const isFloat =
      previewState === 'incoming_float' ||
      (request && request.requestType === 'float');
    const fallback = isFloat
      ? defaultIncomingFloatRequest
      : defaultIncomingCashRequest;

    if (!request) return fallback;

    return {
      id: request.id || fallback.id,
      requestReference: request.requestReference || request.id || fallback.requestReference,
      requestType: request.requestType || fallback.requestType,
      amount: request.amount || fallback.amount,
      reason:
        ('reason' in request && request.reason) ||
        fallback.reason ||
        (request.requestType === 'cash'
          ? 'High customer cash withdrawal demand at booth register.'
          : 'Float replenishment for urgent customer utility and wallet transfers.'),
      location: request.location || fallback.location,
      booth:
        ('booth' in request && request.booth) ||
        ('requestingAgentBooth' in request && request.requestingAgentBooth) ||
        fallback.booth,
      submittedAt:
        ('submittedAt' in request && request.submittedAt) ||
        formatNaturalSubmittedTime(),
      status:
        ('status' in request && request.status === 'matched')
          ? 'matched'
          : ('status' in request && request.status === 'timed_out')
          ? 'timed_out'
          : ('status' in request && request.status === 'request_taken')
          ? 'request_taken'
          : 'available_to_respond',
      notificationsSent: true,
      responseDeadlineSeconds:
        ('responseDeadlineSeconds' in request && request.responseDeadlineSeconds) ||
        fallback.responseDeadlineSeconds,
      expiresAtTimestamp:
        ('expiresAtTimestamp' in request && request.expiresAtTimestamp) ||
        fallback.expiresAtTimestamp,
      requesterName:
        ('requesterName' in request && request.requesterName) ||
        ('requestingAgentName' in request && request.requestingAgentName) ||
        fallback.requesterName,
      requesterReference:
        ('requesterReference' in request && request.requesterReference) ||
        ('requestingAgentReference' in request && request.requestingAgentReference) ||
        fallback.requesterReference,
      requesterBooth:
        ('requesterBooth' in request && request.requesterBooth) ||
        ('requestingAgentBooth' in request && request.requestingAgentBooth) ||
        fallback.requesterBooth,
      distance:
        ('distance' in request && request.distance) || fallback.distance,
      estimatedTravelTime:
        ('estimatedTravelTime' in request && request.estimatedTravelTime) ||
        fallback.estimatedTravelTime,
    };
  };

  const [activeRequest, setActiveRequest] = useState<AgentLiquidityRequestDetail>(
    () => applyPreviewState(getBaseRequest(), previewState)
  );

  const [isAccepting, setIsAccepting] = useState<boolean>(
    previewState === 'accepting'
  );
  const [showRejectSheet, setShowRejectSheet] = useState<boolean>(false);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusConfirmed, setStatusConfirmed] = useState<boolean>(
    previewState !== 'status_not_confirmed'
  );

  // Dynamic seconds counter for deadline
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(() => {
    if (previewState === 'timed_out') return 0;
    const req = getBaseRequest();
    return req.responseDeadlineSeconds || 120;
  });

  useEffect(() => {
    const base = getBaseRequest();
    setActiveRequest(applyPreviewState(base, previewState));
    if (previewState === 'accepting') {
      setIsAccepting(true);
    } else {
      setIsAccepting(false);
    }
    if (previewState === 'timed_out') {
      setSecondsRemaining(0);
      setShowRejectSheet(false);
    } else if (previewState === 'request_taken') {
      setShowRejectSheet(false);
    } else if (previewState === 'status_not_confirmed') {
      setStatusConfirmed(false);
    } else {
      setStatusConfirmed(true);
      if (base.responseDeadlineSeconds) {
        setSecondsRemaining(base.responseDeadlineSeconds);
      }
    }
  }, [request, previewState]);

  // Live countdown timer
  useEffect(() => {
    if (
      secondsRemaining === null ||
      secondsRemaining <= 0 ||
      previewState === 'timed_out' ||
      previewState === 'request_taken' ||
      previewState === 'matched' ||
      previewState === 'rejected'
    ) {
      return;
    }

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          clearInterval(interval);
          setShowRejectSheet(false);
          setActiveRequest((current) => ({ ...current, status: 'timed_out' }));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsRemaining, previewState]);

  function applyPreviewState(
    base: AgentLiquidityRequestDetail,
    state?: AgentLiquidityIncomingPreviewState | string
  ): AgentLiquidityRequestDetail {
    if (!state) return base;
    const stableSubmittedAt = base.submittedAt || formatNaturalSubmittedTime();

    switch (state) {
      case 'incoming_cash':
        return {
          ...base,
          id: base.id || 'AL-1004',
          requestReference: base.requestReference || 'AL-1004',
          requestType: 'cash',
          amount: base.amount ? normalizeZmwAmount(base.amount) : 'ZMW 50,000.00',
          reason:
            base.reason || 'High customer cash withdrawal demand at booth register.',
          submittedAt: stableSubmittedAt,
          status: 'available_to_respond',
          responseDeadlineSeconds: 120,
          requesterName: base.requesterName || 'Samuel Olawale',
          requesterReference: base.requesterReference || 'AG-70231',
          requesterBooth:
            base.requesterBooth || 'Zone B — Apex Supermarket Booth #104',
          distance: base.distance || '65 m away',
          estimatedTravelTime: base.estimatedTravelTime || '2 min away',
        };

      case 'incoming_float':
        return {
          ...base,
          id: base.id || 'AL-1008',
          requestReference: base.requestReference || 'AL-1008',
          requestType: 'float',
          amount: base.amount ? normalizeZmwAmount(base.amount) : 'ZMW 100,000.00',
          reason:
            base.reason ||
            'Float replenishment for urgent customer utility and wallet transfers.',
          submittedAt: stableSubmittedAt,
          status: 'available_to_respond',
          responseDeadlineSeconds: 90,
          requesterName: base.requesterName || 'David Kalu',
          requesterReference: base.requesterReference || 'AG-66190',
          requesterBooth:
            base.requesterBooth || 'Central Mall Station Booth #01',
          distance: base.distance || '180 m away',
          estimatedTravelTime: base.estimatedTravelTime || '4 min away',
        };

      case 'accepting':
        return {
          ...base,
          status: 'available_to_respond',
          submittedAt: stableSubmittedAt,
        };

      case 'matched':
        return {
          ...base,
          status: 'matched',
          submittedAt: stableSubmittedAt,
          matchedAgent: {
            name: assignment?.agentName || 'Marcus Vance',
            agentReference: currentAgentId || assignment?.agentId || 'AG-88421',
            boothOrLocation:
              assignment?.booth || 'Booth 03 — Main Atrium, Central Mall Branch #104',
            distance: '65 m away',
          },
        };

      case 'rejected':
        return {
          ...base,
          status: 'rejected',
          submittedAt: stableSubmittedAt,
        };

      case 'timed_out':
        return {
          ...base,
          status: 'timed_out',
          submittedAt: stableSubmittedAt,
          responseDeadlineSeconds: 0,
        };

      case 'request_taken':
        return {
          ...base,
          status: 'request_taken',
          submittedAt: stableSubmittedAt,
        };

      case 'connection_issue':
        return {
          ...base,
          submittedAt: stableSubmittedAt,
        };

      case 'status_not_confirmed':
        return {
          ...base,
          submittedAt: stableSubmittedAt,
        };

      default:
        return {
          ...base,
          submittedAt: stableSubmittedAt,
        };
    }
  }

  // Format countdown string
  const formatDeadlineText = (): string => {
    if (secondsRemaining === null) {
      return 'Respond while this request is available.';
    }
    if (secondsRemaining <= 0) {
      return 'Response deadline expired';
    }
    const mins = Math.floor(secondsRemaining / 60);
    const secs = secondsRemaining % 60;
    if (mins > 0) {
      return `${mins} min${mins > 1 ? 's' : ''} ${secs > 0 ? `${secs} secs ` : ''}remaining`;
    }
    return `${secs} sec${secs === 1 ? '' : 's'} remaining`;
  };

  // State checks
  const isTimedOut =
    previewState === 'timed_out' ||
    activeRequest.status === 'timed_out' ||
    (secondsRemaining !== null && secondsRemaining <= 0);

  const isRequestTaken =
    previewState === 'request_taken' || activeRequest.status === 'request_taken';

  const isRejected =
    previewState === 'rejected' || activeRequest.status === 'rejected';

  const isMatched =
    previewState === 'matched' || activeRequest.status === 'matched';

  const isConnectionIssue = previewState === 'connection_issue';

  const isUnavailable = isTimedOut || isRequestTaken || isRejected;

  // Handle Accept Action
  const handleAcceptRequest = () => {
    if (isUnavailable || isAccepting) return;

    // Atomic availability check
    setIsAccepting(true);
    setErrorMessage(null);

    // Simulate atomic confirmation
    setTimeout(() => {
      setIsAccepting(false);

      const acceptingAgentName = assignment?.agentName || 'Marcus Vance';
      const acceptingAgentRef =
        currentAgentId || assignment?.agentId || 'AG-88421';
      const acceptingAgentBooth =
        assignment?.booth || 'Booth 03 — Main Atrium, Central Mall Branch #104';

      const confirmedMatchedRequest: AgentLiquidityRequestDetail = {
        ...activeRequest,
        status: 'matched',
        matchedAgent: {
          name: acceptingAgentName,
          agentReference: acceptingAgentRef,
          boothOrLocation: acceptingAgentBooth,
          distance: activeRequest.distance || '65 m away',
          estimatedTravelTime: activeRequest.estimatedTravelTime || '2 min away',
        },
        exchangeLocation:
          activeRequest.booth ||
          activeRequest.location ||
          'Booth 03 — Main Atrium, Central Mall Branch #104',
      };

      setActiveRequest(confirmedMatchedRequest);

      if (onAcceptSuccess) {
        onAcceptSuccess(confirmedMatchedRequest);
      }
    }, 850);
  };

  // Handle Reject Confirmation
  const handleConfirmReject = () => {
    setShowRejectSheet(false);
    setActiveRequest((prev) => ({ ...prev, status: 'rejected' }));
    if (onRejectSuccess) {
      onRejectSuccess(activeRequest.id);
    } else if (onBackToRequests) {
      onBackToRequests();
    } else if (onBack) {
      onBack();
    }
  };

  // Handle Retry
  const handleRetry = () => {
    setIsRetrying(true);
    setErrorMessage(null);
    if (onRetry) onRetry();
    setTimeout(() => {
      setIsRetrying(false);
    }, 800);
  };

  return (
    <div
      id="agent-liquidity-incoming-detail-screen"
      className="flex flex-col h-full bg-slate-50 text-slate-900 select-none overflow-hidden relative"
    >
      {/* 1. Header (Compact Authenticated Detail Header) */}
      <header className="bg-white border-b border-slate-200/80 px-3.5 py-2.5 flex items-center justify-between shadow-2xs shrink-0 z-10">
        <div className="flex items-center gap-2">
          <button
            id="back-button"
            onClick={onBack || onBackToRequests}
            className="p-1.5 -ml-1 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-slate-100 active:scale-95 transition-all"
            aria-label="Back to Requests"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <div>
            <h1 className="text-sm font-extrabold text-[#002244] tracking-tight leading-tight">
              Incoming Liquidity Request
            </h1>
            {activeRequest.requestReference && (
              <p className="text-[10px] text-slate-400 font-mono font-medium leading-none">
                #{activeRequest.requestReference}
              </p>
            )}
          </div>
        </div>

        <TellerBudLogo size="sm" />
      </header>

      {/* 2. Connection Issue Notification */}
      {isConnectionIssue && (
        <div className="bg-amber-50 border-b border-amber-200 px-3.5 py-2 flex items-center justify-between text-xs text-amber-900 shrink-0">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <div className="text-[11px] leading-tight">
              <span className="font-bold text-amber-900 block">
                Unable to accept request
              </span>
              <span className="text-amber-700">
                Check your connection and try again.
              </span>
            </div>
          </div>
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-[11px] font-bold inline-flex items-center gap-1 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isRetrying ? 'animate-spin' : ''}`} />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* 3. Status Not Confirmed Notification */}
      {!statusConfirmed && (
        <div className="bg-rose-50 border-b border-rose-200 px-3.5 py-2 flex items-center justify-between text-xs text-rose-900 shrink-0">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
            <span className="text-[11px] font-semibold text-rose-800">
              Request status not confirmed
            </span>
          </div>
          <button
            onClick={() => setStatusConfirmed(true)}
            className="px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-900 text-[11px] font-bold transition-colors"
          >
            Check Status
          </button>
        </div>
      )}

      {/* 4. Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
        {/* STATUS BANNER */}
        {isMatched ? (
          <div className="bg-white border border-emerald-200/90 rounded-2xl p-3.5 shadow-2xs space-y-1 relative overflow-hidden">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="flex-1">
                <h2 className="text-sm font-black text-[#002244]">
                  Match confirmed
                </h2>
                <p className="text-xs text-slate-600 leading-snug">
                  You have accepted this request. Preparing liquidity exchange...
                </p>
              </div>
            </div>
          </div>
        ) : isTimedOut ? (
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-2xs space-y-2 relative overflow-hidden">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="flex-1">
                <h2 className="text-sm font-black text-slate-800">
                  Request timed out
                </h2>
                <p className="text-xs text-slate-600 leading-snug">
                  The response period for this liquidity request has ended.
                </p>
              </div>
            </div>
            <div className="pt-1 border-t border-slate-100">
              <button
                onClick={onBackToRequests || onBack}
                className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold text-center transition-colors"
              >
                Back to Requests
              </button>
            </div>
          </div>
        ) : isRequestTaken ? (
          <div className="bg-white border border-amber-200 rounded-2xl p-3.5 shadow-2xs space-y-2 relative overflow-hidden">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="flex-1">
                <h2 className="text-sm font-black text-slate-800">
                  Request no longer available
                </h2>
                <p className="text-xs text-slate-600 leading-snug">
                  Another Agent has already accepted this liquidity request.
                </p>
              </div>
            </div>
            <div className="pt-1 border-t border-amber-100">
              <button
                onClick={onBackToRequests || onBack}
                className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold text-center transition-colors"
              >
                Back to Requests
              </button>
            </div>
          </div>
        ) : isRejected ? (
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-2xs space-y-2 relative overflow-hidden">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                <X className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="flex-1">
                <h2 className="text-sm font-black text-slate-800">
                  Request rejected
                </h2>
                <p className="text-xs text-slate-600 leading-snug">
                  You are no longer considered for this liquidity request.
                </p>
              </div>
            </div>
            <div className="pt-1 border-t border-slate-100">
              <button
                onClick={onBackToRequests || onBack}
                className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold text-center transition-colors"
              >
                Back to Requests
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-blue-200/80 rounded-2xl p-3.5 shadow-2xs space-y-1 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0052CC] animate-pulse" />
                <h2 className="text-xs font-extrabold text-[#002244] uppercase tracking-wider">
                  Available to respond
                </h2>
              </div>
              {secondsRemaining !== null && secondsRemaining > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#0052CC] border border-blue-100 flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3" />
                  <span>{formatDeadlineText()}</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 leading-snug pt-0.5">
              You have not accepted this liquidity request yet. Review the details below and respond.
            </p>
          </div>
        )}

        {/* REQUEST SUMMARY CARD */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            {/* AGENT REQUEST ORIGIN BADGE */}
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200/60 flex items-center gap-1 shadow-2xs">
                <Coins className="w-3 h-3 text-purple-600" />
                <span>Agent Request</span>
              </span>
            </div>

            {/* TYPE BADGE: Cash or Float */}
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                activeRequest.requestType === 'cash'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                  : 'bg-blue-50 text-[#0052CC] border border-blue-200/50'
              }`}
            >
              <span>
                {activeRequest.requestType === 'cash'
                  ? 'Cash Request'
                  : 'Float Request'}
              </span>
            </span>
          </div>

          {/* REQUESTED AMOUNT */}
          <div className="flex items-baseline justify-between pt-0.5">
            <span className="text-xs text-slate-500 font-medium">
              Requested Amount
            </span>
            <span className="text-xl font-black text-[#002244] font-mono tracking-tight">
              {normalizeZmwAmount(activeRequest.amount)}
            </span>
          </div>

          {/* Time notice if available */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] text-slate-500">
            <span>Response Window</span>
            <span className="font-semibold text-slate-700">
              {formatDeadlineText()}
            </span>
          </div>
        </div>

        {/* REQUEST INFORMATION CARD */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-2xs space-y-2.5">
          <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Request Information
            </span>
            {activeRequest.requestReference && (
              <span className="text-[10px] text-slate-400 font-mono">
                Ref #{activeRequest.requestReference}
              </span>
            )}
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">From</span>
              <span className="font-bold text-[#002244]">Agent</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Request Type</span>
              <span className="font-semibold text-slate-800 capitalize">
                {activeRequest.requestType === 'cash' ? 'Cash' : 'Float'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Amount</span>
              <span className="font-bold text-[#002244] font-mono">
                {activeRequest.amount}
              </span>
            </div>

            {/* Reason */}
            <div className="space-y-1 pt-1.5 border-t border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Reason
              </span>
              <p className="text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-xl p-2.5 leading-relaxed break-words">
                {activeRequest.reason}
              </p>
            </div>

            {/* Request Location */}
            <div className="space-y-1 pt-1.5 border-t border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#0052CC]" />
                <span>Request Location</span>
              </span>
              <p className="text-xs text-slate-800 font-semibold leading-snug">
                {activeRequest.location}
              </p>
              {activeRequest.booth && (
                <p className="text-[11px] text-slate-500">
                  {activeRequest.booth}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* REQUESTING AGENT CARD */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-[#0052CC]" />
              <span>Requesting Agent</span>
            </span>
            {(() => {
              const proximityLabel = formatMatchedProximity(
                activeRequest.distance,
                activeRequest.estimatedTravelTime
              );
              if (!proximityLabel) return null;
              return (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                  {proximityLabel}
                </span>
              );
            })()}
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#002244]">
                {activeRequest.requesterName || 'Samuel Olawale'}
              </span>
              {activeRequest.requesterReference && (
                <span className="text-[10px] text-slate-400 font-mono">
                  #{activeRequest.requesterReference}
                </span>
              )}
            </div>

            {activeRequest.requesterBooth && (
              <div className="flex items-start gap-1.5 text-[11px] text-slate-600">
                <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{activeRequest.requesterBooth}</span>
              </div>
            )}
          </div>
        </div>

        {/* OPERATIONAL GUIDANCE */}
        {!isUnavailable && !isMatched && (
          <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-3 shadow-2xs flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#0052CC] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-[#002244] block">
                Agent-to-Agent Exchange
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Accepting this request confirms an immediate match with the requesting Agent. You will both proceed to the Liquidity Exchange step.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 5. STICKY BOTTOM RESPONSE AREA */}
      {!isUnavailable && !isMatched && (
        <div className="bg-white border-t border-slate-200/80 p-3 shadow-lg shrink-0 space-y-2">
          <div className="grid grid-cols-2 gap-2.5">
            {/* REJECT BUTTON */}
            <button
              id="reject-request-btn"
              onClick={() => setShowRejectSheet(true)}
              disabled={isAccepting}
              className="py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-100 active:bg-slate-200 text-slate-700 text-xs font-extrabold flex items-center justify-center transition-all active:scale-[0.99] disabled:opacity-50"
            >
              <span>Reject</span>
            </button>

            {/* ACCEPT REQUEST BUTTON */}
            <button
              id="accept-request-btn"
              onClick={handleAcceptRequest}
              disabled={isAccepting}
              className="py-3 px-4 rounded-xl bg-[#0052CC] hover:bg-[#0043A8] active:bg-[#00388F] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-[0.99] disabled:opacity-75"
            >
              {isAccepting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Accepting...</span>
                </>
              ) : (
                <>
                  <span>Accept Request</span>
                  <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </div>

          <p className="text-[10px] text-center text-slate-400 font-medium leading-tight">
            Manual acceptance is required. No admin or owner approval needed.
          </p>
        </div>
      )}

      {/* 6. REJECT CONFIRMATION BOTTOM SHEET */}
      {showRejectSheet && (
        <div
          id="reject-confirmation-backdrop"
          className="absolute inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-end animate-fadeIn"
          onClick={() => setShowRejectSheet(false)}
        >
          <div
            id="reject-confirmation-sheet"
            className="w-full bg-white rounded-t-3xl p-4 space-y-3.5 shadow-2xl border-t border-slate-200 animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Handle */}
            <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto" />

            <div className="space-y-1">
              <h3 className="text-sm font-black text-slate-900">
                Reject this request?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                You won&apos;t be considered for this liquidity request after rejecting it. Other eligible Agents may still respond.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              {/* Keep Request Button */}
              <button
                id="keep-request-btn"
                onClick={() => setShowRejectSheet(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold text-center transition-colors active:scale-[0.99]"
              >
                Keep Request
              </button>

              {/* Reject Request Button */}
              <button
                id="confirm-reject-btn"
                onClick={handleConfirmReject}
                className="w-full py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-700 border border-rose-200 text-xs font-extrabold text-center transition-colors active:scale-[0.99]"
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
