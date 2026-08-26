import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Clock,
  MapPin,
  Coins,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  UserCheck,
  Building2,
  ArrowRight,
  ShieldCheck,
  Plus,
  Loader2,
  Info,
  Radio,
} from 'lucide-react';
import { TellerBudLogo } from '../components/TellerBudLogo';
import {
  AgentLiquidityStatusPreviewState,
  AgentLiquidityRequestDetail,
  LiquidityRequestType,
} from '../types';
import { PoweredByCinitecFooter } from '../components/PoweredByCinitecFooter';

interface AgentLiquidityRequestDetailScreenProps {
  request?: AgentLiquidityRequestDetail;
  previewState?: AgentLiquidityStatusPreviewState;
  onBack?: () => void;
  onBackToRequests?: () => void;
  onCreateNewRequest?: () => void;
  onContinueToExchange?: () => void;
  onRetry?: () => void;
}

export const formatNaturalSubmittedTime = (
  dateInput?: Date | string | number
): string => {
  if (!dateInput) {
    const d = new Date(Date.now() - 2 * 60 * 1000);
    return `Today, ${d.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })}`;
  }
  if (typeof dateInput === 'string' && dateInput.trim()) {
    if (dateInput.startsWith('Today,') || dateInput.startsWith('Yesterday,')) {
      return dateInput;
    }
    const parsed = new Date(dateInput);
    if (!isNaN(parsed.getTime())) {
      return `Today, ${parsed.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })}`;
    }
    return dateInput;
  }
  const d = new Date(dateInput);
  return `Today, ${d.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })}`;
};

export const formatMatchedProximity = (
  distance?: string,
  travelTime?: string
): string | null => {
  if (distance && distance.trim()) {
    const trimmed = distance.trim();
    const matchMetres = trimmed.match(/^(\d+(?:\.\d+)?)\s*m\s+away$/i);
    if (matchMetres) {
      return `${matchMetres[1]} m away`;
    }
    const matchKm = trimmed.match(/^(\d+(?:\.\d+)?)\s*km\s+away$/i);
    if (matchKm) {
      return `${matchKm[1]} km away`;
    }
    const matchMins = trimmed.match(/^(\d+)\s*(?:mins?|minutes?)\s+away$/i);
    if (matchMins) {
      return `${matchMins[1]} min away`;
    }
    return trimmed;
  }
  if (travelTime && travelTime.trim()) {
    const trimmed = travelTime.trim();
    const matchMins = trimmed.match(/^(\d+)\s*(?:mins?|minutes?|m)\s+away$/i);
    if (matchMins) {
      return `${matchMins[1]} min away`;
    }
    return trimmed;
  }
  return null;
};

const defaultMockRequest: AgentLiquidityRequestDetail = {
  id: 'AL-9042',
  requestReference: 'AL-9042',
  requestType: 'cash',
  amount: 'ZMW 50,000.00',
  reason: 'High morning customer cash withdrawal demand',
  location: 'Plot 42, Commercial Avenue, Lusaka',
  booth: 'Booth 03 — Main Atrium, Central Mall Branch #104',
  submittedAt: formatNaturalSubmittedTime(),
  status: 'searching',
  notificationsSent: true,
  responseDeadlineSeconds: 150,
};

export const AgentLiquidityRequestDetailScreen: React.FC<
  AgentLiquidityRequestDetailScreenProps
