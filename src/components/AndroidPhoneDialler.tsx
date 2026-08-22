import React, { useState, useEffect } from 'react';
import { Phone, Delete, X, ArrowLeft } from 'lucide-react';
import { getVendorConfig } from '../config/ussdConfig';

interface AndroidPhoneDiallerProps {
  vendor?: string;
  transactionType?: string;
  amount?: string;
  requestRef?: string;
  initialCode?: string;
  onCall: (dialledCode: string) => void;
  onCancel: () => void;
}

interface KeypadKey {
  digit: string;
  letters?: string;
}

const KEYPAD_KEYS: KeypadKey[][] = [
  [
    { digit: '1', letters: '' },
    { digit: '2', letters: 'ABC' },
    { digit: '3', letters: 'DEF' },
  ],
  [
    { digit: '4', letters: 'GHI' },
    { digit: '5', letters: 'JKL' },
    { digit: '6', letters: 'MNO' },
  ],
  [
    { digit: '7', letters: 'PQRS' },
    { digit: '8', letters: 'TUV' },
    { digit: '9', letters: 'WXYZ' },
  ],
  [
    { digit: '*', letters: '' },
    { digit: '0', letters: '+' },
    { digit: '#', letters: '' },
  ],
];

export const AndroidPhoneDialler: React.FC<AndroidPhoneDiallerProps> = ({
  vendor,
  transactionType = 'Withdrawal',
  amount = 'ZMW 15,000.00',
  requestRef = 'REQ-9082',
  initialCode,
  onCall,
  onCancel,
}) => {
  const isGeneric = !vendor || vendor === 'System' || vendor === 'Cellular';
  const vendorConfig = getVendorConfig(vendor || 'MTN');
  const defaultCode = isGeneric
    ? ''
    : vendorConfig.getInitialUssdCode(transactionType, amount, requestRef);

  const resolvedInitialCode = initialCode !== undefined ? initialCode : defaultCode;

  const [dialledNumber, setDialledNumber] = useState<string>(resolvedInitialCode);

  useEffect(() => {
    setDialledNumber(resolvedInitialCode);
  }, [resolvedInitialCode]);

  const handleKeyPress = (digit: string) => {
    setDialledNumber((prev) => prev + digit);
  };

  const handleDelete = () => {
    setDialledNumber((prev) => prev.slice(0, -1));
  };

  const handleCall = () => {
    onCall(dialledNumber);
  };

  return (
    <div
      id="android-system-phone-dialler"
      className="absolute inset-0 z-40 bg-slate-100 flex flex-col justify-between select-none font-sans text-slate-900 animate-in fade-in duration-150"
    >
      {/* 1. Android Phone System Header */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between border-b border-slate-200/80 bg-white shrink-0">
        <button
          type="button"
          onClick={onCancel}
          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 active:bg-slate-300 flex items-center justify-center text-slate-700 transition-colors"
          aria-label="Exit Phone Dialler"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
        </button>

        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: isGeneric ? '#10b981' : (vendorConfig.accentColor || '#eab308') }}
          />
          <span className="text-xs font-bold text-slate-800 tracking-tight">
            {isGeneric ? 'Phone — System Dialler' : `Phone — ${vendorConfig.vendorDisplayName}`}
          </span>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 active:bg-slate-300 flex items-center justify-center text-slate-500 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4 stroke-[2.2]" />
        </button>
      </div>

      {/* 2. Dialled USSD Code Display Area */}
      <div className="flex-1 flex flex-col justify-end px-5 pb-3">
        <div className="text-center space-y-1">
          {/* SIM Card Indicator */}
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-600 text-[10px] font-semibold mb-1">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: isGeneric ? '#10b981' : (vendorConfig.accentColor || '#eab308') }}
            />
            <span>{isGeneric ? 'SIM 1 (Cellular)' : `SIM 1 (${vendor})`}</span>
          </div>

          {/* Number / Code Input Box */}
          <div className="min-h-[48px] flex items-center justify-center px-3 relative">
            <span className="text-2xl font-bold font-mono tracking-wider text-slate-900 break-all select-all">
              {dialledNumber || <span className="text-slate-400 font-sans text-base font-normal">Enter USSD code</span>}
            </span>

            {dialledNumber.length > 0 && (
              <button
                type="button"
                onClick={handleDelete}
                className="absolute right-0 p-2 text-slate-500 hover:text-slate-800 active:scale-95 transition-transform"
                aria-label="Delete character"
              >
                <Delete className="w-5 h-5 stroke-[2]" />
              </button>
            )}
          </div>

          <p className="text-[10px] text-slate-400 font-medium">
            {isGeneric
              ? 'Enter network USSD code (e.g. *115#, *778#) and press Call'
              : `USSD Service Code for ${transactionType}`}
          </p>
        </div>
      </div>

      {/* 3. Android Numeric Keypad (0-9, *, #) */}
      <div className="bg-white rounded-t-3xl pt-4 pb-6 px-6 shadow-md border-t border-slate-200/90 shrink-0 space-y-3">
        <div className="grid grid-cols-3 gap-y-2.5 gap-x-6 max-w-[260px] mx-auto">
          {KEYPAD_KEYS.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {row.map((k) => (
                <button
                  key={k.digit}
                  type="button"
                  onClick={() => handleKeyPress(k.digit)}
                  className="w-16 h-14 rounded-2xl bg-slate-50 hover:bg-slate-100 active:bg-slate-200 active:scale-95 border border-slate-200/70 flex flex-col items-center justify-center transition-all shadow-2xs mx-auto"
                >
                  <span className="text-xl font-bold text-slate-900 font-sans leading-none">
                    {k.digit}
                  </span>
                  {k.letters ? (
                    <span className="text-[8.5px] font-bold text-slate-400 tracking-wider leading-none mt-0.5">
                      {k.letters}
                    </span>
                  ) : (
                    <span className="h-[9px]" />
                  )}
                </button>
              ))}
            </React.Fragment>
          ))}
        </div>

        {/* 4. Green System Call Button */}
        <div className="pt-2 flex items-center justify-center">
          <button
            type="button"
            onClick={handleCall}
            className="w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 hover:scale-105 active:scale-95 transition-all"
            aria-label="Call USSD Code"
          >
            <Phone className="w-7 h-7 stroke-[2.2] fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
};
