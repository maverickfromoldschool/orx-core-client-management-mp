import {z} from 'zod';

// Address schema for Step 1 (Client Details) - all fields required with "Required field" message
export const clientDetailsAddressSchema = z.object({
  addressType: z
    .string()
    .trim()
    .min(1, 'Required field')
    .max(50, 'Cannot be more than 50 characters')
    .regex(/^[a-zA-Z ]+$/, 'Only letters and spaces are allowed'),
  address1: z
    .string()
    .trim()
    .min(1, 'Required field')
    .max(255, 'Cannot be more than 255 characters')
    .regex(/^[a-zA-Z0-9 ]+$/, 'Only letters, numbers, and spaces are allowed'),
  address2: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9 ]*$/, 'Only letters, numbers, and spaces are allowed')
    .max(50, 'Cannot be more than 50 characters')
    .optional(),
  city: z
    .string()
    .trim()
    .min(1, 'Required field')
    .regex(/^[a-zA-Z ]+$/, 'Only letters and spaces are allowed'),
  state: z
    .string()
    .trim()
    .min(1, 'Required field')
    .max(50, 'Cannot be more than 50 characters')
    .regex(/^[a-zA-Z ]+$/, 'Only letters and spaces are allowed'),
  zip: z
    .string()
    .trim()
    .min(1, 'Required field')
    .max(50, 'Cannot be more than 50 characters')
    .regex(/^[a-zA-Z0-9-]+$/, 'Only letters, numbers, and hyphens are allowed')
});

// Address schema (original - for other steps)
export const addressSchema = z.object({
  addressType: z
    .string()
    .trim()
    .min(1, 'Required field')
    .max(50, 'Cannot be more than 50 characters')
    .regex(/^[a-zA-Z ]+$/, 'Only letters and spaces are allowed'),
  address1: z
    .string()
    .trim()
    .min(1, 'Required field')
    .max(255, 'Cannot be more than 255 characters')
    .regex(/^[a-zA-Z0-9 ]+$/, 'Only letters, numbers, and spaces are allowed'),
  address2: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9 ]*$/, 'Only letters, numbers, and spaces are allowed')
    .max(50, 'Cannot be more than 50 characters')
    .optional(),
  city: z
    .string()
    .trim()
    .min(1, 'Required field')
    .regex(/^[a-zA-Z ]+$/, 'Only letters and spaces are allowed'),
  state: z
    .string()
    .trim()
    .min(1, 'Required field')
    .max(50, 'Cannot be more than 50 characters')
    .regex(/^[a-zA-Z ]+$/, 'Only letters and spaces are allowed'),
  zip: z
    .string()
    .trim()
    .min(1, 'Required field')
    .max(50, 'Cannot be more than 50 characters')
    .regex(/^[a-zA-Z0-9-]+$/, 'Only letters, numbers, and hyphens are allowed')
});

// Contact schema for Step 3 (Contacts & Access)
// Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 4.1, 4.2, 4.3, 4.4, 4.5
export const contactSchema = z.object({
  contactType: z
    .string()
    .trim()
    .min(1, 'Required field')
    .regex(/^[a-zA-Z ]+$/, 'Only letters and spaces are allowed'),
  firstName: z
    .string()
    .trim()
    .min(1, 'Required field')
    .max(100, 'Cannot be more than 100 characters')
    .regex(/^[a-zA-Z ]+$/, 'Only letters and spaces are allowed'),
  lastName: z
    .string()
    .trim()
    .min(1, 'Required field')
    .max(100, 'Cannot be more than 100 characters')
    .regex(/^[a-zA-Z ]+$/, 'Only letters and spaces are allowed'),
  email: z.string().trim().min(1, 'Required field').email('Invalid email format'),
  status: z
    .string()
    .trim()
    .max(50, 'Cannot be more than 50 characters')
    .regex(/^[a-zA-Z ]+$/, 'Only letters and spaces are allowed')
    .optional(),
  sendEmailNotification: z.boolean().default(false)
});

// Suppression Entry schema for Contract Details Step (Step 2)
// Requirements: 5.4-5.6
export const suppressionEntrySchema = z
  .object({
    suppressionType: z.string().optional(),
    suppressionStartDate: z.string().optional(),
    suppressionEndDate: z.string().optional()
  })
  .superRefine((data, ctx) => {
    if (
      data.suppressionStartDate &&
      data.suppressionEndDate &&
      !Number.isNaN(new Date(data.suppressionStartDate).getTime()) &&
      !Number.isNaN(new Date(data.suppressionEndDate).getTime()) &&
      new Date(data.suppressionStartDate) > new Date(data.suppressionEndDate)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Suppression start date must be before or equal to end date',
        path: ['suppressionStartDate']
      });
    }
  });

