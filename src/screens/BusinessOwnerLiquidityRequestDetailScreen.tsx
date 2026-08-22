import React, { useState } from 'react';
import {
  ArrowLeft,
  Building2,
  Banknote,
  Smartphone,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  HandCoins,
  Ban,
  FileText,
  MessageSquare,
  CornerDownLeft,
  Home,
} from 'lucide-react';
import { TellerBudLogo } from '../components/TellerBudLogo';
import {
  BusinessOwnerLiquidityRequestDetail,
  BusinessOwnerLiquidityRequestPreviewState,
  WorkAssignment,
} from '../types';

interface BusinessOwnerLiquidityRequestDetailScreenProps {
  request?: BusinessOwnerLiquidityRequestDetail;
  assignment?: WorkAssignment;
  previewState?: BusinessOwnerLiquidityRequestPreviewState;
  onBack?: () => void;
  onBackToHome?: () => void;
  onRefresh?: () => void;
  onCancelRequest?: (requestId: string) => void;
  onMarkReturned?: (requestId: string, timestamp: string) => void;
}

const defaultAssignment: WorkAssignment = {
  business: 'Apex Retail Group',
  store: 'Central Mall Branch #104',
  booth: 'Booth 03 — Main Atrium',
  location: 'Plot 42, Commercial Avenue, Lusaka',
  agentName: 'Marcus Vance',
  agentId: 'AG-88421',
};

const defaultPendingReviewRequest: BusinessOwnerLiquidityRequestDetail = {
  id: 'BO-201',
  requestReference: 'BO-201',
  requestType: 'cash',
  amount: 'ZMW 200,000.00',
  businessName: 'Apex Retail Group',
  storeName: 'Central Mall Branch #104',
  boothName: 'Booth 03 — Main Atrium',
  reason: 'High morning cash withdrawal demand from walk-in customers.',
  submittedAt: 'Today, 09:15 AM',
  status: 'pending_review',
  canCancel: true,
};

export const BusinessOwnerLiquidityRequestDetailScreen: React.FC<
  BusinessOwnerLiquidityRequestDetailScreenProps
