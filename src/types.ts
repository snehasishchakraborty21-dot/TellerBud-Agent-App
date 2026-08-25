export type AuthState =
  | 'idle'
  | 'submitting'
  | 'invalid_credentials'
  | 'connectivity_error'
  | 'account_inactive'
  | 'missing_assignment'
  | 'success';

export type AvailabilityPreviewState =
  | 'default'
  | 'offline'
  | 'online'
  | 'saving'
  | 'config_unavailable'
  | 'connection_issue';

export type HomePreviewState =
  | 'default'
  | 'delivery_request'
  | 'pickup_request'
  | 'incoming_popup_delivery'
  | 'incoming_popup_pickup'
  | 'responding'
  | 'assigned_elsewhere'
  | 'timed_out'
  | 'active_service'
  | 'active_service_blocking'
  | 'offline'
  | 'connection_issue'
  | 'incoming_request';

export type RequestDetailPreviewState =
  | 'delivery_request'
  | 'pickup_request'
  | 'responding'
  | 'assigned_to_you'
  | 'assigned_elsewhere'
  | 'timed_out'
  | 'connection_issue'
  | 'rejected';

export type AssignedServicePreviewState =
  | 'delivery_assigned'
  | 'delivery_en_route'
  | 'delivery_arrived'
  | 'pickup_assigned'
  | 'pickup_waiting'
  | 'pickup_deposit_assigned'
  | 'pickup_eta_unavailable'
  | 'scheduled_pickup'
  | 'service_cancelled'
  | 'connection_issue';

export type TransactionExecutionPreviewState =
  | 'delivery_ready'
  | 'pickup_ready'
  | 'pickup_withdrawal_ready'
  | 'delivery_withdrawal_ready'
  | 'pickup_deposit_ready'
  | 'delivery_deposit_ready'
  | 'transaction_performed'
  | 'withdrawal_performed'
  | 'deposit_performed'
  | 'withdrawal_recorded'
  | 'deposit_ussd_in_progress'
  | 'deposit_recorded'
  | 'dialler'
  | 'ussd_in_progress'
  | 'ussd_cancelled'
  | 'ussd_failed'
  | 'ussd_result_unknown'
  | 'ussd_successful'
  | 'transaction_recorded'
  | 'confirm_transaction'
  | 'processing'
  | 'record_failed'
  | 'status_not_confirmed'
  | 'connection_issue';

export type TransactionConfirmationPreviewState =
  | 'waiting_for_confirmation'
  | 'confirmation_received'
  | 'capture_unavailable'
  | 'confirmation_needs_review'
  | 'connection_issue';

export type ServiceCompletionPreviewState =
  | 'waiting_for_both'
  | 'customer_confirmed'
  | 'agent_confirmed'
  | 'service_completed'
  | 'connection_issue'
  | 'confirmation_status_unknown'
  | 'cancelled';

export type AgentRequestsPreviewState =
  | 'incoming_mixed'
  | 'customer_requests'
  | 'agent_liquidity_incoming'
  | 'my_agent_requests'
  | 'business_owner_requests'
  | 'empty_incoming'
  | 'empty_my_requests'
  | 'connection_issue';

export interface IncomingAgentLiquidityRequestItem {
  id: string;
  requestReference?: string;
  requestType: 'cash' | 'float';
  amount: string;
  location?: string;
  booth?: string;
  reason?: string;
  requestingAgentName?: string;
  requestingAgentReference?: string;
  requestingAgentBooth?: string;
  distance?: string;
  estimatedTravelTime?: string;
  status: 'available_to_respond' | 'timed_out' | 'matched' | 'request_taken' | 'rejected';
  timeRemaining?: string;
  responseDeadlineSeconds?: number;
  expiresAtTimestamp?: number;
  submittedAt?: string;
}

