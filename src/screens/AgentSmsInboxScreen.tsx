import React from 'react';
import { TellerBudLogo } from '../components/TellerBudLogo';
import { ArrowLeft, MessageSquare, AlertCircle, RotateCcw } from 'lucide-react';
import { AgentSmsInboxPreviewState, SmsInboxMessage } from '../types';
import { getVendorLogo } from '../config/walkInConfig';
import { PoweredByCinitecFooter } from '../components/PoweredByCinitecFooter';

interface AgentSmsInboxScreenProps {
  previewState?: AgentSmsInboxPreviewState;
  onBack: () => void;
  messages?: SmsInboxMessage[];
  onRetry?: () => void;
}

export const SEED_SMS_MESSAGES: SmsInboxMessage[] = [
  {
    id: 'sms-001',
    sender: 'MTN MoMo',
    receivedAt: 'Today, 11:22 AM',
    dateGroup: 'Today',
    isUnread: true,
    body: 'Txn ID: MP240816.1122.A9841. Cash In of ZMW 35,000.00 to +260 971 234 567 completed successfully. Fee: ZMW 100.00. New MoMo balance: ZMW 185,450.00.',
  },
  {
    id: 'sms-002',
    sender: 'AirtelMoney',
    receivedAt: 'Today, 10:15 AM',
    dateGroup: 'Today',
    isUnread: false,
    body: 'You have received ZMW 50,000.00 from +260 962 987 654 (Chanda M.). Ref: ATM-889312. Available Balance: ZMW 220,000.00.',
  },
  {
    id: 'sms-003',
    sender: 'Zanaco Bank',
    receivedAt: 'Today, 09:05 AM',
    dateGroup: 'Today',
    isUnread: false,
    body: 'Acct **8421: Credit alert of ZMW 150,000.00 from APEX RETAIL GROUP LIQUIDITY DISBURSEMENT. Desc: Agent Booth 03 Float Top-up. Bal: ZMW 420,000.00.',
  },
  {
    id: 'sms-004',
    sender: 'Apex Admin',
    receivedAt: 'Yesterday, 04:30 PM',
    dateGroup: 'Yesterday',
    isUnread: false,
    body: 'Notice to all Lusaka Mall Agents: Daily shift reconciliation and cash declaration must be submitted before 06:00 PM.',
  },
  {
    id: 'sms-005',
    sender: 'MTN Service',
    receivedAt: 'Yesterday, 02:10 PM',
    dateGroup: 'Yesterday',
    isUnread: false,
    body: 'Agent Float Top-Up of ZMW 100,000.00 approved by SuperAgent #044. Txn: MTN-FLT-7729. Commission earned: ZMW 350.00.',
  },
  {
    id: 'sms-006',
    sender: 'Zamtel Mobile',
    receivedAt: 'Aug 14, 11:00 AM',
    dateGroup: 'Earlier',
    isUnread: false,
    body: 'Withdrawal of ZMW 20,000.00 processed for customer +260 955 551 234. Auth code: ZMT-4401. Remaining Agent Float: ZMW 64,800.00.',
  },
  {
    id: 'sms-007',
    sender: 'MDM Security',
    receivedAt: 'Aug 13, 08:00 AM',
    dateGroup: 'Earlier',
    isUnread: false,
    body: 'Device Knox MDM policy synced successfully. TellerBud Agent Client v2.4.1 verified and locked to kiosk profile.',
  },
];

export const AgentSmsInboxScreen: React.FC<AgentSmsInboxScreenProps> = ({
  previewState = 'default',
  onBack,
  messages = SEED_SMS_MESSAGES,
  onRetry,
}) => {
  const isUnavailable = previewState === 'sms_unavailable';
  const isEmpty = previewState === 'empty_inbox' || (!isUnavailable && messages.length === 0);

  // Group messages chronologically if dateGroup exists
  const displayedMessages = React.useMemo(() => {
    if (isUnavailable || isEmpty) return [];
    if (previewState === 'unread_messages') {
      return messages.map((m) => ({ ...m, isUnread: true }));
    }
    return messages;
  }, [messages, isUnavailable, isEmpty, previewState]);

  // Group by dateGroup (Today, Yesterday, Earlier)
  const groupedMessages = React.useMemo(() => {
    const groups: { [key: string]: SmsInboxMessage[] } = {};
    displayedMessages.forEach((msg) => {
      const groupKey = msg.dateGroup || 'Earlier';
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(msg);
    });
    return groups;
  }, [displayedMessages]);

  const groupOrder = ['Today', 'Yesterday', 'Earlier'];

  return (
    <div className="w-full h-full min-h-full bg-slate-50 flex flex-col justify-between text-slate-900 select-none overflow-hidden font-sans">
      {/* 1. Header: Back | SMS Inbox | TellerBud Logo */}
      <header className="px-3.5 pt-3 pb-2.5 bg-white border-b border-slate-200/80 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors -ml-0.5"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-sm font-bold text-[#002244] tracking-tight">
            SMS Inbox
          </h1>
        </div>

        <div className="flex items-center">
          <TellerBudLogo size="sm" />
        </div>
      </header>

      {/* 2. Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-3.5 py-3 space-y-3">
        {isUnavailable ? (
          /* SMS Unavailable State */
          <div className="h-full py-16 px-4 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-3">
              <AlertCircle className="w-6 h-6 stroke-[1.75]" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 mb-1">
              SMS unavailable
            </h3>
            <p className="text-xs text-slate-500 max-w-[220px] mb-4 leading-relaxed">
              Messages received on this device couldn't be loaded.
            </p>
            <button
              onClick={onRetry || (() => window.location.reload())}
              className="px-4 py-2 bg-[#0052CC] hover:bg-[#0041A3] active:bg-[#003380] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        ) : isEmpty ? (
          /* Empty State */
          <div className="h-full py-16 px-4 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mb-3">
              <MessageSquare className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 mb-1">
              No SMS messages
            </h3>
            <p className="text-xs text-slate-500 max-w-[220px] leading-relaxed">
              Messages received on this device will appear here.
            </p>
          </div>
        ) : (
          /* Chronological List of SMS Messages */
          <div className="space-y-4">
            {groupOrder.map((groupName) => {
              const msgsInGroup = groupedMessages[groupName];
              if (!msgsInGroup || msgsInGroup.length === 0) return null;

              return (
                <div key={groupName} className="space-y-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-0.5">
                    {groupName}
                  </div>

                  <div className="space-y-2">
                    {msgsInGroup.map((msg) => (
                      <div
                        key={msg.id}
                        className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs space-y-1.5"
                      >
                        {/* Header: Sender & Received Timestamp */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            {getVendorLogo(msg.sender) && (
                              <div className="w-4 h-4 rounded bg-white border border-slate-200 p-0.5 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                                <img
                                  src={getVendorLogo(msg.sender)}
                                  alt={msg.sender}
                                  className="w-full h-full object-contain"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                            )}
                            <span className="text-xs font-bold text-[#002244] truncate">
                              {msg.sender}
                            </span>
                            {msg.isUnread && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#0052CC] shrink-0" />
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 font-normal shrink-0">
                            {msg.receivedAt}
                          </span>
                        </div>

                        {/* Raw exact SMS message body */}
                        <p className="text-xs text-slate-800 font-normal leading-relaxed break-words whitespace-pre-line">
                          {msg.body}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <PoweredByCinitecFooter className="py-2" />
      </div>
    </div>
  );
};
