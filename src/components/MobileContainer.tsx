import React from 'react';
import { Smartphone, RefreshCw, Wifi, Battery, Signal } from 'lucide-react';
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
} from '../types';
import { useSharedClock, formatStatusBarTime } from '../utils/timeUtils';

interface MobileContainerProps {
  children: React.ReactNode;
  activeWidth?: '360' | '412' | '430' | 'full';
  onChangeWidth?: (w: '360' | '412' | '430' | 'full') => void;
  selectedScenario?: AuthState;
  onSelectScenario?: (state: AuthState) => void;
  availabilityPreviewState?: AvailabilityPreviewState;
  onSelectAvailabilityPreviewState?: (state: AvailabilityPreviewState) => void;
  homePreviewState?: HomePreviewState;
  onSelectHomePreviewState?: (state: HomePreviewState) => void;
  requestDetailPreviewState?: RequestDetailPreviewState;
  onSelectRequestDetailPreviewState?: (state: RequestDetailPreviewState) => void;
  assignedServicePreviewState?: AssignedServicePreviewState;
  onSelectAssignedServicePreviewState?: (
    state: AssignedServicePreviewState
  ) => void;
  transactionExecutionPreviewState?: TransactionExecutionPreviewState;
  onSelectTransactionExecutionPreviewState?: (
    state: TransactionExecutionPreviewState
  ) => void;
  transactionConfirmationPreviewState?: TransactionConfirmationPreviewState;
  onSelectTransactionConfirmationPreviewState?: (
    state: TransactionConfirmationPreviewState
  ) => void;
  serviceCompletionPreviewState?: ServiceCompletionPreviewState;
  onSelectServiceCompletionPreviewState?: (
    state: ServiceCompletionPreviewState
  ) => void;
  agentRequestsPreviewState?: AgentRequestsPreviewState;
  onSelectAgentRequestsPreviewState?: (
    state: AgentRequestsPreviewState
  ) => void;
  liquidityRequestPreviewState?: LiquidityRequestPreviewState;
  onSelectLiquidityRequestPreviewState?: (
    state: LiquidityRequestPreviewState
  ) => void;
  agentLiquidityStatusPreviewState?: AgentLiquidityStatusPreviewState;
  onSelectAgentLiquidityStatusPreviewState?: (
    state: AgentLiquidityStatusPreviewState
  ) => void;
  agentLiquidityExchangePreviewState?: AgentLiquidityExchangePreviewState;
  onSelectAgentLiquidityExchangePreviewState?: (
    state: AgentLiquidityExchangePreviewState
  ) => void;
  agentLiquidityTransactionPreviewState?: AgentLiquidityTransactionPreviewState;
  onSelectAgentLiquidityTransactionPreviewState?: (
    state: AgentLiquidityTransactionPreviewState
  ) => void;
  agentLiquidityCompletionPreviewState?: AgentLiquidityCompletionPreviewState;
  onSelectAgentLiquidityCompletionPreviewState?: (
    state: AgentLiquidityCompletionPreviewState
  ) => void;
  agentTransactionsPreviewState?: AgentTransactionsPreviewState;
  onSelectAgentTransactionsPreviewState?: (
    state: AgentTransactionsPreviewState
  ) => void;
  agentMorePreviewState?: AgentMorePreviewState;
  onSelectAgentMorePreviewState?: (
    state: AgentMorePreviewState
  ) => void;
  endOfDayDeclarationPreviewState?: EndOfDayDeclarationPreviewState;
  onSelectEndOfDayDeclarationPreviewState?: (
    state: EndOfDayDeclarationPreviewState
  ) => void;
  agentAttendancePreviewState?: AgentAttendancePreviewState;
  onSelectAgentAttendancePreviewState?: (
    state: AgentAttendancePreviewState
  ) => void;
  agentWalletPreviewState?: AgentWalletPreviewState;
  onSelectAgentWalletPreviewState?: (
    state: AgentWalletPreviewState
  ) => void;
  agentProfilePreviewState?: AgentProfilePreviewState;
  onSelectAgentProfilePreviewState?: (
    state: AgentProfilePreviewState
  ) => void;
  walkInPreviewState?: WalkInTransactionPreviewState;
  onSelectWalkInPreviewState?: (
    state: WalkInTransactionPreviewState
  ) => void;
  agentLiquidityIncomingPreviewState?: AgentLiquidityIncomingPreviewState;
  onSelectAgentLiquidityIncomingPreviewState?: (
    state: AgentLiquidityIncomingPreviewState
  ) => void;
  businessOwnerLiquidityPreviewState?: BusinessOwnerLiquidityRequestPreviewState;
  onSelectBusinessOwnerLiquidityPreviewState?: (
    state: BusinessOwnerLiquidityRequestPreviewState
  ) => void;
  agentSmsInboxPreviewState?: AgentSmsInboxPreviewState;
  onSelectAgentSmsInboxPreviewState?: (
    state: AgentSmsInboxPreviewState
  ) => void;
  agentDailySummaryReportPreviewState?: AgentDailySummaryReportPreviewState;
  onSelectAgentDailySummaryReportPreviewState?: (
    state: AgentDailySummaryReportPreviewState
  ) => void;
  agentChangePasscodePreviewState?: AgentChangePasscodePreviewState;
  onSelectAgentChangePasscodePreviewState?: (
    state: AgentChangePasscodePreviewState
  ) => void;
  agentChatsPreviewState?: AgentChatsPreviewState;
  onSelectAgentChatsPreviewState?: (
    state: AgentChatsPreviewState
  ) => void;
  agentChatConversationPreviewState?: AgentChatConversationPreviewState;
  onSelectAgentChatConversationPreviewState?: (
    state: AgentChatConversationPreviewState
  ) => void;
  aboutTellerBudPreviewState?: AboutTellerBudPreviewState;
  onSelectAboutTellerBudPreviewState?: (
    state: AboutTellerBudPreviewState
  ) => void;
  onResetApp?: () => void;
  currentRoute?:
    | 'home_screen'
    | 'splash'
    | 'login'
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
    | 'about_tellerbud';
  onSelectRoute?: (
    route:
      | 'home_screen'
      | 'splash'
      | 'login'
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
  ) => void;
}

