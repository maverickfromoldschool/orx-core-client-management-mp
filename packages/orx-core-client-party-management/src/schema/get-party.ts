import {z} from 'zod';

// Base audit fields schema
const auditFieldsSchema = z.object({
  createdBy: z.string(),
  modifiedBy: z.string(),
  createdDate: z.string(),
  modifiedDate: z.string(),
  version: z.number()
});

// Party Identifier schema
const partyIdentifierSchema = auditFieldsSchema.extend({
  partyIdentifier: z.string(),
  identifierType: z.string(),
  value: z.string(),
  primary: z.string(),
  issuingCountry: z.string().nullable(),
  issuingAuthority: z.string().nullable(),
  expiryDate: z.string().nullable()
});

// Organization Name schema
const organizationNameSchema = auditFieldsSchema.extend({
  individualIdentifier: z.string(),
  type: z.string(),
  primary: z.string(),
  organizatioName: z.string()
});

// Organization schema
const organizationSchema = auditFieldsSchema.extend({
  partyIdentifier: z.string(),
  classificationCode: z.string().nullable(),
  businessType: z.string().nullable(),
  website: z.string().nullable(),
  standardIndustryClassification: z.string().nullable(),
  creditRating: z.string().nullable(),
  currency: z.string().nullable(),
  operationsUnit: z.string().nullable(),
  annualRevenue: z.number().nullable(),
  noOfEmployees: z.number(),
  companyCode: z.string().nullable(),
  branchCode: z.string().nullable(),
  businessSector: z.string().nullable(),
  taxIdType: z.string().nullable(),
  taxId: z.string().nullable(),
  logo: z.string().nullable(),
  billCycleCode: z.string().nullable(),
  paymentTerm: z.string().nullable(),
  organizationName: organizationNameSchema,
  primarySw: z.string().nullable()
});

// Party schema
const partySchema = auditFieldsSchema.extend({
  partyIdentifier: z.string(),
  status: z.string(),
  customerType: z.string(),
  relationshipType: z.string(),
  domicile: z.string(),
  onboardingDate: z.string(),
  expirationDate: z.string().nullable(),
  preferredlanguage: z.string(),
  timeZone: z.string().nullable(),
  customerSegment: z.string().nullable(),
  region: z.string().nullable(),
  corporateParty: z.string(),
  dataJson: z.unknown().nullable(),
  displayName: z.string().nullable(),
  partyIdentifiers: z.array(partyIdentifierSchema),
  phoneContact: z.string().nullable(),
  userIdentifier: z.string().nullable(),
  statementGroupCount: z.number(),
  statementGroupId: z.string().nullable(),
  alternateReference: z.string().nullable(),
  taxExempt: z.string()
});

// Party Organization schema
const partyOrganizationSchema = z.object({
  party: partySchema,
  organization: organizationSchema,
  rebateAgreementCount: z.number(),
  quoteCount: z.number(),
  dealCount: z.number(),
  statementGroupCount: z.number().nullable(),
  statementGroupIdentifier: z.string().nullable(),
  accountCount: z.number(),
  accountIdentifier: z.string().nullable(),
  childPartyCount: z.number()
});

// Party Extension schema
const partyExtensionSchema = auditFieldsSchema.extend({
  partyExtensionIdentifier: z.string(),
  partyIdentifier: z.string(),
  attributeField: z.string(),
  attributeValue: z.string(),
  startDate: z.string(),
  endDate: z.string().nullable()
});

// Party Option DataJson schema
const partyOptionDataJsonSchema = z.object({
  fields: z.array(
    z.object({
      field: z.string(),
      fieldValue: z.string()
    })
  )
});

// Party Option schema
const partyOptionSchema = auditFieldsSchema.extend({
  partyOptionIdentifier: z.string(),
  partyIdentifier: z.string(),
  optionField: z.string(),
  optionValue: z.string(),
  startDate: z.string(),
  endDate: z.string().nullable(),
  dataJson: partyOptionDataJsonSchema
});

// Address schema
const addressSchema = auditFieldsSchema.extend({
  addressIdentifier: z.string(),
  addressLine1: z.string(),
  addressLine2: z.string().nullable(),
  addressLine3: z.string().nullable(),
  addressLine4: z.string().nullable(),
  country: z.string(),
  state: z.string(),
  city: z.string(),
  zipPostal: z.string(),
  territory: z.string().nullable(),
  latitude: z.string().nullable(),
  longitude: z.string().nullable(),
  stateName: z.string().nullable(),
  attentionLine: z.string().nullable(),
  mailingName: z.string().nullable(),
  externalSystemCd: z.string().nullable(),
  accountId: z.string().nullable(),
  countryName: z.string().nullable(),
  codeInDisplay: z.string().nullable(),
  sequence: z.number().nullable(),
  externalReference: z.string().nullable()
});

// Party Site schema
const partySiteSchema = auditFieldsSchema.extend({
  partyIdentifier: z.string(),
  addressIdentifier: z.string(),
  addressType: z.string(),
  effectiveDate: z.string(),
  expirationDate: z.string().nullable(),
  attentionLine: z.string().nullable(),
  primary: z.string(),
  startMonth: z.string().nullable(),
  endMonth: z.string().nullable(),
  dataJson: z.unknown().nullable(),
  externalReference: z.string().nullable(),
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
  partyIdentifiers: z.array(partyIdentifierSchema),
  partyOptions: z.array(partyOptionSchema),
  partySiteAndAddresses: z.array(partySiteAndAddressSchema)
});

// Main Get Party Response schema
export const getPartyResponseSchema = z.object({
  success: z.boolean(),
  message: z.object({
    partyDetails: partyDetailsSchema,
    contractDetails: z.unknown().nullable(),
    contactDetails: z.unknown().nullable()
  }),
  data: z.string()
});

// Infer TypeScript types from schemas
export type GetPartyResponse = z.infer<typeof getPartyResponseSchema>;
export type PartyDetails = z.infer<typeof partyDetailsSchema>;
export type PartyOrganization = z.infer<typeof partyOrganizationSchema>;
export type Party = z.infer<typeof partySchema>;
export type Organization = z.infer<typeof organizationSchema>;
export type PartyIdentifier = z.infer<typeof partyIdentifierSchema>;
export type PartyExtension = z.infer<typeof partyExtensionSchema>;
export type PartyOption = z.infer<typeof partyOptionSchema>;
export type PartySiteAndAddress = z.infer<typeof partySiteAndAddressSchema>;
export type Address = z.infer<typeof addressSchema>;
export type PartySite = z.infer<typeof partySiteSchema>;