> = ({
  request = defaultMockRequest,
  previewState = 'searching_cash' as AgentLiquidityStatusPreviewState,
  onBack,
  onBackToRequests,
  onCreateNewRequest,
  onContinueToExchange,
  onRetry,
}: AgentLiquidityRequestDetailScreenProps) => {
  const [activeRequest, setActiveRequest] = useState<AgentLiquidityRequestDetail>(() => {
    return applyPreviewState(request, previewState);
  });

  const [mountTime] = useState<number>(() => Date.now());
  const [nowTimestamp, setNowTimestamp] = useState<number>(() => Date.now());
  const [isRetrying, setIsRetrying] = useState<boolean>(false);
  const [hasTimedOutLocally, setHasTimedOutLocally] = useState<boolean>(false);

  // Sync when external request or previewState changes
  useEffect(() => {
    setActiveRequest(applyPreviewState(request, previewState));
    setHasTimedOutLocally(false);
  }, [request, previewState]);

  // Live 1-second interval timer for response deadline
  useEffect(() => {
    const timer = setInterval(() => {
      setNowTimestamp(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  function applyPreviewState(
    base: AgentLiquidityRequestDetail,
    state?: AgentLiquidityStatusPreviewState
  ): AgentLiquidityRequestDetail {
    if (!state) return base;
    const stableSubmittedAt = base.submittedAt || formatNaturalSubmittedTime();

    switch (state) {
      case 'searching_cash':
        return {
          ...base,
          id: 'AL-9042',
          requestReference: 'AL-9042',
          requestType: 'cash',
          amount: 'ZMW 50,000.00',
          reason: 'High morning customer cash withdrawal demand',
          submittedAt: stableSubmittedAt,
          status: 'searching',
          notificationsSent: true,
          responseDeadlineSeconds: 150,
          matchedAgent: undefined,
        };
      case 'searching_float':
        return {
          ...base,
          id: 'AL-9055',
          requestReference: 'AL-9055',
          requestType: 'float',
          amount: 'ZMW 100,000.00',
          reason: 'Replenishing float for MTN & Airtel transfers',
          submittedAt: stableSubmittedAt,
          status: 'searching',
          notificationsSent: true,
          responseDeadlineSeconds: 180,
          matchedAgent: undefined,
        };
      case 'agent_accepted':
        return {
          ...base,
          id: 'AL-9042',
          requestReference: 'AL-9042',
          requestType: 'cash',
          amount: 'ZMW 50,000.00',
          reason: 'High morning customer cash withdrawal demand',
          submittedAt: stableSubmittedAt,
          status: 'matched',
          notificationsSent: true,
          matchedAgent: {
            name: 'Michael Adeleke',
            agentReference: 'AG-70231',
            boothOrLocation: 'Booth 01 — West Wing, Central Mall',
            distance: '65 m away',
          },
          exchangeLocation: 'Booth 03 — Main Atrium, Central Mall Branch #104',
        };
      case 'timed_out':
        return {
          ...base,
          id: 'AL-9042',
          requestReference: 'AL-9042',
          requestType: 'cash',
          amount: 'ZMW 50,000.00',
          reason: 'High morning customer cash withdrawal demand',
          submittedAt: stableSubmittedAt,
          status: 'timed_out',
          notificationsSent: true,
          matchedAgent: undefined,
        };
      case 'match_unavailable':
        return {
          ...base,
          id: 'AL-9042',
          requestReference: 'AL-9042',
          requestType: 'cash',
          amount: 'ZMW 50,000.00',
          reason: 'High morning customer cash withdrawal demand',
          submittedAt: stableSubmittedAt,
          status: 'match_unavailable',
          notificationsSent: true,
          matchedAgent: undefined,
        };
      case 'connection_issue':
        return {
          ...base,
          id: 'AL-9042',
          requestReference: 'AL-9042',
          requestType: 'cash',
          amount: 'ZMW 50,000.00',
          reason: 'High morning customer cash withdrawal demand',
          submittedAt: stableSubmittedAt,
          status: 'searching',
          notificationsSent: true,
          responseDeadlineSeconds: 120,
          matchedAgent: undefined,
        };
      default:
        return {
          ...base,
          submittedAt: stableSubmittedAt,
        };
    }
  }

  // Calculate dynamic countdown timer
  const calculateTimerState = () => {
    if (activeRequest.status !== 'searching') return null;

    let expiresAt = activeRequest.expiresAtTimestamp;
    if (!expiresAt && activeRequest.responseDeadlineSeconds) {
      expiresAt = mountTime + activeRequest.responseDeadlineSeconds * 1000;
    }

    if (!expiresAt) {
      return {
        hasDeadline: false,
        text: 'Waiting for an eligible Agent to accept.',
        isExpired: false,
      };
    }

    const remainingMs = expiresAt - nowTimestamp;
    const remainingSecs = Math.max(0, Math.floor(remainingMs / 1000));

    if (remainingSecs <= 0) {
      return {
        hasDeadline: true,
        text: 'Response period expired',
        isExpired: true,
      };
    }

    const mins = Math.floor(remainingSecs / 60);
    const secs = remainingSecs % 60;

    let formattedText = '';
    if (mins > 0) {
      formattedText = `${mins} ${mins === 1 ? 'min' : 'mins'} ${
        secs > 0 ? `${secs} ${secs === 1 ? 'sec' : 'secs'}` : ''
      } remaining`.trim();
    } else {
      formattedText = `${secs} ${secs === 1 ? 'sec' : 'secs'} remaining`;
    }

    return {
      hasDeadline: true,
      text: formattedText,
      isExpired: false,
    };
  };

  const timerState = calculateTimerState();
  const isExpired = timerState?.isExpired || hasTimedOutLocally;
  const isConnectionIssue = previewState === 'connection_issue';

  // Effective status accounting for countdown expiry
  const effectiveStatus = isExpired && activeRequest.status === 'searching'
    ? 'timed_out'
    : activeRequest.status;

  const handleRetry = () => {
    setIsRetrying(true);
    if (onRetry) onRetry();
    setTimeout(() => {
      setIsRetrying(false);
    }, 800);
  };

  return (
    <div
      id="agent-liquidity-request-detail-screen"
      className="flex flex-col h-full bg-slate-50 text-slate-900 select-none overflow-hidden"
    >
      {/* 1. Header (Compact Authenticated Detail Header) */}
      <header className="bg-white border-b border-slate-200/80 px-3.5 py-2.5 flex items-center justify-between shadow-2xs shrink-0 z-10">
        <div className="flex items-center gap-2">
          <button
            id="back-button"
            onClick={onBack || onBackToRequests}
            className="w-8 h-8 rounded-xl bg-slate-100/80 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
            title="Back to Requests"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xs font-black uppercase tracking-wider text-[#002244]">
              Liquidity Request
            </h1>
            {activeRequest.requestReference && (
              <span className="text-[10px] text-slate-400 font-mono">
                #{activeRequest.requestReference}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <TellerBudLogo size="sm" />
        </div>
      </header>

      {/* 2. Scrollable Body Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-3.5 py-3 space-y-3.5">
        {/* Connection Issue Banner */}
        {isConnectionIssue && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 shadow-2xs space-y-2">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h2 className="text-xs font-bold text-amber-950">
                  Unable to refresh request status
                </h2>
                <p className="text-[11px] text-amber-800 leading-snug mt-0.5">
                  Check your connection and try again.
                </p>
              </div>
            </div>
            <div className="flex justify-end pt-1">
              <button
                onClick={handleRetry}
                disabled={isRetrying}
                className="px-3 py-1.5 rounded-xl bg-white border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-50 shadow-2xs transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
                <span>{isRetrying ? 'Checking...' : 'Retry'}</span>
              </button>
            </div>
          </div>
        )}

        {/* STATUS CARD: Searching */}
        {effectiveStatus === 'searching' && (
          <div className="bg-white border border-blue-100 rounded-2xl p-4 shadow-2xs space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none" />

            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#0052CC] border border-blue-200/60 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0052CC] animate-ping" />
                <span>Searching</span>
              </span>
              {timerState?.hasDeadline && (
                <div className="flex items-center gap-1 text-[11px] font-bold text-[#0052CC] bg-blue-50/80 px-2 py-0.5 rounded-lg border border-blue-100 font-mono">
                  <Clock className="w-3 h-3 text-[#0052CC]" />
                  <span>{timerState.text}</span>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-blue-50 text-[#0052CC] flex items-center justify-center shrink-0">
                  <Radio className="w-4 h-4 animate-pulse text-[#0052CC]" />
                </div>
                <h2 className="text-sm font-extrabold text-[#002244]">
                  Searching for an Agent
                </h2>
              </div>
            </div>

            {/* Notification Confirmation Line */}
            {activeRequest.notificationsSent && (
              <div className="pt-2.5 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Eligible Agents have been notified.</span>
              </div>
            )}

            {!timerState?.hasDeadline && (
              <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-400">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Waiting for an eligible Agent to accept.</span>
              </div>
            )}
          </div>
        )}

        {/* STATUS CARD: Matched / Agent Accepted */}
        {effectiveStatus === 'matched' && (
          <div className="bg-white border border-emerald-200/90 rounded-2xl p-4 shadow-2xs space-y-2.5 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span>Match Confirmed</span>
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                Ready for Exchange
              </span>
            </div>

            <div className="flex items-center gap-2.5 pt-0.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-black text-[#002244]">
                  Agent accepted
                </h2>
              </div>
            </div>
          </div>
        )}

        {/* STATUS CARD: Timed Out */}
        {effectiveStatus === 'timed_out' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-slate-500" />
                <span>Request Timed Out</span>
              </span>
            </div>

            <div className="space-y-1 pt-1">
              <h2 className="text-sm font-extrabold text-slate-800">
                Request timed out
              </h2>
            </div>
          </div>
        )}

        {/* STATUS CARD: Match Unavailable */}
        {effectiveStatus === 'match_unavailable' && (
          <div className="bg-white border border-amber-200 rounded-2xl p-4 shadow-2xs space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5">
                <AlertCircle className="w-3 h-3 text-amber-700" />
                <span>Match Unavailable</span>
              </span>
            </div>

            <div className="space-y-1 pt-1">
              <h2 className="text-sm font-extrabold text-slate-800">
                Match unavailable
              </h2>
            </div>
          </div>
        )}

        {/* 3. REQUEST SUMMARY (Read-Only) */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Request Summary
            </span>
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                activeRequest.requestType === 'cash'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                  : 'bg-blue-50 text-[#0052CC] border border-blue-200/50'
              }`}
            >
              <Coins className="w-3 h-3" />
              <span>{activeRequest.requestType}</span>
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-xs text-slate-500 font-medium">Requested Amount</span>
            <span className="text-base font-black text-[#002244] font-mono">
              {activeRequest.amount}
            </span>
          </div>

          {/* Submitted Date/Time */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] text-slate-400">
            <span>Submitted</span>
            <span className="font-medium text-slate-600 font-mono">
              {activeRequest.submittedAt || formatNaturalSubmittedTime()}
            </span>
          </div>
        </div>

        {/* 4. MATCHED AGENT SECTION (Only when Matched) */}
        {effectiveStatus === 'matched' && activeRequest.matchedAgent && (
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Matched Agent</span>
              </span>
              {(() => {
                const proximityLabel = formatMatchedProximity(
                  activeRequest.matchedAgent.distance,
                  activeRequest.matchedAgent.estimatedTravelTime
                );
                if (!proximityLabel) return null;
                return (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                    {proximityLabel}
                  </span>
                );
              })()}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#002244]">
                  {activeRequest.matchedAgent.name}
                </span>
                {activeRequest.matchedAgent.agentReference && (
                  <span className="text-[10px] text-slate-400 font-mono">
                    #{activeRequest.matchedAgent.agentReference}
                  </span>
                )}
              </div>

              {activeRequest.matchedAgent.boothOrLocation && (
                <div className="flex items-start gap-1.5 text-[11px] text-slate-600">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{activeRequest.matchedAgent.boothOrLocation}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 5. EXCHANGE LOCATION SECTION (Only when Matched) */}
        {effectiveStatus === 'matched' && (
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-2xs space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#0052CC]" />
              <span>Exchange Location</span>
            </span>
            <p className="text-xs text-slate-800 font-semibold">
              {activeRequest.exchangeLocation ||
                activeRequest.booth ||
                activeRequest.location ||
                'Exchange location will be shown when available.'}
            </p>
          </div>
        )}

        <PoweredByCinitecFooter className="py-2" />
      </div>

      {/* 6. Sticky Bottom Action Controls */}
      <footer className="bg-white border-t border-slate-200/90 p-3.5 shadow-lg shrink-0 z-10">
        {effectiveStatus === 'matched' && (
          <button
            id="continue-to-exchange-button"
            onClick={onContinueToExchange}
            className="w-full py-3 px-4 rounded-xl bg-[#0052CC] hover:bg-[#0043A8] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm transition-colors active:scale-98 cursor-pointer"
          >
            <span>Continue to Exchange</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        {effectiveStatus === 'searching' && (
          <button
            id="back-to-requests-button"
            onClick={onBackToRequests || onBack}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>Back to Requests</span>
          </button>
        )}

        {effectiveStatus === 'timed_out' && (
          <div className="space-y-2">
            <button
              id="create-new-request-button"
              onClick={onCreateNewRequest}
              className="w-full py-3 px-4 rounded-xl bg-[#0052CC] hover:bg-[#0043A8] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm transition-colors active:scale-98 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create New Request</span>
            </button>
            <button
              onClick={onBackToRequests || onBack}
              className="w-full py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer"
            >
              <span>Back to Requests</span>
            </button>
          </div>
        )}

        {effectiveStatus === 'match_unavailable' && (
          <button
            id="back-to-requests-button"
            onClick={onBackToRequests || onBack}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>Back to Requests</span>
          </button>
        )}
      </footer>
    </div>
  );
};
