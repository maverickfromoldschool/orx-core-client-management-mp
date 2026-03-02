// Re-export all schemas, types, and defaults from modular schema files
// This provides a single import point and maintains backward compatibility

// Address schemas
export {
  addressSchema,
  clientDetailsAddressSchema,
  operationalUnitAddressSchema,
  defaultAddressData,
  defaultClientDetailsAddressData,
  defaultOperationalUnitAddressData
} from './address-schemas';

export type {AddressData, ClientDetailsAddressData, OperationalUnitAddressData} from './address-schemas';

// Contact schemas
export {contactSchema, contactsAccessSchema, defaultContactData, defaultContactsAccessData} from './contact-schemas';

export type {Contact, ContactData, ContactsAccessFormData} from './contact-schemas';

// Operational unit schemas
export {operationalUnitSchema, defaultOperationalUnitData} from './operational-unit-schemas';

export type {OperationalUnitData, BillingAttributesOverrideData} from './operational-unit-schemas';

// Contract schemas
export {contractDetailsStepSchema, defaultContractDetailsStepData} from './contract-schemas';

export type {ContractDetailsStepFormData} from './contract-schemas';

// Client schemas
export {clientDetailsStepSchema, defaultClientDetailsStepData} from './client-schemas';

export type {ClientDetailsStepFormData} from './client-schemas';

// Combined schema
export {addClientCombinedSchema, defaultAddClientCombinedData, defaultFormData} from './combined-schema';

export type {AddClientCombinedFormData, AddClientFormData} from './combined-schema';

// Suppression types from add-client-schema
export type {SuppressionEntryData} from './add-client-schema';
