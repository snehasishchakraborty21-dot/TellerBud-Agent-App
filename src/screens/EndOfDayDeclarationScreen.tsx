import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Banknote,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Clock,
  Store,
  User,
  Loader2,
  RefreshCw,
  X,
} from 'lucide-react';
import { TellerBudLogo } from '../components/TellerBudLogo';
import {
  WorkAssignment,
  EndOfDayDeclarationPreviewState,
  EndOfDayDeclarationRecord,
} from '../types';
import { PoweredByCinitecFooter } from '../components/PoweredByCinitecFooter';
import {
  useSharedClock,
  formatAppTime,
  calculateWorkingDuration,
} from '../utils/timeUtils';

export interface EndOfDayDeclarationConfig {
  isRemarksRequired?: boolean;
  currencySymbol?: string;
  currencyCode?: string;
}

interface EndOfDayDeclarationScreenProps {
  assignment?: WorkAssignment;
  previewState?: EndOfDayDeclarationPreviewState;
  config?: EndOfDayDeclarationConfig;
  sessionStartTime?: string;
  onBack?: () => void;
  onSubmitSuccess?: (record: EndOfDayDeclarationRecord) => void;
  onReturnToSignIn?: () => void;
}

const defaultAssignment: WorkAssignment = {
  business: 'Apex Retail Group',
  store: 'Central Mall Branch #104',
  booth: 'Booth 03 — Main Atrium',
  location: 'Plot 42, Cairo Road, Lusaka, Zambia',
  agentName: 'Marcus Vance',
  agentId: 'AG-88421',
};

