import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  User,
  Building2,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Info,
  Lock,
  Clock,
} from 'lucide-react';
import { TellerBudLogo } from '../components/TellerBudLogo';
import {
  WorkAssignment,
  AgentAvailabilitySetup,
  AgentProfilePreviewState,
} from '../types';
import { PoweredByCinitecFooter } from '../components/PoweredByCinitecFooter';

export interface AgentProfileScreenProps {
  previewState?: AgentProfilePreviewState;
  assignment?: WorkAssignment;
  availability?: AgentAvailabilitySetup | null;
  accountStatus?: 'Active' | 'Inactive' | 'Suspended';
  sessionStartTime?: string;
  onBack?: () => void;
}

export const AgentProfileScreen: React.FC<AgentProfileScreenProps> = ({
  previewState = 'default',
  assignment,
  availability,
  accountStatus = 'Active',
  sessionStartTime = '04:34 am',
  onBack,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [connectionRetrySuccess, setConnectionRetrySuccess] = useState(false);

  // Resolved assignment data from props or fallback defaults
  const currentAssignment = useMemo<WorkAssignment>(() => {
    return (
      assignment || {
        business: 'Apex Retail Group',
        store: 'Central Mall Branch #104',
        booth: 'Booth 03 — Main Atrium',
        location: 'Lusaka, Zambia',
        agentName: 'Marcus Vance',
        agentId: 'AG-88421',
      }
    );
  }, [assignment]);

  // Derive initials for avatar
  const initials = useMemo(() => {
    const name = currentAssignment.agentName || 'Marcus Vance';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }, [currentAssignment.agentName]);

  // Operational Availability state
  const isOfflineSession =
    previewState === 'offline_session' ||
    (previewState === 'default' && availability?.status === 'offline');

  const resolvedAvailability = isOfflineSession ? 'Offline' : 'Online';

  // Account Access state
  const isAccountUnavailable = previewState === 'account_access_unavailable';
  const showConnectionBanner =
    previewState === 'connection_issue' && !connectionRetrySuccess;

  const handleRetry = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setConnectionRetrySuccess(true);
    }, 650);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 relative overflow-hidden font-sans text-slate-900 select-none">
      {/* 1. Detail Header (Read-only, no bottom nav) */}
      <header className="bg-white border-b border-slate-200/80 px-4 py-3 shrink-0 flex items-center justify-between z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 active:text-[#0052CC] transition-colors py-1 pr-2 -ml-1"
          aria-label="Back to More"
        >
          <ChevronLeft className="w-4 h-4 text-slate-600" />
          <span>More</span>
        </button>

        <h1 className="text-sm font-bold text-slate-900 text-center tracking-tight">
          Agent Profile
        </h1>

        <div className="flex items-center justify-end w-10">
          <TellerBudLogo size="sm" />
        </div>
      </header>

      {/* 2. Scrollable Body Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3.5 space-y-3.5">
        {/* Connection Issue Banner (Preserves cached profile underneath) */}
        {showConnectionBanner && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between gap-2.5 shadow-2xs animate-fadeIn">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <p className="text-[11px] font-medium text-amber-900 leading-tight">
                Profile information couldn't be refreshed.
              </p>
            </div>
            <button
              onClick={handleRetry}
              disabled={isRefreshing}
              className="px-2.5 py-1 bg-amber-600 text-white rounded-lg text-[11px] font-bold shrink-0 hover:bg-amber-700 active:bg-amber-800 transition-colors flex items-center gap-1 disabled:opacity-60 shadow-2xs"
            >
              <RefreshCw
                className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`}
              />
              <span>{isRefreshing ? 'Retrying...' : 'Retry'}</span>
            </button>
          </div>
        )}

        {/* Blocking View: Account Access Unavailable */}
        {isAccountUnavailable ? (
          <div className="bg-white border border-rose-200/90 rounded-2xl p-6 text-center shadow-sm flex flex-col items-center justify-center my-6 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shadow-inner">
              <Lock className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-slate-900">
                Account access unavailable
              </h2>
              <p className="text-xs text-slate-500 max-w-[240px] leading-relaxed">
                Please contact your business administrator.
              </p>
            </div>

            <div className="pt-2 w-full">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-left space-y-1">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Agent ID
                </div>
                <div className="text-xs font-mono font-bold text-slate-700">
                  {currentAssignment.agentId}
                </div>
              </div>
            </div>

            <button
              onClick={onBack}
              className="mt-2 text-xs font-bold text-[#0052CC] hover:underline"
            >
              Return to More
            </button>
          </div>
        ) : (
          <>
            {/* 3. Top Profile Identity Card */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3.5">
              <div className="flex items-center gap-3.5">
                {/* TellerBud Avatar (Initials badge) */}
                <div className="relative shrink-0">
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#002244] to-[#0A3666] text-white flex items-center justify-center font-bold text-base tracking-wider shadow-sm border border-slate-700/20">
                    {initials}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-xs">
                    <User className="w-3 h-3 text-[#0052CC]" />
                  </div>
                </div>

                {/* Identity Information */}
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm font-bold text-slate-900 leading-tight truncate">
                    {currentAssignment.agentName}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] font-mono font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
                      {currentAssignment.agentId}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      •
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      Agent
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Row (Distinguishing Account Status vs Operational Availability) */}
              <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-slate-100">
                {/* Account Status */}
                <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-200/60">
                  <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider leading-none">
                    Account Status
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5 font-bold text-xs text-emerald-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span>{accountStatus}</span>
                  </div>
                </div>

                {/* Operational Availability (Read-only context) */}
                <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-200/60">
                  <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider leading-none">
                    Availability
                  </div>
                  <div
                    className={`flex items-center gap-1.5 mt-1.5 font-bold text-xs ${
                      resolvedAvailability === 'Online'
                        ? 'text-blue-700'
                        : 'text-slate-600'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        resolvedAvailability === 'Online'
                          ? 'bg-[#0052CC] animate-pulse'
                          : 'bg-slate-400'
                      }`}
                    />
                    <span>{resolvedAvailability}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Work Assignment Section (Read-only) */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-[#0052CC]" />
                  <h3 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Work Assignment
                  </h3>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                {/* Business */}
                <div className="flex items-start justify-between gap-3">
                  <span className="text-slate-500 font-medium shrink-0 pt-0.5">
                    Business
                  </span>
                  <span className="font-bold text-slate-900 text-right leading-tight">
                    {currentAssignment.business}
                  </span>
                </div>

                {/* Store */}
                <div className="flex items-start justify-between gap-3">
                  <span className="text-slate-500 font-medium shrink-0 pt-0.5">
                    Store
                  </span>
                  <span className="font-semibold text-slate-900 text-right leading-tight">
                    {currentAssignment.store}
                  </span>
                </div>

                {/* Booth (Full name without truncation; wraps naturally) */}
                <div className="flex items-start justify-between gap-3">
                  <span className="text-slate-500 font-medium shrink-0 pt-0.5">
                    Booth
                  </span>
                  <span className="font-semibold text-[#0052CC] text-right leading-tight break-words max-w-[200px]">
                    {currentAssignment.booth}
                  </span>
                </div>

                {/* Location */}
                <div className="flex items-start justify-between gap-3">
                  <span className="text-slate-500 font-medium shrink-0 pt-0.5">
                    Location
                  </span>
                  <span className="font-medium text-slate-700 text-right leading-tight flex items-center justify-end gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{currentAssignment.location}</span>
                  </span>
                </div>
              </div>

              {/* Management Controlled Notice */}
              <div className="pt-2 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-500 leading-snug">
                <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  Your profile and work assignment are managed by your business
                  administrator.
                </span>
              </div>
            </div>

            {/* 5. Access & Role Section */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0052CC]" />
                  <h3 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Access
                  </h3>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                {/* Role */}
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-500 font-medium">Role</span>
                  <span className="font-bold text-slate-900">Agent</span>
                </div>

                {/* Access Scope */}
                <div className="flex items-start justify-between gap-3">
                  <span className="text-slate-500 font-medium shrink-0 pt-0.5">
                    Access
                  </span>
                  <span className="font-semibold text-slate-800 text-right leading-tight">
                    Assigned Booth
                  </span>
                </div>

                {/* Current Session Context */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-500 font-medium flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Current Session</span>
                    </span>
                    <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Active</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-500 font-medium pl-5">Started</span>
                    <span className="font-medium text-slate-700">
                      {sessionStartTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <PoweredByCinitecFooter className="py-2" />
      </div>
    </div>
  );
};