export type SuppressionEntryData = z.infer<typeof suppressionEntrySchema>;

// Contacts & Access Step Schema (Step 3)
export const contactsAccessSchema = z.object({
  contacts: z.array(contactSchema).min(1, 'At least one contact is required')
});

// Address schema for Operational Units (Step 4) - all fields required with "Required field" message
// Requirements: 3.2-3.7, 6.6
export const operationalUnitAddressSchema = z.object({
  addressType: z
    .string()
    .trim()
    .min(1, 'Required field')
    .max(50, 'Cannot be more than 50 characters')
    .regex(/^[a-zA-Z ]+$/, 'Only letters and spaces are allowed'),
  address1: z
    .string()
    .trim()
    .min(1, 'Required field')
    .max(255, 'Cannot be more than 255 characters')
    .regex(/^[a-zA-Z0-9 ]+$/, 'Only letters, numbers, and spaces are allowed'),
  address2: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9 ]*$/, 'Only letters, numbers, and spaces are allowed')
    .max(50, 'Cannot be more than 50 characters')
    .optional(),
  city: z
    .string()
    .trim()
    .min(1, 'Required field')
    .regex(/^[a-zA-Z ]+$/, 'Only letters and spaces are allowed'),
  state: z
    .string()
    .trim()
    .min(1, 'Required field')
    .max(50, 'Cannot be more than 50 characters')
    .regex(/^[a-zA-Z ]+$/, 'Only letters and spaces are allowed'),
  zip: z
    .string()
    .trim()
    .min(1, 'Required field')
    .max(50, 'Cannot be more than 50 characters')
    .regex(/^[a-zA-Z0-9-]+$/, 'Only letters, numbers, and hyphens are allowed')
});

// Suppression Entry schema for Operational Units (Step 4)
// Requirements: 6.3-6.5
export const operationalUnitSuppressionEntrySchema = z
  .object({
    suppressionType: z.string().optional(),
    serviceStartDate: z.string().optional(), // :TODO rename
    serviceEndDate: z.string().optional() // :TODO rename
  })
  .superRefine((data, ctx) => {
    if (
      data.serviceStartDate &&
      data.serviceEndDate &&
      !Number.isNaN(new Date(data.serviceStartDate).getTime()) &&
      !Number.isNaN(new Date(data.serviceEndDate).getTime()) &&
      new Date(data.serviceStartDate) > new Date(data.serviceEndDate)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Service start date must be before or equal to end date',
        path: ['serviceStartDate']
      });
    }
  });

export type OperationalUnitSuppressionEntryData = z.infer<typeof operationalUnitSuppressionEntrySchema>;

