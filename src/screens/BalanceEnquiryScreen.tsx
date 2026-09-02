import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ChevronDown,
  Check,
  Smartphone,
  Building2,
  AlertCircle,
  Loader2,
  X,
} from 'lucide-react';
import { TellerBudLogo } from '../components/TellerBudLogo';
import { VendorLogoBadge } from '../components/VendorLogoBadge';
import { AndroidPhoneDialler } from '../components/AndroidPhoneDialler';
import { VendorUssdOverlay } from '../components/VendorUssdOverlay';
import {
  WorkAssignment,
  BalanceEnquiryPreviewState,
  BalanceEnquiryVendorType,
  AgentBalanceEnquiry,
} from '../types';
import { OPERATING_COUNTRIES } from '../config/countryConfig';
import {
  recordBalanceEnquiry,
  updateBalanceEnquiryStatus,
} from '../utils/balanceEnquiryService';
import { getVendorConfig } from '../config/ussdConfig';

interface BalanceEnquiryScreenProps {
  assignment?: WorkAssignment;
  previewState?: BalanceEnquiryPreviewState;
  onBack: () => void;
  onEnquiryRecorded?: (record: AgentBalanceEnquiry) => void;
}

interface VendorOption {
  id: string;
  name: string;
  type: BalanceEnquiryVendorType;
  accentColor?: string;
  defaultUssdCode?: string;
}

// Approved MNO Vendors (No ZedMobile)
const MNO_VENDORS: VendorOption[] = [
  { id: 'mtn', name: 'MTN', type: 'MNO', accentColor: '#eab308', defaultUssdCode: '*115#' },
  { id: 'airtel', name: 'Airtel', type: 'MNO', accentColor: '#ed1b24', defaultUssdCode: '*778#' },
  { id: 'zamtel', name: 'Zamtel', type: 'MNO', accentColor: '#16a34a', defaultUssdCode: '*344#' },
];

// Approved Commercial Bank Vendors
const BANK_VENDORS: VendorOption[] = [
  { id: 'zanaco', name: 'Zanaco', type: 'Bank', accentColor: '#dc2626', defaultUssdCode: '*444#' },
  { id: 'fnb', name: 'FNB', type: 'Bank', accentColor: '#0d9488', defaultUssdCode: '*130*321#' },
  { id: 'indo', name: 'INDO', type: 'Bank', accentColor: '#2563eb', defaultUssdCode: '*224#' },
  { id: 'stanbic', name: 'Stanbic', type: 'Bank', accentColor: '#0284c7', defaultUssdCode: '*247#' },
  { id: 'access', name: 'Access', type: 'Bank', accentColor: '#ea580c', defaultUssdCode: '*901#' },
];

