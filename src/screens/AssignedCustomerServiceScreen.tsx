import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  Info,
  MapPin,
  RefreshCw,
  XCircle,
  AlertCircle,
  Navigation,
  Clock,
  Truck,
  ShoppingBag,
  MessageSquare,
} from 'lucide-react';
import { TellerBudLogo } from '../components/TellerBudLogo';
import {
  AssignedCustomerService,
  AssignedServicePreviewState,
  RecordedTransaction,
} from '../types';
import { PoweredByCinitecFooter } from '../components/PoweredByCinitecFooter';
import { AndroidPhoneDialler } from '../components/AndroidPhoneDialler';
import { VendorUssdOverlay } from '../components/VendorUssdOverlay';
import { isOutgoingVendorTransferRequired } from '../utils/transactionService';
import { normalizeZmwAmount } from '../config/currencyConfig';
import { getVendorType } from '../config/walkInConfig';

interface AssignedCustomerServiceScreenProps {
  initialService?: AssignedCustomerService;
  previewState?: AssignedServicePreviewState;
  onBack?: () => void;
  onProceed?: (serviceId: string, transactionRecord?: RecordedTransaction) => void;
  onProceedToTransaction?: (serviceId: string, transactionRecord?: RecordedTransaction) => void;
  onChatWithCustomer?: () => void;
  onCancelService?: (serviceId: string) => void;
}

const defaultDeliveryService: AssignedCustomerService = {
  id: 'REQ-9082',
  requestReference: 'REQ-9082',
  requestOrigin: 'Customer',
  customerName: 'John Banda',
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
  serviceStatus: 'assigned',
  deliveryFee: 'ZMW 50.00',
  agentEarnings: 'ZMW 50.00',
};

const defaultPickupService: AssignedCustomerService = {
  id: 'REQ-9083',
  requestReference: 'REQ-9083',
  requestOrigin: 'Customer',
  customerName: 'John Banda',
  serviceType: 'pickup',
  transactionType: 'Withdrawal',
  vendor: 'MTN',
  amount: 'ZMW 15,000.00',
  currencySymbol: 'ZMW',
  currencyCode: 'ZMW',
  location: 'Booth 03 — Main Atrium',
  customerLocation: 'Plot 42, Commercial Avenue, Lusaka',
  agentLocation: 'Booth 03 — Main Atrium',
  booth: 'Booth 03 — Main Atrium',
  customerEstimatedArrival: '8 min',
  timing: 'Immediate',
  reservationActive: true,
  serviceStatus: 'assigned',
  reservationFee: 'ZMW 25.00',
  agentEarnings: 'ZMW 25.00',
};

const defaultScheduledPickupService: AssignedCustomerService = {
  id: 'REQ-9084',
  requestReference: 'REQ-9084',
  requestOrigin: 'Customer',
  customerName: 'John Banda',
  serviceType: 'pickup',
  transactionType: 'Withdrawal',
  vendor: 'MTN',
  amount: 'ZMW 15,000.00',
  currencySymbol: 'ZMW',
  currencyCode: 'ZMW',
  location: 'Booth 03 — Main Atrium',
  customerLocation: 'Plot 42, Commercial Avenue, Lusaka',
  agentLocation: 'Booth 03 — Main Atrium',
  booth: 'Booth 03 — Main Atrium',
  customerEstimatedArrival: '12 min',
  timing: 'Scheduled (Within 15 mins)',
  reservationActive: true,
  serviceStatus: 'assigned',
  reservationFee: 'ZMW 25.00',
  agentEarnings: 'ZMW 25.00',
};

type DeliveryJourneyStep = 'ready' | 'en_route' | 'arrived';

export const AssignedCustomerServiceScreen: React.FC<
  AssignedCustomerServiceScreenProps
