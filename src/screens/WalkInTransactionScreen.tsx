import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronDown,
  Store,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Lock,
  Clock,
  X,
  ShieldCheck,
  Check,
  ArrowRight,
  FileCheck2,
} from 'lucide-react';
import { TellerBudLogo } from '../components/TellerBudLogo';
import {
  WorkAssignment,
  WalkInTransactionPreviewState,
  WalkInTransactionTypeOption,
  WalkInVendorOption,
  WalkInTransactionRecord,
  VendorType,
} from '../types';
import {
  CONFIGURED_TRANSACTION_TYPES,
  CONFIGURED_VENDORS,
  CONFIGURED_VENDOR_TYPES,
  getTransactionTypeConfig,
  getVendorConfigOption,
  getVendorsByType,
  getVendorType,
} from '../config/walkInConfig';
import {
  validateCustomerPhoneNumber,
  OPERATING_COUNTRIES,
} from '../config/countryConfig';
import {
  formatCurrencyValue,
} from '../config/currencyConfig';
import { AndroidPhoneDialler } from '../components/AndroidPhoneDialler';
import { VendorUssdOverlay } from '../components/VendorUssdOverlay';

export interface WalkInTransactionScreenProps {
  previewState?: WalkInTransactionPreviewState;
  assignment?: WorkAssignment | null;
  currencySymbol?: string;
  onBack?: () => void;
  onTransactionRecorded?: (record: WalkInTransactionRecord) => void;
}

interface PerformedTxnSnapshot {
  transactionType: string;
  isCashIn: boolean;
  vendorType?: VendorType;
  vendor?: string;
  vendorAccentColor?: string;
  currencyCode: string;
  currencySymbol: string;
  currencyName: string;
  amountRaw: string;
  formattedAmount: string;
  customerPhone: string;
  normalizedPhone: string;
  selectedCountryName: string;
  callingCode: string;
  booth: string;
  store: string;
  business: string;
  agentName: string;
  agentId: string;
  vendorConfirmationCaptured: boolean;
  vendorReference?: string;
  serviceFee: string;
  vendorTimestamp?: string;
}

