import React, { useState, useEffect } from 'react';
import { TellerBudLogo } from '../components/TellerBudLogo';
import {
  ShieldCheck,
  Info,
  Loader2,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  ShoppingBag,
  Truck,
  ChevronRight,
  X,
  Check,
  SlidersHorizontal,
} from 'lucide-react';
import {
  AvailabilityPreviewState,
  WorkAssignment,
  OnlineStatus,
  ServiceChoice,
  BandOption,
  AgentAvailabilitySetup,
} from '../types';
import { PoweredByCinitecFooter } from '../components/PoweredByCinitecFooter';
import { SERVICES_CONFIG, isServiceEnabled } from '../utils/serviceConfig';
import {
  DEFAULT_CASH_BAND_OPTIONS,
  DEFAULT_FLOAT_BAND_OPTIONS,
  DEFAULT_REVIEW_CASH_BAND_ID,
  DEFAULT_REVIEW_FLOAT_BAND_ID,
  getCashBandById,
  getFloatBandById,
} from '../utils/availabilityBandsConfig';

interface AgentAvailabilitySetupScreenProps {
  assignment?: WorkAssignment;
  previewState?: AvailabilityPreviewState;
  cashBands?: BandOption[];
  floatBands?: BandOption[];
  initialAvailability?: AgentAvailabilitySetup | null;
  onSaveSuccess?: (data: AgentAvailabilitySetup) => void;
}

// Configured monetary range options for client-review demonstration
const defaultCashBands: BandOption[] = DEFAULT_CASH_BAND_OPTIONS;
const defaultFloatBands: BandOption[] = DEFAULT_FLOAT_BAND_OPTIONS;

