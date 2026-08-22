import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Send,
  User,
  Users,
  Lock,
  AlertCircle,
  RefreshCw,
  Clock,
  RotateCw,
} from 'lucide-react';
import {
  ChatConversation,
  ChatMessage,
  AgentChatConversationPreviewState,
} from '../types';
import { getConversationForPreview, createSeedChatConversations } from '../data/chatData';
import { useSharedClock, formatStatusBarTime } from '../utils/timeUtils';

interface AgentChatConversationScreenProps {
  conversationId?: string | null;
  conversations?: ChatConversation[];
  previewState?: AgentChatConversationPreviewState;
  currentAgentId?: string;
  onBack?: () => void;
  onSendMessage?: (conversationId: string, text: string) => void;
  onRetryFailedMessage?: (conversationId: string, messageId: string) => void;
  onRetry?: () => void;
}

export const AgentChatConversationScreen: React.FC<AgentChatConversationScreenProps> = ({
  conversationId,
  conversations,
  previewState = 'customer_chat_active',
  currentAgentId,
  onBack,
  onSendMessage,
  onRetryFailedMessage,
  onRetry,
}) => {
  const sharedClock = useSharedClock();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const baseList = conversations && conversations.length > 0 ? conversations : createSeedChatConversations();

  const initialConversation = getConversationForPreview(
    baseList,
    conversationId,
    previewState
  );

  const [localMessages, setLocalMessages] = useState<ChatMessage[]>(
    initialConversation.messages || []
  );
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [hasConnectionWarning, setHasConnectionWarning] = useState(
    previewState === 'connection_issue'
  );

  // Sync conversation changes when prop/previewState updates
  useEffect(() => {
    const list = conversations && conversations.length > 0 ? conversations : createSeedChatConversations();
    const updated = getConversationForPreview(list, conversationId, previewState);
    setLocalMessages(updated.messages || []);
    setHasConnectionWarning(previewState === 'connection_issue');
  }, [conversationId, previewState, conversations]);

  // Scroll to bottom on message change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localMessages]);

  const isCustomer = initialConversation.type === 'customer';
  const isClosed =
    previewState === 'closed_conversation' || initialConversation.status === 'closed';

  const formatCurrentTime = () => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed || isSending || isClosed) return;

    setIsSending(true);

    if (previewState === 'send_failed') {
      // Simulate failed send
      const failedMsg: ChatMessage = {
        id: `msg-local-${Date.now()}`,
        sender: 'agent',
        senderName: 'Agent Marcus',
        text: trimmed,
        timestamp: formatCurrentTime(),
        status: 'failed',
      };
      setLocalMessages((prev) => [...prev, failedMsg]);
      setInputText('');
      setIsSending(false);
      return;
    }

    const newMsg: ChatMessage = {
      id: `msg-local-${Date.now()}`,
      sender: 'agent',
      senderName: 'Agent Marcus',
      text: trimmed,
      timestamp: formatCurrentTime(),
      status: 'sent',
    };

    setLocalMessages((prev) => [...prev, newMsg]);
    setInputText('');

    if (onSendMessage && initialConversation.id) {
      onSendMessage(initialConversation.id, trimmed);
    }

    setIsSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleRetryMessage = (msgId: string) => {
    setLocalMessages((prev) =>
      prev.map((m) =>
        m.id === msgId ? { ...m, status: 'sent', timestamp: formatCurrentTime() } : m
      )
    );
    if (onRetryFailedMessage && initialConversation.id) {
      onRetryFailedMessage(initialConversation.id, msgId);
    }
  };

  return (
    <div
      id="agent-chat-conversation-screen"
      className="flex flex-col h-full bg-slate-100 text-slate-900 select-none overflow-hidden font-sans"
    >
      {/* 1. Header: Back | Participant Details (NO Phone/Email) | Status/Logo */}
      <header className="px-3.5 py-2.5 bg-white border-b border-slate-200/90 flex items-center justify-between shrink-0 shadow-2xs z-10">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={onBack}
            aria-label="Back"
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Participant Avatar Badge */}
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
              isCustomer
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-blue-50 text-[#0052CC] border-blue-200'
            }`}
          >
            {isCustomer ? <User className="w-4 h-4" /> : <Users className="w-4 h-4" />}
          </div>

          {/* Identity & Reference Subtitle */}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-extrabold text-[#002244] truncate">
                {initialConversation.participantName}
              </h2>
              <span
                className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider ${
                  isCustomer
                    ? 'bg-emerald-100/80 text-emerald-800'
                    : 'bg-blue-100/80 text-[#0052CC]'
                }`}
              >
                {isCustomer ? 'Customer' : 'Matched Agent'}
              </span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono font-medium truncate">
              {initialConversation.requestReference}
            </div>
          </div>
        </div>

        {/* Status Tag */}
        <div className="shrink-0">
          {isClosed ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
              <Lock className="w-3 h-3 text-slate-400" />
              Closed
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active
            </span>
          )}
        </div>
      </header>

      {/* 2. Connection Warning Banner */}
      {hasConnectionWarning && (
        <div className="px-3.5 py-2 bg-amber-50 border-b border-amber-200/80 flex items-center justify-between text-xs text-amber-900 shrink-0">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="text-[11px] font-medium">Network weak. Messages may be delayed.</span>
          </div>
          <button
            onClick={() => setHasConnectionWarning(false)}
            className="text-[10px] font-bold text-amber-800 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 3. Operational Notice Pill */}
      <div className="py-2 px-3.5 text-center shrink-0">
        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-slate-200/70 border border-slate-300/60 rounded-full px-2.5 py-0.5 shadow-2xs">
          <Clock className="w-2.5 h-2.5 text-slate-400" />
          {isClosed
            ? 'Conversation completed • History preserved'
            : 'Operational chat for current assigned request'}
        </span>
      </div>

      {/* 4. Message Bubble Feed */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-3.5 pb-3 space-y-3">
        {localMessages.map((msg) => {
          const isAgent = msg.sender === 'agent';
          const isFailed = msg.status === 'failed';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isAgent ? 'items-end' : 'items-start'}`}
            >
              {/* Bubble */}
              <div
                className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed shadow-2xs break-words ${
                  isAgent
                    ? isFailed
                      ? 'bg-rose-50 border border-rose-300 text-rose-950 rounded-br-xs'
                      : 'bg-[#0052CC] text-white rounded-br-xs'
                    : 'bg-white border border-slate-200/90 text-[#002244] rounded-bl-xs'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>

              {/* Timestamp & Status Metadata */}
              <div className="flex items-center gap-1.5 mt-1 px-1">
                <span className="text-[9.5px] font-mono text-slate-400 font-medium">
                  {msg.timestamp}
                </span>

                {isFailed && (
                  <div className="flex items-center gap-1 text-[10px] text-rose-600 font-bold">
                    <span>Not delivered</span>
                    <button
                      type="button"
                      onClick={() => handleRetryMessage(msg.id)}
                      className="inline-flex items-center gap-0.5 text-rose-700 bg-rose-100 hover:bg-rose-200 px-1.5 py-0.2 rounded text-[9.5px] font-extrabold transition-colors"
                    >
                      <RotateCw className="w-2.5 h-2.5" />
                      Retry
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* 5. Sticky Bottom Composer OR Closed Banner */}
      <footer className="bg-white border-t border-slate-200/90 p-3 shrink-0 shadow-lg z-20">
        {isClosed ? (
          /* Closed Conversation Banner (Read-only) */
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Conversation closed</span>
            </div>
            <p className="text-[10.5px] text-slate-500 font-medium">
              This service or liquidity exchange is complete. Further messaging is disabled.
            </p>
          </div>
        ) : (
          /* Active Text Composer */
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <textarea
                  id="chat-message-input"
                  rows={1}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  maxLength={500}
                  className="w-full resize-none py-2.5 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0052CC] focus:bg-white transition-all max-h-24 font-sans"
                />
              </div>

              <button
                type="button"
                id="chat-send-btn"
                onClick={handleSend}
                disabled={!inputText.trim() || isSending}
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                  inputText.trim() && !isSending
                    ? 'bg-[#0052CC] hover:bg-[#0043A8] active:bg-[#00388F] text-white shadow-xs active:scale-95'
                    : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                }`}
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[9.5px] text-slate-400 text-center font-medium">
              Press Enter or tap Send to coordinate with your counterparty.
            </p>
          </div>
        )}
      </footer>
    </div>
  );
};
