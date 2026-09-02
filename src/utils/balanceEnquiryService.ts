import { AgentBalanceEnquiry, BalanceEnquiryStatus, BalanceEnquiryVendorType } from '../types';

const STORAGE_KEY = 'tellerbud_agent_balance_enquiries';

// In-memory cache for fast session operations
let memoryStore: AgentBalanceEnquiry[] = [];

/**
 * Format date/time matching standard TellerBud audit log presentation
 * Example: "01 Sep 2026, 05:42 PM"
 */
export function formatEnquiryTimestamp(date: Date = new Date()): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();
  const time = date.toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  return `${day} ${month} ${year}, ${time}`;
}

/**
 * Load persisted balance enquiry audit records from storage
 */
export function loadBalanceEnquiries(): AgentBalanceEnquiry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        memoryStore = parsed;
        return memoryStore;
      }
    }
  } catch (err) {
    console.warn('Unable to read balance enquiry records from localStorage:', err);
  }
  return memoryStore;
}

/**
 * Save records to persistent storage
 */
function persistStore(records: AgentBalanceEnquiry[]): void {
  memoryStore = records;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.warn('Unable to persist balance enquiry records to localStorage:', err);
  }
}

/**
 * Record a new Balance Enquiry audit event.
 *
 * CRITICAL AUDIT RULE:
 * - This creates an administrative/management audit event representing the Agent initiating a balance enquiry.
 * - It is strictly NOT a financial transaction (does not alter wallet, cash, float, or commission).
 * - Sensitive credentials (PIN, secret codes) must NEVER be passed or recorded.
 */
export function recordBalanceEnquiry(params: {
  agentId: string;
  agentName: string;
  phoneNumber: string;
  rawPhoneNumber?: string;
  vendorType: BalanceEnquiryVendorType;
  vendor: string;
  vendorId?: string;
  ussdCode?: string;
  booth?: string;
  store?: string;
  business?: string;
  status?: BalanceEnquiryStatus;
}): AgentBalanceEnquiry {
  const existing = loadBalanceEnquiries();
  const now = new Date();

  // Generate deterministic/unique reference
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const id = `ENQ-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}-${randomSuffix}`;

  const newRecord: AgentBalanceEnquiry = {
    id,
    activityType: 'BALANCE_ENQUIRY',
    agentId: params.agentId || 'AG-88421',
    agentName: params.agentName || 'Marcus Vance',
    phoneNumber: params.phoneNumber,
    rawPhoneNumber: params.rawPhoneNumber,
    vendorType: params.vendorType,
    vendor: params.vendor,
    vendorId: params.vendorId || params.vendor.toLowerCase(),
    initiatedAt: formatEnquiryTimestamp(now),
    timestamp: now.toISOString(),
    source: 'Balance Enquiry',
    status: params.status || 'Initiated',
    ussdCode: params.ussdCode,
    booth: params.booth,
    store: params.store,
    business: params.business,
  };

  // Prepend to list (most recent first)
  const updated = [newRecord, ...existing];
  persistStore(updated);

  // Inform console for management monitoring
  console.log('[TellerBud Audit] Balance Enquiry record captured:', newRecord);

  return newRecord;
}

/**
 * Update the status of an existing balance enquiry event (e.g. from 'Initiated' to 'Dialler Opened')
 */
export function updateBalanceEnquiryStatus(
  id: string,
  status: BalanceEnquiryStatus
): AgentBalanceEnquiry | null {
  const records = loadBalanceEnquiries();
  const index = records.findIndex((r) => r.id === id);
  if (index === -1) return null;

  records[index] = {
    ...records[index],
    status,
  };

  persistStore(records);
  return records[index];
}

/**
 * Get all captured balance enquiry audit records (for Admin/Management App view)
 */
export function getBalanceEnquiries(): AgentBalanceEnquiry[] {
  return loadBalanceEnquiries();
}

/**
 * Get the most recent balance enquiry
 */
export function getLatestBalanceEnquiry(): AgentBalanceEnquiry | null {
  const records = loadBalanceEnquiries();
  return records.length > 0 ? records[0] : null;
}