// Billing Attributes Override schema for Operational Units (optional)
// Requirements: 4.1-4.5 - mirrors contract billing attributes but all optional
export const billingAttributesOverrideSchema = z
  .object({
    // Invoice settings (Requirements 4.6-4.13)
    claimInvoiceFrequency: z.string().max(50, 'Cannot be more than 50 characters').optional(),
    feeInvoiceFrequency: z.string().max(50, 'Cannot be more than 50 characters').optional(),
    invoiceAggregationLevel: z.string().max(50, 'Cannot be more than 50 characters').optional(),
    invoiceType: z.string().max(50, 'Cannot be more than 50 characters').optional(),
    invoicingClaimQuantityCounts: z.string().max(50, 'Cannot be more than 50 characters').optional(),
    deliveryOption: z.string().max(50, 'Cannot be more than 50 characters').optional(),
    supportDocumentVersion: z.string().max(50, 'Cannot be more than 50 characters').optional(),
    invoiceStaticData: z.string().max(50, 'Cannot be more than 50 characters').optional(),
    // Fee Invoice Payment Terms (Requirements 4.14-4.15)
    feeInvoicePaymentTerm: z.string().max(50, 'Cannot be more than 50 characters').optional(),
    feeInvoicePaymentTermDayType: z.string().max(50, 'Cannot be more than 50 characters').optional(),
    // Claim Invoice Payment Terms (Requirements 4.16-4.17)
    claimInvoicePaymentTerm: z.string().max(50, 'Cannot be more than 50 characters').optional(),
    claimInvoicePaymentTermDayType: z.string().max(50, 'Cannot be more than 50 characters').optional(),
    // Payment Method (Requirements 5.1, 5.3-5.5)
    paymentMethod: z.string().max(50, 'Cannot be more than 50 characters').optional(),
    bankAccountType: z
      .string()
      .trim()
      .regex(/^[a-zA-Z ]*$/, 'Only letters and spaces are allowed')
      .max(50, 'Cannot be more than 50 characters')
      .optional(),
    routingNumber: z
      .string()
      .trim()
      .regex(/^[a-zA-Z0-9]*$/, 'Only letters and numbers are allowed')
      .max(50, 'Cannot be more than 50 characters')
      .optional(),
    accountNumber: z
      .string()
      .trim()
      .regex(/^[a-zA-Z0-9]*$/, 'Only letters and numbers are allowed')
      .max(50, 'Cannot be more than 50 characters')
      .optional(),
    // Suppressions
    addSuppressions: z.boolean().optional(),
    suppressions: z
      .array(
        z.object({
          suppressionType: z.string().optional(),
          serviceStartDate: z.string().optional(),
          serviceEndDate: z.string().optional()
        })
      )
      .optional()
  })
  .optional();

export const operationalUnitSchema = z.object({
  // Required fields (Requirements 2.1, 2.2, 2.3, 2.5, 8.2-8.5)
  name: z
    .string()
    .trim()
    .min(1, 'Required field')
    .max(50, 'Cannot be more than 50 characters')
    .regex(/^[a-zA-Z0-9 _-]+$/, 'Only letters, numbers, spaces, underscores, and hyphens are allowed'),
  id: z
    .string()
    .trim()
    .min(1, 'Required field')
    .max(50, 'Cannot be more than 50 characters')
    .regex(/^[a-zA-Z0-9 ]+$/, 'Only letters, numbers, and spaces are allowed'),
  lobNumeric: z
    .string()
    .trim()
    .min(1, 'Required field')
    .max(50, 'Cannot be more than 50 characters')
    .regex(/^[0-9]+$/, 'Only numbers are allowed'),
  lineOfBusiness: z
    .string()
    .trim()
    .min(1, 'Required field')
    .max(50, 'Cannot be more than 50 characters')
    .regex(/^[a-zA-Z ]+$/, 'Only letters and spaces are allowed'),

  // Optional fields (Requirements 2.4, 2.6-2.10)
  marketSegment: z
    .string()
    .trim()
    .max(50, 'Cannot be more than 50 characters')
    .regex(/^[a-zA-Z ]*$/, 'Only letters and spaces are allowed')
    .optional(),
  mrPlanType: z
    .string()
    .trim()
    .max(50, 'Cannot be more than 50 characters')
    .regex(/^[a-zA-Z0-9 _-]*$/, 'Only letters, numbers, spaces, underscores, and hyphens are allowed')
    .optional(),
  mrGroupIndividual: z.string().max(50, 'Cannot be more than 50 characters').optional(),
  mrClassification: z.string().max(50, 'Cannot be more than 50 characters').optional(),
  passThroughTraditional: z.string().max(50, 'Cannot be more than 50 characters').optional(),

  // Assigned contacts as string array (Requirements 2.10-2.13)
  assignedContacts: z.array(z.string()).optional(),

  // Address array (Requirements 3, 8.6)
  addresses: z.array(operationalUnitAddressSchema).min(1, 'At least one address is required'),

  // Billing attributes override (optional, Requirements 4.6-4.17, 5.1, 5.3-5.5)
  billingAttributesOverride: billingAttributesOverrideSchema
});

