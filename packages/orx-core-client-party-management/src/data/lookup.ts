export const SUPPRESSION_TYPE_OPTIONS = [
  {value: 'SUPPRESS_REJECTED_CLAIMS', label: 'Suppress Rejected Claims'},
  {value: 'SUPPRESS_ZERO_NET_CLAIMS', label: 'Suppress Claims that Net to Zero'}
];

export const ASSIGNED_TO_OPTIONS = [
  {value: 'user1', label: 'User 1'},
  {value: 'user2', label: 'User 2'},
  {value: 'user3', label: 'User 3'}
];

export const RUN_OFF_EFFECTIVE_DATE_OPTIONS = [
  {value: '15', label: '15'},
  {value: '30', label: '30'},
  {value: '45', label: '45'},
  {value: '60', label: '60'},
  {value: '75', label: '75'},
  {value: '90', label: '90'},
  {value: '120', label: '120'},
  {value: '150', label: '150'},
  {value: '180', label: '180'}
];

export const INVOICE_BREAKOUT_OPTIONS = [
  {value: 'CONT', label: 'Contract'},
  {value: 'FLEX', label: 'Flexible'},
  {value: 'OU', label: 'Operational Unit'}
];

export const INVOICE_FREQUENCY_CLAIM_OPTIONS = [
  {value: '2XM1', label: '1st and 16th twice a month'},
  {value: 'MON', label: 'Weekly Monday'},
  {value: 'THU', label: 'Weekly Thursday'},
  {value: '4XM8', label: '8th 16th 24th End of Month'}
];

export const INVOICE_FREQUENCY_FEE_OPTIONS = [
  {value: '2XM1', label: '1st and 16th twice a month'},
  {value: 'MON', label: 'Weekly Monday'},
  {value: 'THU', label: 'Weekly Thursday'},
  {value: '4XM8', label: '8th 16th 24th End of Month'}
];

export const INVOICE_AGGREGATION_OPTIONS = [
  {value: 'CR', label: 'Carrier'},
  {value: 'AC', label: 'Account'},
  {value: 'GR', label: 'Group'},
  {value: 'NO', label: 'None'}
];

export const INVOICE_TYPE_OPTIONS = [
  {value: 'C', label: 'Combined'},
  {value: 'I', label: 'Individual'}
];

export const DELIVERY_OPTIONS = [
  {value: 'BC', label: 'Benefit Central'},
  {value: 'FTP', label: 'FTP'}
];

export const SUPPORT_DOC_VERSION_OPTIONS = [
  {value: 'MEDD', label: 'Medical Data (MEDD)'},
  {value: 'NPHI', label: 'Non-PHI (NPHI)'},
  {value: 'PHI', label: 'PHI'}
];

export const PAYMENT_METHOD_OPTIONS = [
  {value: 'ACH', label: 'ACH'},
  {value: 'CHK', label: 'Check'},
  {value: 'WIRE', label: 'Wire Transfer'}
];

export const BANK_ACCOUNT_TYPE_OPTIONS = [
  {value: 'checking', label: 'Checking'},
  {value: 'savings', label: 'Savings'}
];

export const CLAIM_QUANTITY_OPTIONS = [
  {value: 'scripts', label: 'Scripts'},
  {value: 'claims', label: 'Claims'},
  {value: 'both', label: 'Both'}
];

export const DAY_TYPE_OPTIONS = [
  {value: 'calendar', label: 'Calendar Days'},
  {value: 'business', label: 'Business Days'}
];

export const MARKET_SEGMENT_OPTIONS = [
  {value: 'Commercial', label: 'Commercial'},
  {value: 'Medicare', label: 'Medicare'},
  {value: 'Medicaid', label: 'Medicaid'},
  {value: 'Exchange', label: 'Exchange'}
];

export const LINE_OF_BUSINESS_OPTIONS = [
  {value: 'Commercial', label: 'Commercial'},
  {value: 'Medicaid', label: 'Medicaid'},
  {value: 'Medicare', label: 'Medicare'},
  {value: 'Exchange', label: 'Exchange'}
];

export const MR_PLAN_TYPE_OPTIONS = [
  {value: 'HMO', label: 'Health Maintenance Organization'},
  {value: 'PPO', label: 'Preferred Provider Organization'},
  {value: 'PDP', label: 'Prescription Drug Plan'},
  {value: 'MAPD', label: 'Medicare Advantage Prescription Drug'}
];

export const MR_GROUP_INDIVIDUAL_OPTIONS = [
  {value: 'G', label: 'Group'},
  {value: 'I', label: 'Individual'}
];

export const MR_CLASSIFICATION_OPTIONS = [
  {value: 'DUAL', label: 'Duals'},
  {value: 'MMP', label: 'MMP'},
  {value: 'NONDUAL', label: 'Non Duals'}
];

export const PRICING_OPTIONS = [
  {value: 'PASS', label: 'Pass Through'},
  {value: 'TRAD', label: 'Traditional'}
];

export const CONTACT_OPTIONS = [
  {value: 'alice_johnson', label: 'Alice Johnson'},
  {value: 'james_williams', label: 'James Williams'},
  {value: 'sarah_davis', label: 'Sarah Davis'},
  {value: 'michael_brown', label: 'Michael Brown'},
  {value: 'emily_wilson', label: 'Emily Wilson'}
];

export const ADDRESS_TYPE_OPTIONS = [
  {value: 'BILLING', label: 'Billing'},
  {value: 'MAILING', label: 'Mailing'},
  {value: 'PHYSICAL', label: 'Physical'}
];

export const INV_CLAIM_QTY_CNT_OPTIONS = [
  {value: 'NET', label: 'Net'},
  {value: 'GRS', label: 'Gross'}
];

export const FEE_INVOICE_PAYMENT_TERM_OPTIONS = [
  {value: '15', label: '15'},
  {value: '30', label: '30'},
  {value: '45', label: '45'},
  {value: '60', label: '60'},
  {value: '90', label: '90'}
];

export const FEE_INVOICE_PAYMENT_TERM_DAYTYPE_OPTIONS = [
  {value: 'C', label: 'Calendar Days'},
  {value: 'B', label: 'Business Days'}
];

export const CLAIM_INVOICE_PAYMENT_TERM_OPTIONS = [
  {value: '15', label: '15'},
  {value: '30', label: '30'},
  {value: '45', label: '45'},
  {value: '60', label: '60'},
  {value: '90', label: '90'}
];

export const CLAIM_INVOICE_PAYMENT_TERM_DAYTYPE_OPTIONS = [
  {value: 'C', label: 'Calendar Days'},
  {value: 'B', label: 'Business Days'}
];

// Contact Type dropdown options per design document
export const CONTACT_TYPE_OPTIONS = [
  {value: 'AP', label: 'Accounts Payable Contact'},
  {value: 'BILL', label: 'Billing Contact'},
  {value: 'PORTAL', label: 'Client Portal Access Contact'}
];

// Status dropdown options
export const STATUS_OPTIONS = [
  {value: 'ACTIVE', label: 'Active'},
  {value: 'INACTIVE', label: 'Inactive'}
];

// Mock contact options for Assign Contacts dropdown (Task 3.3)
// These serve as fallback when no contacts are defined in ContactsAccessStep
export const MOCK_CONTACT_OPTIONS = [
  {value: 'alice_johnson', label: 'Alice Johnson'},
  {value: 'james_williams', label: 'James Williams'},
  {value: 'sarah_davis', label: 'Sarah Davis'},
  {value: 'michael_brown', label: 'Michael Brown'},
  {value: 'emily_wilson', label: 'Emily Wilson'}
];
