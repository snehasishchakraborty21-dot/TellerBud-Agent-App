import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Clock,
  Store,
  Calendar,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  User,
  ShieldCheck,
} from 'lucide-react';
import { TellerBudLogo } from '../components/TellerBudLogo';
import {
  WorkAssignment,
  AgentAttendancePreviewState,
  AttendanceRecord,
} from '../types';
import {
  useSharedClock,
  formatAppTime,
  calculateWorkingDuration,
  formatAttendanceRecordDate,
  createSeedAttendanceRecords,
} from '../utils/timeUtils';

interface AgentAttendanceScreenProps {
  assignment?: WorkAssignment;
  previewState?: AgentAttendancePreviewState;
  sessionStartTime?: string;
  loginTime?: string;
  hasActiveSession?: boolean;
  historyRecords?: AttendanceRecord[];
  onBack?: () => void;
}

const defaultAssignment: WorkAssignment = {
  business: 'Apex Retail Group',
  store: 'Central Mall Branch #104',
  booth: 'Booth 03 — Main Atrium',
  location: 'Plot 42, Commercial Avenue, Ikeja, Lagos',
  agentName: 'Marcus Vance',
  agentId: 'AG-88421',
};

export const AgentAttendanceScreen: React.FC<AgentAttendanceScreenProps> = ({
  assignment = defaultAssignment,
  previewState = 'current_active',
  sessionStartTime,
  loginTime,
  hasActiveSession = true,
  historyRecords,
  onBack,
}) => {
  // Shared live clock synchronized with mobile device
  const currentDate = useSharedClock(1000);

  // Segment view tab state: 'current' | 'history'
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [showConnectionError, setShowConnectionError] = useState<boolean>(false);

  // Dynamic session timestamp resolution
  const resolvedSessionStartTime =
    sessionStartTime ||
    formatAppTime(new Date(currentDate.getTime() - 45 * 60 * 1000));

  const resolvedLoginTime = loginTime || resolvedSessionStartTime;

  // Format current device time matching the shared live clock
  const currentDeviceTime = formatAppTime(currentDate);

  // Calculate live working duration mathematically: currentTime - sessionStart
  const calculateActiveDuration = (): string => {
    return calculateWorkingDuration(resolvedSessionStartTime, currentDeviceTime);
  };

  // Synchronize state with previewState
  useEffect(() => {
    switch (previewState) {
      case 'current_active':
        setActiveTab('current');
        setShowConnectionError(false);
        break;
      case 'history':
        setActiveTab('history');
        setShowConnectionError(false);
        break;
      case 'auto_logout_record':
        setActiveTab('history');
        setShowConnectionError(false);
        break;
      case 'missed_logout_record':
        setActiveTab('history');
        setShowConnectionError(false);
        break;
      case 'no_active_session':
        setActiveTab('current');
        setShowConnectionError(false);
        break;
      case 'connection_issue':
        setShowConnectionError(true);
        break;
    }
  }, [previewState]);

  const handleRetryRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setShowConnectionError(false);
    }, 600);
  };

  // Determine active session validity
  const isSessionActive =
    previewState !== 'no_active_session' && hasActiveSession;

  // Normalized history records with centralized mathematical date & duration resolution
  const normalizedRecords = React.useMemo(() => {
    const rawRecords =
      historyRecords && historyRecords.length > 0
        ? historyRecords
        : createSeedAttendanceRecords(currentDate);

    return rawRecords.map((rec) => {
      let dateLabel = rec.date;
      let dateGroup = rec.dateGroup;

      if (rec.rawDate) {
        const dateInfo = formatAttendanceRecordDate(rec.rawDate, currentDate);
        dateLabel = dateInfo.dateLabel;
        dateGroup = dateInfo.dateGroup;
      }

      // Calculate working duration from timestamps for consistency
      let workDuration = rec.workDuration;
      if (rec.sessionStart && rec.sessionEnd && rec.status !== 'missed_logout') {
        workDuration = calculateWorkingDuration(rec.sessionStart, rec.sessionEnd);
      } else if (rec.status === 'missed_logout') {
        workDuration = '—';
      }

      return {
        ...rec,
        date: dateLabel,
        dateGroup,
        workDuration,
        sessionEnd: rec.status === 'missed_logout' ? undefined : rec.sessionEnd,
      };
    });
  }, [historyRecords, currentDate]);

  // Filter history records for special preview cases
  const displayedHistoryRecords = React.useMemo(() => {
    if (previewState === 'auto_logout_record') {
      return normalizedRecords.filter((r) => r.status === 'auto_logout');
    }
    if (previewState === 'missed_logout_record') {
      return normalizedRecords.filter((r) => r.status === 'missed_logout');
    }
    return normalizedRecords;
  }, [normalizedRecords, previewState]);

  // Group history records dynamically
  const todayRecords = displayedHistoryRecords.filter((r) => r.dateGroup === 'today');
  const yesterdayRecords = displayedHistoryRecords.filter((r) => r.dateGroup === 'yesterday');
  const earlierRecords = displayedHistoryRecords.filter((r) => r.dateGroup === 'earlier');

  // Render record item helper
  const renderRecordCard = (record: AttendanceRecord) => {
    const isCompleted = record.status === 'completed';
    const isAutoLogout = record.status === 'auto_logout';
    const isMissedLogout = record.status === 'missed_logout';

    return (
      <div
        key={record.id}
        className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-2xs space-y-2.5 transition-all hover:border-slate-300"
      >
        {/* Header: Date + Status Badge */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{record.date}</span>
          </div>

          {isCompleted && (
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Completed
            </span>
          )}

          {isAutoLogout && (
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Auto-Logout
            </span>
          )}

          {isMissedLogout && (
            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200/80 px-2 py-0.5 rounded-md flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Missed Logout
            </span>
          )}
        </div>

        {/* Booth Information */}
        <div className="flex items-start gap-1.5 text-xs">
          <Store className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <span className="font-bold text-[#002244] leading-tight block break-words">
              {record.booth}
            </span>
            {record.store && (
              <span className="text-[10px] text-slate-400 leading-tight block truncate mt-0.5">
                {record.store}
              </span>
            )}
          </div>
        </div>

        {/* Timestamps & Duration Grid */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 text-xs">
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Session Time
            </span>
            <div className="font-semibold text-slate-700 text-[11px] leading-tight">
              {record.sessionStart} — {record.sessionEnd || '—'}
            </div>
          </div>

          <div className="space-y-0.5 text-right">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Work Duration
            </span>
            <div className="font-extrabold text-[#0052CC] text-[11px] leading-tight">
              {record.workDuration}
            </div>
          </div>
        </div>

        {/* Auto-Logout / Declaration Exception Sub-row (if specified) */}
        {record.declarationStatus && record.status !== 'completed' && (
          <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-medium">Closing Declaration</span>
            <span
              className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                record.declarationStatus === 'missing'
                  ? 'bg-amber-100/70 text-amber-800'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {record.declarationStatus === 'missing' ? 'Missing' : 'Pending Review'}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-full min-h-full bg-slate-50 flex flex-col justify-between text-slate-900 select-none overflow-hidden font-sans relative">
      {/* 1. Detail Header */}
      <header className="px-3.5 pt-3 pb-2.5 bg-white border-b border-slate-200/80 flex items-center justify-between shrink-0 z-10 shadow-2xs">
        <button
          onClick={() => {
            if (onBack) onBack();
          }}
          className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors active:scale-95"
          title="Back to More"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="text-xs font-bold text-slate-900 tracking-tight text-center truncate px-2">
          Attendance
        </div>

        <div className="flex items-center justify-center shrink-0">
          <TellerBudLogo size="sm" />
        </div>
      </header>

      {/* 2. Primary View Segmented Control */}
      <div className="px-3.5 pt-2.5 pb-1 bg-white border-b border-slate-200/60 shrink-0">
        <div className="grid grid-cols-2 p-0.5 rounded-xl bg-slate-100 border border-slate-200/70 text-xs font-bold">
          <button
            onClick={() => setActiveTab('current')}
            className={`py-1.5 rounded-lg transition-all text-center ${
              activeTab === 'current'
                ? 'bg-white text-[#0052CC] shadow-2xs font-extrabold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Current Session
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-1.5 rounded-lg transition-all text-center ${
              activeTab === 'history'
                ? 'bg-white text-[#0052CC] shadow-2xs font-extrabold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            History
          </button>
        </div>
      </div>

      {/* 3. Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-3.5 py-3 space-y-3">
        {/* Connection Issue Banner */}
        {showConnectionError && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2.5 shadow-2xs animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <div className="font-bold">Attendance couldn't be refreshed.</div>
              <p className="text-[11px] text-rose-800 leading-normal">
                Showing latest cached attendance data. Check connection and retry.
              </p>
              <button
                onClick={handleRetryRefresh}
                disabled={isRefreshing}
                className="mt-1 px-2.5 py-1 rounded-md bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] inline-flex items-center gap-1 transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Retry</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 1: CURRENT SESSION VIEW */}
        {activeTab === 'current' && (
          <div className="space-y-3">
            {isSessionActive ? (
              <>
                {/* Status Card: Session Active */}
                <div className="bg-white border border-emerald-200/90 rounded-2xl p-3.5 shadow-2xs flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-extrabold text-emerald-800">
                        Session Active
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                      Your current work session is in progress.
                    </p>
                  </div>
                </div>

                {/* Main Read-Only Details Card */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Current Session
                    </span>
                    <span className="text-[10px] font-semibold text-[#0052CC] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                      Live
                    </span>
                  </div>

                  {/* Details Grid */}
                  <div className="space-y-2.5 text-xs">
                    {/* Agent Name */}
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-slate-500 font-medium flex items-center gap-1.5 shrink-0">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        Agent
                      </span>
                      <span className="font-bold text-[#002244] text-right break-words">
                        {assignment.agentName || 'Marcus Vance'}
                      </span>
                    </div>

                    {/* Current Booth */}
                    <div className="flex items-start justify-between gap-2 pt-2 border-t border-slate-100">
                      <span className="text-slate-500 font-medium flex items-center gap-1.5 shrink-0">
                        <Store className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
                        Current Booth
                      </span>
                      <span className="font-bold text-[#002244] text-right break-words max-w-[200px] leading-snug">
                        {assignment.booth || 'Booth 03 — Main Atrium'}
                      </span>
                    </div>

                    {/* Secondary Context: Store */}
                    {assignment.store && (
                      <div className="flex items-start justify-between gap-2 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1.5 shrink-0 ml-5">
                          Location
                        </span>
                        <span className="text-right truncate max-w-[190px]">
                          {assignment.store}
                        </span>
                      </div>
                    )}

                    {/* Login Time */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                      <span className="text-slate-500 font-medium flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        Login Time
                      </span>
                      <span className="font-semibold text-slate-800">
                        {resolvedLoginTime}
                      </span>
                    </div>

                    {/* Session Start */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-500 font-medium flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        Session Start
                      </span>
                      <span className="font-semibold text-slate-800">
                        {resolvedSessionStartTime}
                      </span>
                    </div>

                    {/* Current Device Time */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-500 font-medium flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        Current Time
                      </span>
                      <span className="font-semibold text-slate-800">
                        {currentDeviceTime}
                      </span>
                    </div>

                    {/* Working Duration */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                      <span className="text-slate-500 font-medium flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#0052CC]" />
                        Working Duration
                      </span>
                      <span className="font-extrabold text-[#0052CC] text-sm font-mono">
                        {calculateActiveDuration()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Neutral Note */}
                <div className="p-3 rounded-xl bg-slate-100/80 border border-slate-200/60 text-center">
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    Attendance is recorded automatically for your current session.
                  </p>
                </div>
              </>
            ) : (
              /* EMPTY ACTIVE SESSION STATE */
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs text-center space-y-2.5">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto border border-slate-200/60">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#002244]">
                    No active session
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium mt-1">
                    Your current work session information will appear here after you sign in.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ATTENDANCE HISTORY VIEW */}
        {activeTab === 'history' && (
          <div className="space-y-3.5">
            {displayedHistoryRecords.length === 0 ? (
              /* EMPTY HISTORY STATE */
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs text-center space-y-2.5">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto border border-slate-200/60">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#002244]">
                    No attendance history yet
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium mt-1">
                    Completed work sessions will appear here.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Today Section */}
                {todayRecords.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                      Today
                    </div>
                    {todayRecords.map((rec) => renderRecordCard(rec))}
                  </div>
                )}

                {/* Yesterday Section */}
                {yesterdayRecords.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                      Yesterday
                    </div>
                    {yesterdayRecords.map((rec) => renderRecordCard(rec))}
                  </div>
                )}

                {/* Earlier Section */}
                {earlierRecords.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                      Earlier Sessions
                    </div>
                    {earlierRecords.map((rec) => renderRecordCard(rec))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