// Main AddClient schema
export const addClientSchema = z.object({
  // Client Details
  clientReferenceId: z
    .string()
    .trim()
    .min(1, 'Client Reference ID is required')
    .max(50, 'Cannot be more than 50 characters')
    .regex(/^[a-zA-Z0-9 ]+$/, 'Only letters, numbers, and spaces are allowed'),
  clientId: z.string().optional(),
  clientName: z
    .string()
    .trim()
    .min(1, 'Client name is required')
    .max(255, 'Cannot be more than 255 characters')
    .regex(/^[a-zA-Z0-9 ]+$/, 'Only letters, numbers, and spaces are allowed'),
  addresses: z.array(addressSchema).min(1, 'At least one address is required'),

  // Contract Details
  billingFrequency: z.string().min(1, 'Billing frequency is required'),
  paymentTerms: z.string().min(1, 'Payment terms is required'),
  currency: z.string().min(1, 'Currency is required'),
  enableAutopay: z.enum(['yes', 'no'] as const, {
    message: 'Please select autopay preference'
  }),
  bankAccountNumber: z.string().optional(),
  routingNumber: z.string().optional(),

  // Contacts & Access
  contacts: z.array(contactSchema).min(1, 'At least one contact is required'),

  // Operational Units
  operationalUnits: z.array(operationalUnitSchema).min(1, 'At least one operational unit is required')
});

// Type inference
export type AddClientFormData = z.infer<typeof addClientSchema>;
export type AddressData = z.infer<typeof addressSchema>;
export type Contact = z.infer<typeof contactSchema>;
export type ContactsAccessFormData = z.infer<typeof contactsAccessSchema>;
export type OperationalUnitData = z.infer<typeof operationalUnitSchema>;
export type OperationalUnitAddressData = z.infer<typeof operationalUnitAddressSchema>;
export type BillingAttributesOverrideData = z.infer<typeof billingAttributesOverrideSchema>;

// Legacy type alias for backward compatibility
export type ContactData = Contact;

// Client Details Step Schema (Step 1) - for form validation with zodResolver
// Uses "Required field" message for all required fields per Requirements 3.7, 5.1
export const clientDetailsStepSchema = z.object({
  clientReferenceId: z
    .string()
    .trim()
    .min(1, 'Required field')
    .max(50, 'Cannot be more than 50 characters')
    .regex(/^[a-zA-Z0-9 ]+$/, 'Only letters, numbers, and spaces are allowed'),
  clientId: z.string().optional(),
  clientName: z
    .string()
    .trim()
    .min(1, 'Required field')
    .max(255, 'Cannot be more than 255 characters')
    .regex(/^[a-zA-Z0-9 ]+$/, 'Only letters, numbers, and spaces are allowed'),

  addresses: z.array(clientDetailsAddressSchema).min(1, 'At least one address is required')
});

// Type for Client Details Step form data
export type ClientDetailsStepFormData = z.infer<typeof clientDetailsStepSchema>;

// Contract Details Step Schema (Step 2)
// Requirements: 2.1-2.13, 3.1-3.13, 4.5-4.8, 6.1-6.6
export const contractDetailsStepSchema = z
  .object({
    // Contract Information (Requirements 2.1-2.11)
    clientContractId: z
      .string()
      .regex(/^[a-zA-Z0-9]+$/, 'Only letters and numbers are allowed')
      .max(50, 'Cannot be more than 50 characters')
      .optional(),
    effectiveDate: z.string().min(1, 'Required field'),
    terminationDate: z.string().optional(),
    contractTerm: z
      .string()
      // .regex(/^[a-zA-Z0-9]+$/, 'Only letters and numbers are allowed')
      .max(50, 'Cannot be more than 50 characters')
      .optional(),
    clientMembership: z.string().max(100, 'Cannot be more than 100 characters').optional(),
    clientDoaSignor: z.string().max(50, 'Cannot be more than 50 characters').optional(),
    contractingLegalEntityOptumRx: z.string().max(100, 'Cannot be more than 100 characters').optional(),
    contractingLegalEntityClient: z.string().max(100, 'Cannot be more than 100 characters').optional(),
    assignedTo: z
      .string()
      .regex(/^[a-zA-Z0-9]+$/, 'Only letters and numbers are allowed')
      .max(50, 'Cannot be more than 50 characters')
      .optional(),
    runOffEffectiveDate: z.string().max(50, 'Cannot be more than 50 characters').optional(),

    // Billing Attributes (Requirements 3.1-3.13)
    invoiceBreakout: z.string().min(1, 'Required field').max(50, 'Cannot be more than 50 characters'),
    claimInvoiceFrequency: z.string().min(1, 'Required field').max(50, 'Cannot be more than 50 characters'),
    feeInvoiceFrequency: z.string().min(1, 'Required field').max(50, 'Cannot be more than 50 characters'),
    invoiceAggregationLevel: z.string().min(1, 'Required field').max(50, 'Cannot be more than 50 characters'),
    invoiceType: z.string().min(1, 'Required field').max(50, 'Cannot be more than 50 characters'),
    invoicingClaimQuantityCounts: z.string().max(50, 'Cannot be more than 50 characters').optional(),
    deliveryOption: z.string().min(1, 'Required field').max(50, 'Cannot be more than 50 characters'),
    supportDocumentVersion: z.string().min(1, 'Required field').max(50, 'Cannot be more than 50 characters'),
    claimInvoicePaymentTerm: z.string().max(50, 'Cannot be more than 50 characters').optional(),
    feeInvoicePaymentTerm: z.string().max(50, 'Cannot be more than 50 characters').optional(),
    paymentMethod: z.string().max(50, 'Cannot be more than 50 characters').optional(),

    // Autopay Information (Requirements 4.5-4.8) - conditionally required
    bankAccountType: z
      .string()
      .regex(/^[a-zA-Z]+$/, 'Only letters are allowed')
      .max(50, 'Cannot be more than 50 characters')
      .optional(),
    routingNumber: z
      .string()
      .regex(/^[a-zA-Z0-9]+$/, 'Only letters and numbers are allowed')
      .max(50, 'Cannot be more than 50 characters')
      .optional(),
    accountNumber: z
      .string()
      .regex(/^[a-zA-Z0-9]+$/, 'Only letters and numbers are allowed')
      .max(50, 'Cannot be more than 50 characters')
      .optional(),

    // Suppressions
    addSuppressions: z.boolean().default(false),
    suppressions: z.array(suppressionEntrySchema).optional()
  })
  .refine(
    (data) => {
      if (!data.terminationDate) return true;
      return new Date(data.effectiveDate) <= new Date(data.terminationDate);
    },
    {
      message: 'Termination date must be after or equal to effective date',
      path: ['terminationDate']
    }
  );