export const MobileContainer: React.FC<MobileContainerProps> = ({
  children,
  selectedScenario = 'idle',
  onSelectScenario,
  availabilityPreviewState = 'default',
  onSelectAvailabilityPreviewState,
  homePreviewState = 'default',
  onSelectHomePreviewState,
  requestDetailPreviewState = 'delivery_request',
  onSelectRequestDetailPreviewState,
  assignedServicePreviewState = 'delivery_assigned',
  onSelectAssignedServicePreviewState,
  transactionExecutionPreviewState = 'delivery_ready',
  onSelectTransactionExecutionPreviewState,
  transactionConfirmationPreviewState = 'waiting_for_confirmation',
  onSelectTransactionConfirmationPreviewState,
  serviceCompletionPreviewState = 'waiting_for_both',
  onSelectServiceCompletionPreviewState,
  agentRequestsPreviewState = 'incoming_mixed',
  onSelectAgentRequestsPreviewState,
  liquidityRequestPreviewState = 'another_agent_cash',
  onSelectLiquidityRequestPreviewState,
  agentLiquidityStatusPreviewState = 'searching_cash',
  onSelectAgentLiquidityStatusPreviewState,
  agentLiquidityExchangePreviewState = 'cash_ready',
  onSelectAgentLiquidityExchangePreviewState,
  agentLiquidityTransactionPreviewState = 'cash_ready',
  onSelectAgentLiquidityTransactionPreviewState,
  agentLiquidityCompletionPreviewState = 'cash_completed',
  onSelectAgentLiquidityCompletionPreviewState,
  agentTransactionsPreviewState = 'mixed_transactions',
  onSelectAgentTransactionsPreviewState,
  agentMorePreviewState = 'default',
  onSelectAgentMorePreviewState,
  endOfDayDeclarationPreviewState = 'default',
  onSelectEndOfDayDeclarationPreviewState,
  agentAttendancePreviewState = 'current_active',
  onSelectAgentAttendancePreviewState,
  agentWalletPreviewState = 'default',
  onSelectAgentWalletPreviewState,
  agentProfilePreviewState = 'default',
  onSelectAgentProfilePreviewState,
  walkInPreviewState = 'ready',
  onSelectWalkInPreviewState,
  agentLiquidityIncomingPreviewState = 'incoming_cash',
  onSelectAgentLiquidityIncomingPreviewState,
  businessOwnerLiquidityPreviewState = 'pending_review',
  onSelectBusinessOwnerLiquidityPreviewState,
  agentSmsInboxPreviewState = 'default',
  onSelectAgentSmsInboxPreviewState,
  agentDailySummaryReportPreviewState = 'default',
  onSelectAgentDailySummaryReportPreviewState,
  agentChangePasscodePreviewState = 'default',
  onSelectAgentChangePasscodePreviewState,
  agentChatsPreviewState = 'default',
  onSelectAgentChatsPreviewState,
  agentChatConversationPreviewState = 'customer_chat_active',
  onSelectAgentChatConversationPreviewState,
  aboutTellerBudPreviewState = 'default',
  onSelectAboutTellerBudPreviewState,
  onResetApp,
  currentRoute = 'home_screen',
  onSelectRoute,
}) => {
  const isHomeScreen = currentRoute === 'home_screen' || currentRoute === 'splash';
  const sharedClock = useSharedClock(1000);
  const currentTime = formatStatusBarTime(sharedClock);

  const getScreenTitle = () => {
    switch (currentRoute) {
      case 'home_screen':
        return 'Managed Device Home';
      case 'splash':
        return 'Splash Screen';
      case 'login':
        return 'Agent Sign In';
      case 'availability_setup':
        return 'Availability Setup';
      case 'agent_home':
        return 'Agent Home';
      case 'incoming_customer_request':
        return 'Incoming Request';
      case 'assigned_customer_service':
        return 'Assigned Service';
      case 'transaction_execution':
        return 'Transaction Execution';
      case 'service_completion':
        return 'Service Completion';
      case 'requests':
        return 'Requests';
      case 'liquidity_request':
        return 'Request Cash / Float';
      case 'agent_liquidity_status':
        return 'Liquidity Request Status';
      case 'agent_liquidity_exchange':
        return 'Agent Liquidity Exchange';
      case 'agent_liquidity_transaction':
        return 'Liquidity Transaction';
      case 'agent_liquidity_completion':
        return 'Liquidity Completion';
      case 'agent_transactions':
        return 'Transactions';
      case 'agent_more':
        return 'More';
      case 'end_of_day_declaration':
        return 'End-of-Day Declaration';
      case 'agent_attendance':
        return 'Attendance';
      case 'agent_wallet':
        return 'TellerBud Wallet';
      case 'agent_profile':
        return 'Agent Profile';
      case 'walk_in_transaction':
        return 'Walk-In Transaction';
      case 'incoming_agent_liquidity':
        return 'Incoming Agent Liquidity Request';
      case 'business_owner_liquidity_detail':
        return 'Business Owner Request Status';
      case 'agent_sms_inbox':
        return 'SMS Inbox';
      case 'agent_daily_summary_report':
        return 'Daily Summary Report';
      case 'agent_change_passcode':
        return 'Change Passcode';
      case 'agent_chats':
        return 'Chats';
      case 'agent_chat_conversation':
        return 'Chat Conversation';
      case 'about_tellerbud':
        return 'About TellerBud';
      default:
        return 'Managed Device Home';
    }
  };

  const getScreenNumber = () => {
    switch (currentRoute) {
      case 'home_screen':
        return '00';
      case 'splash':
        return '01';
      case 'login':
        return '02';
      case 'availability_setup':
        return '03';
      case 'agent_home':
        return '04';
      case 'incoming_customer_request':
        return '05';
      case 'assigned_customer_service':
        return '06';
      case 'service_completion':
        return '07';
      case 'requests':
        return '08';
      case 'liquidity_request':
        return '09';
      case 'agent_liquidity_status':
        return '10';
      case 'agent_liquidity_exchange':
        return '11';
      case 'agent_liquidity_transaction':
        return '12';
      case 'agent_liquidity_completion':
        return '13';
      case 'agent_transactions':
        return '14';
      case 'agent_more':
        return '15';
      case 'end_of_day_declaration':
        return '16';
      case 'agent_attendance':
        return '17';
      case 'agent_wallet':
        return '18';
      case 'agent_profile':
        return '19';
      case 'walk_in_transaction':
        return '20';
      case 'incoming_agent_liquidity':
        return '21';
      case 'business_owner_liquidity_detail':
        return '22';
      case 'agent_sms_inbox':
        return '23';
      case 'agent_daily_summary_report':
        return '24';
      case 'agent_change_passcode':
        return '25';
      case 'agent_chats':
        return '26';
      case 'agent_chat_conversation':
        return '27';
      case 'about_tellerbud':
        return '28';
      default:
        return '00';
    }
  };


  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col font-sans select-none overflow-x-hidden">
      {/* Client Review Top Navigation Header */}
      <header className="w-full bg-slate-900/90 border-b border-slate-800/80 px-4 sm:px-6 py-3.5 flex items-center justify-between shrink-0 backdrop-blur-md z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0052CC]/20 border border-[#0052CC]/40 flex items-center justify-center text-[#38BDF8]">
            <Smartphone className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-slate-100 tracking-tight">
              TellerBud Agent App
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">UI/UX Screen Review</p>
          </div>
        </div>

        {/* Current Active Screen Badge */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs">
          <span className="text-[#38BDF8] font-mono font-bold">{getScreenNumber()}</span>
          <span className="text-slate-200 font-semibold">{getScreenTitle()}</span>
        </div>
      </header>

      {/* Main Review Workspace */}
      <div className="flex-1 w-full flex flex-col md:flex-row overflow-hidden min-h-0">
        {/* Left-Side Screen Navigator */}
        <aside className="w-full md:w-64 bg-slate-900/60 border-b md:border-b-0 md:border-r border-slate-800/80 p-4 sm:p-5 flex flex-col justify-between shrink-0 overflow-y-auto">
          <div>
            <div className="mb-4 sm:mb-6">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Screens
              </h2>
              <p className="text-[11px] text-slate-500">
                Select a screen to review layout & interaction
              </p>
            </div>

            <nav className="flex flex-col gap-2">
              {/* 00 — Managed Device Home */}
              <button
                onClick={() => onSelectRoute?.('home_screen')}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
                  currentRoute === 'home_screen'
                    ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-white shadow-sm ring-1 ring-[#0052CC]/30'
                    : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <span
                  className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold ${
                    currentRoute === 'home_screen'
                      ? 'bg-[#0052CC] text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  00
                </span>
                <span className="text-xs font-semibold">Managed Device Home</span>
              </button>

              {/* 01 — Splash Screen */}
              <button
                onClick={() => onSelectRoute?.('splash')}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
                  currentRoute === 'splash'
                    ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-white shadow-sm ring-1 ring-[#0052CC]/30'
                    : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <span
                  className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold ${
                    currentRoute === 'splash'
                      ? 'bg-[#0052CC] text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  01
                </span>
                <span className="text-xs font-semibold">Splash Screen</span>
              </button>

              {/* 02 — Agent Sign In */}
              <button
                onClick={() => onSelectRoute?.('login')}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
                  currentRoute === 'login'
                    ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-white shadow-sm ring-1 ring-[#0052CC]/30'
                    : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <span
                  className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold ${
                    currentRoute === 'login'
                      ? 'bg-[#0052CC] text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  02
                </span>
                <span className="text-xs font-semibold">Agent Sign In</span>
              </button>

              {/* 03 — Availability Setup */}
              <button
                onClick={() => onSelectRoute?.('availability_setup')}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
                  currentRoute === 'availability_setup'
                    ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-white shadow-sm ring-1 ring-[#0052CC]/30'
                    : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <span
                  className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold ${
                    currentRoute === 'availability_setup'
                      ? 'bg-[#0052CC] text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  03
                </span>
                <span className="text-xs font-semibold">Availability Setup</span>
              </button>

              {/* 04 — Agent Home */}
              <button
                onClick={() => onSelectRoute?.('agent_home')}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
                  currentRoute === 'agent_home'
                    ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-white shadow-sm ring-1 ring-[#0052CC]/30'
                    : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <span
                  className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold ${
                    currentRoute === 'agent_home'
                      ? 'bg-[#0052CC] text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  04
                </span>
                <span className="text-xs font-semibold">Agent Home</span>
              </button>

              {/* 05 — Incoming Request */}
              <button
                onClick={() => onSelectRoute?.('incoming_customer_request')}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
                  currentRoute === 'incoming_customer_request'
                    ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-white shadow-sm ring-1 ring-[#0052CC]/30'
                    : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <span
                  className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold ${
                    currentRoute === 'incoming_customer_request'
                      ? 'bg-[#0052CC] text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  05
                </span>
                <span className="text-xs font-semibold">Incoming Request</span>
              </button>

              {/* 06 — Assigned Service */}
              <button
                onClick={() => onSelectRoute?.('assigned_customer_service')}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
                  currentRoute === 'assigned_customer_service'
                    ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-white shadow-sm ring-1 ring-[#0052CC]/30'
                    : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <span
                  className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold ${
                    currentRoute === 'assigned_customer_service'
                      ? 'bg-[#0052CC] text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  06
                </span>
                <span className="text-xs font-semibold">Assigned Service</span>
              </button>

              {/* 07 — Service Completion */}
              <button
                onClick={() => onSelectRoute?.('service_completion')}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
                  currentRoute === 'service_completion'
                    ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-white shadow-sm ring-1 ring-[#0052CC]/30'
                    : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <span
                  className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold ${
                    currentRoute === 'service_completion'
                      ? 'bg-[#0052CC] text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  07
                </span>
                <span className="text-xs font-semibold">Service Completion</span>
              </button>

              {/* 08 — Requests */}
              <button
                onClick={() => onSelectRoute?.('requests')}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
                  currentRoute === 'requests'
                    ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-white shadow-sm ring-1 ring-[#0052CC]/30'
                    : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <span
                  className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold ${
                    currentRoute === 'requests'
                      ? 'bg-[#0052CC] text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  08
                </span>
                <span className="text-xs font-semibold">Requests</span>
              </button>

              {/* 09 — Request Cash / Float */}
              <button
                onClick={() => onSelectRoute?.('liquidity_request')}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
                  currentRoute === 'liquidity_request'
                    ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-white shadow-sm ring-1 ring-[#0052CC]/30'
                    : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <span
                  className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold ${
                    currentRoute === 'liquidity_request'
                      ? 'bg-[#0052CC] text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  09
                </span>
                <span className="text-xs font-semibold">Request Cash / Float</span>
              </button>

              {/* 10 — Liquidity Request Status */}
              <button
                onClick={() => onSelectRoute?.('agent_liquidity_status')}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
                  currentRoute === 'agent_liquidity_status'
                    ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-white shadow-sm ring-1 ring-[#0052CC]/30'
                    : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <span
                  className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold ${
                    currentRoute === 'agent_liquidity_status'
                      ? 'bg-[#0052CC] text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  10
                </span>
                <span className="text-xs font-semibold">Liquidity Request Status</span>
              </button>

              {/* 11 — Agent Liquidity Exchange */}
              <button
                onClick={() => onSelectRoute?.('agent_liquidity_exchange')}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
                  currentRoute === 'agent_liquidity_exchange'
                    ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-white shadow-sm ring-1 ring-[#0052CC]/30'
                    : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <span
                  className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold ${
                    currentRoute === 'agent_liquidity_exchange'
                      ? 'bg-[#0052CC] text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  11
                </span>
                <span className="text-xs font-semibold">Agent Liquidity Exchange</span>
              </button>

              {/* 12 — Liquidity Transaction */}
              <button
                onClick={() => onSelectRoute?.('agent_liquidity_transaction')}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
                  currentRoute === 'agent_liquidity_transaction'
                    ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-white shadow-sm ring-1 ring-[#0052CC]/30'
                    : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <span
                  className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold ${
                    currentRoute === 'agent_liquidity_transaction'
                      ? 'bg-[#0052CC] text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  12
                </span>
                <span className="text-xs font-semibold">Liquidity Transaction</span>
              </button>

              {/* 13 — Liquidity Completion */}
              <button
                onClick={() => onSelectRoute?.('agent_liquidity_completion')}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
                  currentRoute === 'agent_liquidity_completion'
                    ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-white shadow-sm ring-1 ring-[#0052CC]/30'
                    : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <span
                  className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold ${
                    currentRoute === 'agent_liquidity_completion'
                      ? 'bg-[#0052CC] text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  13
                </span>
                <span className="text-xs font-semibold">Liquidity Completion</span>
              </button>

              {/* 14 — Transactions */}
              <button
                onClick={() => onSelectRoute?.('agent_transactions')}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
                  currentRoute === 'agent_transactions'
                    ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-white shadow-sm ring-1 ring-[#0052CC]/30'
                    : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <span
                  className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold ${
                    currentRoute === 'agent_transactions'
                      ? 'bg-[#0052CC] text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  14
                </span>
                <span className="text-xs font-semibold">Transactions</span>
              </button>

              {/* 15 — More */}
              <button
                onClick={() => onSelectRoute?.('agent_more')}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
                  currentRoute === 'agent_more'
                    ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-white shadow-sm ring-1 ring-[#0052CC]/30'
                    : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <span
                  className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold ${
                    currentRoute === 'agent_more'
                      ? 'bg-[#0052CC] text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  15
                </span>
                <span className="text-xs font-semibold">More</span>
              </button>

              {/* 16 — End-of-Day Declaration */}
              <button
                onClick={() => onSelectRoute?.('end_of_day_declaration')}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
                  currentRoute === 'end_of_day_declaration'
                    ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-white shadow-sm ring-1 ring-[#0052CC]/30'
                    : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <span
                  className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold ${
                    currentRoute === 'end_of_day_declaration'
                      ? 'bg-[#0052CC] text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  16
                </span>
                <span className="text-xs font-semibold">End-of-Day Declaration</span>
              </button>

              {/* 17 — Attendance */}
              <button
                onClick={() => onSelectRoute?.('agent_attendance')}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
                  currentRoute === 'agent_attendance'
                    ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-white shadow-sm ring-1 ring-[#0052CC]/30'
                    : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <span
                  className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold ${
                    currentRoute === 'agent_attendance'
                      ? 'bg-[#0052CC] text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  17
                </span>
                <span className="text-xs font-semibold">Attendance</span>
              </button>

              {/* 18 — TellerBud Wallet */}
              <button
                onClick={() => onSelectRoute?.('agent_wallet')}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
                  currentRoute === 'agent_wallet'
                    ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-white shadow-sm ring-1 ring-[#0052CC]/30'
                    : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <span
                  className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold ${
                    currentRoute === 'agent_wallet'
                      ? 'bg-[#0052CC] text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  18
                </span>
                <span className="text-xs font-semibold">TellerBud Wallet</span>
              </button>

              {/* 19 — Agent Profile */}
              <button
                onClick={() => onSelectRoute?.('agent_profile')}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
                  currentRoute === 'agent_profile'
                    ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-white shadow-sm ring-1 ring-[#0052CC]/30'
                    : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <span
                  className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold ${
                    currentRoute === 'agent_profile'
                      ? 'bg-[#0052CC] text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  19
                </span>
                <span className="text-xs font-semibold">Agent Profile</span>
              </button>

              {/* 20 — Walk-In Transaction */}
              <button
                onClick={() => onSelectRoute?.('walk_in_transaction')}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
                  currentRoute === 'walk_in_transaction'
                    ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-white shadow-sm ring-1 ring-[#0052CC]/30'
                    : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <span
                  className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold ${
                    currentRoute === 'walk_in_transaction'
                      ? 'bg-[#0052CC] text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  20
                </span>
                <span className="text-xs font-semibold">Walk-In Transaction</span>
              </button>

              {/* 21 — Incoming Agent Liquidity Request */}
              <button
                onClick={() => onSelectRoute?.('incoming_agent_liquidity')}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
                  currentRoute === 'incoming_agent_liquidity'
                    ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-white shadow-sm ring-1 ring-[#0052CC]/30'
                    : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <span
                  className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold ${
                    currentRoute === 'incoming_agent_liquidity'
                      ? 'bg-[#0052CC] text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  21
                </span>
                <span className="text-xs font-semibold">Incoming Agent Liquidity Request</span>
              </button>

              {/* 22 — Business Owner Request Status */}
              <button
                onClick={() => onSelectRoute?.('business_owner_liquidity_detail')}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
                  currentRoute === 'business_owner_liquidity_detail'
                    ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-white shadow-sm ring-1 ring-[#0052CC]/30'
                    : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <span
                  className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold ${
                    currentRoute === 'business_owner_liquidity_detail'
                      ? 'bg-[#0052CC] text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  22
                </span>
                <span className="text-xs font-semibold">Business Owner Request Status</span>
              </button>

              {/* 23 — SMS Inbox */}
              <button
                onClick={() => onSelectRoute?.('agent_sms_inbox')}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
                  currentRoute === 'agent_sms_inbox'
                    ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-white shadow-sm ring-1 ring-[#0052CC]/30'
                    : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <span
                  className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold ${
                    currentRoute === 'agent_sms_inbox'
                      ? 'bg-[#0052CC] text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  23
                </span>
                <span className="text-xs font-semibold">SMS Inbox</span>
              </button>

              {/* 24 — Daily Summary Report */}
              <button
                onClick={() => onSelectRoute?.('agent_daily_summary_report')}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
                  currentRoute === 'agent_daily_summary_report'
                    ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-white shadow-sm ring-1 ring-[#0052CC]/30'
                    : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <span
                  className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold ${
                    currentRoute === 'agent_daily_summary_report'
                      ? 'bg-[#0052CC] text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  24
                </span>
                <span className="text-xs font-semibold">Daily Summary Report</span>
              </button>

              {/* 25 — Change Passcode */}
              <button
                onClick={() => onSelectRoute?.('agent_change_passcode')}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
                  currentRoute === 'agent_change_passcode'
                    ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-white shadow-sm ring-1 ring-[#0052CC]/30'
                    : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <span
                  className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold ${
                    currentRoute === 'agent_change_passcode'
                      ? 'bg-[#0052CC] text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  25
                </span>
                <span className="text-xs font-semibold">Change Passcode</span>
              </button>

              {/* 26 — Chats */}
              <button
                onClick={() => onSelectRoute?.('agent_chats')}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
                  currentRoute === 'agent_chats'
                    ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-white shadow-sm ring-1 ring-[#0052CC]/30'
                    : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <span
                  className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold ${
                    currentRoute === 'agent_chats'
                      ? 'bg-[#0052CC] text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  26
                </span>
                <span className="text-xs font-semibold">Chats</span>
              </button>

              {/* 27 — Chat Conversation */}
              <button
                onClick={() => onSelectRoute?.('agent_chat_conversation')}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
                  currentRoute === 'agent_chat_conversation'
                    ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-white shadow-sm ring-1 ring-[#0052CC]/30'
                    : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <span
                  className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold ${
                    currentRoute === 'agent_chat_conversation'
                      ? 'bg-[#0052CC] text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  27
                </span>
                <span className="text-xs font-semibold">Chat Conversation</span>
              </button>

              {/* 28 — About TellerBud */}
              <button
                onClick={() => onSelectRoute?.('about_tellerbud')}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
                  currentRoute === 'about_tellerbud'
                    ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-white shadow-sm ring-1 ring-[#0052CC]/30'
                    : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <span
                  className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold ${
                    currentRoute === 'about_tellerbud'
                      ? 'bg-[#0052CC] text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  28
                </span>
                <span className="text-xs font-semibold">About TellerBud</span>
              </button>
            </nav>
          </div>

          {/* Preview State Controls (For Agent Sign In) */}
          {currentRoute === 'login' && onSelectScenario && (
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col gap-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Preview State
                </span>
                {onResetApp && (
                  <button
                    onClick={onResetApp}
                    title="Reset Screen"
                    className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-1 gap-1.5">
                <button
                  onClick={() => onSelectScenario('idle')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    selectedScenario === 'idle'
                      ? 'bg-blue-600/20 border-blue-500/60 text-blue-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Default
                </button>
                <button
                  onClick={() => onSelectScenario('invalid_credentials')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    selectedScenario === 'invalid_credentials'
                      ? 'bg-red-500/20 border-red-400/60 text-red-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Invalid ID / Passcode
                </button>
                <button
                  onClick={() => onSelectScenario('connectivity_error')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    selectedScenario === 'connectivity_error'
                      ? 'bg-amber-500/20 border-amber-400/60 text-amber-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  No Connection
                </button>
                <button
                  onClick={() => onSelectScenario('account_inactive')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    selectedScenario === 'account_inactive'
                      ? 'bg-slate-600/30 border-slate-500/60 text-slate-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Access Blocked
                </button>
                <button
                  onClick={() => onSelectScenario('missing_assignment')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    selectedScenario === 'missing_assignment'
                      ? 'bg-slate-600/30 border-slate-500/60 text-slate-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  No Assignment
                </button>
              </div>
            </div>
          )}

          {/* Preview State Controls (For Availability Setup) */}
          {currentRoute === 'availability_setup' && onSelectAvailabilityPreviewState && (
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col gap-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Preview State
                </span>
                {onResetApp && (
                  <button
                    onClick={onResetApp}
                    title="Reset Screen"
                    className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-1 gap-1.5">
                <button
                  onClick={() => onSelectAvailabilityPreviewState('default')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    availabilityPreviewState === 'default'
                      ? 'bg-blue-600/20 border-blue-500/60 text-blue-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Default (Offline)
                </button>
                <button
                  onClick={() => onSelectAvailabilityPreviewState('offline')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    availabilityPreviewState === 'offline'
                      ? 'bg-slate-600/30 border-slate-500/60 text-slate-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Offline
                </button>
                <button
                  onClick={() => onSelectAvailabilityPreviewState('online')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    availabilityPreviewState === 'online'
                      ? 'bg-emerald-600/20 border-emerald-500/60 text-emerald-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Online
                </button>
                <button
                  onClick={() => onSelectAvailabilityPreviewState('saving')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    availabilityPreviewState === 'saving'
                      ? 'bg-blue-600/20 border-blue-500/60 text-blue-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Saving
                </button>
                <button
                  onClick={() => onSelectAvailabilityPreviewState('config_unavailable')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    availabilityPreviewState === 'config_unavailable'
                      ? 'bg-amber-500/20 border-amber-400/60 text-amber-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Config Unavailable
                </button>
                <button
                  onClick={() => onSelectAvailabilityPreviewState('connection_issue')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    availabilityPreviewState === 'connection_issue'
                      ? 'bg-red-500/20 border-red-400/60 text-red-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Connection Issue
                </button>
              </div>
            </div>
          )}

          {/* Preview State Controls (For Agent Home) */}
          {currentRoute === 'agent_home' && onSelectHomePreviewState && (
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col gap-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Preview State
                </span>
                {onResetApp && (
                  <button
                    onClick={onResetApp}
                    title="Reset Screen"
                    className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-1 gap-1.5">
                <button
                  onClick={() => onSelectHomePreviewState('default')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    homePreviewState === 'default'
                      ? 'bg-blue-600/20 border-blue-500/60 text-blue-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Default (Online)
                </button>
                <button
                  onClick={() => onSelectHomePreviewState('pickup_request')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    homePreviewState === 'pickup_request' || homePreviewState === 'incoming_request' || homePreviewState === 'delivery_request'
                      ? 'bg-emerald-600/20 border-emerald-500/60 text-emerald-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Incoming Pop-up (Pickup)
                </button>
                <button
                  onClick={() => onSelectHomePreviewState('responding')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    homePreviewState === 'responding'
                      ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-blue-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Accepting
                </button>
                <button
                  onClick={() => onSelectHomePreviewState('assigned_elsewhere')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    homePreviewState === 'assigned_elsewhere'
                      ? 'bg-slate-600/30 border-slate-500/60 text-slate-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Request Unavailable
                </button>
                <button
                  onClick={() => onSelectHomePreviewState('timed_out')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    homePreviewState === 'timed_out'
                      ? 'bg-amber-500/20 border-amber-400/60 text-amber-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Timed Out
                </button>
                <button
                  onClick={() => onSelectHomePreviewState('active_service')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    homePreviewState === 'active_service'
                      ? 'bg-sky-500/20 border-sky-400/60 text-sky-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Active Service
                </button>
                <button
                  onClick={() => onSelectHomePreviewState('active_service_blocking')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    homePreviewState === 'active_service_blocking'
                      ? 'bg-amber-600/20 border-amber-500/60 text-amber-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Active Service Blocking
                </button>
                <button
                  onClick={() => onSelectHomePreviewState('offline')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    homePreviewState === 'offline'
                      ? 'bg-slate-600/30 border-slate-500/60 text-slate-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Offline
                </button>
                <button
                  onClick={() => onSelectHomePreviewState('connection_issue')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    homePreviewState === 'connection_issue'
                      ? 'bg-amber-500/20 border-amber-400/60 text-amber-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Connection Issue
                </button>
              </div>
            </div>
          )}

          {/* Preview State Controls (For Screen 05 — Incoming Customer Request) */}
          {currentRoute === 'incoming_customer_request' && onSelectRequestDetailPreviewState && (
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col gap-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Preview State
                </span>
                {onResetApp && (
                  <button
                    onClick={onResetApp}
                    title="Reset Screen"
                    className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-1 gap-1.5">
                <button
                  onClick={() => onSelectRequestDetailPreviewState('pickup_request')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    requestDetailPreviewState === 'pickup_request' || requestDetailPreviewState === 'delivery_request'
                      ? 'bg-emerald-600/20 border-emerald-500/60 text-emerald-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Pickup Request
                </button>
                <button
                  onClick={() => onSelectRequestDetailPreviewState('responding')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    requestDetailPreviewState === 'responding' || requestDetailPreviewState === 'accepting'
                      ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-blue-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Accepting
                </button>
                <button
                  onClick={() => onSelectRequestDetailPreviewState('assigned_to_you')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    requestDetailPreviewState === 'assigned_to_you'
                      ? 'bg-emerald-600/20 border-emerald-500/60 text-emerald-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Assigned To You
                </button>
                <button
                  onClick={() => onSelectRequestDetailPreviewState('assigned_elsewhere')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    requestDetailPreviewState === 'assigned_elsewhere' || requestDetailPreviewState === 'unavailable'
                      ? 'bg-slate-600/30 border-slate-500/60 text-slate-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Request Unavailable
                </button>
                <button
                  onClick={() => onSelectRequestDetailPreviewState('timed_out')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    requestDetailPreviewState === 'timed_out'
                      ? 'bg-amber-500/20 border-amber-400/60 text-amber-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Timed Out
                </button>
                <button
                  onClick={() => onSelectRequestDetailPreviewState('connection_issue')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    requestDetailPreviewState === 'connection_issue'
                      ? 'bg-amber-500/20 border-amber-400/60 text-amber-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Connection Issue
                </button>
              </div>
            </div>
          )}

          {/* Preview State Controls (For Assigned Customer Service) */}
          {currentRoute === 'assigned_customer_service' && onSelectAssignedServicePreviewState && (
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col gap-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Preview State
                </span>
                {onResetApp && (
                  <button
                    onClick={onResetApp}
                    title="Reset Screen"
                    className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-1 gap-1.5">
                <button
                  onClick={() => onSelectAssignedServicePreviewState('pickup_assigned')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    assignedServicePreviewState === 'pickup_assigned' || assignedServicePreviewState === 'pickup_waiting' || assignedServicePreviewState === 'delivery_assigned'
                      ? 'bg-blue-600/20 border-blue-500/60 text-blue-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Pickup Waiting (Withdrawal)
                </button>
                <button
                  onClick={() => onSelectAssignedServicePreviewState('pickup_deposit_assigned')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    assignedServicePreviewState === 'pickup_deposit_assigned'
                      ? 'bg-teal-600/20 border-teal-500/60 text-teal-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Pickup Waiting (Deposit - USSD)
                </button>
                <button
                  onClick={() => onSelectAssignedServicePreviewState('pickup_eta_unavailable')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    assignedServicePreviewState === 'pickup_eta_unavailable'
                      ? 'bg-slate-500/20 border-slate-400/60 text-slate-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Pickup ETA Unavailable
                </button>
                <button
                  onClick={() => onSelectAssignedServicePreviewState('scheduled_pickup')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    assignedServicePreviewState === 'scheduled_pickup'
                      ? 'bg-sky-500/20 border-sky-400/60 text-sky-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Scheduled Pickup
                </button>
                <button
                  onClick={() => onSelectAssignedServicePreviewState('service_cancelled')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    assignedServicePreviewState === 'service_cancelled'
                      ? 'bg-red-500/20 border-red-400/60 text-red-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Service Cancelled
                </button>
                <button
                  onClick={() => onSelectAssignedServicePreviewState('connection_issue')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    assignedServicePreviewState === 'connection_issue'
                      ? 'bg-amber-500/20 border-amber-400/60 text-amber-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Connection Issue
                </button>
              </div>
            </div>
          )}

          {/* Preview State Controls (For Transaction Execution) */}
          {currentRoute === 'transaction_execution' && onSelectTransactionExecutionPreviewState && (
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col gap-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Preview State
                </span>
                {onResetApp && (
                  <button
                    onClick={onResetApp}
                    title="Reset Screen"
                    className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-1 gap-1.5">
                <button
                  onClick={() => onSelectTransactionExecutionPreviewState('pickup_withdrawal_ready')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    transactionExecutionPreviewState === 'pickup_withdrawal_ready' || transactionExecutionPreviewState === 'pickup_ready'
                      ? 'bg-blue-600/20 border-blue-500/60 text-blue-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Pickup Withdrawal Ready
                </button>
                <button
                  onClick={() => onSelectTransactionExecutionPreviewState('pickup_deposit_ready')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    transactionExecutionPreviewState === 'pickup_deposit_ready'
                      ? 'bg-teal-600/20 border-teal-500/60 text-teal-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Pickup Deposit Ready
                </button>
                <button
                  onClick={() => onSelectTransactionExecutionPreviewState('withdrawal_performed')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    transactionExecutionPreviewState === 'withdrawal_performed' || transactionExecutionPreviewState === 'transaction_performed' || transactionExecutionPreviewState === 'confirm_transaction'
                      ? 'bg-blue-600/20 border-blue-500/60 text-blue-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Transaction Performed (Withdrawal)
                </button>
                <button
                  onClick={() => onSelectTransactionExecutionPreviewState('deposit_performed')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    transactionExecutionPreviewState === 'deposit_performed'
                      ? 'bg-sky-600/20 border-sky-500/60 text-sky-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Transaction Performed (Deposit)
                </button>
                <button
                  onClick={() => onSelectTransactionExecutionPreviewState('withdrawal_recorded')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    transactionExecutionPreviewState === 'withdrawal_recorded' || transactionExecutionPreviewState === 'transaction_recorded'
                      ? 'bg-emerald-600/20 border-emerald-500/60 text-emerald-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Transaction Recorded (Withdrawal)
                </button>
                <button
                  onClick={() => onSelectTransactionExecutionPreviewState('deposit_recorded')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    transactionExecutionPreviewState === 'deposit_recorded' || transactionExecutionPreviewState === 'ussd_successful'
                      ? 'bg-emerald-600/20 border-emerald-500/60 text-emerald-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Transaction Recorded (Deposit)
                </button>
                <button
                  onClick={() => onSelectTransactionExecutionPreviewState('dialler')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    transactionExecutionPreviewState === 'dialler'
                      ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-sky-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Phone Dialler
                </button>
                <button
                  onClick={() => onSelectTransactionExecutionPreviewState('deposit_ussd_in_progress')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    transactionExecutionPreviewState === 'deposit_ussd_in_progress' || transactionExecutionPreviewState === 'ussd_in_progress' || transactionExecutionPreviewState === 'processing'
                      ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-sky-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Deposit USSD In Progress
                </button>
                <button
                  onClick={() => onSelectTransactionExecutionPreviewState('ussd_cancelled')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    transactionExecutionPreviewState === 'ussd_cancelled'
                      ? 'bg-amber-600/20 border-amber-500/60 text-amber-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  USSD Cancelled
                </button>
                <button
                  onClick={() => onSelectTransactionExecutionPreviewState('ussd_failed')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    transactionExecutionPreviewState === 'ussd_failed'
                      ? 'bg-red-600/20 border-red-500/60 text-red-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  USSD Failed
                </button>
                <button
                  onClick={() => onSelectTransactionExecutionPreviewState('ussd_result_unknown')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    transactionExecutionPreviewState === 'ussd_result_unknown' || transactionExecutionPreviewState === 'status_not_confirmed'
                      ? 'bg-amber-500/20 border-amber-400/60 text-amber-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  USSD Result Unknown
                </button>
                <button
                  onClick={() => onSelectTransactionExecutionPreviewState('record_failed')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    transactionExecutionPreviewState === 'record_failed'
                      ? 'bg-red-600/20 border-red-500/60 text-red-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Unable to Record
                </button>
                <button
                  onClick={() => onSelectTransactionExecutionPreviewState('connection_issue')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    transactionExecutionPreviewState === 'connection_issue'
                      ? 'bg-red-500/20 border-red-400/60 text-red-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Connection Issue
                </button>
              </div>
            </div>
          )}

          {/* Preview State Controls (For Service Completion) */}
          {currentRoute === 'service_completion' && onSelectServiceCompletionPreviewState && (
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col gap-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Preview State
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  Screen 08
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => onSelectServiceCompletionPreviewState('waiting_for_both')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    serviceCompletionPreviewState === 'waiting_for_both'
                      ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-white font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Waiting for Both
                </button>
                <button
                  onClick={() => onSelectServiceCompletionPreviewState('customer_confirmed')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    serviceCompletionPreviewState === 'customer_confirmed'
                      ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-white font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Customer Confirmed
                </button>
                <button
                  onClick={() => onSelectServiceCompletionPreviewState('agent_confirmed')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    serviceCompletionPreviewState === 'agent_confirmed'
                      ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-white font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Agent Confirmed
                </button>
                <button
                  onClick={() => onSelectServiceCompletionPreviewState('service_completed')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    serviceCompletionPreviewState === 'service_completed'
                      ? 'bg-emerald-600/20 border-emerald-500/60 text-emerald-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Service Completed
                </button>
                <button
                  onClick={() => onSelectServiceCompletionPreviewState('connection_issue')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    serviceCompletionPreviewState === 'connection_issue'
                      ? 'bg-red-500/20 border-red-400/60 text-red-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Connection Issue
                </button>
                <button
                  onClick={() => onSelectServiceCompletionPreviewState('confirmation_status_unknown')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    serviceCompletionPreviewState === 'confirmation_status_unknown'
                      ? 'bg-amber-500/20 border-amber-400/60 text-amber-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Confirmation Status Unknown
                </button>
              </div>
            </div>
          )}
          {/* Preview State Controls (For Requests Hub) */}
          {currentRoute === 'requests' && onSelectAgentRequestsPreviewState && (
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col gap-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Preview State
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  Screen 09
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => onSelectAgentRequestsPreviewState('incoming_mixed')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentRequestsPreviewState === 'incoming_mixed'
                      ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-white font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Incoming Mixed
                </button>
                <button
                  onClick={() => onSelectAgentRequestsPreviewState('customer_requests')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentRequestsPreviewState === 'customer_requests'
                      ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-white font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Customer Requests
                </button>
                <button
                  onClick={() => onSelectAgentRequestsPreviewState('agent_liquidity_incoming')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentRequestsPreviewState === 'agent_liquidity_incoming'
                      ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-white font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Agent Liquidity Incoming
                </button>
                <button
                  onClick={() => onSelectAgentRequestsPreviewState('my_agent_requests')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentRequestsPreviewState === 'my_agent_requests'
                      ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-white font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  My Agent Requests
                </button>
                <button
                  onClick={() => onSelectAgentRequestsPreviewState('business_owner_requests')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentRequestsPreviewState === 'business_owner_requests'
                      ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-white font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Business Owner Requests
                </button>
                <button
                  onClick={() => onSelectAgentRequestsPreviewState('empty_incoming')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentRequestsPreviewState === 'empty_incoming'
                      ? 'bg-slate-700/40 border-slate-600 text-slate-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Empty Incoming
                </button>
                <button
                  onClick={() => onSelectAgentRequestsPreviewState('empty_my_requests')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentRequestsPreviewState === 'empty_my_requests'
                      ? 'bg-slate-700/40 border-slate-600 text-slate-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Empty My Requests
                </button>
                <button
                  onClick={() => onSelectAgentRequestsPreviewState('connection_issue')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentRequestsPreviewState === 'connection_issue'
                      ? 'bg-amber-500/20 border-amber-400/60 text-amber-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Connection Issue
                </button>
              </div>
            </div>
          )}

          {/* Preview State Controls (For Liquidity Request - Screen 10) */}
          {currentRoute === 'liquidity_request' && onSelectLiquidityRequestPreviewState && (
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col gap-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Preview State
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  Screen 10
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => onSelectLiquidityRequestPreviewState('another_agent_cash')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    liquidityRequestPreviewState === 'another_agent_cash'
                      ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-white font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Another Agent — Cash
                </button>
                <button
                  onClick={() => onSelectLiquidityRequestPreviewState('another_agent_float')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    liquidityRequestPreviewState === 'another_agent_float'
                      ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-white font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Another Agent — Float
                </button>
                <button
                  onClick={() => onSelectLiquidityRequestPreviewState('business_owner_cash')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    liquidityRequestPreviewState === 'business_owner_cash'
                      ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-white font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Business Owner — Cash
                </button>
                <button
                  onClick={() => onSelectLiquidityRequestPreviewState('business_owner_float')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    liquidityRequestPreviewState === 'business_owner_float'
                      ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-white font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Business Owner — Float
                </button>
                <button
                  onClick={() => onSelectLiquidityRequestPreviewState('submitting')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    liquidityRequestPreviewState === 'submitting'
                      ? 'bg-blue-600/20 border-blue-500/60 text-blue-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Submitting State
                </button>
                <button
                  onClick={() => onSelectLiquidityRequestPreviewState('connection_issue')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    liquidityRequestPreviewState === 'connection_issue'
                      ? 'bg-red-500/20 border-red-400/60 text-red-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Connection Issue
                </button>
                <button
                  onClick={() => onSelectLiquidityRequestPreviewState('status_not_confirmed')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    liquidityRequestPreviewState === 'status_not_confirmed'
                      ? 'bg-amber-500/20 border-amber-400/60 text-amber-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Status Not Confirmed
                </button>
              </div>
            </div>
          )}

          {/* Preview State Controls (For Liquidity Request Status - Screen 11) */}
          {currentRoute === 'agent_liquidity_status' && onSelectAgentLiquidityStatusPreviewState && (
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col gap-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Preview State
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Screen 11</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => onSelectAgentLiquidityStatusPreviewState('searching_cash')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentLiquidityStatusPreviewState === 'searching_cash'
                      ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-white font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Searching — Cash
                </button>
                <button
                  onClick={() => onSelectAgentLiquidityStatusPreviewState('searching_float')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentLiquidityStatusPreviewState === 'searching_float'
                      ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-white font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Searching — Float
                </button>
                <button
                  onClick={() => onSelectAgentLiquidityStatusPreviewState('agent_accepted')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentLiquidityStatusPreviewState === 'agent_accepted'
                      ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Agent Accepted
                </button>
                <button
                  onClick={() => onSelectAgentLiquidityStatusPreviewState('timed_out')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentLiquidityStatusPreviewState === 'timed_out'
                      ? 'bg-slate-700/50 border-slate-600/60 text-slate-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Timed Out
                </button>
                <button
                  onClick={() => onSelectAgentLiquidityStatusPreviewState('match_unavailable')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentLiquidityStatusPreviewState === 'match_unavailable'
                      ? 'bg-amber-500/20 border-amber-400/60 text-amber-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Match Unavailable
                </button>
                <button
                  onClick={() => onSelectAgentLiquidityStatusPreviewState('connection_issue')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentLiquidityStatusPreviewState === 'connection_issue'
                      ? 'bg-amber-600/20 border-amber-500/60 text-amber-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Connection Issue
                </button>
              </div>
            </div>
          )}

          {/* Preview State Controls (For Screen 12: Agent Liquidity Exchange) */}
          {currentRoute === 'agent_liquidity_exchange' && onSelectAgentLiquidityExchangePreviewState && (
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col gap-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Preview State
                </span>
                {onResetApp && (
                  <button
                    onClick={onResetApp}
                    title="Reset Screen"
                    className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-1 gap-1.5">
                <button
                  onClick={() => onSelectAgentLiquidityExchangePreviewState('cash_ready')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentLiquidityExchangePreviewState === 'cash_ready'
                      ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Cash Exchange Ready
                </button>
                <button
                  onClick={() => onSelectAgentLiquidityExchangePreviewState('float_ready')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentLiquidityExchangePreviewState === 'float_ready'
                      ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-[#38BDF8] font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Float Exchange Ready
                </button>
                <button
                  onClick={() => onSelectAgentLiquidityExchangePreviewState('match_unavailable')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentLiquidityExchangePreviewState === 'match_unavailable'
                      ? 'bg-amber-500/20 border-amber-400/60 text-amber-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Match Unavailable
                </button>
                <button
                  onClick={() => onSelectAgentLiquidityExchangePreviewState('connection_issue')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentLiquidityExchangePreviewState === 'connection_issue'
                      ? 'bg-amber-600/20 border-amber-500/60 text-amber-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Connection Issue
                </button>
              </div>
            </div>
          )}

          {/* Preview State Controls (For Screen 13: Agent Liquidity Transaction) */}
          {currentRoute === 'agent_liquidity_transaction' && onSelectAgentLiquidityTransactionPreviewState && (
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col gap-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Preview State
                </span>
                <span className="text-[10px] text-slate-500 font-mono">13 — Transaction</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => onSelectAgentLiquidityTransactionPreviewState('cash_ready')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentLiquidityTransactionPreviewState === 'cash_ready'
                      ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-white font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Cash Ready
                </button>
                <button
                  onClick={() => onSelectAgentLiquidityTransactionPreviewState('float_ready')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentLiquidityTransactionPreviewState === 'float_ready'
                      ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-[#38BDF8] font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Float Ready
                </button>
                <button
                  onClick={() => onSelectAgentLiquidityTransactionPreviewState('confirm_exchange')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentLiquidityTransactionPreviewState === 'confirm_exchange'
                      ? 'bg-blue-600/20 border-blue-500/60 text-blue-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Confirm Exchange
                </button>
                <button
                  onClick={() => onSelectAgentLiquidityTransactionPreviewState('recording')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentLiquidityTransactionPreviewState === 'recording'
                      ? 'bg-indigo-600/20 border-indigo-500/60 text-indigo-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Recording
                </button>
                <button
                  onClick={() => onSelectAgentLiquidityTransactionPreviewState('exchange_recorded')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentLiquidityTransactionPreviewState === 'exchange_recorded'
                      ? 'bg-emerald-600/20 border-emerald-500/60 text-emerald-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Exchange Recorded
                </button>
                <button
                  onClick={() => onSelectAgentLiquidityTransactionPreviewState('status_not_confirmed')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentLiquidityTransactionPreviewState === 'status_not_confirmed'
                      ? 'bg-amber-500/20 border-amber-400/60 text-amber-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Status Not Confirmed
                </button>
                <button
                  onClick={() => onSelectAgentLiquidityTransactionPreviewState('connection_issue')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentLiquidityTransactionPreviewState === 'connection_issue'
                      ? 'bg-amber-600/20 border-amber-500/60 text-amber-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Connection Issue
                </button>
              </div>
            </div>
          )}

          {/* Preview State Controls (For Agent Liquidity Completion - Screen 14) */}
          {currentRoute === 'agent_liquidity_completion' && onSelectAgentLiquidityCompletionPreviewState && (
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col gap-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Preview State
                </span>
                {onResetApp && (
                  <button
                    onClick={onResetApp}
                    title="Reset Screen"
                    className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-1.5">
                <button
                  onClick={() => onSelectAgentLiquidityCompletionPreviewState('cash_completed')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentLiquidityCompletionPreviewState === 'cash_completed'
                      ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-blue-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Cash Completed
                </button>
                <button
                  onClick={() => onSelectAgentLiquidityCompletionPreviewState('float_completed')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentLiquidityCompletionPreviewState === 'float_completed'
                      ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-blue-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Float Completed
                </button>
              </div>
            </div>
          )}

          {/* Preview State Controls (For Agent Transactions - Screen 15) */}
          {currentRoute === 'agent_transactions' && onSelectAgentTransactionsPreviewState && (
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col gap-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Preview State
                </span>
                {onResetApp && (
                  <button
                    onClick={onResetApp}
                    title="Reset Screen"
                    className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-1.5">
                <button
                  onClick={() => onSelectAgentTransactionsPreviewState('mixed_transactions')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentTransactionsPreviewState === 'mixed_transactions'
                      ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-blue-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Mixed Transactions
                </button>
                <button
                  onClick={() => onSelectAgentTransactionsPreviewState('customer_transactions')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentTransactionsPreviewState === 'customer_transactions'
                      ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-blue-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Customer Transactions
                </button>
                <button
                  onClick={() => onSelectAgentTransactionsPreviewState('agent_liquidity')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentTransactionsPreviewState === 'agent_liquidity'
                      ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-blue-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Agent Liquidity
                </button>
                <button
                  onClick={() => onSelectAgentTransactionsPreviewState('walk_in')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentTransactionsPreviewState === 'walk_in'
                      ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-blue-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Walk-In
                </button>
                <button
                  onClick={() => onSelectAgentTransactionsPreviewState('empty')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentTransactionsPreviewState === 'empty'
                      ? 'bg-slate-700/60 border-slate-600 text-slate-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Empty
                </button>
                <button
                  onClick={() => onSelectAgentTransactionsPreviewState('connection_issue')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentTransactionsPreviewState === 'connection_issue'
                      ? 'bg-amber-600/20 border-amber-500/60 text-amber-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Connection Issue
                </button>
              </div>
            </div>
          )}

          {/* Preview State Controls (For Agent More / Operations) */}
          {currentRoute === 'agent_more' && onSelectAgentMorePreviewState && (
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col gap-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Screen 16 Preview States
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {agentMorePreviewState}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                <button
                  onClick={() => onSelectAgentMorePreviewState('default')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentMorePreviewState === 'default'
                      ? 'bg-blue-600/20 border-blue-500/60 text-blue-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Default (Session Active • Online)
                </button>
                <button
                  onClick={() => onSelectAgentMorePreviewState('offline')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentMorePreviewState === 'offline'
                      ? 'bg-slate-700/60 border-slate-600 text-slate-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Offline (Session Active)
                </button>
                <button
                  onClick={() => onSelectAgentMorePreviewState('active_service_blocking')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentMorePreviewState === 'active_service_blocking'
                      ? 'bg-amber-600/20 border-amber-500/60 text-amber-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Active Service Blocking End Workday
                </button>
                <button
                  onClick={() => onSelectAgentMorePreviewState('connection_issue')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentMorePreviewState === 'connection_issue'
                      ? 'bg-amber-600/20 border-amber-500/60 text-amber-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Connection Issue
                </button>
              </div>
            </div>
          )}

          {/* Preview State Controls (For Screen 16 — End-of-Day Declaration) */}
          {currentRoute === 'end_of_day_declaration' && onSelectEndOfDayDeclarationPreviewState && (
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col gap-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Screen 16 Preview State
                </span>
                {onResetApp && (
                  <button
                    onClick={onResetApp}
                    className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Reset
                  </button>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => onSelectEndOfDayDeclarationPreviewState('default')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    endOfDayDeclarationPreviewState === 'default'
                      ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-white font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Default (Empty Amount)
                </button>
                <button
                  onClick={() => onSelectEndOfDayDeclarationPreviewState('remarks_required')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    endOfDayDeclarationPreviewState === 'remarks_required'
                      ? 'bg-[#0052CC]/20 border-[#0052CC]/60 text-white font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Remarks Required
                </button>
                <button
                  onClick={() => onSelectEndOfDayDeclarationPreviewState('submitting')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    endOfDayDeclarationPreviewState === 'submitting'
                      ? 'bg-blue-600/20 border-blue-500/60 text-blue-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Submitting
                </button>
                <button
                  onClick={() => onSelectEndOfDayDeclarationPreviewState('workday_ended')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    endOfDayDeclarationPreviewState === 'workday_ended'
                      ? 'bg-emerald-600/20 border-emerald-500/60 text-emerald-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Workday Ended
                </button>
                <button
                  onClick={() => onSelectEndOfDayDeclarationPreviewState('connection_issue')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    endOfDayDeclarationPreviewState === 'connection_issue'
                      ? 'bg-rose-600/20 border-rose-500/60 text-rose-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Connection Issue
                </button>
                <button
                  onClick={() => onSelectEndOfDayDeclarationPreviewState('status_not_confirmed')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    endOfDayDeclarationPreviewState === 'status_not_confirmed'
                      ? 'bg-amber-600/20 border-amber-500/60 text-amber-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Status Not Confirmed
                </button>
              </div>
            </div>
          )}

          {/* Preview State Controls (For Attendance Screen) */}
          {currentRoute === 'agent_attendance' && onSelectAgentAttendancePreviewState && (
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col gap-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Preview State
                </span>
                {onResetApp && (
                  <button
                    onClick={onResetApp}
                    title="Reset Screen"
                    className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-1 gap-1.5">
                <button
                  onClick={() => onSelectAgentAttendancePreviewState('current_active')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentAttendancePreviewState === 'current_active'
                      ? 'bg-blue-600/20 border-blue-500/60 text-blue-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Current Active (Default)
                </button>

                <button
                  onClick={() => onSelectAgentAttendancePreviewState('history')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentAttendancePreviewState === 'history'
                      ? 'bg-blue-600/20 border-blue-500/60 text-blue-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  History
                </button>

                <button
                  onClick={() => onSelectAgentAttendancePreviewState('auto_logout_record')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentAttendancePreviewState === 'auto_logout_record'
                      ? 'bg-amber-600/20 border-amber-500/60 text-amber-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Auto-Logout Record
                </button>

                <button
                  onClick={() => onSelectAgentAttendancePreviewState('missed_logout_record')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentAttendancePreviewState === 'missed_logout_record'
                      ? 'bg-rose-600/20 border-rose-500/60 text-rose-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Missed Logout Record
                </button>

                <button
                  onClick={() => onSelectAgentAttendancePreviewState('no_active_session')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentAttendancePreviewState === 'no_active_session'
                      ? 'bg-slate-700/80 border-slate-600 text-slate-100 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  No Active Session
                </button>

                <button
                  onClick={() => onSelectAgentAttendancePreviewState('connection_issue')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentAttendancePreviewState === 'connection_issue'
                      ? 'bg-rose-600/20 border-rose-500/60 text-rose-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Connection Issue
                </button>
              </div>
            </div>
          )}

          {/* Preview State Controls (For TellerBud Wallet) */}
          {currentRoute === 'agent_wallet' && onSelectAgentWalletPreviewState && (
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col gap-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Preview State
                </span>
                {onResetApp && (
                  <button
                    onClick={onResetApp}
                    title="Reset Screen"
                    className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => onSelectAgentWalletPreviewState('default')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentWalletPreviewState === 'default'
                      ? 'bg-blue-600/20 border-blue-500/60 text-blue-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Default (Mixed)
                </button>

                <button
                  onClick={() => onSelectAgentWalletPreviewState('credits_only')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentWalletPreviewState === 'credits_only'
                      ? 'bg-emerald-600/20 border-emerald-500/60 text-emerald-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Credits Only
                </button>

                <button
                  onClick={() => onSelectAgentWalletPreviewState('service_fees_only')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentWalletPreviewState === 'service_fees_only'
                      ? 'bg-blue-600/20 border-blue-500/60 text-blue-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Service Fees Only
                </button>

                <button
                  onClick={() => onSelectAgentWalletPreviewState('no_activity')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentWalletPreviewState === 'no_activity'
                      ? 'bg-slate-700/80 border-slate-600 text-slate-100 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  No Activity
                </button>

                <button
                  onClick={() => onSelectAgentWalletPreviewState('balance_unavailable')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentWalletPreviewState === 'balance_unavailable'
                      ? 'bg-amber-600/20 border-amber-500/60 text-amber-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Balance Unavailable
                </button>

                <button
                  onClick={() => onSelectAgentWalletPreviewState('connection_issue')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentWalletPreviewState === 'connection_issue'
                      ? 'bg-rose-600/20 border-rose-500/60 text-rose-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Connection Issue
                </button>
              </div>
            </div>
          )}

          {/* Screen 20 Agent Profile Preview States */}
          {currentRoute === 'agent_profile' && onSelectAgentProfilePreviewState && (
            <div className="p-4 border-t border-slate-800/80 bg-slate-900/60">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Screen 20 Preview States
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-400">
                  Profile
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onSelectAgentProfilePreviewState('default')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentProfilePreviewState === 'default'
                      ? 'bg-blue-600/20 border-blue-500/60 text-blue-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Default
                </button>

                <button
                  onClick={() => onSelectAgentProfilePreviewState('offline_session')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentProfilePreviewState === 'offline_session'
                      ? 'bg-blue-600/20 border-blue-500/60 text-blue-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Offline Session
                </button>

                <button
                  onClick={() =>
                    onSelectAgentProfilePreviewState('account_access_unavailable')
                  }
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentProfilePreviewState === 'account_access_unavailable'
                      ? 'bg-amber-600/20 border-amber-500/60 text-amber-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Account Access Unavailable
                </button>

                <button
                  onClick={() =>
                    onSelectAgentProfilePreviewState('connection_issue')
                  }
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentProfilePreviewState === 'connection_issue'
                      ? 'bg-rose-600/20 border-rose-500/60 text-rose-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Connection Issue
                </button>
              </div>
            </div>
          )}

          {/* Screen 21 Walk-In Transaction Preview States */}
          {currentRoute === 'walk_in_transaction' && onSelectWalkInPreviewState && (
            <div className="p-4 border-t border-slate-800/80 bg-slate-900/60">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Screen 21 Preview States
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-400">
                  Walk-In
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onSelectWalkInPreviewState('ready')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    walkInPreviewState === 'ready'
                      ? 'bg-blue-600/20 border-blue-500/60 text-blue-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Ready (Default)
                </button>

                <button
                  onClick={() => onSelectWalkInPreviewState('cash_in_ready')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    walkInPreviewState === 'cash_in_ready'
                      ? 'bg-blue-600/20 border-blue-500/60 text-blue-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Deposit Ready
                </button>

                <button
                  onClick={() => onSelectWalkInPreviewState('cash_in_ussd')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    walkInPreviewState === 'cash_in_ussd' || walkInPreviewState === 'ussd_in_progress'
                      ? 'bg-blue-600/20 border-blue-500/60 text-blue-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Deposit USSD
                </button>

                <button
                  onClick={() => onSelectWalkInPreviewState('cash_in_performed')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    walkInPreviewState === 'cash_in_performed'
                      ? 'bg-blue-600/20 border-blue-500/60 text-blue-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Deposit Performed
                </button>

                <button
                  onClick={() => onSelectWalkInPreviewState('cash_in_recorded')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    walkInPreviewState === 'cash_in_recorded'
                      ? 'bg-emerald-600/20 border-emerald-500/60 text-emerald-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Deposit Recorded
                </button>

                <button
                  onClick={() => onSelectWalkInPreviewState('cash_out_ready')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    walkInPreviewState === 'cash_out_ready'
                      ? 'bg-blue-600/20 border-blue-500/60 text-blue-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Withdrawal Ready
                </button>

                <button
                  onClick={() => onSelectWalkInPreviewState('cash_out_performed')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    walkInPreviewState === 'cash_out_performed'
                      ? 'bg-blue-600/20 border-blue-500/60 text-blue-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Withdrawal Performed
                </button>

                <button
                  onClick={() => onSelectWalkInPreviewState('cash_out_recorded')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    walkInPreviewState === 'cash_out_recorded' || walkInPreviewState === 'transaction_recorded'
                      ? 'bg-emerald-600/20 border-emerald-500/60 text-emerald-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Withdrawal Recorded
                </button>

                <button
                  onClick={() => onSelectWalkInPreviewState('recording')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    walkInPreviewState === 'recording'
                      ? 'bg-blue-600/20 border-blue-500/60 text-blue-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Recording...
                </button>

                <button
                  onClick={() => onSelectWalkInPreviewState('vendor_required')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    walkInPreviewState === 'vendor_required'
                      ? 'bg-blue-600/20 border-blue-500/60 text-blue-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Vendor Required
                </button>

                <button
                  onClick={() => onSelectWalkInPreviewState('transaction_failed')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    walkInPreviewState === 'transaction_failed'
                      ? 'bg-rose-600/20 border-rose-500/60 text-rose-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Transaction Failed
                </button>

                <button
                  onClick={() => onSelectWalkInPreviewState('result_unknown')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    walkInPreviewState === 'result_unknown'
                      ? 'bg-amber-600/20 border-amber-500/60 text-amber-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Result Unknown
                </button>

                <button
                  onClick={() => onSelectWalkInPreviewState('connection_issue')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    walkInPreviewState === 'connection_issue'
                      ? 'bg-rose-600/20 border-rose-500/60 text-rose-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Connection Issue
                </button>

                <button
                  onClick={() => onSelectWalkInPreviewState('no_active_session')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    walkInPreviewState === 'no_active_session'
                      ? 'bg-rose-600/20 border-rose-500/60 text-rose-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  No Active Session
                </button>
              </div>
            </div>
          )}

          {/* Screen 22 Incoming Agent Liquidity Request Preview States */}
          {currentRoute === 'incoming_agent_liquidity' && onSelectAgentLiquidityIncomingPreviewState && (
            <div className="p-4 border-t border-slate-800/80 bg-slate-900/60">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Screen 22 Preview States
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-400">
                  Incoming Liquidity
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onSelectAgentLiquidityIncomingPreviewState('incoming_cash')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentLiquidityIncomingPreviewState === 'incoming_cash'
                      ? 'bg-blue-600/20 border-blue-500/60 text-blue-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Cash Request
                </button>

                <button
                  onClick={() => onSelectAgentLiquidityIncomingPreviewState('incoming_float')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentLiquidityIncomingPreviewState === 'incoming_float'
                      ? 'bg-blue-600/20 border-blue-500/60 text-blue-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Float Request
                </button>

                <button
                  onClick={() => onSelectAgentLiquidityIncomingPreviewState('accepting')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentLiquidityIncomingPreviewState === 'accepting'
                      ? 'bg-blue-600/20 border-blue-500/60 text-blue-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Accepting
                </button>

                <button
                  onClick={() => onSelectAgentLiquidityIncomingPreviewState('matched')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentLiquidityIncomingPreviewState === 'matched'
                      ? 'bg-emerald-600/20 border-emerald-500/60 text-emerald-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Match Confirmed
                </button>

                <button
                  onClick={() => onSelectAgentLiquidityIncomingPreviewState('rejected')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentLiquidityIncomingPreviewState === 'rejected'
                      ? 'bg-slate-600/20 border-slate-500/60 text-slate-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Rejected
                </button>

                <button
                  onClick={() => onSelectAgentLiquidityIncomingPreviewState('timed_out')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentLiquidityIncomingPreviewState === 'timed_out'
                      ? 'bg-slate-600/20 border-slate-500/60 text-slate-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Timed Out
                </button>

                <button
                  onClick={() => onSelectAgentLiquidityIncomingPreviewState('request_taken')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentLiquidityIncomingPreviewState === 'request_taken'
                      ? 'bg-amber-600/20 border-amber-500/60 text-amber-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Request Taken
                </button>

                <button
                  onClick={() => onSelectAgentLiquidityIncomingPreviewState('connection_issue')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentLiquidityIncomingPreviewState === 'connection_issue'
                      ? 'bg-rose-600/20 border-rose-500/60 text-rose-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Connection Issue
                </button>

                <button
                  onClick={() => onSelectAgentLiquidityIncomingPreviewState('status_not_confirmed')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentLiquidityIncomingPreviewState === 'status_not_confirmed'
                      ? 'bg-rose-600/20 border-rose-500/60 text-rose-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Status Unconfirmed
                </button>
              </div>
            </div>
          )}

          {/* Preview State Controls (For Business Owner Request Status) */}
          {currentRoute === 'business_owner_liquidity_detail' &&
            onSelectBusinessOwnerLiquidityPreviewState && (
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col gap-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Preview State
                  </span>
                  {onResetApp && (
                    <button
                      onClick={onResetApp}
                      title="Reset Screen"
                      className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-1.5">
                  <button
                    onClick={() =>
                      onSelectBusinessOwnerLiquidityPreviewState('pending_review')
                    }
                    className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      businessOwnerLiquidityPreviewState === 'pending_review'
                        ? 'bg-amber-600/20 border-amber-500/60 text-amber-200 font-semibold'
                        : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    Pending Review
                  </button>

                  <button
                    onClick={() =>
                      onSelectBusinessOwnerLiquidityPreviewState('approved')
                    }
                    className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      businessOwnerLiquidityPreviewState === 'approved'
                        ? 'bg-blue-600/20 border-blue-500/60 text-blue-200 font-semibold'
                        : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    Approved
                  </button>

                  <button
                    onClick={() =>
                      onSelectBusinessOwnerLiquidityPreviewState('rejected')
                    }
                    className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      businessOwnerLiquidityPreviewState === 'rejected'
                        ? 'bg-rose-600/20 border-rose-500/60 text-rose-200 font-semibold'
                        : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    Rejected
                  </button>

                  <button
                    onClick={() =>
                      onSelectBusinessOwnerLiquidityPreviewState('pending_payment')
                    }
                    className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      businessOwnerLiquidityPreviewState === 'pending_payment'
                        ? 'bg-indigo-600/20 border-indigo-500/60 text-indigo-200 font-semibold'
                        : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    Pending Payment
                  </button>

                  <button
                    onClick={() =>
                      onSelectBusinessOwnerLiquidityPreviewState('paid')
                    }
                    className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      businessOwnerLiquidityPreviewState === 'paid'
                        ? 'bg-emerald-600/20 border-emerald-500/60 text-emerald-200 font-semibold'
                        : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    Paid
                  </button>

                  <button
                    onClick={() =>
                      onSelectBusinessOwnerLiquidityPreviewState('returned')
                    }
                    className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      businessOwnerLiquidityPreviewState === 'returned'
                        ? 'bg-blue-600/20 border-blue-500/60 text-blue-200 font-semibold'
                        : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    Returned
                  </button>

                  <button
                    onClick={() =>
                      onSelectBusinessOwnerLiquidityPreviewState('business_admin_confirmed')
                    }
                    className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      businessOwnerLiquidityPreviewState === 'business_admin_confirmed'
                        ? 'bg-emerald-600/20 border-emerald-500/60 text-emerald-200 font-semibold'
                        : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    Business Admin Confirmed
                  </button>

                  <button
                    onClick={() =>
                      onSelectBusinessOwnerLiquidityPreviewState('cancelled')
                    }
                    className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      businessOwnerLiquidityPreviewState === 'cancelled'
                        ? 'bg-slate-600/20 border-slate-500/60 text-slate-200 font-semibold'
                        : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    Cancelled
                  </button>

                  <button
                    onClick={() =>
                      onSelectBusinessOwnerLiquidityPreviewState('connection_issue')
                    }
                    className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      businessOwnerLiquidityPreviewState === 'connection_issue'
                        ? 'bg-rose-600/20 border-rose-500/60 text-rose-200 font-semibold'
                        : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    Connection Issue
                  </button>
                </div>
              </div>
            )}

          {/* Preview State Controls (For SMS Inbox Screen 24) */}
          {currentRoute === 'agent_sms_inbox' && onSelectAgentSmsInboxPreviewState && (
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col gap-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Preview State
                </span>
                {onResetApp && (
                  <button
                    onClick={onResetApp}
                    title="Reset Screen"
                    className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-1 gap-1.5">
                <button
                  onClick={() => onSelectAgentSmsInboxPreviewState('default')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentSmsInboxPreviewState === 'default'
                      ? 'bg-blue-600/20 border-blue-500/60 text-blue-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Default Messages
                </button>

                <button
                  onClick={() => onSelectAgentSmsInboxPreviewState('empty_inbox')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentSmsInboxPreviewState === 'empty_inbox'
                      ? 'bg-purple-600/20 border-purple-500/60 text-purple-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Empty Inbox
                </button>

                <button
                  onClick={() => onSelectAgentSmsInboxPreviewState('sms_unavailable')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentSmsInboxPreviewState === 'sms_unavailable'
                      ? 'bg-rose-600/20 border-rose-500/60 text-rose-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  SMS Unavailable
                </button>

                <button
                  onClick={() => onSelectAgentSmsInboxPreviewState('unread_messages')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentSmsInboxPreviewState === 'unread_messages'
                      ? 'bg-sky-600/20 border-sky-500/60 text-sky-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Unread Messages
                </button>
              </div>
            </div>
          )}

          {/* Preview State Controls (For Daily Summary Report) */}
          {currentRoute === 'agent_daily_summary_report' && onSelectAgentDailySummaryReportPreviewState && (
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Preview State
                </span>
                <span className="text-[10px] text-blue-400 font-medium">Screen 25</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-1 gap-1.5">
                <button
                  onClick={() => onSelectAgentDailySummaryReportPreviewState('default')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentDailySummaryReportPreviewState === 'default'
                      ? 'bg-blue-600/20 border-blue-500/60 text-blue-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Default Report
                </button>

                <button
                  onClick={() => onSelectAgentDailySummaryReportPreviewState('no_transactions')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentDailySummaryReportPreviewState === 'no_transactions'
                      ? 'bg-purple-600/20 border-purple-500/60 text-purple-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  No Transactions
                </button>

                <button
                  onClick={() => onSelectAgentDailySummaryReportPreviewState('loading')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentDailySummaryReportPreviewState === 'loading'
                      ? 'bg-amber-600/20 border-amber-500/60 text-amber-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Loading
                </button>

                <button
                  onClick={() => onSelectAgentDailySummaryReportPreviewState('connection_issue')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentDailySummaryReportPreviewState === 'connection_issue'
                      ? 'bg-rose-600/20 border-rose-500/60 text-rose-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Connection Issue
                </button>

                <button
                  onClick={() => onSelectAgentDailySummaryReportPreviewState('historical_date')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentDailySummaryReportPreviewState === 'historical_date'
                      ? 'bg-emerald-600/20 border-emerald-500/60 text-emerald-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Historical Date
                </button>
              </div>
            </div>
          )}

          {/* Preview State Controls (For Change Passcode — Screen 26) */}
          {currentRoute === 'agent_change_passcode' && onSelectAgentChangePasscodePreviewState && (
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col gap-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Preview State
                </span>
                {onResetApp && (
                  <button
                    onClick={onResetApp}
                    title="Reset Screen"
                    className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-1 gap-1.5">
                <button
                  onClick={() => onSelectAgentChangePasscodePreviewState('default')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentChangePasscodePreviewState === 'default'
                      ? 'bg-blue-600/20 border-blue-500/60 text-blue-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Default
                </button>

                <button
                  onClick={() => onSelectAgentChangePasscodePreviewState('validation_error')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentChangePasscodePreviewState === 'validation_error'
                      ? 'bg-amber-600/20 border-amber-500/60 text-amber-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Validation Error
                </button>

                <button
                  onClick={() => onSelectAgentChangePasscodePreviewState('mismatch_error')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentChangePasscodePreviewState === 'mismatch_error'
                      ? 'bg-rose-600/20 border-rose-500/60 text-rose-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Passcodes Do Not Match
                </button>

                <button
                  onClick={() => onSelectAgentChangePasscodePreviewState('saving')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentChangePasscodePreviewState === 'saving'
                      ? 'bg-indigo-600/20 border-indigo-500/60 text-indigo-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Saving
                </button>

                <button
                  onClick={() => onSelectAgentChangePasscodePreviewState('passcode_updated')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentChangePasscodePreviewState === 'passcode_updated'
                      ? 'bg-emerald-600/20 border-emerald-500/60 text-emerald-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Passcode Updated
                </button>

                <button
                  onClick={() => onSelectAgentChangePasscodePreviewState('connection_issue')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentChangePasscodePreviewState === 'connection_issue'
                      ? 'bg-rose-600/20 border-rose-500/60 text-rose-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Connection Issue
                </button>
              </div>
            </div>
          )}

          {/* Preview State Controls (For Chats — Screen 27) */}
          {currentRoute === 'agent_chats' && onSelectAgentChatsPreviewState && (
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col gap-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Preview State
                </span>
                {onResetApp && (
                  <button
                    onClick={onResetApp}
                    title="Reset Screen"
                    className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-1 gap-1.5">
                <button
                  onClick={() => onSelectAgentChatsPreviewState('default')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentChatsPreviewState === 'default'
                      ? 'bg-blue-600/20 border-blue-500/60 text-blue-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Default (All Chats)
                </button>

                <button
                  onClick={() => onSelectAgentChatsPreviewState('customer_chats')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentChatsPreviewState === 'customer_chats'
                      ? 'bg-indigo-600/20 border-indigo-500/60 text-indigo-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Customer Chats Filter
                </button>

                <button
                  onClick={() => onSelectAgentChatsPreviewState('agent_chats')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentChatsPreviewState === 'agent_chats'
                      ? 'bg-emerald-600/20 border-emerald-500/60 text-emerald-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Agent Liquidity Chats
                </button>

                <button
                  onClick={() => onSelectAgentChatsPreviewState('unread_messages')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentChatsPreviewState === 'unread_messages'
                      ? 'bg-amber-600/20 border-amber-500/60 text-amber-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Unread Messages
                </button>

                <button
                  onClick={() => onSelectAgentChatsPreviewState('empty_chats')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentChatsPreviewState === 'empty_chats'
                      ? 'bg-purple-600/20 border-purple-500/60 text-purple-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Empty Inbox
                </button>

                <button
                  onClick={() => onSelectAgentChatsPreviewState('connection_issue')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentChatsPreviewState === 'connection_issue'
                      ? 'bg-rose-600/20 border-rose-500/60 text-rose-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Connection Issue
                </button>
              </div>
            </div>
          )}

          {/* Preview State Controls (For Chat Conversation — Screen 28) */}
          {currentRoute === 'agent_chat_conversation' && onSelectAgentChatConversationPreviewState && (
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col gap-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Preview State
                </span>
                {onResetApp && (
                  <button
                    onClick={onResetApp}
                    title="Reset Screen"
                    className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-1 gap-1.5">
                <button
                  onClick={() => onSelectAgentChatConversationPreviewState('customer_chat_active')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentChatConversationPreviewState === 'customer_chat_active'
                      ? 'bg-blue-600/20 border-blue-500/60 text-blue-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Customer Chat (Active)
                </button>

                <button
                  onClick={() => onSelectAgentChatConversationPreviewState('agent_chat_active')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentChatConversationPreviewState === 'agent_chat_active'
                      ? 'bg-emerald-600/20 border-emerald-500/60 text-emerald-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Agent Chat (Active)
                </button>

                <button
                  onClick={() => onSelectAgentChatConversationPreviewState('closed_conversation')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentChatConversationPreviewState === 'closed_conversation'
                      ? 'bg-purple-600/20 border-purple-500/60 text-purple-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Closed / Read-Only
                </button>

                <button
                  onClick={() => onSelectAgentChatConversationPreviewState('send_failed')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentChatConversationPreviewState === 'send_failed'
                      ? 'bg-amber-600/20 border-amber-500/60 text-amber-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Send Failed
                </button>

                <button
                  onClick={() => onSelectAgentChatConversationPreviewState('connection_issue')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    agentChatConversationPreviewState === 'connection_issue'
                      ? 'bg-rose-600/20 border-rose-500/60 text-rose-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Connection Issue
                </button>
              </div>
            </div>
          )}

          {/* Preview State Controls (For About TellerBud) */}
          {currentRoute === 'about_tellerbud' && onSelectAboutTellerBudPreviewState && (
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col gap-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Preview State
                </span>
                {onResetApp && (
                  <button
                    onClick={onResetApp}
                    title="Reset Screen"
                    className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-1 gap-1.5">
                <button
                  onClick={() => onSelectAboutTellerBudPreviewState('default')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    aboutTellerBudPreviewState === 'default'
                      ? 'bg-blue-600/20 border-blue-500/60 text-blue-200 font-semibold'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Default
                </button>
              </div>
            </div>
          )}
        </aside>

        {/* Center Mobile Phone Preview Workspace */}
        <main className="flex-1 w-full overflow-y-auto flex flex-col items-center justify-start min-h-0 bg-slate-950 px-4 pt-6 pb-12">
          <div className="flex items-start justify-center w-full">
            <div
              className="relative w-[360px] h-[780px] shrink-0 bg-slate-950 rounded-[44px] p-3 shadow-2xl border-4 border-slate-800 ring-1 ring-slate-700/50 flex flex-col transition-all duration-200 overflow-hidden transform scale-[0.91] origin-top"
            >
            {/* Device Outer Bevel / Speaker Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5 bg-slate-900 rounded-b-xl z-30 flex items-center justify-center">
              <div className="w-10 h-1 bg-slate-700/80 rounded-full"></div>
            </div>

            {/* Mobile Screen Surface */}
            <div className={`relative w-full h-full ${isHomeScreen ? 'bg-white' : 'bg-slate-50'} rounded-[34px] flex flex-col overflow-hidden shadow-inner`}>
              {/* Native Android Status Bar */}
              <div
                className={`w-full h-10 pt-2 px-6 ${
                  isHomeScreen ? 'bg-white text-[#001A41]' : 'bg-slate-50 text-slate-800'
                } flex items-center justify-between text-[13px] font-semibold tracking-tight z-20 shrink-0 select-none transition-colors duration-200`}
              >
                <span>{currentTime}</span>
                <div
                  className={`flex items-center gap-2 ${
                    isHomeScreen ? 'text-[#001A41]' : 'text-slate-700'
                  }`}
                >
                  <Signal className="w-3.5 h-3.5 stroke-[2.5]" />
                  <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />
                  <Battery className="w-4 h-4 stroke-[2.5]" />
                </div>
              </div>

              {/* Render Mobile Screen Viewport */}
              <div className="flex-1 w-full h-full overflow-hidden flex flex-col relative">
                {children}
              </div>

              {/* Native Android Bottom Gesture Navigation Bar */}
              <div
                className={`w-full h-5 ${
                  isHomeScreen ? 'bg-white' : 'bg-slate-50'
                } flex items-center justify-center shrink-0 z-20 pb-1 transition-colors duration-200`}
              >
                <div
                  className={`w-32 h-1 ${
                    isHomeScreen ? 'bg-slate-300' : 'bg-slate-300'
                  } rounded-full`}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
};