export const WalkInTransactionScreen: React.FC<WalkInTransactionScreenProps> = ({
  previewState = 'ready',
  assignment,
  currencySymbol = 'ZMW',
  onBack,
  onTransactionRecorded,
}) => {
  // Resolve current active booth context
  const currentAssignment = useMemo<WorkAssignment | null>(() => {
    if (previewState === 'no_active_session') return null;
    return (
      assignment || {
        business: 'Apex Retail Group',
        store: 'Central Mall Branch #104',
        booth: 'Booth 03 — Main Atrium',
        location: 'Lusaka, Zambia',
        agentName: 'Marcus Vance',
        agentId: 'AG-88421',
      }
    );
  }, [assignment, previewState]);

  // Walk-In transactions are strictly Zambia-only with fixed ZMW currency & +260 calling code
  const countryConfig = OPERATING_COUNTRIES.ZM;
  const currencyCode = 'ZMW';
  const currencySymbolDisplay = 'ZMW';
  const currencyName = 'Zambian Kwacha';

  // Form State
  const [selectedTypeId, setSelectedTypeId] = useState<string>(() => {
    if (
      previewState === 'cash_in_ready' ||
      previewState === 'cash_in_ussd' ||
      previewState === 'cash_in_performed' ||
      previewState === 'cash_in_recorded' ||
      previewState === 'ussd_in_progress' ||
      previewState === 'transaction_failed' ||
      previewState === 'result_unknown' ||
      previewState === 'vendor_required'
    ) {
      return 'deposit';
    }
    if (
      previewState === 'cash_out_ready' ||
      previewState === 'cash_out_performed' ||
      previewState === 'cash_out_recorded' ||
      previewState === 'transaction_recorded'
    ) {
      return 'withdrawal';
    }
    return '';
  });

  const [selectedVendorType, setSelectedVendorType] = useState<VendorType | ''>(() => {
    if (
      previewState === 'cash_in_ready' ||
      previewState === 'cash_in_ussd' ||
      previewState === 'cash_in_performed' ||
      previewState === 'cash_in_recorded' ||
      previewState === 'cash_out_ready' ||
      previewState === 'cash_out_performed' ||
      previewState === 'cash_out_recorded' ||
      previewState === 'ussd_in_progress' ||
      previewState === 'transaction_recorded' ||
      previewState === 'transaction_failed' ||
      previewState === 'result_unknown'
    ) {
      return 'MNO';
    }
    return '';
  });

  const [selectedVendorId, setSelectedVendorId] = useState<string>(() => {
    if (
      previewState === 'cash_in_ready' ||
      previewState === 'cash_in_ussd' ||
      previewState === 'cash_in_performed' ||
      previewState === 'cash_in_recorded' ||
      previewState === 'cash_out_ready' ||
      previewState === 'cash_out_performed' ||
      previewState === 'cash_out_recorded' ||
      previewState === 'ussd_in_progress' ||
      previewState === 'transaction_recorded' ||
      previewState === 'transaction_failed' ||
      previewState === 'result_unknown'
    ) {
      return 'mtn';
    }
    return '';
  });

  const [amountRaw, setAmountRaw] = useState<string>(() => {
    if (
      previewState === 'cash_in_ready' ||
      previewState === 'cash_in_ussd' ||
      previewState === 'cash_in_performed' ||
      previewState === 'cash_in_recorded' ||
      previewState === 'cash_out_ready' ||
      previewState === 'cash_out_performed' ||
      previewState === 'cash_out_recorded' ||
      previewState === 'ussd_in_progress' ||
      previewState === 'transaction_recorded' ||
      previewState === 'transaction_failed' ||
      previewState === 'result_unknown'
    ) {
      return '15000';
    }
    return '';
  });

  const [customerPhone, setCustomerPhone] = useState<string>(() => {
    if (
      previewState === 'cash_in_ready' ||
      previewState === 'cash_in_ussd' ||
      previewState === 'cash_in_performed' ||
      previewState === 'cash_in_recorded' ||
      previewState === 'cash_out_ready' ||
      previewState === 'cash_out_performed' ||
      previewState === 'cash_out_recorded' ||
      previewState === 'ussd_in_progress' ||
      previewState === 'transaction_recorded' ||
      previewState === 'transaction_failed' ||
      previewState === 'result_unknown'
    ) {
      return countryConfig.samplePhoneNumber;
    }
    return '';
  });

  const [, setPhoneTouched] = useState<boolean>(false);

  // UI Flow & Sheet States
  const [showTypeSheet, setShowTypeSheet] = useState(false);
  const [showVendorTypeSheet, setShowVendorTypeSheet] = useState(false);
  const [showVendorSheet, setShowVendorSheet] = useState(false);
  const [showConfirmSheet, setShowConfirmSheet] = useState(false);

  // Execution Step State
  const [flowStatus, setFlowStatus] = useState<
    | 'form'
    | 'dialler'
    | 'ussd_in_progress'
    | 'performed'
    | 'recording'
    | 'recorded'
    | 'failed'
    | 'failed_recording'
    | 'status_not_confirmed'
    | 'connection_issue'
  >(() => {
    switch (previewState) {
      case 'cash_in_ussd':
      case 'ussd_in_progress':
        return 'dialler';
      case 'cash_in_performed':
      case 'cash_out_performed':
        return 'performed';
      case 'recording':
        return 'recording';
      case 'cash_in_recorded':
      case 'cash_out_recorded':
      case 'transaction_recorded':
        return 'recorded';
      case 'transaction_failed':
        return 'failed';
      case 'result_unknown':
        return 'status_not_confirmed';
      case 'connection_issue':
        return 'connection_issue';
      case 'no_active_session':
      case 'vendor_required':
      case 'cash_in_ready':
      case 'cash_out_ready':
      case 'ready':
      default:
        return 'form';
    }
  });

  // Intermediate Transaction Performed Snapshot (awaiting agent confirmation)
  const [performedSnapshot, setPerformedSnapshot] =
    useState<PerformedTxnSnapshot | null>(() => {
      const samplePhone = countryConfig.samplePhoneNumber;
      if (previewState === 'cash_in_performed') {
        return {
          transactionType: 'Deposit',
          isCashIn: true,
          vendorType: 'MNO',
          vendor: 'MTN',
          vendorAccentColor: '#eab308',
          currencyCode,
          currencySymbol: currencySymbolDisplay,
          currencyName,
          amountRaw: '15000',
          formattedAmount: formatCurrencyValue('15000', currencySymbolDisplay),
          customerPhone: samplePhone,
          normalizedPhone: countryConfig.normalizePhone(samplePhone),
          selectedCountryName: countryConfig.name,
          callingCode: countryConfig.callingCode,
          booth: currentAssignment?.booth || 'Booth 03 — Main Atrium',
          store: currentAssignment?.store || 'Central Mall Branch #104',
          business: currentAssignment?.business || 'Apex Retail Group',
          agentName: currentAssignment?.agentName || 'Marcus Vance',
          agentId: currentAssignment?.agentId || 'AG-88421',
          vendorConfirmationCaptured: true,
          vendorReference: 'MTN-89421098',
          serviceFee: 'ZMW 5.00',
        };
      }
      if (previewState === 'cash_out_performed') {
        return {
          transactionType: 'Withdrawal',
          isCashIn: false,
          vendorType: 'MNO',
          vendor: 'MTN',
          vendorAccentColor: '#eab308',
          currencyCode,
          currencySymbol: currencySymbolDisplay,
          currencyName,
          amountRaw: '15000',
          formattedAmount: formatCurrencyValue('15000', currencySymbolDisplay),
          customerPhone: samplePhone,
          normalizedPhone: countryConfig.normalizePhone(samplePhone),
          selectedCountryName: countryConfig.name,
          callingCode: countryConfig.callingCode,
          booth: currentAssignment?.booth || 'Booth 03 — Main Atrium',
          store: currentAssignment?.store || 'Central Mall Branch #104',
          business: currentAssignment?.business || 'Apex Retail Group',
          agentName: currentAssignment?.agentName || 'Marcus Vance',
          agentId: currentAssignment?.agentId || 'AG-88421',
          vendorConfirmationCaptured: false,
          serviceFee: 'ZMW 5.00',
        };
      }
      return null;
    });

  // Recorded transaction snapshot
  const [recordedRecord, setRecordedRecord] =
    useState<WalkInTransactionRecord | null>(() => {
      const samplePhone = countryConfig.samplePhoneNumber;
      if (previewState === 'cash_in_recorded') {
        return {
          id: 'TXN-WI-88421098',
          transactionReference: 'WI-88421098',
          transactionType: 'Deposit',
          vendorType: 'MNO',
          vendor: 'MTN',
          amount: formatCurrencyValue('15000', currencySymbolDisplay),
          currencyCode,
          currencySymbol: currencySymbolDisplay,
          phoneNumber: samplePhone,
          normalizedPhoneNumber: countryConfig.normalizePhone(samplePhone),
          selectedCountry: countryConfig.name,
          dialCode: countryConfig.callingCode,
          booth: currentAssignment?.booth || 'Booth 03 — Main Atrium',
          store: currentAssignment?.store || 'Central Mall Branch #104',
          business: currentAssignment?.business || 'Apex Retail Group',
          agentName: currentAssignment?.agentName || 'Marcus Vance',
          agentId: currentAssignment?.agentId || 'AG-88421',
          recordedAt: 'Today, 11:42 AM',
          confirmedAt: 'Today, 11:42 AM',
          status: 'recorded',
          vendorConfirmationCaptured: true,
          vendorReference: 'MTN-89421098',
          serviceFee: 'ZMW 5.00',
        };
      }
      if (previewState === 'cash_out_recorded' || previewState === 'transaction_recorded') {
        return {
          id: 'TXN-WI-88421098',
          transactionReference: 'WI-88421098',
          transactionType: 'Withdrawal',
          vendorType: 'MNO',
          vendor: 'MTN',
          amount: formatCurrencyValue('15000', currencySymbolDisplay),
          currencyCode,
          currencySymbol: currencySymbolDisplay,
          phoneNumber: samplePhone,
          normalizedPhoneNumber: countryConfig.normalizePhone(samplePhone),
          selectedCountry: countryConfig.name,
          dialCode: countryConfig.callingCode,
          booth: currentAssignment?.booth || 'Booth 03 — Main Atrium',
          store: currentAssignment?.store || 'Central Mall Branch #104',
          business: currentAssignment?.business || 'Apex Retail Group',
          agentName: currentAssignment?.agentName || 'Marcus Vance',
          agentId: currentAssignment?.agentId || 'AG-88421',
          recordedAt: 'Today, 11:42 AM',
          confirmedAt: 'Today, 11:42 AM',
          status: 'recorded',
          vendorConfirmationCaptured: false,
          serviceFee: 'ZMW 5.00',
        };
      }
      return null;
    });

  // Validation errors
  const [errors, setErrors] = useState<{
    type?: string;
    vendorType?: string;
    vendor?: string;
    amount?: string;
    phone?: string;
  }>({});

  const [isRecording, setIsRecording] = useState(previewState === 'recording');
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [isRetryingConnection, setIsRetryingConnection] = useState(false);

  // Resolve active transaction type configuration
  const activeTypeConfig = useMemo<WalkInTransactionTypeOption | undefined>(() => {
    return CONFIGURED_TRANSACTION_TYPES.find((t) => t.id === selectedTypeId);
  }, [selectedTypeId]);

  // Resolve available vendors filtered strictly by selected vendor type
  const availableVendors = useMemo<WalkInVendorOption[]>(() => {
    if (!selectedVendorType) return [];
    return getVendorsByType(selectedVendorType);
  }, [selectedVendorType]);

  // Resolve active vendor configuration
  const activeVendorConfig = useMemo<WalkInVendorOption | undefined>(() => {
    return CONFIGURED_VENDORS.find((v) => v.id === selectedVendorId);
  }, [selectedVendorId]);

  // Handle Vendor Type change: clears existing vendor selection as required
  const handleVendorTypeChange = (newType: VendorType) => {
    setSelectedVendorType(newType);
    setSelectedVendorId(''); // Mandatory rule: clear previous vendor selection
    if (errors.vendorType) {
      setErrors((prev) => ({ ...prev, vendorType: undefined }));
    }
    if (errors.vendor) {
      setErrors((prev) => ({ ...prev, vendor: undefined }));
    }
  };

  // Sync external previewState changes
  useEffect(() => {
    const samplePhone = countryConfig.samplePhoneNumber;
    switch (previewState) {
      case 'cash_in_ready':
        setSelectedTypeId('deposit');
        setSelectedVendorType('MNO');
        setSelectedVendorId('mtn');
        setAmountRaw('15000');
        setCustomerPhone(samplePhone);
        setFlowStatus('form');
        setPerformedSnapshot(null);
        setRecordedRecord(null);
        setErrors({});
        break;
      case 'cash_in_ussd':
        setSelectedTypeId('deposit');
        setSelectedVendorType('MNO');
        setSelectedVendorId('mtn');
        setAmountRaw('15000');
        setCustomerPhone(samplePhone);
        setFlowStatus('dialler');
        setPerformedSnapshot(null);
        setRecordedRecord(null);
        setErrors({});
        break;
      case 'ussd_in_progress':
        setSelectedTypeId('deposit');
        setSelectedVendorType('MNO');
        setSelectedVendorId('mtn');
        setAmountRaw('15000');
        setCustomerPhone(samplePhone);
        setFlowStatus('ussd_in_progress');
        setPerformedSnapshot(null);
        setRecordedRecord(null);
        setErrors({});
        break;
      case 'cash_in_performed': {
        setSelectedTypeId('deposit');
        setSelectedVendorType('MNO');
        setSelectedVendorId('mtn');
        setAmountRaw('15000');
        setCustomerPhone(samplePhone);
        setFlowStatus('performed');
        setPerformedSnapshot({
          transactionType: 'Deposit',
          isCashIn: true,
          vendorType: 'MNO',
          vendor: 'MTN',
          vendorAccentColor: '#eab308',
          currencyCode,
          currencySymbol: currencySymbolDisplay,
          currencyName,
          amountRaw: '15000',
          formattedAmount: formatCurrencyValue('15000', currencySymbolDisplay),
          customerPhone: samplePhone,
          normalizedPhone: countryConfig.normalizePhone(samplePhone),
          selectedCountryName: countryConfig.name,
          callingCode: countryConfig.callingCode,
          booth: currentAssignment?.booth || 'Booth 03 — Main Atrium',
          store: currentAssignment?.store || 'Central Mall Branch #104',
          business: currentAssignment?.business || 'Apex Retail Group',
          agentName: currentAssignment?.agentName || 'Marcus Vance',
          agentId: currentAssignment?.agentId || 'AG-88421',
          vendorConfirmationCaptured: true,
          vendorReference: 'MTN-89421098',
          serviceFee: 'ZMW 5.00',
        });
        setRecordedRecord(null);
        setErrors({});
        break;
      }
      case 'cash_in_recorded': {
        setSelectedTypeId('deposit');
        setSelectedVendorType('MNO');
        setSelectedVendorId('mtn');
        setAmountRaw('15000');
        setCustomerPhone(samplePhone);
        setFlowStatus('recorded');
        setRecordedRecord({
          id: 'TXN-WI-88421098',
          transactionReference: 'WI-88421098',
          transactionType: 'Deposit',
          vendorType: 'MNO',
          vendor: 'MTN',
          amount: formatCurrencyValue('15000', currencySymbolDisplay),
          currencyCode,
          currencySymbol: currencySymbolDisplay,
          phoneNumber: samplePhone,
          normalizedPhoneNumber: countryConfig.normalizePhone(samplePhone),
          selectedCountry: countryConfig.name,
          dialCode: countryConfig.callingCode,
          booth: currentAssignment?.booth || 'Booth 03 — Main Atrium',
          store: currentAssignment?.store || 'Central Mall Branch #104',
          business: currentAssignment?.business || 'Apex Retail Group',
          agentName: currentAssignment?.agentName || 'Marcus Vance',
          agentId: currentAssignment?.agentId || 'AG-88421',
          recordedAt: 'Today, 11:42 AM',
          confirmedAt: 'Today, 11:42 AM',
          status: 'recorded',
          vendorConfirmationCaptured: true,
          vendorReference: 'MTN-89421098',
          serviceFee: 'ZMW 5.00',
        });
        break;
      }
      case 'cash_out_ready':
        setSelectedTypeId('withdrawal');
        setSelectedVendorType('MNO');
        setSelectedVendorId('mtn');
        setAmountRaw('15000');
        setCustomerPhone(samplePhone);
        setFlowStatus('form');
        setPerformedSnapshot(null);
        setRecordedRecord(null);
        setErrors({});
        break;
      case 'cash_out_performed': {
        setSelectedTypeId('withdrawal');
        setSelectedVendorType('MNO');
        setSelectedVendorId('mtn');
        setAmountRaw('15000');
        setCustomerPhone(samplePhone);
        setFlowStatus('performed');
        setPerformedSnapshot({
          transactionType: 'Withdrawal',
          isCashIn: false,
          vendorType: 'MNO',
          vendor: 'MTN',
          vendorAccentColor: '#eab308',
          currencyCode,
          currencySymbol: currencySymbolDisplay,
          currencyName,
          amountRaw: '15000',
          formattedAmount: formatCurrencyValue('15000', currencySymbolDisplay),
          customerPhone: samplePhone,
          normalizedPhone: countryConfig.normalizePhone(samplePhone),
          selectedCountryName: countryConfig.name,
          callingCode: countryConfig.callingCode,
          booth: currentAssignment?.booth || 'Booth 03 — Main Atrium',
          store: currentAssignment?.store || 'Central Mall Branch #104',
          business: currentAssignment?.business || 'Apex Retail Group',
          agentName: currentAssignment?.agentName || 'Marcus Vance',
          agentId: currentAssignment?.agentId || 'AG-88421',
          vendorConfirmationCaptured: false,
          serviceFee: 'ZMW 5.00',
        });
        setRecordedRecord(null);
        setErrors({});
        break;
      }
      case 'cash_out_recorded':
      case 'transaction_recorded': {
        setSelectedTypeId('withdrawal');
        setSelectedVendorType('MNO');
        setSelectedVendorId('mtn');
        setAmountRaw('15000');
        setCustomerPhone(samplePhone);
        setFlowStatus('recorded');
        setRecordedRecord({
          id: 'TXN-WI-88421098',
          transactionReference: 'WI-88421098',
          transactionType: 'Withdrawal',
          vendorType: 'MNO',
          vendor: 'MTN',
          amount: formatCurrencyValue('15000', currencySymbolDisplay),
          currencyCode,
          currencySymbol: currencySymbolDisplay,
          phoneNumber: samplePhone,
          normalizedPhoneNumber: countryConfig.normalizePhone(samplePhone),
          selectedCountry: countryConfig.name,
          dialCode: countryConfig.callingCode,
          booth: currentAssignment?.booth || 'Booth 03 — Main Atrium',
          store: currentAssignment?.store || 'Central Mall Branch #104',
          business: currentAssignment?.business || 'Apex Retail Group',
          agentName: currentAssignment?.agentName || 'Marcus Vance',
          agentId: currentAssignment?.agentId || 'AG-88421',
          recordedAt: 'Today, 11:42 AM',
          confirmedAt: 'Today, 11:42 AM',
          status: 'recorded',
          vendorConfirmationCaptured: false,
          serviceFee: 'ZMW 5.00',
        });
        break;
      }
      case 'recording': {
        setSelectedTypeId('deposit');
        setSelectedVendorType('MNO');
        setSelectedVendorId('mtn');
        setAmountRaw('15000');
        setCustomerPhone(samplePhone);
        setFlowStatus('performed');
        setIsRecording(true);
        setPerformedSnapshot({
          transactionType: 'Deposit',
          isCashIn: true,
          vendorType: 'MNO',
          vendor: 'MTN',
          vendorAccentColor: '#eab308',
          currencyCode,
          currencySymbol: currencySymbolDisplay,
          currencyName,
          amountRaw: '15000',
          formattedAmount: formatCurrencyValue('15000', currencySymbolDisplay),
          customerPhone: samplePhone,
          normalizedPhone: countryConfig.normalizePhone(samplePhone),
          selectedCountryName: countryConfig.name,
          callingCode: countryConfig.callingCode,
          booth: currentAssignment?.booth || 'Booth 03 — Main Atrium',
          store: currentAssignment?.store || 'Central Mall Branch #104',
          business: currentAssignment?.business || 'Apex Retail Group',
          agentName: currentAssignment?.agentName || 'Marcus Vance',
          agentId: currentAssignment?.agentId || 'AG-88421',
          vendorConfirmationCaptured: true,
          vendorReference: 'MTN-89421098',
          serviceFee: 'ZMW 5.00',
        });
        break;
      }
      case 'transaction_failed':
        setSelectedTypeId('deposit');
        setSelectedVendorType('MNO');
        setSelectedVendorId('mtn');
        setAmountRaw('15000');
        setCustomerPhone(samplePhone);
        setFlowStatus('failed');
        break;
      case 'result_unknown':
        setSelectedTypeId('deposit');
        setSelectedVendorType('MNO');
        setSelectedVendorId('mtn');
        setAmountRaw('15000');
        setCustomerPhone(samplePhone);
        setFlowStatus('status_not_confirmed');
        break;
      case 'connection_issue':
        setFlowStatus('connection_issue');
        break;
      case 'vendor_required':
        setSelectedTypeId('deposit');
        setSelectedVendorType('');
        setSelectedVendorId('');
        setAmountRaw('15000');
        setCustomerPhone(samplePhone);
        setFlowStatus('form');
        break;
      case 'ready':
      case 'no_active_session':
      default:
        if (previewState === 'ready') {
          setSelectedTypeId('');
          setSelectedVendorType('');
          setSelectedVendorId('');
          setAmountRaw('');
          setCustomerPhone('');
          setPhoneTouched(false);
          setFlowStatus('form');
          setPerformedSnapshot(null);
          setRecordedRecord(null);
          setErrors({});
        }
        break;
    }
  }, [previewState, currentAssignment]);

  // Format currency display strictly using ZK symbol
  const formatCurrency = (val: string | number) => {
    return formatCurrencyValue(val, 'ZK');
  };

  // Amount input handler
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = e.target.value.replace(/[^0-9.]/g, '');
    const parts = clean.split('.');
    if (parts.length > 2) return;
    setAmountRaw(clean);
    if (errors.amount) {
      if (clean.trim()) {
        const num = parseFloat(clean);
        if (!isNaN(num) && num > 0) {
          setErrors((prev) => ({ ...prev, amount: undefined }));
        } else if (errors.amount === 'Required') {
          setErrors((prev) => ({ ...prev, amount: undefined }));
        }
      }
    }
  };

  // Phone input handler (accepts subscriber numbers for Zambia +260)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = countryConfig.formatPhoneInput(e.target.value);
    setCustomerPhone(formatted);

    if (errors.phone) {
      if (!formatted.trim()) {
        if (errors.phone !== 'Required') {
          setErrors((prev) => ({ ...prev, phone: undefined }));
        }
      } else {
        const validation = validateCustomerPhoneNumber(formatted, countryConfig);
        if (validation.isValid) {
          setErrors((prev) => ({ ...prev, phone: undefined }));
        } else if (errors.phone === 'Required') {
          setErrors((prev) => ({ ...prev, phone: undefined }));
        }
      }
    }
  };

  const handlePhoneBlur = () => {
    setPhoneTouched(true);
    if (!customerPhone || !customerPhone.trim()) {
      return;
    }
    const validation = validateCustomerPhoneNumber(customerPhone, countryConfig);
    if (!validation.isValid) {
      setErrors((prev) => ({
        ...prev,
        phone: 'Enter a valid phone number.',
      }));
    } else {
      setErrors((prev) => ({ ...prev, phone: undefined }));
    }
  };

  // Form submission / validation
  const validateForm = (): boolean => {
    const newErrors: {
      type?: string;
      vendorType?: string;
      vendor?: string;
      amount?: string;
      phone?: string;
    } = {};

    if (!selectedTypeId) {
      newErrors.type = 'Required';
    }

    if (activeTypeConfig?.requiresVendor) {
      if (!selectedVendorType) {
        newErrors.vendorType = 'Required';
      }
      if (!selectedVendorId) {
        newErrors.vendor = 'Required';
      }
    }

    if (!amountRaw || !amountRaw.trim()) {
      newErrors.amount = 'Required';
    } else {
      const numericAmount = parseFloat(amountRaw);
      if (isNaN(numericAmount) || numericAmount <= 0) {
        newErrors.amount = 'Enter a valid amount.';
      }
    }

    if (!customerPhone || !customerPhone.trim()) {
      newErrors.phone = 'Required';
    } else {
      const phoneValidation = validateCustomerPhoneNumber(customerPhone, countryConfig);
      if (!phoneValidation.isValid) {
        newErrors.phone = 'Enter a valid phone number.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePerformTransactionClick = () => {
    setPhoneTouched(true);
    if (!validateForm()) return;
    setShowConfirmSheet(true);
  };

  // Step 2: Confirm -> Launch USSD (Deposit) or proceed to Transaction Performed (Withdrawal / Purchase)
  const handleConfirmAndProceed = () => {
    setShowConfirmSheet(false);
    const isCashIn = activeTypeConfig?.id === 'deposit' || activeTypeConfig?.id === 'cash_in' || Boolean(activeTypeConfig?.usesUssd);

    if (isCashIn && activeVendorConfig) {
      // Deposit initiates outgoing USSD / dialler
      setFlowStatus('dialler');
    } else {
      // Withdrawal / Purchase: No outgoing USSD.
      // Transition directly to the intermediate "Transaction performed" state!
      const normalizedPhone = countryConfig.normalizePhone(customerPhone);
      setPerformedSnapshot({
        transactionType: activeTypeConfig?.label || 'Withdrawal',
        isCashIn: false,
        vendorType: selectedVendorType || activeVendorConfig?.type || getVendorType(activeVendorConfig?.name) || 'MNO',
        vendor: activeVendorConfig?.name,
        vendorAccentColor: activeVendorConfig?.accentColor || '#0052CC',
        currencyCode,
        currencySymbol: currencySymbolDisplay,
        currencyName,
        amountRaw,
        formattedAmount: formatCurrency(amountRaw),
        customerPhone: customerPhone.trim(),
        normalizedPhone,
        selectedCountryName: countryConfig.name,
        callingCode: countryConfig.callingCode,
        booth: currentAssignment?.booth || 'Booth 03 — Main Atrium',
        store: currentAssignment?.store || 'Central Mall Branch #104',
        business: currentAssignment?.business || 'Apex Retail Group',
        agentName: currentAssignment?.agentName || 'Marcus Vance',
        agentId: currentAssignment?.agentId || 'AG-88421',
        vendorConfirmationCaptured: false,
        serviceFee: activeTypeConfig?.defaultFee || 'ZK5.00',
      });
      setFlowStatus('performed');
    }
  };

  // Intermediate state -> Final Agent Confirmation and TellerBud Recording
  const handleAgentConfirmTransaction = () => {
    if (isRecording) return; // Prevent duplicate taps
    setIsRecording(true);

    // Simulate smooth, state-driven commitment
    setTimeout(() => {
      try {
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });
        const refCode = `WI-${Math.floor(10000000 + Math.random() * 90000000)}`;

        const data = performedSnapshot || {
          transactionType: activeTypeConfig?.label || 'Deposit',
          isCashIn: activeTypeConfig?.id === 'deposit' || activeTypeConfig?.id === 'cash_in',
          vendorType: selectedVendorType || activeVendorConfig?.type || getVendorType(activeVendorConfig?.name) || 'MNO',
          vendor: activeVendorConfig?.name,
          currencyCode,
          currencySymbol: currencySymbolDisplay,
          currencyName,
          amountRaw,
          formattedAmount: formatCurrency(amountRaw),
          customerPhone: customerPhone.trim(),
          normalizedPhone: countryConfig.normalizePhone(customerPhone),
          selectedCountryName: countryConfig.name,
          callingCode: countryConfig.callingCode,
          booth: currentAssignment?.booth || 'Booth 03 — Main Atrium',
          store: currentAssignment?.store || 'Central Mall Branch #104',
          business: currentAssignment?.business || 'Apex Retail Group',
          agentName: currentAssignment?.agentName || 'Marcus Vance',
          agentId: currentAssignment?.agentId || 'AG-88421',
          vendorConfirmationCaptured: activeTypeConfig?.id === 'deposit' || activeTypeConfig?.id === 'cash_in',
          vendorReference:
            (activeTypeConfig?.id === 'deposit' || activeTypeConfig?.id === 'cash_in')
              ? `${(activeVendorConfig?.name || 'MTN').substring(0, 3).toUpperCase()}-89421098`
              : undefined,
          serviceFee: activeTypeConfig?.defaultFee || 'ZK5.00',
        };

        const newRecord: WalkInTransactionRecord = {
          id: `TXN-${refCode}`,
          transactionReference: refCode,
          transactionType: data.transactionType,
          vendorType: data.vendorType || getVendorType(data.vendor) || 'MNO',
          vendor: data.vendor,
          amount: data.formattedAmount,
          currencyCode: data.currencyCode,
          currencySymbol: data.currencySymbol,
          phoneNumber: data.customerPhone,
          normalizedPhoneNumber: data.normalizedPhone,
          selectedCountry: data.selectedCountryName,
          dialCode: data.callingCode,
          booth: data.booth,
          store: data.store,
          business: data.business,
          agentName: data.agentName,
          agentId: data.agentId,
          recordedAt: `Today, ${timeStr}`,
          confirmedAt: `Today, ${timeStr}`,
          rawDate: now,
          rawConfirmedAt: now,
          status: 'recorded',
          vendorConfirmationCaptured: data.vendorConfirmationCaptured,
          vendorReference: data.vendorReference,
          serviceFee: data.serviceFee,
        };

        setRecordedRecord(newRecord);
        setIsRecording(false);
        setFlowStatus('recorded');

        // Propagate record to parent app state (Screen 16 History, Wallet, Management)
        if (onTransactionRecorded) {
          onTransactionRecorded(newRecord);
        }
      } catch (err) {
        setIsRecording(false);
        setFlowStatus('failed_recording');
      }
    }, 400);
  };

  // USSD Flow Handlers
  const handleDiallerCall = (_dialledCode: string) => {
    setFlowStatus('ussd_in_progress');
  };

  const handleDiallerCancel = () => {
    setFlowStatus('form');
  };

  // USSD Success transitions to intermediate "Transaction performed" state!
  const handleUssdSuccess = (vendorRef: string) => {
    const normalizedPhone = countryConfig.normalizePhone(customerPhone);
    setPerformedSnapshot({
      transactionType: activeTypeConfig?.label || 'Deposit',
      isCashIn: true,
      vendorType: selectedVendorType || activeVendorConfig?.type || getVendorType(activeVendorConfig?.name) || 'MNO',
      vendor: activeVendorConfig?.name,
      vendorAccentColor: activeVendorConfig?.accentColor || '#0052CC',
      currencyCode,
      currencySymbol: currencySymbolDisplay,
      currencyName,
      amountRaw,
      formattedAmount: formatCurrency(amountRaw),
      customerPhone: customerPhone.trim(),
      normalizedPhone,
      selectedCountryName: countryConfig.name,
      callingCode: countryConfig.callingCode,
      booth: currentAssignment?.booth || 'Booth 03 — Main Atrium',
      store: currentAssignment?.store || 'Central Mall Branch #104',
      business: currentAssignment?.business || 'Apex Retail Group',
      agentName: currentAssignment?.agentName || 'Marcus Vance',
      agentId: currentAssignment?.agentId || 'AG-88421',
      vendorConfirmationCaptured: true,
      vendorReference: vendorRef,
      serviceFee: activeTypeConfig?.defaultFee || 'ZK5.00',
    });
    setFlowStatus('performed');
  };

  const handleUssdCancel = () => {
    setFlowStatus('form');
  };

  const handleUssdFailure = () => {
    setFlowStatus('failed');
  };

  const handleUssdUnknown = () => {
    setFlowStatus('status_not_confirmed');
  };

  const handleCheckStatus = () => {
    setIsCheckingStatus(true);
    setTimeout(() => {
      setIsCheckingStatus(false);
      handleAgentConfirmTransaction();
    }, 850);
  };

  const handleRetryConnection = () => {
    setIsRetryingConnection(true);
    setTimeout(() => {
      setIsRetryingConnection(false);
      setFlowStatus('form');
    }, 650);
  };

  // Render USSD or Dialler Overlay if active
  if (flowStatus === 'dialler' && activeVendorConfig) {
    return (
      <AndroidPhoneDialler
        vendor={activeVendorConfig.name}
        transactionType={activeTypeConfig?.label || 'Deposit'}
        amount={formatCurrency(amountRaw)}
        requestRef={`WI-${currentAssignment?.agentId || 'AG-88421'}`}
        onCall={handleDiallerCall}
        onCancel={handleDiallerCancel}
      />
    );
  }

  if (flowStatus === 'ussd_in_progress' && activeVendorConfig) {
    return (
      <VendorUssdOverlay
        vendor={activeVendorConfig.name}
        transactionType={activeTypeConfig?.label || 'Deposit'}
        amount={formatCurrency(amountRaw)}
        requestRef={`WI-${currentAssignment?.agentId || 'AG-88421'}`}
        onSuccess={handleUssdSuccess}
        onCancel={handleUssdCancel}
        onFailure={handleUssdFailure}
        onUnknownStatus={handleUssdUnknown}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-50 relative overflow-hidden font-sans text-slate-900 select-none">
      {/* 1. Header (Read-only focused transaction workflow) */}
      <header className="bg-white border-b border-slate-200/80 px-4 py-3 shrink-0 flex items-center justify-between z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 active:text-[#0052CC] transition-colors py-1 pr-2 -ml-1"
          aria-label="Back to Home"
        >
          <ChevronLeft className="w-4 h-4 text-slate-600" />
          <span>Home</span>
        </button>

        <h1 className="text-sm font-bold text-slate-900 text-center tracking-tight">
          Walk-In Transaction
        </h1>

        <div className="flex items-center justify-end w-10">
          <TellerBudLogo size="sm" />
        </div>
      </header>

      {/* 2. Main Content Body */}
      <div className="flex-1 overflow-y-auto px-4 py-3.5 space-y-3.5">
        {/* State: No Active Work Session (Blocking) */}
        {!currentAssignment ? (
          <div className="bg-white border border-rose-200/90 rounded-2xl p-6 text-center shadow-sm flex flex-col items-center justify-center my-6 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shadow-inner">
              <Lock className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-slate-900">
                No active work session
              </h2>
              <p className="text-xs text-slate-500 max-w-[250px] leading-relaxed">
                Please confirm your work assignment before recording a Walk-In
                transaction.
              </p>
            </div>
            <button
              onClick={onBack}
              className="mt-2 px-4 py-2 bg-[#0052CC] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#003da6] transition-colors"
            >
              Back to Home
            </button>
          </div>
        ) : flowStatus === 'connection_issue' ? (
          /* State: Connection Issue Before Commit */
          <div className="bg-white border border-amber-200/90 rounded-2xl p-6 text-center shadow-sm flex flex-col items-center justify-center my-4 space-y-3.5">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-slate-900">
                Unable to continue
              </h2>
              <p className="text-xs text-slate-500 max-w-[240px] leading-relaxed">
                Check your connection and try again.
              </p>
            </div>
            <button
              onClick={handleRetryConnection}
              disabled={isRetryingConnection}
              className="px-5 py-2.5 bg-[#0052CC] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#003da6] transition-colors flex items-center gap-1.5 disabled:opacity-60"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  isRetryingConnection ? 'animate-spin' : ''
                }`}
              />
              <span>{isRetryingConnection ? 'Retrying...' : 'Retry'}</span>
            </button>
          </div>
        ) : flowStatus === 'failed_recording' ? (
          /* State: Confirmation Failed Before Recording */
          <div className="bg-white border border-rose-200/90 rounded-2xl p-6 text-center shadow-sm flex flex-col items-center justify-center my-4 space-y-3.5">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-slate-900">
                Unable to record transaction
              </h2>
              <p className="text-xs text-slate-500 max-w-[240px] leading-relaxed">
                Check your connection and try again.
              </p>
            </div>
            <button
              onClick={handleAgentConfirmTransaction}
              disabled={isRecording}
              className="px-5 py-2.5 bg-[#0052CC] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#003da6] transition-colors flex items-center gap-1.5 disabled:opacity-60"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isRecording ? 'animate-spin' : ''}`}
              />
              <span>{isRecording ? 'Recording...' : 'Retry'}</span>
            </button>
          </div>
        ) : flowStatus === 'failed' ? (
          /* State: Failed External Transaction */
          <div className="bg-white border border-rose-200/90 rounded-2xl p-6 text-center shadow-sm flex flex-col items-center justify-center my-4 space-y-3.5">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center">
              <X className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-slate-900">
                Transaction not completed
              </h2>
              <p className="text-xs text-slate-500 max-w-[240px] leading-relaxed">
                The Vendor transaction was not completed.
              </p>
            </div>
            <div className="pt-1 flex gap-2 w-full max-w-[220px]">
              <button
                onClick={() => setFlowStatus('form')}
                className="flex-1 py-2.5 bg-[#0052CC] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#003da6] transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={onBack}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : flowStatus === 'status_not_confirmed' ? (
          /* State: Status Not Confirmed / Duplicate Protection */
          <div className="bg-white border border-amber-200/90 rounded-2xl p-6 text-center shadow-sm flex flex-col items-center justify-center my-4 space-y-3.5">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-slate-900">
                Transaction status not confirmed
              </h2>
              <p className="text-xs text-slate-500 max-w-[240px] leading-relaxed">
                Please check transaction status before repeating this action to
                prevent duplicate processing.
              </p>
            </div>
            <button
              onClick={handleCheckStatus}
              disabled={isCheckingStatus}
              className="px-5 py-2.5 bg-[#0052CC] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#003da6] transition-colors flex items-center gap-1.5 disabled:opacity-60"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  isCheckingStatus ? 'animate-spin' : ''
                }`}
              />
              <span>
                {isCheckingStatus ? 'Checking Status...' : 'Check Status'}
              </span>
            </button>
          </div>
        ) : flowStatus === 'performed' && performedSnapshot ? (
          /* State: Intermediate "Transaction performed" (Awaiting Agent Confirmation) */
          <div className="space-y-3.5 animate-fadeIn">
            {/* Performed Heading Header */}
            <div className="bg-white border border-blue-200/80 rounded-2xl p-4 shadow-2xs text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0052CC] border border-blue-200/60 mx-auto flex items-center justify-center">
                <Clock className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div className="space-y-0.5">
                <h2 className="text-base font-bold text-slate-900">
                  Transaction performed
                </h2>
                <p className="text-xs text-slate-500 max-w-[260px] mx-auto">
                  Confirm the transaction to record it in TellerBud.
                </p>
              </div>
            </div>

            {/* Performed Summary Card */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Walk-In Summary
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-md">
                  Awaiting Confirmation
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-500 font-medium">
                    Transaction Type
                  </span>
                  <span className="font-bold text-slate-900">
                    {performedSnapshot.transactionType}
                  </span>
                </div>

                {performedSnapshot.vendor && (
                  <>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-500 font-medium">Vendor Type</span>
                      <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {performedSnapshot.vendorType || getVendorType(performedSnapshot.vendor) || 'MNO'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-500 font-medium">Vendor</span>
                      <span className="font-bold text-slate-900 flex items-center gap-1">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor:
                              performedSnapshot.vendorAccentColor || '#0052CC',
                          }}
                        />
                        <span>{performedSnapshot.vendor}</span>
                      </span>
                    </div>
                  </>
                )}

                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-500 font-medium">Currency</span>
                  <span className="font-bold text-slate-800 font-mono text-xs">
                    {performedSnapshot.currencyCode} ({performedSnapshot.currencySymbol})
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-500 font-medium">Amount</span>
                  <span className="font-extrabold text-[#002244] font-mono text-sm">
                    {performedSnapshot.formattedAmount}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-500 font-medium">Phone Number</span>
                  <span className="font-semibold text-slate-900 font-mono text-xs">
                    {performedSnapshot.normalizedPhone}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-500 font-medium">Booth</span>
                  <span className="font-semibold text-slate-800 text-right">
                    {performedSnapshot.booth}
                  </span>
                </div>

                {performedSnapshot.vendorReference && (
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-50">
                    <span className="text-slate-500 font-medium">
                      Vendor Reference
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-700">
                      {performedSnapshot.vendorReference}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Primary Action CTA: Confirm Transaction */}
            <div className="pt-2">
              <button
                type="button"
                id="walkin-confirm-transaction-cta-btn"
                onClick={handleAgentConfirmTransaction}
                disabled={isRecording}
                className="w-full py-3 bg-[#0052CC] hover:bg-[#003da6] active:bg-[#002b7a] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-[0.99] disabled:opacity-60"
              >
                {isRecording ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Recording Transaction...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>Confirm Transaction</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : flowStatus === 'recorded' && recordedRecord ? (
          /* State: Transaction Recorded (Final Captured Success) */
          <div className="space-y-3.5 animate-fadeIn">
            {/* Success Heading Header */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200/60 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div className="space-y-0.5">
                <h2 className="text-base font-bold text-slate-900">
                  Transaction recorded
                </h2>
                <p className="text-xs text-slate-500">
                  The Walk-In transaction has been captured successfully.
                </p>
              </div>

              {recordedRecord.vendorConfirmationCaptured && (
                <div className="pt-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200/60">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Vendor confirmation captured</span>
                  </span>
                </div>
              )}
            </div>

            {/* Recorded Summary Card */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Walk-In Transaction
                </h3>
                <span className="text-[11px] font-bold font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  {recordedRecord.transactionReference}
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-500 font-medium">
                    Transaction Type
                  </span>
                  <span className="font-bold text-slate-900">
                    {recordedRecord.transactionType}
                  </span>
                </div>

                {recordedRecord.vendor && (
                  <>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-500 font-medium">Vendor Type</span>
                      <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {recordedRecord.vendorType || getVendorType(recordedRecord.vendor) || 'MNO'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-500 font-medium">Vendor</span>
                      <span className="font-bold text-slate-900 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#0052CC]" />
                        <span>{recordedRecord.vendor}</span>
                      </span>
                    </div>
                  </>
                )}

                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-500 font-medium">Amount</span>
                  <span className="font-extrabold text-slate-900 font-mono text-sm">
                    {recordedRecord.amount}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-500 font-medium">Phone Number</span>
                  <span className="font-semibold text-slate-900 font-mono text-xs">
                    {recordedRecord.normalizedPhoneNumber || recordedRecord.phoneNumber}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-500 font-medium">Booth</span>
                  <span className="font-semibold text-slate-800 text-right">
                    {recordedRecord.booth}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-500 font-medium">
                    Recorded Date / Time
                  </span>
                  <span className="font-semibold text-slate-800">
                    {recordedRecord.recordedAt}
                  </span>
                </div>

                {recordedRecord.vendorReference && (
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-50">
                    <span className="text-slate-500 font-medium">
                      Vendor Reference
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-700">
                      {recordedRecord.vendorReference}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Sticky Back To Home CTA */}
            <div className="pt-2">
              <button
                type="button"
                id="walkin-back-to-home-btn"
                onClick={onBack}
                className="w-full py-3 bg-[#0052CC] hover:bg-[#003da6] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-[0.99]"
              >
                <span>Back to Home</span>
              </button>
            </div>
          </div>
        ) : (
          /* State: Default / Form Input State */
          <div className="space-y-3.5">
            {/* Current Booth Context Card (Read-only) */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-2xs space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <Store className="w-3.5 h-3.5 text-[#0052CC]" />
                <span>Current Booth</span>
              </div>

              <div className="grid grid-cols-1 gap-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Booth</span>
                  <span className="font-bold text-slate-900">
                    {currentAssignment.booth}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Store</span>
                  <span className="font-medium text-slate-700">
                    {currentAssignment.store}
                  </span>
                </div>
              </div>
            </div>

            {/* Transaction Form Inputs */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3.5">
              {/* 1. Transaction Type Field */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>
                    Transaction Type <span className="text-rose-500 font-semibold">*</span>
                  </span>
                  {errors.type && (
                    <span className="text-[11px] text-rose-500 font-normal">
                      {errors.type}
                    </span>
                  )}
                </label>
                <button
                  type="button"
                  id="walkin-type-selector-btn"
                  onClick={() => setShowTypeSheet(true)}
                  className={`w-full py-2.5 px-3 rounded-xl border text-left flex items-center justify-between text-xs transition-colors ${
                    errors.type
                      ? 'border-rose-300 bg-rose-50/40 text-slate-900'
                      : selectedTypeId
                      ? 'border-slate-300 bg-white text-slate-900 font-semibold'
                      : 'border-slate-200 bg-slate-50/60 text-slate-400'
                  }`}
                >
                  <span className="truncate">
                    {activeTypeConfig
                      ? activeTypeConfig.label
                      : 'Select transaction type'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                </button>
              </div>

              {/* 2. Conditional Vendor Type & Vendor Fields (Only displayed if type requires vendor) */}
              {activeTypeConfig?.requiresVendor && (
                <div className="space-y-3 animate-fadeIn">
                  {/* Vendor Type */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>
                        Vendor Type <span className="text-rose-500 font-semibold">*</span>
                      </span>
                      {errors.vendorType && (
                        <span className="text-[11px] text-rose-500 font-normal">
                          {errors.vendorType}
                        </span>
                      )}
                    </label>
                    <button
                      type="button"
                      id="walkin-vendor-type-selector-btn"
                      onClick={() => setShowVendorTypeSheet(true)}
                      className={`w-full py-2.5 px-3 rounded-xl border text-left flex items-center justify-between text-xs transition-colors ${
                        errors.vendorType
                          ? 'border-rose-300 bg-rose-50/40 text-slate-900'
                          : selectedVendorType
                          ? 'border-slate-300 bg-white text-slate-900 font-semibold'
                          : 'border-slate-200 bg-slate-50/60 text-slate-400'
                      }`}
                    >
                      <span className="truncate">
                        {selectedVendorType
                          ? selectedVendorType
                          : 'Select vendor type'}
                      </span>
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                    </button>
                  </div>

                  {/* Vendor Selector */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>
                        Vendor <span className="text-rose-500 font-semibold">*</span>
                      </span>
                      {errors.vendor && (
                        <span className="text-[11px] text-rose-500 font-normal">
                          {errors.vendor}
                        </span>
                      )}
                    </label>
                    <button
                      type="button"
                      id="walkin-vendor-selector-btn"
                      disabled={!selectedVendorType}
                      onClick={() => {
                        if (selectedVendorType) {
                          setShowVendorSheet(true);
                        }
                      }}
                      className={`w-full py-2.5 px-3 rounded-xl border text-left flex items-center justify-between text-xs transition-colors ${
                        !selectedVendorType
                          ? 'border-slate-200 bg-slate-100/70 text-slate-400 cursor-not-allowed'
                          : errors.vendor
                          ? 'border-rose-300 bg-rose-50/40 text-slate-900'
                          : selectedVendorId
                          ? 'border-slate-300 bg-white text-slate-900 font-semibold'
                          : 'border-slate-200 bg-slate-50/60 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {activeVendorConfig && (
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{
                              backgroundColor:
                                activeVendorConfig.accentColor || '#0052CC',
                            }}
                          />
                        )}
                        <span className="truncate">
                          {activeVendorConfig
                            ? activeVendorConfig.name
                            : !selectedVendorType
                            ? 'Select vendor type first'
                            : 'Select Vendor'}
                        </span>
                      </div>
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                    </button>
                  </div>
                </div>
              )}

              {/* 3. Fixed Currency + Amount Component */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>
                    Amount <span className="text-rose-500 font-semibold">*</span>
                  </span>
                  {errors.amount && (
                    <span className="text-[11px] text-rose-500 font-normal">
                      {errors.amount}
                    </span>
                  )}
                </label>
                <div className="flex items-center gap-1.5">
                  {/* Fixed Zambia Kwacha (ZMW) Currency Prefix */}
                  <div
                    id="walkin-fixed-currency-badge"
                    className="h-[42px] px-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0 text-slate-800 select-none"
                  >
                    <span className="text-xs font-bold font-mono text-slate-900">
                      ZMW
                    </span>
                  </div>

                  {/* Amount Numeric Input */}
                  <div className="relative flex-1">
                    <input
                      type="text"
                      id="walkin-amount-input"
                      inputMode="decimal"
                      value={amountRaw}
                      onChange={handleAmountChange}
                      placeholder="0.00"
                      className={`w-full h-[42px] py-2 px-3 rounded-xl border text-xs font-mono font-bold transition-colors ${
                        errors.amount
                          ? 'border-rose-300 bg-rose-50/40 text-slate-900 focus:ring-rose-500'
                          : 'border-slate-200 bg-white text-slate-900 focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC]'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* 4. Mandatory Phone Number Field with Fixed +260 Zambia Country Code */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>
                    Phone Number <span className="text-rose-500 font-semibold">*</span>
                  </span>
                  {errors.phone && (
                    <span className="text-[11px] text-rose-500 font-normal">
                      {errors.phone}
                    </span>
                  )}
                </label>
                <div className="flex items-center gap-1.5">
                  {/* Fixed Zambia (+260) Calling Code Prefix */}
                  <div
                    id="walkin-fixed-country-badge"
                    className="h-[42px] px-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0 text-slate-800 select-none"
                  >
                    <span className="text-xs font-bold font-mono text-slate-900">
                      +260
                    </span>
                  </div>

                  {/* Subscriber Number Input Field */}
                  <div className="relative flex-1">
                    <input
                      type="tel"
                      id="walkin-phone-input"
                      inputMode="tel"
                      autoComplete="tel"
                      value={customerPhone}
                      onChange={handlePhoneChange}
                      onBlur={handlePhoneBlur}
                      placeholder={countryConfig.phonePlaceholder}
                      className={`w-full h-[42px] py-2 px-3 rounded-xl border text-xs font-mono font-medium transition-colors ${
                        errors.phone
                          ? 'border-rose-300 bg-rose-50/40 text-slate-900 focus:ring-rose-500'
                          : 'border-slate-200 bg-white text-slate-900 focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC]'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Compact Summary Note if fields are filled */}
            {selectedTypeId && amountRaw && parseFloat(amountRaw) > 0 && customerPhone && (
              <div className="bg-sky-50/70 border border-sky-200/70 rounded-xl p-3 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-800">
                    {activeTypeConfig?.label}{' '}
                    {activeVendorConfig ? `• ${activeVendorConfig.name}` : ''}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Customer: {countryConfig.normalizePhone(customerPhone)}
                  </div>
                </div>
                <div className="font-mono font-bold text-sm text-[#002244]">
                  {formatCurrency(amountRaw)}
                </div>
              </div>
            )}

            {/* Primary Action CTA */}
            <div className="pt-1">
              <button
                type="button"
                id="walkin-perform-transaction-btn"
                onClick={handlePerformTransactionClick}
                className="w-full py-3 bg-[#0052CC] hover:bg-[#003da6] active:bg-[#002b7a] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-[0.99]"
              >
                <span>Perform Transaction</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM SHEET 1: Transaction Type Selector */}
      {showTypeSheet && (
        <div className="absolute inset-0 z-40 bg-slate-900/40 backdrop-blur-2xs flex flex-col justify-end animate-fadeIn">
          <div className="bg-white rounded-t-3xl border-t border-slate-200 p-4 pb-6 space-y-3 max-h-[80%] flex flex-col animate-slideUp">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Select Transaction Type
              </h3>
              <button
                onClick={() => setShowTypeSheet(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 overflow-y-auto">
              {CONFIGURED_TRANSACTION_TYPES.map((typeOption) => {
                const isSelected = selectedTypeId === typeOption.id;
                return (
                  <button
                    key={typeOption.id}
                    type="button"
                    onClick={() => {
                      setSelectedTypeId(typeOption.id);
                      if (errors.type) {
                        setErrors((prev) => ({ ...prev, type: undefined }));
                      }
                      setShowTypeSheet(false);
                    }}
                    className={`w-full h-12 px-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-sky-50/80 border-[#0052CC] text-[#0052CC]'
                        : 'bg-white border-slate-200/80 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <span className="text-xs font-bold">{typeOption.label}</span>
                    {isSelected && (
                      <Check className="w-4 h-4 text-[#0052CC] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM SHEET 2: Vendor Type Selector */}
      {showVendorTypeSheet && (
        <div className="absolute inset-0 z-40 bg-slate-900/40 backdrop-blur-2xs flex flex-col justify-end animate-fadeIn">
          <div className="bg-white rounded-t-3xl border-t border-slate-200 p-4 pb-6 space-y-3 max-h-[80%] flex flex-col animate-slideUp">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Select Vendor Type</h3>
                <p className="text-[11px] text-slate-500">Choose MNO or Bank</p>
              </div>
              <button
                onClick={() => setShowVendorTypeSheet(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {CONFIGURED_VENDOR_TYPES.map((vType) => {
                const isSelected = selectedVendorType === vType.id;
                return (
                  <button
                    key={vType.id}
                    onClick={() => {
                      handleVendorTypeChange(vType.id);
                      setShowVendorTypeSheet(false);
                    }}
                    className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-sky-50/80 border-[#0052CC] text-[#0052CC]'
                        : 'bg-white border-slate-200/80 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">{vType.id}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {vType.description}
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-[#0052CC] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM SHEET 3: Vendor Selector (Filtered by Vendor Type) */}
      {showVendorSheet && (
        <div className="absolute inset-0 z-40 bg-slate-900/40 backdrop-blur-2xs flex flex-col justify-end animate-fadeIn">
          <div className="bg-white rounded-t-3xl border-t border-slate-200 p-4 pb-6 space-y-3 max-h-[85%] flex flex-col animate-slideUp">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Select {selectedVendorType ? `${selectedVendorType} ` : ''}Vendor
                </h3>
                {selectedVendorType && (
                  <p className="text-[11px] text-slate-500">
                    Showing {selectedVendorType === 'MNO' ? 'Mobile Network Operators' : 'Banking Institutions'}
                  </p>
                )}
              </div>
              <button
                onClick={() => setShowVendorSheet(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 overflow-y-auto max-h-[300px] pr-0.5 pb-2">
              {availableVendors.map((vendorOption) => {
                const isSelected = selectedVendorId === vendorOption.id;
                return (
                  <button
                    key={vendorOption.id}
                    onClick={() => {
                      setSelectedVendorId(vendorOption.id);
                      if (errors.vendor) {
                        setErrors((prev) => ({ ...prev, vendor: undefined }));
                      }
                      setShowVendorSheet(false);
                    }}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-sky-50/80 border-[#0052CC] text-[#0052CC]'
                        : 'bg-white border-slate-200/80 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{
                          backgroundColor:
                            vendorOption.accentColor || '#0052CC',
                        }}
                      />
                      <span className="text-xs font-bold text-slate-900 whitespace-nowrap">
                        {vendorOption.name}
                      </span>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-[#0052CC] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM SHEET 4: Confirmation Sheet */}
      {showConfirmSheet && (
        <div className="absolute inset-0 z-40 bg-slate-900/40 backdrop-blur-2xs flex flex-col justify-end animate-fadeIn">
          <div className="bg-white rounded-t-3xl border-t border-slate-200 p-4 pb-6 space-y-3.5 animate-slideUp">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {(activeTypeConfig?.id === 'deposit' || activeTypeConfig?.id === 'cash_in')
                  ? 'Proceed with this deposit?'
                  : (activeTypeConfig?.id === 'withdrawal' || activeTypeConfig?.id === 'cash_out')
                  ? 'Proceed with this withdrawal?'
                  : activeTypeConfig?.id === 'purchase'
                  ? 'Proceed with this purchase?'
                  : 'Proceed with this transaction?'}
              </h3>
              <button
                onClick={() => setShowConfirmSheet(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              {(activeTypeConfig?.id === 'deposit' || activeTypeConfig?.id === 'cash_in')
                ? 'Confirm the Walk-In transaction details before proceeding with the Vendor transaction.'
                : (activeTypeConfig?.id === 'withdrawal' || activeTypeConfig?.id === 'cash_out')
                ? 'Confirm the Walk-In transaction details before completing the cash-out transaction.'
                : activeTypeConfig?.id === 'purchase'
                ? 'Confirm the Walk-In transaction details before completing the purchase transaction.'
                : 'Confirm the transaction details before proceeding.'}
            </p>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">
                  Transaction Type
                </span>
                <span className="font-bold text-slate-900">
                  {activeTypeConfig?.label}
                </span>
              </div>

              {activeVendorConfig && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Vendor Type</span>
                    <span className="font-bold text-slate-800 bg-slate-200/80 px-2 py-0.5 rounded text-[11px]">
                      {selectedVendorType || activeVendorConfig.type || getVendorType(activeVendorConfig.name) || 'MNO'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Vendor</span>
                    <span className="font-bold text-slate-900">
                      {activeVendorConfig.name}
                    </span>
                  </div>
                </>
              )}

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Currency</span>
                <span className="font-bold text-slate-800 font-mono">
                  ZMW
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Amount</span>
                <span className="font-extrabold text-[#002244] font-mono text-sm">
                  {formatCurrency(amountRaw)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Phone Number</span>
                <span className="font-bold text-slate-900 font-mono">
                  {countryConfig.normalizePhone(customerPhone)}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                <span className="text-slate-500 font-medium">Booth</span>
                <span className="font-semibold text-slate-700 text-right">
                  {currentAssignment?.booth}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowConfirmSheet(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                id="walkin-confirm-proceed-btn"
                onClick={handleConfirmAndProceed}
                className="flex-1 py-2.5 bg-[#0052CC] hover:bg-[#003da6] text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                Perform Transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
