import {
  type AddClientCombinedFormData,
  type BillingAttributesOverrideData,
  defaultClientDetailsAddressData,
  defaultContactData,
  defaultOperationalUnitData
} from '../stepper/schemas';
import {type AddressData} from '../stepper/schemas/address-schemas';

import type {
  Address as APIAddress,
  Client as APIClient,
  ClientCreateType as APIClientCreateType,
  BillingAttributes
} from './api-client-types';

const getDefaultUIFormSchema = (): AddClientCombinedFormData => {
  return {
    draftId: '',
    // Step 1: Client Details
    clientDetails: {
      clientReferenceId: '',
      clientId: '',
      clientName: '',
      addresses: [defaultClientDetailsAddressData]
    },

    contractDetails: {
      // Step 2: Contract Details - Contract Information
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

      // Step 2: Contract Details - Billing Attributes
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

        // Step 2: Contract Details - Autopay Information
        bankAccountType: '',
        routingNumber: '',
        accountNumber: '',

        // Step 2: Contract Details - Suppressions
        addSuppressions: false,
        suppressions: []
      }
    },

    // Step 3: Contacts & Access
    contacts: [defaultContactData],

    // Step 4: Operational Units
    operationalUnits: [defaultOperationalUnitData]
  };
};

const safeCopy = (s: string | null, defaultValue = ''): string => {
  return s !== null && s !== undefined ? s : defaultValue;
};

/**
 * Converts date from UI format (MM-DD-YYYY) to API format (YYYY-MM-DD)
 */
const convertUIDateToAPI = (uiDate: string | null | undefined): string => {
  if (!uiDate) return '';

  const parts = uiDate.split('-');
  if (parts.length !== 3) return uiDate;

  const [month, day, year] = parts;
  return `${year}-${month}-${day}`;
};

/**
 * Converts date from API format (YYYY-MM-DD) to UI format (MM-DD-YYYY)
 */
const convertAPIDateToUI = (apiDate: string | null): string => {
  if (!apiDate) return '';

  const parts = apiDate.split('-');
  if (parts.length !== 3) return apiDate;

  const [year, month, day] = parts;
  return `${month}-${day}-${year}`;
};