export interface MyAgentLiquidityRequestItem {
  id: string;
  requestType: 'cash' | 'float';
  amount: string;
  createdAt: string;
  status: 'searching' | 'matched' | 'in_progress' | 'completed' | 'timed_out' | 'cancelled';
  matchedAgentName?: string;
}

export type BusinessOwnerLiquidityRequestPreviewState =
  | 'pending_review'
  | 'approved'
  | 'rejected'
  | 'pending_payment'
  | 'paid'
  | 'returned'
  | 'business_admin_confirmed'
  | 'cancelled'
  | 'connection_issue';

export interface BusinessOwnerLiquidityHistoryEvent {
  status:
    | 'submitted'
    | 'pending_review'
    | 'approved'
    | 'rejected'
    | 'pending_payment'
    | 'paid'
    | 'returned'
    | 'business_admin_confirmed'
    | 'cancelled';
  label: string;
  timestamp: string;
  note?: string;
}

export interface BusinessOwnerLiquidityRequestDetail {
  id: string;
  requestReference?: string;
  requestType: 'cash' | 'float';
  amount: string; // Requested amount
  amountSupplied?: string; // Actual amount supplied (when recorded/paid)
  businessName: string;
  storeName: string;
  boothName: string;
  reason: string;
  submittedAt: string;
  status:
    | 'pending_review'
    | 'approved'
    | 'rejected'
    | 'pending_payment'
    | 'paid'
    | 'returned'
    | 'business_admin_confirmed'
    | 'cancelled';
  businessOwnerNote?: string;
  approvedAt?: string;
  pendingPaymentAt?: string;
  paidAt?: string;
  handoverRecordedAt?: string;
  returnedAt?: string;
  adminConfirmedAt?: string;
  returnedByAgent?: string;
  confirmedByAdmin?: string;
  rejectedAt?: string;
  cancelledAt?: string;
  updatedByRole?: string; // e.g. 'Business Owner' | 'Business Admin' | 'Agent'
  canCancel?: boolean;
  history?: BusinessOwnerLiquidityHistoryEvent[];
}

export interface BusinessOwnerRequestItem {
  id: string;
  requestType: 'cash' | 'float';
  amount: string;
  boothContext?: string;
  submittedAt: string;
  status:
    | 'pending_review'
    | 'approved'
    | 'rejected'
    | 'pending_payment'
    | 'paid'
    | 'returned'
    | 'business_admin_confirmed'
    | 'cancelled';
  reason?: string;
  amountSupplied?: string;
  businessOwnerNote?: string;
  handoverRecordedAt?: string;
  returnedAt?: string;
  adminConfirmedAt?: string;
}

export type VendorType = 'MNO' | 'Bank';

export interface RecordedTransaction {
  id: string;
  requestReference?: string;
  customerName?: string;
  serviceType: 'pickup' | 'delivery';
  transactionType?: string;
  vendorType?: VendorType;
  vendor: string;
  amount: string;
  location?: string;
  booth?: string;
  timestamp: string;
  recordedAt?: string;
  vendorReference?: string;
  serviceFee?: string;
  agentName?: string;
  agentId?: string;
  status?: string;
  rawDate?: string | Date;
}

export interface ExtractedConfirmationDetails {
  transactionId?: string;
  vendor?: string;
  transactionAmount?: string;
  transactionType?: string;
  updatedVendorBalance?: string;
  dateTime?: string;
}

export interface AssignedCustomerService {
  id: string;
  requestReference?: string;
  requestOrigin?: 'Customer' | 'Agent';
  customerName?: string;
  serviceType: 'pickup' | 'delivery';
  transactionType?: string;
  vendorType?: VendorType;
  vendor: string;
  amount: string;
  currencySymbol?: string;
  currencyCode?: string;
  location: string;
  customerLocation?: string;
  agentLocation?: string;
  distance?: string;
  estimatedTravelTime?: string;
  customerEstimatedArrival?: string;
  booth?: string;
  timing?: string;
  reservationActive?: boolean;
  serviceStatus?: 'assigned' | 'in_progress' | 'arrived' | 'completed' | 'cancelled';
  deliveryFee?: string;
  reservationFee?: string;
  agentEarnings?: string;
}

