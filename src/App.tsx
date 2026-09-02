import React, { useState } from 'react';
import { AgentDeviceHomeScreen } from './screens/AgentDeviceHomeScreen';
import { AgentSplashScreen } from './screens/AgentSplashScreen';
import { AgentLoginScreen } from './screens/AgentLoginScreen';
import { AgentAvailabilitySetupScreen } from './screens/AgentAvailabilitySetupScreen';
import { AgentHomeScreen } from './screens/AgentHomeScreen';
import { IncomingCustomerRequestScreen } from './screens/IncomingCustomerRequestScreen';
import { AssignedCustomerServiceScreen } from './screens/AssignedCustomerServiceScreen';
import { ServiceCompletionScreen } from './screens/ServiceCompletionScreen';
import { AgentRequestsScreen } from './screens/AgentRequestsScreen';
import { LiquidityRequestStartScreen } from './screens/LiquidityRequestStartScreen';
import { AgentLiquidityRequestDetailScreen } from './screens/AgentLiquidityRequestDetailScreen';
import { AgentLiquidityExchangeScreen } from './screens/AgentLiquidityExchangeScreen';
import { AgentLiquidityTransactionScreen } from './screens/AgentLiquidityTransactionScreen';
import { AgentLiquidityCompletionScreen } from './screens/AgentLiquidityCompletionScreen';
import { AgentTransactionsScreen } from './screens/AgentTransactionsScreen';
import { AgentMoreScreen } from './screens/AgentMoreScreen';
import { EndOfDayDeclarationScreen } from './screens/EndOfDayDeclarationScreen';
import { AgentAttendanceScreen } from './screens/AgentAttendanceScreen';
import { AgentWalletScreen } from './screens/AgentWalletScreen';
import { AgentProfileScreen } from './screens/AgentProfileScreen';
import { WalkInTransactionScreen } from './screens/WalkInTransactionScreen';
import { AgentLiquidityIncomingDetailScreen } from './screens/AgentLiquidityIncomingDetailScreen';
import { BusinessOwnerLiquidityRequestDetailScreen } from './screens/BusinessOwnerLiquidityRequestDetailScreen';
import { AgentSmsInboxScreen } from './screens/AgentSmsInboxScreen';
import { AgentDailySummaryReportScreen } from './screens/AgentDailySummaryReportScreen';
import { AgentChangePasscodeScreen } from './screens/AgentChangePasscodeScreen';
import { AgentChatsScreen } from './screens/AgentChatsScreen';
import { AgentChatConversationScreen } from './screens/AgentChatConversationScreen';
import { AboutTellerBudScreen } from './screens/AboutTellerBudScreen';
import { BalanceEnquiryScreen } from './screens/BalanceEnquiryScreen';
import { resetPasscodeStore } from './utils/authConfig';
import { MobileContainer } from './components/MobileContainer';
import {
  AuthState,
  AvailabilityPreviewState,
  HomePreviewState,
  RequestDetailPreviewState,
  AssignedServicePreviewState,
  TransactionExecutionPreviewState,
  TransactionConfirmationPreviewState,
  ServiceCompletionPreviewState,
  AgentRequestsPreviewState,
  LiquidityRequestPreviewState,
  AgentLiquidityStatusPreviewState,
  AgentLiquidityExchangePreviewState,
  AgentLiquidityTransactionPreviewState,
  AgentLiquidityCompletionPreviewState,
  AgentTransactionsPreviewState,
  AgentMorePreviewState,
  EndOfDayDeclarationPreviewState,
  AgentAttendancePreviewState,
  AgentWalletPreviewState,
  AgentProfilePreviewState,
  WalkInTransactionPreviewState,
  AgentLiquidityIncomingPreviewState,
  BusinessOwnerLiquidityRequestPreviewState,
  AgentSmsInboxPreviewState,
  AgentDailySummaryReportPreviewState,
  AgentChangePasscodePreviewState,
  AgentChatsPreviewState,
  AgentChatConversationPreviewState,
  AboutTellerBudPreviewState,
  BalanceEnquiryPreviewState,
  AttendanceRecord,
  WalletActivityItem,
  AgentLiquidityRequestDetail,
  BusinessOwnerLiquidityRequestDetail,
  BusinessOwnerRequestItem,
  WorkAssignment,
  AgentAvailabilitySetup,
  IncomingCustomerRequest,
  RecordedTransaction,
  WalkInTransactionRecord,
} from './types';
import {
  createSeedAttendanceRecords,
  createSeedWalletActivities,
  formatAttendanceRecordDate,
  calculateWorkingDuration,
} from './utils/timeUtils';
import { calculateAgentEarningsSummary } from './utils/earningsService';

