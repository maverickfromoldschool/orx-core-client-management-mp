import {z} from 'zod';

// Party Identifier Schema
const partyIdentifierSchema = z.object({
  createdBy: z.string(),
  modifiedBy: z.string(),
  createdDate: z.string(),
  modifiedDate: z.string(),
  version: z.number(),
  partyIdentifier: z.string(),
  identifierType: z.string(),
  value: z.string(),
  primary: z.string(),
  issuingCountry: z.string().nullable(),
  issuingAuthority: z.string().nullable(),
  expiryDate: z.string().nullable()
});

// Organization Name Schema
const organizationNameSchema = z.object({
  createdBy: z.string(),
  modifiedBy: z.string(),
  createdDate: z.string(),
  modifiedDate: z.string(),
  version: z.number(),
  individualIdentifier: z.string(),
  type: z.string(),
  primary: z.string(),
  organizatioName: z.string()
});

// Party Schema
const partySchema = z.object({
  createdBy: z.string(),
  modifiedBy: z.string(),
  createdDate: z.string(),
  modifiedDate: z.string(),
  version: z.number(),
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
  dataJson: z.string().nullable(),
  displayName: z.string().nullable(),
  partyIdentifiers: z.array(partyIdentifierSchema),
  phoneContact: z.string().nullable(),
  userIdentifier: z.string().nullable(),
  statementGroupCount: z.number(),
  statementGroupId: z.string().nullable(),
  alternateReference: z.string().nullable(),
  taxExempt: z.string()
});

// Organization Schema
const organizationSchema = z.object({
  createdBy: z.string(),
  modifiedBy: z.string(),
  createdDate: z.string(),
  modifiedDate: z.string(),
  version: z.number(),
  partyIdentifier: z.string(),
  classificationCode: z.string().nullable(),
  businessType: z.string().nullable(),
  website: z.string().nullable(),
  standardIndustryClassification: z.string().nullable(),
  creditRating: z.string().nullable(),
  currency: z.string().nullable(),
  operationsUnit: z.string().nullable(),
  annualRevenue: z.string().nullable(),
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

// Party Data Item Schema
const partyDataItemSchema = z.object({
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

// Message Schema
const messageSchema = z.object({
  totalPages: z.number(),
  currentPage: z.number(),
  totalRecord: z.number(),
  data: z.array(partyDataItemSchema)
});

// Main Response Schema
export const getAllPartyResponseSchema = z.object({
  success: z.boolean(),
  message: messageSchema,
  data: z.string()
});

// Infer TypeScript types from schemas
export type PartyIdentifier = z.infer<typeof partyIdentifierSchema>;
export type OrganizationName = z.infer<typeof organizationNameSchema>;
export type Party = z.infer<typeof partySchema>;
export type Organization = z.infer<typeof organizationSchema>;
export type PartyDataItem = z.infer<typeof partyDataItemSchema>;
export type GetAllPartyMessage = z.infer<typeof messageSchema>;
export type GetAllPartyResponse = z.infer<typeof getAllPartyResponseSchema>;
