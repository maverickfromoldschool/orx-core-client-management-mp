/* eslint-disable prefer-destructuring */
import type {AddClientCombinedFormData} from '../stepper/schemas';
import type {CreateClientPartyData} from '../schema/party';
import type {GetPartyResponse} from '../schema/get-party';

/**
 * Maps GetPartyResponse to AddClientCombinedFormData
 * Converts API party structure to UI form structure
 */
export const fromPartySchema = (response: GetPartyResponse): AddClientCombinedFormData => {
  const partyDetails = response.message.partyDetails;
  const party = partyDetails.partyOrganization.party;
  const organization = partyDetails.partyOrganization.organization;

  // Extract party extensions
  const runOffPhaExtension = partyDetails.partyExtensions.find((ext) => ext.attributeField === 'RUNOFF-PHA');
  const runOffMemExtension = partyDetails.partyExtensions.find((ext) => ext.attributeField === 'RUNOFF-MEM');
  const sourceExtension = partyDetails.partyExtensions.find((ext) => ext.attributeField === 'SOURCE');

  // Extract party options
  const prodOption = partyDetails.partyOptions.find((opt) => opt.optionField === 'PROD');
  const roctOption = partyDetails.partyOptions.find((opt) => opt.optionField === 'ROCT');

  // Extract primary identifier
  const primaryIdentifier =
    partyDetails.partyIdentifiers.find((id) => id.primary === 'Y') || partyDetails.partyIdentifiers[0];

  return {
    draftId: null,
    clientDetails: {
      clientReferenceId: primaryIdentifier?.value || '',
      clientId: party.partyIdentifier || '',
      clientName: organization.organizationName.organizatioName || '',
      clientStatus: party.status || '',
      addresses: partyDetails.partySiteAndAddresses.map((siteAddr) => ({
        address1: siteAddr.address.addressLine1,
        address2: siteAddr.address.addressLine2 || '',
        city: siteAddr.address.city,
        state: siteAddr.address.state,
        zip: siteAddr.address.zipPostal,
        addressType: siteAddr.partySite.addressType || 'CN'
      })),
      runOffDaysMemberClaims: runOffMemExtension?.attributeValue || '',
      runOffDaysPharmacy: runOffPhaExtension?.attributeValue || '',
      source: sourceExtension?.attributeValue || 'Manual',
      productOverrides:
        prodOption?.dataJson.fields.map((field) => ({
          productCode: field.field,
          productDescription: field.fieldValue
        })) || [],
      runOffDaysByClaimType:
        roctOption?.dataJson.fields.map((field) => ({
          claimType: field.field,
          runOffDays: field.fieldValue
        })) || []
    },
    contractDetails: {
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
      billingAttributes: {
        claimInvoiceFrequency: '',
        feeInvoiceFrequency: '',
        invoiceAggregationLevel: '',
        invoiceType: '',
        invoicingClaimQuantityCounts: '',
        deliveryOption: '',
        supportDocumentVersion: '',
        feeInvoicePaymentTerm: '',
        claimInvoicePaymentTerm: '',
        paymentMethod: '',
        bankAccountType: '',
        routingNumber: '',
        accountNumber: '',
        addSuppressions: false,
        suppressions: []
      }
    },
    contacts: [],
    operationalUnits: []
  };
};

/**
 * Maps form data to CreateClientPartyData schema
 * Converts UI form structure to API party structure
 */
export const toPartySchema = (data: AddClientCombinedFormData): CreateClientPartyData => {
  return {
    partyDetails: {
      partyOrganization: {
        organization: {
          organizationName: {
            organizatioName: data.clientDetails.clientName,
            createdBy: null,
            modifiedBy: null
          },
          createdBy: null,
          modifiedBy: null,
          partyIdentifier: null
        },
        party: {
          createdBy: null,
          modifiedBy: null,
          partyIdentifier: null,
          corporateParty: null,
          customerType: null,
          domicile: null,
          onboardingDate: null,
          partyContactList: [],
          partyExternalReferenceList: [],
          partyPartner: null,
          partyIdentifiers: [],
          preferredlanguage: null,
          relationshipType: null
        }
      },
      partyExtensions: [
        {
          attributeField: 'RUNOFF-PHA',
          attributeValue: data.clientDetails.runOffDaysPharmacy ?? '',
          startDate: null,
          endDate: null,
          createdBy: null,
          modifiedBy: null,
          partyIdentifier: null,
          modifiedDate: null,
          partyExtensionIdentifier: null
        },
        {
          attributeField: 'RUNOFF-MEM',
          attributeValue: data.clientDetails.runOffDaysMemberClaims ?? '',
          startDate: null,
          endDate: null,
          createdBy: null,
          modifiedBy: null,
          partyIdentifier: null,
          modifiedDate: null,
          partyExtensionIdentifier: null
        },
        {
          attributeField: 'SOURCE',
          attributeValue: data.clientDetails.source ?? 'Manual',
          startDate: null,
          endDate: null,
          createdBy: null,
          modifiedBy: null,
          partyIdentifier: null,
          modifiedDate: null,
          partyExtensionIdentifier: null
        }
      ],
      partyIdentifiers: [
        {
          value: data.clientDetails.clientReferenceId,
          createdBy: null,
          modifiedBy: null,
          partyIdentifier: null,
          expiryDate: null,
          identifierType: null,
          issueDate: null,
          issuingAuthority: null,
          primary: null
        }
      ],
      partyOptions: [
        {
          optionField: 'PROD',
          optionValue: 'MPARAMS',
          dataJson: {
            fields: data.clientDetails.productOverrides.map((d) => ({
              field: d.productCode,
              fieldValue: d.productDescription
            }))
          },
          startDate: null,
          endDate: null,
          createdBy: null,
          modifiedBy: null,
          partyIdentifier: null,
          partyOptionIdentifier: null
        },
        {
          optionField: 'ROCT',
          optionValue: 'MPARAMS',
          dataJson: {
            fields: data.clientDetails.runOffDaysByClaimType.map((d) => ({
              field: d.claimType,
              fieldValue: d.runOffDays
            }))
          },
          startDate: null,
          endDate: null,
          createdBy: null,
          modifiedBy: null,
          partyIdentifier: null,
          partyOptionIdentifier: null
        }
      ],
      partySiteAndAddresses: data.clientDetails.addresses.map((a) => ({
        address: {
          addressLine1: a.address1,
          addressLine2: a.address2 ?? null,
          addressLine3: null,
          addressLine4: null,
          city: a.city,
          country: 'USA',
          state: a.state,
          zipPostal: a.zip,
          territory: null,
          latitude: null,
          longitude: null,
          externalSystemCd: null,
          createdBy: null,
          modifiedBy: null,
          createdDate: null,
          modifiedDate: null,
          addressIdentifier: null
        },
        partySite: {
          addressType: 'CN',
          addressIdentifier: null,
          attentionLine: null,
          externalReference: null,
          effectiveDate: null,
          expirationDate: null,
          startMonth: null,
          endMonth: null,
          locationCode: null,
          primary: 'N' as const,
          createdBy: null,
          modifiedBy: null,
          createdDate: null,
          modifiedDate: null,
          partyIdentifier: null
        }
      }))
    }
  };
};
