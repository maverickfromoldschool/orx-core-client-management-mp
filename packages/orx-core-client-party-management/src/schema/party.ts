import {z} from 'zod';

// Base audit fields schema
const auditFieldsSchema = z.object({
  createdBy: z.string().nullable(),
  modifiedBy: z.string().nullable()
});

// Organization Name schema
const organizationNameSchema = auditFieldsSchema.extend({
  organizatioName: z.string().min(1, 'Organization name is required')
});

// Organization schema
const organizationSchema = auditFieldsSchema.extend({
  organizationName: organizationNameSchema,
  partyIdentifier: z.string().nullable()
});

// Party Contact schema
const partyContactSchema = z.object({
  // Add contact fields as needed
});

// Party External Reference schema
const partyExternalReferenceSchema = z.object({
  // Add external reference fields as needed
});

// Party Identifier schema
const partyIdentifierItemSchema = z.object({
  // Add identifier fields as needed
});

// Party schema
const partySchema = auditFieldsSchema.extend({
  corporateParty: z.string().nullable(),
  customerType: z.string().nullable(),
  domicile: z.string().nullable(),
  onboardingDate: z.string().nullable(),
  partyContactList: z.array(partyContactSchema),
  partyExternalReferenceList: z.array(partyExternalReferenceSchema),
  partyPartner: z.string().nullable(),
  partyIdentifier: z.string().nullable(),
  partyIdentifiers: z.array(partyIdentifierItemSchema),
  preferredlanguage: z.string().nullable(),
  relationshipType: z.string().nullable()
});

// Party Organization schema
const partyOrganizationSchema = z.object({
  organization: organizationSchema,
  party: partySchema
});

// Party Extension schema
const partyExtensionSchema = auditFieldsSchema.extend({
  attributeField: z.string().min(1, 'Attribute field is required'),
  attributeValue: z.string().min(1, 'Attribute value is required'),
  endDate: z.string().nullable(),
  modifiedDate: z.string().nullable(),
  partyExtensionIdentifier: z.string().nullable(),
  partyIdentifier: z.string().nullable(),
  startDate: z.string().nullable()
});

// Party Identifiers schema
const partyIdentifiersSchema = auditFieldsSchema.extend({
  expiryDate: z.string().nullable(),
  identifierType: z.string().nullable(),
  issueDate: z.string().nullable(),
  issuingAuthority: z.string().nullable(),
  partyIdentifier: z.string().nullable(),
  primary: z.boolean().nullable(),
  value: z.string().min(1, 'Client reference number is required')
});

// Party Options - Data JSON field schema
const partyOptionFieldSchema = z.object({
  field: z.string().min(1, 'Field name is required'),
  fieldValue: z.string().min(1, 'Field value is required')
});

const partyOptionDataJsonSchema = z.object({
  fields: z.array(partyOptionFieldSchema)
});

// Party Options schema
const partyOptionSchema = auditFieldsSchema.extend({
  partyOptionIdentifier: z.string().nullable(),
  partyIdentifier: z.string().nullable(),
  optionField: z.string().min(1, 'Option field is required'),
  optionValue: z.string().min(1, 'Option value is required'),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  dataJson: partyOptionDataJsonSchema
});

// Address schema
const addressSchema = z.object({
  addressIdentifier: z.string().nullable(),
  addressLine1: z.string().min(1, 'Address line 1 is required'),
  addressLine2: z.string().nullable(),
  addressLine3: z.string().nullable(),
  addressLine4: z.string().nullable(),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  createdBy: z.string().nullable(),
  createdDate: z.string().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  modifiedBy: z.string().nullable(),
  modifiedDate: z.string().nullable(),
  state: z.string().min(1, 'State is required'),
  territory: z.string().nullable(),
  zipPostal: z.string().min(1, 'Zip/Postal code is required'),
  externalSystemCd: z.string().nullable()
});

// Party Site schema
const partySiteSchema = z.object({
  addressIdentifier: z.string().nullable(),
  addressType: z.string().min(1, 'Address type is required'),
  attentionLine: z.string().nullable(),
  externalReference: z.string().nullable(),
  createdBy: z.string().nullable(),
  createdDate: z.string().nullable(),
  effectiveDate: z.string().nullable(),
  expirationDate: z.string().nullable(),
  modifiedBy: z.string().nullable(),
  modifiedDate: z.string().nullable(),
  partyIdentifier: z.string().nullable(),
  primary: z.enum(['Y', 'N']),
  startMonth: z.string().nullable(),
  endMonth: z.string().nullable(),
  locationCode: z.string().nullable()
});

// Party Site and Address schema
const partySiteAndAddressSchema = z.object({
  address: addressSchema,
  partySite: partySiteSchema
});

// Party Details schema
const partyDetailsSchema = z.object({
  partyOrganization: partyOrganizationSchema,
  partyExtensions: z.array(partyExtensionSchema),
  partyIdentifiers: z.array(partyIdentifiersSchema),
  partyOptions: z.array(partyOptionSchema),
  partySiteAndAddresses: z.array(partySiteAndAddressSchema)
});

// Main Client Party schema
export const createClientPartySchema = z
  .object({
    partyDetails: partyDetailsSchema
  })
  .refine(
    (data) => {
      // Ensure SOURCE attribute is always "Manual"
      const sourceExtension = data.partyDetails.partyExtensions.find((ext) => ext.attributeField === 'SOURCE');
      return sourceExtension?.attributeValue === 'Manual';
    },
    {
      message: 'SOURCE attribute must be set to "Manual"',
      path: ['partyDetails', 'partyExtensions']
    }
  );

// Infer TypeScript type from schema
export type CreateClientPartyData = z.infer<typeof createClientPartySchema>;
export type ClientPartyData = z.infer<typeof createClientPartySchema>;

// Export individual schemas for reuse
export {
  partyDetailsSchema,
  partyOrganizationSchema,
  partyExtensionSchema,
  partyIdentifiersSchema,
  partyOptionSchema,
  partySiteAndAddressSchema,
  addressSchema,
  partySiteSchema
};