export interface IncomingCustomerRequest {
  id: string;
  requestReference?: string;
  requestOrigin?: 'Customer' | 'Agent';
  customerName?: string;
  serviceType: 'pickup' | 'delivery';
  transactionType?: string;
  vendorType?: VendorType;
  vendor: string;
  amount: string;
  currencySymbol?: string;
  currencyCode?: string;
  location: string;
  customerLocation?: string;
  agentLocation?: string;
  distance?: string;
  estimatedTravelTime?: string;
  customerEstimatedArrival?: string;
  timing?: string;
  expiresAtSeconds?: number;
  offerCreatedAtTimestamp?: number;
  offerExpiresAtTimestamp?: number;
  assignedAgentId?: string;
  assignedAgentName?: string;
  offerStatus?: 'pending' | 'accepted' | 'declined' | 'expired';
  underlyingStatus?: 'searching' | 'assigned' | 'accepted' | 'cancelled' | 'completed';
  relayCount?: number;
  attemptedAgentIds?: string[];
  deliveryFee?: string;
  reservationFee?: string;
  agentEarnings?: string;
}

export type OnlineStatus = 'online' | 'offline';
export type ServiceChoice = 'pickup' | 'delivery';

export interface AvailabilityBand {
  id: string;
  bandType: 'cash' | 'float';
  minimumAmount: number;
  maximumAmount: number | null;
  currencyCode: string;
  currencySymbol: string;
  displayLabel: string;
  description?: string;
}

export interface BandOption {
  id: string;
  label: string;
  description?: string;
  minAmount?: number;
  maxAmount?: number | null;
  currencyCode?: string;
  currencySymbol?: string;
}

export interface AgentAvailabilitySetup {
  status: OnlineStatus;
  service: ServiceChoice;
  cashBandId: string;
  floatBandId: string;
}

export interface IncomingRequestItem {
  id: string;
  serviceType: 'pickup' | 'delivery';
  amount: string;
  location: string;
  distance?: string;
  timeRemaining?: string;
}

export interface ActiveServiceItem {
  id: string;
  serviceType: 'pickup' | 'delivery';
  status: string;
  amount: string;
  location: string;
}

export interface AgentWalletData {
  balance: string;
  currencyCode: string;
  currencySymbol: string;
}

export interface FieldErrors {
  agentId?: string;
  password?: string;
  passcode?: string;
  newPasscode?: string;
  confirmPasscode?: string;
}

export interface AgentCredentials {
  agentId: string;
  passcode: string;
}

export type AgentChangePasscodePreviewState =
  | 'default'
  | 'validation_error'
  | 'mismatch_error'
  | 'saving'
  | 'passcode_updated'
  | 'connection_issue'
  | 'status_unknown';

export interface AgentSessionContract {
  authenticated: boolean;
  agentId?: string;
  authenticatedAt?: string;
}

export interface WorkAssignment {
  business: string;
  store: string;
  booth: string;
  location: string;
  agentName: string;
  agentId: string;
}

export type LiquidityRequestFrom = 'agent' | 'business_owner';
export type LiquidityRequestType = 'cash' | 'float';

export type LiquidityRequestPreviewState =
  | 'another_agent_cash'
  | 'another_agent_float'
  | 'business_owner_cash'
  | 'business_owner_float'
  | 'submitting'
  | 'connection_issue'
  | 'status_not_confirmed';

export type AgentLiquidityStatusPreviewState =
  | 'searching_cash'
  | 'searching_float'
  | 'agent_accepted'
  | 'timed_out'
  | 'match_unavailable'
  | 'connection_issue';

export type AgentLiquidityExchangePreviewState =
  | 'cash_ready'
  | 'float_ready'
  | 'match_unavailable'
  | 'connection_issue';

