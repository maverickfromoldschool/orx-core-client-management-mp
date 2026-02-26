export interface Address {
  addressType: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
}

export interface Contact {
  contactId: string;
  contactType: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  sendEmailNotification: boolean;
}

export interface Suppression {
  suppressionType: string;
  suppressionStartDate: string;
  suppressionEndDate: string;
}

export interface BillingAttributes {
  // invoiceBreakout: string | null;
  claimInvoiceFrequency: string;
  feeInvoiceFrequency: string;
  invoiceAggregationLevel: string;
  invoiceType: string;
  invoicingClaimQuantityCounts: string;
  deliveryOption: string;
  supportDocumentVersion: string;
  claimInvoicePaymentTerm: string;
  feeInvoicePaymentTerm: string;
  // feeInvoicePaymentTermDayType: string;
  // claimInvoicePaymentTermDayType: string;
  paymentMethod: string;
  bankAccountType: string | null;
  accountHolderName: string;
  maskedRoutingNumber: string;
  maskedAccountNumber: string;
  addSuppression: boolean;
  suppressions: Suppression[];
  // invoiceStaticData: string | null;
}

export interface OperationalUnit {
  id: string;
  operationalUnitName: string;
  operationalUnitId: string;
  marketSegment: string;
  lineOfBusiness: string;
  mrPlanType: string;
  mrGroupIndividual: string;
  mrClassification: string;
  passThroughPricing: string;
  runOffPeriod: string;
  assignedContactIds: string[];
  lobNumeric: string;
  // billingAddress: Address[];
  billingAddress: Address | null;
  billingAttributesOverride: BillingAttributes;
}

export interface Client {
  draftId?: string | null;
  clientId?: string | null;
  clientDetails: {
    clientId: string;
    clientReferenceId: string;
    clientName: string;
    addresses: Address[];
  };
  contactsAndAccesses: {
    contacts: Contact[];
  };
  contractDetails: {
    contractId: string;
    contractTerm: string;
    effectiveDate: string;
    terminationDate: string;
    runOffEffectiveDate: string | null;
    clientMembership: string;
    clientDOASignor: string;
    contractingLegalEntityOptumRx: string;
    contractingLegalEntityClient: string;
    assignedTo: string;
    source: string;
    billingAttributes: BillingAttributes;
  };
  operationalUnits: {
    operationalUnits: OperationalUnit[];
  };
  clientStatus: string;
  createdAt: string | null;
  modifiedAt: string | null;
}

export type ClientCreateType = Omit<Client, 'draftId' | 'clientId' | 'clientStatus' | 'createdAt' | 'modifiedAt'>;
export type ClientUpdateType = Omit<Client, 'clientStatus' | 'createdAt' | 'modifiedAt'>;
