import React, { useState } from 'react';
import { TellerBudLogo } from '../components/TellerBudLogo';
import { AndroidPhoneDialler } from '../components/AndroidPhoneDialler';
import { VendorUssdOverlay } from '../components/VendorUssdOverlay';
import {
  Bell,
  Home,
  FileText,
  CreditCard,
  MoreHorizontal,
  ChevronRight,
  User,
  Wallet,
  Clock,
  AlertCircle,
  Store,
  MessageSquare,
  FileSpreadsheet,
  KeyRound,
  TrendingUp,
  Coins,
  Smartphone,
  X,
  ArrowLeft,
  Inbox,
  Info,
} from 'lucide-react';
import {
  AgentMorePreviewState,
  WorkAssignment,
  AgentAvailabilitySetup,
  AgentWalletData,
  AgentEarningsSummary,
} from '../types';
import { PoweredByCinitecFooter } from '../components/PoweredByCinitecFooter';

interface AgentMoreScreenProps {
  previewState?: AgentMorePreviewState;
  assignment?: WorkAssignment;
  availability?: AgentAvailabilitySetup | null;
  walletData?: AgentWalletData;
  earnings?: AgentEarningsSummary;
  sessionStartTime?: string;
  onSelectTab?: (tab: 'home' | 'requests' | 'transactions' | 'more') => void;
  onUpdateAvailability?: () => void;
  onViewProfile?: () => void;
  onViewWallet?: () => void;
  onViewAttendance?: () => void;
  onViewChats?: () => void;
  unreadChatCount?: number;
  onViewSmsInbox?: () => void;
  onViewDailySummary?: () => void;
  onViewChangePasscode?: () => void;
  onViewAbout?: () => void;
}

