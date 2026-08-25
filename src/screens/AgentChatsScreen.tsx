import React, { useState } from 'react';
import { TellerBudLogo } from '../components/TellerBudLogo';
import {
  ArrowLeft,
  MessageSquare,
  Users,
  User,
  Clock,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  Lock,
} from 'lucide-react';
import { ChatConversation, AgentChatsPreviewState } from '../types';
import { PoweredByCinitecFooter } from '../components/PoweredByCinitecFooter';
import { getPreviewConversations, createSeedChatConversations } from '../data/chatData';

interface AgentChatsScreenProps {
  conversations?: ChatConversation[];
  previewState?: AgentChatsPreviewState;
  currentAgentId?: string;
  onBack?: () => void;
  onBackToMore?: () => void;
  onSelectConversation?: (conversation: ChatConversation) => void;
  onRefresh?: () => void;
  onRetry?: () => void;
}

export const AgentChatsScreen: React.FC<AgentChatsScreenProps> = ({
  conversations,
  previewState = 'default',
  currentAgentId,
  onBack,
  onBackToMore,
  onSelectConversation,
  onRefresh,
  onRetry,
}) => {
  const [filter, setFilter] = useState<'all' | 'customers' | 'agents'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const baseList = conversations && conversations.length > 0 ? conversations : createSeedChatConversations();
  const effectiveConversations = getPreviewConversations(baseList, previewState);

  // Apply tab filter on top of preview filtered conversations
  const filteredConversations = effectiveConversations.filter((conv) => {
    if (filter === 'customers') return conv.type === 'customer';
    if (filter === 'agents') return conv.type === 'agent';
    return true;
  });

  const isConnectionIssue = previewState === 'connection_issue';

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (onRefresh) onRefresh();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div
      id="agent-chats-screen"
      className="flex flex-col h-full bg-slate-50 text-slate-900 select-none overflow-hidden font-sans"
    >
      {/* 1. Header: Back | Chats | TellerBud T Logo */}
      <header className="px-3.5 py-2.5 bg-white border-b border-slate-200/90 flex items-center justify-between shrink-0 shadow-2xs z-10">
        <button
          onClick={onBack || onBackToMore}
          aria-label="Back to More"
          className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center">
          <h1 className="text-sm font-extrabold text-[#002244] tracking-tight">Chats</h1>
          <span className="text-[10px] text-slate-400 font-medium">Operational Messaging</span>
        </div>

        <div className="flex items-center justify-center shrink-0">
          <TellerBudLogo size="sm" />
        </div>
      </header>

      {/* 2. Filter Bar: All | Customers | Agents */}
      <div className="px-3.5 pt-3 pb-2 bg-white border-b border-slate-200/70 shrink-0">
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100/90 rounded-xl border border-slate-200/70">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center ${
              filter === 'all'
                ? 'bg-white text-[#0052CC] shadow-xs ring-1 ring-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilter('customers')}
            className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center ${
              filter === 'customers'
                ? 'bg-white text-[#0052CC] shadow-xs ring-1 ring-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Customers
          </button>
          <button
            type="button"
            onClick={() => setFilter('agents')}
            className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center ${
              filter === 'agents'
                ? 'bg-white text-[#0052CC] shadow-xs ring-1 ring-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Agents
          </button>
        </div>
      </div>

      {/* 3. Main Content: Connection Warning / Conversation List / Empty State */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-3.5 py-3 space-y-2.5">
        {/* Connection Issue Warning */}
        {isConnectionIssue && (
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between text-xs shadow-2xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="font-medium text-[11px]">Chat updates may be delayed.</span>
            </div>
            <button
              onClick={handleRefresh}
              className="text-xs font-bold text-amber-800 flex items-center gap-1 hover:underline shrink-0"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
              Retry
            </button>
          </div>
        )}

        {filteredConversations.length === 0 ? (
          /* Empty State */
          <div className="py-12 px-4 flex flex-col items-center justify-center text-center space-y-3 bg-white rounded-2xl border border-slate-200/80 mt-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0052CC] flex items-center justify-center border border-blue-100">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-[260px]">
              <h2 className="text-sm font-extrabold text-[#002244]">No conversations yet</h2>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Chats will appear here when you're connected with a Customer or another Agent.
              </p>
            </div>
          </div>
        ) : (
          /* Conversation List */
          <div className="space-y-2">
            {filteredConversations.map((conv) => {
              const isCustomer = conv.type === 'customer';
              const isClosed = conv.status === 'closed';

              return (
                <button
                  key={conv.id}
                  type="button"
                  onClick={() => onSelectConversation?.(conv)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 relative shadow-2xs hover:shadow-xs active:scale-[0.99] ${
                    conv.unreadCount > 0
                      ? 'bg-white border-blue-200/90 ring-1 ring-blue-100'
                      : 'bg-white border-slate-200/90 hover:bg-slate-50/80'
                  }`}
                >
                  {/* Avatar / Type Icon */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border mt-0.5 ${
                      isCustomer
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                        : 'bg-blue-50 text-[#0052CC] border-blue-200/80'
                    }`}
                  >
                    {isCustomer ? <User className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                  </div>

                  {/* Conversation Details */}
                  <div className="flex-1 min-w-0 space-y-1">
                    {/* Top Row: Name + Timestamp */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-xs font-extrabold text-[#002244] truncate">
                          {conv.participantName}
                        </span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] font-bold shrink-0 uppercase tracking-wider ${
                            isCustomer
                              ? 'bg-emerald-100/70 text-emerald-800'
                              : 'bg-blue-100/70 text-[#0052CC]'
                          }`}
                        >
                          {isCustomer ? 'Customer' : 'Agent'}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-medium text-slate-400 shrink-0">
                        {conv.lastMessageTimestamp || 'Recent'}
                      </span>
                    </div>

                    {/* Context / Request Reference */}
                    <div className="flex items-center gap-1.5 text-[10.5px] text-slate-500 font-medium">
                      <span className="font-mono text-slate-600">{conv.requestReference}</span>
                      {isClosed && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">
                          <Lock className="w-2.5 h-2.5" />
                          Closed
                        </span>
                      )}
                    </div>

                    {/* Latest Message Preview + Unread Count */}
                    <div className="flex items-center justify-between gap-2 pt-0.5">
                      <p
                        className={`text-xs truncate ${
                          conv.unreadCount > 0
                            ? 'font-bold text-slate-900'
                            : 'font-normal text-slate-500'
                        }`}
                      >
                        {conv.lastMessagePreview || 'No messages'}
                      </p>

                      {conv.unreadCount > 0 && (
                        <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#0052CC] text-white text-[10px] font-black flex items-center justify-center shrink-0">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 self-center" />
                </button>
              );
            })}
          </div>
        )}

        <PoweredByCinitecFooter className="py-2" />
      </div>

      {/* 4. Footer Note: Privacy & Scope */}
      <footer className="p-2.5 bg-slate-100/90 border-t border-slate-200 text-center shrink-0">
        <p className="text-[10px] text-slate-500 font-medium">
          In-app messaging for active TellerBud assignments & liquidity matches.
        </p>
      </footer>
    </div>
  );
};
