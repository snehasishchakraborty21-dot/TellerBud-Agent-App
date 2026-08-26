import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Coins,
  MapPin,
  CheckCircle2,
  UserCheck,
  User,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { TellerBudLogo } from '../components/TellerBudLogo';
import {
  AgentLiquidityRequestDetail,
  AgentLiquidityCompletionPreviewState,
} from '../types';
import { PoweredByCinitecFooter } from '../components/PoweredByCinitecFooter';
import { formatNaturalSubmittedTime } from './AgentLiquidityRequestDetailScreen';
import { normalizeZmwAmount } from '../config/currencyConfig';

interface AgentLiquidityCompletionScreenProps {
  request?: AgentLiquidityRequestDetail;
  previewState?: AgentLiquidityCompletionPreviewState;
  onBackToRequests?: () => void;
}

const defaultMockCompletionRequest: AgentLiquidityRequestDetail = {
  id: 'AL-9042',
  requestReference: 'AL-9042',
  requestType: 'cash',
  amount: 'ZMW 50,000.00',
  reason: 'High morning customer cash withdrawal demand',
  location: 'Plot 42, Cairo Road, Lusaka, Zambia',
  booth: 'Booth 03 — Main Atrium, Central Mall Branch #104',
  submittedAt: formatNaturalSubmittedTime(),
  status: 'completed',
  notificationsSent: true,
  requesterName: 'Marcus Vance (You)',
  matchedAgent: {
    name: 'Michael Adeleke',
    agentReference: 'AG-70231',
    boothOrLocation: 'Booth 01 — West Wing, Central Mall',
    distance: '65 m away',
  },
  exchangeLocation: 'Booth 01 — West Wing, Central Mall',
  recordedAt: `Today, ${new Date().toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })}`,
  completedAt: `Today, ${new Date().toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })}`,
};

export const AgentLiquidityCompletionScreen: React.FC<
  AgentLiquidityCompletionScreenProps
