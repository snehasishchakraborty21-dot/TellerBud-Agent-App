export interface UssdStep {
  id: number;
  title?: string;
  prompt: string;
  options?: { value: string; label: string }[];
  inputRequired?: boolean;
  inputType?: 'numeric' | 'pin' | 'text' | 'choice';
  inputLabel?: string;
  placeholder?: string;
  defaultInputValue?: string;
  isFinalStep?: boolean;
  isSuccess?: boolean;
  isFailure?: boolean;
  actionLabel?: string;
}

export interface VendorUssdConfig {
  vendor: string;
  vendorDisplayName: string;
  serviceCodeName: string;
  accentColor: string;
  getInitialUssdCode: (transactionType: string, amount: string, requestRef?: string) => string;
  getSteps: (transactionType: string, amount: string, requestRef?: string) => UssdStep[];
}

export const vendorUssdConfigs: Record<string, VendorUssdConfig> = {
  MTN: {
    vendor: 'MTN',
    vendorDisplayName: 'MTN Mobile Money',
    serviceCodeName: 'MoMo Service',
    accentColor: '#eab308',
    getInitialUssdCode: (transactionType) => {
      if (transactionType === 'Check Balance' || transactionType === 'balance_check') {
        return '*115#';
      }
      return '*115#';
    },
    getSteps: (transactionType, amount, requestRef) => {
      const type = transactionType || 'Withdrawal';
      if (type === 'Check Balance' || type === 'balance_check') {
        return [
          {
            id: 1,
            title: 'MTN Mobile Money',
            prompt: `MTN Mobile Money\n\n1. Send Money\n2. Cash Out / Withdraw\n3. Cash In / Deposit\n4. Check Balance`,
            options: [
              { value: '1', label: '1. Send Money' },
              { value: '2', label: '2. Cash Out / Withdraw' },
              { value: '3', label: '3. Cash In / Deposit' },
              { value: '4', label: '4. Check Balance' },
            ],
            inputRequired: true,
            inputType: 'choice',
            inputLabel: 'Reply:',
            placeholder: '4',
            defaultInputValue: '4',
            actionLabel: 'Send',
          },
          {
            id: 2,
            title: 'MTN Mobile Money',
            prompt: `MTN MoMo — Check Balance\n\nEnter Agent 4-Digit PIN:`,
            inputRequired: true,
            inputType: 'pin',
            inputLabel: 'Reply (PIN):',
            placeholder: '••••',
            defaultInputValue: '1234',
            actionLabel: 'Check Balance',
          },
          {
            id: 3,
            title: 'MTN Mobile Money',
            prompt: `MTN Mobile Money Balance:\n\nAvailable Balance: ZMW 14,850.00\nPending Settlement: ZMW 0.00\nVendor Ref: MTN-BAL-884210\nStatus: Active Account`,
            inputRequired: false,
            isFinalStep: true,
            isSuccess: true,
            actionLabel: 'Done',
          },
        ];
      }

      return [
        {
          id: 1,
          title: 'MTN Mobile Money',
          prompt: `MTN Mobile Money\n\n1. Send Money\n2. Cash Out / Withdraw\n3. Cash In / Deposit\n4. Check Balance`,
          options: [
            { value: '1', label: '1. Send Money' },
            { value: '2', label: '2. Cash Out / Withdraw' },
            { value: '3', label: '3. Cash In / Deposit' },
            { value: '4', label: '4. Check Balance' },
          ],
          inputRequired: true,
          inputType: 'choice',
          inputLabel: 'Reply:',
          placeholder: '2',
          defaultInputValue: type.toLowerCase().includes('deposit') ? '3' : '2',
          actionLabel: 'Send',
        },
        {
          id: 2,
          title: 'MTN Mobile Money',
          prompt: `MTN MoMo — ${type}\nAmount: ${amount}\nFee: ZMW 15.00\nRef: ${requestRef || 'REQ-9082'}\n\nEnter Agent 4-Digit PIN:`,
          inputRequired: true,
          inputType: 'pin',
          inputLabel: 'Reply (PIN):',
          placeholder: '••••',
          defaultInputValue: '1234',
          actionLabel: 'Continue',
        },
        {
          id: 3,
          title: 'MTN Mobile Money',
          prompt: `Confirm MTN ${type} of ${amount}?\n\n1. Confirm\n2. Cancel`,
          options: [
            { value: '1', label: '1. Confirm' },
            { value: '2', label: '2. Cancel' },
          ],
          inputRequired: true,
          inputType: 'choice',
          inputLabel: 'Reply:',
          placeholder: '1',
          defaultInputValue: '1',
          actionLabel: 'Confirm',
        },
        {
          id: 4,
          title: 'MTN Mobile Money',
          prompt: `MTN Mobile Money\n\nTransaction successful.\n\nAmount: ${amount}\nVendor Ref: MTN-89421098\nStatus: Approved`,
          inputRequired: false,
          isFinalStep: true,
          isSuccess: true,
          actionLabel: 'Done',
        },
      ];
    },
  },

  Airtel: {
    vendor: 'Airtel',
    vendorDisplayName: 'Airtel Money',
    serviceCodeName: 'Airtel Money Service',
    accentColor: '#ef4444',
    getInitialUssdCode: () => '*778#',
    getSteps: (transactionType, amount, requestRef) => {
      const type = transactionType || 'Withdrawal';
      if (type === 'Check Balance' || type === 'balance_check') {
        return [
          {
            id: 1,
            title: 'Airtel Money',
            prompt: `Airtel Money\n\n1. Send Money\n2. Withdraw Cash\n3. Make Payment\n4. My Account / Balance`,
            options: [
              { value: '1', label: '1. Send Money' },
              { value: '2', label: '2. Withdraw Cash' },
              { value: '3', label: '3. Make Payment' },
              { value: '4', label: '4. My Account / Balance' },
            ],
            inputRequired: true,
            inputType: 'choice',
            inputLabel: 'Reply:',
            placeholder: '4',
            defaultInputValue: '4',
            actionLabel: 'Send',
          },
          {
            id: 2,
            title: 'Airtel Money',
            prompt: `Airtel Money — Check Balance\n\nEnter Agent Secret PIN:`,
            inputRequired: true,
            inputType: 'pin',
            inputLabel: 'Reply (PIN):',
            placeholder: '••••',
            defaultInputValue: '4321',
            actionLabel: 'Check Balance',
          },
          {
            id: 3,
            title: 'Airtel Money',
            prompt: `Airtel Money Balance:\n\nAvailable Float: ZMW 18,200.00\nCommission: ZMW 410.00\nVendor Ref: ATL-BAL-778291\nStatus: Active Account`,
            inputRequired: false,
            isFinalStep: true,
            isSuccess: true,
            actionLabel: 'Done',
          },
        ];
      }

      return [
        {
          id: 1,
          title: 'Airtel Money',
          prompt: `Airtel Money\n\n1. Send Money\n2. Withdraw Cash\n3. Make Payment\n4. My Account`,
          options: [
            { value: '1', label: '1. Send Money' },
            { value: '2', label: '2. Withdraw Cash' },
            { value: '3', label: '3. Make Payment' },
            { value: '4', label: '4. My Account' },
          ],
          inputRequired: true,
          inputType: 'choice',
          inputLabel: 'Reply:',
          placeholder: '2',
          defaultInputValue: type.toLowerCase().includes('deposit') ? '1' : '2',
          actionLabel: 'Send',
        },
        {
          id: 2,
          title: 'Airtel Money',
          prompt: `Airtel Money — ${type}\nAmount: ${amount}\nFee: ZMW 15.00\nRef: ${requestRef || 'REQ-9082'}\n\nEnter Agent Secret PIN:`,
          inputRequired: true,
          inputType: 'pin',
          inputLabel: 'Reply (PIN):',
          placeholder: '••••',
          defaultInputValue: '4321',
          actionLabel: 'Continue',
        },
        {
          id: 3,
          title: 'Airtel Money',
          prompt: `Authorize Airtel ${type} of ${amount}?\n\n1. Authorize\n2. Cancel`,
          options: [
            { value: '1', label: '1. Authorize' },
            { value: '2', label: '2. Cancel' },
          ],
          inputRequired: true,
          inputType: 'choice',
          inputLabel: 'Reply:',
          placeholder: '1',
          defaultInputValue: '1',
          actionLabel: 'Authorize',
        },
        {
          id: 4,
          title: 'Airtel Money',
          prompt: `Airtel Money\n\nTransaction successful.\n\nAmount: ${amount}\nVendor Ref: ATL-77829103\nStatus: Approved`,
          inputRequired: false,
          isFinalStep: true,
          isSuccess: true,
          actionLabel: 'Done',
        },
      ];
    },
  },

  Zamtel: {
    vendor: 'Zamtel',
    vendorDisplayName: 'Zamtel Kwacha',
    serviceCodeName: 'Kwacha Mobile Service',
    accentColor: '#22c55e',
    getInitialUssdCode: () => '*303#',
    getSteps: (transactionType, amount, requestRef) => {
      const type = transactionType || 'Withdrawal';
      if (type === 'Check Balance' || type === 'balance_check') {
        return [
          {
            id: 1,
            title: 'Zamtel Kwacha',
            prompt: `Zamtel Kwacha\n\n1. Send Money\n2. Cash Out\n3. Cash In\n4. Check Balance`,
            options: [
              { value: '1', label: '1. Send Money' },
              { value: '2', label: '2. Cash Out' },
              { value: '3', label: '3. Cash In' },
              { value: '4', label: '4. Check Balance' },
            ],
            inputRequired: true,
            inputType: 'choice',
            inputLabel: 'Reply:',
            placeholder: '4',
            defaultInputValue: '4',
            actionLabel: 'Send',
          },
          {
            id: 2,
            title: 'Zamtel Kwacha',
            prompt: `Zamtel Kwacha — Check Balance\n\nEnter Agent PIN:`,
            inputRequired: true,
            inputType: 'pin',
            inputLabel: 'Reply (PIN):',
            placeholder: '••••',
            defaultInputValue: '5555',
            actionLabel: 'Check Balance',
          },
          {
            id: 3,
            title: 'Zamtel Kwacha',
            prompt: `Zamtel Kwacha Balance:\n\nAvailable Balance: ZMW 9,600.00\nVendor Ref: ZMT-BAL-444910\nStatus: Active Account`,
            inputRequired: false,
            isFinalStep: true,
            isSuccess: true,
            actionLabel: 'Done',
          },
        ];
      }

      return [
        {
          id: 1,
          title: 'Zamtel Kwacha',
          prompt: `Zamtel Kwacha\n\n1. Send Money\n2. Cash Out\n3. Cash In\n4. Mini Statement`,
          options: [
            { value: '1', label: '1. Send Money' },
            { value: '2', label: '2. Cash Out' },
            { value: '3', label: '3. Cash In' },
            { value: '4', label: '4. Mini Statement' },
          ],
          inputRequired: true,
          inputType: 'choice',
          inputLabel: 'Reply:',
          placeholder: '2',
          defaultInputValue: type.toLowerCase().includes('deposit') ? '3' : '2',
          actionLabel: 'Send',
        },
        {
          id: 2,
          title: 'Zamtel Kwacha',
          prompt: `Zamtel Kwacha — ${type}\nAmount: ${amount}\nFee: ZMW 15.00\nRef: ${requestRef || 'REQ-9082'}\n\nEnter Agent PIN:`,
          inputRequired: true,
          inputType: 'pin',
          inputLabel: 'Reply (PIN):',
          placeholder: '••••',
          defaultInputValue: '5555',
          actionLabel: 'Continue',
        },
        {
          id: 3,
          title: 'Zamtel Kwacha',
          prompt: `Confirm Zamtel ${type} of ${amount}?\n\n1. Proceed\n2. Cancel`,
          options: [
            { value: '1', label: '1. Proceed' },
            { value: '2', label: '2. Cancel' },
          ],
          inputRequired: true,
          inputType: 'choice',
          inputLabel: 'Reply:',
          placeholder: '1',
          defaultInputValue: '1',
          actionLabel: 'Proceed',
        },
        {
          id: 4,
          title: 'Zamtel Kwacha',
          prompt: `Zamtel Kwacha\n\nTransaction successful.\n\nAmount: ${amount}\nVendor Ref: ZMT-44491029\nStatus: Approved`,
          inputRequired: false,
          isFinalStep: true,
          isSuccess: true,
          actionLabel: 'Done',
        },
      ];
    },
  },

  ZedMobile: {
    vendor: 'ZedMobile',
    vendorDisplayName: 'ZedMobile Money',
    serviceCodeName: 'ZedMobile Service',
    accentColor: '#9333ea',
    getInitialUssdCode: () => '*222#',
    getSteps: (transactionType, amount, requestRef) => {
      const type = transactionType || 'Withdrawal';
      if (type === 'Check Balance' || type === 'balance_check') {
        return [
          {
            id: 1,
            title: 'ZedMobile Money',
            prompt: `ZedMobile Money\n\n1. Send Money\n2. Cash Out\n3. Cash In\n4. Check Balance`,
            options: [
              { value: '1', label: '1. Send Money' },
              { value: '2', label: '2. Cash Out' },
              { value: '3', label: '3. Cash In' },
              { value: '4', label: '4. Check Balance' },
            ],
            inputRequired: true,
            inputType: 'choice',
            inputLabel: 'Reply:',
            placeholder: '4',
            defaultInputValue: '4',
            actionLabel: 'Send',
          },
          {
            id: 2,
            title: 'ZedMobile Money',
            prompt: `ZedMobile — Check Balance\n\nEnter Agent Secret PIN:`,
            inputRequired: true,
            inputType: 'pin',
            inputLabel: 'Reply (PIN):',
            placeholder: '••••',
            defaultInputValue: '7777',
            actionLabel: 'Check Balance',
          },
          {
            id: 3,
            title: 'ZedMobile Money',
            prompt: `ZedMobile Balance:\n\nAvailable Float: ZMW 11,500.00\nCommission: ZMW 320.00\nVendor Ref: ZED-BAL-222891\nStatus: Active Account`,
            inputRequired: false,
            isFinalStep: true,
            isSuccess: true,
            actionLabel: 'Done',
          },
        ];
      }

      return [
        {
          id: 1,
          title: 'ZedMobile Money',
          prompt: `ZedMobile Money\n\n1. Send Money\n2. Cash Out\n3. Cash In\n4. My Account`,
          options: [
            { value: '1', label: '1. Send Money' },
            { value: '2', label: '2. Cash Out' },
            { value: '3', label: '3. Cash In' },
            { value: '4', label: '4. My Account' },
          ],
          inputRequired: true,
          inputType: 'choice',
          inputLabel: 'Reply:',
          placeholder: '2',
          defaultInputValue: type.toLowerCase().includes('deposit') ? '3' : '2',
          actionLabel: 'Send',
        },
        {
          id: 2,
          title: 'ZedMobile Money',
          prompt: `ZedMobile — ${type}\nAmount: ${amount}\nFee: ZMW 15.00\nRef: ${requestRef || 'REQ-9082'}\n\nEnter Agent PIN:`,
          inputRequired: true,
          inputType: 'pin',
          inputLabel: 'Reply (PIN):',
          placeholder: '••••',
          defaultInputValue: '7777',
          actionLabel: 'Continue',
        },
        {
          id: 3,
          title: 'ZedMobile Money',
          prompt: `Confirm ZedMobile ${type} of ${amount}?\n\n1. Confirm\n2. Cancel`,
          options: [
            { value: '1', label: '1. Confirm' },
            { value: '2', label: '2. Cancel' },
          ],
          inputRequired: true,
          inputType: 'choice',
          inputLabel: 'Reply:',
          placeholder: '1',
          defaultInputValue: '1',
          actionLabel: 'Confirm',
        },
        {
          id: 4,
          title: 'ZedMobile Money',
          prompt: `ZedMobile Money\n\nTransaction successful.\n\nAmount: ${amount}\nVendor Ref: ZED-22289102\nStatus: Approved`,
          inputRequired: false,
          isFinalStep: true,
          isSuccess: true,
          actionLabel: 'Done',
        },
      ];
    },
  },

  Zanaco: {
    vendor: 'Zanaco',
    vendorDisplayName: 'Zanaco Mobile Banking',
    serviceCodeName: 'Zanaco Xpress',
    accentColor: '#0284c7',
    getInitialUssdCode: () => '*444#',
    getSteps: (transactionType, amount, requestRef) => {
      const type = transactionType || 'Withdrawal';
      if (type === 'Check Balance' || type === 'balance_check') {
        return [
          {
            id: 1,
            title: 'Zanaco Mobile Banking',
            prompt: `Zanaco Mobile Banking\n\n1. Transfer Money\n2. Cash Withdrawal\n3. Cash Deposit\n4. Balance Enquiry`,
            options: [
              { value: '1', label: '1. Transfer Money' },
              { value: '2', label: '2. Cash Withdrawal' },
              { value: '3', label: '3. Cash Deposit' },
              { value: '4', label: '4. Balance Enquiry' },
            ],
            inputRequired: true,
            inputType: 'choice',
            inputLabel: 'Reply:',
            placeholder: '4',
            defaultInputValue: '4',
            actionLabel: 'Send',
          },
          {
            id: 2,
            title: 'Zanaco Mobile Banking',
            prompt: `Zanaco Banking — Balance Enquiry\n\nEnter Authorization PIN:`,
            inputRequired: true,
            inputType: 'pin',
            inputLabel: 'Reply (PIN):',
            placeholder: '••••',
            defaultInputValue: '8888',
            actionLabel: 'Enquire Balance',
          },
          {
            id: 3,
            title: 'Zanaco Mobile Banking',
            prompt: `Zanaco Xpress Balance:\n\nAccount: 010293****\nAvailable Balance: ZMW 22,500.00\nVendor Ref: ZNC-BAL-501839\nStatus: Active Account`,
            inputRequired: false,
            isFinalStep: true,
            isSuccess: true,
            actionLabel: 'Done',
          },
        ];
      }

      return [
        {
          id: 1,
          title: 'Zanaco Mobile Banking',
          prompt: `Zanaco Mobile Banking\n\n1. Transfer Money\n2. Cash Withdrawal\n3. Cash Deposit\n4. Account Services`,
          options: [
            { value: '1', label: '1. Transfer Money' },
            { value: '2', label: '2. Cash Withdrawal' },
            { value: '3', label: '3. Cash Deposit' },
            { value: '4', label: '4. Account Services' },
          ],
          inputRequired: true,
          inputType: 'choice',
          inputLabel: 'Reply:',
          placeholder: '2',
          defaultInputValue: type.toLowerCase().includes('deposit') ? '3' : '2',
          actionLabel: 'Send',
        },
        {
          id: 2,
          title: 'Zanaco Mobile Banking',
          prompt: `Zanaco Banking — ${type}\nAmount: ${amount}\nFee: ZMW 15.00\nRef: ${requestRef || 'REQ-9082'}\n\nEnter Authorization PIN:`,
          inputRequired: true,
          inputType: 'pin',
          inputLabel: 'Reply (PIN):',
          placeholder: '••••',
          defaultInputValue: '8888',
          actionLabel: 'Continue',
        },
        {
          id: 3,
          title: 'Zanaco Mobile Banking',
          prompt: `Confirm Zanaco ${type} of ${amount}?\n\n1. Confirm Transfer\n2. Cancel`,
          options: [
            { value: '1', label: '1. Confirm Transfer' },
            { value: '2', label: '2. Cancel' },
          ],
          inputRequired: true,
          inputType: 'choice',
          inputLabel: 'Reply:',
          placeholder: '1',
          defaultInputValue: '1',
          actionLabel: 'Confirm',
        },
        {
          id: 4,
          title: 'Zanaco Mobile Banking',
          prompt: `Zanaco Mobile Banking\n\nTransaction successful.\n\nAmount: ${amount}\nVendor Ref: ZNC-50183920\nStatus: Approved`,
          inputRequired: false,
          isFinalStep: true,
          isSuccess: true,
          actionLabel: 'Done',
        },
      ];
    },
  },
};