export type AgentLiquidityTransactionPreviewState =
  | 'cash_ready'
  | 'float_ready'
  | 'confirm_exchange'
  | 'recording'
  | 'exchange_recorded'
  | 'status_not_confirmed'
  | 'connection_issue';

export type AgentLiquidityCompletionPreviewState =
  | 'cash_completed'
  | 'float_completed';

export type AgentLiquidityIncomingPreviewState =
  | 'incoming_cash'
  | 'incoming_float'
  | 'accepting'
  | 'matched'
  | 'rejected'
  | 'timed_out'
  | 'request_taken'
  | 'connection_issue'
  | 'status_not_confirmed';

export interface MatchedAgentInfo {
  name: string;
  agentId?: string;
  agentReference?: string;
  boothOrLocation?: string;
  distance?: string;
  estimatedTravelTime?: string;
}

export interface AgentLiquidityRequestDetail {
  id: string;
  requestReference?: string;
  requestType: LiquidityRequestType;
  vendorType?: VendorType;
  vendor?: string;
  amount: string;
  reason: string;
  location: string;
  booth?: string;
  submittedAt: string;
  status: 'searching' | 'matched' | 'timed_out' | 'match_unavailable' | 'transaction_recorded' | 'completed' | 'request_taken' | 'rejected' | 'available_to_respond';
  notificationsSent?: boolean;
  responseDeadlineSeconds?: number;
  offerCreatedAtTimestamp?: number;
  expiresAtTimestamp?: number;
  offerStatus?: 'pending' | 'accepted' | 'declined' | 'expired';
  underlyingStatus?: 'searching' | 'assigned' | 'accepted' | 'cancelled' | 'completed';
  relayCount?: number;
  attemptedAgentIds?: string[];
  matchedAgent?: MatchedAgentInfo;
  requesterAgent?: MatchedAgentInfo;
  requesterName?: string;
  requesterReference?: string;
  requesterBooth?: string;
  distance?: string;
  estimatedTravelTime?: string;
  exchangeLocation?: string;
  recordedAt?: string;
  completedAt?: string;
  transactionReference?: string;
  serviceFee?: string;
}

export interface LiquidityRequestFormData {
  requestFrom: LiquidityRequestFrom;
  requestType: LiquidityRequestType;
  vendorType?: VendorType;
  vendor?: string;
  amount: string;
  locationOrBooth: string;
  note: string;
}

export interface LiquidityRequestSubmissionResult {
  success: boolean;
  requestId?: string;
  targetWorkflow?: 'agent_to_agent' | 'agent_to_owner';
  status?: 'searching' | 'pending_review';
  error?: string;
}

export type AgentTransactionsPreviewState =
  | 'mixed_transactions'
  | 'customer_transactions'
  | 'agent_liquidity'
  | 'walk_in'
  | 'empty'
  | 'connection_issue';

export type AgentMorePreviewState =
  | 'default'
  | 'offline'
  | 'connection_issue';

export type EndOfDayDeclarationPreviewState =
  | 'default'
  | 'remarks_required'
  | 'submitting'
  | 'workday_ended'
  | 'connection_issue'
  | 'status_not_confirmed';

export type AgentAttendancePreviewState =
  | 'current_active'
  | 'history'
  | 'auto_logout_record'
  | 'missed_logout_record'
  | 'no_active_session'
  | 'connection_issue';

export interface AttendanceRecord {
  id: string;
  date: string;
  dateGroup: 'today' | 'yesterday' | 'earlier';
  rawDate?: string | Date;
  booth: string;
  store?: string;
  business?: string;
  loginTime: string;
  sessionStart: string;
  sessionEnd?: string;
  workDuration: string;
  status: 'completed' | 'auto_logout' | 'missed_logout';
  declarationStatus?: 'completed' | 'missing' | 'pending_review' | 'zero';
}

