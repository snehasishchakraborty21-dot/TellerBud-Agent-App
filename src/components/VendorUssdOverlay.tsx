import React, { useState, useEffect } from 'react';
import { Loader2, XCircle } from 'lucide-react';
import { getVendorConfig, UssdStep } from '../config/ussdConfig';
import { getVendorLogo } from '../config/walkInConfig';

interface VendorUssdOverlayProps {
  vendor?: string;
  transactionType?: string;
  amount: string;
  requestRef?: string;
  onSuccess: (vendorRef: string) => void;
  onCancel: () => void;
  onFailure: (errorMessage?: string) => void;
  onUnknownStatus?: () => void;
}

export const VendorUssdOverlay: React.FC<VendorUssdOverlayProps> = ({
  vendor = 'MTN',
  transactionType = 'Withdrawal',
  amount,
  requestRef = 'REQ-9082',
  onSuccess,
  onCancel,
  onFailure,
}) => {
  const vendorConfig = getVendorConfig(vendor);
  const steps = vendorConfig.getSteps(transactionType, amount, requestRef);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [simulatedError, setSimulatedError] = useState<string | null>(null);

  const currentStep: UssdStep = steps[currentStepIndex] || steps[0];

  // Sync input value when step changes
  useEffect(() => {
    if (currentStep.defaultInputValue) {
      setInputValue(currentStep.defaultInputValue);
    } else {
      setInputValue('');
    }
  }, [currentStepIndex, currentStep]);

  const handleSend = () => {
    if (currentStep.isFinalStep) {
      // Extract vendor ref or generate
      const refMatch = currentStep.prompt.match(/Ref:\s*([A-Za-z0-9-]+)/i);
      const vendorRef = refMatch
        ? refMatch[1]
        : `${vendor.substring(0, 3).toUpperCase()}-${Math.floor(10000000 + Math.random() * 90000000)}`;
      onSuccess(vendorRef);
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex((prev) => prev + 1);
      } else {
        const vendorRef = `${vendor.substring(0, 3).toUpperCase()}-${Math.floor(10000000 + Math.random() * 90000000)}`;
        onSuccess(vendorRef);
      }
    }, 450);
  };

  return (
    <div
      id="vendor-ussd-session-modal"
      className="absolute inset-0 z-50 bg-slate-950/70 backdrop-blur-[2px] flex flex-col items-center justify-center p-3 font-sans select-none animate-in fade-in duration-150"
    >
      {/* System Android USSD Dialog Card */}
      <div className="w-full max-w-[320px] bg-white border border-slate-300 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-800 animate-in zoom-in-95 duration-150">
        {/* Android System Title Header */}
        <div className="px-4 py-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getVendorLogo(vendorConfig.vendor) ? (
              <div className="w-5 h-5 rounded-md bg-white border border-slate-200 p-0.5 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                <img
                  src={getVendorLogo(vendorConfig.vendor)}
                  alt={vendorConfig.vendorDisplayName}
                  className="w-full h-full object-contain pointer-events-none"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                style={{ backgroundColor: vendorConfig.accentColor || '#0052CC' }}
              />
            )}
            <span className="text-xs font-bold text-slate-900 tracking-tight">
              {vendorConfig.vendorDisplayName}
            </span>
          </div>
          <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200 shadow-2xs">
            USSD Prompt
          </span>
        </div>

        {/* USSD Prompt Message Body */}
        <div className="p-4 space-y-3">
          {isProcessing ? (
            <div className="py-6 flex flex-col items-center justify-center gap-2 text-slate-600">
              <Loader2 className="w-6 h-6 animate-spin text-slate-700 stroke-[2.2]" />
              <span className="text-xs font-medium">Running USSD Code...</span>
            </div>
          ) : simulatedError ? (
            <div className="bg-red-50 border border-red-200/80 rounded-xl p-3 text-red-900 text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-red-800">
                <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>Transaction Failed</span>
              </div>
              <p className="text-[11.5px] text-red-700 leading-snug">
                {simulatedError}
              </p>
            </div>
          ) : (
            <>
              {/* Text-based USSD Prompt Message */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs leading-relaxed text-slate-900 whitespace-pre-line font-mono font-medium min-h-[64px]">
                {currentStep.prompt}
              </div>

              {/* Text / Numeric Response Input Field */}
              {currentStep.inputRequired && !currentStep.isFinalStep && (
                <div className="space-y-1 pt-0.5">
                  <label className="text-[10.5px] font-semibold text-slate-600 block">
                    {currentStep.inputLabel || 'Reply:'}
                  </label>
                  <input
                    type={currentStep.inputType === 'pin' ? 'password' : 'text'}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={currentStep.placeholder || 'Enter reply'}
                    autoFocus
                    className="w-full bg-white border border-slate-300 focus:border-slate-800 focus:ring-1 focus:ring-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 outline-none transition-all shadow-2xs"
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Android USSD Action Button Bar */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
          {simulatedError ? (
            <button
              type="button"
              onClick={() => onFailure(simulatedError)}
              className="w-full py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white transition-colors shadow-xs"
            >
              Close
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={onCancel}
                disabled={isProcessing}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSend}
                disabled={
                  isProcessing ||
                  (currentStep.inputRequired && !currentStep.isFinalStep && !inputValue.trim())
                }
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white transition-colors shadow-xs flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {currentStep.actionLabel || (currentStep.isFinalStep ? 'Done' : 'Send')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