export default function App() {
  const [testScenario, setTestScenario] = useState<AuthState>('idle');
  const [availabilityPreview, setAvailabilityPreview] =
    useState<AvailabilityPreviewState>('default');
  const [homePreview, setHomePreview] = useState<HomePreviewState>('default');
  const [requestDetailPreview, setRequestDetailPreview] =
    useState<RequestDetailPreviewState>('pickup_request');
  const [assignedServicePreview, setAssignedServicePreview] =
    useState<AssignedServicePreviewState>('pickup_assigned');
  const [transactionExecutionPreview, setTransactionExecutionPreview] =
    useState<TransactionExecutionPreviewState>('pickup_ready');
  const [transactionConfirmationPreview, setTransactionConfirmationPreview] =
    useState<TransactionConfirmationPreviewState>('waiting_for_confirmation');
  const [serviceCompletionPreview, setServiceCompletionPreview] =
    useState<ServiceCompletionPreviewState>('waiting_for_both');
  const [agentRequestsPreview, setAgentRequestsPreview] =
    useState<AgentRequestsPreviewState>('incoming_mixed');
  const [liquidityRequestPreview, setLiquidityRequestPreview] =
    useState<LiquidityRequestPreviewState>('another_agent_cash');
  const [agentLiquidityStatusPreview, setAgentLiquidityStatusPreview] =
    useState<AgentLiquidityStatusPreviewState>('searching_cash');
  const [agentLiquidityExchangePreview, setAgentLiquidityExchangePreview] =
    useState<AgentLiquidityExchangePreviewState>('cash_ready');
  const [agentLiquidityTransactionPreview, setAgentLiquidityTransactionPreview] =
    useState<AgentLiquidityTransactionPreviewState>('cash_ready');
  const [agentLiquidityCompletionPreview, setAgentLiquidityCompletionPreview] =
    useState<AgentLiquidityCompletionPreviewState>('cash_completed');
  const [agentTransactionsPreview, setAgentTransactionsPreview] =
    useState<AgentTransactionsPreviewState>('mixed_transactions');
  const [agentMorePreview, setAgentMorePreview] =
    useState<AgentMorePreviewState>('default');
  const [endOfDayDeclarationPreview, setEndOfDayDeclarationPreview] =
    useState<EndOfDayDeclarationPreviewState>('default');
  const [agentAttendancePreview, setAgentAttendancePreview] =
    useState<AgentAttendancePreviewState>('current_active');
  const [agentWalletPreview, setAgentWalletPreview] =
    useState<AgentWalletPreviewState>('default');
  const [agentProfilePreview, setAgentProfilePreview] =
    useState<AgentProfilePreviewState>('default');
  const [walkInPreview, setWalkInPreview] =
    useState<WalkInTransactionPreviewState>('ready');
  const [agentLiquidityIncomingPreview, setAgentLiquidityIncomingPreview] =
    useState<AgentLiquidityIncomingPreviewState>('incoming_cash');
  const [businessOwnerLiquidityPreview, setBusinessOwnerLiquidityPreview] =
    useState<BusinessOwnerLiquidityRequestPreviewState>('pending_review');
  const [agentSmsInboxPreview, setAgentSmsInboxPreview] =
    useState<AgentSmsInboxPreviewState>('default');
  const [agentDailySummaryReportPreview, setAgentDailySummaryReportPreview] =
    useState<AgentDailySummaryReportPreviewState>('default');
  const [agentChangePasscodePreview, setAgentChangePasscodePreview] =
    useState<AgentChangePasscodePreviewState>('default');
  const [agentChatsPreview, setAgentChatsPreview] =
    useState<AgentChatsPreviewState>('default');
  const [agentChatConversationPreview, setAgentChatConversationPreview] =
    useState<AgentChatConversationPreviewState>('customer_chat_active');
  const [aboutTellerBudPreview, setAboutTellerBudPreview] =
    useState<AboutTellerBudPreviewState>('default');
  const [balanceEnquiryPreview, setBalanceEnquiryPreview] =
    useState<BalanceEnquiryPreviewState>('default');
  const [balanceEnquiryOriginRoute, setBalanceEnquiryOriginRoute] =
    useState<'agent_home' | 'agent_more'>('agent_home');
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [businessOwnerRequests, setBusinessOwnerRequests] = useState<BusinessOwnerRequestItem[]>([
    {
      id: 'BO-201',
      requestType: 'cash',
      amount: '₦200,000.00',
      boothContext: 'Apex Supermarket #104 Booth',
      submittedAt: 'Today, 09:15 AM',
      status: 'pending_review',
      reason: 'High morning cash withdrawal demand from walk-in customers.',
    },
    {
      id: 'BO-198',
      requestType: 'float',
      amount: '₦150,000.00',
      boothContext: 'Ikeja Mall Booth #2',
      submittedAt: 'Today, 08:30 AM',
      status: 'pending_payment',
      reason: 'Replenishing agent float for MTN and Airtel customer transfers.',
    },
    {
      id: 'BO-185',
      requestType: 'cash',
      amount: '₦100,000.00',
      boothContext: 'Apex Supermarket #104 Booth',
      submittedAt: 'Yesterday, 02:00 PM',
      status: 'paid',
      reason: 'Opening cash buffer for booth start of shift.',
      amountSupplied: '₦100,000.00',
      handoverRecordedAt: 'Yesterday, 02:45 PM',
    },
    {
      id: 'BO-172',
      requestType: 'cash',
      amount: '₦120,000.00',
      boothContext: 'Apex Supermarket #104 Booth',
      submittedAt: 'Aug 14, 09:00 AM',
      status: 'returned',
      reason: 'Emergency afternoon float for bill payments.',
      amountSupplied: '₦120,000.00',
      handoverRecordedAt: 'Aug 14, 09:30 AM',
      returnedAt: 'Aug 14, 05:15 PM',
    },
    {
      id: 'BO-165',
      requestType: 'float',
      amount: '₦80,000.00',
      boothContext: 'Central Mall Branch #104',
      submittedAt: 'Aug 13, 08:00 AM',
      status: 'business_admin_confirmed',
      reason: 'Daily float top-up.',
      amountSupplied: '₦80,000.00',
      handoverRecordedAt: 'Aug 13, 08:30 AM',
      returnedAt: 'Aug 13, 05:00 PM',
      adminConfirmedAt: 'Aug 13, 05:30 PM',
    },
  ]);
  const [activeBusinessOwnerRequest, setActiveBusinessOwnerRequest] =
    useState<BusinessOwnerLiquidityRequestDetail | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() =>
    createSeedAttendanceRecords()
  );
  const [walletActivities, setWalletActivities] = useState<WalletActivityItem[]>(() =>
    createSeedWalletActivities()
  );
  const [currentRoute, setCurrentRoute] = useState<
    | 'home_screen'
    | 'splash'
    | 'login'
    | 'work_assignment'
    | 'availability_setup'
    | 'agent_home'
    | 'incoming_customer_request'
    | 'assigned_customer_service'
    | 'transaction_execution'
    | 'transaction_confirmation'
    | 'service_completion'
    | 'requests'
    | 'liquidity_request'
    | 'agent_liquidity_status'
    | 'agent_liquidity_exchange'
    | 'agent_liquidity_transaction'
    | 'agent_liquidity_completion'
    | 'agent_transactions'
    | 'agent_more'
    | 'end_of_day_declaration'
    | 'agent_attendance'
    | 'agent_wallet'
    | 'agent_profile'
    | 'walk_in_transaction'
    | 'incoming_agent_liquidity'
    | 'business_owner_liquidity_detail'
    | 'agent_sms_inbox'
    | 'agent_daily_summary_report'
    | 'agent_change_passcode'
    | 'agent_chats'
    | 'agent_chat_conversation'
    | 'about_tellerbud'
    | 'balance_enquiry'
  >('home_screen');
  const [authenticatedAgentId, setAuthenticatedAgentId] = useState<string>('');
  const [confirmedAssignment, setConfirmedAssignment] = useState<WorkAssignment | null>(null);
  const [savedAvailability, setSavedAvailability] = useState<AgentAvailabilitySetup | null>(null);
  const [focusedCustomerRequest, setFocusedCustomerRequest] = useState<IncomingCustomerRequest | null>(null);
  const [activeRecordedTxn, setActiveRecordedTxn] = useState<RecordedTransaction | null>(null);
  const [activeWalkInTxn, setActiveWalkInTxn] = useState<WalkInTransactionRecord | null>(null);
  const [activeLiquidityRequest, setActiveLiquidityRequest] =
    useState<AgentLiquidityRequestDetail | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<string>(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - 45);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  });

  const handleLaunchTellerBud = () => {
    setCurrentRoute('splash');
  };

  const handleLoginSuccess = (agentId: string) => {
    setAuthenticatedAgentId(agentId);
    const now = new Date();
    setSessionStartTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
    setConfirmedAssignment({
      business: 'Apex Retail Group',
      store: 'Central Mall Branch #104',
      booth: 'Booth 03 — Main Atrium',
      location: 'Lagos, Nigeria',
      agentName: 'Marcus Vance',
      agentId: agentId || 'AG-88421',
    });
    setCurrentRoute('availability_setup');
  };

  const handleSignOut = () => {
    setCurrentRoute('login');
    setTestScenario('idle');
    setAuthenticatedAgentId('');
    setConfirmedAssignment(null);
    setSavedAvailability(null);
    setFocusedCustomerRequest(null);
  };

  const handleResetApp = () => {
    setCurrentRoute('home_screen');
    setTestScenario('idle');
    setAvailabilityPreview('default');
    setHomePreview('default');
    setRequestDetailPreview('pickup_request');
    setAssignedServicePreview('pickup_assigned');
    setTransactionExecutionPreview('pickup_ready');
    setTransactionConfirmationPreview('waiting_for_confirmation');
    setServiceCompletionPreview('waiting_for_both');
    setAgentRequestsPreview('incoming_mixed');
    setLiquidityRequestPreview('another_agent_cash');
    setAgentLiquidityStatusPreview('searching_cash');
    setAgentLiquidityExchangePreview('cash_ready');
    setAgentLiquidityTransactionPreview('cash_ready');
    setAgentLiquidityCompletionPreview('cash_completed');
    setAgentTransactionsPreview('mixed_transactions');
    setAgentMorePreview('default');
    setEndOfDayDeclarationPreview('default');
    setAgentAttendancePreview('current_active');
    setAgentWalletPreview('default');
    setAgentProfilePreview('default');
    setAgentSmsInboxPreview('default');
    setAgentDailySummaryReportPreview('default');
    setAgentChangePasscodePreview('default');
    setAgentChatsPreview('default');
    setAgentChatConversationPreview('customer_chat_active');
    setSelectedConversationId(null);
    resetPasscodeStore();
    setAttendanceRecords(createSeedAttendanceRecords());
    setWalletActivities(createSeedWalletActivities());
    const d = new Date();
    d.setMinutes(d.getMinutes() - 45);
    setSessionStartTime(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
    setActiveLiquidityRequest(null);
    setActiveRecordedTxn(null);
    setAuthenticatedAgentId('');
    setConfirmedAssignment(null);
    setSavedAvailability(null);
    setFocusedCustomerRequest(null);
  };

  return (
    <MobileContainer
      selectedScenario={testScenario}
      onSelectScenario={(state) => {
        setTestScenario(state);
        if (currentRoute !== 'login') {
          setCurrentRoute('login');
        }
      }}
      availabilityPreviewState={availabilityPreview}
      onSelectAvailabilityPreviewState={(state) => {
        setAvailabilityPreview(state);
        if (currentRoute !== 'availability_setup') {
          setCurrentRoute('availability_setup');
        }
      }}
      homePreviewState={homePreview}
      onSelectHomePreviewState={(state) => {
        setHomePreview(state);
        if (currentRoute !== 'agent_home') {
          setCurrentRoute('agent_home');
        }
      }}
      requestDetailPreviewState={requestDetailPreview}
      onSelectRequestDetailPreviewState={(state) => {
        setRequestDetailPreview(state);
        if (currentRoute !== 'incoming_customer_request') {
          setCurrentRoute('incoming_customer_request');
        }
      }}
      assignedServicePreviewState={assignedServicePreview}
      onSelectAssignedServicePreviewState={(state) => {
        setAssignedServicePreview(state);
        if (currentRoute !== 'assigned_customer_service') {
          setCurrentRoute('assigned_customer_service');
        }
      }}
      transactionExecutionPreviewState={transactionExecutionPreview}
      onSelectTransactionExecutionPreviewState={(state) => {
        setTransactionExecutionPreview(state);
        if (currentRoute !== 'transaction_execution') {
          setCurrentRoute('transaction_execution');
        }
      }}
      transactionConfirmationPreviewState={transactionConfirmationPreview}
      onSelectTransactionConfirmationPreviewState={(state) => {
        setTransactionConfirmationPreview(state);
        if (currentRoute !== 'transaction_confirmation') {
          setCurrentRoute('transaction_confirmation');
        }
      }}
      serviceCompletionPreviewState={serviceCompletionPreview}
      onSelectServiceCompletionPreviewState={(state) => {
        setServiceCompletionPreview(state);
        if (currentRoute !== 'service_completion') {
          setCurrentRoute('service_completion');
        }
      }}
      agentRequestsPreviewState={agentRequestsPreview}
      onSelectAgentRequestsPreviewState={(state) => {
        setAgentRequestsPreview(state);
        if (currentRoute !== 'requests') {
          setCurrentRoute('requests');
        }
      }}
      liquidityRequestPreviewState={liquidityRequestPreview}
      onSelectLiquidityRequestPreviewState={(state) => {
        setLiquidityRequestPreview(state);
        if (currentRoute !== 'liquidity_request') {
          setCurrentRoute('liquidity_request');
        }
      }}
      agentLiquidityStatusPreviewState={agentLiquidityStatusPreview}
      onSelectAgentLiquidityStatusPreviewState={(state) => {
        setAgentLiquidityStatusPreview(state);
        if (currentRoute !== 'agent_liquidity_status') {
          setCurrentRoute('agent_liquidity_status');
        }
      }}
      agentLiquidityExchangePreviewState={agentLiquidityExchangePreview}
      onSelectAgentLiquidityExchangePreviewState={(state) => {
        setAgentLiquidityExchangePreview(state);
        if (currentRoute !== 'agent_liquidity_exchange') {
          setCurrentRoute('agent_liquidity_exchange');
        }
      }}
      agentLiquidityTransactionPreviewState={agentLiquidityTransactionPreview}
      onSelectAgentLiquidityTransactionPreviewState={(state) => {
        setAgentLiquidityTransactionPreview(state);
        if (currentRoute !== 'agent_liquidity_transaction') {
          setCurrentRoute('agent_liquidity_transaction');
        }
      }}
      agentLiquidityCompletionPreviewState={agentLiquidityCompletionPreview}
      onSelectAgentLiquidityCompletionPreviewState={(state) => {
        setAgentLiquidityCompletionPreview(state);
        if (currentRoute !== 'agent_liquidity_completion') {
          setCurrentRoute('agent_liquidity_completion');
        }
      }}
      agentTransactionsPreviewState={agentTransactionsPreview}
      onSelectAgentTransactionsPreviewState={(state) => {
        setAgentTransactionsPreview(state);
        if (currentRoute !== 'agent_transactions') {
          setCurrentRoute('agent_transactions');
        }
      }}
      agentMorePreviewState={agentMorePreview}
      onSelectAgentMorePreviewState={(state) => {
        setAgentMorePreview(state);
        if (currentRoute !== 'agent_more') {
          setCurrentRoute('agent_more');
        }
      }}
      endOfDayDeclarationPreviewState={endOfDayDeclarationPreview}
      onSelectEndOfDayDeclarationPreviewState={(state) => {
        setEndOfDayDeclarationPreview(state);
        if (currentRoute !== 'end_of_day_declaration') {
          setCurrentRoute('end_of_day_declaration');
        }
      }}
      agentAttendancePreviewState={agentAttendancePreview}
      onSelectAgentAttendancePreviewState={(state) => {
        setAgentAttendancePreview(state);
        if (currentRoute !== 'agent_attendance') {
          setCurrentRoute('agent_attendance');
        }
      }}
      agentWalletPreviewState={agentWalletPreview}
      onSelectAgentWalletPreviewState={(state) => {
        setAgentWalletPreview(state);
        if (currentRoute !== 'agent_wallet') {
          setCurrentRoute('agent_wallet');
        }
      }}
      agentProfilePreviewState={agentProfilePreview}
      onSelectAgentProfilePreviewState={(state) => {
        setAgentProfilePreview(state);
        if (currentRoute !== 'agent_profile') {
          setCurrentRoute('agent_profile');
        }
      }}
      walkInPreviewState={walkInPreview}
      onSelectWalkInPreviewState={(state) => {
        setWalkInPreview(state);
        if (currentRoute !== 'walk_in_transaction') {
          setCurrentRoute('walk_in_transaction');
        }
      }}
      agentLiquidityIncomingPreviewState={agentLiquidityIncomingPreview}
      onSelectAgentLiquidityIncomingPreviewState={(state) => {
        setAgentLiquidityIncomingPreview(state);
        if (currentRoute !== 'incoming_agent_liquidity') {
          setCurrentRoute('incoming_agent_liquidity');
        }
      }}
      businessOwnerLiquidityPreviewState={businessOwnerLiquidityPreview}
      onSelectBusinessOwnerLiquidityPreviewState={(state) => {
        setBusinessOwnerLiquidityPreview(state);
        if (currentRoute !== 'business_owner_liquidity_detail') {
          setCurrentRoute('business_owner_liquidity_detail');
        }
      }}
      agentSmsInboxPreviewState={agentSmsInboxPreview}
      onSelectAgentSmsInboxPreviewState={(state) => {
        setAgentSmsInboxPreview(state);
        if (currentRoute !== 'agent_sms_inbox') {
          setCurrentRoute('agent_sms_inbox');
        }
      }}
      agentDailySummaryReportPreviewState={agentDailySummaryReportPreview}
      onSelectAgentDailySummaryReportPreviewState={(state) => {
        setAgentDailySummaryReportPreview(state);
        if (currentRoute !== 'agent_daily_summary_report') {
          setCurrentRoute('agent_daily_summary_report');
        }
      }}
      agentChangePasscodePreviewState={agentChangePasscodePreview}
      onSelectAgentChangePasscodePreviewState={(state) => {
        setAgentChangePasscodePreview(state);
        if (currentRoute !== 'agent_change_passcode') {
          setCurrentRoute('agent_change_passcode');
        }
      }}
      agentChatsPreviewState={agentChatsPreview}
      onSelectAgentChatsPreviewState={(state) => {
        setAgentChatsPreview(state);
        if (currentRoute !== 'agent_chats') {
          setCurrentRoute('agent_chats');
        }
      }}
      agentChatConversationPreviewState={agentChatConversationPreview}
      onSelectAgentChatConversationPreviewState={(state) => {
        setAgentChatConversationPreview(state);
        if (currentRoute !== 'agent_chat_conversation') {
          setCurrentRoute('agent_chat_conversation');
        }
      }}
      aboutTellerBudPreviewState={aboutTellerBudPreview}
      onSelectAboutTellerBudPreviewState={(state) => {
        setAboutTellerBudPreview(state);
        if (currentRoute !== 'about_tellerbud') {
          setCurrentRoute('about_tellerbud');
        }
      }}
      balanceEnquiryPreviewState={balanceEnquiryPreview}
      onSelectBalanceEnquiryPreviewState={(state) => {
        setBalanceEnquiryPreview(state);
        if (currentRoute !== 'balance_enquiry') {
          setCurrentRoute('balance_enquiry');
        }
      }}
      onResetApp={handleResetApp}
      currentRoute={currentRoute}
      onSelectRoute={(route) => {
        setCurrentRoute(route);
        if (route !== 'login') {
          setTestScenario('idle');
        }
        if (route !== 'availability_setup') {
          setAvailabilityPreview('default');
        }
        if (route !== 'agent_home') {
          setHomePreview('default');
        }
        if (route !== 'incoming_customer_request') {
          setRequestDetailPreview('pickup_request');
        }
        if (route !== 'assigned_customer_service') {
          setAssignedServicePreview('pickup_assigned');
        }
        if (route !== 'transaction_execution') {
          setTransactionExecutionPreview('pickup_ready');
        }
        if (route !== 'transaction_confirmation') {
          setTransactionConfirmationPreview('waiting_for_confirmation');
        }
        if (route !== 'service_completion') {
          setServiceCompletionPreview('waiting_for_both');
        }
        if (route !== 'requests') {
          setAgentRequestsPreview('incoming_mixed');
        }
        if (route !== 'liquidity_request') {
          setLiquidityRequestPreview('another_agent_cash');
        }
        if (route !== 'agent_liquidity_status') {
          setAgentLiquidityStatusPreview('searching_cash');
        }
        if (route !== 'agent_liquidity_exchange') {
          setAgentLiquidityExchangePreview('cash_ready');
        }
        if (route !== 'agent_liquidity_transaction') {
          setAgentLiquidityTransactionPreview('cash_ready');
        }
        if (route !== 'agent_liquidity_completion') {
          setAgentLiquidityCompletionPreview('cash_completed');
        }
        if (route !== 'agent_transactions') {
          setAgentTransactionsPreview('mixed_transactions');
        }
        if (route !== 'agent_more') {
          setAgentMorePreview('default');
        }
        if (route !== 'end_of_day_declaration') {
          setEndOfDayDeclarationPreview('default');
        }
        if (route !== 'agent_attendance') {
          setAgentAttendancePreview('current_active');
        }
        if (route !== 'agent_wallet') {
          setAgentWalletPreview('default');
        }
        if (route !== 'agent_profile') {
          setAgentProfilePreview('default');
        }
        if (route !== 'walk_in_transaction') {
          setWalkInPreview('ready');
        }
        if (route !== 'incoming_agent_liquidity') {
          setAgentLiquidityIncomingPreview('incoming_cash');
        }
        if (route !== 'agent_sms_inbox') {
          setAgentSmsInboxPreview('default');
        }
        if (route !== 'agent_change_passcode') {
          setAgentChangePasscodePreview('default');
        }
        if (route !== 'agent_chats') {
          setAgentChatsPreview('default');
        }
        if (route !== 'agent_chat_conversation') {
          setAgentChatConversationPreview('customer_chat_active');
        }
        if (route !== 'about_tellerbud') {
          setAboutTellerBudPreview('default');
        }
        if (route !== 'balance_enquiry') {
          setBalanceEnquiryPreview('default');
        }
      }}
    >
      {currentRoute === 'home_screen' ? (
        <AgentDeviceHomeScreen onLaunchTellerBud={handleLaunchTellerBud} />
      ) : currentRoute === 'splash' ? (
        <AgentSplashScreen
          onSplashComplete={() => {
            setCurrentRoute('login');
          }}
        />
      ) : currentRoute === 'login' ? (
        <AgentLoginScreen
          onSuccessNavigate={handleLoginSuccess}
          forcedAuthState={testScenario !== 'idle' ? testScenario : undefined}
        />
      ) : currentRoute === 'availability_setup' ? (
        <AgentAvailabilitySetupScreen
          assignment={
            confirmedAssignment || {
              business: 'Apex Retail Group',
              store: 'Central Mall Branch #104',
              booth: 'Booth 03 — Main Atrium',
              location: 'Lagos, Nigeria',
              agentName: 'Marcus Vance',
              agentId: authenticatedAgentId || 'AG-88421',
            }
          }
          previewState={availabilityPreview}
          initialAvailability={savedAvailability}
          onSaveSuccess={(availability) => {
            setSavedAvailability(availability);
            setCurrentRoute('agent_home');
          }}
        />
      ) : currentRoute === 'agent_home' ? (
        <AgentHomeScreen
          key={homePreview + '_' + (focusedCustomerRequest?.id || '')}
          assignment={
            confirmedAssignment || {
              business: 'Apex Retail Group',
              store: 'Central Mall Branch #104',
              booth: 'Booth 03 — Main Atrium',
              location: 'Lagos, Nigeria',
              agentName: 'Marcus Vance',
              agentId: authenticatedAgentId || 'AG-88421',
            }
          }
          availability={savedAvailability}
          previewState={homePreview}
          activeIncomingRequest={focusedCustomerRequest}
          hasActiveService={homePreview === 'active_service' || homePreview === 'active_service_blocking'}
          onUpdateAvailability={() => {
            setCurrentRoute('availability_setup');
          }}
          onViewRequestDetail={(_requestId) => {
            setRequestDetailPreview('pickup_request');
            setCurrentRoute('incoming_customer_request');
          }}
          onViewServiceDetail={(_serviceId) => {
            setCurrentRoute('assigned_customer_service');
            setAssignedServicePreview('pickup_assigned');
          }}
          onAcceptCustomerRequest={(_request) => {
            setHomePreview('active_service');
            setAssignedServicePreview('pickup_assigned');
            setCurrentRoute('assigned_customer_service');
          }}
          onRejectCustomerRequest={(_requestId) => {
            setFocusedCustomerRequest(null);
            setHomePreview('default');
          }}
          onSelectTab={(tab) => {
            console.log('Selected bottom tab:', tab);
            if (tab === 'home') {
              setCurrentRoute('agent_home');
            } else if (tab === 'requests') {
              setCurrentRoute('requests');
            } else if (tab === 'transactions') {
              setCurrentRoute('agent_transactions');
            } else if (tab === 'more') {
              setCurrentRoute('agent_more');
            }
          }}
          onRequestLiquidity={() => {
            setLiquidityRequestPreview('another_agent_cash');
            setCurrentRoute('liquidity_request');
          }}
          onBalanceEnquiry={() => {
            setBalanceEnquiryOriginRoute('agent_home');
            setBalanceEnquiryPreview('default');
            setCurrentRoute('balance_enquiry');
          }}
          onStartWalkIn={() => {
            setWalkInPreview('ready');
            setCurrentRoute('walk_in_transaction');
          }}
          walletData={{
            balance: 'ZMW 25,000.00',
            currencyCode: 'ZMW',
            currencySymbol: 'ZMW',
          }}
          onViewWalletActivity={() => {
            setCurrentRoute('agent_wallet');
            setAgentWalletPreview('default');
          }}
          onEndWorkdayContinue={() => {
            setCurrentRoute('end_of_day_declaration');
          }}
          onViewActiveService={() => {
            setCurrentRoute('assigned_customer_service');
            setAssignedServicePreview('pickup_assigned');
          }}
        />
      ) : currentRoute === 'incoming_customer_request' ? (
        <IncomingCustomerRequestScreen
          key={requestDetailPreview + '_' + (focusedCustomerRequest?.id || '')}
          request={focusedCustomerRequest || undefined}
          previewState={requestDetailPreview}
          onBack={() => {
            setCurrentRoute('agent_home');
          }}
          onAcceptSuccess={(requestId) => {
            console.log('Customer request accepted:', requestId);
            setHomePreview('active_service');
            setAssignedServicePreview('pickup_assigned');
            setCurrentRoute('assigned_customer_service');
          }}
          onViewAssignedService={(requestId) => {
            console.log('Viewing assigned service after acceptance:', requestId);
            setHomePreview('active_service');
            setAssignedServicePreview('pickup_assigned');
            setCurrentRoute('assigned_customer_service');
          }}
          onRejectSuccess={() => {
            console.log('Customer request rejected');
            setFocusedCustomerRequest(null);
            setHomePreview('default');
            setCurrentRoute('agent_home');
          }}
        />
      ) : currentRoute === 'assigned_customer_service' ? (
        <AssignedCustomerServiceScreen
          key={assignedServicePreview}
          previewState={assignedServicePreview}
          initialService={
            focusedCustomerRequest
              ? {
                  id: focusedCustomerRequest.id,
                  requestReference: focusedCustomerRequest.requestReference || focusedCustomerRequest.id,
                  requestOrigin: 'Customer',
                  customerName: focusedCustomerRequest.customerName,
                  serviceType: focusedCustomerRequest.serviceType,
                  transactionType: focusedCustomerRequest.transactionType || 'Withdrawal',
                  vendorType: focusedCustomerRequest.vendorType || 'MNO',
                  vendor: focusedCustomerRequest.vendor || 'MTN',
                  amount: focusedCustomerRequest.amount,
                  currencySymbol: focusedCustomerRequest.currencySymbol || 'ZMW',
                  currencyCode: focusedCustomerRequest.currencyCode || 'ZMW',
                  location: focusedCustomerRequest.customerLocation || 'Plot 42, Commercial Avenue, Lusaka',
                  customerLocation: focusedCustomerRequest.customerLocation || 'Plot 42, Commercial Avenue, Lusaka',
                  agentLocation: 'Booth 03 — Main Atrium',
                  booth: 'Booth 03 — Main Atrium',
                  distance: focusedCustomerRequest.distance || '4.8 km',
                  estimatedTravelTime: focusedCustomerRequest.estimatedTravelTime || '12 min',
                  customerEstimatedArrival: focusedCustomerRequest.customerEstimatedArrival || '8 min',
                  timing: focusedCustomerRequest.timing || 'Immediate',
                  reservationActive: true,
                  serviceStatus: 'assigned',
                  reservationFee: focusedCustomerRequest.reservationFee || 'ZMW 30.00',
                  deliveryFee: focusedCustomerRequest.deliveryFee,
                  agentEarnings: focusedCustomerRequest.agentEarnings || 'ZMW 30.00',
                }
              : undefined
          }
          onBack={() => {
            setCurrentRoute('agent_home');
          }}
          onCancelService={(serviceId) => {
            console.log('Assigned customer service cancelled:', serviceId);
            setFocusedCustomerRequest(null);
            setActiveRecordedTxn(null);
            setHomePreview('default');
            setCurrentRoute('agent_home');
          }}
          onChatWithCustomer={() => {
            setSelectedConversationId('chat-cust-01');
            setAgentChatConversationPreview('customer_chat_active');
            setCurrentRoute('agent_chat_conversation');
          }}
          onProceed={(_serviceId, transactionRecord) => {
            if (transactionRecord) {
              setActiveRecordedTxn(transactionRecord);
            }
            setServiceCompletionPreview('waiting_for_both');
            setCurrentRoute('service_completion');
          }}
          onProceedToTransaction={(_serviceId, transactionRecord) => {
            if (transactionRecord) {
              setActiveRecordedTxn(transactionRecord);
            }
            setServiceCompletionPreview('waiting_for_both');
            setCurrentRoute('service_completion');
          }}
        />
      ) : currentRoute === 'service_completion' ? (
        <ServiceCompletionScreen
          key={serviceCompletionPreview}
          initialService={
            focusedCustomerRequest
              ? {
                  id: focusedCustomerRequest.id,
                  requestReference:
                    focusedCustomerRequest.requestReference || focusedCustomerRequest.id,
                  requestOrigin: 'Customer',
                  customerName: focusedCustomerRequest.customerName,
                  serviceType: focusedCustomerRequest.serviceType,
                  transactionType: focusedCustomerRequest.transactionType || 'Withdrawal',
                  vendorType: focusedCustomerRequest.vendorType || 'MNO',
                  vendor: focusedCustomerRequest.vendor || 'MTN',
                  amount: focusedCustomerRequest.amount,
                  currencySymbol: focusedCustomerRequest.currencySymbol || 'ZMW',
                  currencyCode: focusedCustomerRequest.currencyCode || 'ZMW',
                  location:
                    focusedCustomerRequest.customerLocation || 'Plot 42, Commercial Avenue, Lusaka',
                  customerLocation:
                    focusedCustomerRequest.customerLocation || 'Plot 42, Commercial Avenue, Lusaka',
                  agentLocation: 'Booth 03 — Main Atrium',
                  booth: 'Booth 03 — Main Atrium',
                  distance: focusedCustomerRequest.distance || '4.8 km',
                  estimatedTravelTime: focusedCustomerRequest.estimatedTravelTime || '12 min',
                  customerEstimatedArrival:
                    focusedCustomerRequest.customerEstimatedArrival || '8 min',
                  timing: focusedCustomerRequest.timing || 'Immediate',
                  reservationActive: true,
                  serviceStatus: 'in_progress',
                  reservationFee: focusedCustomerRequest.reservationFee || 'ZMW 30.00',
                  deliveryFee: focusedCustomerRequest.deliveryFee,
                  agentEarnings: focusedCustomerRequest.agentEarnings || 'ZMW 30.00',
                }
              : undefined
          }
          recordedTransaction={activeRecordedTxn || undefined}
          previewState={serviceCompletionPreview}
          onBack={() => {
            // Safe back navigation: returns to assigned service
            setCurrentRoute('assigned_customer_service');
          }}
          onBackToHome={() => {
            // Complete service workflow: return to Agent Home
            setFocusedCustomerRequest(null);
            setActiveRecordedTxn(null);
            setHomePreview('default');
            setCurrentRoute('agent_home');
          }}
        />
      ) : currentRoute === 'liquidity_request' ? (
        <LiquidityRequestStartScreen
          key={liquidityRequestPreview}
          previewState={liquidityRequestPreview}
          isOffline={savedAvailability?.status === 'offline'}
          assignment={
            confirmedAssignment || {
              business: 'Apex Retail Group',
              store: 'Central Mall Branch #104',
              booth: 'Booth 03 — Main Atrium',
              location: 'Plot 42, Commercial Avenue, Ikeja, Lagos',
              agentName: 'Marcus Vance',
              agentId: authenticatedAgentId || 'AG-88421',
            }
          }
          onBack={() => {
            setCurrentRoute('agent_home');
          }}
          onSubmitSuccess={(data) => {
            console.log('Liquidity request created:', data);
            if (data.requestFrom === 'agent') {
              const now = new Date();
              const timeStr = `Today, ${now.toLocaleTimeString([], {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })}`;
              const newReq: AgentLiquidityRequestDetail = {
                id: 'AL-9042',
                requestReference: 'AL-9042',
                requestType: data.requestType,
                amount: data.amount,
                reason:
                  data.note ||
                  (data.requestType === 'cash'
                    ? 'High morning customer cash withdrawal demand'
                    : 'Replenishing float for transfers'),
                location:
                  confirmedAssignment?.location ||
                  'Plot 42, Commercial Avenue, Ikeja, Lagos',
                booth:
                  confirmedAssignment?.booth ||
                  'Booth 03 — Main Atrium, Central Mall Branch #104',
                submittedAt: timeStr,
                status: 'searching',
                notificationsSent: true,
                responseDeadlineSeconds: 150,
              };
              setActiveLiquidityRequest(newReq);
              setAgentLiquidityStatusPreview(
                data.requestType === 'cash' ? 'searching_cash' : 'searching_float'
              );
              setCurrentRoute('agent_liquidity_status');
            } else {
              const now = new Date();
              const timeStr = `Today, ${now.toLocaleTimeString([], {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })}`;
              const newBOReq: BusinessOwnerLiquidityRequestDetail = {
                id: 'BO-201',
                requestReference: 'BO-201',
                requestType: data.requestType,
                amount: data.amount,
                businessName: confirmedAssignment?.business || 'Apex Retail Group',
                storeName: confirmedAssignment?.store || 'Central Mall Branch #104',
                boothName: confirmedAssignment?.booth || 'Booth 03 — Main Atrium',
                reason:
                  data.note ||
                  (data.requestType === 'cash'
                    ? 'High morning customer cash withdrawal demand'
                    : 'Replenishing float for transfers'),
                submittedAt: timeStr,
                status: 'pending_review',
                canCancel: true,
              };
              setActiveBusinessOwnerRequest(newBOReq);
              setBusinessOwnerLiquidityPreview('pending_review');
              setBusinessOwnerRequests((prev) => [
                {
                  id: newBOReq.id,
                  requestType: newBOReq.requestType,
                  amount: newBOReq.amount,
                  boothContext: `${newBOReq.boothName}`,
                  submittedAt: newBOReq.submittedAt,
                  status: 'pending_review',
                  reason: newBOReq.reason,
                },
                ...prev.filter((r) => r.id !== newBOReq.id),
              ]);
              setCurrentRoute('business_owner_liquidity_detail');
            }
          }}
          onCheckStatus={() => {
            setAgentRequestsPreview('business_owner_requests');
            setCurrentRoute('requests');
          }}
        />
      ) : currentRoute === 'agent_liquidity_status' ? (
        <AgentLiquidityRequestDetailScreen
          key={agentLiquidityStatusPreview}
          previewState={agentLiquidityStatusPreview}
          request={activeLiquidityRequest || undefined}
          onBack={() => {
            setCurrentRoute('requests');
          }}
          onBackToRequests={() => {
            setCurrentRoute('requests');
          }}
          onCreateNewRequest={() => {
            setLiquidityRequestPreview('another_agent_cash');
            setCurrentRoute('liquidity_request');
          }}
          onContinueToExchange={() => {
            setAgentLiquidityExchangePreview(
              activeLiquidityRequest?.requestType === 'float'
                ? 'float_ready'
                : 'cash_ready'
            );
            setCurrentRoute('agent_liquidity_exchange');
          }}
          onRetry={() => {
            console.log('Retrying liquidity request status refresh');
          }}
        />
      ) : currentRoute === 'agent_liquidity_exchange' ? (
        <AgentLiquidityExchangeScreen
          key={agentLiquidityExchangePreview}
          previewState={agentLiquidityExchangePreview}
          request={activeLiquidityRequest || undefined}
          userRole={
            activeLiquidityRequest?.matchedAgent?.agentId ===
            (authenticatedAgentId || 'AG-88421')
              ? 'matched_agent'
              : 'requester'
          }
          currentAgentId={authenticatedAgentId || 'AG-88421'}
          onBack={() => {
            setCurrentRoute('agent_liquidity_status');
          }}
          onBackToRequests={() => {
            setCurrentRoute('requests');
          }}
          onChatWithAgent={() => {
            setSelectedConversationId('chat-agent-01');
            setAgentChatConversationPreview('agent_chat_active');
            setCurrentRoute('agent_chat_conversation');
          }}
          onCancelExchange={() => {
            if (activeLiquidityRequest) {
              setActiveLiquidityRequest({
                ...activeLiquidityRequest,
                status: 'cancelled',
              });
            }
            setCurrentRoute('agent_home');
          }}
          onProceedToTransaction={(exchangeData) => {
            setActiveLiquidityRequest(exchangeData);
            setAgentLiquidityTransactionPreview(
              exchangeData.requestType === 'float' ? 'float_ready' : 'cash_ready'
            );
            setCurrentRoute('agent_liquidity_transaction');
          }}
          onRetry={() => {
            console.log('Retrying liquidity exchange status refresh');
          }}
        />
      ) : currentRoute === 'agent_liquidity_transaction' ? (
        <AgentLiquidityTransactionScreen
          key={agentLiquidityTransactionPreview}
          previewState={agentLiquidityTransactionPreview}
          request={activeLiquidityRequest || undefined}
          onBack={() => {
            setCurrentRoute('agent_liquidity_exchange');
          }}
          onBackToRequests={() => {
            setCurrentRoute('requests');
          }}
          onContinueToCompletion={(transactionData) => {
            const completedData: AgentLiquidityRequestDetail = {
              ...transactionData,
              status: 'completed',
              completedAt: `Today, ${new Date().toLocaleTimeString([], {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })}`,
            };
            setActiveLiquidityRequest(completedData);
            setAgentLiquidityCompletionPreview(
              completedData.requestType === 'float' ? 'float_completed' : 'cash_completed'
            );
            setCurrentRoute('agent_liquidity_completion');
          }}
          onRetry={() => {
            console.log('Retrying liquidity transaction status refresh');
          }}
          onCheckStatus={() => {
            console.log('Checking liquidity transaction status');
            setCurrentRoute('requests');
          }}
        />
      ) : currentRoute === 'agent_liquidity_completion' ? (
        <AgentLiquidityCompletionScreen
          key={agentLiquidityCompletionPreview}
          previewState={agentLiquidityCompletionPreview}
          request={activeLiquidityRequest || undefined}
          onBackToRequests={() => {
            setCurrentRoute('requests');
          }}
          onBackToHome={() => {
            setCurrentRoute('agent_home');
          }}
        />
      ) : currentRoute === 'requests' ? (
        <AgentRequestsScreen
          key={agentRequestsPreview}
          previewState={agentRequestsPreview}
          isOffline={savedAvailability?.status === 'offline'}
          initialSegment={
            activeLiquidityRequest?.status === 'completed'
              ? 'my_requests'
              : undefined
          }
          initialMyRequestsCategory={
            activeLiquidityRequest?.status === 'completed'
              ? 'agent_liquidity'
              : undefined
          }
          myAgentRequests={
            activeLiquidityRequest?.status === 'completed'
              ? [
                  {
                    id: activeLiquidityRequest.id || 'AL-9042',
                    requestType: activeLiquidityRequest.requestType,
                    amount: activeLiquidityRequest.amount,
                    createdAt: activeLiquidityRequest.submittedAt || 'Today, 10:45 AM',
                    status: 'completed',
                    matchedAgentName:
                      activeLiquidityRequest.matchedAgent?.name || 'Agent Michael A.',
                  },
                  {
                    id: 'MAL-501',
                    requestType: 'float',
                    amount: '₦75,000.00',
                    createdAt: 'Today, 11:20 AM',
                    status: 'searching',
                  },
                  {
                    id: 'MAL-492',
                    requestType: 'cash',
                    amount: '₦30,000.00',
                    createdAt: 'Yesterday, 04:15 PM',
                    status: 'completed',
                    matchedAgentName: 'Agent Michael A.',
                  },
                ]
              : undefined
          }
          businessOwnerRequests={businessOwnerRequests}
          onSelectTab={(tab) => {
            if (tab === 'home') {
              setCurrentRoute('agent_home');
            } else if (tab === 'requests') {
              setCurrentRoute('requests');
            } else if (tab === 'transactions') {
              setCurrentRoute('agent_transactions');
            } else if (tab === 'more') {
              setCurrentRoute('agent_more');
            }
          }}
          onViewCustomerRequest={(requestId) => {
            const customerReqs: IncomingCustomerRequest[] = [
              {
                id: 'REQ-9088',
                requestReference: 'REQ-9088',
                requestOrigin: 'Customer',
                serviceType: 'pickup',
                transactionType: 'Withdrawal',
                vendor: 'Airtel',
                amount: 'ZMW 15,000.00',
                location: 'Booth 03 — Main Atrium',
                agentLocation: 'Booth 03 — Main Atrium',
                timing: 'Scheduled (Within 15 mins)',
                expiresAtSeconds: 90,
                reservationFee: 'ZMW 30.00',
                agentEarnings: 'ZMW 30.00',
              },
              {
                id: 'REQ-8812',
                requestReference: 'REQ-8812',
                requestOrigin: 'Customer',
                serviceType: 'pickup',
                transactionType: 'Withdrawal',
                vendor: 'MTN',
                amount: 'ZMW 25,000.00',
                location: 'Booth 03 — Main Atrium',
                agentLocation: 'Booth 03 — Main Atrium',
                customerEstimatedArrival: '12 min',
                timing: 'Express Cash Pickup',
                expiresAtSeconds: 120,
                reservationFee: 'ZMW 30.00',
                agentEarnings: 'ZMW 30.00',
              },
            ];
            const found = customerReqs.find((r) => r.id === requestId);
            if (found) {
              setFocusedCustomerRequest(found);
              setRequestDetailPreview('pickup_request');
            } else {
              setRequestDetailPreview('pickup_request');
            }
            setCurrentRoute('incoming_customer_request');
          }}
          onViewAgentLiquidityRequest={(requestId) => {
            console.log('View incoming agent liquidity request:', requestId);
            if (requestId === 'AL-1008') {
              setAgentLiquidityIncomingPreview('incoming_float');
            } else {
              setAgentLiquidityIncomingPreview('incoming_cash');
            }
            setCurrentRoute('incoming_agent_liquidity');
          }}
          onViewMyAgentLiquidityRequest={(requestId) => {
            console.log('View my agent liquidity request:', requestId);
            setAgentLiquidityStatusPreview('searching_cash');
            setCurrentRoute('agent_liquidity_status');
          }}
          onViewBusinessOwnerRequest={(requestId) => {
            console.log('View business owner request:', requestId);
            const matching = businessOwnerRequests.find((r) => r.id === requestId);
            const detail: BusinessOwnerLiquidityRequestDetail = {
              id: requestId,
              requestReference: requestId,
              requestType: matching?.requestType || (requestId === 'BO-198' || requestId === 'BO-165' ? 'float' : 'cash'),
              amount:
                matching?.amount ||
                (requestId === 'BO-198'
                  ? '₦150,000.00'
                  : requestId === 'BO-185'
                  ? '₦100,000.00'
                  : requestId === 'BO-172'
                  ? '₦120,000.00'
                  : requestId === 'BO-165'
                  ? '₦80,000.00'
                  : '₦200,000.00'),
              businessName: confirmedAssignment?.business || 'Apex Retail Group',
              storeName: confirmedAssignment?.store || 'Central Mall Branch #104',
              boothName: confirmedAssignment?.booth || 'Booth 03 — Main Atrium',
              reason:
                matching?.reason ||
                (requestId === 'BO-198'
                  ? 'Replenishing agent float for MTN and Airtel customer transfers.'
                  : requestId === 'BO-185'
                  ? 'Opening cash buffer for booth start of shift.'
                  : requestId === 'BO-172'
                  ? 'Emergency afternoon float for bill payments.'
                  : requestId === 'BO-165'
                  ? 'Daily float top-up.'
                  : 'High morning cash withdrawal demand from walk-in customers.'),
              submittedAt:
                matching?.submittedAt ||
                (requestId === 'BO-185'
                  ? 'Yesterday, 02:00 PM'
                  : requestId === 'BO-172'
                  ? 'Aug 14, 09:00 AM'
                  : requestId === 'BO-165'
                  ? 'Aug 13, 08:00 AM'
                  : 'Today, 09:15 AM'),
              status:
                matching?.status ||
                (requestId === 'BO-198'
                  ? 'pending_payment'
                  : requestId === 'BO-185'
                  ? 'paid'
                  : requestId === 'BO-172'
                  ? 'returned'
                  : requestId === 'BO-165'
                  ? 'business_admin_confirmed'
                  : 'pending_review'),
              amountSupplied:
                matching?.amountSupplied ||
                (requestId === 'BO-185'
                  ? '₦100,000.00'
                  : requestId === 'BO-172'
                  ? '₦120,000.00'
                  : requestId === 'BO-165'
                  ? '₦80,000.00'
                  : undefined),
              handoverRecordedAt:
                matching?.handoverRecordedAt ||
                (requestId === 'BO-185'
                  ? 'Yesterday, 02:45 PM'
                  : requestId === 'BO-172'
                  ? 'Aug 14, 09:30 AM'
                  : requestId === 'BO-165'
                  ? 'Aug 13, 08:30 AM'
                  : undefined),
              returnedAt:
                matching?.returnedAt ||
                (requestId === 'BO-172'
                  ? 'Aug 14, 05:15 PM'
                  : requestId === 'BO-165'
                  ? 'Aug 13, 05:00 PM'
                  : undefined),
              adminConfirmedAt:
                matching?.adminConfirmedAt ||
                (requestId === 'BO-165' ? 'Aug 13, 05:30 PM' : undefined),
              businessOwnerNote:
                requestId === 'BO-185'
                  ? 'Cash delivered and verified at booth counter.'
                  : requestId === 'BO-198'
                  ? 'Bank agent is currently in transit with float crediting token.'
                  : requestId === 'BO-172'
                  ? 'Cash returned to store safe at end of shift.'
                  : requestId === 'BO-165'
                  ? 'Float reconciliation confirmed and audited by Store Admin.'
                  : undefined,
              canCancel: matching?.status === 'pending_review',
            };
            setActiveBusinessOwnerRequest(detail);
            setBusinessOwnerLiquidityPreview(
              detail.status as BusinessOwnerLiquidityRequestPreviewState
            );
            setCurrentRoute('business_owner_liquidity_detail');
          }}
          onRequestLiquidity={() => {
            setLiquidityRequestPreview('another_agent_cash');
            setCurrentRoute('liquidity_request');
          }}
        />
      ) : currentRoute === 'agent_transactions' ? (
        <AgentTransactionsScreen
          key={agentTransactionsPreview}
          previewState={agentTransactionsPreview}
          completedCustomerTxn={activeRecordedTxn}
          completedLiquidityRequest={activeLiquidityRequest}
          completedWalkInTxn={activeWalkInTxn}
          onSelectTab={(tab) => {
            if (tab === 'home') {
              setCurrentRoute('agent_home');
            } else if (tab === 'requests') {
              setCurrentRoute('requests');
            } else if (tab === 'transactions') {
              setCurrentRoute('agent_transactions');
            } else if (tab === 'more') {
              setCurrentRoute('agent_more');
            }
          }}
          onViewTransactionDetail={(txnId) => {
            console.log('Contract trigger: Future target Screen AgentTransactionDetailScreen for', txnId);
          }}
          onRetry={() => {
            console.log('Retrying transactions refresh');
          }}
        />
      ) : currentRoute === 'agent_more' ? (
        <AgentMoreScreen
          key={agentMorePreview}
          previewState={agentMorePreview}
          assignment={
            confirmedAssignment || {
              business: 'Apex Retail Group',
              store: 'Central Mall Branch #104',
              booth: 'Booth 03 — Main Atrium',
              location: 'Lagos, Nigeria',
              agentName: 'Marcus Vance',
              agentId: authenticatedAgentId || 'AG-88421',
            }
          }
          availability={savedAvailability}
          walletData={{
            balance: 'ZMW 25,000.00',
            currencyCode: 'ZMW',
            currencySymbol: 'ZMW',
          }}
          sessionStartTime={sessionStartTime}
          earnings={calculateAgentEarningsSummary([
            activeRecordedTxn,
            activeWalkInTxn,
          ])}
          onSelectTab={(tab) => {
            if (tab === 'home') {
              setCurrentRoute('agent_home');
            } else if (tab === 'requests') {
              setCurrentRoute('requests');
            } else if (tab === 'transactions') {
              setCurrentRoute('agent_transactions');
            } else if (tab === 'more') {
              setCurrentRoute('agent_more');
            }
          }}
          onUpdateAvailability={() => {
            setCurrentRoute('availability_setup');
          }}
          onViewProfile={() => {
            setCurrentRoute('agent_profile');
            setAgentProfilePreview('default');
          }}
          onViewWallet={() => {
            setCurrentRoute('agent_wallet');
            setAgentWalletPreview('default');
          }}
          onViewAttendance={() => {
            setCurrentRoute('agent_attendance');
          }}
          onViewChats={() => {
            setCurrentRoute('agent_chats');
            setAgentChatsPreview('default');
          }}
          onViewSmsInbox={() => {
            setCurrentRoute('agent_sms_inbox');
            setAgentSmsInboxPreview('default');
          }}
          onViewDailySummary={() => {
            setCurrentRoute('agent_daily_summary_report');
            setAgentDailySummaryReportPreview('default');
          }}
          onViewChangePasscode={() => {
            setCurrentRoute('agent_change_passcode');
            setAgentChangePasscodePreview('default');
          }}
          onOpenBalanceEnquiry={() => {
            setBalanceEnquiryOriginRoute('agent_more');
            setBalanceEnquiryPreview('default');
            setCurrentRoute('balance_enquiry');
          }}
          onViewAbout={() => {
            setCurrentRoute('about_tellerbud');
            setAboutTellerBudPreview('default');
          }}
        />
      ) : currentRoute === 'end_of_day_declaration' ? (
        <EndOfDayDeclarationScreen
          key={endOfDayDeclarationPreview}
          previewState={endOfDayDeclarationPreview}
          assignment={
            confirmedAssignment || {
              business: 'Apex Retail Group',
              store: 'Central Mall Branch #104',
              booth: 'Booth 03 — Main Atrium',
              location: 'Lagos, Nigeria',
              agentName: 'Marcus Vance',
              agentId: authenticatedAgentId || 'AG-88421',
            }
          }
          sessionStartTime={sessionStartTime}
          onBack={() => {
            setCurrentRoute('agent_home');
          }}
          onSubmitSuccess={(record) => {
            console.log('End-of-day declaration recorded:', record);
            const now = new Date();
            const dateInfo = formatAttendanceRecordDate(now);
            const start = record.sessionStartedAt || sessionStartTime;
            const end = record.sessionEndedAt;
            const duration = record.workDuration || calculateWorkingDuration(start, end);

            const newRecord: AttendanceRecord = {
              id: `att-rec-${Date.now()}`,
              rawDate: now.toISOString(),
              date: dateInfo.dateLabel,
              dateGroup: dateInfo.dateGroup,
              booth: record.booth || confirmedAssignment?.booth || 'Booth 03 — Main Atrium',
              store: record.store || confirmedAssignment?.store || 'Central Mall Branch #104',
              business: record.business || confirmedAssignment?.business || 'Apex Retail Group',
              loginTime: sessionStartTime,
              sessionStart: start,
              sessionEnd: end,
              workDuration: duration,
              status: 'completed',
              declarationStatus: 'completed',
            };
            setAttendanceRecords((prev) => [newRecord, ...prev]);
          }}
          onReturnToSignIn={() => {
            setAuthenticatedAgentId('');
            setConfirmedAssignment(null);
            setSavedAvailability(null);
            setActiveRecordedTxn(null);
            setActiveLiquidityRequest(null);
            setCurrentRoute('login');
          }}
        />
      ) : currentRoute === 'agent_attendance' ? (
        <AgentAttendanceScreen
          key={agentAttendancePreview}
          previewState={agentAttendancePreview}
          assignment={
            confirmedAssignment || {
              business: 'Apex Retail Group',
              store: 'Central Mall Branch #104',
              booth: 'Booth 03 — Main Atrium',
              location: 'Lagos, Nigeria',
              agentName: 'Marcus Vance',
              agentId: authenticatedAgentId || 'AG-88421',
            }
          }
          sessionStartTime={sessionStartTime}
          loginTime={sessionStartTime}
          hasActiveSession={Boolean(authenticatedAgentId || confirmedAssignment || true)}
          historyRecords={attendanceRecords}
          onBack={() => {
            setCurrentRoute('agent_more');
          }}
        />
      ) : currentRoute === 'agent_wallet' ? (
        <AgentWalletScreen
          key={agentWalletPreview}
          previewState={agentWalletPreview}
          balance="ZMW 25,000.00"
          currencySymbol="ZMW"
          activities={walletActivities}
          onBack={() => {
            setCurrentRoute('agent_more');
          }}
        />
      ) : currentRoute === 'agent_profile' ? (
        <AgentProfileScreen
          key={agentProfilePreview}
          previewState={agentProfilePreview}
          assignment={
            confirmedAssignment || {
              business: 'Apex Retail Group',
              store: 'Central Mall Branch #104',
              booth: 'Booth 03 — Main Atrium',
              location: 'Lagos, Nigeria',
              agentName: 'Marcus Vance',
              agentId: authenticatedAgentId || 'AG-88421',
            }
          }
          availability={savedAvailability}
          accountStatus="Active"
          sessionStartTime={sessionStartTime}
          onBack={() => {
            setCurrentRoute('agent_more');
          }}
        />
      ) : currentRoute === 'walk_in_transaction' ? (
        <WalkInTransactionScreen
          key={walkInPreview}
          previewState={walkInPreview}
          assignment={
            confirmedAssignment || {
              business: 'Apex Retail Group',
              store: 'Central Mall Branch #104',
              booth: 'Booth 03 — Main Atrium',
              location: 'Lagos, Nigeria',
              agentName: 'Marcus Vance',
              agentId: authenticatedAgentId || 'AG-88421',
            }
          }
          currencySymbol="ZMW"
          onBack={() => {
            setCurrentRoute('agent_home');
          }}
          onTransactionRecorded={(record) => {
            console.log('Walk-In Transaction recorded:', record);
            setActiveWalkInTxn(record);

            // Append service fee wallet activity if applicable
            const now = new Date();
            const timeStr = now.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            });
            const newFeeActivity: WalletActivityItem = {
              id: `wf-act-${Date.now()}`,
              type: 'service_fee',
              title: `${record.transactionType} Fee`,
              amount: `- ${record.serviceFee || 'ZMW 15.00'}`,
              numericAmount: 15,
              currencySymbol: 'ZMW',
              context: `Walk-In • ${record.transactionType}`,
              subContext: record.vendor ? `${record.vendor} Service` : 'Booth Service',
              reference: `#${record.transactionReference}`,
              status: 'Applied',
              timestamp: timeStr,
              date: 'Today, Aug 15',
              rawDate: now,
              dateGroup: 'today',
            };
            setWalletActivities((prev) => [newFeeActivity, ...prev]);
          }}
        />
      ) : currentRoute === 'incoming_agent_liquidity' ? (
        <AgentLiquidityIncomingDetailScreen
          key={agentLiquidityIncomingPreview}
          previewState={agentLiquidityIncomingPreview}
          request={activeLiquidityRequest || undefined}
          assignment={
            confirmedAssignment || {
              business: 'Apex Retail Group',
              store: 'Central Mall Branch #104',
              booth: 'Booth 03 — Main Atrium',
              location: 'Plot 42, Commercial Avenue, Ikeja, Lagos',
              agentName: 'Marcus Vance',
              agentId: authenticatedAgentId || 'AG-88421',
            }
          }
          currentAgentId={authenticatedAgentId || 'AG-88421'}
          onBack={() => {
            setCurrentRoute('requests');
          }}
          onBackToRequests={() => {
            setCurrentRoute('requests');
          }}
          onAcceptSuccess={(matchedRequest) => {
            console.log('Accepted liquidity request:', matchedRequest);
            setActiveLiquidityRequest(matchedRequest);
            setAgentLiquidityExchangePreview(
              matchedRequest.requestType === 'float' ? 'float_ready' : 'cash_ready'
            );
            setCurrentRoute('agent_liquidity_exchange');
          }}
          onRejectSuccess={(reqId) => {
            console.log('Rejected liquidity request:', reqId);
            setCurrentRoute('requests');
          }}
          onRetry={() => {
            console.log('Retrying incoming liquidity request refresh');
          }}
        />
      ) : currentRoute === 'business_owner_liquidity_detail' ? (
        <BusinessOwnerLiquidityRequestDetailScreen
          key={businessOwnerLiquidityPreview}
          previewState={businessOwnerLiquidityPreview}
          request={activeBusinessOwnerRequest || undefined}
          assignment={
            confirmedAssignment || {
              business: 'Apex Retail Group',
              store: 'Central Mall Branch #104',
              booth: 'Booth 03 — Main Atrium',
              location: 'Plot 42, Commercial Avenue, Ikeja, Lagos',
              agentName: 'Marcus Vance',
              agentId: authenticatedAgentId || 'AG-88421',
            }
          }
          onBack={() => {
            setAgentRequestsPreview('business_owner_requests');
            setCurrentRoute('requests');
          }}
          onBackToHome={() => {
            setCurrentRoute('agent_home');
          }}
          onRefresh={() => {
            console.log('Refreshing business owner request status');
          }}
          onCancelRequest={(reqId) => {
            console.log('Cancelled business owner request:', reqId);
            setBusinessOwnerRequests((prev) =>
              prev.map((r) => (r.id === reqId ? { ...r, status: 'cancelled' } : r))
            );
            if (activeBusinessOwnerRequest) {
              setActiveBusinessOwnerRequest({
                ...activeBusinessOwnerRequest,
                status: 'cancelled',
                cancelledAt: 'Today, 09:22 AM',
              });
            }
          }}
          onMarkReturned={(reqId, timestamp) => {
            console.log('Marked business owner request returned:', reqId);
            const time =
              timestamp ||
              `Today, ${new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}`;
            setBusinessOwnerRequests((prev) =>
              prev.map((r) =>
                r.id === reqId ? { ...r, status: 'returned', returnedAt: time } : r
              )
            );
            if (activeBusinessOwnerRequest && activeBusinessOwnerRequest.id === reqId) {
              setActiveBusinessOwnerRequest({
                ...activeBusinessOwnerRequest,
                status: 'returned',
                returnedAt: time,
              });
            }
            setBusinessOwnerLiquidityPreview('returned');
          }}
        />
      ) : currentRoute === 'agent_sms_inbox' ? (
        <AgentSmsInboxScreen
          key={agentSmsInboxPreview}
          previewState={agentSmsInboxPreview}
          onBack={() => {
            setCurrentRoute('agent_more');
          }}
        />
      ) : currentRoute === 'agent_change_passcode' ? (
        <AgentChangePasscodeScreen
          key={agentChangePasscodePreview}
          previewState={agentChangePasscodePreview}
          agentId={authenticatedAgentId || 'AG-88421'}
          onBackToMore={() => {
            setCurrentRoute('agent_more');
          }}
          onSuccess={() => {
            console.log('Agent passcode updated successfully');
          }}
        />
      ) : currentRoute === 'agent_chats' ? (
        <AgentChatsScreen
          key={agentChatsPreview}
          previewState={agentChatsPreview}
          currentAgentId={authenticatedAgentId || 'AG-88421'}
          onSelectConversation={(conversation) => {
            setSelectedConversationId(conversation.id);
            if (conversation.status === 'closed') {
              setAgentChatConversationPreview('closed_conversation');
            } else if (conversation.type === 'agent') {
              setAgentChatConversationPreview('agent_chat_active');
            } else {
              setAgentChatConversationPreview('customer_chat_active');
            }
            setCurrentRoute('agent_chat_conversation');
          }}
          onBackToMore={() => {
            setCurrentRoute('agent_more');
          }}
          onRetry={() => {
            console.log('Retrying chats fetch');
          }}
        />
      ) : currentRoute === 'agent_chat_conversation' ? (
        <AgentChatConversationScreen
          key={agentChatConversationPreview}
          previewState={agentChatConversationPreview}
          conversationId={selectedConversationId || 'chat-cust-01'}
          currentAgentId={authenticatedAgentId || 'AG-88421'}
          onBack={() => {
            setCurrentRoute('agent_chats');
          }}
          onRetry={() => {
            console.log('Retrying chat messages fetch');
          }}
        />
      ) : currentRoute === 'about_tellerbud' ? (
        <AboutTellerBudScreen
          key={aboutTellerBudPreview}
          previewState={aboutTellerBudPreview}
          onBack={() => {
            setCurrentRoute('agent_more');
          }}
        />
      ) : currentRoute === 'balance_enquiry' ? (
        <BalanceEnquiryScreen
          key={balanceEnquiryPreview}
          previewState={balanceEnquiryPreview}
          assignment={
            confirmedAssignment || {
              business: 'Apex Retail Group',
              store: 'Central Mall Branch #104',
              booth: 'Booth 03 — Main Atrium',
              location: 'Ground Floor, Sector B',
              agentName: 'Marcus Vance',
              agentId: authenticatedAgentId || 'AG-88421',
            }
          }
          onBack={() => {
            setCurrentRoute(balanceEnquiryOriginRoute || 'agent_home');
          }}
          onEnquiryRecorded={(record) => {
            console.log('[TellerBud App] Balance Enquiry recorded:', record);
          }}
        />
      ) : (
        <AgentDailySummaryReportScreen
          key={agentDailySummaryReportPreview}
          previewState={agentDailySummaryReportPreview}
          assignment={
            confirmedAssignment || {
              business: 'Apex Retail Group',
              store: 'Central Mall Branch #104',
              booth: 'Booth 03 — Main Atrium',
              location: 'Ground Floor, Sector B',
              agentName: 'Marcus Vance',
              agentId: authenticatedAgentId || 'AG-88421',
            }
          }
          liveRecordedCustomerTxn={activeRecordedTxn}
          liveRecordedWalkInTxn={activeWalkInTxn}
          onBack={() => {
            setCurrentRoute('agent_more');
          }}
          onRetry={() => {
            console.log('Retrying Daily Summary Report data fetch');
          }}
        />
      )}
    </MobileContainer>
  );
}


