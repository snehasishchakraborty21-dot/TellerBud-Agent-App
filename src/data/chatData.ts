import { ChatConversation, ChatMessage, AgentChatsPreviewState, AgentChatConversationPreviewState } from '../types';

export const createSeedChatConversations = (): ChatConversation[] => [
  {
    id: 'chat-cust-req-8821',
    type: 'customer',
    participantName: 'Customer',
    participantRoleLabel: 'Customer',
    requestReference: 'Pickup • #REQ-8821',
    serviceType: 'pickup',
    status: 'active',
    unreadCount: 1,
    locationOrBooth: 'Booth 03 — Main Atrium',
    lastMessagePreview: 'Great, I will be there in about 3 minutes.',
    lastMessageTimestamp: '10:42 AM',
    messages: [
      {
        id: 'msg-c1',
        sender: 'counterparty',
        senderName: 'Customer',
        text: 'Hello, I am walking towards Booth 03 near the central atrium now.',
        timestamp: '10:38 AM',
        status: 'sent',
      },
      {
        id: 'msg-c2',
        sender: 'agent',
        senderName: 'Agent Marcus',
        text: 'Hello! I am ready at Booth 03. Please have your pickup reference ready.',
        timestamp: '10:40 AM',
        status: 'sent',
      },
      {
        id: 'msg-c3',
        sender: 'counterparty',
        senderName: 'Customer',
        text: 'Great, I will be there in about 3 minutes.',
        timestamp: '10:42 AM',
        status: 'sent',
      },
    ],
  },
  {
    id: 'chat-agent-al-9042',
    type: 'agent',
    participantName: 'Michael Adeleke',
    participantRoleLabel: 'Matched Agent',
    requestReference: 'Liquidity Match • #AL-9042',
    serviceType: 'liquidity_cash',
    status: 'active',
    unreadCount: 1,
    locationOrBooth: 'Booth 03 — Main Atrium',
    lastMessagePreview: 'On my way to your booth now with float confirmation ready.',
    lastMessageTimestamp: '09:47 AM',
    messages: [
      {
        id: 'msg-a1',
        sender: 'agent',
        senderName: 'Agent Marcus',
        text: 'Hi Michael, match confirmed. I am waiting at Booth 03 with the requested cash.',
        timestamp: '09:45 AM',
        status: 'sent',
      },
      {
        id: 'msg-a2',
        sender: 'counterparty',
        senderName: 'Michael Adeleke',
        text: 'On my way to your booth now with float confirmation ready.',
        timestamp: '09:47 AM',
        status: 'sent',
      },
    ],
  },
  {
    id: 'chat-cust-req-7914',
    type: 'customer',
    participantName: 'Customer',
    participantRoleLabel: 'Customer',
    requestReference: 'Pickup • #REQ-7914',
    serviceType: 'pickup',
    status: 'closed',
    unreadCount: 0,
    locationOrBooth: 'Booth 03 — Main Atrium',
    lastMessagePreview: 'Transaction confirmed. Thank you!',
    lastMessageTimestamp: 'Yesterday',
    messages: [
      {
        id: 'msg-cc1',
        sender: 'counterparty',
        senderName: 'Customer',
        text: 'I have arrived at Booth 03.',
        timestamp: 'Yesterday, 03:10 PM',
        status: 'sent',
      },
      {
        id: 'msg-cc2',
        sender: 'agent',
        senderName: 'Agent Marcus',
        text: 'Thank you, recording your cash withdrawal now.',
        timestamp: 'Yesterday, 03:12 PM',
        status: 'sent',
      },
      {
        id: 'msg-cc3',
        sender: 'counterparty',
        senderName: 'Customer',
        text: 'Transaction confirmed. Thank you!',
        timestamp: 'Yesterday, 03:15 PM',
        status: 'sent',
      },
    ],
  },
  {
    id: 'chat-agent-al-8802',
    type: 'agent',
    participantName: 'Sarah Nnamdi',
    participantRoleLabel: 'Matched Agent',
    requestReference: 'Liquidity Match • #AL-8802',
    serviceType: 'liquidity_float',
    status: 'closed',
    unreadCount: 0,
    locationOrBooth: 'Booth 04 — North Gate',
    lastMessagePreview: 'Confirmed on my end as well. Thanks Marcus.',
    lastMessageTimestamp: 'Aug 14',
    messages: [
      {
        id: 'msg-ca1',
        sender: 'agent',
        senderName: 'Agent Marcus',
        text: 'Float transfer received and verified. Completed exchange.',
        timestamp: 'Aug 14, 11:25 AM',
        status: 'sent',
      },
      {
        id: 'msg-ca2',
        sender: 'counterparty',
        senderName: 'Sarah Nnamdi',
        text: 'Confirmed on my end as well. Thanks Marcus.',
        timestamp: 'Aug 14, 11:27 AM',
        status: 'sent',
      },
    ],
  },
];

export const getPreviewConversations = (
  baseConversations: ChatConversation[],
  previewState?: AgentChatsPreviewState | string
): ChatConversation[] => {
  switch (previewState) {
    case 'customer_chats':
    case 'customer_conversations':
      return baseConversations.filter((c) => c.type === 'customer');
    case 'agent_chats':
    case 'agent_conversations':
      return baseConversations.filter((c) => c.type === 'agent');
    case 'unread_messages':
      return baseConversations.map((c, i) => ({
        ...c,
        unreadCount: i < 2 ? (c.unreadCount > 0 ? c.unreadCount : 2) : 0,
      }));
    case 'empty_chats':
      return [];
    case 'connection_issue':
    case 'default':
    default:
      return baseConversations;
  }
};

export const getConversationForPreview = (
  baseConversations: ChatConversation[],
  conversationId?: string | null,
  previewState?: AgentChatConversationPreviewState | string
): ChatConversation => {
  if (previewState === 'customer_chat_active') {
    const customerChat = baseConversations.find((c) => c.type === 'customer' && c.status === 'active');
    if (customerChat) return customerChat;
  }

  if (previewState === 'agent_chat_active') {
    const agentChat = baseConversations.find((c) => c.type === 'agent' && c.status === 'active');
    if (agentChat) return agentChat;
  }

  if (previewState === 'closed_conversation') {
    const closedChat = baseConversations.find((c) => c.status === 'closed');
    if (closedChat) return closedChat;
  }

  if (previewState === 'send_failed') {
    const activeChat = baseConversations.find((c) => c.status === 'active') || baseConversations[0];
    return {
      ...activeChat,
      messages: [
        ...activeChat.messages,
        {
          id: 'msg-failed-demo',
          sender: 'agent',
          senderName: 'Agent Marcus',
          text: 'I am waiting by the booth entrance.',
          timestamp: 'Just now',
          status: 'failed',
        },
      ],
    };
  }

  if (conversationId) {
    const found = baseConversations.find((c) => c.id === conversationId);
    if (found) return found;
  }

  return baseConversations[0] || createSeedChatConversations()[0];
};

export const getTotalUnreadCount = (conversations: ChatConversation[]): number => {
  return conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
};
