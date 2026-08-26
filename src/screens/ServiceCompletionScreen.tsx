import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Clock,
  RefreshCw,
  AlertCircle,
  XCircle,
  ShieldCheck,
  X,
  FileCheck2,
  Receipt,
  Store,
  Calendar,
} from 'lucide-react';
import { TellerBudLogo } from '../components/TellerBudLogo';
import {
  AssignedCustomerService,
  ServiceCompletionPreviewState,
  RecordedTransaction,
} from '../types';
import { PoweredByCinitecFooter } from '../components/PoweredByCinitecFooter';
import { getVendorLogo } from '../config/walkInConfig';
import { normalizeZmwAmount } from '../config/currencyConfig';

interface ServiceCompletionScreenProps {
  initialService?: AssignedCustomerService;
  recordedTransaction?: RecordedTransaction;
  previewState?: ServiceCompletionPreviewState;
  onBack?: () => void;
  onBackToHome?: () => void;
}

const defaultPickupService: AssignedCustomerService = {
  id: 'REQ-9088',
  requestReference: 'REQ-9088',
  requestOrigin: 'Customer',
  customerName: 'John Banda',
  serviceType: 'pickup',
  transactionType: 'Withdrawal',
  vendor: 'MTN',
  amount: 'ZMW 15,000.00',
  location: 'Booth 03 — Main Atrium',
  customerLocation: 'Plot 42, Commercial Avenue, Lusaka',
  agentLocation: 'Booth 03 — Main Atrium',
  booth: 'Booth 03 — Main Atrium',
  timing: 'Scheduled (Within 15 mins)',
  reservationActive: true,
  serviceStatus: 'in_progress',
  reservationFee: 'ZMW 30.00',
  agentEarnings: 'ZMW 30.00',
};