// Helper to format currency string cleanly with ZMW
const formatCurrencyDisplay = (numStr: string, symbol: string = 'ZMW'): string => {
  if (!numStr || numStr.trim() === '') return `${symbol} 0.00`;
  const clean = numStr.replace(/[^0-9.]/g, '');
  const val = parseFloat(clean);
  if (isNaN(val)) return `${symbol} 0.00`;
  return `${symbol} ${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const EndOfDayDeclarationScreen: React.FC<EndOfDayDeclarationScreenProps> = ({
  assignment = defaultAssignment,
  previewState = 'default',
  config = {
    isRemarksRequired: false,
    currencySymbol: 'ZMW',
    currencyCode: 'ZMW',
  },
  sessionStartTime,
  onBack,
  onSubmitSuccess,
  onReturnToSignIn,
}) => {
  const currencySymbol = config.currencySymbol || 'ZMW';
  const sharedClock = useSharedClock(1000);
  const currentDeviceTime = formatAppTime(sharedClock);

  // Determine dynamic or fallback session timestamps
  const resolvedSessionStartTime =
    sessionStartTime ||
    (() => {
      const d = new Date(sharedClock.getTime() - 45 * 60 * 1000);
      return formatAppTime(d);
    })();

  // Calculate duration string from sessionStart and currentTime
  const calculateWorkDuration = () => {
    return calculateWorkingDuration(resolvedSessionStartTime, currentDeviceTime);
  };

  const isRemarksRequired =
    previewState === 'remarks_required'
      ? true
      : (config.isRemarksRequired ?? false);

  // Form input states
  const [cashAmount, setCashAmount] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');

  // Validation touch states
  const [cashTouched, setCashTouched] = useState<boolean>(false);
  const [remarksTouched, setRemarksTouched] = useState<boolean>(false);

  // Workflow states
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [showConfirmSheet, setShowConfirmSheet] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusUnconfirmed, setStatusUnconfirmed] = useState<boolean>(false);
  const [finalDeclarationRecord, setFinalDeclarationRecord] =
    useState<EndOfDayDeclarationRecord | null>(null);

  // Synchronize state with previewState
  useEffect(() => {
    switch (previewState) {
      case 'default':
        setCashAmount('');
        setRemarks('');
        setCashTouched(false);
        setRemarksTouched(false);
        setIsSubmitting(false);
        setIsSuccess(false);
        setErrorMessage(null);
        setStatusUnconfirmed(false);
        setShowConfirmSheet(false);
        break;
      case 'remarks_required':
        setCashAmount('');
        setRemarks('');
        setCashTouched(false);
        setRemarksTouched(false);
        setIsSubmitting(false);
        setIsSuccess(false);
        setErrorMessage(null);
        setStatusUnconfirmed(false);
        setShowConfirmSheet(false);
        break;
      case 'submitting':
        setCashAmount('45,000');
        setRemarks('Routine end-of-day register closing');
        setIsSubmitting(true);
        setIsSuccess(false);
        setErrorMessage(null);
        setStatusUnconfirmed(false);
        setShowConfirmSheet(false);
        break;
      case 'workday_ended':
        setCashAmount('45,000');
        setRemarks('Routine end-of-day register closing');
        setIsSubmitting(false);
        setIsSuccess(true);
        setErrorMessage(null);
        setStatusUnconfirmed(false);
        setShowConfirmSheet(false);
        setFinalDeclarationRecord({
          agentId: assignment.agentId || 'AG-88421',
          agentName: assignment.agentName || 'Marcus Vance',
          business: assignment.business || 'Apex Retail Group',
          store: assignment.store || 'Central Mall Branch #104',
          booth: assignment.booth || 'Booth 03 — Main Atrium',
          sessionStartedAt: resolvedSessionStartTime,
          sessionEndedAt: currentDeviceTime,
          workDuration: calculateWorkDuration(),
          physicalCashDeclared: '45,000.00',
          remarks: 'Routine end-of-day register closing',
          declaredAt: currentDeviceTime,
          currencySymbol,
        });
        break;
      case 'connection_issue':
        setCashAmount('45,000');
        setRemarks('Smooth day with high retail traffic');
        setIsSubmitting(false);
        setIsSuccess(false);
        setErrorMessage('Unable to submit declaration. Check your connection and try again.');
        setStatusUnconfirmed(false);
        setShowConfirmSheet(false);
        break;
      case 'status_not_confirmed':
        setCashAmount('45,000');
        setRemarks('');
        setIsSubmitting(false);
        setIsSuccess(false);
        setErrorMessage(null);
        setStatusUnconfirmed(true);
        setShowConfirmSheet(false);
        break;
    }
  }, [previewState, resolvedSessionStartTime, currentDeviceTime, assignment, currencySymbol]);

  // Validation logic
  const parseAmountVal = (raw: string): number | null => {
    if (!raw || raw.trim() === '') return null;
    const clean = raw.replace(/,/g, '').trim();
    const parsed = parseFloat(clean);
    return isNaN(parsed) ? null : parsed;
  };

  const cashVal = parseAmountVal(cashAmount);
  const isCashValid = cashVal !== null && cashVal >= 0;

  const isRemarksValid = !isRemarksRequired || remarks.trim().length > 0;

  const isFormValid = isCashValid && isRemarksValid;

  // Handle Primary CTA (Open confirmation sheet)
  const handlePrimaryClick = () => {
    setCashTouched(true);
    setRemarksTouched(true);

    if (!isFormValid) return;
    setErrorMessage(null);
    setShowConfirmSheet(true);
  };

  // Handle Final Submission from Confirmation Bottom Sheet
  const handleFinalSubmit = () => {
    setShowConfirmSheet(false);
    setIsSubmitting(true);
    setErrorMessage(null);
    setStatusUnconfirmed(false);

    // Simulate reliable atomic session closure
    setTimeout(() => {
      setIsSubmitting(false);

      const record: EndOfDayDeclarationRecord = {
        agentId: assignment.agentId || 'AG-88421',
        agentName: assignment.agentName || 'Marcus Vance',
        business: assignment.business || 'Apex Retail Group',
        store: assignment.store || 'Central Mall Branch #104',
        booth: assignment.booth || 'Booth 03 — Main Atrium',
        sessionStartedAt: resolvedSessionStartTime,
        sessionEndedAt: currentDeviceTime,
        workDuration: calculateWorkDuration(),
        physicalCashDeclared: cashVal !== null ? cashVal.toFixed(2) : '0.00',
        remarks: remarks.trim() ? remarks.trim() : undefined,
        declaredAt: currentDeviceTime,
        currencySymbol,
      };

      setFinalDeclarationRecord(record);

      if (onSubmitSuccess) {
        onSubmitSuccess(record);
      }

      if (onReturnToSignIn) {
        onReturnToSignIn();
      } else {
        setIsSuccess(true);
      }
    }, 750);
  };

  // Handle Status Check (When status was not confirmed)
  const handleCheckStatus = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStatusUnconfirmed(false);
      // Resolve to success state
      const record: EndOfDayDeclarationRecord = {
        agentId: assignment.agentId || 'AG-88421',
        agentName: assignment.agentName || 'Marcus Vance',
        business: assignment.business || 'Apex Retail Group',
        store: assignment.store || 'Central Mall Branch #104',
        booth: assignment.booth || 'Booth 03 — Main Atrium',
        sessionStartedAt: resolvedSessionStartTime,
        sessionEndedAt: currentDeviceTime,
        workDuration: calculateWorkDuration(),
        physicalCashDeclared: cashVal !== null ? cashVal.toFixed(2) : '45,000.00',
        remarks: remarks.trim() ? remarks.trim() : undefined,
        declaredAt: currentDeviceTime,
        currencySymbol,
      };
      setFinalDeclarationRecord(record);
      if (onSubmitSuccess) {
        onSubmitSuccess(record);
      }
      if (onReturnToSignIn) {
        onReturnToSignIn();
      } else {
        setIsSuccess(true);
      }
    }, 600);
  };

  // Format monetary input safely on blur
  const handleCashBlur = () => {
    setCashTouched(true);
    if (cashVal !== null && cashVal >= 0) {
      setCashAmount(cashVal.toLocaleString('en-US'));
    }
  };

  return (
    <div className="w-full h-full min-h-full bg-slate-50 flex flex-col justify-between text-slate-900 select-none overflow-hidden font-sans relative">
      {/* 1. Header */}
      <header className="px-3.5 pt-3 pb-2.5 bg-white border-b border-slate-200/80 flex items-center justify-between shrink-0 z-10 shadow-2xs">
        <button
          onClick={() => {
            if (!isSuccess && onBack) {
              onBack();
            }
          }}
          disabled={isSuccess || isSubmitting}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
            isSuccess || isSubmitting
              ? 'opacity-30 cursor-not-allowed text-slate-400'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95'
          }`}
          title="Back to More"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="text-xs font-bold text-slate-900 tracking-tight text-center truncate px-2">
          End-of-Day Declaration
        </div>

        <div className="flex items-center justify-center shrink-0">
          <TellerBudLogo size="sm" />
        </div>
      </header>

      {/* 2. Main Body Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-3.5 py-3 space-y-3">
        {/* SUCCESS VIEW (Workday Ended) */}
        {isSuccess ? (
          <div className="space-y-3.5 animate-in fade-in zoom-in-95 duration-200">
            {/* Success Hero Banner */}
            <div className="bg-white border border-emerald-200/90 rounded-2xl p-4 shadow-2xs text-center space-y-2 relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/80 flex items-center justify-center mx-auto shadow-2xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-[#002244] tracking-tight">
                  Workday ended
                </h2>
              </div>
            </div>

            {/* Declaration Summary Card */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Declaration Summary
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-md">
                  Recorded
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <Banknote className="w-3.5 h-3.5 text-slate-400" />
                    Physical Cash
                  </span>
                  <span className="font-extrabold text-[#002244] font-mono">
                    {formatCurrencyDisplay(
                      finalDeclarationRecord?.physicalCashDeclared || cashAmount,
                      currencySymbol
                    )}
                  </span>
                </div>

                {finalDeclarationRecord?.remarks && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-slate-500 font-medium block text-[11px] mb-0.5">
                      Closing Remarks:
                    </span>
                    <p className="text-[11px] text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-200/60 leading-relaxed italic">
                      "{finalDeclarationRecord.remarks}"
                    </p>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Session Started</span>
                    <span className="font-semibold text-slate-700">
                      {finalDeclarationRecord?.sessionStartedAt || resolvedSessionStartTime}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Session Ended</span>
                    <span className="font-semibold text-slate-700">
                      {finalDeclarationRecord?.sessionEndedAt || currentDeviceTime}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Work Duration</span>
                    <span className="font-bold text-[#0052CC]">
                      {finalDeclarationRecord?.workDuration || calculateWorkDuration()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ACTIVE DECLARATION FORM VIEW */
          <div className="space-y-3">
            {/* Page Introduction */}
            <div>
              <h2 className="text-sm font-extrabold text-[#002244] tracking-tight">
                Declare closing balances
              </h2>
            </div>

            {/* Connection Error Banner */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2.5 shadow-2xs">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1.5">
                  <div className="font-bold">{errorMessage}</div>
                  <button
                    onClick={() => {
                      setErrorMessage(null);
                      handlePrimaryClick();
                    }}
                    className="px-2.5 py-1 rounded-md bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] inline-flex items-center gap-1 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Retry
                  </button>
                </div>
              </div>
            )}

            {/* Status Unconfirmed Banner */}
            {statusUnconfirmed && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5 shadow-2xs">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1.5">
                  <div className="font-bold">Declaration status not confirmed</div>
                  <p className="text-[11px] text-amber-800 leading-normal">
                    We couldn't confirm whether your closing declaration was recorded.
                  </p>
                  <button
                    onClick={handleCheckStatus}
                    className="px-3 py-1.5 rounded-md bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] inline-flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Check Status
                  </button>
                </div>
              </div>
            )}

            {/* Read-Only Context Card: CURRENT SESSION */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Current Session
                </span>
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Session Active</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs items-start">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Agent
                  </span>
                  <div className="font-bold text-slate-800 flex items-start gap-1 leading-snug">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="break-words leading-tight">{assignment.agentName || 'Marcus Vance'}</span>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Booth
                  </span>
                  <div className="font-bold text-slate-800 flex items-start gap-1 leading-snug">
                    <Store className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="break-words leading-tight">{assignment.booth || 'Booth 03 — Main Atrium'}</span>
                  </div>
                </div>

                <div className="space-y-0.5 pt-1.5 border-t border-slate-100 col-span-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Started
                  </span>
                  <div className="font-semibold text-slate-700 flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{resolvedSessionStartTime}</span>
                  </div>
                </div>

                <div className="space-y-0.5 pt-1.5 border-t border-slate-100 col-span-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Current Time
                  </span>
                  <div className="font-semibold text-slate-700 flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{currentDeviceTime}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CLOSING DECLARATION FORM */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-2xs space-y-3.5">
              <div className="pb-1 border-b border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Closing Declaration
                </span>
              </div>

              {/* Field 1: Physical Cash on Hand (REQUIRED) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="physical-cash-input"
                    className="text-xs font-bold text-slate-800 flex items-center gap-1.5"
                  >
                    <Banknote className="w-3.5 h-3.5 text-[#0052CC]" />
                    Physical Cash on Hand <span className="text-rose-500 font-bold">*</span>
                  </label>
                  {cashTouched && !isCashValid && (
                    <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">
                      Required
                    </span>
                  )}
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 font-bold text-xs font-mono">
                    {currencySymbol}
                  </div>
                  <input
                    id="physical-cash-input"
                    type="text"
                    inputMode="decimal"
                    value={cashAmount}
                    onChange={(e) => setCashAmount(e.target.value)}
                    onBlur={handleCashBlur}
                    placeholder="Enter amount"
                    className={`w-full pl-14 pr-3 py-2.5 rounded-xl border text-xs font-mono font-bold transition-all ${
                      cashTouched && !isCashValid
                        ? 'border-rose-300 bg-rose-50/40 text-rose-900 focus:ring-1 focus:ring-rose-500'
                        : 'border-slate-200 bg-white text-slate-900 focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC]/30'
                    }`}
                  />
                </div>

                {cashTouched && !isCashValid && (
                  <p className="text-[11px] text-rose-600 font-medium">
                    {cashVal === null ? 'Enter your physical Cash on hand.' : 'Enter a valid amount.'}
                  </p>
                )}
              </div>

              {/* Field 2: Closing Remarks (Directly beneath Physical Cash on Hand) */}
              <div className="space-y-1.5 pt-0.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="closing-remarks-input"
                    className="text-xs font-bold text-slate-800 flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                    Closing Remarks
                  </label>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      isRemarksRequired ? 'text-rose-600' : 'text-slate-400'
                    }`}
                  >
                    {isRemarksRequired ? 'Required' : 'Optional'}
                  </span>
                </div>

                <textarea
                  id="closing-remarks-input"
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  onBlur={() => setRemarksTouched(true)}
                  placeholder="Add closing remarks"
                  className={`w-full p-2.5 rounded-xl border text-xs leading-relaxed transition-all resize-none ${
                    remarksTouched && !isRemarksValid
                      ? 'border-rose-300 bg-rose-50/40 text-rose-900 focus:ring-1 focus:ring-rose-500'
                      : 'border-slate-200 bg-white text-slate-900 focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC]/30'
                  }`}
                />

                {remarksTouched && !isRemarksValid && (
                  <p className="text-[11px] text-rose-600 font-medium">
                    Add closing remarks.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <PoweredByCinitecFooter className="py-2" />
      </div>

      {/* 3. Sticky Primary Action Bar */}
      <div className="p-3.5 bg-white border-t border-slate-200/80 shrink-0 shadow-lg z-10">
        {isSuccess ? (
          <button
            onClick={() => {
              if (onReturnToSignIn) {
                onReturnToSignIn();
              }
            }}
            className="w-full py-3 px-4 rounded-xl bg-[#0052CC] hover:bg-[#003E99] text-white font-extrabold text-xs transition-colors shadow-2xs active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <span>Return to Sign In</span>
          </button>
        ) : (
          <button
            onClick={handlePrimaryClick}
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-xl font-extrabold text-xs transition-colors shadow-2xs flex items-center justify-center gap-2 ${
              isFormValid && !isSubmitting
                ? 'bg-[#0052CC] hover:bg-[#003E99] text-white active:scale-[0.99]'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Ending workday...</span>
              </>
            ) : (
              <span>Submit Declaration & End Workday</span>
            )}
          </button>
        )}
      </div>

      {/* 4. Confirmation Bottom Sheet Modal */}
      {showConfirmSheet && (
        <div className="absolute inset-0 z-30 bg-slate-900/50 backdrop-blur-2xs flex flex-col justify-end">
          <div className="bg-white rounded-t-3xl border-t border-slate-200 p-4 space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-200">
            {/* Sheet Header */}
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-extrabold text-[#002244] tracking-tight">
                Submit closing declaration?
              </h3>
              <button
                onClick={() => setShowConfirmSheet(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Read-Only Summary Box */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Physical Cash</span>
                <span className="font-extrabold text-[#002244] font-mono text-sm">
                  {formatCurrencyDisplay(cashAmount, currencySymbol)}
                </span>
              </div>

              {remarks.trim() && (
                <div className="pt-2 border-t border-slate-200/70">
                  <span className="text-slate-500 font-medium text-[11px] block mb-0.5">
                    Remarks:
                  </span>
                  <p className="text-[11px] text-slate-700 italic leading-normal truncate">
                    "{remarks}"
                  </p>
                </div>
              )}
            </div>

            {/* Sheet Actions */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={() => setShowConfirmSheet(false)}
                className="py-2.5 px-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                Review
              </button>
              <button
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="py-2.5 px-3 rounded-xl bg-[#0052CC] hover:bg-[#003E99] text-white font-extrabold text-xs transition-colors shadow-2xs flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Ending...</span>
                  </>
                ) : (
                  <span>Submit & End Workday</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
