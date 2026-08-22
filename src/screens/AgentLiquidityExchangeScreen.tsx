import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Coins,
  MapPin,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  Building2,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Loader2,
  MessageSquare,
} from 'lucide-react';
import { TellerBudLogo } from '../components/TellerBudLogo';
import {
  AgentLiquidityRequestDetail,
  AgentLiquidityExchangePreviewState,
} from '../types';
import { formatNaturalSubmittedTime, formatMatchedProximity } from './AgentLiquidityRequestDetailScreen';

interface AgentLiquidityExchangeScreenProps {
  request?: AgentLiquidityRequestDetail;
  previewState?: AgentLiquidityExchangePreviewState;
  userRole?: 'requester' | 'matched_agent';
  currentAgentId?: string;
  onBack?: () => void;
  onBackToRequests?: () => void;
  onProceedToTransaction?: (exchangeData: AgentLiquidityRequestDetail) => void;
  onChatWithAgent?: () => void;
  onRetry?: () => void;
}

const defaultMockMatchedRequest: AgentLiquidityRequestDetail = {
  id: 'AL-9042',
  requestReference: 'AL-9042',
  requestType: 'cash',
  amount: 'ZMW 50,000.00',
  reason: 'High morning customer cash withdrawal demand',
  location: 'Plot 42, Commercial Avenue, Lusaka',
  booth: 'Booth 03 — Main Atrium, Central Mall Branch #104',
  submittedAt: formatNaturalSubmittedTime(),
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

export const AgentLiquidityExchangeScreen: React.FC<
  AgentLiquidityExchangeScreenProps
> = ({
  request = defaultMockMatchedRequest,
  previewState = 'cash_ready',
  userRole,
  currentAgentId,
  onBack,
  onBackToRequests,
  onProceedToTransaction,
  onChatWithAgent,
  onRetry,
}) => {
  const [activeRequest, setActiveRequest] = useState<AgentLiquidityRequestDetail>(() => {
    return applyPreviewState(request, previewState);
  });
  const [isRetrying, setIsRetrying] = useState<boolean>(false);

  useEffect(() => {
    setActiveRequest(applyPreviewState(request, previewState));
  }, [request, previewState]);

  function applyPreviewState(
    base: AgentLiquidityRequestDetail,
    state?: AgentLiquidityExchangePreviewState | string
  ): AgentLiquidityRequestDetail {
    if (!state) return base;
    const stableSubmittedAt = base.submittedAt || formatNaturalSubmittedTime();

    switch (state) {
      case 'cash_ready':
        return {
          ...base,
          id: base.id || 'AL-9042',
          requestReference: base.requestReference || 'AL-9042',
          requestType: 'cash',
          amount: base.amount || 'ZMW 50,000.00',
          reason: base.reason || 'High morning customer cash withdrawal demand',
          submittedAt: stableSubmittedAt,
          location: base.location || 'Plot 42, Commercial Avenue, Lusaka',
          booth: base.booth || 'Booth 03 — Main Atrium, Central Mall Branch #104',
          status: 'matched',
          matchedAgent: base.matchedAgent || {
            name: 'Michael Adeleke',
            agentReference: 'AG-70231',
            boothOrLocation: 'Booth 01 — West Wing, Central Mall',
            distance: '65 m away',
          },
          exchangeLocation:
            base.exchangeLocation ||
            base.booth ||
            'Booth 03 — Main Atrium, Central Mall Branch #104',
        };

      case 'float_ready':
        return {
          ...base,
          id: 'AL-9055',
          requestReference: 'AL-9055',
          requestType: 'float',
          amount: 'ZMW 100,000.00',
          reason: 'Replenishing float for MTN & Airtel transfers',
          submittedAt: stableSubmittedAt,
          location: base.location || 'Plot 42, Commercial Avenue, Lusaka',
          booth: base.booth || 'Booth 03 — Main Atrium, Central Mall Branch #104',
          status: 'matched',
          matchedAgent: {
            name: 'Sarah Nnamdi',
            agentReference: 'AG-88210',
            boothOrLocation: 'Booth 04 — North Gate, Central Mall',
            distance: '110 m away',
          },
          exchangeLocation:
            base.exchangeLocation ||
            base.booth ||
            'Booth 03 — Main Atrium, Central Mall Branch #104',
        };

      case 'match_unavailable':
        return {
          ...base,
          id: base.id || 'AL-9042',
          requestReference: base.requestReference || 'AL-9042',
          requestType: base.requestType || 'cash',
          amount: base.amount || 'ZMW 50,000.00',
          reason: base.reason || 'High morning customer cash withdrawal demand',
          submittedAt: stableSubmittedAt,
          status: 'match_unavailable',
          matchedAgent: undefined,
        };

      case 'connection_issue':
        return {
          ...base,
          id: base.id || 'AL-9042',
          requestReference: base.requestReference || 'AL-9042',
          requestType: base.requestType || 'cash',
          amount: base.amount || 'ZMW 50,000.00',
          reason: base.reason || 'High morning customer cash withdrawal demand',
          submittedAt: stableSubmittedAt,
          status: 'matched',
          matchedAgent: base.matchedAgent || {
            name: 'Michael Adeleke',
            agentReference: 'AG-70231',
            boothOrLocation: 'Booth 01 — West Wing, Central Mall',
            distance: '65 m away',
          },
          exchangeLocation:
            base.exchangeLocation ||
            base.booth ||
            'Booth 03 — Main Atrium, Central Mall Branch #104',
        };

      default:
        return {
          ...base,
          submittedAt: stableSubmittedAt,
        };
    }
  }

  const isMatchUnavailable =
    previewState === 'match_unavailable' || activeRequest.status === 'match_unavailable';
  const isConnectionIssue = previewState === 'connection_issue';

  const handleRetry = () => {
    setIsRetrying(true);
    if (onRetry) onRetry();
    setTimeout(() => {
      setIsRetrying(false);
    }, 800);
  };

  const handleProceed = () => {
    if (isMatchUnavailable) return;
    if (onProceedToTransaction) {
      onProceedToTransaction(activeRequest);
    } else {
      console.log('Proceed to transaction (Future Screen 14):', activeRequest);
    }
  };

  return (
    <div
      id="agent-liquidity-exchange-screen"
      className="flex flex-col h-full bg-slate-50 text-slate-900 select-none overflow-hidden"
    >
      {/* 1. Header (Compact Authenticated Detail Header) */}
      <header className="bg-white border-b border-slate-200/80 px-3.5 py-2.5 flex items-center justify-between shadow-2xs shrink-0 z-10">
        <div className="flex items-center gap-2">
          <button
            id="back-button"
            onClick={onBack || onBackToRequests}
            className="p-1.5 -ml-1 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-slate-100 active:scale-95 transition-all"
            aria-label="Back to request status"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <div>
            <h1 className="text-sm font-extrabold text-[#002244] tracking-tight leading-tight">
              Liquidity Exchange
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

      {/* 2. Connection Issue Notification (Preserves confirmed match) */}
      {isConnectionIssue && (
        <div className="bg-amber-50 border-b border-amber-200 px-3.5 py-2 flex items-center justify-between text-xs text-amber-900 shrink-0">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span className="text-[11px] font-semibold text-amber-800">
              Unable to refresh exchange status
            </span>
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

      {/* 3. Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
        {/* TOP STATUS CARD */}
        {!isMatchUnavailable ? (
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
                  You and the matched Agent can now complete the liquidity exchange.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-amber-200 rounded-2xl p-3.5 shadow-2xs space-y-2 relative overflow-hidden">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="flex-1">
                <h2 className="text-sm font-black text-slate-800">
                  Match no longer available
                </h2>
                <p className="text-xs text-slate-600 leading-snug">
                  This exchange can no longer continue with the matched Agent.
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
        )}

        {/* EXCHANGE SUMMARY CARD */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Exchange Summary
            </span>
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                activeRequest.requestType === 'cash'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                  : 'bg-blue-50 text-[#0052CC] border border-blue-200/50'
              }`}
            >
              <Coins className="w-3 h-3" />
              <span>
                {activeRequest.requestType === 'cash' ? 'Cash Exchange' : 'Float Exchange'}
              </span>
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-xs text-slate-500 font-medium">Requested Amount</span>
            <span className="text-base font-black text-[#002244] font-mono">
              {activeRequest.amount}
            </span>
          </div>

          {/* Reason Section */}
          <div className="space-y-1 pt-1 border-t border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Reason / Note
            </span>
            <p className="text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-xl p-2.5 leading-relaxed">
              {activeRequest.reason ||
                (activeRequest.requestType === 'cash'
                  ? 'Operational cash replenishment for booth register.'
                  : 'Replenishing float for customer transfers.')}
            </p>
          </div>

          {/* Submitted Date/Time */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] text-slate-400">
            <span>Submitted</span>
            <span className="font-medium text-slate-600 font-mono">
              {activeRequest.submittedAt || formatNaturalSubmittedTime()}
            </span>
          </div>
        </div>

        {/* PARTICIPATING AGENTS SECTION (Requester & Matched Agent) */}
        {!isMatchUnavailable && (
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-2xs space-y-3">
            <div className="border-b border-slate-100 pb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Participating Counterparties</span>
              </span>
            </div>

            {/* Requester Row */}
            <div className="space-y-1 pb-2 border-b border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium flex items-center gap-1">
                  <span>Requester</span>
                  {userRole === 'requester' && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-100 text-blue-800">
                      You
                    </span>
                  )}
                </span>
                <div className="text-right">
                  <span className="font-bold text-[#002244]">
                    {activeRequest.requesterName || 'Marcus Vance'}
                  </span>
                  {activeRequest.requesterReference && (
                    <span className="text-[10px] text-slate-400 font-mono block">
                      #{activeRequest.requesterReference}
                    </span>
                  )}
                </div>
              </div>
              {(activeRequest.requesterBooth || activeRequest.booth) && (
                <div className="flex items-start gap-1.5 text-[11px] text-slate-600">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{activeRequest.requesterBooth || activeRequest.booth}</span>
                </div>
              )}
            </div>

            {/* Matched Agent Row */}
            {activeRequest.matchedAgent && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium flex items-center gap-1">
                    <span>Matched Agent</span>
                    {userRole === 'matched_agent' && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                        You
                      </span>
                    )}
                  </span>
                  <div className="text-right">
                    <span className="font-bold text-[#002244]">
                      {activeRequest.matchedAgent.name}
                    </span>
                    {activeRequest.matchedAgent.agentReference && (
                      <span className="text-[10px] text-slate-400 font-mono block">
                        #{activeRequest.matchedAgent.agentReference}
                      </span>
                    )}
                  </div>
                </div>
                {activeRequest.matchedAgent.boothOrLocation && (
                  <div className="flex items-start gap-1.5 text-[11px] text-slate-600">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{activeRequest.matchedAgent.boothOrLocation}</span>
                  </div>
                )}
                {(() => {
                  const proximityLabel = formatMatchedProximity(
                    activeRequest.matchedAgent.distance,
                    activeRequest.matchedAgent.estimatedTravelTime
                  );
                  if (!proximityLabel) return null;
                  return (
                    <div className="pt-0.5 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (onChatWithAgent) onChatWithAgent();
                          else console.log('Contract trigger: Target Screen AgentChatConversationScreen');
                        }}
                        className="py-1 px-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200/80 text-[#0052CC] font-bold text-[10.5px] flex items-center gap-1.5 transition-colors"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Chat with Agent</span>
                      </button>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {proximityLabel}
                      </span>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* EXCHANGE LOCATION CARD */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-2xs space-y-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#0052CC]" />
            <span>Exchange Location</span>
          </span>
          <p className="text-xs text-slate-800 font-semibold leading-snug">
            {activeRequest.exchangeLocation ||
              activeRequest.booth ||
              activeRequest.location ||
              'Booth 03 — Main Atrium, Central Mall Branch #104'}
          </p>
        </div>

        {/* GUIDANCE CARD: Complete the exchange */}
        {!isMatchUnavailable && (
          <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-3 shadow-2xs flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#0052CC] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-[#002244] block">
                Complete the exchange
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Meet the matched Agent at the exchange location and verify the Cash/Float exchange before proceeding.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 4. STICKY BOTTOM ACTION */}
      {!isMatchUnavailable && (
        <div className="bg-white border-t border-slate-200/80 p-3 shadow-lg shrink-0 space-y-2">
          <button
            type="button"
            id="liquidity-chat-agent-btn"
            onClick={() => {
              if (onChatWithAgent) onChatWithAgent();
              else console.log('Contract trigger: Target Screen AgentChatConversationScreen');
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-700 border border-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 active:scale-[0.99]"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#0052CC]" />
            <span>Chat with Matched Agent</span>
          </button>

          <button
            id="proceed-to-transaction-btn"
            onClick={handleProceed}
            className="w-full py-3 px-4 rounded-xl bg-[#0052CC] hover:bg-[#0043A8] active:bg-[#00388F] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-xs active:scale-[0.99] transition-all"
          >
            <span>Proceed to Transaction</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
          <p className="text-[10px] text-center text-slate-400 font-medium leading-tight">
            Tap when both Agents are present and ready to record the transaction.
          </p>
        </div>
      )}
    </div>
  );
};
