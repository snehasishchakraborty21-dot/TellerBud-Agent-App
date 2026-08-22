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
} from '../types';

interface AssignedCustomerServiceScreenProps {
  initialService?: AssignedCustomerService;
  previewState?: AssignedServicePreviewState;
  onBack?: () => void;
  onProceedToTransaction?: (serviceId: string) => void;
  onChatWithCustomer?: () => void;
}

const defaultDeliveryService: AssignedCustomerService = {
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
  serviceStatus: 'assigned',
  deliveryFee: 'ZMW 50.00',
  agentEarnings: 'ZMW 50.00',
};

const defaultPickupService: AssignedCustomerService = {
  id: 'REQ-9083',
  requestReference: 'REQ-9083',
  requestOrigin: 'Customer',
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
  onProceedToTransaction,
  onChatWithCustomer,
}) => {
  const [retryLoading, setRetryLoading] = useState(false);
  const [journeyStep, setJourneyStep] = useState<DeliveryJourneyStep>('ready');

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

  const handleProceed = () => {
    if (isCancelled) return;
    if (isDelivery && journeyStep !== 'arrived') return;

    if (onProceedToTransaction) {
      onProceedToTransaction(service.id);
    } else {
      console.log(
        'Contract trigger: Target screen AgentTransactionExecutionScreen for service',
        service.id
      );
    }
  };

  const handleRetry = () => {
    setRetryLoading(true);
    setTimeout(() => {
      setRetryLoading(false);
    }, 800);
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
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200">
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
      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200">
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
      <div className="flex-1 overflow-y-auto no-scrollbar px-3.5 py-3 space-y-3 pb-24">
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
              <p className="text-[11px] font-medium text-red-800 mt-0.5 leading-tight">
                This service request has been cancelled and is no longer active.
              </p>
            </div>
          </div>
        )}

        {/* Compact Service Header Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                isDelivery
                  ? 'bg-blue-50 text-[#0052CC] border border-blue-100'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
              }`}
            >
              {isDelivery ? (
                <Truck className="w-4 h-4 stroke-[2]" />
              ) : (
                <ShoppingBag className="w-4 h-4 stroke-[2]" />
              )}
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
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
          <div className="space-y-2.5">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs space-y-3">
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
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
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
              <div className="relative w-full h-56 bg-slate-900 rounded-xl overflow-hidden border border-slate-200/60 flex flex-col justify-between p-3.5">
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
                    fill="#10b981"
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
                    stroke="#10b981"
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
                          ? 'bg-emerald-400 animate-ping'
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

              {/* Delivery Instruction Step Guidance */}
              <div className="flex items-start gap-2 text-[11.5px] text-slate-600 bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                <Info className="w-4 h-4 text-[#0052CC] shrink-0 mt-0.5" />
                <p className="leading-snug">
                  {journeyStep === 'ready'
                    ? 'Tap Start Delivery when you depart from your booth.'
                    : journeyStep === 'en_route'
                    ? 'Navigating to Customer. Tap Arrived once you reach the customer location.'
                    : 'You have arrived. Tap Proceed to Transaction to execute the service.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Pickup Mode: Prominent Customer ETA Card (NO MAP) */}
        {!isDelivery && !isCancelled && (
          <div className="space-y-3">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-extrabold text-[#002244] uppercase tracking-wider">
                    Customer ETA
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Waiting for Customer
                </span>
              </div>

              {service.customerEstimatedArrival ? (
                <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-1">
                  <span className="text-[10.5px] font-bold text-emerald-800 uppercase tracking-wider">
                    Estimated Arrival Time
                  </span>
                  <span className="text-3xl font-black text-emerald-950 font-mono tracking-tight">
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
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-1">
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
                <div className="flex items-center justify-between text-xs py-1 px-1 border-t border-slate-100">
                  <span className="text-slate-500 font-medium">Pickup Timing</span>
                  <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                    {service.timing}
                  </span>
                </div>
              )}

              {/* Helpful inline note */}
              <div className="flex items-start gap-2 text-[11.5px] text-slate-600 bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="leading-snug">
                  Customer will visit your booth to complete the cash pickup. Tap Proceed to Transaction when ready.
                </p>
              </div>

              {/* In-Card Quick Chat Button */}
              <button
                type="button"
                onClick={() => {
                  if (onChatWithCustomer) onChatWithCustomer();
                  else console.log('Contract trigger: Target Screen AgentChatConversationScreen');
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-blue-50/80 hover:bg-blue-100/80 active:bg-blue-200/80 border border-blue-200/80 text-[#0052CC] font-bold text-xs flex items-center justify-center gap-2 transition-colors active:scale-[0.99]"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#0052CC]" />
                <span>Chat with Customer</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Sticky Action Area at Bottom (NO Bottom Navigation Bar on Screen 06) */}
      <div className="px-3.5 py-3 bg-white border-t border-slate-200/90 shadow-lg shrink-0 z-20 space-y-2">
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
              className="w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-700 border border-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 active:scale-[0.99]"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#0052CC]" />
              <span>Chat with Customer</span>
            </button>

            {isDelivery ? (
              journeyStep === 'ready' ? (
                <button
                  onClick={() => setJourneyStep('en_route')}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#0052CC] hover:bg-[#0043A8] active:bg-[#003585] text-white font-extrabold text-xs transition-colors shadow-xs flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Start Delivery</span>
                </button>
              ) : journeyStep === 'en_route' ? (
                <div className="space-y-1.5">
                  <button
                    onClick={() => setJourneyStep('arrived')}
                    className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-extrabold text-xs transition-colors shadow-xs flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Arrived at Customer</span>
                  </button>
                  <p className="text-[10px] text-center text-slate-500 font-medium">
                    Tap when you arrive to unlock Proceed to Transaction
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleProceed}
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-xs transition-colors shadow-xs flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <span>Proceed to Transaction</span>
                  <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              )
            ) : (
              <button
                onClick={handleProceed}
                className="w-full py-3.5 px-4 rounded-xl bg-[#0052CC] hover:bg-[#0043A8] active:bg-[#003585] text-white font-extrabold text-xs transition-colors shadow-xs flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <span>Proceed to Transaction</span>
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </>
        ) : (
          <button
            onClick={onBack}
            className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <span>Back to Home</span>
          </button>
        )}
      </div>
    </div>
  );
};