export const BalanceEnquiryScreen: React.FC<BalanceEnquiryScreenProps> = ({
  assignment,
  previewState = 'default',
  onBack,
  onEnquiryRecorded,
}) => {
  const zambiaConfig = OPERATING_COUNTRIES.ZM;

  // Form states
  const [phoneNumber, setPhoneNumber] = useState('');
  const [vendorType, setVendorType] = useState<BalanceEnquiryVendorType | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<string>('');
  const [showVendorSheet, setShowVendorSheet] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Dialler & USSD execution states
  const [showDialler, setShowDialler] = useState(false);
  const [showUssdSession, setShowUssdSession] = useState(false);
  const [activeEnquiryRecord, setActiveEnquiryRecord] = useState<AgentBalanceEnquiry | null>(null);
  const [dialledVendorName, setDialledVendorName] = useState<string>('MTN');

  // Preview state synchronization
  useEffect(() => {
    if (previewState === 'mno_mtn') {
      setPhoneNumber('971 234 567');
      setVendorType('MNO');
      setSelectedVendor('MTN');
      setPhoneError(null);
      setGeneralError(null);
    } else if (previewState === 'mno_airtel') {
      setPhoneNumber('962 345 678');
      setVendorType('MNO');
      setSelectedVendor('Airtel');
      setPhoneError(null);
      setGeneralError(null);
    } else if (previewState === 'mno_zamtel') {
      setPhoneNumber('955 456 789');
      setVendorType('MNO');
      setSelectedVendor('Zamtel');
      setPhoneError(null);
      setGeneralError(null);
    } else if (previewState === 'bank_fnb') {
      setPhoneNumber('977 123 456');
      setVendorType('Bank');
      setSelectedVendor('FNB');
      setPhoneError(null);
      setGeneralError(null);
    } else if (previewState === 'bank_zanaco') {
      setPhoneNumber('978 987 654');
      setVendorType('Bank');
      setSelectedVendor('Zanaco');
      setPhoneError(null);
      setGeneralError(null);
    } else if (previewState === 'bank_indo') {
      setPhoneNumber('976 554 433');
      setVendorType('Bank');
      setSelectedVendor('INDO');
      setPhoneError(null);
      setGeneralError(null);
    } else if (previewState === 'connection_issue') {
      setGeneralError('Network connection issue. Please check your data connection and retry.');
    } else {
      // Default: clean empty state
      setPhoneNumber('');
      setVendorType(null);
      setSelectedVendor('');
      setPhoneError(null);
      setGeneralError(null);
    }
  }, [previewState]);

  // Available vendor options according to selected Vendor Type
  const availableVendors = vendorType === 'MNO' ? MNO_VENDORS : vendorType === 'Bank' ? BANK_VENDORS : [];
  const selectedVendorOption = availableVendors.find((v) => v.name === selectedVendor);

  // Phone number input handler
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Allow only numbers and spaces
    const numericOnly = raw.replace(/[^\d\s]/g, '');
    setPhoneNumber(numericOnly);

    if (phoneError) {
      setPhoneError(null);
    }
    if (generalError) {
      setGeneralError(null);
    }
  };

  const handlePhoneBlur = () => {
    if (!phoneNumber.trim()) return;
    const isValid = zambiaConfig.validatePhone(phoneNumber);
    if (!isValid) {
      setPhoneError('Enter a valid 9 or 10-digit Zambia phone number');
    } else {
      setPhoneError(null);
    }
  };

  // Switch Vendor Type and automatically reset Vendor selection
  const handleSelectVendorType = (type: BalanceEnquiryVendorType) => {
    if (vendorType !== type) {
      setVendorType(type);
      setSelectedVendor(''); // MUST reset Vendor when type changes
      setShowVendorSheet(false);
      if (generalError) {
        setGeneralError(null);
      }
    }
  };

  // Vendor selection handler
  const handleSelectVendor = (vendorName: string) => {
    setSelectedVendor(vendorName);
    setShowVendorSheet(false);
    if (generalError) {
      setGeneralError(null);
    }
  };

  // Form validity check
  const isPhoneValid = zambiaConfig.validatePhone(phoneNumber);
  const isFormComplete = Boolean(isPhoneValid && vendorType && selectedVendor);

  // Handle Proceed button submission
  const handleProceed = () => {
    if (!isFormComplete || isProcessing) {
      if (!isPhoneValid) {
        setPhoneError('Please enter a valid Zambia phone number (+260)');
      }
      return;
    }

    setIsProcessing(true);
    setGeneralError(null);

    try {
      // 1. Normalize Phone Number
      const normalizedPhone = zambiaConfig.normalizePhone(phoneNumber);

      // 2. Resolve initial USSD code for the selected Vendor
      const vendorConfig = getVendorConfig(selectedVendor);
      const ussdCode = vendorConfig.getInitialUssdCode('Check Balance', '', 'ENQ-BAL');

      // 3. FIRST: Record Admin/Management Audit Event before dialler launches
      const enquiryRecord = recordBalanceEnquiry({
        agentId: assignment?.agentId || 'AG-88421',
        agentName: assignment?.agentName || 'Marcus Vance',
        phoneNumber: normalizedPhone,
        rawPhoneNumber: phoneNumber,
        vendorType: vendorType!,
        vendor: selectedVendor,
        vendorId: selectedVendorOption?.id,
        ussdCode: ussdCode,
        booth: assignment?.booth,
        store: assignment?.store,
        business: assignment?.business,
        status: 'Initiated',
      });

      setActiveEnquiryRecord(enquiryRecord);
      setDialledVendorName(selectedVendor);

      if (onEnquiryRecorded) {
        onEnquiryRecorded(enquiryRecord);
      }

      // 4. THEN: Launch the system/USSD dialler
      setTimeout(() => {
        setIsProcessing(false);
        setShowDialler(true);
      }, 300);
    } catch (err) {
      setIsProcessing(false);
      console.error('Failed to capture balance enquiry audit record:', err);
      setGeneralError('Unable to record Balance Enquiry. Try again.');
    }
  };

  // Dialler call placement
  const handleDiallerCall = (dialledCode: string) => {
    // Update audit status to 'Dialler Opened'
    if (activeEnquiryRecord) {
      updateBalanceEnquiryStatus(activeEnquiryRecord.id, 'Dialler Opened');
    }

    setShowDialler(false);
    setShowUssdSession(true);
  };

  // Close / cancel dialler
  const handleDiallerCancel = () => {
    setShowDialler(false);
  };

  // USSD Session Completion
  const handleUssdSuccess = (_ref: string) => {
    if (activeEnquiryRecord) {
      updateBalanceEnquiryStatus(activeEnquiryRecord.id, 'Completed');
    }
    setShowUssdSession(false);
    onBack();
  };

  const handleUssdCancel = () => {
    setShowUssdSession(false);
  };

  return (
    <div
      id="screen-balance-enquiry"
      className="relative flex flex-col h-full bg-slate-50 font-sans select-none overflow-hidden"
    >
      {/* 1. Header with TellerBud Branding & Back navigation */}
      <header className="bg-[#002244] text-white px-4 pt-3.5 pb-3 flex items-center justify-between shadow-md shrink-0 z-20">
        <div className="flex items-center gap-3">
          <button
            type="button"
            id="balance-enquiry-back-btn"
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 flex items-center justify-center text-white transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-white leading-snug">
              Balance Enquiry
            </h1>
            <p className="text-[11px] text-sky-200/80 font-medium">
              {assignment?.booth || 'Agent Operational Verification'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center p-1">
            <TellerBudLogo className="w-full h-full text-white" />
          </div>
        </div>
      </header>

      {/* 2. Main Form Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Connectivity Error Banner */}
        {generalError && (
          <div
            id="balance-enquiry-error-banner"
            className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-800 text-xs animate-in fade-in"
          >
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span className="flex-1 font-medium leading-relaxed">{generalError}</span>
            <button
              type="button"
              onClick={() => setGeneralError(null)}
              className="text-rose-400 hover:text-rose-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Form Container Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-4">
          {/* FIELD 1: Phone Number */}
          <div className="space-y-1.5">
            <label
              htmlFor="balance-enquiry-phone-input"
              className="text-xs font-bold text-slate-800 flex items-center justify-between"
            >
              <span>
                Phone Number <span className="text-rose-500 font-bold">*</span>
              </span>
              {phoneError && (
                <span className="text-[11px] text-rose-600 font-normal">
                  {phoneError}
                </span>
              )}
            </label>

            <div className="flex items-center gap-1.5">
              {/* Fixed Zambia (+260) Calling Code Prefix Badge */}
              <div
                id="balance-enquiry-country-badge"
                className="h-[44px] px-3.5 rounded-xl border border-slate-200 bg-slate-100/90 flex items-center justify-center shrink-0 text-slate-900 select-none shadow-2xs"
              >
                <span className="text-xs font-bold font-mono text-slate-900">
                  +260
                </span>
              </div>

              {/* Subscriber Phone Input Field */}
              <div className="relative flex-1">
                <input
                  type="tel"
                  id="balance-enquiry-phone-input"
                  inputMode="numeric"
                  autoComplete="tel"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  onBlur={handlePhoneBlur}
                  placeholder={zambiaConfig.phonePlaceholder}
                  disabled={isProcessing}
                  className={`w-full h-[44px] py-2 px-3 rounded-xl border text-xs font-mono font-medium transition-colors ${
                    phoneError
                      ? 'border-rose-300 bg-rose-50/40 text-slate-900 focus:ring-rose-500'
                      : 'border-slate-200 bg-white text-slate-900 focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC]'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* FIELD 2: Vendor Type (MNO / Bank) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 block">
              Vendor Type <span className="text-rose-500 font-bold">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="balance-enquiry-type-mno"
                onClick={() => handleSelectVendorType('MNO')}
                disabled={isProcessing}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  vendorType === 'MNO'
                    ? 'bg-[#0052CC] text-white border-[#0052CC] shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>MNO</span>
              </button>

              <button
                type="button"
                id="balance-enquiry-type-bank"
                onClick={() => handleSelectVendorType('Bank')}
                disabled={isProcessing}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  vendorType === 'Bank'
                    ? 'bg-[#0052CC] text-white border-[#0052CC] shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Bank</span>
              </button>
            </div>
          </div>

          {/* FIELD 3: Vendor Selection Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 block">
              Vendor <span className="text-rose-500 font-bold">*</span>
            </label>
            <button
              type="button"
              id="balance-enquiry-vendor-dropdown-btn"
              disabled={!vendorType || isProcessing}
              onClick={() => setShowVendorSheet(true)}
              className={`w-full py-2.5 px-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                !vendorType
                  ? 'bg-slate-100/70 border-slate-200 text-slate-400 cursor-not-allowed'
                  : selectedVendor
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
                  {vendorType ? `Select ${vendorType} vendor` : 'Select Vendor Type first'}
                </span>
              )}
              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
            </button>
          </div>
        </div>

        {/* Primary Action Button: Proceed */}
        <div className="pt-2">
          <button
            type="button"
            id="balance-enquiry-proceed-btn"
            disabled={!isFormComplete || isProcessing}
            onClick={handleProceed}
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
              isFormComplete && !isProcessing
                ? 'bg-[#0052CC] hover:bg-[#0043A4] active:bg-[#003380] text-white shadow-[#0052CC]/20 active:scale-[0.99] cursor-pointer'
                : 'bg-slate-200 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Processing...</span>
              </>
            ) : (
              <span>Proceed</span>
            )}
          </button>
        </div>
      </div>

      {/* 3. Footer Branding */}
      <footer className="py-2.5 px-4 bg-slate-100/80 border-t border-slate-200/80 text-center shrink-0">
        <p className="text-[10px] text-slate-400 font-medium tracking-wide">
          Powered by Cinitec
        </p>
      </footer>

      {/* 4. Vendor Bottom Sheet Modal */}
      {showVendorSheet && vendorType && (
        <div
          id="balance-enquiry-vendor-sheet"
          className="absolute inset-0 z-40 bg-slate-950/60 backdrop-blur-[2px] flex flex-col justify-end animate-in fade-in duration-150"
        >
          <div
            className="bg-white rounded-t-3xl border-t border-slate-200 p-4 max-h-[80%] flex flex-col space-y-3 shadow-2xl animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-xs font-bold text-slate-900">
                  Select {vendorType} Vendor
                </h3>
                <p className="text-[10px] text-slate-500 font-medium">
                  {vendorType === 'MNO'
                    ? 'Mobile Network Operators in Zambia'
                    : 'Commercial Banking Partners in Zambia'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowVendorSheet(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 overflow-y-auto no-scrollbar max-h-[320px] pt-1 pb-2">
              {availableVendors.map((v) => {
                const isSelected = selectedVendor === v.name;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => handleSelectVendor(v.name)}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/70 border-[#0052CC] ring-1 ring-[#0052CC] shadow-2xs'
                        : 'bg-slate-50/80 border-slate-200/90 hover:bg-slate-100/80'
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
                      <div className="w-5 h-5 rounded-full bg-[#0052CC] text-white flex items-center justify-center shrink-0 shadow-2xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 5. Android System Phone Dialler Overlay (Triggered after audit capture) */}
      {showDialler && (
        <AndroidPhoneDialler
          vendor={dialledVendorName}
          transactionType="Check Balance"
          amount=""
          requestRef={activeEnquiryRecord?.id || 'ENQ-BAL'}
          onCall={handleDiallerCall}
          onCancel={handleDiallerCancel}
        />
      )}

      {/* 6. Vendor USSD Session Simulation Modal */}
      {showUssdSession && (
        <VendorUssdOverlay
          vendor={dialledVendorName}
          transactionType="Check Balance"
          amount=""
          requestRef={activeEnquiryRecord?.id || 'ENQ-BAL'}
          onSuccess={handleUssdSuccess}
          onCancel={handleUssdCancel}
          onFailure={() => {
            if (activeEnquiryRecord) {
              updateBalanceEnquiryStatus(activeEnquiryRecord.id, 'Failed');
            }
            setShowUssdSession(false);
          }}
        />
      )}
    </div>
  );
};
