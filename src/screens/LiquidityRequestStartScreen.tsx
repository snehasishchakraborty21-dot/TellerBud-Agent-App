import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Users,
  Building2,
  Banknote,
  Smartphone,
  AlertCircle,
  Clock,
  CheckCircle2,
  Loader2,
  RefreshCw,
  ChevronDown,
  Check,
  X,
} from 'lucide-react';
import { TellerBudLogo } from '../components/TellerBudLogo';
import { VendorLogoBadge } from '../components/VendorLogoBadge';
import {
  WorkAssignment,
  LiquidityRequestFrom,
  LiquidityRequestType,
  LiquidityRequestPreviewState,
  LiquidityRequestFormData,
  VendorType,
} from '../types';
import { PoweredByCinitecFooter } from '../components/PoweredByCinitecFooter';
import { CONFIGURED_VENDOR_TYPES, getVendorsByType, getVendorLogo } from '../config/walkInConfig';
import { normalizeZmwAmount } from '../config/currencyConfig';

export interface LiquidityRequestConfig {
  requireReason?: boolean;
}

interface LiquidityRequestStartScreenProps {
  assignment?: WorkAssignment;
  previewState?: LiquidityRequestPreviewState;
  config?: LiquidityRequestConfig;
  isOffline?: boolean;
  onBack?: () => void;
  onSubmitSuccess?: (data: LiquidityRequestFormData) => void;
  onCheckStatus?: () => void;
}

const defaultAssignment: WorkAssignment = {
  business: 'Apex Retail Group',
  store: 'Central Mall Branch #104',
  booth: 'Booth 03 — Main Atrium',
  location: 'Plot 42, Commercial Avenue, Ikeja, Lagos',
  agentName: 'Marcus Vance',
  agentId: 'AG-88421',
};