export const toAPIClientSchema = (data: AddClientCombinedFormData): APIClientCreateType => {
  const apiClient: APIClientCreateType = {
    // Client Details
    clientDetails: {
      clientReferenceId: data.clientDetails.clientReferenceId || '',
      clientId: data.clientDetails.clientId || '',
      clientName: data.clientDetails.clientName || '',

      addresses:
        data.clientDetails.addresses?.map((addr) => ({
          addressType: addr.addressType || '',
          address1: addr.address1 || '',
          address2: addr.address2 || '',
          city: addr.city || '',
          state: addr.state || '',
          zip: addr.zip || ''
        })) || []
    },

    // Contract Details
    contractDetails: {
      contractId: data.contractDetails.clientContractId || '',
      contractTerm: data.contractDetails.contractTerm || '',
      effectiveDate: convertUIDateToAPI(data.contractDetails.effectiveDate),
      terminationDate: convertUIDateToAPI(data.contractDetails.terminationDate),
      clientMembership: data.contractDetails.clientMembership || '',
      clientDOASignor: data.contractDetails.clientDoaSignor || '',
      contractingLegalEntityOptumRx: data.contractDetails.contractingLegalEntityOptumRx || '',
      contractingLegalEntityClient: data.contractDetails.contractingLegalEntityClient || '',
      assignedTo: data.contractDetails.assignedTo || '',
      // runOffEffectiveDate: data.contractDetails.runOffEffectiveDate || '',
      runOffEffectiveDate: convertUIDateToAPI(data.contractDetails.runOffEffectiveDate),
      source: '',

      billingAttributes: {
        // invoiceBreakout: data.contractDetails.billingAttributes.invoiceBreakout || null,
        claimInvoiceFrequency: data.contractDetails.billingAttributes.claimInvoiceFrequency || '',
        feeInvoiceFrequency: data.contractDetails.billingAttributes.feeInvoiceFrequency || '',
        invoiceAggregationLevel: data.contractDetails.billingAttributes.invoiceAggregationLevel || '',
        invoiceType: data.contractDetails.billingAttributes.invoiceType || '',
        invoicingClaimQuantityCounts: data.contractDetails.billingAttributes.invoicingClaimQuantityCounts || '',
        deliveryOption: data.contractDetails.billingAttributes.deliveryOption || '',
        supportDocumentVersion: data.contractDetails.billingAttributes.supportDocumentVersion || '',
        // invoiceStaticData: data.contractDetails.billingAttributes.invoiceStaticData || null,
        feeInvoicePaymentTerm: data.contractDetails.billingAttributes.feeInvoicePaymentTerm || '',
        // feeInvoicePaymentTermDayType: data.contractDetails.billingAttributes.feeInvoicePaymentTermDayType || '',
        claimInvoicePaymentTerm: data.contractDetails.billingAttributes.claimInvoicePaymentTerm || '',
        // claimInvoicePaymentTermDayType: data.contractDetails.billingAttributes.claimInvoicePaymentTermDayType || '',
        paymentMethod: data.contractDetails.billingAttributes.paymentMethod || '',
        bankAccountType: data.contractDetails.billingAttributes.bankAccountType || null,
        accountHolderName: '',
        maskedRoutingNumber: data.contractDetails.billingAttributes.routingNumber || '',
        maskedAccountNumber: data.contractDetails.billingAttributes.accountNumber || '',
        addSuppression: data.contractDetails.billingAttributes.addSuppressions || false,
        suppressions:
          data.contractDetails.billingAttributes.suppressions?.map((suppression) => ({
            suppressionType: suppression.suppressionType || '',
            suppressionStartDate: convertUIDateToAPI(suppression.suppressionStartDate),
            suppressionEndDate: convertUIDateToAPI(suppression.suppressionEndDate)
          })) || []
      }
    },

    // Contacts & Access
    contactsAndAccesses: {
      contacts:
        data.contacts?.map((contact) => ({
          contactId: '',
          contactType: contact.contactType || '',
          firstName: contact.firstName || '',
          lastName: contact.lastName || '',
          email: contact.email || '',
          status: contact.status || '',
          sendEmailNotification: contact.sendEmailNotification
        })) || []
    },

    // Operational Units
    operationalUnits: {
      operationalUnits:
        data.operationalUnits?.map((ou) => {
          /*
          const billingAddress =
            ou.addresses?.map((addr) => ({
              addressType: addr.addressType || '',
              address1: addr.address1 || '',
              address2: addr.address2 || '',
              city: addr.city || '',
              state: addr.state || '',
              zip: addr.zip || ''
            })) || [];
          */
          const billingAddress: APIAddress | null =
            ou.addresses && ou.addresses.length > 0 && ou.addresses[0]
              ? {
                  addressType: ou.addresses[0].addressType || '',
                  address1: ou.addresses[0].address1 || '',
                  address2: ou.addresses[0].address2 || '',
                  city: ou.addresses[0].city || '',
                  state: ou.addresses[0].state || '',
                  zip: ou.addresses[0].zip || ''
                }
              : null;

          const billingAttributesOverride: BillingAttributes = ou.billingAttributesOverride
            ? {
                // invoiceBreakout: null,
                claimInvoiceFrequency: ou.billingAttributesOverride.claimInvoiceFrequency || '',
                feeInvoiceFrequency: ou.billingAttributesOverride.feeInvoiceFrequency || '',
                invoiceAggregationLevel: ou.billingAttributesOverride.invoiceAggregationLevel || '',
                invoiceType: ou.billingAttributesOverride.invoiceType || '',
                invoicingClaimQuantityCounts: ou.billingAttributesOverride.invoicingClaimQuantityCounts || '',
                deliveryOption: ou.billingAttributesOverride.deliveryOption || '',
                supportDocumentVersion: ou.billingAttributesOverride.supportDocumentVersion || '',
                // invoiceStaticData: ou.billingAttributesOverride.invoiceStaticData || null,
                feeInvoicePaymentTerm: ou.billingAttributesOverride.feeInvoicePaymentTerm || '',
                // feeInvoicePaymentTermDayType: ou.billingAttributesOverride.feeInvoicePaymentTermDayType || '',
                claimInvoicePaymentTerm: ou.billingAttributesOverride.claimInvoicePaymentTerm || '',
                // claimInvoicePaymentTermDayType: ou.billingAttributesOverride.claimInvoicePaymentTermDayType || '',
                paymentMethod: ou.billingAttributesOverride.paymentMethod || '',
                bankAccountType: ou.billingAttributesOverride.bankAccountType || null,
                accountHolderName: '',
                maskedRoutingNumber: ou.billingAttributesOverride.routingNumber || '',
                maskedAccountNumber: ou.billingAttributesOverride.accountNumber || '',
                addSuppression: ou.billingAttributesOverride.addSuppressions || false,
                suppressions:
                  ou.billingAttributesOverride.suppressions?.map((suppression) => ({
                    suppressionType: suppression.suppressionType || '',
                    suppressionStartDate: convertUIDateToAPI(suppression.serviceStartDate),
                    suppressionEndDate: convertUIDateToAPI(suppression.serviceEndDate)
                  })) || []
              }
            : {
                // invoiceBreakout: null,
                claimInvoiceFrequency: '',
                feeInvoiceFrequency: '',
                invoiceAggregationLevel: '',
                invoiceType: '',
                invoicingClaimQuantityCounts: '',
                deliveryOption: '',
                supportDocumentVersion: '',
                // invoiceStaticData: null,
                feeInvoicePaymentTerm: '',
                // feeInvoicePaymentTermDayType: '',
                claimInvoicePaymentTerm: '',
                // claimInvoicePaymentTermDayType: '',
                paymentMethod: '',
                bankAccountType: null,
                accountHolderName: '',
                maskedRoutingNumber: '',
                maskedAccountNumber: '',
                addSuppression: false,
                suppressions: []
              };

          return {
            id: '',
            operationalUnitName: ou.name || '',
            operationalUnitId: ou.id || '',
            lobNumeric: ou.lobNumeric || '',
            lineOfBusiness: ou.lineOfBusiness || '',
            marketSegment: ou.marketSegment || '',
            mrPlanType: ou.mrPlanType || '',
            mrGroupIndividual: ou.mrGroupIndividual || '',
            mrClassification: ou.mrClassification || '',
            passThroughPricing: ou.passThroughTraditional || '',
            runOffPeriod: '',
            assignedContactIds: ou.assignedContacts || [],
            billingAddress,
            billingAttributesOverride
          };
        }) || []
    }
  };

  return apiClient;
};

