/**
 * Centralized transaction execution and classification rules for TellerBud
 */

/**
 * Determines whether an outgoing Vendor transfer (USSD) is required by the Agent.
 *
 * CONTROLLING BUSINESS RULE:
 * 1. WITHDRAWAL / CASH OUT:
 *    Customer sends mobile money to Agent.
 *    Agent hands physical cash to Customer.
 *    -> NO outgoing USSD is required from Agent.
 *
 * 2. DEPOSIT / CASH IN:
 *    Customer gives physical cash to Agent.
 *    Agent sends mobile money to Customer's MNO account.
 *    -> Outgoing Vendor USSD IS required from Agent.
 *
 * Note: Service Type (Pickup / Delivery) is completely independent of Transaction Type.
 */
export const isOutgoingVendorTransferRequired = (transactionType?: string): boolean => {
  if (!transactionType) return false;
  const normalized = transactionType.trim().toLowerCase();

  // Explicit Withdrawal / Cash Out -> Incoming mobile money, physical cash out -> NO USSD
  if (
    normalized.includes('withdrawal') ||
    normalized.includes('cash out') ||
    normalized.includes('cash_out') ||
    normalized.includes('cashout')
  ) {
    return false;
  }

  // Explicit Deposit / Cash In -> Physical cash in, outgoing mobile money -> USSD REQUIRED
  if (
    normalized.includes('deposit') ||
    normalized.includes('cash in') ||
    normalized.includes('cash_in') ||
    normalized.includes('cashin')
  ) {
    return true;
  }

  // Default fallback: Only if explicitly outgoing transfer
  return false;
};

/**
 * Returns human-readable action label and confirmation text for transaction execution
 */
export const getTransactionConfirmationCopy = (transactionType?: string) => {
  const requiresOutgoingUssd = isOutgoingVendorTransferRequired(transactionType);

  if (requiresOutgoingUssd) {
    return {
      supportingCopy:
        'Confirm that the transaction details are correct before opening the Phone Dialler.',
      confirmButtonText: 'Perform Transaction',
      requiresUssd: true,
    };
  }

  return {
    supportingCopy:
      'Confirm that the Customer transfer has been received and the cash transaction is ready to be recorded.',
    confirmButtonText: 'Confirm Transaction',
    requiresUssd: false,
  };
};
