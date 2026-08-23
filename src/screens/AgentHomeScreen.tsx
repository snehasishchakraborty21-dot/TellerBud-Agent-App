import React, { useState, useEffect, useRef } from 'react';
import { TellerBudLogo } from '../components/TellerBudLogo';
import {
  Bell,
  User,
  ChevronRight,
  QrCode,
  Coins,
  Clock,
  MapPin,
  CheckCircle2,
  Home,
  Inbox,
  ArrowLeftRight,
  MoreHorizontal,
  CircleDot,
  AlertCircle,
  LogOut,
  AlertTriangle,
  X,
  Truck,
  ShoppingBag,
  Loader2,
  Navigation,
  Info,
  XCircle,
  ShieldAlert,
  PhoneCall,
  Smartphone,
  TrendingUp,
} from 'lucide-react';
import {
  WorkAssignment,
  AgentAvailabilitySetup,
  BandOption,
  HomePreviewState,
  IncomingCustomerRequest,
  ActiveServiceItem,
  AgentWalletData,
} from '../types';
import { AndroidPhoneDialler } from '../components/AndroidPhoneDialler';
import { VendorUssdOverlay } from '../components/VendorUssdOverlay';
import {
  DEFAULT_CASH_BAND_OPTIONS,
  DEFAULT_FLOAT_BAND_OPTIONS,
  DEFAULT_REVIEW_CASH_BAND_ID,
  DEFAULT_REVIEW_FLOAT_BAND_ID,
  getCashBandLabel,
  getFloatBandLabel,
  getCashBandById,
  getFloatBandById,
} from '../utils/availabilityBandsConfig';

export interface AgentHomeScreenProps {
  assignment?: WorkAssignment;
  availability?: AgentAvailabilitySetup | null;
  cashBands?: BandOption[];
  floatBands?: BandOption[];
  previewState?: HomePreviewState;
  walletData?: AgentWalletData;
  hasActiveService?: boolean;
  activeIncomingRequest?: IncomingCustomerRequest | null;
  onUpdateAvailability?: () => void;
  onSelectTab?: (tab: 'home' | 'requests' | 'transactions' | 'more') => void;
  onViewRequestDetail?: (requestId: string) => void;
  onViewServiceDetail?: (serviceId: string) => void;
  onStartWalkIn?: () => void;
  onRequestLiquidity?: () => void;
  onCheckMnoBalance?: () => void;
  onViewWalletActivity?: () => void;
  onEndWorkdayContinue?: () => void;
  onViewActiveService?: () => void;
  onAcceptCustomerRequest?: (request: IncomingCustomerRequest) => void;
  onRejectCustomerRequest?: (requestId: string) => void;
}

const defaultCashBands: BandOption[] = DEFAULT_CASH_BAND_OPTIONS;
const defaultFloatBands: BandOption[] = DEFAULT_FLOAT_BAND_OPTIONS;

const defaultDeliveryRequest: IncomingCustomerRequest = {
  id: 'REQ-9082',
  requestReference: 'REQ-9082',
  requestOrigin: 'Customer',
  serviceType: 'delivery',
  transactionType: 'Withdrawal',
  vendor: 'MTN',
  amount: 'ZMW 15,000.00',
  currencySymbol: 'ZMW',
  currencyCode: 'ZMW',
  location: 'Plot 42, Commercial Avenue, Lusaka',
  customerLocation: 'Plot 42, Commercial Avenue, Lusaka',
  agentLocation: 'Booth 03 — Main Atrium',
  distance: '4.8 km',
  estimatedTravelTime: '12 min',
  timing: 'Standard Delivery (ASAP)',
  expiresAtSeconds: 90,
  deliveryFee: 'ZMW 50.00',
  agentEarnings: 'ZMW 50.00',
};

const defaultPickupRequest: IncomingCustomerRequest = {
  id: 'REQ-9088',
  requestReference: 'REQ-9088',
  requestOrigin: 'Customer',
  serviceType: 'pickup',
  transactionType: 'Withdrawal',
  vendor: 'MTN',
  amount: 'ZMW 15,000.00',
  currencySymbol: 'ZMW',
  currencyCode: 'ZMW',
  location: 'Booth 03 — Main Atrium',
  agentLocation: 'Booth 03 — Main Atrium',
  customerEstimatedArrival: '12 min',
  timing: 'Scheduled (Within 15 mins)',
  expiresAtSeconds: 120,
  reservationFee: 'ZMW 30.00',
  agentEarnings: 'ZMW 30.00',
};