export const ServiceCompletionScreen: React.FC<ServiceCompletionScreenProps> = ({
  initialService,
  recordedTransaction,
  previewState = 'service_completed',
  onBack,
  onBackToHome,
}) => {
  const service = initialService || defaultPickupService;

  // State for Agent and Customer confirmation status
  const [currentStatus, setCurrentStatus] =
    useState<ServiceCompletionPreviewState>(previewState);
  const [showConfirmSheet, setShowConfirmSheet] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  // Sync when external previewState changes
  useEffect(() => {
    setCurrentStatus(previewState);
    setShowConfirmSheet(false);
  }, [previewState]);

  // Derived state calculations
  const isCustomerConfirmed =
    currentStatus === 'customer_confirmed' || currentStatus === 'service_completed';

  const isAgentConfirmed =
    currentStatus === 'agent_confirmed' || currentStatus === 'service_completed';

  const isCompleted = currentStatus === 'service_completed';
  const isCancelled = currentStatus === 'cancelled';
  const isConnectionIssue = currentStatus === 'connection_issue';
  const isStatusUnknown = currentStatus === 'confirmation_status_unknown';

  // Dynamic context attributes
  const effectiveRequestRef =
    service.requestReference || service.id || recordedTransaction?.requestReference || 'REQ-9088';
  const effectiveCustomerName =
    recordedTransaction?.customerName || service.customerName || 'John Banda';
  const effectiveTransactionType =
    recordedTransaction?.transactionType || service.transactionType || 'Withdrawal';
  const effectiveVendor =
    recordedTransaction?.vendor ||
    (service.vendor === 'Apex Supermarket #104' ? 'MTN' : service.vendor || 'MTN');
  const effectiveVendorLogo = getVendorLogo(effectiveVendor);
  const effectiveAmount = normalizeZmwAmount(
    recordedTransaction?.amount || service.amount || '15,000.00'
  );
  const effectiveTxnRef =
    recordedTransaction?.vendorReference ||
    recordedTransaction?.id ||
    (service.requestReference ? `TXN-${service.requestReference}` : 'TXN-849302');
  const effectiveServicePoint =
    service.booth || service.agentLocation || recordedTransaction?.booth || 'Booth 03 — Main Atrium';
  const effectiveTimestamp =
    recordedTransaction?.timestamp || recordedTransaction?.recordedAt || '26 Aug 2026, 01:42 PM';

  // Determine header title
  const getHeaderTitle = () => {
    if (isCompleted) {
      return `${effectiveTransactionType} Completed`;
    }
    if (isCancelled) {
      return 'Service Cancelled';
    }
    if (isConnectionIssue || isStatusUnknown) {
      return 'Status Pending';
    }
    return 'Service in Progress';
  };

  const handleOpenConfirmSheet = () => {
    setShowConfirmSheet(true);
  };

  const handleCloseConfirmSheet = () => {
    setShowConfirmSheet(false);
  };

  const handleConfirmAgentService = () => {
    setShowConfirmSheet(false);
    if (isCustomerConfirmed) {
      setCurrentStatus('service_completed');
    } else {
      setCurrentStatus('agent_confirmed');
    }
  };

  const handleCheckStatus = () => {
    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      // Simulate receiving customer confirmation
      if (currentStatus === 'agent_confirmed') {
        setCurrentStatus('service_completed');
      } else if (currentStatus === 'confirmation_status_unknown') {
        setCurrentStatus('agent_confirmed');
      } else {
        setCurrentStatus('customer_confirmed');
      }
    }, 1000);
  };

  const handleRetry = () => {
    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      setCurrentStatus('waiting_for_both');
    }, 800);
  };

  return (
    <div className="w-full h-full min-h-full bg-slate-50 flex flex-col justify-between text-slate-900 select-none overflow-hidden font-sans relative">
      {/* 1. Header (Compact Authenticated Detail Header) */}
      <header className="px-3.5 pt-3 pb-2.5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between shrink-0 z-10">
        <button
          onClick={onBack}
          aria-label="Back to Safe Context"
          className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
        </button>

        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-900 tracking-tight">
            Service Completion
          </span>
          {effectiveRequestRef && (
            <span className="text-[10px] font-mono text-slate-500 bg-slate-200/70 px-1.5 py-0.5 rounded font-semibold">
              #{effectiveRequestRef}
            </span>
          )}
        </div>

        <TellerBudLogo size="sm" />
      </header>

      {/* 2. Vertically Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-3.5 py-3 space-y-3 pb-3">
        {/* Top Status Banner */}
        {isCompleted ? (
          <div className="bg-emerald-50/90 border border-emerald-200/90 rounded-2xl p-3.5 flex items-center gap-3 shadow-xs">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200/80 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-extrabold text-emerald-950 tracking-tight">
                {getHeaderTitle()}
              </div>
            </div>
          </div>
        ) : isCancelled ? (
          <div className="bg-slate-100 border border-slate-300 rounded-2xl p-3.5 flex items-center gap-3 shadow-xs">
            <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 border border-slate-300 flex items-center justify-center shrink-0">
              <XCircle className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-extrabold text-slate-900 tracking-tight">
                Service cancelled
              </div>
            </div>
          </div>
        ) : isConnectionIssue || isStatusUnknown ? (
          <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-3.5 flex items-center gap-3 shadow-xs">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 border border-amber-200/80 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-extrabold text-amber-950 tracking-tight">
                {isConnectionIssue ? 'Unable to confirm service' : 'Confirmation status pending'}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-blue-50/80 border border-blue-200/80 rounded-2xl p-3.5 flex items-center gap-3 shadow-xs">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#0052CC] border border-blue-200/80 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-extrabold text-[#002244] tracking-tight">
                Service in progress
              </div>
            </div>
          </div>
        )}

        {/* 1. Transaction Summary Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
            <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#002244] tracking-tight">
              <Receipt className="w-3.5 h-3.5 text-[#0052CC]" />
              <span>Transaction Summary</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-bold">
              #{effectiveRequestRef}
            </span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {/* Customer */}
            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Customer</span>
              <span className="font-bold text-slate-900 text-right">
                {effectiveCustomerName}
              </span>
            </div>

            {/* Transaction Type */}
            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Transaction Type</span>
              <span className="font-bold text-slate-900 capitalize">
                {effectiveTransactionType}
              </span>
            </div>

            {/* Vendor */}
            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Vendor</span>
              <div className="flex items-center gap-1.5">
                {effectiveVendorLogo && (
                  <div className="w-4 h-4 rounded bg-white border border-slate-200 p-0.5 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                    <img
                      src={effectiveVendorLogo}
                      alt={effectiveVendor}
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
                <span className="font-bold text-slate-900">
                  {effectiveVendor}
                </span>
              </div>
            </div>

            {/* Amount */}
            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Amount</span>
              <span className="font-extrabold text-[#002244] font-mono text-[13px]">
                {effectiveAmount}
              </span>
            </div>

            {/* Transaction Reference */}
            {effectiveTxnRef && (
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Transaction Reference</span>
                <span className="font-mono font-bold text-slate-700 text-[11px] bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200/60">
                  {effectiveTxnRef}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 2. Status & Confirmation Section */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs space-y-2">
          <div className="text-xs font-extrabold text-[#002244] tracking-tight border-b border-slate-100 pb-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#0052CC]" />
              <span>Status & Confirmation</span>
            </div>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {/* Agent Confirmation */}
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-600 font-medium">Agent Confirmation</span>
              <span
                className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                  isAgentConfirmed
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200/80'
                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {isAgentConfirmed ? 'Confirmed' : 'Not Confirmed'}
              </span>
            </div>

            {/* Customer Confirmation */}
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-600 font-medium">Customer Confirmation</span>
              <span
                className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                  isCustomerConfirmed
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200/80'
                    : 'bg-amber-100/90 text-amber-900 border border-amber-200/80'
                }`}
              >
                {isCustomerConfirmed ? 'Confirmed' : 'Waiting'}
              </span>
            </div>
          </div>

          {/* Contextual Status Sub-Cards for Special States */}
          {currentStatus === 'agent_confirmed' && !isCustomerConfirmed && (
            <div className="bg-blue-50/80 border border-blue-200/80 rounded-xl p-3 space-y-2">
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-blue-100 text-[#0052CC] flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#002244]">
                    Waiting for Customer confirmation
                  </div>
                  <p className="text-[11px] text-slate-600 leading-tight mt-0.5">
                    Your confirmation has been recorded. This service will automatically complete after the remaining required confirmation is received.
                  </p>
                </div>
              </div>

              <div className="pt-0.5 flex justify-end">
                <button
                  onClick={handleCheckStatus}
                  disabled={isChecking}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-[11px] font-extrabold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
                  <span>Check Status</span>
                </button>
              </div>
            </div>
          )}

          {isConnectionIssue && (
            <div className="bg-amber-50/90 border border-amber-200/90 rounded-xl p-3 space-y-2">
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-950">
                    Unable to confirm service
                  </div>
                  <p className="text-[11px] text-amber-800 leading-tight mt-0.5">
                    Check your connection and try again.
                  </p>
                </div>
              </div>

              <div className="pt-0.5 flex justify-end">
                <button
                  onClick={handleRetry}
                  disabled={isChecking}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-[11px] font-extrabold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
                  <span>Retry</span>
                </button>
              </div>
            </div>
          )}

          {isStatusUnknown && (
            <div className="bg-amber-50/90 border border-amber-200/90 rounded-xl p-3 space-y-2">
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-950">
                    Confirmation status not confirmed
                  </div>
                  <p className="text-[11px] text-amber-800 leading-tight mt-0.5">
                    We couldn&apos;t confirm the status of your service confirmation. Check the status before trying again.
                  </p>
                </div>
              </div>

              <div className="pt-0.5 flex justify-end">
                <button
                  onClick={handleCheckStatus}
                  disabled={isChecking}
                  className="px-3 py-1.5 rounded-lg bg-white border border-amber-200/90 text-amber-900 hover:bg-amber-50 text-[11px] font-extrabold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
                  <span>Check Status</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3. Service Record Context Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs space-y-2">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-100">
            Service Record
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Completed At</span>
              </span>
              <span className="font-bold text-slate-800">
                {effectiveTimestamp}
              </span>
            </div>

            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-slate-400" />
                <span>Service Point</span>
              </span>
              <span className="font-bold text-slate-800 text-right max-w-[190px] truncate">
                {effectiveServicePoint}
              </span>
            </div>

            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Service Type</span>
              </span>
              <span className="font-bold text-slate-800 capitalize">
                Pickup Service
              </span>
            </div>
          </div>
        </div>

        <PoweredByCinitecFooter className="py-1" />
      </div>

      {/* 5. Sticky Action Area at Bottom */}
      <div className="px-3.5 py-3 bg-white border-t border-slate-200/90 shadow-lg shrink-0 z-20">
        {isCompleted || isCancelled ? (
          <button
            onClick={onBackToHome}
            className="w-full py-3.5 px-4 rounded-xl font-extrabold text-xs bg-[#0052CC] hover:bg-[#0043A8] active:bg-[#003585] text-white transition-colors shadow-xs flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <span>Done</span>
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        ) : !isAgentConfirmed ? (
          <button
            onClick={handleOpenConfirmSheet}
            disabled={isConnectionIssue}
            className={`w-full py-3.5 px-4 rounded-xl font-extrabold text-xs transition-colors shadow-xs flex items-center justify-center gap-2 active:scale-[0.98] ${
              isConnectionIssue
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-[#0052CC] hover:bg-[#0043A8] active:bg-[#003585] text-white'
            }`}
          >
            <span>Confirm Service</span>
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        ) : (
          <button
            onClick={handleCheckStatus}
            disabled={isChecking}
            className="w-full py-3.5 px-4 rounded-xl font-extrabold text-xs bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-xs flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
            <span>Check Status</span>
          </button>
        )}
      </div>

      {/* 6. Agent Confirmation Bottom Sheet Modal */}
      {showConfirmSheet && (
        <div className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200">
          <div className="bg-white rounded-t-2xl p-4 space-y-4 shadow-2xl border-t border-slate-200 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="text-xs font-extrabold text-[#002244] tracking-tight">
                Confirm service completion?
              </div>
              <button
                onClick={handleCloseConfirmSheet}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-normal">
              Confirm that the transaction and your required service actions are complete.
            </p>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Customer</span>
                <span className="font-bold text-slate-900">
                  {effectiveCustomerName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Transaction Type</span>
                <span className="font-bold text-slate-900 capitalize">
                  {effectiveTransactionType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Vendor</span>
                <span className="font-bold text-slate-900 truncate max-w-[180px]">
                  {effectiveVendor}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Amount</span>
                <span className="font-extrabold text-[#002244] font-mono">
                  {effectiveAmount}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleCloseConfirmSheet}
                className="py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs transition-colors"
              >
                Not Yet
              </button>
              <button
                onClick={handleConfirmAgentService}
                className="py-2.5 px-3 rounded-xl bg-[#0052CC] hover:bg-[#0043A8] text-white font-extrabold text-xs transition-colors shadow-xs"
              >
                Confirm Service
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
