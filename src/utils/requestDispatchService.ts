/**
 * requestDispatchService.ts
 *
 * Implements the 30-second response window with automatic sequential relay
 * for all incoming Customer Requests (Screen 05) and Agent Liquidity Requests (Screen 22).
 */

import { IncomingCustomerRequest, AgentLiquidityRequestDetail } from '../types';

export const RESPONSE_WINDOW_SECONDS = 30;

export interface EligibleAgent {
  id: string;
  name: string;
  reference: string;
  booth: string;
  distance: string;
  estimatedTravelTime: string;
}

export const ELIGIBLE_AGENTS_POOL: EligibleAgent[] = [
  {
    id: 'AG-88421',
    name: 'Marcus Vance',
    reference: 'AG-88421',
    booth: 'Booth 03 — Main Atrium, Central Mall',
    distance: 'Current Booth',
    estimatedTravelTime: '0 min away',
  },
  {
    id: 'AG-66190',
    name: 'Bwalya Mwamba',
    reference: 'AG-66190',
    booth: 'Booth 01 — West Wing, Central Mall',
    distance: '85 m away',
    estimatedTravelTime: '2 min away',
  },
  {
    id: 'AG-70231',
    name: 'Samuel Olawale',
    reference: 'AG-70231',
    booth: 'Zone B — Apex Supermarket Booth #104',
    distance: '140 m away',
    estimatedTravelTime: '3 min away',
  },
  {
    id: 'AG-55320',
    name: 'Chileshe Mwape',
    reference: 'AG-55320',
    booth: 'Zone A — PostOffice Station Booth #02',
    distance: '210 m away',
    estimatedTravelTime: '4 min away',
  },
  {
    id: 'AG-44109',
    name: 'Grace Lungu',
    reference: 'AG-44109',
    booth: 'Cairo Road North Booth #05',
    distance: '320 m away',
    estimatedTravelTime: '6 min away',
  },
];

export interface DispatchAuditRecord {
  requestId: string;
  requestType: 'customer' | 'agent_liquidity';
  agentId: string;
  agentName: string;
  offeredAtTimestamp: number;
  expiresAtTimestamp: number;
  outcome?: 'accepted' | 'declined' | 'timed_out_expired' | 'pending';
  resolvedAtTimestamp?: number;
  relayedToAgentId?: string;
  notes?: string;
}

// In-memory store for active dispatch cycles and audit log
const dispatchAuditLog: DispatchAuditRecord[] = [];
const activeOfferExpiries = new Map<string, number>();

/**
 * Format remaining seconds as standard countdown: "00:30", "00:29", ... "00:00"
 */
export function formatCountdownDigits(secs: number): string {
  const safeSecs = Math.max(0, Math.floor(secs));
  const mins = Math.floor(safeSecs / 60);
  const remainder = safeSecs % 60;
  return `${mins.toString().padStart(2, '0')}:${remainder
    .toString()
    .padStart(2, '0')}`;
}

/**
 * Get or initialize the authoritative expiration timestamp for a request offer.
 * Ensures that component re-renders and navigation never reset an active 30-second window.
 */
export function getOrCreateOfferExpiresAt(
  requestId: string,
  existingExpiresAt?: number,
  windowSeconds = RESPONSE_WINDOW_SECONDS
): number {
  if (existingExpiresAt && existingExpiresAt > Date.now()) {
    activeOfferExpiries.set(requestId, existingExpiresAt);
    return existingExpiresAt;
  }

  const cached = activeOfferExpiries.get(requestId);
  if (cached && cached > Date.now()) {
    return cached;
  }

  const newExpiresAt = Date.now() + windowSeconds * 1000;
  activeOfferExpiries.set(requestId, newExpiresAt);
  return newExpiresAt;
}

/**
 * Calculate remaining seconds from an expiration timestamp
 */
export function calculateRemainingSeconds(expiresAtTimestamp: number): number {
  const diff = expiresAtTimestamp - Date.now();
  return Math.max(0, Math.ceil(diff / 1000));
}

/**
 * Check if an offer has expired
 */
export function isOfferExpired(expiresAtTimestamp?: number): boolean {
  if (!expiresAtTimestamp) return false;
  return Date.now() >= expiresAtTimestamp;
}

/**
 * Clear cached offer expiration on terminal outcome
 */
export function clearOfferExpiry(requestId: string): void {
  activeOfferExpiries.delete(requestId);
}

/**
 * Log a dispatch audit event
 */
export function recordDispatchAudit(entry: DispatchAuditRecord): void {
  dispatchAuditLog.push(entry);
}

/**
 * Pick the next eligible agent in the sequential relay pool
 */
export function getNextEligibleAgent(
  currentAgentId: string,
  excludedAgentIds: string[] = []
): EligibleAgent {
  const allExcluded = new Set([currentAgentId, ...excludedAgentIds]);
  const candidate = ELIGIBLE_AGENTS_POOL.find((ag) => !allExcluded.has(ag.id));
  if (candidate) return candidate;

  // If all other agents attempted, fallback to next non-current agent
  return (
    ELIGIBLE_AGENTS_POOL.find((ag) => ag.id !== currentAgentId) ||
    ELIGIBLE_AGENTS_POOL[1] ||
    ELIGIBLE_AGENTS_POOL[0]
  );
}