export interface EndOfDayDeclarationRecord {
  agentId: string;
  agentName: string;
  business?: string;
  store?: string;
  booth?: string;
  sessionStartedAt: string;
  sessionEndedAt: string;
  workDuration: string;
  physicalCashDeclared: string;
  floatDeclared?: string;
  remarks?: string;
  declaredAt: string;
  currencySymbol?: string;
}

export type TransactionFilterCategory = 'all' | 'customer' | 'agent_liquidity' | 'walk_in';

export type TransactionRecordCategory = 'customer' | 'agent_liquidity' | 'walk_in';

export type TransactionRecordStatus = 'completed' | 'recorded' | 'in_progress' | 'failed';

export interface AgentTransactionItem {
  id: string;
  transactionReference?: string;
  requestReference?: string;
  category: TransactionRecordCategory;
  // Customer specific
  serviceType?: 'pickup' | 'delivery';
  transactionType?: string; // e.g. "Withdrawal", "Deposit", "Cash In", "Cash Out"
  vendorType?: VendorType;
  vendor?: string; // e.g. "MTN", "Airtel", "Zamtel", "Zanaco"
  hasSmsConfirmation?: boolean;
  // Agent Liquidity specific
  liquidityType?: 'cash' | 'float';
  matchedAgentName?: string;
  matchedAgentId?: string;
  exchangeLocation?: string;
  // Walk-In specific
  walkInType?: string;
  // Common fields
  amount: string;
  currencySymbol?: string;
  status: TransactionRecordStatus;
  timestamp: string;
  dateGroup?: 'Today' | 'Yesterday' | 'Earlier';
  serviceFee?: string;
}

export type AgentWalletPreviewState =
  | 'default'
  | 'credits_only'
  | 'service_fees_only'
  | 'no_activity'
  | 'balance_unavailable'
  | 'connection_issue';

export type AgentProfilePreviewState =
  | 'default'
  | 'offline_session'
  | 'account_access_unavailable'
  | 'connection_issue';

export type AgentSmsInboxPreviewState =
  | 'default'
  | 'empty_inbox'
  | 'sms_unavailable'
  | 'unread_messages';

export interface SmsInboxMessage {
  id: string;
  sender: string;
  senderType?: 'bank' | 'telecom' | 'operator' | 'system' | 'other';
  body: string;
  receivedAt: string;
  rawDate?: string | Date;
  dateGroup?: 'Today' | 'Yesterday' | 'Earlier';
  isTransactionSms?: boolean;
  isUnread?: boolean;
  extractedDetails?: {
    transactionId?: string;
    amount?: string;
    vendor?: string;
    transactionType?: string;
    updatedBalance?: string;
  };
}

export type WalkInTransactionPreviewState =
  | 'ready'
  | 'cash_in_ready'
  | 'cash_in_ussd'
  | 'cash_in_performed'
  | 'cash_in_recorded'
  | 'cash_out_ready'
  | 'cash_out_performed'
  | 'cash_out_recorded'
  | 'recording'
  | 'vendor_required'
  | 'ussd_in_progress'
  | 'transaction_recorded'
  | 'transaction_failed'
  | 'result_unknown'
  | 'connection_issue'
  | 'no_active_session';

export interface WalkInTransactionTypeOption {
  id: string;
  label: string;
  requiresVendor: boolean;
  usesUssd?: boolean;
  description?: string;
  defaultFee?: string;
}

export interface WalkInVendorOption {
  id: string;
  name: string;
  type: VendorType;
  code: string;
  accentColor?: string;
  logoUrl?: string;
  supportedCurrencies?: string[];
}

export interface WalkInTransactionRecord {
  id: string;
  transactionReference: string;
  transactionType: string;
  vendorType?: VendorType;
  vendor?: string;
  amount: string;
  currencyCode?: string;
  currencySymbol?: string;
  phoneNumber: string;
  normalizedPhoneNumber?: string;
  selectedCountry?: string;
  dialCode?: string;
  booth: string;
  store?: string;
  business?: string;
  agentName?: string;
  agentId?: string;
  recordedAt: string;
  confirmedAt?: string;
  rawDate?: string | Date;
  rawConfirmedAt?: string | Date;
  status: 'recorded' | 'completed' | 'failed' | 'status_not_confirmed' | 'performed';
  vendorConfirmationCaptured?: boolean;
  vendorReference?: string;
  serviceFee?: string;
}