export const toAPIDraftSchema = (data: AddClientCombinedFormData, currentStep: number, draftId?: string): any => {
  // Get full API schema with all form data
  const fullSchema = toAPIClientSchema(data);

  const payload: any = {
    ...(draftId && {draftId}),
    clientDetails: currentStep >= 0 ? fullSchema.clientDetails : null,
    contractDetails: currentStep >= 1 ? fullSchema.contractDetails : null,
    contactsAndAccesses: currentStep >= 2 ? fullSchema.contactsAndAccesses : null,
    operationalUnits: currentStep >= 3 ? fullSchema.operationalUnits : null
  };

  return payload;
};

export const toUIFormSchema = (data: APIClient): AddClientCombinedFormData => {
  const defaultValues = getDefaultUIFormSchema();

  if (data.draftId) {
    defaultValues.draftId = data.draftId;
  }

  // Client Details
  defaultValues.clientDetails.clientReferenceId = safeCopy(data.clientDetails.clientReferenceId);
  defaultValues.clientDetails.clientId = safeCopy(data.clientDetails.clientId);
  defaultValues.clientDetails.clientName = safeCopy(data.clientDetails.clientName);

  if (data.clientDetails.addresses) {
    defaultValues.clientDetails.addresses = data.clientDetails.addresses.map(
      (addr) =>
        ({
          addressType: safeCopy(addr.addressType),
          address1: safeCopy(addr.address1),
          address2: safeCopy(addr.address2),
          city: safeCopy(addr.city),
          state: safeCopy(addr.state),
          zip: safeCopy(addr.zip)
        }) as AddressData
    );
  }

  // Contract Details
  if (data.contractDetails) {
    defaultValues.contractDetails.clientContractId = safeCopy(data.contractDetails.contractId);
    defaultValues.contractDetails.contractTerm = safeCopy(data.contractDetails.contractTerm);
    defaultValues.contractDetails.effectiveDate = convertAPIDateToUI(data.contractDetails.effectiveDate);
    defaultValues.contractDetails.terminationDate = convertAPIDateToUI(data.contractDetails.terminationDate);
    defaultValues.contractDetails.clientMembership = safeCopy(data.contractDetails.clientMembership);
    defaultValues.contractDetails.clientDoaSignor = safeCopy(data.contractDetails.clientDOASignor);
    defaultValues.contractDetails.contractingLegalEntityOptumRx = safeCopy(
      data.contractDetails.contractingLegalEntityOptumRx
    );
    defaultValues.contractDetails.contractingLegalEntityClient = safeCopy(
      data.contractDetails.contractingLegalEntityClient
    );
    defaultValues.contractDetails.assignedTo = safeCopy(data.contractDetails.assignedTo);
    // defaultValues.contractDetails.runOffEffectiveDate = safeCopy(data.contractDetails.runOffEffectiveDate);
    defaultValues.contractDetails.runOffEffectiveDate = convertAPIDateToUI(data.contractDetails.runOffEffectiveDate);

    if (data.contractDetails.billingAttributes) {
      // defaultValues.contractDetails.billingAttributes.invoiceBreakout = safeCopy(
      //   data.contractDetails.billingAttributes.invoiceBreakout
      // );
      defaultValues.contractDetails.billingAttributes.claimInvoiceFrequency = safeCopy(
        data.contractDetails.billingAttributes.claimInvoiceFrequency
      );
      defaultValues.contractDetails.billingAttributes.feeInvoiceFrequency = safeCopy(
        data.contractDetails.billingAttributes.feeInvoiceFrequency
      );
      defaultValues.contractDetails.billingAttributes.invoiceAggregationLevel = safeCopy(
        data.contractDetails.billingAttributes.invoiceAggregationLevel
      );
      defaultValues.contractDetails.billingAttributes.invoiceType = safeCopy(
        data.contractDetails.billingAttributes.invoiceType
      );
      defaultValues.contractDetails.billingAttributes.invoicingClaimQuantityCounts = safeCopy(
        data.contractDetails.billingAttributes.invoicingClaimQuantityCounts
      );
      defaultValues.contractDetails.billingAttributes.deliveryOption = safeCopy(
        data.contractDetails.billingAttributes.deliveryOption
      );
      defaultValues.contractDetails.billingAttributes.supportDocumentVersion = safeCopy(
        data.contractDetails.billingAttributes.supportDocumentVersion
      );
      defaultValues.contractDetails.billingAttributes.feeInvoicePaymentTerm = safeCopy(
        data.contractDetails.billingAttributes.feeInvoicePaymentTerm
      );
      defaultValues.contractDetails.billingAttributes.paymentMethod = safeCopy(
        data.contractDetails.billingAttributes.paymentMethod
      );
      defaultValues.contractDetails.billingAttributes.claimInvoicePaymentTerm = safeCopy(
        data.contractDetails.billingAttributes.claimInvoicePaymentTerm
      );
      // defaultValues.contractDetails.billingAttributes.feeInvoicePaymentTermDayType = safeCopy(
      //   data.contractDetails.billingAttributes.feeInvoicePaymentTermDayType
      // );
      // defaultValues.contractDetails.billingAttributes.claimInvoicePaymentTermDayType = safeCopy(
      //   data.contractDetails.billingAttributes.claimInvoicePaymentTermDayType
      // );

      defaultValues.contractDetails.billingAttributes.bankAccountType = safeCopy(
        data.contractDetails.billingAttributes.bankAccountType
      );
      defaultValues.contractDetails.billingAttributes.routingNumber = safeCopy(
        data.contractDetails.billingAttributes.maskedRoutingNumber
      );
      defaultValues.contractDetails.billingAttributes.accountNumber = safeCopy(
        data.contractDetails.billingAttributes.maskedAccountNumber
      );

      defaultValues.contractDetails.billingAttributes.addSuppressions =
        data.contractDetails.billingAttributes.addSuppression || false;
      if (data.contractDetails.billingAttributes.suppressions) {
        defaultValues.contractDetails.billingAttributes.suppressions =
          data.contractDetails.billingAttributes.suppressions.map((suppression) => ({
            suppressionType: safeCopy(suppression.suppressionType),
            suppressionStartDate: convertAPIDateToUI(suppression.suppressionStartDate),
            suppressionEndDate: convertAPIDateToUI(suppression.suppressionEndDate)
          }));
      }
    }

    // Contacts & Access
    if (data.contactsAndAccesses?.contacts && data.contactsAndAccesses.contacts.length > 0) {
      defaultValues.contacts = data.contactsAndAccesses.contacts.map((contact) => ({
        contactType: safeCopy(contact.contactType),
        firstName: safeCopy(contact.firstName),
        lastName: safeCopy(contact.lastName),
        email: safeCopy(contact.email),
        status: safeCopy(contact.status),
        sendEmailNotification: contact.sendEmailNotification || false
      }));
    }

    // Operational Units
    if (data.operationalUnits?.operationalUnits && data.operationalUnits.operationalUnits.length > 0) {
      defaultValues.operationalUnits = data.operationalUnits.operationalUnits.map((ou) => {
        /*
        const addresses = !ou.billingAddress
          ? []
          : ou.billingAddress.map((addr) => ({
              addressType: safeCopy(addr.addressType),
              address1: safeCopy(addr.address1),
              address2: safeCopy(addr.address2),
              city: safeCopy(addr.city),
              state: safeCopy(addr.state),
              zip: safeCopy(addr.zip)
            }));
        */
        const addresses = !ou.billingAddress ? [] : [ou.billingAddress];

        const billingAttributesOverride: BillingAttributesOverrideData = !ou.billingAttributesOverride
          ? undefined
          : {
              claimInvoiceFrequency: safeCopy(ou.billingAttributesOverride.claimInvoiceFrequency),
              feeInvoiceFrequency: safeCopy(ou.billingAttributesOverride.feeInvoiceFrequency),

              invoiceAggregationLevel: safeCopy(ou.billingAttributesOverride.invoiceAggregationLevel),
              invoiceType: safeCopy(ou.billingAttributesOverride.invoiceType),
              invoicingClaimQuantityCounts: safeCopy(ou.billingAttributesOverride.invoicingClaimQuantityCounts),
              deliveryOption: safeCopy(ou.billingAttributesOverride.deliveryOption),
              supportDocumentVersion: safeCopy(ou.billingAttributesOverride.supportDocumentVersion),
              // invoiceStaticData: safeCopy(ou.billingAttributesOverride.invoiceStaticData),

              feeInvoicePaymentTerm: safeCopy(ou.billingAttributesOverride.feeInvoicePaymentTerm),
              // feeInvoicePaymentTermDayType: safeCopy(ou.billingAttributesOverride.feeInvoicePaymentTermDayType),
              claimInvoicePaymentTerm: safeCopy(ou.billingAttributesOverride.claimInvoicePaymentTerm),
              // claimInvoicePaymentTermDayType: safeCopy(ou.billingAttributesOverride.claimInvoicePaymentTermDayType),

              paymentMethod: safeCopy(ou.billingAttributesOverride.paymentMethod),
              bankAccountType: safeCopy(ou.billingAttributesOverride.bankAccountType),
              routingNumber: safeCopy(ou.billingAttributesOverride.maskedRoutingNumber),
              accountNumber: safeCopy(ou.billingAttributesOverride.maskedAccountNumber),

              addSuppressions: ou.billingAttributesOverride.addSuppression || false,
              suppressions: ou.billingAttributesOverride.suppressions.map((suppression) => ({
                suppressionType: safeCopy(suppression.suppressionType),
                serviceStartDate: convertAPIDateToUI(suppression.suppressionStartDate),
                serviceEndDate: convertAPIDateToUI(suppression.suppressionEndDate)
              }))
            };

        return {
          name: safeCopy(ou.operationalUnitName),
          id: safeCopy(ou.operationalUnitId),
          lobNumeric: safeCopy(ou.lobNumeric),
          lineOfBusiness: safeCopy(ou.lineOfBusiness),
          marketSegment: safeCopy(ou.marketSegment),
          mrPlanType: safeCopy(ou.mrPlanType),
          mrGroupIndividual: safeCopy(ou.mrGroupIndividual),
          mrClassification: safeCopy(ou.mrClassification),
          passThroughTraditional: safeCopy(ou.passThroughPricing),
          assignedContacts: ou.assignedContactIds || [],
          addresses,
          billingAttributesOverride
        };
      });
    }
  }

  return defaultValues;
};
