import type {
  AddressData,
  Contact,
  ContactsAccessFormData,
  OperationalUnitAddressData,
  OperationalUnitData,
  AddClientFormData,
  ClientDetailsStepFormData,
  ContractDetailsStepFormData,
  OperationalUnitSuppressionEntryData,
  SuppressionEntryData
} from './add-client-schema';
import type {AddClientCombinedFormData} from './combined-schema';

// Default values
export const defaultAddressData: AddressData = {
  addressType: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  zip: ''
};

export const defaultContactData: Contact = {
  contactType: '',
  firstName: '',
  lastName: '',
  email: '',
  status: '',
  sendEmailNotification: false
};

// Default values for Suppression Entry (Step 2)
// Requirements: 5.4-5.6
export const defaultSuppressionEntryData: SuppressionEntryData = {
  suppressionType: '',
  suppressionStartDate: '',
  suppressionEndDate: ''
};

// Default values for Contacts & Access Step
export const defaultContactsAccessData: ContactsAccessFormData = {
  contacts: [defaultContactData]
};

// Default values for Operational Unit Address (Step 4)
// Requirements: 5.1
export const defaultOperationalUnitAddressData: OperationalUnitAddressData = {
  addressType: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  zip: ''
};

// Default values for Operational Unit Suppression Entry (Step 4)
// Requirements: 6.3-6.5
export const defaultOperationalUnitSuppressionEntryData: OperationalUnitSuppressionEntryData = {
  suppressionType: '',
  serviceStartDate: '',
  serviceEndDate: ''
};

// Default values for Operational Unit (Step 4)
// Requirements: 7.1
export const defaultOperationalUnitData: OperationalUnitData = {
  name: '',
  id: '',
  lobNumeric: '',
  lineOfBusiness: '',
  marketSegment: '',
  mrPlanType: '',
  mrGroupIndividual: '',
  mrClassification: '',
  passThroughTraditional: '',
  assignedContacts: [],
  addresses: [defaultOperationalUnitAddressData],
  billingAttributesOverride: undefined
  // addSuppressions: "no",
  // suppressions: []
};

export const defaultFormData: AddClientFormData = {
  clientReferenceId: '',
  clientId: '',
  clientName: '',

  addresses: [defaultAddressData],
  billingFrequency: '',
  paymentTerms: '',
  currency: '',
  enableAutopay: 'no',
  bankAccountNumber: '',
  routingNumber: '',
  contacts: [defaultContactData],
  operationalUnits: [defaultOperationalUnitData]
};

// Default values for Client Details Step
export const defaultClientDetailsStepData: ClientDetailsStepFormData = {
  clientReferenceId: '',
  clientId: '',
  clientName: '',

  addresses: [
    {
      addressType: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zip: ''
    }
  ]
};

// Default values for Contract Details Step
export const defaultContractDetailsStepData: ContractDetailsStepFormData = {
  // Contract Information
  clientContractId: '',
  effectiveDate: '',
  terminationDate: '',
  contractTerm: '',
  clientMembership: '',
  clientDoaSignor: '',
  contractingLegalEntityOptumRx: '',
  contractingLegalEntityClient: '',
  assignedTo: '',
  runOffEffectiveDate: '',

  // Billing Attributes
  invoiceBreakout: '',
  claimInvoiceFrequency: '',
  feeInvoiceFrequency: '',
  invoiceAggregationLevel: '',
  invoiceType: '',
  invoicingClaimQuantityCounts: '',
  deliveryOption: '',
  supportDocumentVersion: '',
  claimInvoicePaymentTerm: '',
  feeInvoicePaymentTerm: '',
  paymentMethod: '',

  // Autopay Information
  bankAccountType: '',
  routingNumber: '',
  accountNumber: '',

  addSuppressions: false,
  suppressions: []
};

// Default values for Combined Add Client Form
export const defaultAddClientCombinedData: AddClientCombinedFormData = {
  // Step 1: Client Details
  clientDetails: {
    clientReferenceId: '',
    clientId: '',
    clientName: '',
    clientStatus: '',

    addresses: [
      {
        addressType: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zip: ''
      }
    ],

    runOffDaysMemberClaims: '',
    runOffDaysPharmacy: '',
    source: 'Manual',
    productOverrides: [],
    runOffDaysByClaimType: []
  },

  // Step 2: Contract Details
  contractDetails: {
    // Contract Information
    clientContractId: '',
    effectiveDate: '',
    terminationDate: '',
    contractTerm: '',
    clientMembership: '',
    clientDoaSignor: '',
    contractingLegalEntityOptumRx: '',
    contractingLegalEntityClient: '',
    assignedTo: '',
    runOffEffectiveDate: '',

    // Billing Attributes (nested)
    billingAttributes: {
      invoiceBreakout: '',
      claimInvoiceFrequency: '',
      feeInvoiceFrequency: '',
      invoiceAggregationLevel: '',
      invoiceType: '',
      invoicingClaimQuantityCounts: '',
      deliveryOption: '',
      supportDocumentVersion: '',
      invoiceStaticData: '',
      feeInvoicePaymentTerm: '',
      feeInvoicePaymentTermDayType: '',
      claimInvoicePaymentTerm: '',
      claimInvoicePaymentTermDayType: '',
      paymentMethod: '',

      // Autopay Information
      bankAccountType: '',
      routingNumber: '',
      accountNumber: '',

      // Suppressions
      addSuppressions: false,
      suppressions: []
    }
  },

  // Step 3: Contacts & Access
  contacts: [
    {
      contactType: '',
      firstName: '',
      lastName: '',
      email: '',
      status: '',
      sendEmailNotification: false
    }
  ],

  // Step 4: Operational Units
  operationalUnits: [defaultOperationalUnitData]
};