// Contract Details Step Schema with conditional autopay validation (Requirements 6.5)
export const contractDetailsStepSchemaWithAutopay = contractDetailsStepSchema.superRefine(
  (data, ctx: z.RefinementCtx) => {
    if (data.paymentMethod === 'ACH') {
      if (!data.bankAccountType || data.bankAccountType.trim() === '') {
        ctx.addIssue({
          code: 'custom',
          message: 'Required field',
          path: ['bankAccountType']
        });
      }
      if (!data.routingNumber || data.routingNumber.trim() === '') {
        ctx.addIssue({
          code: 'custom',
          message: 'Required field',
          path: ['routingNumber']
        });
      }
      if (!data.accountNumber || data.accountNumber.trim() === '') {
        ctx.addIssue({
          code: 'custom',
          message: 'Required field',
          path: ['accountNumber']
        });
      }
    }
  }
);

// Type for Contract Details Step form data
export type ContractDetailsStepFormData = z.infer<typeof contractDetailsStepSchema>;

// Combined Add Client Form Schema (Steps 1 & 2)
// This schema combines Client Details and Contract Details for the multi-step form
export const addClientCombinedSchema = z
  .object({
    // Step 1: Client Details
    clientReferenceId: z
      .string()
      .trim()
      .min(1, 'Required field')
      .max(50, 'Cannot be more than 50 characters')
      .regex(/^[a-zA-Z0-9 ]+$/, 'Only letters, numbers, and spaces are allowed'),
    clientId: z.string().optional(),
    clientName: z
      .string()
      .trim()
      .min(1, 'Required field')
      .max(255, 'Cannot be more than 255 characters')
      .regex(/^[a-zA-Z0-9 ]+$/, 'Only letters, numbers, and spaces are allowed'),

    addresses: z.array(clientDetailsAddressSchema).min(1, 'At least one address is required'),

    // Step 2: Contract Details - Contract Information
    clientContractId: z
      .string()
      .trim()
      .regex(/^[a-zA-Z0-9 ]*$/, 'Only letters, numbers, and spaces are allowed')
      .max(50, 'Cannot be more than 50 characters')
      .optional(),
    effectiveDate: z.string().min(1, 'Required field'),
    terminationDate: z.string().optional(),
    contractTerm: z
      .string()
      .trim()
      // .regex(/^[a-zA-Z0-9]+$/, 'Only letters and numbers are allowed')
      .max(50, 'Cannot be more than 50 characters')
      .optional(),
    clientMembership: z.string().trim().max(100, 'Cannot be more than 100 characters').optional(),
    clientDoaSignor: z.string().trim().max(50, 'Cannot be more than 50 characters').optional(),
    contractingLegalEntityOptumRx: z.string().trim().max(100, 'Cannot be more than 100 characters').optional(),
    contractingLegalEntityClient: z.string().trim().max(100, 'Cannot be more than 100 characters').optional(),
    assignedTo: z
      .string()
      .trim()
      .regex(/^[a-zA-Z0-9 ]*$/, 'Only letters, numbers, and spaces are allowed')
      .max(50, 'Cannot be more than 50 characters')
      .optional(),
    runOffEffectiveDate: z.string().max(50, 'Cannot be more than 50 characters').optional(),
    // Step 2: Contract Details - Billing Attributes
    invoiceBreakout: z.string().min(1, 'Required field').max(50, 'Cannot be more than 50 characters'),
    claimInvoiceFrequency: z.string().min(1, 'Required field').max(50, 'Cannot be more than 50 characters'),
    feeInvoiceFrequency: z.string().min(1, 'Required field').max(50, 'Cannot be more than 50 characters'),
    invoiceAggregationLevel: z.string().min(1, 'Required field').max(50, 'Cannot be more than 50 characters'),
    invoiceType: z.string().min(1, 'Required field').max(50, 'Cannot be more than 50 characters'),
    invoicingClaimQuantityCounts: z.string().max(50, 'Cannot be more than 50 characters').optional(),
    deliveryOption: z.string().min(1, 'Required field').max(50, 'Cannot be more than 50 characters'),
    supportDocumentVersion: z.string().min(1, 'Required field').max(50, 'Cannot be more than 50 characters'),
    claimInvoicePaymentTerm: z.string().max(50, 'Cannot be more than 50 characters').optional(),
    feeInvoicePaymentTerm: z.string().max(50, 'Cannot be more than 50 characters').optional(),
    paymentMethod: z.string().max(50, 'Cannot be more than 50 characters').optional(),

    // Step 2: Contract Details - Autopay Information (conditionally required)
    bankAccountType: z
      .string()
      .trim()
      .regex(/^[a-zA-Z ]*$/, 'Only letters and spaces are allowed')
      .optional(),
    routingNumber: z
      .string()
      .trim()
      .regex(/^[a-zA-Z0-9]*$/, 'Only letters and numbers are allowed')
      .max(50, 'Cannot be more than 50 characters')
      .optional(),
    accountNumber: z
      .string()
      .trim()
      .regex(/^[a-zA-Z0-9]*$/, 'Only letters and numbers are allowed')
      .max(50, 'Cannot be more than 50 characters')
      .optional(),

    // Step 2: Contract Details - Suppressions
    addSuppressions: z.boolean().default(false),
    suppressions: z.array(suppressionEntrySchema).optional(),

    // Step 3: Contacts & Access
    contacts: z.array(contactSchema).min(1, 'At least one contact is required'),

    // Step 4: Operational Units (Requirements 5.1, 8.4)
    operationalUnits: z.array(operationalUnitSchema).min(1, 'At least one operational unit is required')
  })
  .refine(
    (data) => {
      if (!data.terminationDate) return true;
      return new Date(data.effectiveDate) <= new Date(data.terminationDate);
    },
    {
      message: 'Termination date must be after or equal to effective date',
      path: ['terminationDate']
    }
  )
  .superRefine((data, ctx: z.RefinementCtx) => {
    // Conditional validation for autopay fields when payment method is ACH
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (data.paymentMethod === 'ACH') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      if (!data.bankAccountType || data.bankAccountType.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required field',
          path: ['bankAccountType']
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      if (!data.routingNumber || data.routingNumber.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required field',
          path: ['routingNumber']
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      if (!data.accountNumber || data.accountNumber.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required field',
          path: ['accountNumber']
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    }
  });

// Type for Combined Add Client Form data
export type AddClientCombinedFormData = z.infer<typeof addClientCombinedSchema>;

// Re-export default values from default-values.ts
export {
  defaultAddressData,
  defaultContactData,
  defaultContactsAccessData,
  defaultOperationalUnitAddressData,
  defaultOperationalUnitData,
  defaultFormData,
  defaultClientDetailsStepData,
  defaultContractDetailsStepData,
  defaultAddClientCombinedData
} from './default-values';