> = ({
  initialService,
  previewState = 'pickup_assigned',
  onBack,
  onProceed,
  onProceedToTransaction,
  onChatWithCustomer,
  onCancelService,
}) => {
  const [retryLoading, setRetryLoading] = useState(false);
  const [journeyStep, setJourneyStep] = useState<DeliveryJourneyStep>('ready');
  const [execState, setExecState] = useState<'idle' | 'dialler' | 'ussd_in_progress'>('idle');
  const [capturedVendorRef, setCapturedVendorRef] = useState<string | undefined>(undefined);
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);

  // Derive active service data based on previewState or initialService
  const getEffectiveService = (): {
    service: AssignedCustomerService;
    isCancelled: boolean;
    hasConnectionIssue: boolean;
  } => {
    switch (previewState) {
      case 'pickup_eta_unavailable':
        return {
          service: {
            ...defaultPickupService,
            customerEstimatedArrival: undefined,
          },
          isCancelled: false,
          hasConnectionIssue: false,
        };
      case 'pickup_deposit_assigned':
        return {
          service: {
            ...defaultPickupService,
            id: 'REQ-9085',
            requestReference: 'REQ-9085',
            transactionType: 'Deposit',
            vendor: 'MTN',
            amount: 'ZMW 15,000.00',
          },
          isCancelled: false,
          hasConnectionIssue: false,
        };
      case 'pickup_waiting':
      case 'pickup_assigned':
        return {
          service:
            initialService && initialService.serviceType === 'pickup'
              ? {
                  ...initialService,
                  vendor: initialService.vendor === 'Apex Supermarket #104' ? 'MTN' : initialService.vendor || 'MTN',
                  transactionType: initialService.transactionType || 'Withdrawal',
                }
              : defaultPickupService,
          isCancelled: false,
          hasConnectionIssue: false,
        };
      case 'scheduled_pickup':
        return {
          service: defaultScheduledPickupService,
          isCancelled: false,
          hasConnectionIssue: false,
        };
      case 'service_cancelled':
        return {
          service:
            initialService && initialService.serviceStatus === 'cancelled'
              ? {
                  ...initialService,
                  vendor: initialService.vendor === 'Apex Supermarket #104' ? 'MTN' : initialService.vendor || 'MTN',
                  transactionType: initialService.transactionType || 'Withdrawal',
                }
              : { ...defaultPickupService, serviceStatus: 'cancelled' },
          isCancelled: true,
          hasConnectionIssue: false,
        };
      case 'connection_issue':
        return {
          service:
            initialService
              ? {
                  ...initialService,
                  vendor: initialService.vendor === 'Apex Supermarket #104' ? 'MTN' : initialService.vendor || 'MTN',
                  transactionType: initialService.transactionType || 'Withdrawal',
                }
              : defaultPickupService,
          isCancelled: false,
          hasConnectionIssue: true,
        };
      case 'delivery_en_route':
        return {
          service:
            initialService && initialService.serviceType === 'delivery'
              ? {
                  ...initialService,
                  vendor: initialService.vendor === 'Apex Supermarket #104' ? 'MTN' : initialService.vendor || 'MTN',
                  transactionType: initialService.transactionType || 'Withdrawal',
                }
              : defaultDeliveryService,
          isCancelled: false,
          hasConnectionIssue: false,
        };
      case 'delivery_arrived':
        return {
          service:
            initialService && initialService.serviceType === 'delivery'
              ? {
                  ...initialService,
                  vendor: initialService.vendor === 'Apex Supermarket #104' ? 'MTN' : initialService.vendor || 'MTN',
                  transactionType: initialService.transactionType || 'Withdrawal',
                }
              : defaultDeliveryService,
          isCancelled: false,
          hasConnectionIssue: false,
        };
      case 'delivery_assigned':
        return {
          service:
            initialService && initialService.serviceType === 'delivery'
              ? {
                  ...initialService,
                  vendor: initialService.vendor === 'Apex Supermarket #104' ? 'MTN' : initialService.vendor || 'MTN',
                  transactionType: initialService.transactionType || 'Withdrawal',
                }
              : defaultDeliveryService,
          isCancelled: false,
          hasConnectionIssue: false,
        };
      default:
        return {
          service:
            initialService
              ? {
                  ...initialService,
                  vendor: initialService.vendor === 'Apex Supermarket #104' ? 'MTN' : initialService.vendor || 'MTN',
                  transactionType: initialService.transactionType || 'Withdrawal',
                }
              : defaultPickupService,
          isCancelled: false,
          hasConnectionIssue: false,
        };
    }
  };

  const { service, isCancelled, hasConnectionIssue } = getEffectiveService();
  const isDelivery = service.serviceType === 'delivery';
  const requiresOutgoingUssd = isOutgoingVendorTransferRequired(service.transactionType);

  // Sync internal journey step with external previewState
  useEffect(() => {
    if (previewState === 'delivery_en_route') {
      setJourneyStep('en_route');
    } else if (previewState === 'delivery_arrived') {
      setJourneyStep('arrived');
    } else if (previewState === 'delivery_assigned') {
      setJourneyStep('ready');
    }
  }, [previewState]);

  const createRecordedTransaction = (vRef?: string): RecordedTransaction => {
    const vendorPrefix = (service.vendor || 'MTN').substring(0, 3).toUpperCase();
    const randomNum = Math.floor(10000000 + Math.random() * 90000000);
    const finalVendorRef = vRef || capturedVendorRef || `${vendorPrefix}-${randomNum}`;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    const currentTimestamp = `Today, ${timeStr}`;

    return {
      id: `TXN-${service.id}`,
      requestReference: service.requestReference || service.id,
      customerName: service.customerName || 'John Banda',
      serviceType: service.serviceType,
      transactionType: service.transactionType || 'Withdrawal',
      vendorType: service.vendorType || getVendorType(service.vendor) || 'MNO',
      vendor: service.vendor || 'MTN',
      amount: normalizeZmwAmount(service.amount),
      location: service.location,
      booth: service.booth || service.agentLocation || 'Booth 03 — Main Atrium',
      timestamp: currentTimestamp,
      recordedAt: currentTimestamp,
      vendorReference: finalVendorRef,
      serviceFee: normalizeZmwAmount(service.reservationFee || service.deliveryFee || '30.00'),
      reservationFee: service.reservationFee ? normalizeZmwAmount(service.reservationFee) : undefined,
    };
  };

  const handleProceed = () => {
    if (isCancelled) return;
    if (isDelivery && journeyStep !== 'arrived') return;

    if (requiresOutgoingUssd) {
      // Deposit / Purchase: Launch Dialler / USSD
      setExecState('dialler');
    } else {
      // Withdrawal: NO outgoing USSD, directly complete transaction execution and navigate to completion
      const txnRecord = createRecordedTransaction();
      if (onProceed) {
        onProceed(service.id, txnRecord);
      } else if (onProceedToTransaction) {
        onProceedToTransaction(service.id, txnRecord);
      } else {
        console.log('Contract trigger: Target screen ServiceCompletionScreen for service', service.id);
      }
    }
  };

  const handleDiallerCall = (_dialledCode: string) => {
    setExecState('ussd_in_progress');
  };

  const handleDiallerCancel = () => {
    setExecState('idle');
  };

  const handleUssdSuccess = (vendorRef: string) => {
    setCapturedVendorRef(vendorRef || undefined);
    setExecState('idle');
    const txnRecord = createRecordedTransaction(vendorRef);
    if (onProceed) {
      onProceed(service.id, txnRecord);
    } else if (onProceedToTransaction) {
      onProceedToTransaction(service.id, txnRecord);
    } else {
      console.log('Contract trigger: Target screen ServiceCompletionScreen for service', service.id);
    }
  };

  const handleUssdCancel = () => {
    setExecState('idle');
  };

  const handleUssdFailure = (_errMsg?: string) => {
    setExecState('idle');
  };

  const handleRetry = () => {
    setRetryLoading(true);
    setTimeout(() => {
      setRetryLoading(false);
    }, 800);
  };

  const handleConfirmCancel = () => {
    setShowCancelModal(false);
    if (onCancelService) {
      onCancelService(service.id);
    } else if (onBack) {
      onBack();
    }
  };

  // Status label text & style for summary chip
  const getStatusChip = () => {
    if (isCancelled) {
      return (
        <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 text-[10px] font-extrabold border border-red-200">
          Cancelled
        </span>
      );
    }
    if (isDelivery) {
      if (journeyStep === 'en_route') {
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-extrabold border border-indigo-200">
            En Route
          </span>
        );
      }
      if (journeyStep === 'arrived') {
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0052CC] text-[10px] font-extrabold border border-blue-200">
            Arrived
          </span>
        );
      }
      return (
        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0052CC] text-[10px] font-extrabold border border-blue-200/80">
          Ready to Start
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0052CC] text-[10px] font-extrabold border border-blue-200">
        Waiting for Customer
      </span>
    );
  };

  return (
    <div className="w-full h-full min-h-full bg-slate-50 flex flex-col justify-between text-slate-900 select-none overflow-hidden font-sans relative">
      {/* 1. Header */}
      <header className="px-3.5 pt-3 pb-2.5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between shrink-0 z-10">
        <button
          onClick={onBack}
          aria-label="Back to Agent Home"
          className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
        </button>

        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-900 tracking-tight">
            Assigned Service
          </span>
          {(service.requestReference || service.id) && (
            <span className="text-[10px] font-mono text-slate-400 bg-slate-200/60 px-1.5 py-0.5 rounded">
              #{service.requestReference || service.id}
            </span>
          )}
        </div>

        <TellerBudLogo size="sm" />
      </header>

      {/* 2. Vertically Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-3.5 flex flex-col justify-start space-y-3.5">
        {/* Connection Issue Warning if active */}
        {hasConnectionIssue && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="text-[11px] text-amber-800 font-medium">
                Some service information couldn&apos;t be refreshed.
              </span>
            </div>
            <button
              onClick={handleRetry}
              disabled={retryLoading}
              className="text-[10px] font-bold text-amber-900 bg-amber-200/60 px-2 py-1 rounded-lg hover:bg-amber-200 transition-colors shrink-0 flex items-center gap-1"
            >
              <RefreshCw
                className={`w-3 h-3 ${retryLoading ? 'animate-spin' : ''}`}
              />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Cancelled Alert Banner if cancelled */}
        {isCancelled && (
          <div className="bg-red-50/80 border border-red-200/90 rounded-xl p-3 flex items-center gap-2.5 shadow-xs">
            <div className="w-7 h-7 rounded-lg bg-red-100 text-red-600 border border-red-200/60 flex items-center justify-center shrink-0">
              <XCircle className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-extrabold text-red-950 tracking-tight">
                Service Cancelled
              </div>
            </div>
          </div>
        )}

        {/* Compact Service Header Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isDelivery
                  ? 'bg-blue-50 text-[#0052CC] border border-blue-100'
                  : 'bg-blue-50 text-[#0052CC] border border-blue-100'
              }`}
            >
              {isDelivery ? (
                <Truck className="w-4.5 h-4.5 stroke-[2]" />
              ) : (
                <ShoppingBag className="w-4.5 h-4.5 stroke-[2]" />
              )}
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                Service Type
              </span>
              <span className="text-xs font-extrabold text-[#002244]">
                {isDelivery ? 'Delivery Request' : 'Pickup Request'}
              </span>
            </div>
          </div>
          {getStatusChip()}
        </div>

        {/* Delivery Mode: Prominent Journey Map */}
        {isDelivery && !isCancelled && (
          <div className="flex-1 flex flex-col space-y-3">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3 flex-1 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-[#0052CC]" />
                  <h3 className="text-xs font-extrabold text-[#002244] uppercase tracking-wider">
                    Delivery Route
                  </h3>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    journeyStep === 'en_route'
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      : journeyStep === 'arrived'
                      ? 'bg-blue-50 text-[#0052CC] border-blue-200'
                      : 'bg-blue-50 text-[#0052CC] border-blue-200'
                  }`}
                >
                  {journeyStep === 'en_route'
                    ? 'En Route'
                    : journeyStep === 'arrived'
                    ? 'Arrived'
                    : 'Ready to Start'}
                </span>
              </div>

              {/* Large Vector Map Canvas */}
              <div className="relative w-full flex-1 min-h-[220px] bg-slate-900 rounded-xl overflow-hidden border border-slate-200/60 flex flex-col justify-between p-3.5">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:14px_14px]" />

                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 320 220"
                  fill="none"
                >
                  <path
                    d="M 40 170 C 90 120 160 190 220 90 C 240 60 265 50 280 45"
                    stroke="#38bdf8"
                    strokeWidth="3.5"
                    strokeDasharray="6 6"
                    className="animate-pulse"
                  />
                  <path
                    d="M 40 170 C 90 120 160 190 220 90 C 240 60 265 50 280 45"
                    stroke="#0052CC"
                    strokeWidth="4"
                    opacity="0.75"
                  />

                  {/* Moving Agent Indicator Position */}
                  <circle
                    cx={
                      journeyStep === 'ready'
                        ? 40
                        : journeyStep === 'en_route'
                        ? 165
                        : 280
                    }
                    cy={
                      journeyStep === 'ready'
                        ? 170
                        : journeyStep === 'en_route'
                        ? 140
                        : 45
                    }
                    r="8"
                    fill="#0052CC"
                    className="transition-all duration-700 ease-in-out shadow-lg"
                  />
                  <circle
                    cx={
                      journeyStep === 'ready'
                        ? 40
                        : journeyStep === 'en_route'
                        ? 165
                        : 280
                    }
                    cy={
                      journeyStep === 'ready'
                        ? 170
                        : journeyStep === 'en_route'
                        ? 140
                        : 45
                    }
                    r="14"
                    stroke="#0052CC"
                    strokeWidth="2"
                    opacity="0.5"
                    className="transition-all duration-700 ease-in-out animate-ping"
                  />
                </svg>

                {/* Map Origin & Destination Markers */}
                <div className="relative z-10 flex items-start justify-between w-full">
                  <div className="flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg border border-slate-700/60 text-[10.5px]">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        journeyStep === 'ready'
                          ? 'bg-blue-400 animate-ping'
                          : 'bg-slate-400'
                      }`}
                    />
                    <span className="font-bold text-slate-200">
                      {service.agentLocation || 'Booth 03'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-blue-600/90 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg border border-blue-400/60 text-[10.5px] max-w-[55%] truncate">
                    <MapPin className="w-3 h-3 text-white shrink-0" />
                    <span className="font-bold truncate">
                      {service.customerLocation || service.location || 'Customer'}
                    </span>
                  </div>
                </div>

                {/* Distance and Travel Time Overlay Banner */}
                <div className="relative z-10 bg-slate-950/90 border border-slate-700/80 rounded-xl p-2.5 flex items-center justify-between text-xs backdrop-blur-xs">
                  <div className="flex items-center gap-2">
                    <Navigation className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-slate-200 font-semibold text-[11.5px]">
                      {journeyStep === 'arrived'
                        ? 'Arrived at Customer Location'
                        : journeyStep === 'en_route'
                        ? '3.2 km remaining'
                        : service.distance || '4.8 km to destination'}
                    </span>
                  </div>
                  <span className="font-mono font-extrabold text-blue-300 text-[11.5px]">
                    {journeyStep === 'arrived'
                      ? '0 min'
                      : journeyStep === 'en_route'
                      ? '8 min est.'
                      : service.estimatedTravelTime || '12 min est.'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pickup Mode: Prominent Customer ETA Card (NO MAP) */}
        {!isDelivery && !isCancelled && (
          <div className="flex-1 flex flex-col">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4.5 shadow-xs flex-1 flex flex-col justify-between space-y-3.5">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#0052CC]" />
                  <h3 className="text-xs font-extrabold text-[#002244] uppercase tracking-wider">
                    Customer ETA
                  </h3>
                </div>
                <span className="text-[10.5px] font-bold text-[#0052CC] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                  Waiting for Customer
                </span>
              </div>

              {service.customerEstimatedArrival ? (
                <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl py-6 px-4 flex flex-col items-center justify-center text-center space-y-2 my-auto">
                  <span className="text-[11px] font-bold text-[#0052CC] uppercase tracking-wider">
                    Estimated Arrival Time
                  </span>
                  <span className="text-4xl font-black text-[#002244] font-mono tracking-tight my-1">
                    {service.customerEstimatedArrival}
                  </span>
                  <span className="text-xs text-slate-600 font-medium pt-1">
                    Customer is travelling to:{' '}
                    <strong className="text-slate-900 font-bold">
                      {service.booth || service.agentLocation || 'Booth 03 — Main Atrium'}
                    </strong>
                  </span>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl py-6 px-4 flex flex-col items-center justify-center text-center space-y-2 my-auto">
                  <span className="text-xs font-bold text-slate-700">
                    Customer ETA unavailable
                  </span>
                  <span className="text-xs text-slate-500 font-medium pt-0.5">
                    Customer is travelling to:{' '}
                    <strong className="text-slate-800 font-bold">
                      {service.booth || service.agentLocation || 'Booth 03 — Main Atrium'}
                    </strong>
                  </span>
                </div>
              )}

              {/* Timing / Scheduling Info if present */}
              {service.timing && (
                <div className="flex items-center justify-between text-xs py-2.5 px-3 bg-slate-50/80 border border-slate-100 rounded-xl">
                  <span className="text-slate-500 font-medium">Pickup Timing</span>
                  <span className="font-bold text-slate-900 bg-white border border-slate-200 px-2.5 py-0.5 rounded text-[11px]">
                    {service.timing}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. Sticky Action Area at Bottom (with Powered by Cinitec at TRUE footer below buttons) */}
      <div className="px-4 pt-3 pb-3 bg-white border-t border-slate-200/90 shadow-lg shrink-0 z-20 space-y-3">
        {!isCancelled ? (
          <>
            {/* Secondary Chat CTA when not in delivery journey ready step */}
            <button
              type="button"
              id="assigned-service-chat-customer-btn"
              onClick={() => {
                if (onChatWithCustomer) onChatWithCustomer();
                else console.log('Contract trigger: Target Screen AgentChatConversationScreen');
              }}
              className="w-full py-3 px-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-700 border border-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-2 active:scale-[0.99] shadow-2xs"
            >
              <MessageSquare className="w-4 h-4 text-[#0052CC]" />
              <span>Chat with Customer</span>
            </button>

            {isDelivery ? (
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  id="assigned-service-cancel-btn"
                  onClick={() => setShowCancelModal(true)}
                  className="w-1/3 py-3.5 px-3 rounded-xl bg-white hover:bg-red-50 active:bg-red-100 text-red-600 border border-red-200 font-extrabold text-xs transition-colors shadow-2xs flex items-center justify-center gap-1 active:scale-[0.98]"
                >
                  <span>Cancel</span>
                </button>
                {journeyStep === 'ready' ? (
                  <button
                    onClick={() => setJourneyStep('en_route')}
                    className="flex-1 py-3.5 px-4 rounded-xl bg-[#0052CC] hover:bg-[#0043A8] active:bg-[#003585] text-white font-extrabold text-xs transition-colors shadow-xs flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>Start Delivery</span>
                  </button>
                ) : journeyStep === 'en_route' ? (
                  <button
                    onClick={() => setJourneyStep('arrived')}
                    className="flex-1 py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-extrabold text-xs transition-colors shadow-xs flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Arrived at Customer</span>
                  </button>
                ) : (
                  <button
                    id="assigned-service-proceed-btn"
                    onClick={handleProceed}
                    className="flex-1 py-3.5 px-4 rounded-xl bg-[#0052CC] hover:bg-[#0043A8] active:bg-[#003585] text-white font-extrabold text-xs transition-colors shadow-xs flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    <span>Proceed</span>
                    <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  id="assigned-service-cancel-btn"
                  onClick={() => setShowCancelModal(true)}
                  className="w-1/3 py-3.5 px-3 rounded-xl bg-white hover:bg-red-50 active:bg-red-100 text-red-600 border border-red-200 font-extrabold text-xs transition-colors shadow-2xs flex items-center justify-center gap-1 active:scale-[0.98]"
                >
                  <span>Cancel</span>
                </button>
                <button
                  type="button"
                  id="assigned-service-proceed-btn"
                  onClick={handleProceed}
                  className="flex-1 py-3.5 px-4 rounded-xl bg-[#0052CC] hover:bg-[#0043A8] active:bg-[#003585] text-white font-extrabold text-xs transition-colors shadow-xs flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <span>Proceed</span>
                  <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            )}
          </>
        ) : (
          <button
            onClick={onBack}
            className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <span>Back to Home</span>
          </button>
        )}

        {/* Footer positioned below Cancel / Proceed buttons and above device safe area */}
        <div className="pt-0.5 pb-0.5">
          <PoweredByCinitecFooter className="py-0.5" />
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xs rounded-2xl p-5 shadow-2xl border border-slate-100 flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
              <XCircle className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Cancel Request?</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Are you sure you want to cancel this assigned service?
              </p>
            </div>
            <div className="w-full flex flex-col gap-2 pt-1">
              <button
                type="button"
                id="confirm-cancel-request-btn"
                onClick={handleConfirmCancel}
                className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-extrabold text-xs transition-colors shadow-xs cursor-pointer"
              >
                Cancel Request
              </button>
              <button
                type="button"
                id="keep-request-btn"
                onClick={() => setShowCancelModal(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Keep Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MNO Android Phone Dialler Overlay for Outgoing USSD (Deposit / Purchase) */}
      {execState === 'dialler' && (
        <AndroidPhoneDialler
          vendor={service.vendor || 'MTN'}
          transactionType={service.transactionType || 'Deposit'}
          amount={normalizeZmwAmount(service.amount)}
          requestRef={service.requestReference || service.id}
          onCall={handleDiallerCall}
          onCancel={handleDiallerCancel}
        />
      )}

      {/* MNO USSD In-App Overlay for Outgoing USSD Execution */}
      {execState === 'ussd_in_progress' && (
        <VendorUssdOverlay
          vendor={service.vendor || 'MTN'}
          transactionType={service.transactionType || 'Deposit'}
          amount={normalizeZmwAmount(service.amount)}
          requestRef={service.requestReference || service.id}
          onSuccess={handleUssdSuccess}
          onCancel={handleUssdCancel}
          onFailure={handleUssdFailure}
        />
      )}
    </div>
  );
};