type InternalRequestStatus =
  | 'AVAILABLE'
  | 'RESPONDING'
  | 'ASSIGNED_TO_AGENT'
  | 'ASSIGNED_ELSEWHERE'
  | 'TIMED_OUT'
  | 'REJECTED_BY_AGENT'
  | 'CONNECTION_ISSUE';

export const AgentHomeScreen: React.FC<AgentHomeScreenProps> = ({
  assignment = {
    business: 'Apex Retail Group',
    store: 'MegaMart Ikeja Mall',
    booth: 'Booth 03 — Main Atrium',
    location: 'Ground Floor, Sector B',
    agentName: 'Marcus Vance',
    agentId: 'AGT-84920',
  },
  availability,
  cashBands = [],
  floatBands = [],
  previewState = 'default',
  walletData,
  hasActiveService,
  activeIncomingRequest: externalRequest,
  onUpdateAvailability,
  onSelectTab,
  onViewRequestDetail,
  onViewServiceDetail,
  onStartWalkIn,
  onRequestLiquidity,
  onCheckMnoBalance,
  onViewWalletActivity,
  onEndWorkdayContinue,
  onViewActiveService,
  onAcceptCustomerRequest,
  onRejectCustomerRequest,
}) => {
  // End Workday Modal & Dialog state
  const [showConfirmSheet, setShowConfirmSheet] = useState(false);
  const [showBlockingDialog, setShowBlockingDialog] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDialler, setShowDialler] = useState(false);
  const [showUssdSession, setShowUssdSession] = useState(false);
  const [dialledVendor, setDialledVendor] = useState<string>('');
  const incomingSectionRef = useRef<HTMLDivElement>(null);

  const effectiveCashBands = cashBands.length > 0 ? cashBands : defaultCashBands;
  const effectiveFloatBands = floatBands.length > 0 ? floatBands : defaultFloatBands;

  // Construct coherent availability fixture for review states or use saved availability
  const isExplicitOfflinePreview = previewState === 'offline';
  const isRequestReviewState =
    previewState === 'delivery_request' ||
    previewState === 'pickup_request' ||
    previewState === 'incoming_request' ||
    previewState === 'responding' ||
    previewState === 'assigned_elsewhere' ||
    previewState === 'timed_out';
  const isActiveServiceReviewState =
    previewState === 'active_service' || previewState === 'active_service_blocking';

  // Production check: if there is no review state override, check availability prop.
  // In review mode for requests or active services, guarantee Online status.
  const isOfflineState = isExplicitOfflinePreview
    ? true
    : isRequestReviewState || isActiveServiceReviewState
    ? false
    : availability
    ? availability.status === 'offline'
    : false;

  const effectiveAvailability: AgentAvailabilitySetup = {
    status: isOfflineState ? 'offline' : 'online',
    service: 'pickup',
    cashBandId: isOfflineState
      ? ''
      : availability?.cashBandId || DEFAULT_REVIEW_CASH_BAND_ID,
    floatBandId: isOfflineState
      ? ''
      : availability?.floatBandId || DEFAULT_REVIEW_FLOAT_BAND_ID,
  };

  const currentStatus = isOfflineState ? 'offline' : 'online';

  // Formatted compact values for the 2-row Operational Status card
  const compactServiceLabel = isOfflineState
    ? 'Offline'
    : (effectiveAvailability.service === 'pickup' ? 'Pickup' : 'Pickup');

  const selectedCashBand = effectiveCashBands.find(
    (b) => b.id === effectiveAvailability.cashBandId
  ) || (isOfflineState ? undefined : getCashBandById(effectiveAvailability.cashBandId) ? { id: effectiveAvailability.cashBandId, label: getCashBandById(effectiveAvailability.cashBandId)!.displayLabel } : effectiveCashBands[1]);

  const selectedFloatBand = effectiveFloatBands.find(
    (b) => b.id === effectiveAvailability.floatBandId
  ) || (isOfflineState ? undefined : getFloatBandById(effectiveAvailability.floatBandId) ? { id: effectiveAvailability.floatBandId, label: getFloatBandById(effectiveAvailability.floatBandId)!.displayLabel } : effectiveFloatBands[2]);

  const compactCashBandDisplay = isOfflineState
    ? 'Inactive'
    : getCashBandLabel(
        effectiveAvailability.cashBandId,
        selectedCashBand?.label,
        'ZMW 2,001 – 5,000'
      );

  const compactFloatBandDisplay = isOfflineState
    ? 'Inactive'
    : getFloatBandLabel(
        effectiveAvailability.floatBandId,
        selectedFloatBand?.label,
        'ZMW 5,001 – 10,000'
      );

  const agentFirstName = assignment.agentName
    ? assignment.agentName.split(' ')[0]
    : 'Agent';

  // Determine if a customer request should trigger the incoming pop-up modal on Home
  const isPickupPreview =
    previewState === 'pickup_request' ||
    previewState === 'incoming_popup_pickup' ||
    previewState === 'incoming_request';
  const isDeliveryPreview = false; // Phase 1 is strictly Pickup only
  const isIncomingPopupState = isPickupPreview || isDeliveryPreview;

  const hasRequestToShow =
    !isOfflineState &&
    (isIncomingPopupState ||
      (Boolean(externalRequest) &&
        previewState !== 'active_service' &&
        previewState !== 'active_service_blocking'));

  // Determine effective request data (Phase 1 is strictly Pickup Request)
  const baseRequest: IncomingCustomerRequest = externalRequest
    ? {
        ...externalRequest,
        serviceType: 'pickup' as const,
        reservationFee: externalRequest.reservationFee || externalRequest.agentEarnings || 'ZMW 30.00',
        agentEarnings: externalRequest.agentEarnings || externalRequest.reservationFee || 'ZMW 30.00',
      }
    : defaultPickupRequest;

  const effectiveRequest: IncomingCustomerRequest = {
    ...baseRequest,
    vendor: baseRequest.vendor === 'Apex Supermarket #104' ? 'MTN' : baseRequest.vendor || 'MTN',
    agentLocation: baseRequest.agentLocation || assignment.booth || 'Booth 03 — Main Atrium',
  };

  // Internal status management for the request
  const [requestStatus, setRequestStatus] = useState<InternalRequestStatus>(() => {
    if (previewState === 'responding') return 'RESPONDING';
    if (previewState === 'assigned_elsewhere') return 'ASSIGNED_ELSEWHERE';
    if (previewState === 'timed_out') return 'TIMED_OUT';
    if (previewState === 'connection_issue') return 'CONNECTION_ISSUE';
    return 'AVAILABLE';
  });
  const [isDismissed, setIsDismissed] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(() => {
    if (previewState === 'timed_out') return 0;
    return effectiveRequest.expiresAtSeconds ?? 90;
  });

  // Sync request status with preview state changes
  useEffect(() => {
    setIsDismissed(false);
    if (!previewState) return;
    switch (previewState) {
      case 'delivery_request':
      case 'pickup_request':
      case 'incoming_request':
      case 'incoming_popup_delivery':
      case 'incoming_popup_pickup':
        setRequestStatus('AVAILABLE');
        setSecondsLeft(effectiveRequest.expiresAtSeconds ?? 90);
        break;
      case 'responding':
        setRequestStatus('RESPONDING');
        break;
      case 'assigned_elsewhere':
        setRequestStatus('ASSIGNED_ELSEWHERE');
        break;
      case 'timed_out':
        setRequestStatus('TIMED_OUT');
        setSecondsLeft(0);
        break;
      case 'connection_issue':
        if (hasRequestToShow) {
          setRequestStatus('CONNECTION_ISSUE');
        }
        break;
      default:
        setRequestStatus('AVAILABLE');
        setSecondsLeft(effectiveRequest.expiresAtSeconds ?? 90);
    }
  }, [previewState, effectiveRequest.id, hasRequestToShow]);

  // Countdown timer effect
  useEffect(() => {
    if (isOfflineState || requestStatus !== 'AVAILABLE' || secondsLeft === null) return;
    if (secondsLeft <= 0) {
      setRequestStatus('TIMED_OUT');
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          setRequestStatus('TIMED_OUT');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOfflineState, requestStatus, secondsLeft]);

  // Auto-dismiss reject modal if request status is no longer AVAILABLE
  useEffect(() => {
    if (requestStatus !== 'AVAILABLE' && showRejectModal) {
      setShowRejectModal(false);
    }
  }, [requestStatus, showRejectModal]);

  // Format countdown mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder
      .toString()
      .padStart(2, '0')}`;
  };

  // Sample active service for preview mode
  const sampleActiveService: ActiveServiceItem = {
    id: 'SRV-40182',
    serviceType: 'pickup',
    status: 'Service in progress',
    amount: 'ZMW 12,500.00',
    location: 'Booth 03 → Store #104',
  };

  const showActiveServiceCard = previewState === 'active_service';
  const isConnectionIssue = previewState === 'connection_issue';

  // Active work blocking safety check for End Workday
  const isBlockingPreview = previewState === 'active_service_blocking';
  const isWorkBlocking = isBlockingPreview || Boolean(hasActiveService) || showActiveServiceCard;

  const handleEndWorkdayClick = () => {
    if (isWorkBlocking) {
      setShowBlockingDialog(true);
    } else {
      setShowConfirmSheet(true);
    }
  };

  // Handle Accept Request action: automatic assignment
  const handleAcceptRequest = () => {
    if (requestStatus !== 'AVAILABLE' && requestStatus !== 'CONNECTION_ISSUE') return;

    setRequestStatus('RESPONDING');

    // Simulate atomic verification and assignment
    setTimeout(() => {
      if (previewState === 'assigned_elsewhere') {
        setRequestStatus('ASSIGNED_ELSEWHERE');
        return;
      }
      if (previewState === 'timed_out' || (secondsLeft !== null && secondsLeft <= 0)) {
        setRequestStatus('TIMED_OUT');
        return;
      }
      if (previewState === 'connection_issue') {
        setRequestStatus('CONNECTION_ISSUE');
        return;
      }

      setRequestStatus('ASSIGNED_TO_AGENT');

      if (onAcceptCustomerRequest) {
        onAcceptCustomerRequest(effectiveRequest);
      } else if (onViewActiveService) {
        onViewActiveService();
      } else if (onViewServiceDetail) {
        onViewServiceDetail(effectiveRequest.id);
      }
    }, 600);
  };

  // Confirm rejection in modal with live availability revalidation
  const handleConfirmReject = () => {
    setShowRejectModal(false);

    if (requestStatus !== 'AVAILABLE' || (secondsLeft !== null && secondsLeft <= 0)) {
      if (secondsLeft !== null && secondsLeft <= 0) {
        setRequestStatus('TIMED_OUT');
      }
      return;
    }

    setRequestStatus('REJECTED_BY_AGENT');
    setIsDismissed(true);

    if (onRejectCustomerRequest) {
      onRejectCustomerRequest(effectiveRequest.id);
    }
  };

  const isDelivery = effectiveRequest.serviceType === 'delivery';
  const isExpandedRequestVisible = hasRequestToShow && !isDismissed && !isOfflineState;

  return (
    <div className="w-full h-full min-h-full bg-slate-50 flex flex-col justify-between text-slate-900 select-none overflow-hidden font-sans relative">
      {/* Top Header & Content Area (Scrollable without bulky scrollbars) */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-3.5 pt-3 pb-28 space-y-3">
        {/* 1. Authenticated Header */}
        <header className="flex items-center justify-between pb-1 pt-0.5 border-b border-slate-200/80">
          <div className="flex items-center gap-2">
            <TellerBudLogo size="sm" />
            <span className="text-sm font-extrabold text-[#002244] tracking-tight">
              TellerBud
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Notification Bell */}
            <button
              onClick={() => onSelectTab?.('requests')}
              className="w-8 h-8 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {(isExpandedRequestVisible || isConnectionIssue) && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#0052CC] ring-2 ring-white" />
              )}
            </button>

            {/* Profile Avatar */}
            <button
              onClick={() => onSelectTab?.('more')}
              className="w-8 h-8 rounded-full bg-[#0052CC]/10 border border-[#0052CC]/30 flex items-center justify-center text-[#0052CC] font-bold text-xs hover:bg-[#0052CC]/20 transition-colors"
              title="Agent Profile"
            >
              {agentFirstName.charAt(0)}
            </button>
          </div>
        </header>

        {/* 2. Connection Issue Banner */}
        {isConnectionIssue && (
          <div className="bg-amber-50 border border-amber-200/90 rounded-xl p-2.5 flex items-center gap-2 text-amber-900 text-xs">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="flex-1 font-medium">
              Some information couldn't be refreshed.
            </span>
          </div>
        )}

        {/* 3. Compact Greeting & Booth Context */}
        <div>
          <h2 className="text-base font-bold text-[#002244] tracking-tight">
            Hello, {agentFirstName}
          </h2>
          <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
            <MapPin className="w-3 h-3 text-[#0052CC] shrink-0" />
            <span>{assignment.booth}</span>
          </p>
        </div>

        {/* 4. Operational Status Summary Card (4 Headed Fields Grid) */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3 shadow-xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Operational Status
            </span>

            <button
              onClick={onUpdateAvailability}
              className="text-[11px] font-semibold text-[#0052CC] hover:text-[#003da6] flex items-center gap-0.5 active:opacity-75 transition-colors"
            >
              <span>Update</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-0.5">
            {/* Field 1: Availability */}
            <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Availability
              </span>
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    currentStatus === 'online' ? 'bg-emerald-500' : 'bg-slate-400'
                  }`}
                />
                <span className="text-xs font-extrabold text-[#002244] capitalize">
                  {currentStatus === 'online' ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>

            {/* Field 2: Service */}
            <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Service
              </span>
              <span className="text-xs font-extrabold text-[#002244] truncate block">
                {compactServiceLabel}
              </span>
            </div>

            {/* Field 3: Cash Band */}
            <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-2 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Cash Band
              </span>
              <span className="text-xs font-extrabold text-[#002244] leading-tight block break-words">
                {compactCashBandDisplay}
              </span>
            </div>

            {/* Field 4: Float Band */}
            <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-2 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Float Band
              </span>
              <span className="text-xs font-extrabold text-[#002244] leading-tight block break-words">
                {compactFloatBandDisplay}
              </span>
            </div>
          </div>
        </div>

        {/* 5. Active Service Card (when present in preview state) */}
        {showActiveServiceCard && (
          <div className="bg-white border-2 border-[#0052CC]/40 rounded-2xl p-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-[#002244] flex items-center gap-1.5">
                <CircleDot className="w-3.5 h-3.5 text-[#0052CC] animate-pulse" />
                Current Service
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#0052CC] text-[10px] font-semibold border border-blue-200/60">
                {sampleActiveService.status}
              </span>
            </div>

            <div className="space-y-1.5 text-xs mb-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Service</span>
                <span className="font-semibold text-slate-800 capitalize">
                  {sampleActiveService.serviceType}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Amount</span>
                <span className="font-bold text-[#002244] font-mono">
                  {sampleActiveService.amount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Location</span>
                <span className="font-medium text-slate-700">
                  {sampleActiveService.location}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                if (onViewActiveService) {
                  onViewActiveService();
                } else if (onViewServiceDetail) {
                  onViewServiceDetail(sampleActiveService.id);
                }
              }}
              className="w-full py-2 bg-[#0052CC] hover:bg-[#003da6] text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1 shadow-xs"
            >
              <span>View Service</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 7. Quick Actions Section */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Quick Actions
          </h3>

          <div className="grid grid-cols-2 gap-2.5 mb-2.5">
            <button
              onClick={onStartWalkIn}
              className="bg-white border border-slate-200/90 hover:border-[#0052CC]/50 rounded-2xl p-3 text-left transition-all hover:shadow-xs group flex flex-col justify-between min-h-[90px]"
            >
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-[#0052CC] flex items-center justify-center mb-2 group-hover:bg-[#0052CC] group-hover:text-white transition-colors">
                <QrCode className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block leading-snug">
                  Walk-In Transaction
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Start booth capture
                </span>
              </div>
            </button>

            <button
              onClick={onRequestLiquidity}
              className="bg-white border border-slate-200/90 hover:border-[#0052CC]/50 rounded-2xl p-3 text-left transition-all hover:shadow-xs group flex flex-col justify-between min-h-[90px]"
            >
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-[#0052CC] flex items-center justify-center mb-2 group-hover:bg-[#0052CC] group-hover:text-white transition-colors">
                <Coins className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block leading-snug">
                  Request Cash / Float
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Operational liquidity
                </span>
              </div>
            </button>
          </div>

          {/* Row 2: Balance Enquiry (Directly above End Workday) */}
          <button
            type="button"
            id="home-action-balance-enquiry"
            onClick={() => {
              setDialledVendor('');
              setShowDialler(true);
              if (onCheckMnoBalance) {
                onCheckMnoBalance();
              }
            }}
            className="w-full bg-white border border-slate-200/90 hover:border-emerald-500/50 rounded-2xl p-3 mb-2.5 text-left transition-all hover:shadow-xs group flex items-center justify-between min-h-[58px] shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block leading-snug">
                  Balance Enquiry
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">
                  Check your MNO mobile-money balance
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
          </button>

          {/* Third Quick Action: End Workday */}
          <button
            type="button"
            id="home-end-workday-btn"
            onClick={handleEndWorkdayClick}
            className="w-full bg-white border border-slate-200/90 hover:border-rose-300 hover:bg-rose-50/20 rounded-2xl p-3 text-left transition-all hover:shadow-xs group flex items-center justify-between min-h-[58px]"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
                <LogOut className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block leading-snug">
                  End Workday
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Reconcile balances & finish shift
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 transition-colors" />
          </button>
        </div>
      </div>

      {/* End Workday Confirmation Bottom Sheet Modal */}
      {showConfirmSheet && (
        <div className="absolute inset-0 z-30 bg-slate-900/40 backdrop-blur-2xs flex flex-col justify-end">
          <div className="bg-white rounded-t-3xl border-t border-slate-200 p-4 space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-extrabold text-[#002244] tracking-tight">
                  End today&apos;s shift?
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  You will proceed to end-of-day cash and float declaration before closing your shift.
                </p>
              </div>
              <button
                onClick={() => setShowConfirmSheet(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => setShowConfirmSheet(false)}
                className="py-2.5 px-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                Keep Working
              </button>
              <button
                onClick={() => {
                  setShowConfirmSheet(false);
                  if (onEndWorkdayContinue) {
                    onEndWorkdayContinue();
                  } else {
                    console.log('Contract trigger: Screen EndOfDayDeclarationScreen');
                  }
                }}
                className="py-2.5 px-3 rounded-xl bg-[#0052CC] hover:bg-[#003E99] text-white font-extrabold text-xs transition-colors shadow-2xs"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Service Blocking Dialog Modal */}
      {showBlockingDialog && (
        <div className="absolute inset-0 z-30 bg-slate-900/40 backdrop-blur-2xs flex flex-col justify-end">
          <div className="bg-white rounded-t-3xl border-t border-slate-200 p-4 space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 text-amber-900">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-extrabold text-[#002244] tracking-tight">
                  Work still in progress
                </h3>
              </div>
              <button
                onClick={() => setShowBlockingDialog(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Complete your active service before ending the workday. You have an ongoing customer or liquidity transaction in progress.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setShowBlockingDialog(false)}
                className="flex-1 py-2.5 px-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                Got it
              </button>
              {(onViewServiceDetail || onViewActiveService) && (
                <button
                  onClick={() => {
                    setShowBlockingDialog(false);
                    if (onViewActiveService) {
                      onViewActiveService();
                    } else if (onViewServiceDetail) {
                      onViewServiceDetail(sampleActiveService.id);
                    }
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#0052CC] hover:bg-[#003E99] text-white font-bold text-xs transition-colors shadow-2xs"
                >
                  View Active Service
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Incoming Customer Request Automatic Pop-up / Modal */}
      {hasRequestToShow && !isDismissed && requestStatus === 'AVAILABLE' && (
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-2xs z-40 flex flex-col justify-end p-3 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-2xl space-y-3.5 animate-in slide-in-from-bottom duration-200">
            {/* Pop-up Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold tracking-tight bg-sky-50 text-[#0052CC] border border-sky-200/70">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Customer Pickup
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">
                  #{effectiveRequest.requestReference || effectiveRequest.id}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {secondsLeft !== null && (
                  <div
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono font-extrabold ${
                      secondsLeft <= 30
                        ? 'bg-red-100 text-red-700 animate-pulse'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(secondsLeft)}</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setIsDismissed(true)}
                  className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center shrink-0 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Amount & Transaction Summary */}
            <div className="space-y-0.5">
              <div className="flex items-baseline justify-between">
                <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                  Request Amount
                </span>
                <span className="text-xs font-semibold text-slate-600">
                  {effectiveRequest.transactionType || 'Cash Withdrawal'} • {effectiveRequest.vendor || 'MTN'}
                </span>
              </div>
              <div className="text-2xl font-black text-[#002244] tracking-tight">
                {effectiveRequest.amount}
              </div>
            </div>

            {/* Pickup Location detail */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5 text-xs text-slate-700">
              <MapPin className="w-4 h-4 text-[#0052CC] shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wide">
                  Pickup Location
                </span>
                <span className="text-xs font-semibold text-slate-800 block truncate">
                  {effectiveRequest.agentLocation || assignment.booth || 'Booth 03 — Main Atrium'}
                </span>
              </div>
            </div>

            {/* Agent Earnings Card (TellerBud Blue Palette: White + Blue) */}
            <div className="p-3 rounded-2xl bg-[#0052CC]/5 border border-[#0052CC]/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#0052CC]/10 text-[#0052CC] flex items-center justify-center font-bold">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-[#0052CC] uppercase tracking-wider block">
                    Agent Earning
                  </span>
                  <span className="text-[11px] text-slate-600 font-medium">
                    Reservation Fee
                  </span>
                </div>
              </div>
              <div className="text-base font-black text-[#0052CC]">
                {effectiveRequest.reservationFee || effectiveRequest.agentEarnings || 'ZMW 30.00'}
              </div>
            </div>

            {/* Action Buttons: Dismiss & View Request */}
            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setIsDismissed(true)}
                className="flex-1 py-3 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors text-center"
              >
                Dismiss
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onViewRequestDetail) {
                    onViewRequestDetail(effectiveRequest.id);
                  }
                }}
                className="flex-2 py-3 px-4 rounded-xl bg-[#0052CC] hover:bg-[#003E99] active:bg-[#002E7A] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm text-center"
              >
                <span>View Request</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Request Rejection Bottom Sheet Modal */}
      {showRejectModal && (
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-2xs z-40 flex flex-col justify-end p-3 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-4 space-y-3 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Reject this request?</span>
              </div>
              <button
                onClick={() => setShowRejectModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              You won&apos;t be considered for this request after rejecting it. Other available requests will continue to reach you.
            </p>

            <div className="pt-2 flex items-center gap-2.5">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 py-2.5 px-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                Keep Request
              </button>
              <button
                onClick={handleConfirmReject}
                className="flex-1 py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs transition-colors shadow-xs"
              >
                Reject Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Android System Phone Dialler Overlay for Balance Enquiry */}
      {showDialler && (
        <AndroidPhoneDialler
          initialCode=""
          transactionType="Balance Enquiry"
          amount=""
          requestRef="MNO-BAL"
          onCall={(dialledCode) => {
            let detected = 'MTN';
            if (dialledCode.includes('778')) {
              detected = 'Airtel';
            } else if (dialledCode.includes('303')) {
              detected = 'Zamtel';
            } else if (dialledCode.includes('222')) {
              detected = 'ZedMobile';
            } else if (dialledCode.includes('115')) {
              detected = 'MTN';
            }
            setDialledVendor(detected);
            setShowDialler(false);
            setShowUssdSession(true);
          }}
          onCancel={() => setShowDialler(false)}
        />
      )}

      {/* Real-time USSD Session Simulation */}
      {showUssdSession && (
        <VendorUssdOverlay
          vendor={dialledVendor || 'MTN'}
          transactionType="Check Balance"
          amount=""
          requestRef="MNO-BAL"
          onComplete={() => {
            setShowUssdSession(false);
          }}
          onCancel={() => {
            setShowUssdSession(false);
          }}
          onFailure={() => {
            setShowUssdSession(false);
          }}
        />
      )}

      {/* Fixed Bottom Application Navigation Bar */}
      <nav className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200/90 px-4 flex items-center justify-around z-20 shadow-xs">
        <button
          onClick={() => onSelectTab?.('home')}
          className="flex flex-col items-center justify-center gap-1 text-[#0052CC] font-semibold"
        >
          <Home className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px]">Home</span>
        </button>

        <button
          onClick={() => onSelectTab?.('requests')}
          className="flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <Inbox className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] font-medium">Requests</span>
        </button>

        <button
          onClick={() => onSelectTab?.('transactions')}
          className="flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <ArrowLeftRight className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] font-medium">Transactions</span>
        </button>

        <button
          onClick={() => onSelectTab?.('more')}
          className="flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <MoreHorizontal className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] font-medium">More</span>
        </button>
      </nav>
    </div>
  );
};