/**
 * Relay an incoming customer request to the next eligible agent after timeout or rejection.
 * Preserves all underlying customer request data and starts a fresh 30-second window.
 */
export function relayCustomerRequest(
  originalRequest: IncomingCustomerRequest,
  currentAgentId: string,
  reason: 'timeout' | 'declined'
): {
  relayedRequest: IncomingCustomerRequest;
  nextAgent: EligibleAgent;
  auditEntry: DispatchAuditRecord;
} {
  const nextAgent = getNextEligibleAgent(
    currentAgentId,
    originalRequest.attemptedAgentIds || []
  );

  const now = Date.now();
  const nextExpiresAt = now + RESPONSE_WINDOW_SECONDS * 1000;

  clearOfferExpiry(originalRequest.id);
  activeOfferExpiries.set(originalRequest.id, nextExpiresAt);

  const updatedAttempted = [
    ...(originalRequest.attemptedAgentIds || [currentAgentId]),
    nextAgent.id,
  ];

  const relayedRequest: IncomingCustomerRequest = {
    ...originalRequest,
    expiresAtSeconds: RESPONSE_WINDOW_SECONDS,
    offerCreatedAtTimestamp: now,
    offerExpiresAtTimestamp: nextExpiresAt,
    assignedAgentId: nextAgent.id,
    assignedAgentName: nextAgent.name,
    offerStatus: 'pending',
    underlyingStatus: 'searching',
    relayCount: (originalRequest.relayCount || 0) + 1,
    attemptedAgentIds: updatedAttempted,
  };

  const auditEntry: DispatchAuditRecord = {
    requestId: originalRequest.id,
    requestType: 'customer',
    agentId: currentAgentId,
    agentName: originalRequest.assignedAgentName || 'Agent',
    offeredAtTimestamp: originalRequest.offerCreatedAtTimestamp || now - 30000,
    expiresAtTimestamp: originalRequest.offerExpiresAtTimestamp || now,
    outcome: reason === 'timeout' ? 'timed_out_expired' : 'declined',
    resolvedAtTimestamp: now,
    relayedToAgentId: nextAgent.id,
    notes: `Offer ${reason === 'timeout' ? 'timed out after 30s' : 'declined by agent'}. Relayed to ${nextAgent.name} (${nextAgent.id}).`,
  };

  recordDispatchAudit(auditEntry);

  return { relayedRequest, nextAgent, auditEntry };
}

/**
 * Relay an incoming agent liquidity request to the next eligible agent.
 * Preserves original liquidity request identity and starts a fresh 30-second window.
 */
export function relayAgentLiquidityRequest(
  originalRequest: AgentLiquidityRequestDetail,
  currentAgentId: string,
  reason: 'timeout' | 'declined'
): {
  relayedRequest: AgentLiquidityRequestDetail;
  nextAgent: EligibleAgent;
  auditEntry: DispatchAuditRecord;
} {
  const nextAgent = getNextEligibleAgent(
    currentAgentId,
    originalRequest.attemptedAgentIds || []
  );

  const now = Date.now();
  const nextExpiresAt = now + RESPONSE_WINDOW_SECONDS * 1000;

  clearOfferExpiry(originalRequest.id);
  activeOfferExpiries.set(originalRequest.id, nextExpiresAt);

  const updatedAttempted = [
    ...(originalRequest.attemptedAgentIds || [currentAgentId]),
    nextAgent.id,
  ];

  const relayedRequest: AgentLiquidityRequestDetail = {
    ...originalRequest,
    status: 'available_to_respond',
    offerStatus: 'pending',
    responseDeadlineSeconds: RESPONSE_WINDOW_SECONDS,
    offerCreatedAtTimestamp: now,
    expiresAtTimestamp: nextExpiresAt,
    relayCount: (originalRequest.relayCount || 0) + 1,
    attemptedAgentIds: updatedAttempted,
  };

  const auditEntry: DispatchAuditRecord = {
    requestId: originalRequest.id,
    requestType: 'agent_liquidity',
    agentId: currentAgentId,
    agentName: 'Marcus Vance',
    offeredAtTimestamp: originalRequest.offerCreatedAtTimestamp || now - 30000,
    expiresAtTimestamp: originalRequest.expiresAtTimestamp || now,
    outcome: reason === 'timeout' ? 'timed_out_expired' : 'declined',
    resolvedAtTimestamp: now,
    relayedToAgentId: nextAgent.id,
    notes: `Offer ${reason === 'timeout' ? 'timed out after 30s' : 'declined by agent'}. Relayed to ${nextAgent.name} (${nextAgent.id}).`,
  };

  recordDispatchAudit(auditEntry);

  return { relayedRequest, nextAgent, auditEntry };
}