export const LiquidityRequestStartScreen: React.FC<LiquidityRequestStartScreenProps> = ({
  assignment = defaultAssignment,
  previewState = 'another_agent_cash',
  isOffline = false,
  onBack,
  onSubmitSuccess,
  onCheckStatus,
}) => {
  const [requestFrom, setRequestFrom] = useState<LiquidityRequestFrom>(
    isOffline ? 'business_owner' : 'agent'
  );
  const [requestType, setRequestType] = useState<LiquidityRequestType>('cash');
  const [vendorType, setVendorType] = useState<VendorType | ''>('MNO');
  const [vendor, setVendor] = useState<string>('');
  const [showVendorSheet, setShowVendorSheet] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>('');
  const [amountTouched, setAmountTouched] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  // Available vendors filtered by selected vendor type
  const availableVendors = vendorType ? getVendorsByType(vendorType) : [];
  const selectedVendorOption = availableVendors.find((v) => v.name === vendor);
  const selectedVendorLogo = vendor ? getVendorLogo(vendor) : undefined;

  const handleVendorTypeChange = (newType: VendorType) => {
    setVendorType(newType);
    setVendor(''); // Clear previous vendor selection on type change
    setShowVendorSheet(false);
  };

  // Synchronize state with previewState
  useEffect(() => {
    switch (previewState) {
      case 'another_agent_cash':
        setRequestFrom(isOffline ? 'business_owner' : 'agent');
        setRequestType('cash');
        setVendorType('MNO');
        setVendor('');
        setAmount('');
        setAmountTouched(false);
        setIsSubmitting(false);
        setErrorMessage(null);
        setWarningMessage(null);
        break;
      case 'another_agent_float':
        setRequestFrom(isOffline ? 'business_owner' : 'agent');
        setRequestType('float');
        setVendorType('MNO');
        setVendor('');
        setAmount('');
        setAmountTouched(false);
        setIsSubmitting(false);
        setErrorMessage(null);
        setWarningMessage(null);
        break;
      case 'business_owner_cash':
        setRequestFrom('business_owner');
        setRequestType('cash');
        setVendorType('MNO');
        setVendor('');
        setAmount('');
        setAmountTouched(false);
        setIsSubmitting(false);
        setErrorMessage(null);
        setWarningMessage(null);
        break;
      case 'business_owner_float':
        setRequestFrom('business_owner');
        setRequestType('float');
        setVendorType('Bank');
        setVendor('');
        setAmount('');
        setAmountTouched(false);
        setIsSubmitting(false);
        setErrorMessage(null);
        setWarningMessage(null);
        break;
      case 'submitting':
        setRequestFrom(isOffline ? 'business_owner' : 'agent');
        setRequestType('cash');
        setVendorType('MNO');
        setVendor('');
        setAmount('');
        setAmountTouched(false);
        setIsSubmitting(true);
        setErrorMessage(null);
        setWarningMessage(null);
        break;
      case 'connection_issue':
        setRequestFrom(isOffline ? 'business_owner' : 'agent');
        setRequestType('cash');
        setVendorType('MNO');
        setVendor('');
        setAmount('');
        setAmountTouched(false);
        setIsSubmitting(false);
        setErrorMessage('Unable to submit request. Check your connection and try again.');
        setWarningMessage(null);
        break;
      case 'status_not_confirmed':
        setRequestFrom('business_owner');
        setRequestType('float');
        setVendorType('MNO');
        setVendor('');
        setAmount('');
        setAmountTouched(false);
        setIsSubmitting(false);
        setErrorMessage(null);
        setWarningMessage("Request status not confirmed. We couldn't confirm whether your request was submitted.");
        break;
      default:
        break;
    }
  }, [previewState, isOffline]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmountTouched(true);
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    if (!rawValue) {
      setAmount('');
      return;
    }
    const num = parseInt(rawValue, 10);
    if (!isNaN(num)) {
      setAmount(num.toLocaleString('en-US'));
    }
  };

  const parsedNumericAmount = parseInt(amount.replace(/[^0-9]/g, ''), 10) || 0;
  const isAmountValid = parsedNumericAmount > 0;
  const isVendorValid = requestType !== 'float' || (Boolean(vendorType) && Boolean(vendor));

  const isFormValid =
    Boolean(requestFrom) &&
    Boolean(requestType) &&
    isAmountValid &&
    isVendorValid;

  const showAmountError = amountTouched && !isAmountValid;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isSubmitting || hasSubmitted) return;

    setAmountTouched(true);

    if (!isAmountValid) {
      setErrorMessage('Please enter a valid amount.');
      return;
    }

    if (requestType === 'float' && (!vendorType || !vendor)) {
      setErrorMessage('Please select both Vendor Type and Vendor for float requests.');
      return;
    }

    setIsSubmitting(true);
    setHasSubmitted(true);
    setErrorMessage(null);

    // Simulate submission flow
    setTimeout(() => {
      setIsSubmitting(false);
      const payload: LiquidityRequestFormData = {
        requestFrom,
        requestType,
        vendorType: requestType === 'float' ? (vendorType as VendorType) : undefined,
        vendor: requestType === 'float' ? vendor : undefined,
        amount: normalizeZmwAmount(amount),
        locationOrBooth: assignment.booth || assignment.location,
        note: '',
      };
      onSubmitSuccess?.(payload);
    }, 900);
  };

  return (
    <div
      id="liquidity-request-start-screen"
      className="w-full h-full flex flex-col bg-slate-50 text-slate-800 font-sans overflow-hidden"
    >
      {/* Authenticated Detail Header */}
      <header className="w-full bg-white border-b border-slate-200/90 px-4 py-3 flex items-center justify-between shrink-0 shadow-xs z-10">
        <div className="flex items-center gap-2.5">
          <button
            id="back-button"
            onClick={onBack}
            className="w-8 h-8 rounded-xl bg-slate-100/80 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
            title="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-sm font-bold text-[#002244] leading-tight">
              Request Cash / Float
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <TellerBudLogo size="sm" />
        </div>
      </header>

      {/* Main Form Content Area - Natural Mobile Vertical Distribution */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-3.5 space-y-3.5 flex flex-col">
        {/* Connection Error Banner */}
        {errorMessage && (
          <div
            id="error-banner"
            className="bg-red-50 border border-red-200 rounded-2xl p-3 flex items-start gap-2.5 text-red-800 text-xs shadow-xs animate-in fade-in shrink-0"
          >
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">{errorMessage}</p>
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  handleSubmit();
                }}
                className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-100 text-red-900 font-bold text-[11px] hover:bg-red-200 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Retry</span>
              </button>
            </div>
          </div>
        )}

        {/* Warning / Status Not Confirmed Banner */}
        {warningMessage && (
          <div
            id="warning-banner"
            className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-start gap-2.5 text-amber-900 text-xs shadow-xs animate-in fade-in shrink-0"
          >
            <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">{warningMessage}</p>
              <button
                type="button"
                onClick={onCheckStatus}
                className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-200/80 text-amber-950 font-bold text-[11px] hover:bg-amber-300 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>Check Status</span>
              </button>
            </div>
          </div>
        )}

        {/* Section 1: Request From (Two-way workflow selector) */}
        <div className="shrink-0">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Request From
            </label>
            {isOffline && (
              <span className="text-[10px] font-medium text-slate-400">
                Agent requests disabled offline
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {/* Another Agent Option */}
            <button
              type="button"
              id="request-from-agent"
              disabled={isSubmitting || isOffline}
              onClick={() => {
                if (!isOffline) setRequestFrom('agent');
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all relative cursor-pointer ${
                isOffline
                  ? 'bg-slate-100/70 border-slate-200/80 text-slate-400 opacity-60 cursor-not-allowed'
                  : requestFrom === 'agent'
                  ? 'bg-blue-50/60 border-[#0052CC] ring-1 ring-[#0052CC]/30 text-[#002244]'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-7.5 h-7.5 rounded-xl flex items-center justify-center ${
                    isOffline
                      ? 'bg-slate-200 text-slate-400'
                      : requestFrom === 'agent'
                      ? 'bg-[#0052CC] text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Users className="w-4 h-4" />
                </div>
                {requestFrom === 'agent' && !isOffline && (
                  <span className="w-2 h-2 rounded-full bg-[#0052CC]" />
                )}
              </div>
              <span className="text-xs font-bold block leading-tight">
                Another Agent
              </span>
            </button>

            {/* Business Owner Option */}
            <button
              type="button"
              id="request-from-owner"
              onClick={() => setRequestFrom('business_owner')}
              disabled={isSubmitting}
              className={`p-3.5 rounded-2xl border text-left transition-all relative cursor-pointer ${
                requestFrom === 'business_owner'
                  ? 'bg-blue-50/60 border-[#0052CC] ring-1 ring-[#0052CC]/30 text-[#002244]'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-7.5 h-7.5 rounded-xl flex items-center justify-center ${
                    requestFrom === 'business_owner'
                      ? 'bg-[#0052CC] text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                </div>
                {requestFrom === 'business_owner' && (
                  <span className="w-2 h-2 rounded-full bg-[#0052CC]" />
                )}
              </div>
              <span className="text-xs font-bold block leading-tight">
                Business Owner
              </span>
            </button>
          </div>
        </div>

        {/* Section 2: Request Type (Cash vs Float) */}
        <div className="shrink-0">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Request Type
          </label>
          <div className="grid grid-cols-2 gap-2 bg-slate-200/60 p-1.5 rounded-2xl border border-slate-200">
            <button
              type="button"
              id="request-type-cash"
              onClick={() => setRequestType('cash')}
              disabled={isSubmitting}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                requestType === 'cash'
                  ? 'bg-white text-[#002244] shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Banknote className="w-4 h-4 text-emerald-600" />
              <span>Cash</span>
            </button>

            <button
              type="button"
              id="request-type-float"
              onClick={() => setRequestType('float')}
              disabled={isSubmitting}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                requestType === 'float'
                  ? 'bg-white text-[#002244] shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-4 h-4 text-[#0052CC]" />
              <span>Float</span>
            </button>
          </div>
        </div>

        {/* Section 2b: Vendor Type & Vendor Dropdown (Shown when Float is selected) */}
        {requestType === 'float' && (
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3.5 shrink-0">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Float Vendor Context
              </span>
            </div>

            {/* Vendor Type Selection */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                Vendor Type <span className="text-red-500 font-bold">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CONFIGURED_VENDOR_TYPES.map((vt) => (
                  <button
                    key={vt.id}
                    type="button"
                    id={`vendor-type-${vt.id.toLowerCase()}`}
                    onClick={() => handleVendorTypeChange(vt.id)}
                    disabled={isSubmitting}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      vendorType === vt.id
                        ? 'bg-blue-50/70 border-[#0052CC] text-[#002244] font-bold ring-1 ring-[#0052CC]/20'
                        : 'bg-slate-50 border-slate-200 text-slate-700 font-medium hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-xs font-bold">{vt.id}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Vendor Selection Dropdown */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                Vendor <span className="text-red-500 font-bold">*</span>
              </label>
              <button
                type="button"
                id="liquidity-vendor-dropdown-btn"
                disabled={!vendorType || isSubmitting}
                onClick={() => setShowVendorSheet(true)}
                className={`w-full py-2.5 px-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  !vendorType
                    ? 'bg-slate-100/70 border-slate-200 text-slate-400 cursor-not-allowed'
                    : vendor
                    ? 'bg-white border-slate-300 text-slate-900 shadow-2xs font-bold'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-400'
                }`}
              >
                {selectedVendorOption ? (
                  <div className="flex items-center gap-2.5 min-w-0">
                    <VendorLogoBadge
                      vendorName={selectedVendorOption.name}
                      size="dropdown-trigger"
                    />
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {selectedVendorOption.name}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs font-medium text-slate-400">
                    Select vendor
                  </span>
                )}
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
              </button>
            </div>
          </div>
        )}

        {/* Section 3: Amount Required Input */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-2 shrink-0">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Amount Required
            </label>
            <span className="text-[10px] font-semibold text-slate-400">
              Zambian Kwacha (ZMW)
            </span>
          </div>

          <div className="relative flex items-center">
            <div className="absolute left-3.5 flex items-center gap-1.5 pointer-events-none">
              <span className="text-xs font-extrabold text-[#002244] font-mono">
                ZMW
              </span>
              <span className="text-slate-300 font-light">|</span>
            </div>
            <input
              type="text"
              id="liquidity-amount-input"
              inputMode="numeric"
              value={amount}
              onChange={handleAmountChange}
              onBlur={() => setAmountTouched(true)}
              disabled={isSubmitting}
              placeholder="Enter amount"
              className={`w-full pl-16 pr-3.5 py-3 bg-slate-50 border rounded-xl text-sm font-bold text-[#002244] font-mono focus:bg-white focus:outline-none transition-all ${
                showAmountError
                  ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                  : 'border-slate-200 focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC]'
              }`}
            />
          </div>

          {showAmountError && (
            <p className="text-[11px] text-red-600 font-medium mt-1">
              Please enter a valid amount.
            </p>
          )}
        </div>
      </div>

      {/* Primary Action Button & True Footer */}
      <div className="px-4 pt-3 pb-2.5 bg-white border-t border-slate-200/90 shrink-0 shadow-lg space-y-2.5">
        <button
          type="button"
          id="submit-liquidity-request-button"
          onClick={() => handleSubmit()}
          disabled={!isFormValid || isSubmitting}
          className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs active:scale-[0.99] cursor-pointer ${
            isFormValid && !isSubmitting
              ? 'bg-[#0052CC] hover:bg-[#003da6] text-white'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-80'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Submitting Request...</span>
            </>
          ) : (
            <>
              <span>Submit Request</span>
              <CheckCircle2 className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Footer positioned below Submit Request button and above safe area */}
        <div className="pt-0.5 pb-0.5">
          <PoweredByCinitecFooter className="py-0.5" />
        </div>
      </div>

      {/* Vendor Selection Bottom Sheet */}
      {showVendorSheet && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-2xs flex flex-col justify-end animate-fadeIn">
          <div
            className="fixed inset-0"
            onClick={() => setShowVendorSheet(false)}
          />
          <div className="relative bg-white rounded-t-3xl border-t border-slate-200 p-4 pb-6 space-y-3 max-h-[85%] flex flex-col animate-slideUp shadow-2xl z-10">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Select {vendorType} Vendor
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowVendorSheet(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 overflow-y-auto no-scrollbar max-h-[320px] pt-1 pb-2">
              {availableVendors.map((v) => {
                const isSelected = vendor === v.name;
                return (
                  <button
                    key={v.id}
                    type="button"
                    id={`vendor-option-${v.id}`}
                    onClick={() => {
                      setVendor(v.name);
                      setShowVendorSheet(false);
                    }}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/80 border-[#0052CC] ring-1 ring-[#0052CC]/30 text-[#002244]'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <VendorLogoBadge
                        vendorName={v.name}
                        size="option-row"
                      />
                      <span className="text-xs font-bold text-slate-900 whitespace-nowrap">
                        {v.name}
                      </span>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-[#0052CC] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