export const AgentMoreScreen: React.FC<AgentMoreScreenProps> = ({
  previewState = 'default',
  assignment = {
    business: 'Apex Retail Group',
    store: 'MegaMart Ikeja Mall',
    booth: 'Booth 03 — Main Atrium',
    location: 'Ground Floor, Sector B',
    agentName: 'Marcus Vance',
    agentId: 'AG-88421',
  },
  availability,
  walletData = {
    balance: 'ZMW 25,000.00',
    currencyCode: 'ZMW',
    currencySymbol: 'ZMW',
  },
  earnings = {
    today: 'ZMW 350.00',
    thisWeek: 'ZMW 1,420.00',
    thisMonth: 'ZMW 4,850.00',
    currencySymbol: 'ZMW',
  },
  sessionStartTime,
  onSelectTab,
  onViewProfile,
  onViewWallet,
  onViewAttendance,
  onViewChats,
  unreadChatCount = 0,
  onViewSmsInbox,
  onViewDailySummary,
  onViewChangePasscode,
  onViewAbout,
}) => {
  // Modal and Sheet States
  const [showAgentInfoSheet, setShowAgentInfoSheet] = useState(false);
  const [showEarningsSheet, setShowEarningsSheet] = useState(false);
  const [showDialler, setShowDialler] = useState(false);
  const [showUssdSession, setShowUssdSession] = useState(false);
  const [dialledVendor, setDialledVendor] = useState<string>('');
  const [showReportsSheet, setShowReportsSheet] = useState(false);

  // Compute fallback session time if not provided from shared state
  const resolvedSessionStartTime =
    sessionStartTime ||
    (() => {
      const d = new Date();
      d.setMinutes(d.getMinutes() - 42);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    })();

  const isConnectionIssue = previewState === 'connection_issue';
  const isOfflineState = previewState === 'offline';

  // Active availability resolution
  const fallbackAvailability: AgentAvailabilitySetup = {
    status: 'online',
    service: 'delivery',
    cashBandId: 'cash_band_b',
    floatBandId: 'float_band_a',
  };
  const activeAvailability = availability || fallbackAvailability;
  const currentAvailabilityStatus = isOfflineState ? 'offline' : activeAvailability.status;

  return (
    <div
      id="screen-16-more"
      className="w-full h-full min-h-full bg-slate-50 flex flex-col justify-between text-slate-900 select-none overflow-hidden font-sans relative"
    >
      {/* 1. Root Screen Header */}
      <header className="px-3.5 pt-3 pb-2.5 bg-white border-b border-slate-200/80 flex items-center justify-between shrink-0 z-10 shadow-2xs">
        <div className="flex items-center gap-2">
          <TellerBudLogo size="sm" />
          <span className="text-sm font-extrabold text-[#002244] tracking-tight">
            TellerBud
          </span>
        </div>

        <div className="text-xs font-bold text-slate-800 tracking-tight">
          More
        </div>

        <button
          aria-label="Notifications"
          onClick={() => onSelectTab?.('requests')}
          className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors relative"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {isConnectionIssue && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#0052CC] ring-2 ring-white" />
          )}
        </button>
      </header>

      {/* 2. Main Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-3.5 py-3 space-y-3">
        {/* Connection Issue Warning Banner */}
        {isConnectionIssue && (
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/90 text-amber-900 flex items-center gap-2 text-xs shadow-2xs">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="flex-1 font-medium text-[11px]">
              Some account information couldn't be refreshed.
            </span>
          </div>
        )}

        {/* Agent Identity & Current Session Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-2xs space-y-3">
          <div className="flex items-start justify-between gap-2.5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0052CC]/15 to-[#002244]/15 border border-[#0052CC]/25 flex items-center justify-center text-[#0052CC] font-black text-base shrink-0">
                {assignment.agentName ? assignment.agentName.charAt(0) : 'A'}
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-extrabold text-[#002244] tracking-tight truncate">
                  {assignment.agentName || 'Marcus Vance'}
                </h2>
                <span className="text-[11px] font-mono font-medium text-slate-500 block">
                  Agent ID: {assignment.agentId || 'AG-88421'}
                </span>
              </div>
            </div>

            {/* Availability Status Badge */}
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                currentAvailabilityStatus === 'online'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/70'
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {currentAvailabilityStatus === 'online' ? 'Online' : 'Offline'}
            </span>
          </div>

          {/* Booth & Business Context */}
          <div className="pt-2 border-t border-slate-100 space-y-1 text-xs">
            <div className="flex items-center gap-1.5 text-slate-700 font-semibold truncate">
              <Store className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{assignment.booth || 'Booth 03 — Main Atrium'}</span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium pl-5 truncate">
              {assignment.store || 'Central Mall Branch #104'}
              {assignment.business ? ` • ${assignment.business}` : ''}
            </div>
          </div>

          {/* Session Status Indicator */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 font-bold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Session Active</span>
            </div>
            <span className="text-slate-400 font-medium">
              Started {resolvedSessionStartTime}
            </span>
          </div>
        </div>

        {/* 3. FOUR PRIMARY FUNCTION GROUPS */}
        <div className="space-y-2.5">
          {/* Primary Action 1: Agent Info */}
          <button
            type="button"
            id="more-action-agent-info"
            onClick={() => setShowAgentInfoSheet(true)}
            className="w-full bg-white border border-slate-200/90 hover:border-[#0052CC]/50 rounded-2xl p-3.5 text-left transition-all hover:shadow-xs group flex items-center justify-between min-h-[64px] shadow-2xs"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0052CC] flex items-center justify-center shrink-0 border border-blue-100 group-hover:bg-[#0052CC] group-hover:text-white transition-colors">
                <User className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-extrabold text-[#002244] leading-tight group-hover:text-[#0052CC] transition-colors">
                  Agent Info
                </div>
                <div className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                  Profile, earnings and account information
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0052CC] transition-colors shrink-0" />
          </button>

          {/* Primary Action 2: Balance Enquiry */}
          <button
            type="button"
            id="more-action-balance-enquiry"
            onClick={() => {
              setDialledVendor('');
              setShowDialler(true);
            }}
            className="w-full bg-white border border-slate-200/90 hover:border-emerald-500/50 rounded-2xl p-3.5 text-left transition-all hover:shadow-xs group flex items-center justify-between min-h-[64px] shadow-2xs"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-extrabold text-[#002244] leading-tight group-hover:text-emerald-700 transition-colors">
                  Balance Enquiry
                </div>
                <div className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                  Check your MNO mobile-money balance
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors shrink-0" />
          </button>

          {/* Primary Action 3: TellerBud Wallet */}
          <button
            type="button"
            id="more-action-tellerbud-wallet"
            onClick={() => {
              if (onViewWallet) onViewWallet();
            }}
            className="w-full bg-white border border-slate-200/90 hover:border-[#0052CC]/50 rounded-2xl p-3.5 text-left transition-all hover:shadow-xs group flex items-center justify-between min-h-[64px] shadow-2xs"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0052CC] flex items-center justify-center shrink-0 border border-sky-100 group-hover:bg-[#0052CC] group-hover:text-white transition-colors">
                <Wallet className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-extrabold text-[#002244] leading-tight group-hover:text-[#0052CC] transition-colors">
                    TellerBud Wallet
                  </span>
                  {walletData?.balance && (
                    <span className="text-xs font-extrabold text-[#002244] shrink-0 font-mono">
                      {walletData.balance}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                  Shared service-fee balance & activity
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0052CC] transition-colors shrink-0" />
          </button>

          {/* Primary Action 4: Reports */}
          <button
            type="button"
            id="more-action-reports"
            onClick={() => setShowReportsSheet(true)}
            className="w-full bg-white border border-slate-200/90 hover:border-amber-500/50 rounded-2xl p-3.5 text-left transition-all hover:shadow-xs group flex items-center justify-between min-h-[64px] shadow-2xs"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200/70 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-extrabold text-[#002244] leading-tight group-hover:text-amber-700 transition-colors">
                    Reports
                  </span>
                  {unreadChatCount > 0 && (
                    <span className="min-w-[18px] h-[18px] px-1.5 rounded-full bg-[#0052CC] text-white text-[10px] font-black flex items-center justify-center shrink-0">
                      {unreadChatCount}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                  Chats, SMS and daily transaction report
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors shrink-0" />
          </button>

          {/* Primary Action 5: About TellerBud */}
          <button
            type="button"
            id="more-action-about-tellerbud"
            onClick={() => {
              if (onViewAbout) onViewAbout();
            }}
            className="w-full bg-white border border-slate-200/90 hover:border-[#0052CC]/50 rounded-2xl p-3.5 text-left transition-all hover:shadow-xs group flex items-center justify-between min-h-[64px] shadow-2xs"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0052CC] flex items-center justify-center shrink-0 border border-blue-100 group-hover:bg-[#0052CC] group-hover:text-white transition-colors">
                <Info className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-extrabold text-[#002244] leading-tight group-hover:text-[#0052CC] transition-colors">
                  About TellerBud
                </div>
                <div className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                  App information, features and version details
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0052CC] transition-colors shrink-0" />
          </button>

          <PoweredByCinitecFooter className="py-2" />
        </div>
      </div>

      {/* ======================================================== */}
      {/* BOTTOM SHEET 1: AGENT INFO                               */}
      {/* ======================================================== */}
      {showAgentInfoSheet && (
        <div className="absolute inset-0 z-40 bg-slate-900/50 backdrop-blur-2xs flex flex-col justify-end animate-in fade-in duration-150">
          <div className="bg-white rounded-t-3xl border-t border-slate-200 p-4 pb-6 space-y-3 shadow-2xl animate-in slide-in-from-bottom duration-200">
            {/* Sheet Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0052CC] flex items-center justify-center border border-blue-100">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-[#002244] tracking-tight">
                    Agent Info
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAgentInfoSheet(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Agent Info Sub-menu list */}
            <div className="bg-white border border-slate-200/90 rounded-2xl divide-y divide-slate-100 shadow-2xs overflow-hidden">
              {/* Row 1: Profile */}
              <button
                type="button"
                id="agent-info-profile-row"
                onClick={() => {
                  setShowAgentInfoSheet(false);
                  if (onViewProfile) onViewProfile();
                }}
                className="w-full text-left p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 active:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200/60">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-900 leading-tight">Profile</div>
                    <div className="text-[10.5px] text-slate-500 font-medium leading-tight mt-0.5">
                      Agent & assignment details
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </button>

              {/* Row 2: Earnings */}
              <button
                type="button"
                id="agent-info-earnings-row"
                onClick={() => {
                  setShowAgentInfoSheet(false);
                  setShowEarningsSheet(true);
                }}
                className="w-full text-left p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 active:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0052CC] flex items-center justify-center shrink-0 border border-blue-100">
                    <Coins className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900 leading-tight">Earnings</span>
                      <span className="text-[11px] font-extrabold text-[#0052CC] font-mono">
                        {earnings.thisMonth || earnings.today}
                      </span>
                    </div>
                    <div className="text-[10.5px] text-slate-500 font-medium leading-tight mt-0.5">
                      Commission: Today, This Week & This Month
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </button>

              {/* Row 3: Attendance */}
              <button
                type="button"
                id="agent-info-attendance-row"
                onClick={() => {
                  setShowAgentInfoSheet(false);
                  if (onViewAttendance) onViewAttendance();
                }}
                className="w-full text-left p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 active:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200/60">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-900 leading-tight">Attendance</div>
                    <div className="text-[10.5px] text-slate-500 font-medium leading-tight mt-0.5">
                      Session and attendance history
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </button>

              {/* Row 4: Change Passcode */}
              <button
                type="button"
                id="agent-info-passcode-row"
                onClick={() => {
                  setShowAgentInfoSheet(false);
                  if (onViewChangePasscode) onViewChangePasscode();
                }}
                className="w-full text-left p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 active:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 border border-indigo-100">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-900 leading-tight">Change Passcode</div>
                    <div className="text-[10.5px] text-slate-500 font-medium leading-tight mt-0.5">
                      Update your Agent sign-in passcode
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* BOTTOM SHEET / MODAL: AGENT EARNINGS VIEW                */}
      {/* ======================================================== */}
      {showEarningsSheet && (
        <div className="absolute inset-0 z-40 bg-slate-900/50 backdrop-blur-2xs flex flex-col justify-end animate-in fade-in duration-150">
          <div className="bg-white rounded-t-3xl border-t border-slate-200 p-4 pb-6 space-y-3.5 shadow-2xl animate-in slide-in-from-bottom duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEarningsSheet(false);
                    setShowAgentInfoSheet(true);
                  }}
                  className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 mr-0.5"
                  title="Back to Agent Info"
                >
                  <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0052CC] flex items-center justify-center border border-blue-100">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-[#002244] tracking-tight">
                    Agent Earnings
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowEarningsSheet(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Approved status badge */}
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-bold text-slate-600">
                TellerBud Commission Summary
              </span>
              <span className="text-[10px] font-semibold text-[#0052CC] bg-blue-50 border border-blue-200/70 px-2 py-0.5 rounded-full flex items-center gap-1">
                <TrendingUp className="w-2.5 h-2.5 text-[#0052CC]" />
                Approved
              </span>
            </div>

            {/* 3-Column Earnings Breakdown: Today | This Week | This Month */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-2 text-center flex flex-col justify-center min-w-0">
                <span className="text-[9px] font-bold uppercase tracking-tight text-slate-400 block mb-1 whitespace-nowrap">
                  Today
                </span>
                <span className="text-xs font-extrabold font-mono text-slate-900 tracking-tight block truncate">
                  {earnings.today}
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-2 text-center flex flex-col justify-center min-w-0">
                <span className="text-[9px] font-bold uppercase tracking-tight text-slate-400 block mb-1 whitespace-nowrap">
                  This Week
                </span>
                <span className="text-xs font-extrabold font-mono text-slate-900 tracking-tight block truncate">
                  {earnings.thisWeek || 'ZMW 1,420.00'}
                </span>
              </div>

              <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-2 text-center shadow-2xs flex flex-col justify-center min-w-0">
                <span className="text-[9px] font-bold uppercase tracking-tight text-[#0052CC] block mb-1 whitespace-nowrap">
                  This Month
                </span>
                <span className="text-xs font-black font-mono text-[#002244] tracking-tight block truncate">
                  {earnings.thisMonth || 'ZMW 4,850.00'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowEarningsSheet(false)}
              className="w-full py-2.5 rounded-xl bg-[#0052CC] hover:bg-[#0043A4] text-white font-bold text-xs transition-colors shadow-xs"
            >
              Done
            </button>
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

      {/* Vendor USSD Session Modal for Balance Enquiry */}
      {showUssdSession && (
        <VendorUssdOverlay
          vendor={dialledVendor || 'MTN'}
          transactionType="Check Balance"
          amount=""
          requestRef="MNO-BAL"
          onSuccess={() => {
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

      {/* ======================================================== */}
      {/* BOTTOM SHEET 3: REPORTS                                  */}
      {/* ======================================================== */}
      {showReportsSheet && (
        <div className="absolute inset-0 z-40 bg-slate-900/50 backdrop-blur-2xs flex flex-col justify-end animate-in fade-in duration-150">
          <div className="bg-white rounded-t-3xl border-t border-slate-200 p-4 pb-6 space-y-3 shadow-2xl animate-in slide-in-from-bottom duration-200">
            {/* Sheet Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/70">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-[#002244] tracking-tight">
                    Reports
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowReportsSheet(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Reports Sub-menu list */}
            <div className="bg-white border border-slate-200/90 rounded-2xl divide-y divide-slate-100 shadow-2xs overflow-hidden">
              {/* Row 1: Chats */}
              <button
                type="button"
                id="reports-chats-row"
                onClick={() => {
                  setShowReportsSheet(false);
                  if (onViewChats) onViewChats();
                }}
                className="w-full text-left p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 active:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0052CC] flex items-center justify-center shrink-0 border border-blue-100">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900 leading-tight">Chats</span>
                      {unreadChatCount > 0 && (
                        <span className="min-w-[18px] h-[18px] px-1.5 rounded-full bg-[#0052CC] text-white text-[10px] font-black flex items-center justify-center shrink-0">
                          {unreadChatCount}
                        </span>
                      )}
                    </div>
                    <div className="text-[10.5px] text-slate-500 font-medium leading-tight mt-0.5">
                      Customer and Agent conversations
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </button>

              {/* Row 2: SMS Inbox */}
              <button
                type="button"
                id="reports-sms-inbox-row"
                onClick={() => {
                  setShowReportsSheet(false);
                  if (onViewSmsInbox) onViewSmsInbox();
                }}
                className="w-full text-left p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 active:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-xl bg-sky-50 text-[#0052CC] flex items-center justify-center shrink-0 border border-sky-100">
                    <Inbox className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-900 leading-tight">SMS Inbox</div>
                    <div className="text-[10.5px] text-slate-500 font-medium leading-tight mt-0.5">
                      Device SMS messages
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </button>

              {/* Row 3: Daily Summary Report */}
              <button
                type="button"
                id="reports-daily-summary-row"
                onClick={() => {
                  setShowReportsSheet(false);
                  if (onViewDailySummary) onViewDailySummary();
                }}
                className="w-full text-left p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 active:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200/70">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-900 leading-tight">Daily Summary Report</div>
                    <div className="text-[10.5px] text-slate-500 font-medium leading-tight mt-0.5">
                      View your daily transaction totals
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Fixed Operational 4-Tab Bottom Navigation (More Active) */}
      <nav className="bg-white border-t border-slate-200/90 px-3 py-2 flex items-center justify-around shrink-0 z-20 shadow-lg">
        <button
          onClick={() => {
            if (onSelectTab) onSelectTab('home');
          }}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 transition-colors py-0.5 px-3"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Home</span>
        </button>

        <button
          onClick={() => {
            if (onSelectTab) onSelectTab('requests');
          }}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 transition-colors py-0.5 px-3"
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Requests</span>
        </button>

        <button
          onClick={() => {
            if (onSelectTab) onSelectTab('transactions');
          }}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 transition-colors py-0.5 px-3"
        >
          <CreditCard className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Transactions</span>
        </button>

        <button
          onClick={() => {
            if (onSelectTab) onSelectTab('more');
          }}
          className="flex flex-col items-center gap-0.5 text-[#0052CC] font-extrabold py-0.5 px-3"
        >
          <MoreHorizontal className="w-5 h-5 stroke-[2.5]" />
          <span className="text-[10px]">More</span>
        </button>
      </nav>
    </div>
  );
};