> = ({
  request = defaultMockCompletionRequest,
  previewState = 'cash_completed',
  onBackToRequests,
}) => {
  const [activeRequest, setActiveRequest] = useState<AgentLiquidityRequestDetail>(() => {
    return applyPreviewState(request, previewState);
  });

  const [completedTime, setCompletedTime] = useState<string>(() => {
    return (
      request.completedAt ||
      request.recordedAt ||
      `Today, ${new Date().toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })}`
    );
  });

  useEffect(() => {
    const updated = applyPreviewState(request, previewState);
    setActiveRequest(updated);
    if (updated.completedAt) {
      setCompletedTime(updated.completedAt);
    } else {
      setCompletedTime(
        `Today, ${new Date().toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })}`
      );
    }
  }, [request, previewState]);

  function applyPreviewState(
    base: AgentLiquidityRequestDetail,
    state?: AgentLiquidityCompletionPreviewState | string
  ): AgentLiquidityRequestDetail {
    const stableSubmittedAt = base.submittedAt || formatNaturalSubmittedTime();
    const nowTime = `Today, ${new Date().toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })}`;

    if (state === 'float_completed') {
      return {
        ...base,
        id: 'AL-9055',
        requestReference: 'AL-9055',
        requestType: 'float',
        amount: 'ZMW 100,000.00',
        reason: 'Replenishing float for customer transfers',
        submittedAt: stableSubmittedAt,
        requesterName: base.requesterName || 'Marcus Vance (You)',
        location: base.location || 'Plot 42, Cairo Road, Lusaka, Zambia',
        booth: base.booth || 'Booth 03 — Main Atrium, Central Mall Branch #104',
        status: 'completed',
        recordedAt: base.recordedAt || nowTime,
        completedAt: base.completedAt || nowTime,
        matchedAgent: {
          name: 'Sarah Nnamdi',
          agentReference: 'AG-88210',
          boothOrLocation: 'Booth 04 — North Gate, Central Mall',
          distance: '110 m away',
        },
        exchangeLocation: 'Booth 04 — North Gate, Central Mall',
      };
    }

    // Default cash_completed
    return {
      ...base,
      id: base.id || 'AL-9042',
      requestReference: base.requestReference || 'AL-9042',
      requestType: 'cash',
      amount: base.amount ? normalizeZmwAmount(base.amount) : 'ZMW 50,000.00',
      reason: base.reason || 'High morning customer cash withdrawal demand',
      submittedAt: stableSubmittedAt,
      requesterName: base.requesterName || 'Marcus Vance (You)',
      location: base.location || 'Plot 42, Cairo Road, Lusaka, Zambia',
      booth: base.booth || 'Booth 03 — Main Atrium, Central Mall Branch #104',
      status: 'completed',
      recordedAt: base.recordedAt || nowTime,
      completedAt: base.completedAt || nowTime,
      matchedAgent: base.matchedAgent || {
        name: 'Michael Adeleke',
        agentReference: 'AG-70231',
        boothOrLocation: 'Booth 01 — West Wing, Central Mall',
        distance: '65 m away',
      },
      exchangeLocation:
        base.matchedAgent?.boothOrLocation ||
        base.exchangeLocation ||
        'Booth 01 — West Wing, Central Mall',
    };
  }

  const handleExitToRequests = () => {
    if (onBackToRequests) {
      onBackToRequests();
    }
  };

  return (
    <div
      id="agent-liquidity-completion-screen"
      className="flex flex-col h-full bg-slate-50 text-slate-900 select-none overflow-hidden relative"
    >
      {/* 1. Header (Compact Authenticated Detail Header) */}
      <header className="bg-white border-b border-slate-200/80 px-3.5 py-2.5 flex items-center justify-between shadow-2xs shrink-0 z-10">
        <div className="flex items-center gap-2">
          <button
            id="back-to-requests-header-btn"
            onClick={handleExitToRequests}
            className="p-1.5 -ml-1 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-slate-100 active:scale-95 transition-all"
            aria-label="Back to requests"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <div>
            <h1 className="text-sm font-extrabold text-[#002244] tracking-tight leading-tight">
              Liquidity Completion
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

      {/* 2. Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
        {/* COMPLETION STATUS CARD */}
        <div className="bg-white border border-emerald-200/90 rounded-2xl p-3.5 shadow-2xs space-y-1 relative overflow-hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex-1">
              <h2 className="text-sm font-black text-[#002244]">
                Exchange completed
              </h2>
            </div>
          </div>
        </div>

        {/* COMPLETED EXCHANGE SUMMARY CARD */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Completed Exchange
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
            <span className="text-xs text-slate-500 font-medium">Exchange Amount</span>
            <span className="text-base font-black text-[#002244] font-mono">
              {normalizeZmwAmount(activeRequest.amount)}
            </span>
          </div>

          <div className="space-y-2 pt-1 border-t border-slate-100/70 text-xs">
            {/* Requester */}
            <div className="flex items-start justify-between">
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Requester</span>
              </span>
              <span className="font-bold text-slate-800 text-right">
                {activeRequest.requesterName || 'Marcus Vance (You)'}
              </span>
            </div>

            {/* Matched Agent */}
            <div className="flex items-start justify-between pt-1.5 border-t border-slate-100/70">
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Matched Agent</span>
              </span>
              <div className="text-right">
                <span className="font-bold text-[#002244] block">
                  {activeRequest.matchedAgent?.name || 'Michael Adeleke'}
                </span>
                {activeRequest.matchedAgent?.agentReference && (
                  <span className="text-[10px] text-slate-400 font-mono">
                    #{activeRequest.matchedAgent.agentReference}
                  </span>
                )}
              </div>
            </div>

            {/* Exchange Location (Matched Agent's Location) */}
            <div className="pt-1.5 border-t border-slate-100/70">
              <span className="text-slate-400 text-xs font-medium flex items-center gap-1 mb-1">
                <MapPin className="w-3.5 h-3.5 text-[#0052CC]" />
                <span>Exchange Location</span>
              </span>
              <p className="text-xs text-slate-700 font-semibold pl-4.5 leading-snug">
                {activeRequest.matchedAgent?.boothOrLocation ||
                  activeRequest.matchedAgent?.booth ||
                  activeRequest.matchedAgent?.location ||
                  activeRequest.exchangeLocation ||
                  'Booth 01 — West Wing, Central Mall'}
              </p>
            </div>

            {/* Completed Time */}
            <div className="flex items-center justify-between pt-1.5 border-t border-slate-100/70 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Completed</span>
              </span>
              <span className="font-mono font-bold text-emerald-700">
                {completedTime}
              </span>
            </div>

            {/* Request Reference */}
            {activeRequest.requestReference && (
              <div className="flex items-center justify-between pt-1.5 border-t border-slate-100/70 text-[11px] text-slate-400">
                <span>Request Reference</span>
                <span className="font-mono font-bold text-slate-700">
                  #{activeRequest.requestReference}
                </span>
              </div>
            )}

            {/* Optional configured service fee row */}
            {activeRequest.serviceFee && (
              <div className="flex items-center justify-between pt-1.5 border-t border-slate-100/70 text-[11px] text-slate-400">
                <span>TellerBud Service Fee</span>
                <span className="font-mono font-bold text-slate-700">
                  {activeRequest.serviceFee}
                </span>
              </div>
            )}
          </div>
        </div>

        <PoweredByCinitecFooter className="py-2" />
      </div>

      {/* 3. STICKY BOTTOM ACTION */}
      <div className="bg-white border-t border-slate-200/80 p-3 shadow-lg shrink-0 z-10">
        <button
          id="back-to-requests-btn"
          onClick={handleExitToRequests}
          className="w-full py-3 px-4 rounded-xl bg-[#0052CC] hover:bg-[#0043A8] active:bg-[#00388F] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-xs active:scale-[0.99] transition-all"
        >
          <span>Back to Requests</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