export type WalletActivityType = 'credit' | 'service_fee';

export interface WalletActivityItem {
  id: string;
  type: WalletActivityType;
  title: string;
  amount: string;
  numericAmount: number;
  currencySymbol?: string;
  fundedBy?: string; // e.g. 'Business Owner' | 'Business Admin'
  context?: string; // e.g. 'Customer Delivery', 'Customer Pickup', 'Cash Exchange', 'Float Exchange', 'Walk-In • Cash Out'
  subContext?: string; // e.g. 'MTN Withdrawal', 'Airtel Deposit', etc.
  reference?: string; // e.g. '#WF-88219', '#TRX-4491', '#AL-2093'
  status?: 'Completed' | 'Applied';
  timestamp: string; // e.g. '11:20 am'
  date: string; // e.g. 'Today, Aug 14'
  rawDate?: string | Date;
  createdAt?: string | Date;
  dateGroup?: 'today' | 'yesterday' | 'earlier';
}

export type AgentDailySummaryReportPreviewState =
  | 'default'
  | 'no_transactions'
  | 'loading'
  | 'connection_issue'
  | 'historical_date';

export interface DailySummaryPartnerRow {
  partnerId: string;
  partnerName: string;
  deposits: number;
  withdrawals: number;
  purchases: number;
  totalTransactions: number;
}

export interface DailySummaryReportData {
  reportDate: string; // ISO date string (YYYY-MM-DD)
  displayDate: string; // e.g. "18 August 2026"
  agentName: string;
  agentId?: string;
  booth: string;
  store?: string;
  business?: string;
  rows: DailySummaryPartnerRow[];
  totalDeposits: number;
  totalWithdrawals: number;
  totalPurchases: number;
  grandTotal: number;
}

export interface WalletTopUpRequestRecord {
  id: string;
  agentId: string;
  agentName?: string;
  booth?: string;
  store?: string;
  business?: string;
  amount: string;
  numericAmount: number;
  currencySymbol: string;
  note?: string;
  timestamp: string;
  rawDate?: string | Date;
  status: 'pending_admin_funding';
}

export interface AgentEarningsSummary {
  today: string;
  thisWeek: string;
  thisMonth: string;
  yesterday?: string;
  total?: string;
  currencySymbol?: string;
}

export type AgentChatsPreviewState =
  | 'default'
  | 'customer_chats'
  | 'customer_conversations'
  | 'agent_chats'
  | 'agent_conversations'
  | 'unread_messages'
  | 'empty_chats'
  | 'connection_issue';

export type AgentChatConversationPreviewState =
  | 'customer_chat_active'
  | 'agent_chat_active'
  | 'closed_conversation'
  | 'send_failed'
  | 'connection_issue';

export interface ChatMessage {
  id: string;
  sender: 'agent' | 'counterparty';
  senderName?: string;
  text: string;
  timestamp: string;
  rawDate?: string | Date;
  status?: 'sent' | 'sending' | 'failed';
}

export interface ChatConversation {
  id: string;
  type: 'customer' | 'agent';
  participantName: string;
  participantRoleLabel?: string;
  requestReference: string; // e.g. '#REQ-8821' or '#AL-9042'
  serviceType: 'pickup' | 'liquidity_cash' | 'liquidity_float';
  status: 'active' | 'closed';
  unreadCount: number;
  messages: ChatMessage[];
  lastMessagePreview?: string;
  lastMessageTimestamp?: string;
  locationOrBooth?: string;
}

export type AboutTellerBudPreviewState =
  | 'default';