export const AgentAvailabilitySetupScreen: React.FC<AgentAvailabilitySetupScreenProps> = ({
  assignment = {
    business: 'Apex Retail Group',
    store: 'Central Mall Branch #104',
    booth: 'Booth 03 — Main Atrium',
    location: 'Lagos, Nigeria',
    agentName: 'Marcus Vance',
    agentId: 'AG-88421',
  },
  previewState = 'default',
  cashBands = [],
  floatBands = [],
  initialAvailability = null,
  onSaveSuccess,
}) => {
  const effectiveCashBands = cashBands.length > 0 ? cashBands : defaultCashBands;
  const effectiveFloatBands = floatBands.length > 0 ? floatBands : defaultFloatBands;

  const [status, setStatus] = useState<OnlineStatus>(initialAvailability?.status ?? 'offline');
  const [service, setService] = useState<ServiceChoice | null>(
    initialAvailability?.status === 'online' ? 'pickup' : null
  );
  const [cashBandId, setCashBandId] = useState<string>(
    initialAvailability?.status === 'online' ? initialAvailability.cashBandId : ''
  );
  const [floatBandId, setFloatBandId] = useState<string>(
    initialAvailability?.status === 'online' ? initialAvailability.floatBandId : ''
  );

  // Remembered online values to restore if Agent toggles Online again
  const [rememberedService, setRememberedService] = useState<ServiceChoice | null>(
    'pickup'
  );
  const [rememberedCashBandId, setRememberedCashBandId] = useState<string>(
    initialAvailability?.cashBandId ?? ''
  );
  const [rememberedFloatBandId, setRememberedFloatBandId] = useState<string>(
    initialAvailability?.floatBandId ?? ''
  );

  const [activeBottomSheet, setActiveBottomSheet] = useState<'cash' | 'float' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [connectionError, setConnectionError] = useState(false);

  // Sync state with previewState prop for client review testing
  useEffect(() => {
    if (previewState === 'offline') {
      setStatus('offline');
      setConnectionError(false);
      setIsSubmitting(false);
    } else if (previewState === 'online') {
      setStatus('online');
      setService('pickup');
      setCashBandId(initialAvailability?.cashBandId || rememberedCashBandId || DEFAULT_REVIEW_CASH_BAND_ID);
      setFloatBandId(initialAvailability?.floatBandId || rememberedFloatBandId || DEFAULT_REVIEW_FLOAT_BAND_ID);
      setConnectionError(false);
      setIsSubmitting(false);
    } else if (previewState === 'saving') {
      setStatus('online');
      setService('pickup');
      setCashBandId(DEFAULT_REVIEW_CASH_BAND_ID);
      setFloatBandId(DEFAULT_REVIEW_FLOAT_BAND_ID);
      setIsSubmitting(true);
      setConnectionError(false);
    } else if (previewState === 'connection_issue') {
      setConnectionError(true);
      setIsSubmitting(false);
    } else if (previewState === 'default') {
      const initStatus = initialAvailability?.status ?? 'offline';
      setStatus(initStatus);
      if (initStatus === 'online') {
        setService('pickup');
        setCashBandId(initialAvailability?.cashBandId ?? DEFAULT_REVIEW_CASH_BAND_ID);
        setFloatBandId(initialAvailability?.floatBandId ?? DEFAULT_REVIEW_FLOAT_BAND_ID);
      } else {
        setService(null);
        setCashBandId('');
        setFloatBandId('');
      }
      setIsSubmitting(false);
      setConnectionError(false);
    }
  }, [previewState, initialAvailability]);

  const handleSelectOnline = () => {
    setStatus('online');
    setService('pickup');
    if (!cashBandId && rememberedCashBandId) {
      setCashBandId(rememberedCashBandId);
    }
    if (!floatBandId && rememberedFloatBandId) {
      setFloatBandId(rememberedFloatBandId);
    }
  };

  const handleSelectOffline = () => {
    setStatus('offline');
    if (service) setRememberedService(service);
    if (cashBandId) setRememberedCashBandId(cashBandId);
    if (floatBandId) setRememberedFloatBandId(floatBandId);
  };

  const handleSetService = (val: ServiceChoice) => {
    if (status === 'offline') return;
    if (!isServiceEnabled(val)) return;
    setService(val);
    setRememberedService(val);
  };

  const selectedCashBand = effectiveCashBands.find((b) => b.id === cashBandId) || (cashBandId ? getCashBandById(cashBandId) ? { id: cashBandId, label: getCashBandById(cashBandId)!.displayLabel } : undefined : undefined);
  const selectedFloatBand = effectiveFloatBands.find((b) => b.id === floatBandId) || (floatBandId ? getFloatBandById(floatBandId) ? { id: floatBandId, label: getFloatBandById(floatBandId)!.displayLabel } : undefined : undefined);

  // Form valid rule:
  // - When Offline: valid immediately (no service or bands required)
  // - When Online: requires Pickup service and both bands
  const isFormValid =
    status === 'offline'
      ? true
      : Boolean(status === 'online' && service === 'pickup' && cashBandId && floatBandId);

  const handleSave = () => {
    if (!isFormValid || isSubmitting || isSaved) return;

    setIsSubmitting(true);
    setConnectionError(false);

    setTimeout(() => {
      setIsSubmitting(false);

      if (previewState === 'connection_issue') {
        setConnectionError(true);
        return;
      }

      setIsSaved(true);

      if (onSaveSuccess) {
        if (status === 'offline') {
          onSaveSuccess({
            status: 'offline',
            service: 'pickup',
            cashBandId: cashBandId || rememberedCashBandId || '',
            floatBandId: floatBandId || rememberedFloatBandId || '',
          });
        } else {
          onSaveSuccess({
            status: 'online',
            service: 'pickup',
            cashBandId,
            floatBandId,
          });
        }
      }
    }, 600);
  };

  const currentAvailableBands =
    activeBottomSheet === 'cash' ? effectiveCashBands : effectiveFloatBands;

  return (
    <div className="w-full h-full min-h-full bg-slate-50 flex flex-col justify-between p-3.5 text-slate-900 select-none overflow-y-auto font-sans relative">
      {/* Compact Authenticated Header */}
      <header className="w-full flex items-center justify-between pb-2.5 border-b border-slate-200/80 shrink-0">
        <div className="flex items-center gap-1.5">
          <TellerBudLogo size="sm" />
          <span className="text-[13px] font-bold text-slate-900 tracking-tight">TellerBud</span>
        </div>

        <h1 className="text-[13px] font-bold text-slate-800 tracking-tight">Availability</h1>

        <div className="w-8 h-8" />
      </header>

      {/* Main Content Body */}
      <main className="flex-1 py-2 max-w-sm mx-auto w-full flex flex-col gap-2.5">
        {/* Preview State: Configuration Unavailable */}
        {previewState === 'config_unavailable' ? (
          <div className="w-full bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col items-center text-center my-auto">
            <div className="w-11 h-11 rounded-full bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 mb-2.5">
              <AlertCircle className="w-5 h-5 stroke-[2]" />
            </div>
            <h2 className="text-sm font-bold text-slate-900 mb-1">
              Availability options unavailable
            </h2>
            <p className="text-[12px] text-slate-600 leading-relaxed mb-4">
              We couldn't load the cash and float availability options. Please try again.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-full h-11 rounded-xl bg-[#0052CC] hover:bg-[#0043A8] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        ) : (
          <>
            {/* Heading */}
            <div className="text-left">
              <h2 className="text-[16px] font-bold text-slate-900 tracking-tight leading-tight">
                Set your availability
              </h2>
            </div>

            {/* Connection Error Banner (if retry state) */}
            {(connectionError || previewState === 'connection_issue') && (
              <div className="w-full p-2.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 text-red-800 text-[11.5px] font-medium leading-snug">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span>Unable to update your availability. Check your connection and try again.</span>
                </div>
              </div>
            )}

            {/* Compact Confirmed Session Context */}
            <div className="w-full bg-slate-100/90 rounded-xl border border-slate-200/80 px-2.5 py-2 flex items-center justify-between text-left">
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <div className="p-1 rounded-lg bg-sky-100 text-[#0052CC] shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 stroke-[2]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11.5px] font-bold text-slate-900 truncate leading-tight">
                    {assignment.booth}
                  </p>
                  <p className="text-[10.5px] font-medium text-slate-500 truncate leading-tight">
                    {assignment.store}
                  </p>
                </div>
              </div>

              {/* Read-Only Booth Session Status (Subtle Blue, Not Confused with Online) */}
              <div className="shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-100/90 text-sky-800 text-[10px] font-bold border border-sky-200/80">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0052CC]" />
                <span>Booth Session</span>
              </div>
            </div>

            {/* Section 1: Availability Status (Online / Offline Segmented Control) */}
            <div className="flex flex-col gap-1 text-left">
              <label className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                Availability Status
              </label>

              <div className="w-full bg-slate-200/80 p-1 rounded-xl grid grid-cols-2 gap-1">
                <button
                  type="button"
                  id="availability-status-online"
                  onClick={handleSelectOnline}
                  className={`py-1.5 rounded-lg text-[12.5px] font-bold transition-all text-center ${
                    status === 'online'
                      ? 'bg-[#0052CC] text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 font-medium'
                  }`}
                >
                  Online
                </button>
                <button
                  type="button"
                  id="availability-status-offline"
                  onClick={handleSelectOffline}
                  className={`py-1.5 rounded-lg text-[12.5px] font-bold transition-all text-center ${
                    status === 'offline'
                      ? 'bg-slate-700 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 font-medium'
                  }`}
                >
                  Offline
                </button>
              </div>
            </div>

            {/* Section 2: Services (Pickup, Delivery - Coming Soon) */}
            <div className="flex flex-col gap-1 text-left">
              <div className="flex items-center justify-between">
                <label
                  className={`text-[10.5px] font-bold uppercase tracking-wider ${
                    status === 'offline' ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  Services
                </label>
                {status === 'offline' && (
                  <span className="text-[10px] font-medium text-slate-400">
                    Disabled while Offline
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* Pickup (Selectable) */}
                <button
                  type="button"
                  id="service-pickup"
                  disabled={status === 'offline'}
                  onClick={() => handleSetService('pickup')}
                  className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                    status === 'offline'
                      ? 'bg-slate-100/70 border-slate-200/80 text-slate-400 opacity-60 cursor-not-allowed'
                      : service === 'pickup'
                      ? 'bg-blue-50/90 border-[#0052CC] text-[#0052CC] font-bold ring-1 ring-[#0052CC]/30 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 font-medium'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 stroke-[2]" />
                  <span className="text-[12px] font-bold">Pickup</span>
                </button>

                {/* Delivery (Visible but Disabled / Coming Soon) */}
                <button
                  type="button"
                  id="service-delivery"
                  disabled={true}
                  tabIndex={-1}
                  aria-disabled="true"
                  title="Delivery is coming soon."
                  className="py-2.5 px-2 rounded-xl border border-slate-200/70 bg-slate-100/60 text-slate-400 cursor-not-allowed flex items-center justify-center gap-1.5 select-none"
                >
                  <Truck className="w-4 h-4 stroke-[1.75] text-slate-400" />
                  <span className="text-[12px] font-medium text-slate-400">Delivery</span>
                  <span className="text-[9.5px] font-semibold text-slate-400 bg-slate-200/70 px-1 py-0.5 rounded-sm">
                    Soon
                  </span>
                </button>
              </div>
            </div>

            {/* Section 3: Availability Bands */}
            <div
              className={`rounded-xl border p-2.5 flex flex-col gap-2 text-left transition-all ${
                status === 'offline'
                  ? 'bg-slate-100/50 border-slate-200/70 opacity-70'
                  : 'bg-white border-slate-200/90 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                <div className="flex items-center gap-1.5">
                  <SlidersHorizontal
                    className={`w-3.5 h-3.5 ${
                      status === 'offline' ? 'text-slate-400' : 'text-[#0052CC]'
                    }`}
                  />
                  <span
                    className={`text-[11.5px] font-bold ${
                      status === 'offline' ? 'text-slate-500' : 'text-slate-800'
                    }`}
                  >
                    Availability Bands
                  </span>
                </div>
                {status === 'offline' && (
                  <span className="text-[10px] font-medium text-slate-400">
                    Disabled while Offline
                  </span>
                )}
              </div>

              {/* Cash Availability Band Field */}
              <div className="flex flex-col gap-0.5">
                <label
                  className={`text-[10.5px] font-semibold ${
                    status === 'offline' ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  Cash availability band
                </label>
                <button
                  type="button"
                  id="select-cash-band"
                  disabled={status === 'offline'}
                  onClick={() => {
                    if (status === 'online') setActiveBottomSheet('cash');
                  }}
                  className={`w-full h-9 px-2.5 rounded-lg border flex items-center justify-between transition-colors ${
                    status === 'offline'
                      ? 'bg-slate-100/60 border-slate-200/60 text-slate-400 cursor-not-allowed'
                      : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/80 text-slate-800'
                  }`}
                >
                  <span
                    className={`text-[12px] truncate ${
                      status === 'offline'
                        ? 'text-slate-400 font-normal'
                        : selectedCashBand
                        ? 'font-semibold text-slate-900'
                        : 'text-slate-400'
                    }`}
                  >
                    {status === 'offline'
                      ? 'Select cash range'
                      : selectedCashBand
                      ? selectedCashBand.label
                      : 'Select cash range'}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>
                {status === 'online' && !cashBandId && (
                  <span className="text-[10px] text-amber-600 font-medium pl-0.5">
                    Select your Cash availability range.
                  </span>
                )}
              </div>

              {/* Float Availability Band Field */}
              <div className="flex flex-col gap-0.5">
                <label
                  className={`text-[10.5px] font-semibold ${
                    status === 'offline' ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  Float availability band
                </label>
                <button
                  type="button"
                  id="select-float-band"
                  disabled={status === 'offline'}
                  onClick={() => {
                    if (status === 'online') setActiveBottomSheet('float');
                  }}
                  className={`w-full h-9 px-2.5 rounded-lg border flex items-center justify-between transition-colors ${
                    status === 'offline'
                      ? 'bg-slate-100/60 border-slate-200/60 text-slate-400 cursor-not-allowed'
                      : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/80 text-slate-800'
                  }`}
                >
                  <span
                    className={`text-[12px] truncate ${
                      status === 'offline'
                        ? 'text-slate-400 font-normal'
                        : selectedFloatBand
                        ? 'font-semibold text-slate-900'
                        : 'text-slate-400'
                    }`}
                  >
                    {status === 'offline'
                      ? 'Select float range'
                      : selectedFloatBand
                      ? selectedFloatBand.label
                      : 'Select float range'}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>
                {status === 'online' && !floatBandId && (
                  <span className="text-[10px] text-amber-600 font-medium pl-0.5">
                    Select your Float availability range.
                  </span>
                )}
              </div>
            </div>

            {/* Primary Action CTA */}
            <button
              type="button"
              id="save-availability-btn"
              onClick={handleSave}
              disabled={!isFormValid || isSubmitting || isSaved}
              className={`
                w-full h-12 rounded-xl font-bold text-[13.5px] flex items-center justify-center gap-2
                transition-all duration-150 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#0052CC]/50 mt-1
                ${
                  isSaved
                    ? 'bg-emerald-600 text-white cursor-default'
                    : !isFormValid
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : isSubmitting
                    ? 'bg-[#0052CC]/80 text-white cursor-wait'
                    : 'bg-[#0052CC] hover:bg-[#0043A8] active:scale-[0.99] text-white'
                }
              `}
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Availability Saved</span>
                </>
              ) : isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Availability...</span>
                </>
              ) : (
                <span>Save Availability</span>
              )}
            </button>

            <PoweredByCinitecFooter className="py-2" />
          </>
        )}
      </main>

      {/* Bottom Sheet Modal for Cash / Float Band Selection */}
      {activeBottomSheet && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex flex-col justify-end">
          <div className="w-full bg-white rounded-t-2xl p-4 flex flex-col gap-3 shadow-xl animate-in slide-in-from-bottom duration-200 max-h-[80%] overflow-y-auto text-left">
            {/* Sheet Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900">
                {activeBottomSheet === 'cash' ? 'Select Cash Availability Range' : 'Select Float Availability Range'}
              </h3>
              <button
                type="button"
                onClick={() => setActiveBottomSheet(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Band Options List or Empty Config State */}
            {currentAvailableBands.length === 0 ? (
              <div className="flex flex-col items-center text-center py-4 px-2">
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 mb-2">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <h4 className="text-[13px] font-bold text-slate-800 mb-1">
                  Availability ranges unavailable
                </h4>
                <p className="text-[11.5px] text-slate-500 leading-relaxed mb-4">
                  The cash/float availability ranges have not been configured yet.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveBottomSheet(null)}
                  className="w-full h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 my-1">
                {currentAvailableBands.map((band) => {
                  const isSelected =
                    activeBottomSheet === 'cash' ? cashBandId === band.id : floatBandId === band.id;

                  return (
                    <button
                      key={band.id}
                      type="button"
                      onClick={() => {
                        if (activeBottomSheet === 'cash') {
                          setCashBandId(band.id);
                          setRememberedCashBandId(band.id);
                        } else {
                          setFloatBandId(band.id);
                          setRememberedFloatBandId(band.id);
                        }
                        setActiveBottomSheet(null);
                      }}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-blue-50/90 border-[#0052CC] text-[#0052CC] ring-1 ring-[#0052CC]/30 font-semibold'
                          : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <p className="text-[12px] font-bold">{band.label}</p>
                        {band.description && (
                          <p className="text-[10.5px] text-slate-500 font-normal mt-0.5">
                            {band.description}
                          </p>
                        )}
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#0052CC] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
