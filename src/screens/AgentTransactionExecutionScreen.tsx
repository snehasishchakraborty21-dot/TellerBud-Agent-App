import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Info,
  RefreshCw,
  ShieldCheck,
  AlertCircle,
  XCircle,
} from 'lucide-react';
import { TellerBudLogo } from '../components/TellerBudLogo';
import {
  AssignedCustomerService,
  TransactionExecutionPreviewState,
  RecordedTransaction,
} from '../types';
import { AndroidPhoneDialler } from '../components/AndroidPhoneDialler';
import { VendorUssdOverlay } from '../components/VendorUssdOverlay';
import { isOutgoingVendorTransferRequired } from '../utils/transactionService';
import { getVendorType } from '../config/walkInConfig';

interface AgentTransactionExecutionScreenProps {
  initialService?: AssignedCustomerService;
  previewState?: TransactionExecutionPreviewState;
  onBack?: () => void;
  onContinueToServiceCompletion?: (
    serviceId: string,
    transactionRecord?: RecordedTransaction
  ) => void;
  onContinueToConfirmation?: (
    serviceId: string,
    transactionRecord?: RecordedTransaction
  ) => void;
}

const defaultPickupWithdrawalService: AssignedCustomerService = {
  id: 'REQ-9088',
  requestReference: 'REQ-9088',
  requestOrigin: 'Customer',
  serviceType: 'pickup',
  transactionType: 'Withdrawal',
  vendorType: 'MNO',
  vendor: 'MTN',
  amount: 'ZK 15,000.00',
  location: 'Booth 03 — Main Atrium',
  customerLocation: 'Plot 42, Commercial Avenue, Ikeja, Lagos',
  agentLocation: 'Booth 03 — Main Atrium',
  booth: 'Booth 03 — Main Atrium',
  timing: 'Scheduled (Within 15 mins)',
  reservationActive: true,
  serviceStatus: 'assigned',
  reservationFee: 'ZK 30.00',
  agentEarnings: 'ZK 30.00',
};

const defaultPickupDepositService: AssignedCustomerService = {
  id: 'REQ-9089',
  requestReference: 'REQ-9089',
  requestOrigin: 'Customer',
  serviceType: 'pickup',
  transactionType: 'Deposit',
  vendorType: 'MNO',
  vendor: 'Airtel',
  amount: 'ZK 15,000.00',
  location: 'Booth 03 — Main Atrium',
  customerLocation: 'Plot 42, Commercial Avenue, Ikeja, Lagos',
  agentLocation: 'Booth 03 — Main Atrium',
  booth: 'Booth 03 — Main Atrium',
  timing: 'Scheduled (Within 15 mins)',
  reservationActive: true,
  serviceStatus: 'assigned',
  reservationFee: 'ZK 30.00',
  agentEarnings: 'ZK 30.00',
};

const defaultDeliveryWithdrawalService: AssignedCustomerService = {
  id: 'REQ-9082',
  requestReference: 'REQ-9082',
  requestOrigin: 'Customer',
  serviceType: 'delivery',
  transactionType: 'Withdrawal',
  vendorType: 'MNO',
  vendor: 'MTN',
  amount: 'ZK 15,000.00',
  location: 'Plot 42, Commercial Avenue, Ikeja, Lagos',
  customerLocation: 'Plot 42, Commercial Avenue, Ikeja, Lagos',
  agentLocation: 'Booth 03 — Main Atrium',
  serviceStatus: 'assigned',
};

const defaultDeliveryDepositService: AssignedCustomerService = {
  id: 'REQ-9084',
  requestReference: 'REQ-9084',
  requestOrigin: 'Customer',
  serviceType: 'delivery',
  transactionType: 'Deposit',
  vendorType: 'MNO',
  vendor: 'MTN',
  amount: 'ZK 15,000.00',
  location: 'Plot 42, Commercial Avenue, Ikeja, Lagos',
  customerLocation: 'Plot 42, Commercial Avenue, Ikeja, Lagos',
  agentLocation: 'Booth 03 — Main Atrium',
  serviceStatus: 'assigned',
};