export const getVendorConfig = (vendorName?: string): VendorUssdConfig => {
  const normalized = vendorName ? vendorName.trim() : 'MTN';
  for (const key of Object.keys(vendorUssdConfigs)) {
    if (normalized.toLowerCase().includes(key.toLowerCase())) {
      return vendorUssdConfigs[key];
    }
  }

  // Generic fallback preserving vendor name
  return {
    vendor: normalized || 'Vendor',
    vendorDisplayName: `${normalized || 'Vendor'} Mobile Money`,
    serviceCodeName: 'Mobile Service',
    accentColor: '#4f46e5',
    getInitialUssdCode: () => '*100#',
    getSteps: (transactionType, amount, requestRef) => {
      const type = transactionType || 'Withdrawal';
      if (type === 'Check Balance' || type === 'balance_check') {
        return [
          {
            id: 1,
            title: `${normalized} Mobile Money`,
            prompt: `${normalized} Mobile Money\n\n1. Send Money\n2. Withdraw\n3. Deposit\n4. Check Balance`,
            options: [
              { value: '1', label: '1. Send Money' },
              { value: '2', label: '2. Withdraw' },
              { value: '3', label: '3. Deposit' },
              { value: '4', label: '4. Check Balance' },
            ],
            inputRequired: true,
            inputType: 'choice',
            inputLabel: 'Reply:',
            placeholder: '4',
            defaultInputValue: '4',
            actionLabel: 'Send',
          },
          {
            id: 2,
            title: `${normalized} Mobile Money`,
            prompt: `${normalized} — Check Balance\n\nEnter Agent PIN:`,
            inputRequired: true,
            inputType: 'pin',
            inputLabel: 'Reply (PIN):',
            placeholder: '••••',
            defaultInputValue: '1234',
            actionLabel: 'Check Balance',
          },
          {
            id: 3,
            title: `${normalized} Mobile Money`,
            prompt: `${normalized} Balance:\n\nAvailable Balance: ZMW 10,000.00\nVendor Ref: VND-BAL-${Math.floor(100000 + Math.random() * 900000)}\nStatus: Active Account`,
            inputRequired: false,
            isFinalStep: true,
            isSuccess: true,
            actionLabel: 'Done',
          },
        ];
      }

      return [
        {
          id: 1,
          title: `${normalized} Mobile Money`,
          prompt: `${normalized} Mobile Money\n\n1. Send Money\n2. Withdraw\n3. Deposit\n4. Check Balance`,
          options: [
            { value: '1', label: '1. Send Money' },
            { value: '2', label: '2. Withdraw' },
            { value: '3', label: '3. Deposit' },
            { value: '4', label: '4. Check Balance' },
          ],
          inputRequired: true,
          inputType: 'choice',
          inputLabel: 'Reply:',
          placeholder: '2',
          defaultInputValue: '2',
          actionLabel: 'Send',
        },
        {
          id: 2,
          title: `${normalized} Mobile Money`,
          prompt: `${normalized} — ${type}\nAmount: ${amount}\nFee: ZMW 15.00\nRef: ${requestRef || 'REQ-9082'}\n\nEnter Agent PIN:`,
          inputRequired: true,
          inputType: 'pin',
          inputLabel: 'Reply (PIN):',
          placeholder: '••••',
          defaultInputValue: '1234',
          actionLabel: 'Continue',
        },
        {
          id: 3,
          title: `${normalized} Mobile Money`,
          prompt: `Confirm ${normalized} ${type} of ${amount}?\n\n1. Confirm\n2. Cancel`,
          options: [
            { value: '1', label: '1. Confirm' },
            { value: '2', label: '2. Cancel' },
          ],
          inputRequired: true,
          inputType: 'choice',
          inputLabel: 'Reply:',
          placeholder: '1',
          defaultInputValue: '1',
          actionLabel: 'Confirm',
        },
        {
          id: 4,
          title: `${normalized} Mobile Money`,
          prompt: `${normalized} Mobile Money\n\nTransaction successful.\n\nAmount: ${amount}\nVendor Ref: VND-${Math.floor(10000000 + Math.random() * 90000000)}\nStatus: Approved`,
          inputRequired: false,
          isFinalStep: true,
          isSuccess: true,
          actionLabel: 'Done',
        },
      ];
    },
  };
};
