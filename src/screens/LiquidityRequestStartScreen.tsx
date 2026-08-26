import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Users,
  Building2,
  Banknote,
  Smartphone,
  MapPin,
  AlertCircle,
  Clock,
  CheckCircle2,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { TellerBudLogo } from '../components/TellerBudLogo';
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
  const [vendor, setVendor] = useState<string>('MTN');
  const [amount, setAmount] = useState<string>('');
  const [amountTouched, setAmountTouched] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  // Available vendors filtered by selected vendor type
  const availableVendors = vendorType ? getVendorsByType(vendorType) : [];

  const handleVendorTypeChange = (newType: VendorType) => {
    setVendorType(newType);
    setVendor(''); // Clear previous vendor selection on type change
  };

  // Synchronize state with previewState
  useEffect(() => {
    switch (previewState) {
      case 'another_agent_cash':
        setRequestFrom(isOffline ? 'business_owner' : 'agent');
        setRequestType('cash');
        setVendorType('MNO');
        setVendor('MTN');
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
        setVendor('MTN');
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
        setVendor('MTN');
        setAmount('');
        setAmountTouched(false);
        setIsSubmitting(false);
        setErrorMessage(null);
        setWarningMessage(null);
        break;
      case 'business_owner_float':
        setRequestFrom('business_owner');
        setRequestType('float');
        setVendorType('MNO');
        setVendor('MTN');
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
        setVendor('MTN');
        setAmount('50,000');
        setAmountTouched(false);
        setIsSubmitting(true);
        setErrorMessage(null);
        setWarningMessage(null);
        break;
      case 'connection_issue':
        setRequestFrom(isOffline ? 'business_owner' : 'agent');
        setRequestType('cash');
        setVendorType('MNO');
        setVendor('MTN');
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
        setVendor('MTN');
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
  const isLocationAvailable = Boolean(assignment.booth || assignment.location);
  const isVendorValid = requestType !== 'float' || (Boolean(vendorType) && Boolean(vendor));

  const isFormValid =
    Boolean(requestFrom) &&
    Boolean(requestType) &&
    isAmountValid &&
    isLocationAvailable &&
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
      <header className="w-full bg-white border-b border-slate-200/90 px-3.5 py-2.5 flex items-center justify-between shrink-0 shadow-xs z-10">
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

      {/* Main Form Content Area - Natural Mobile Vertical Scrolling */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-3.5 pt-3 pb-6 space-y-3.5">
        {/* Connection Error Banner */}
        {errorMessage && (
          <div
            id="error-banner"
            className="bg-red-50 border border-red-200 rounded-2xl p-3 flex items-start gap-2.5 text-red-800 text-xs shadow-xs animate-in fade-in"
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
                className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-100 text-red-900 font-bold text-[11px] hover:bg-red-200 transition-colors"
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
            className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-start gap-2.5 text-amber-900 text-xs shadow-xs animate-in fade-in"
          >
            <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">{warningMessage}</p>
              <button
                type="button"
                onClick={onCheckStatus}
                className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-200/80 text-amber-950 font-bold text-[11px] hover:bg-amber-300 transition-colors"
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>Check Status</span>
              </button>
            </div>
          </div>
        )}

        {/* Section 1: Request From (Two-way workflow selector) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Request From
            </label>
            {isOffline && (
              <span className="text-[10px] font-medium text-slate-400">
                Agent requests disabled offline
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {/* Another Agent Option */}
            <button
              type="button"
              id="request-from-agent"
              disabled={isSubmitting || isOffline}
              onClick={() => {
                if (!isOffline) setRequestFrom('agent');
              }}
              className={`p-3 rounded-2xl border text-left transition-all relative ${
                isOffline
                  ? 'bg-slate-100/70 border-slate-200/80 text-slate-400 opacity-60 cursor-not-allowed'
                  : requestFrom === 'agent'
                  ? 'bg-blue-50/60 border-[#0052CC] ring-1 ring-[#0052CC]/30 text-[#002244]'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                    isOffline
                      ? 'bg-slate-200 text-slate-400'
                      : requestFrom === 'agent'
                      ? 'bg-[#0052CC] text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
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
              className={`p-3 rounded-2xl border text-left transition-all relative ${
                requestFrom === 'business_owner'
                  ? 'bg-blue-50/60 border-[#0052CC] ring-1 ring-[#0052CC]/30 text-[#002244]'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                    requestFrom === 'business_owner'
                      ? 'bg-[#0052CC] text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
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
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Request Type
          </label>
          <div className="grid grid-cols-2 gap-2 bg-slate-200/60 p-1 rounded-2xl border border-slate-200">
            <button
              type="button"
              id="request-type-cash"
              onClick={() => setRequestType('cash')}
              disabled={isSubmitting}
              className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                requestType === 'cash'
                  ? 'bg-white text-[#002244] shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Banknote className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cash</span>
            </button>

            <button
              type="button"
              id="request-type-float"
              onClick={() => setRequestType('float')}
              disabled={isSubmitting}
              className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                requestType === 'float'
                  ? 'bg-white text-[#002244] shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-[#0052CC]" />
              <span>Float</span>
            </button>
          </div>
        </div>

        {/* Section 2b: Vendor Type & Vendor (Shown when Float is selected) */}
        {requestType === 'float' && (
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Float Vendor Context
              </span>
            </div>

            {/* Vendor Type Selection */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
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
                    className={`p-2 rounded-xl text-left border transition-all ${
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

            {/* Vendor Selection (Filtered by Vendor Type) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                Vendor <span className="text-red-500 font-bold">*</span>
              </label>
              <div className={`grid ${availableVendors.length <= 3 ? 'grid-cols-3' : 'grid-cols-3 sm:grid-cols-5'} gap-2`}>
                {availableVendors.map((v) => {
                  const isSelected = vendor === v.name;
                  const logoSrc = v.logoUrl || getVendorLogo(v.name);
                  return (
                    <button
                      key={v.id}
                      type="button"
                      id={`liquidity-vendor-btn-${v.id}`}
                      onClick={() => setVendor(v.name)}
                      disabled={!vendorType || isSubmitting}
                      className={`p-2.5 rounded-xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all ${
                        isSelected
                          ? 'bg-blue-50/80 border-[#0052CC] ring-1 ring-[#0052CC]/30 text-[#002244]'
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/90 p-1.5 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                        {logoSrc ? (
                          <img
                            src={logoSrc}
                            alt={v.name}
                            className="w-full h-full object-contain pointer-events-none"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: v.accentColor || '#0052CC' }}
                          />
                        )}
                      </div>
                      <span className="text-[11px] font-bold truncate max-w-full">
                        {v.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Section 3: Amount Input */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Amount Required
            </label>
            <span className="text-[10px] font-semibold text-slate-400">
              Zambian Kwacha (ZMW)
            </span>
          </div>

          <div className="relative flex items-center">
            <span className="absolute left-3 text-xs font-extrabold text-slate-500 font-mono">
              ZMW
            </span>
            <input
              type="text"
              id="liquidity-amount-input"
              value={amount}
              onChange={handleAmountChange}
              onBlur={() => setAmountTouched(true)}
              disabled={isSubmitting}
              placeholder="Enter amount"
              className={`w-full pl-14 pr-3 py-2.5 bg-slate-50 border rounded-xl text-base font-bold text-[#002244] font-mono focus:bg-white focus:outline-none transition-all ${
                showAmountError
                  ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                  : 'border-slate-200 focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC]'
              }`}
            />
          </div>

          {showAmountError && (
            <p className="text-[11px] text-red-600 font-medium mt-1.5">
              Please enter a valid amount.
            </p>
          )}
        </div>

        {/* Section 4: Current Work Location / Business Assignment (Read-Only) */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs">
          {requestFrom === 'agent' ? (
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#002244]">
                  <MapPin className="w-3.5 h-3.5 text-[#0052CC]" />
                  <span>Current Work Location</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#0052CC] text-[10px] font-bold border border-blue-200/50">
                  Eligible agents
                </span>
              </div>

              <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 mb-2">
                <p className="text-xs font-bold text-slate-800">
                  {assignment.booth}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {assignment.location}
                </p>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#002244]">
                  <Building2 className="w-3.5 h-3.5 text-[#0052CC]" />
                  <span>Business Assignment</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200/50">
                  Direct Review
                </span>
              </div>

              <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 space-y-1 mb-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[10px] font-medium">Business</span>
                  <span className="font-semibold text-slate-800">{assignment.business}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[10px] font-medium">Store</span>
                  <span className="font-semibold text-slate-800">{assignment.store}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[10px] font-medium">Booth</span>
                  <span className="font-semibold text-slate-800">{assignment.booth}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <PoweredByCinitecFooter className="py-2" />
      </div>

      {/* Primary Action Button (Fixed Bottom Footer) */}
      <div className="p-3.5 bg-white border-t border-slate-200/90 shrink-0 shadow-lg">
        <button
          type="button"
          id="submit-liquidity-request-button"
          onClick={() => handleSubmit()}
          disabled={!isFormValid || isSubmitting}
          className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs active:scale-[0.99] ${
            isFormValid && !isSubmitting
              ? 'bg-[#0052CC] hover:bg-[#003da6] text-white cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
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
      </div>
    </div>
  );
};

