import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Coins,
  MapPin,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  User,
  ArrowRight,
  RefreshCw,
  Loader2,
  Clock,
  FileText,
} from 'lucide-react';
import { TellerBudLogo } from '../components/TellerBudLogo';
import {
  AgentLiquidityRequestDetail,
  AgentLiquidityTransactionPreviewState,
} from '../types';
import { PoweredByCinitecFooter } from '../components/PoweredByCinitecFooter';
import { formatNaturalSubmittedTime } from './AgentLiquidityRequestDetailScreen';
import { getVendorType, getVendorLogo } from '../config/walkInConfig';
import { normalizeZmwAmount } from '../config/currencyConfig';

interface AgentLiquidityTransactionScreenProps {
  request?: AgentLiquidityRequestDetail;
  previewState?: AgentLiquidityTransactionPreviewState;
  onBack?: () => void;
  onBackToRequests?: () => void;
  onContinueToCompletion?: (transactionData: AgentLiquidityRequestDetail) => void;
  onRetry?: () => void;
  onCheckStatus?: () => void;
}

const defaultMockTransactionRequest: AgentLiquidityRequestDetail = {
  id: 'AL-9042',
  requestReference: 'AL-9042',
  requestType: 'cash',
  amount: 'ZMW 50,000.00',
  reason: 'High morning customer cash withdrawal demand',
  location: 'Plot 42, Cairo Road, Lusaka, Zambia',
  booth: 'Booth 03 — Main Atrium, Central Mall Branch #104',
  submittedAt: formatNaturalSubmittedTime(),
  status: 'matched',
  notificationsSent: true,
  requesterName: 'Marcus Vance (You)',
  matchedAgent: {
    name: 'Michael Adeleke',
    agentReference: 'AG-70231',
    boothOrLocation: 'Booth 01 — West Wing, Central Mall',
    distance: '65 m away',
  },
  exchangeLocation: 'Booth 01 — West Wing, Central Mall',
};

export const AgentLiquidityTransactionScreen: React.FC<
  AgentLiquidityTransactionScreenProps