> = ({
  request: customRequest,
  assignment = defaultAssignment,
  previewState = 'pending_review',
  onBack,
  onBackToHome,
  onRefresh,
  onCancelRequest,
  onMarkReturned,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [hasCancelled, setHasCancelled] = useState(false);
  const [isSubmittingReturn, setIsSubmittingReturn] = useState(false);
  const [localStatusOverride, setLocalStatusOverride] = useState<
    'returned' | null
  >(null);
  const [localReturnedAt, setLocalReturnedAt] = useState<string | null>(null);
  const [returnError, setReturnError] = useState<'failed' | 'unconfirmed' | null>(null);

  // Generate deterministic mock request data based on previewState or prop
  const getActiveRequest = (): BusinessOwnerLiquidityRequestDetail => {
    if (customRequest && previewState === 'pending_review' && !hasCancelled && !localStatusOverride) {
      return customRequest;
    }

    if (hasCancelled) {
      return {
        id: customRequest?.id || 'BO-201',
        requestReference: customRequest?.requestReference || 'BO-201',
        requestType: customRequest?.requestType || 'cash',
        amount: customRequest?.amount || 'ZMW 200,000.00',
        businessName: customRequest?.businessName || assignment.business,
        storeName: customRequest?.storeName || assignment.store,
        boothName: customRequest?.boothName || assignment.booth,
        reason: customRequest?.reason || 'High morning cash withdrawal demand from walk-in customers.',
        submittedAt: customRequest?.submittedAt || 'Today, 09:15 AM',
        status: 'cancelled',
        cancelledAt: 'Today, 09:22 AM',
        canCancel: false,
      };
    }

    let baseReq: BusinessOwnerLiquidityRequestDetail;

    switch (previewState) {
      case 'approved':
        baseReq = {
          id: 'BO-201',
          requestReference: 'BO-201',
          requestType: 'cash',
          amount: 'ZMW 200,000.00',
          businessName: assignment.business,
          storeName: assignment.store,
          boothName: assignment.booth,
          reason: 'High morning cash withdrawal demand from walk-in customers.',
          submittedAt: 'Today, 09:15 AM',
          status: 'approved',
          approvedAt: 'Today, 09:30 AM',
          businessOwnerNote: 'Approved. Will bring cash from store vault shortly.',
          updatedByRole: 'Business Owner',
          canCancel: false,
        };
        break;
      case 'rejected':
        baseReq = {
          id: 'BO-194',
          requestReference: 'BO-194',
          requestType: 'cash',
          amount: 'ZMW 350,000.00',
          businessName: assignment.business,
          storeName: assignment.store,
          boothName: assignment.booth,
          reason: 'Midday cash vault replenishment for heavy weekend withdrawals.',
          submittedAt: 'Today, 11:05 AM',
          status: 'rejected',
          rejectedAt: 'Today, 11:18 AM',
          businessOwnerNote: 'Vault limit reached for morning allocation. Please submit a float request instead.',
          updatedByRole: 'Business Owner',
          canCancel: false,
        };
        break;
      case 'pending_payment':
        baseReq = {
          id: 'BO-198',
          requestReference: 'BO-198',
          requestType: 'float',
          amount: 'ZMW 150,000.00',
          businessName: assignment.business,
          storeName: assignment.store,
          boothName: assignment.booth,
          reason: 'Replenishing agent float for MTN and Airtel customer transfers.',
          submittedAt: 'Today, 08:30 AM',
          status: 'pending_payment',
          approvedAt: 'Today, 08:45 AM',
          pendingPaymentAt: 'Today, 09:00 AM',
          businessOwnerNote: 'Bank agent is currently in transit with float crediting token.',
          updatedByRole: 'Business Admin',
          canCancel: false,
        };
        break;
      case 'paid':
        baseReq = {
          id: 'BO-185',
          requestReference: 'BO-185',
          requestType: 'cash',
          amount: 'ZMW 100,000.00',
          amountSupplied: 'ZMW 100,000.00',
          businessName: assignment.business,
          storeName: assignment.store,
          boothName: assignment.booth,
          reason: 'Opening cash buffer for booth start of shift.',
          submittedAt: 'Yesterday, 08:00 AM',
          status: 'paid',
          approvedAt: 'Yesterday, 08:15 AM',
          pendingPaymentAt: 'Yesterday, 08:25 AM',
          paidAt: 'Yesterday, 08:40 AM',
          handoverRecordedAt: 'Yesterday, 08:40 AM',
          businessOwnerNote: 'Cash delivered and verified at booth counter.',
          updatedByRole: 'Business Owner',
          canCancel: false,
        };
        break;
      case 'returned':
        baseReq = {
          id: 'BO-185',
          requestReference: 'BO-185',
          requestType: 'cash',
          amount: 'ZMW 100,000.00',
          amountSupplied: 'ZMW 100,000.00',
          businessName: assignment.business,
          storeName: assignment.store,
          boothName: assignment.booth,
          reason: 'Opening cash buffer for booth start of shift.',
          submittedAt: 'Yesterday, 08:00 AM',
          status: 'returned',
          approvedAt: 'Yesterday, 08:15 AM',
          pendingPaymentAt: 'Yesterday, 08:25 AM',
          paidAt: 'Yesterday, 08:40 AM',
          handoverRecordedAt: 'Yesterday, 08:40 AM',
          returnedAt: 'Yesterday, 05:15 PM',
          returnedByAgent: assignment.agentName || 'Marcus Vance',
          businessOwnerNote: 'Cash delivered and verified at booth counter.',
          updatedByRole: 'Agent',
          canCancel: false,
        };
        break;
      case 'business_admin_confirmed':
        baseReq = {
          id: 'BO-185',
          requestReference: 'BO-185',
          requestType: 'cash',
          amount: 'ZMW 100,000.00',
          amountSupplied: 'ZMW 100,000.00',
          businessName: assignment.business,
          storeName: assignment.store,
          boothName: assignment.booth,
          reason: 'Opening cash buffer for booth start of shift.',
          submittedAt: 'Yesterday, 08:00 AM',
          status: 'business_admin_confirmed',
          approvedAt: 'Yesterday, 08:15 AM',
          pendingPaymentAt: 'Yesterday, 08:25 AM',
          paidAt: 'Yesterday, 08:40 AM',
          handoverRecordedAt: 'Yesterday, 08:40 AM',
          returnedAt: 'Yesterday, 05:15 PM',
          adminConfirmedAt: 'Yesterday, 05:45 PM',
          returnedByAgent: assignment.agentName || 'Marcus Vance',
          confirmedByAdmin: 'Business Admin',
          businessOwnerNote: 'Cash delivered and verified at booth counter.',
          updatedByRole: 'Business Admin',
          canCancel: false,
        };
        break;
      case 'cancelled':
        baseReq = {
          id: 'BO-177',
          requestReference: 'BO-177',
          requestType: 'float',
          amount: 'ZMW 50,000.00',
          businessName: assignment.business,
          storeName: assignment.store,
          boothName: assignment.booth,
          reason: 'Float needed for bill payments.',
          submittedAt: 'Aug 13, 03:10 PM',
          status: 'cancelled',
          cancelledAt: 'Aug 13, 03:18 PM',
          canCancel: false,
        };
        break;
      case 'connection_issue':
        baseReq = {
          id: 'BO-201',
          requestReference: 'BO-201',
          requestType: 'cash',
          amount: 'ZMW 200,000.00',
          businessName: assignment.business,
          storeName: assignment.store,
          boothName: assignment.booth,
          reason: 'High morning cash withdrawal demand from walk-in customers.',
          submittedAt: 'Today, 09:15 AM',
          status: 'pending_review',
          canCancel: true,
        };
        break;
      case 'pending_review':
      default:
        baseReq = customRequest || defaultPendingReviewRequest;
        break;
    }

    // Apply local interactive return if applied
    if (localStatusOverride === 'returned' && baseReq.status === 'paid') {
      return {
        ...baseReq,
        status: 'returned',
        returnedAt: localReturnedAt || 'Today, 05:15 PM',
        returnedByAgent: assignment.agentName || 'Marcus Vance',
        updatedByRole: 'Agent',
      };
    }

    return baseReq;
  };

  const req = getActiveRequest();
  const isConnectionIssue = previewState === 'connection_issue';

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setReturnError(null);
      onRefresh?.();
    }, 600);
  };

  const handleConfirmCancel = () => {
    setShowCancelModal(false);
    setHasCancelled(true);
    onCancelRequest?.(req.id);
  };

  // Agent Records Cash/Float Returned Action
  const handleRecordReturned = () => {
    if (isSubmittingReturn || req.status !== 'paid') {
      return;
    }

    setIsSubmittingReturn(true);
    setReturnError(null);

    const now = new Date();
    const timeStr = `Today, ${now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })}`;

    setTimeout(() => {
      setIsSubmittingReturn(false);
      setLocalStatusOverride('returned');
      setLocalReturnedAt(timeStr);
      onMarkReturned?.(req.id, timeStr);
    }, 350);
  };

  // Render Status Badge & Card Content
  const renderStatusSection = () => {
    switch (req.status) {
      case 'pending_review':
        return (
          <div
            id="status-card-pending-review"
            className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-4 shadow-2xs space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                <span>Pending Review</span>
              </span>
              <span className="text-[11px] font-mono font-semibold text-amber-700">
                #{req.requestReference || req.id}
              </span>
            </div>
            <p className="text-xs text-amber-900 font-medium leading-relaxed">
              Waiting for the Business Owner's decision.
            </p>
          </div>
        );

      case 'approved':
        return (
          <div
            id="status-card-approved"
            className="bg-blue-50/70 border border-blue-200/90 rounded-2xl p-4 shadow-2xs space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />
                <span>Approved</span>
              </span>
              {req.approvedAt && (
                <span className="text-[11px] text-blue-700 font-medium">
                  {req.approvedAt}
                </span>
              )}
            </div>
            <p className="text-xs text-blue-950 font-medium leading-relaxed">
              Your request has been approved. Cash/Float has not yet been supplied.
            </p>
          </div>
        );

      case 'rejected':
        return (
          <div
            id="status-card-rejected"
            className="bg-rose-50/70 border border-rose-200/90 rounded-2xl p-4 shadow-2xs space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                <XCircle className="w-3.5 h-3.5 text-rose-700" />
                <span>Rejected</span>
              </span>
              {req.rejectedAt && (
                <span className="text-[11px] text-rose-700 font-medium">
                  {req.rejectedAt}
                </span>
              )}
            </div>
            <p className="text-xs text-rose-950 font-medium leading-relaxed">
              The Business Owner declined this request.
            </p>
          </div>
        );

      case 'pending_payment':
        return (
          <div
            id="status-card-pending-payment"
            className="bg-indigo-50/70 border border-indigo-200/90 rounded-2xl p-4 shadow-2xs space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                <HandCoins className="w-3.5 h-3.5 text-indigo-700" />
                <span>Pending Payment</span>
              </span>
              {req.pendingPaymentAt && (
                <span className="text-[11px] text-indigo-700 font-medium">
                  {req.pendingPaymentAt}
                </span>
              )}
            </div>
            <p className="text-xs text-indigo-950 font-medium leading-relaxed">
              The Cash/Float handover is being arranged outside TellerBud.
            </p>
          </div>
        );

      case 'paid':
        return (
          <div
            id="status-card-paid"
            className="bg-emerald-50/70 border border-emerald-200/90 rounded-2xl p-4 shadow-2xs space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Paid</span>
              </span>
              {req.handoverRecordedAt && (
                <span className="text-[11px] text-emerald-700 font-medium">
                  {req.handoverRecordedAt}
                </span>
              )}
            </div>
            <p className="text-xs text-emerald-950 font-medium leading-relaxed">
              The Cash/Float handover has been recorded as completed.
            </p>
          </div>
        );

      case 'returned':
        return (
          <div
            id="status-card-returned"
            className="bg-blue-50/70 border border-blue-200/90 rounded-2xl p-4 shadow-2xs space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                <CornerDownLeft className="w-3.5 h-3.5 text-blue-700" />
                <span>Returned</span>
              </span>
              {req.returnedAt && (
                <span className="text-[11px] text-blue-700 font-medium">
                  {req.returnedAt}
                </span>
              )}
            </div>
            <p className="text-xs text-blue-950 font-medium leading-relaxed">
              The Cash/Float return has been recorded and is awaiting confirmation.
            </p>
          </div>
        );

      case 'business_admin_confirmed':
        return (
          <div
            id="status-card-business-admin-confirmed"
            className="bg-emerald-50/70 border border-emerald-200/90 rounded-2xl p-4 shadow-2xs space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Business Admin Confirmed</span>
              </span>
              {req.adminConfirmedAt && (
                <span className="text-[11px] text-emerald-700 font-medium">
                  {req.adminConfirmedAt}
                </span>
              )}
            </div>
            <p className="text-xs text-emerald-950 font-medium leading-relaxed">
              The returned Cash/Float has been confirmed.
            </p>
          </div>
        );

      case 'cancelled':
        return (
          <div
            id="status-card-cancelled"
            className="bg-slate-100 border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-700 border border-slate-300">
                <Ban className="w-3.5 h-3.5 text-slate-600" />
                <span>Cancelled</span>
              </span>
              {req.cancelledAt && (
                <span className="text-[11px] text-slate-600 font-medium">
                  {req.cancelledAt}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              This request was cancelled before completion.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  // Render Status Timeline (State-driven)
  const renderTimeline = () => {
    // Determine stages based on request status
    if (req.status === 'rejected') {
      const steps = [
        {
          key: 'submitted',
          label: 'Request Submitted',
          timestamp: req.submittedAt,
          isCompleted: true,
          isCurrent: false,
        },
        {
          key: 'pending_review',
          label: 'Pending Review',
          timestamp: req.submittedAt,
          isCompleted: true,
          isCurrent: false,
        },
        {
          key: 'rejected',
          label: 'Rejected',
          timestamp: req.rejectedAt || 'Declined by Business Owner',
          isCompleted: true,
          isCurrent: true,
          isDestructive: true,
        },
      ];
      return renderTimelineSteps(steps);
    }

    if (req.status === 'cancelled') {
      const steps = [
        {
          key: 'submitted',
          label: 'Request Submitted',
          timestamp: req.submittedAt,
          isCompleted: true,
          isCurrent: false,
        },
        {
          key: 'cancelled',
          label: 'Cancelled',
          timestamp: req.cancelledAt || 'Cancelled by Agent',
          isCompleted: true,
          isCurrent: true,
          isNeutral: true,
        },
      ];
      return renderTimelineSteps(steps);
    }

    // Standard progression: Submitted -> Pending Review -> Approved -> Pending Payment -> Paid -> Returned -> Business Admin Confirmed
    const isSubmittedCompleted = true;
    const isReviewCompleted = req.status !== 'pending_review';
    const isApprovedCompleted = ['pending_payment', 'paid', 'returned', 'business_admin_confirmed'].includes(req.status);
    const isPendingPaymentCompleted = ['paid', 'returned', 'business_admin_confirmed'].includes(req.status);
    const isPaidCompleted = ['paid', 'returned', 'business_admin_confirmed'].includes(req.status);
    const isReturnedCompleted = ['returned', 'business_admin_confirmed'].includes(req.status);
    const isAdminConfirmedCompleted = req.status === 'business_admin_confirmed';

    const steps = [
      {
        key: 'submitted',
        label: 'Request Submitted',
        timestamp: req.submittedAt,
        isCompleted: isSubmittedCompleted,
        isCurrent: false,
      },
      {
        key: 'pending_review',
        label: 'Pending Review',
        timestamp: req.status === 'pending_review' ? 'In Review' : req.submittedAt,
        isCompleted: isReviewCompleted,
        isCurrent: req.status === 'pending_review',
      },
      {
        key: 'approved',
        label: 'Approved',
        timestamp: req.approvedAt || (isApprovedCompleted ? 'Completed' : 'Waiting for approval'),
        isCompleted: isApprovedCompleted,
        isCurrent: req.status === 'approved',
      },
      {
        key: 'pending_payment',
        label: 'Pending Payment',
        timestamp:
          req.pendingPaymentAt || (isPendingPaymentCompleted ? 'Arranged' : 'Handover arrangement'),
        isCompleted: isPendingPaymentCompleted,
        isCurrent: req.status === 'pending_payment',
      },
      {
        key: 'paid',
        label: 'Paid (Handover Recorded)',
        timestamp:
          req.handoverRecordedAt || req.paidAt || (isPaidCompleted ? 'Handover completed' : 'Awaiting physical handover'),
        isCompleted: isPaidCompleted,
        isCurrent: req.status === 'paid',
      },
    ];

    if (isReturnedCompleted) {
      steps.push({
        key: 'returned',
        label: 'Returned',
        timestamp: req.returnedAt || 'Return recorded',
        isCompleted: isReturnedCompleted,
        isCurrent: req.status === 'returned',
      });
    }

    if (isAdminConfirmedCompleted) {
      steps.push({
        key: 'business_admin_confirmed',
        label: 'Business Admin Confirmed',
        timestamp: req.adminConfirmedAt || 'Return confirmed by Business Admin',
        isCompleted: isAdminConfirmedCompleted,
        isCurrent: req.status === 'business_admin_confirmed',
      });
    }

    return renderTimelineSteps(steps);
  };

  const renderTimelineSteps = (
    steps: Array<{
      key: string;
      label: string;
      timestamp: string;
      isCompleted: boolean;
      isCurrent: boolean;
      isDestructive?: boolean;
      isNeutral?: boolean;
    }>
  ) => {
    return (
      <div className="space-y-3 relative pl-2">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;

          let dotStyle = 'bg-slate-200 border-slate-300 text-slate-400';

          if (step.isDestructive) {
            dotStyle = 'bg-rose-500 border-rose-600 text-white';
          } else if (step.isNeutral) {
            dotStyle = 'bg-slate-500 border-slate-600 text-white';
          } else if (step.isCompleted || step.isCurrent) {
            dotStyle = 'bg-[#0052CC] border-[#0043A8] text-white';
          }

          return (
            <div key={step.key} className="flex items-start gap-3 relative group">
              {/* Timeline Connector Line */}
              {!isLast && (
                <div
                  className={`absolute left-[9px] top-4.5 w-[2px] h-7 -bottom-1 ${
                    step.isCompleted && !step.isDestructive && !step.isNeutral
                      ? 'bg-blue-300'
                      : 'bg-slate-200'
                  }`}
                />
              )}

              {/* Step Marker Dot */}
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[9px] font-bold z-10 shrink-0 mt-0.5 ${dotStyle}`}
              >
                {step.isDestructive ? (
                  <XCircle className="w-3 h-3" />
                ) : step.isNeutral ? (
                  <Ban className="w-2.5 h-2.5" />
                ) : step.isCompleted ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : step.isCurrent ? (
                  <span className="w-2 h-2 rounded-full bg-white" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0 pb-1">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold leading-snug ${
                      step.isCurrent
                        ? 'text-[#002244]'
                        : step.isCompleted
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                  {step.isCurrent && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wide bg-blue-50 text-[#0052CC] border border-blue-200">
                      Current
                    </span>
                  )}
                </div>
                <p
                  className={`text-[11px] leading-tight ${
                    step.isCompleted || step.isCurrent ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  {step.timestamp}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      id="business-owner-liquidity-request-detail-screen"
      className="w-full h-full flex flex-col bg-slate-50 text-slate-800 font-sans overflow-hidden"
    >
      {/* Compact Authenticated Header */}
      <header className="w-full bg-white border-b border-slate-200/90 px-3.5 py-2.5 flex items-center justify-between shrink-0 shadow-xs z-10">
        <div className="flex items-center gap-2.5">
          <button
            id="detail-back-button"
            onClick={onBack}
            className="w-8 h-8 rounded-xl bg-slate-100/80 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
            title="Back to Requests"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-sm font-bold text-[#002244] leading-tight">
              Cash / Float Request
            </h1>
            <p className="text-[10px] text-slate-500 font-medium">
              Ref: <span className="font-mono font-bold text-slate-700">#{req.requestReference || req.id}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <TellerBudLogo size="sm" />
        </div>
      </header>

      {/* Main Body - Natural Vertical Scrolling, No Fixed Bottom Nav */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-3.5 space-y-3.5">
        {/* Connection Issue Banner (if state is connection_issue) */}
        {isConnectionIssue && (
          <div
            id="connection-issue-banner"
            className="bg-red-50 border border-red-200 rounded-2xl p-3 flex items-start gap-2.5 text-red-900 text-xs shadow-2xs animate-in fade-in"
          >
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold">Request status couldn't be refreshed.</p>
              <p className="text-[11px] text-red-700 mt-0.5">
                Displaying last confirmed request details.
              </p>
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-red-100 text-red-900 font-bold text-xs hover:bg-red-200 transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{isRefreshing ? 'Retrying...' : 'Retry'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Return Error / Retry Banner */}
        {returnError && (
          <div
            id="return-error-banner"
            className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-start gap-2.5 text-amber-950 text-xs shadow-2xs animate-in fade-in"
          >
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold">
                {returnError === 'failed' ? 'Unable to record return' : 'Return status not confirmed'}
              </p>
              <p className="text-[11px] text-amber-800 mt-0.5">
                {returnError === 'failed'
                  ? 'Check your connection and try again.'
                  : 'Please check status or retry recording.'}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRecordReturned}
                  disabled={isSubmittingReturn}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-100 text-amber-900 font-bold text-xs hover:bg-amber-200 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${isSubmittingReturn ? 'animate-spin' : ''}`} />
                  <span>Retry</span>
                </button>
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white border border-amber-300 text-amber-900 font-bold text-xs hover:bg-amber-50 transition-colors cursor-pointer"
                >
                  <span>Check Status</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 1. Primary Status Card */}
        {renderStatusSection()}

        {/* 2. Request Summary Card */}
        <div
          id="card-request-summary"
          className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Request Summary
            </span>
            <span className="text-[10px] font-semibold text-slate-400 font-mono">
              #{req.requestReference || req.id}
            </span>
          </div>

          <div className="space-y-2.5">
            {/* Request Type */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Request Type</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-200">
                {req.requestType === 'cash' ? (
                  <Banknote className="w-3.5 h-3.5 text-[#0052CC]" />
                ) : (
                  <Smartphone className="w-3.5 h-3.5 text-[#0052CC]" />
                )}
                <span>{req.requestType} Request</span>
              </span>
            </div>

            {/* Requested Amount */}
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-500 font-medium">Requested Amount</span>
              <span className="text-base font-black text-[#002244] font-mono">
                {req.amount}
              </span>
            </div>

            {/* Actual Amount Supplied (when Paid / Returned / Confirmed) */}
            {req.amountSupplied && ['paid', 'returned', 'business_admin_confirmed'].includes(req.status) && (
              <div className="flex items-baseline justify-between pt-1 border-t border-slate-100">
                <div className="space-y-0.5">
                  <span className="text-xs text-emerald-800 font-bold block">
                    Amount Supplied
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    Physical handover recorded
                  </span>
                </div>
                <span className="text-base font-black text-emerald-700 font-mono">
                  {req.amountSupplied}
                </span>
              </div>
            )}

            {/* Submitted Date / Time */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-100">
              <span className="text-xs text-slate-500 font-medium">Submitted</span>
              <span className="text-xs font-semibold text-slate-700">
                {req.submittedAt}
              </span>
            </div>

            {/* Handover Recorded Date / Time (when Paid / Returned / Confirmed) */}
            {req.handoverRecordedAt && ['paid', 'returned', 'business_admin_confirmed'].includes(req.status) && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-emerald-800 font-semibold">Handover Recorded</span>
                <span className="text-xs font-bold text-emerald-700">
                  {req.handoverRecordedAt}
                </span>
              </div>
            )}

            {/* Returned Date / Time (when Returned or Business Admin Confirmed) */}
            {req.returnedAt && ['returned', 'business_admin_confirmed'].includes(req.status) && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-blue-900 font-semibold">Returned</span>
                <span className="text-xs font-bold text-blue-700">
                  {req.returnedAt}
                </span>
              </div>
            )}

            {/* Business Admin Confirmed Date / Time (when Confirmed) */}
            {req.adminConfirmedAt && req.status === 'business_admin_confirmed' && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-emerald-900 font-semibold">Confirmed</span>
                <span className="text-xs font-bold text-emerald-700">
                  {req.adminConfirmedAt}
                </span>
              </div>
            )}

            {/* Updated By Role (when explicitly provided) */}
            {req.updatedByRole && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Updated by</span>
                <span className="text-xs font-semibold text-slate-700">
                  {req.updatedByRole}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 3. Business Context Card */}
        <div
          id="card-request-context"
          className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2.5"
        >
          <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <Building2 className="w-3.5 h-3.5 text-[#0052CC]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Request Context
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-start justify-between gap-2">
              <span className="text-slate-500 font-medium shrink-0">Business</span>
              <span className="font-bold text-slate-800 text-right">
                {req.businessName || assignment.business}
              </span>
            </div>

            <div className="flex items-start justify-between gap-2">
              <span className="text-slate-500 font-medium shrink-0">Store / Branch</span>
              <span className="font-semibold text-slate-700 text-right">
                {req.storeName || assignment.store}
              </span>
            </div>

            <div className="flex items-start justify-between gap-2">
              <span className="text-slate-500 font-medium shrink-0">Booth</span>
              <span className="font-semibold text-slate-700 text-right">
                {req.boothName || assignment.booth}
              </span>
            </div>
          </div>
        </div>

        {/* 4. Reason / Note (Agent Submitted) */}
        <div
          id="card-request-reason"
          className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2"
        >
          <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <FileText className="w-3.5 h-3.5 text-[#0052CC]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Reason / Note
            </span>
          </div>

          <p className="text-xs text-slate-700 font-normal leading-relaxed whitespace-pre-wrap">
            {req.reason || 'No specific operational reason provided.'}
          </p>
        </div>

        {/* 5. Business Owner Note (Only shown when state provides a note) */}
        {req.businessOwnerNote && (
          <div
            id="card-business-owner-note"
            className="bg-blue-50/50 border border-blue-200/80 rounded-2xl p-4 shadow-2xs space-y-2"
          >
            <div className="flex items-center gap-1.5 border-b border-blue-200/60 pb-2">
              <MessageSquare className="w-3.5 h-3.5 text-[#0052CC]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#002244]">
                Business Owner Note
              </span>
            </div>

            <p className="text-xs text-slate-800 font-medium leading-relaxed whitespace-pre-wrap">
              {req.businessOwnerNote}
            </p>
          </div>
        )}

        {/* 6. Request Progress Timeline */}
        <div
          id="card-request-progress"
          className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Request Progress
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              Audit trail
            </span>
          </div>

          {renderTimeline()}

          {/* Returned Button (Only shown when current request has reached Paid and has not yet been marked Returned) */}
          {req.status === 'paid' && (
            <div className="pt-3 border-t border-slate-100">
              <button
                type="button"
                id="btn-mark-returned"
                onClick={handleRecordReturned}
                disabled={isSubmittingReturn}
                className="w-full min-h-[48px] py-3 px-4 rounded-xl bg-[#0052CC] hover:bg-[#0043A8] active:bg-[#003B94] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-[0.99] disabled:opacity-60"
              >
                {isSubmittingReturn ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Recording Return...</span>
                  </>
                ) : (
                  <>
                    <CornerDownLeft className="w-4 h-4" />
                    <span>Returned</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Check Status Subtle Action (for active in-flight requests) */}
          {['pending_review', 'approved', 'pending_payment', 'returned'].includes(req.status) && (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-500">
                Latest updates appear automatically
              </span>
              <button
                type="button"
                id="btn-check-status"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer active:scale-95"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Check Status</span>
              </button>
            </div>
          )}
        </div>

        {/* 7. Back to Home Action (Only displayed when request status is final Business Admin Confirmed) */}
        {req.status === 'business_admin_confirmed' && (
          <div className="pt-1 pb-4">
            <button
              type="button"
              id="btn-back-to-home"
              onClick={onBackToHome}
              className="w-full min-h-[48px] py-3.5 px-4 rounded-xl bg-[#0052CC] hover:bg-[#0043A8] active:bg-[#003B94] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-[0.99]"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
          </div>
        )}

        {/* 8. Optional Cancel Request (Only shown when canCancel === true) */}
        {req.canCancel && req.status === 'pending_review' && !hasCancelled && (
          <div className="pt-1 text-center">
            <button
              type="button"
              id="btn-cancel-request"
              onClick={() => setShowCancelModal(true)}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 underline py-2 transition-colors cursor-pointer"
            >
              Cancel Request
            </button>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Sheet Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-end sm:items-center justify-center p-3 animate-in fade-in">
          <div className="bg-white rounded-3xl p-5 max-w-xs w-full shadow-2xl space-y-4 animate-in slide-in-from-bottom-4">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Ban className="w-5 h-5" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-sm font-black text-slate-900">Cancel this request?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to cancel your Cash/Float request (#{req.requestReference || req.id}) sent to your Business Owner?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
              >
                Keep Request
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-xs"
              >
                Cancel Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