export const AgentTransactionExecutionScreen: React.FC<
  AgentTransactionExecutionScreenProps
> = ({
  initialService,
  previewState = 'pickup_ready',
  onBack,
  onContinueToServiceCompletion,
  onContinueToConfirmation,
}) => {
  // Derive execution status from previewState
  const getInitialExecutionStatus = () => {
    switch (previewState) {
      case 'dialler':
        return 'dialler';
      case 'ussd_in_progress':
      case 'deposit_ussd_in_progress':
      case 'processing':
        return 'ussd_in_progress';
      case 'ussd_cancelled':
        return 'cancelled';
      case 'ussd_failed':
        return 'failed';
      case 'ussd_result_unknown':
      case 'status_not_confirmed':
        return 'status_not_confirmed';
      case 'transaction_performed':
      case 'withdrawal_performed':
      case 'deposit_performed':
      case 'confirm_transaction':
        return 'performed';
      case 'transaction_recorded':
      case 'withdrawal_recorded':
      case 'deposit_recorded':
      case 'ussd_successful':
        return 'recorded';
      case 'record_failed':
        return 'record_failed';
      case 'connection_issue':
        return 'connection_issue';
      case 'pickup_ready':
      case 'delivery_ready':
      case 'pickup_withdrawal_ready':
      case 'delivery_withdrawal_ready':
      case 'pickup_deposit_ready':
      case 'delivery_deposit_ready':
      default:
        return 'ready';
    }
  };

  const [execStatus, setExecStatus] = useState<
    | 'ready'
    | 'dialler'
    | 'ussd_in_progress'
    | 'performed'
    | 'recorded'
    | 'cancelled'
    | 'failed'
    | 'record_failed'
    | 'status_not_confirmed'
    | 'connection_issue'
  >(getInitialExecutionStatus());

  const [capturedVendorRef, setCapturedVendorRef] = useState<string | undefined>(
    previewState === 'transaction_recorded' ||
      previewState === 'withdrawal_recorded' ||
      previewState === 'deposit_recorded' ||
      previewState === 'deposit_performed' ||
      previewState === 'ussd_successful'
      ? 'MTN-89421098'
      : undefined
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  const [recordedAtTimestamp, setRecordedAtTimestamp] = useState<string>(() => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return `Today, ${timeStr}`;
  });

  // Sync with previewState prop changes from external review controls
  useEffect(() => {
    const nextStatus = getInitialExecutionStatus();
    setExecStatus(nextStatus);
    if (
      previewState === 'transaction_recorded' ||
      previewState === 'withdrawal_recorded' ||
      previewState === 'deposit_recorded' ||
      previewState === 'deposit_performed' ||
      previewState === 'ussd_successful'
    ) {
      setCapturedVendorRef('MTN-89421098');
    }
  }, [previewState]);

  // Derive service object based on route/preview
  const getService = (): AssignedCustomerService => {
    if (initialService) {
      return initialService;
    }
    switch (previewState) {
      case 'pickup_deposit_ready':
      case 'deposit_performed':
        return defaultPickupDepositService;
      case 'delivery_deposit_ready':
      case 'deposit_ussd_in_progress':
      case 'deposit_recorded':
        return defaultDeliveryDepositService;
      case 'pickup_ready':
      case 'pickup_withdrawal_ready':
      case 'withdrawal_performed':
      case 'transaction_performed':
      case 'withdrawal_recorded':
      case 'transaction_recorded':
        return defaultPickupWithdrawalService;
      case 'delivery_ready':
      case 'delivery_withdrawal_ready':
        return defaultDeliveryWithdrawalService;
      default:
        return defaultPickupWithdrawalService;
    }
  };

  const service = getService();
  const isDelivery = service.serviceType === 'delivery';
  const requiresOutgoingUssd = isOutgoingVendorTransferRequired(service.transactionType);

  // Step 1: Perform Transaction CTA
  const handlePerformTransaction = () => {
    if (requiresOutgoingUssd) {
      // For Deposit / Cash In: launch Android Dialler -> USSD
      setExecStatus('dialler');
    } else {
      // For Withdrawal / Cash Out:
      // Customer transfers mobile money to Agent -> Agent hands physical cash to Customer ->
      // NO USSD is required! Transition directly to "Transaction Performed" state.
      setExecStatus('performed');
    }
  };

  // Step 2: From Phone Dialler, tap Call -> Launch USSD Session (Outgoing USSD for Deposit)
  const handleDiallerCall = (_dialledCode: string) => {
    setExecStatus('ussd_in_progress');
  };

  const handleDiallerCancel = () => {
    setExecStatus('ready');
  };

  // Step 3: USSD Event Callbacks
  const handleUssdSuccess = (vendorRef: string) => {
    setCapturedVendorRef(vendorRef || undefined);
    // After USSD success, return to Screen 07 in "Transaction Performed" state
    // The Agent must tap "Confirm Transaction" to record it.
    setExecStatus('performed');
  };

  const handleUssdCancel = () => {
    setExecStatus('cancelled');
  };

  const handleUssdFailure = (_errorMessage?: string) => {
    setExecStatus('failed');
  };

  const handleUssdUnknown = () => {
    setExecStatus('status_not_confirmed');
  };

  // Step 4: Agent taps "Confirm Transaction" in "Transaction Performed" state
  const handleConfirmTransaction = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    const currentTimestamp = `Today, ${timeStr}`;
    setRecordedAtTimestamp(currentTimestamp);

    setTimeout(() => {
      setIsSubmitting(false);
      setExecStatus('recorded');
    }, 400);
  };

  const handleRetryRecord = () => {
    handleConfirmTransaction();
  };

  const handleCheckStatus = () => {
    setIsCheckingStatus(true);
    setTimeout(() => {
      setIsCheckingStatus(false);
      setCapturedVendorRef(
        capturedVendorRef || `${(service.vendor || 'MTN').substring(0, 3).toUpperCase()}-89421098`
      );
      setExecStatus('performed');
    }, 800);
  };

  const handleRetryConnection = () => {
    setIsCheckingStatus(true);
    setTimeout(() => {
      setIsCheckingStatus(false);
      setExecStatus('ready');
    }, 600);
  };

  // Step 5: Agent taps "Continue" in "Transaction Recorded" state -> Navigates to Screen 09
  const handleContinue = () => {
    const txnRecord: RecordedTransaction = {
      id: `TXN-${service.id}`,
      requestReference: service.requestReference || service.id,
      serviceType: service.serviceType,
      transactionType: service.transactionType || 'Withdrawal',
      vendorType: service.vendorType || getVendorType(service.vendor) || 'MNO',
      vendor: service.vendor,
      amount: service.amount,
      location: service.location,
      booth: service.booth || service.agentLocation,
      timestamp: recordedAtTimestamp,
      recordedAt: recordedAtTimestamp,
      vendorReference: capturedVendorRef || undefined,
      serviceFee: service.reservationFee || 'ZK 30.00',
    };

    if (onContinueToServiceCompletion) {
      onContinueToServiceCompletion(service.id, txnRecord);
    } else if (onContinueToConfirmation) {
      // Fallback redirect directly to completion
      onContinueToConfirmation(service.id, txnRecord);
    }
  };

  const canGoBack =
    execStatus === 'ready' ||
    execStatus === 'performed' ||
    execStatus === 'cancelled' ||
    execStatus === 'failed' ||
    execStatus === 'record_failed' ||
    execStatus === 'connection_issue';

  return (
    <div className="w-full h-full min-h-full bg-slate-50 flex flex-col justify-between text-slate-900 select-none overflow-hidden font-sans relative">
      {/* 1. Header (Compact Authenticated Detail Header) */}
      <header className="px-3.5 pt-3 pb-2.5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between shrink-0 z-10">
        <button
          onClick={canGoBack ? onBack : undefined}
          disabled={!canGoBack}
          aria-label="Back to Assigned Service"
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
            canGoBack
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95'
              : 'bg-slate-100/50 text-slate-300 cursor-not-allowed'
          }`}
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
        </button>

        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-900 tracking-tight">
            Transaction
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
      <div className="flex-1 overflow-y-auto no-scrollbar px-3.5 py-3 space-y-3 pb-3">
        {/* Transaction Status Banners */}
        {execStatus === 'performed' ? (
          <div className="bg-blue-50/90 border border-blue-200/90 rounded-xl p-3 flex items-start gap-2.5 shadow-xs">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-[#0052CC] border border-blue-200/60 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-extrabold text-[#002244] tracking-tight">
                Transaction performed
              </div>
              <p className="text-[11px] font-medium text-slate-600 mt-0.5 leading-tight">
                Confirm the transaction to record it in TellerBud.
              </p>
            </div>
          </div>
        ) : execStatus === 'recorded' ? (
          <div className="bg-emerald-50/90 border border-emerald-200/90 rounded-xl p-3 flex items-center gap-2.5 shadow-xs">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200/60 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-extrabold text-[#002244] tracking-tight">
                Transaction recorded
              </div>
              <p className="text-[11px] font-medium text-emerald-800 mt-0.5 leading-tight">
                The transaction has been captured successfully.
              </p>
            </div>
          </div>
        ) : execStatus === 'cancelled' ? (
          <div className="bg-amber-50/90 border border-amber-200/90 rounded-xl p-3 flex items-start gap-2.5 shadow-xs">
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 border border-amber-200/60 flex items-center justify-center shrink-0 mt-0.5">
              <AlertCircle className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-extrabold text-amber-950 tracking-tight">
                Transaction not completed
              </div>
              <p className="text-[11px] font-medium text-amber-800 mt-0.5 leading-tight">
                The Vendor transaction was cancelled.
              </p>
            </div>
          </div>
        ) : execStatus === 'failed' ? (
          <div className="bg-red-50/90 border border-red-200/90 rounded-xl p-3 flex items-start gap-2.5 shadow-xs">
            <div className="w-7 h-7 rounded-lg bg-red-100 text-red-700 border border-red-200/60 flex items-center justify-center shrink-0 mt-0.5">
              <XCircle className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-extrabold text-red-950 tracking-tight">
                Transaction not completed
              </div>
              <p className="text-[11px] font-medium text-red-800 mt-0.5 leading-tight">
                The Vendor transaction was not completed.
              </p>
            </div>
          </div>
        ) : execStatus === 'status_not_confirmed' ? (
          <div className="bg-amber-50/90 border border-amber-200/90 rounded-xl p-3 flex items-start gap-2.5 shadow-xs">
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 border border-amber-200/60 flex items-center justify-center shrink-0 mt-0.5">
              <AlertCircle className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-extrabold text-amber-950 tracking-tight">
                Transaction status not confirmed
              </div>
              <p className="text-[11px] font-medium text-amber-800 mt-0.5 leading-tight">
                We couldn&apos;t confirm the transaction status. Check the status before trying again.
              </p>
            </div>
          </div>
        ) : execStatus === 'record_failed' ? (
          <div className="bg-red-50/90 border border-red-200/90 rounded-xl p-3 flex items-start gap-2.5 shadow-xs">
            <div className="w-7 h-7 rounded-lg bg-red-100 text-red-700 border border-red-200/60 flex items-center justify-center shrink-0 mt-0.5">
              <AlertCircle className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-extrabold text-red-950 tracking-tight">
                Unable to record transaction
              </div>
              <p className="text-[11px] font-medium text-red-800 mt-0.5 leading-tight">
                There was an issue recording the transaction. Try again to record.
              </p>
            </div>
          </div>
        ) : execStatus === 'connection_issue' ? (
          <div className="bg-amber-50/90 border border-amber-200/90 rounded-xl p-3 flex items-start gap-2.5 shadow-xs">
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 border border-amber-200/60 flex items-center justify-center shrink-0 mt-0.5">
              <AlertCircle className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-extrabold text-amber-950 tracking-tight">
                Unable to continue
              </div>
              <p className="text-[11px] font-medium text-amber-800 mt-0.5 leading-tight">
                Check your connection and try again.
              </p>
            </div>
          </div>
        ) : null}

        {/* Read-Only Service Context Summary Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-[#0052CC] text-[10px] font-extrabold uppercase tracking-wider border border-blue-200/60">
              {isDelivery ? 'Delivery Request' : 'Pickup Request'}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Transaction Amount
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <span className="text-2xl font-black text-[#002244] font-mono tracking-tight">
              {service.amount}
            </span>
            <span className="text-[11px] font-medium text-slate-500">
              {isDelivery ? 'Cash Delivery' : 'Cash Pickup'}
            </span>
          </div>
        </div>

        {/* Read-Only Transaction Details Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs space-y-2">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-100">
            Transaction Details
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Service</span>
              <span className="font-bold text-slate-900 capitalize">
                {service.serviceType || 'Pickup'}
              </span>
            </div>

            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Transaction Type</span>
              <span className="font-extrabold text-[#002244] bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                {service.transactionType || 'Withdrawal'}
              </span>
            </div>

            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Vendor Type</span>
              <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                {service.vendorType || getVendorType(service.vendor) || 'MNO'}
              </span>
            </div>

            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Vendor</span>
              <span className="font-bold text-slate-900 text-right max-w-[200px] truncate">
                {service.vendor}
              </span>
            </div>

            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Amount</span>
              <span className="font-extrabold text-[#002244] font-mono">
                {service.amount}
              </span>
            </div>

            {/* Vendor Reference ONLY when externally captured/available */}
            {capturedVendorRef && (
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Vendor Ref</span>
                <span className="font-bold font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                  {capturedVendorRef}
                </span>
              </div>
            )}

            {/* Recorded Time Stamp when recorded */}
            {execStatus === 'recorded' && (
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Recorded Time</span>
                <span className="font-bold text-slate-900 text-[11px]">
                  {recordedAtTimestamp}
                </span>
              </div>
            )}

            {isDelivery ? (
              <div className="py-2 flex items-start justify-between gap-3">
                <span className="text-slate-500 font-medium shrink-0 mt-0.5">
                  Service Location
                </span>
                <span className="font-semibold text-slate-900 text-right leading-tight">
                  {service.location}
                </span>
              </div>
            ) : (
              <>
                {(service.booth || service.agentLocation) && (
                  <div className="py-2 flex items-center justify-between">
                    <span className="text-slate-500 font-medium">
                      Assigned Booth
                    </span>
                    <span className="font-bold text-slate-900">
                      {service.booth || service.agentLocation}
                    </span>
                  </div>
                )}

                {service.timing && (
                  <div className="py-2 flex items-center justify-between">
                    <span className="text-slate-500 font-medium">
                      Pickup Timing
                    </span>
                    <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {service.timing}
                    </span>
                  </div>
                )}

                {service.reservationActive && (
                  <div className="py-2 flex items-center justify-between">
                    <span className="text-slate-500 font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Reservation</span>
                    </span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                      Active
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Subtle Service-Fee Information Strip */}
        <div className="p-2.5 bg-slate-100/80 rounded-xl border border-slate-200/60 flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <p className="text-[10px] text-slate-500 font-medium leading-tight">
            Applicable service fee will be applied automatically.
          </p>
        </div>
      </div>

      {/* 3. Sticky Action Area at Bottom (Single Canonical Screen 07 flow) */}
      <div className="px-3.5 py-3 bg-white border-t border-slate-200/90 shadow-lg shrink-0 z-20">
        {execStatus === 'recorded' ? (
          <button
            onClick={handleContinue}
            className="w-full py-3.5 px-4 rounded-xl bg-[#0052CC] hover:bg-[#0043A8] active:bg-[#003585] text-white font-extrabold text-xs transition-colors shadow-xs flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <span>Continue</span>
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        ) : execStatus === 'performed' ? (
          <button
            onClick={handleConfirmTransaction}
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl bg-[#0052CC] hover:bg-[#0043A8] active:bg-[#003585] text-white font-extrabold text-xs transition-colors shadow-xs flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-75"
          >
            <span>{isSubmitting ? 'Recording Transaction...' : 'Confirm Transaction'}</span>
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        ) : execStatus === 'record_failed' ? (
          <button
            onClick={handleRetryRecord}
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl bg-[#0052CC] hover:bg-[#0043A8] active:bg-[#003585] text-white font-extrabold text-xs transition-colors shadow-xs flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <RefreshCw className={`w-4 h-4 ${isSubmitting ? 'animate-spin' : ''}`} />
            <span>Retry</span>
          </button>
        ) : execStatus === 'status_not_confirmed' ? (
          <button
            onClick={handleCheckStatus}
            disabled={isCheckingStatus}
            className="w-full py-3.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-extrabold text-xs transition-colors shadow-xs flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <RefreshCw className={`w-4 h-4 ${isCheckingStatus ? 'animate-spin' : ''}`} />
            <span>Check Status</span>
          </button>
        ) : execStatus === 'cancelled' || execStatus === 'failed' ? (
          <button
            onClick={handlePerformTransaction}
            className="w-full py-3.5 px-4 rounded-xl bg-[#0052CC] hover:bg-[#0043A8] active:bg-[#003585] text-white font-extrabold text-xs transition-colors shadow-xs flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <span>Try Again</span>
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        ) : execStatus === 'connection_issue' ? (
          <button
            onClick={handleRetryConnection}
            disabled={isCheckingStatus}
            className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-extrabold text-xs transition-colors shadow-xs flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <RefreshCw className={`w-4 h-4 ${isCheckingStatus ? 'animate-spin' : ''}`} />
            <span>Retry</span>
          </button>
        ) : (
          <button
            onClick={handlePerformTransaction}
            className="w-full py-3.5 px-4 rounded-xl bg-[#0052CC] hover:bg-[#0043A8] active:bg-[#003585] text-white font-extrabold text-xs transition-colors shadow-xs flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <span>Perform Transaction</span>
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        )}
      </div>

      {/* 4. VISIBLE Android Phone Dialler (ONLY for transactions requiring outgoing USSD e.g. Deposit) */}
      {execStatus === 'dialler' && requiresOutgoingUssd && (
        <AndroidPhoneDialler
          vendor={service.vendor}
          transactionType={service.transactionType || 'Deposit'}
          amount={service.amount}
          requestRef={service.requestReference || service.id}
          onCall={handleDiallerCall}
          onCancel={handleDiallerCancel}
        />
      )}

      {/* 5. VISIBLE System Android Vendor USSD Session Overlay (ONLY for transactions requiring outgoing USSD e.g. Deposit) */}
      {execStatus === 'ussd_in_progress' && requiresOutgoingUssd && (
        <VendorUssdOverlay
          vendor={service.vendor}
          transactionType={service.transactionType || 'Deposit'}
          amount={service.amount}
          requestRef={service.requestReference || service.id}
          onSuccess={handleUssdSuccess}
          onCancel={handleUssdCancel}
          onFailure={handleUssdFailure}
          onUnknownStatus={handleUssdUnknown}
        />
      )}
    </div>
  );
};