> = ({
  request = defaultMockTransactionRequest,
  previewState = 'cash_ready',
  onBack,
  onBackToRequests,
  onContinueToCompletion,
  onRetry,
  onCheckStatus,
}) => {
  const [activeRequest, setActiveRequest] = useState<AgentLiquidityRequestDetail>(() => {
    return applyPreviewState(request, previewState);
  });
  const [showConfirmSheet, setShowConfirmSheet] = useState<boolean>(
    previewState === 'confirm_exchange'
  );
  const [isRecording, setIsRecording] = useState<boolean>(previewState === 'recording');
  const [isRecorded, setIsRecorded] = useState<boolean>(
    previewState === 'exchange_recorded' || request.status === 'transaction_recorded'
  );
  const [recordedTime, setRecordedTime] = useState<string>(() => {
    return (
      request.recordedAt ||
      `Today, ${new Date().toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })}`
    );
  });
  const [isRetrying, setIsRetrying] = useState<boolean>(false);

  useEffect(() => {
    const updated = applyPreviewState(request, previewState);
    setActiveRequest(updated);
    setShowConfirmSheet(previewState === 'confirm_exchange');
    setIsRecording(previewState === 'recording');
    setIsRecorded(
      previewState === 'exchange_recorded' ||
        updated.status === 'transaction_recorded' ||
        updated.status === 'completed'
    );
    if ((previewState === 'exchange_recorded' || updated.status === 'completed') && !updated.recordedAt) {
      setRecordedTime(
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
    state?: AgentLiquidityTransactionPreviewState | string
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
          amount: base.amount ? normalizeZmwAmount(base.amount) : 'ZMW 50,000.00',
          reason: base.reason || 'High morning customer cash withdrawal demand',
          submittedAt: stableSubmittedAt,
          requesterName: base.requesterName || 'Marcus Vance (You)',
          location: base.location || 'Plot 42, Cairo Road, Lusaka, Zambia',
          booth: base.booth || 'Booth 03 — Main Atrium, Central Mall Branch #104',
          status: 'matched',
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

      case 'float_ready':
        return {
          ...base,
          id: 'AL-9055',
          requestReference: 'AL-9055',
          requestType: 'float',
          vendorType: base.vendorType || 'MNO',
          vendor: base.vendor || 'MTN',
          amount: 'ZMW 100,000.00',
          reason: 'Replenishing float for customer transfers',
          submittedAt: stableSubmittedAt,
          requesterName: base.requesterName || 'Marcus Vance (You)',
          location: base.location || 'Plot 42, Cairo Road, Lusaka, Zambia',
          booth: base.booth || 'Booth 03 — Main Atrium, Central Mall Branch #104',
          status: 'matched',
          matchedAgent: {
            name: 'Sarah Nnamdi',
            agentReference: 'AG-88210',
            boothOrLocation: 'Booth 04 — North Gate, Central Mall',
            distance: '110 m away',
          },
          exchangeLocation: 'Booth 04 — North Gate, Central Mall',
        };

      case 'confirm_exchange':
      case 'recording':
        return {
          ...base,
          id: base.id || 'AL-9042',
          requestReference: base.requestReference || 'AL-9042',
          requestType: base.requestType || 'cash',
          amount: base.amount ? normalizeZmwAmount(base.amount) : 'ZMW 50,000.00',
          reason: base.reason || 'High morning customer cash withdrawal demand',
          submittedAt: stableSubmittedAt,
          requesterName: base.requesterName || 'Marcus Vance (You)',
          status: 'matched',
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

      case 'exchange_recorded':
        return {
          ...base,
          id: base.id || 'AL-9042',
          requestReference: base.requestReference || 'AL-9042',
          requestType: base.requestType || 'cash',
          amount: base.amount ? normalizeZmwAmount(base.amount) : 'ZMW 50,000.00',
          reason: base.reason || 'High morning customer cash withdrawal demand',
          submittedAt: stableSubmittedAt,
          requesterName: base.requesterName || 'Marcus Vance (You)',
          status: 'transaction_recorded',
          recordedAt:
            base.recordedAt ||
            `Today, ${new Date().toLocaleTimeString([], {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            })}`,
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

      case 'status_not_confirmed':
      case 'connection_issue':
        return {
          ...base,
          id: base.id || 'AL-9042',
          requestReference: base.requestReference || 'AL-9042',
          requestType: base.requestType || 'cash',
          amount: base.amount ? normalizeZmwAmount(base.amount) : 'ZMW 50,000.00',
          reason: base.reason || 'High morning customer cash withdrawal demand',
          submittedAt: stableSubmittedAt,
          requesterName: base.requesterName || 'Marcus Vance (You)',
          status: 'matched',
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

      default:
        return {
          ...base,
          submittedAt: stableSubmittedAt,
        };
    }
  }

  const isStatusNotConfirmed = previewState === 'status_not_confirmed';
  const isConnectionIssue = previewState === 'connection_issue';

  const handleOpenConfirm = () => {
    if (isRecording || isRecorded) return;
    setShowConfirmSheet(true);
  };

  const handleCloseConfirm = () => {
    setShowConfirmSheet(false);
  };

  const handleCommitRecord = () => {
    if (isRecording || isRecorded) return;
    setShowConfirmSheet(false);
    setIsRecording(true);

    setTimeout(() => {
      const nowFormatted = `Today, ${new Date().toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })}`;
      setRecordedTime(nowFormatted);
      setIsRecording(false);
      setIsRecorded(true);
      setActiveRequest((prev) => ({
        ...prev,
        status: 'transaction_recorded',
        recordedAt: nowFormatted,
      }));
    }, 1200);
  };

  const handleContinue = () => {
    if (onContinueToCompletion) {
      onContinueToCompletion({
        ...activeRequest,
        amount: normalizeZmwAmount(activeRequest.amount),
        currencyCode: 'ZMW',
        currencySymbol: 'ZMW',
        status: 'transaction_recorded',
        recordedAt: recordedTime,
      });
    } else {
      console.log('Continue to completion (Future Screen 15):', {
        ...activeRequest,
        amount: normalizeZmwAmount(activeRequest.amount),
        currencyCode: 'ZMW',
        currencySymbol: 'ZMW',
        status: 'transaction_recorded',
        recordedAt: recordedTime,
      });
    }
  };

  const handleRetryAction = () => {
    setIsRetrying(true);
    if (onRetry) onRetry();
    setTimeout(() => {
      setIsRetrying(false);
    }, 800);
  };

  const handleCheckStatusAction = () => {
    if (onCheckStatus) {
      onCheckStatus();
    } else if (onBackToRequests) {
      onBackToRequests();
    }
  };

  return (
    <div
      id="agent-liquidity-transaction-screen"
      className="flex flex-col h-full bg-slate-50 text-slate-900 select-none overflow-hidden relative"
    >
      {/* 1. Header (Compact Authenticated Detail Header) */}
      <header className="bg-white border-b border-slate-200/80 px-3.5 py-2.5 flex items-center justify-between shadow-2xs shrink-0 z-10">
        <div className="flex items-center gap-2">
          {!isRecorded ? (
            <button
              id="back-button"
              onClick={onBack}
              disabled={isRecording}
              className="p-1.5 -ml-1 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-slate-100 active:scale-95 transition-all disabled:opacity-40"
              aria-label="Back to exchange"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
          ) : (
            <div className="w-6" />
          )}
          <div>
            <h1 className="text-sm font-extrabold text-[#002244] tracking-tight leading-tight">
              Liquidity Transaction
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

      {/* 2. Failure / Exception Banners */}
      {isConnectionIssue && (
        <div className="bg-amber-50 border-b border-amber-200 px-3.5 py-2 flex items-center justify-between text-xs text-amber-900 shrink-0">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <div>
              <span className="text-[11px] font-bold text-amber-800 block">
                Unable to record exchange
              </span>
              <span className="text-[10px] text-amber-700">
                Check your connection and try again.
              </span>
            </div>
          </div>
          <button
            onClick={handleRetryAction}
            disabled={isRetrying}
            className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-[11px] font-bold inline-flex items-center gap-1 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isRetrying ? 'animate-spin' : ''}`} />
            <span>Retry</span>
          </button>
        </div>
      )}

      {isStatusNotConfirmed && (
        <div className="bg-amber-50 border-b border-amber-200 px-3.5 py-2.5 flex items-center justify-between text-xs text-amber-900 shrink-0">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <div>
              <span className="text-[11px] font-bold text-amber-800 block">
                Exchange status not confirmed
              </span>
              <span className="text-[10px] text-amber-700">
                We couldn't confirm whether this exchange was recorded.
              </span>
            </div>
          </div>
          <button
            onClick={handleCheckStatusAction}
            className="px-2.5 py-1 rounded-lg bg-[#0052CC] hover:bg-[#0043A8] text-white text-[11px] font-bold transition-colors shrink-0"
          >
            Check Status
          </button>
        </div>
      )}

      {/* 3. Main Content (Evenly Distributed, Single-Screen Viewport Friendly) */}
      <div className="flex-1 flex flex-col justify-between px-4 py-3.5 overflow-hidden">
        <div className="space-y-3">
          {/* Status Indicator (Comfortable breathing room, +8-12px padding) */}
          {!isRecorded ? (
            <div className="bg-blue-50/90 border border-blue-200/80 rounded-2xl p-3.5 flex items-center gap-3 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#0052CC] flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div className="flex-1">
                <h2 className="text-sm font-black text-[#002244] leading-tight">
                  Ready to record exchange
                </h2>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-50/90 border border-emerald-200/80 rounded-2xl p-3.5 flex items-center gap-3 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div className="flex-1">
                <h2 className="text-sm font-black text-[#002244] leading-tight">
                  Exchange recorded
                </h2>
              </div>
            </div>
          )}

          {/* LIQUIDITY EXCHANGE SUMMARY CARD (Expanded moderately with balanced spacing) */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {isRecorded ? 'Recorded Exchange Summary' : 'Liquidity Exchange'}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                  activeRequest.requestType === 'cash'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                    : 'bg-blue-50 text-[#0052CC] border border-blue-200/50'
                }`}
              >
                <Coins className="w-3 h-3" />
                <span>
                  {activeRequest.requestType === 'cash' ? 'Cash' : 'Float'}
                </span>
              </span>
            </div>

            <div className="flex items-baseline justify-between pt-0.5">
              <span className="text-xs text-slate-500 font-medium">Exchange Amount</span>
              <span className="text-base font-black text-[#002244] font-mono">
                {normalizeZmwAmount(activeRequest.amount)}
              </span>
            </div>

            {activeRequest.requestReference && (
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-400">
                <span>Request Reference</span>
                <span className="font-mono font-bold text-slate-700">
                  #{activeRequest.requestReference}
                </span>
              </div>
            )}

            {isRecorded && (
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Recorded Time</span>
                </span>
                <span className="font-mono font-bold text-emerald-700">
                  {recordedTime}
                </span>
              </div>
            )}
          </div>

          {/* EXCHANGE & COUNTERPARTY DETAILS CARD (Expanded spacing & fully readable location) */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-2xs space-y-2.5">
            <div className="border-b border-slate-100 pb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Exchange Details
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium flex items-center gap-1.5 shrink-0">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Requester</span>
                </span>
                <span className="font-bold text-slate-800 text-right">
                  {activeRequest.requesterName || 'Marcus Vance (You)'}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100/70">
                <span className="text-slate-400 font-medium flex items-center gap-1.5 shrink-0">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Matched Agent</span>
                </span>
                <div className="text-right">
                  <span className="font-bold text-[#002244]">
                    {activeRequest.matchedAgent?.name || 'Michael Adeleke'}
                  </span>
                  {activeRequest.matchedAgent?.agentReference && (
                    <span className="text-[10px] text-slate-400 font-mono ml-1.5">
                      #{activeRequest.matchedAgent.agentReference}
                    </span>
                  )}
                </div>
              </div>

              {/* Vendor Info for Float */}
              {(activeRequest.vendor || activeRequest.vendorType || activeRequest.requestType === 'float') && (
                <div className="flex items-center justify-between pt-2 border-t border-slate-100/70">
                  <span className="text-slate-400 font-medium shrink-0">Vendor</span>
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    {getVendorLogo(activeRequest.vendor || 'MTN') && (
                      <div className="w-4 h-4 rounded bg-white border border-slate-200 p-0.5 flex items-center justify-center shrink-0 overflow-hidden">
                        <img
                          src={getVendorLogo(activeRequest.vendor || 'MTN')}
                          alt={activeRequest.vendor || 'MTN'}
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                    <span>{activeRequest.vendor || 'MTN'} ({activeRequest.vendorType || 'MNO'})</span>
                  </span>
                </div>
              )}

              {/* Exchange Location (Full, Non-truncated, fully readable) */}
              <div className="flex items-start justify-between pt-2 border-t border-slate-100/70 gap-2.5">
                <span className="text-slate-400 font-medium flex items-center gap-1.5 shrink-0 pt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#0052CC]" />
                  <span>Exchange Location</span>
                </span>
                <span className="text-right text-xs text-slate-700 font-semibold leading-snug">
                  {activeRequest.matchedAgent?.boothOrLocation ||
                    activeRequest.matchedAgent?.booth ||
                    activeRequest.matchedAgent?.location ||
                    activeRequest.exchangeLocation ||
                    'Booth 01 — West Wing, Central Mall'}
                </span>
              </div>
            </div>
          </div>

          {/* Service Fee Info (Recorded state only) */}
          {isRecorded && (
            <div className="bg-slate-100/80 border border-slate-200/80 rounded-xl px-3.5 py-2 shadow-2xs flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium text-xs">TellerBud Fee</span>
              <span className="font-bold text-slate-700 font-mono text-xs">
                {activeRequest.serviceFee || 'Standard Rules'}
              </span>
            </div>
          )}
        </div>

        {/* 4. ACTIONS & TRUE FOOTER (Controlled moderate spacing, no giant white void) */}
        <div className="pt-4 pb-1 space-y-2.5 shrink-0">
          {!isRecorded ? (
            <button
              id="record-exchange-btn"
              onClick={handleOpenConfirm}
              disabled={isRecording || isStatusNotConfirmed}
              className="w-full py-3 px-4 rounded-xl bg-[#0052CC] hover:bg-[#0043A8] active:bg-[#00388F] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-xs active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
            >
              {isRecording ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Recording Exchange...</span>
                </>
              ) : (
                <>
                  <span>Record Exchange</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          ) : (
            <button
              id="continue-to-completion-btn"
              onClick={handleContinue}
              className="w-full py-3 px-4 rounded-xl bg-[#0052CC] hover:bg-[#0043A8] active:bg-[#00388F] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-xs active:scale-[0.99] transition-all cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}

          {/* True Footer directly below Record Exchange / Continue */}
          <div className="pt-0.5 pb-1">
            <PoweredByCinitecFooter className="py-0" />
          </div>
        </div>
      </div>

      {/* 5. CONFIRMATION BOTTOM SHEET */}
      {showConfirmSheet && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/50 backdrop-blur-2xs transition-opacity animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl border-t border-slate-200 p-4 space-y-3.5 shadow-2xl animate-in slide-in-from-bottom duration-250">
            {/* Sheet Handle */}
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto" />

            <div className="space-y-1">
              <h3 className="text-base font-black text-[#002244]">
                Record this exchange?
              </h3>
            </div>

            {/* Compact Summary in Sheet */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Exchange Type</span>
                <span className="font-bold text-slate-800 uppercase">
                  {activeRequest.requestType === 'cash' ? 'Cash' : 'Float'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Amount</span>
                <span className="font-bold text-[#002244] font-mono">
                  {normalizeZmwAmount(activeRequest.amount)}
                </span>
              </div>
              {(activeRequest.vendor || activeRequest.vendorType || activeRequest.requestType === 'float') && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Vendor Type</span>
                    <span className="font-bold text-slate-800">
                      {activeRequest.vendorType || (activeRequest.vendor ? getVendorType(activeRequest.vendor) : undefined) || 'MNO'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Vendor</span>
                    <span className="font-bold text-slate-800">
                      {activeRequest.vendor || 'MTN'}
                    </span>
                  </div>
                </>
              )}
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Matched Agent</span>
                <span className="font-bold text-slate-800">
                  {activeRequest.matchedAgent?.name || 'Michael Adeleke'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                id="cancel-record-btn"
                onClick={handleCloseConfirm}
                className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-100 active:bg-slate-200 text-slate-700 text-xs font-bold text-center transition-colors"
              >
                Not Yet
              </button>
              <button
                id="confirm-record-btn"
                onClick={handleCommitRecord}
                className="py-2.5 px-3 rounded-xl bg-[#0052CC] hover:bg-[#0043A8] active:bg-[#00388F] text-white text-xs font-extrabold text-center shadow-xs transition-colors"
              >
                Record Exchange
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
