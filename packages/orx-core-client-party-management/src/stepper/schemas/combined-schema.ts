import {z} from 'zod';

import {clientDetailsAddressSchema, defaultClientDetailsAddressData} from './address-schemas';
import {contactSchema, defaultContactData} from './contact-schemas';
import {operationalUnitSchema, defaultOperationalUnitData} from './operational-unit-schemas';
import {suppressionEntrySchema} from './add-client-schema';

// Combined Add Client Form Schema (Steps 1 & 2)
// This schema combines Client Details and Contract Details for the multi-step form
export const addClientCombinedSchema = z
  .object({
    draftId: z.string().optional().nullable(),

    // Step 1: Client Details
    clientDetails: z.object({
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
      clientStatus: z.string().optional(),

      addresses: z.array(clientDetailsAddressSchema).min(1, 'At least one address is required'),

      // Client Attributes
      runOffDaysMemberClaims: z.string().optional().default(''),
      runOffDaysPharmacy: z.string().optional().default(''),
      source: z.string().optional().default('Manual'),

      // Client Options - Product Overrides
      productOverrides: z
        .array(
          z.object({
            productCode: z.string().trim().min(1, 'Required field').max(100, 'Cannot be more than 100 characters'),
            productDescription: z
              .string()
              .trim()
              .min(1, 'Required field')
              .max(255, 'Cannot be more than 255 characters')
          })
        )
        .default([]),

      runOffDaysByClaimType: z
        .array(
          z.object({
            claimType: z.string().trim().min(1, 'Required field').max(100, 'Cannot be more than 100 characters'),
            runOffDays: z.string().min(1, 'Required field')
          })
        )
        .default([])
    }),

    contractDetails: z.object({
      // Step 2: Contract Details - Contract Information
      clientContractId: z
        .string()
        .trim()
        .regex(/^[a-zA-Z0-9 ]*$/, 'Only letters, numbers, and spaces are allowed')
        .max(50, 'Cannot be more than 50 characters')
        .optional(),
      effectiveDate: z.string().optional(),
      terminationDate: z.string().optional(),
      contractTerm: z
        .string()
        .trim()
        .regex(/^[a-zA-Z0-9 ]*$/, 'Only letters, numbers, and spaces are allowed')
        .max(50, 'Cannot be more than 50 characters')
        .optional(),
      clientMembership: z.string().max(100, 'Cannot be more than 100 characters').optional(),
      clientDoaSignor: z.string().max(50, 'Cannot be more than 50 characters').optional(),
      contractingLegalEntityOptumRx: z.string().max(100, 'Cannot be more than 100 characters').optional(),
      contractingLegalEntityClient: z.string().max(100, 'Cannot be more than 100 characters').optional(),
      assignedTo: z
        .string()
        .trim()
        .regex(/^[a-zA-Z0-9 ]*$/, 'Only letters, numbers, and spaces are allowed')
        .max(50, 'Cannot be more than 50 characters')
        .optional(),
      runOffEffectiveDate: z.string().max(50, 'Cannot be more than 50 characters').optional(),
      // Step 2: Contract Details - Billing Attributes
      billingAttributes: z.object({
        // invoiceBreakout: z.string().min(1, 'Required field').max(50, 'Cannot be more than 50 characters'),
        invoiceBreakout: z.string().max(50, 'Cannot be more than 50 characters').optional(),
        claimInvoiceFrequency: z.string().max(50, 'Cannot be more than 50 characters').optional(),
        feeInvoiceFrequency: z.string().max(50, 'Cannot be more than 50 characters').optional(),
        invoiceAggregationLevel: z.string().max(50, 'Cannot be more than 50 characters').optional(),
        invoiceType: z.string().max(50, 'Cannot be more than 50 characters').optional(),
        invoicingClaimQuantityCounts: z.string().max(50, 'Cannot be more than 50 characters').optional(),
        deliveryOption: z.string().max(50, 'Cannot be more than 50 characters').optional(),
        supportDocumentVersion: z.string().max(50, 'Cannot be more than 50 characters').optional(),
        invoiceStaticData: z.string().max(50, 'Cannot be more than 50 characters').optional(), // Requirements 3.11
        feeInvoicePaymentTerm: z.string().max(50, 'Cannot be more than 50 characters').optional(), // Requirements 3.12 - dropdown
        feeInvoicePaymentTermDayType: z.string().max(50, 'Cannot be more than 50 characters').optional(), // Requirements 3.13
        claimInvoicePaymentTerm: z.string().max(50, 'Cannot be more than 50 characters').optional(), // Requirements 3.14 - dropdown
        claimInvoicePaymentTermDayType: z.string().max(50, 'Cannot be more than 50 characters').optional(), // Requirements 3.15
        paymentMethod: z.string().max(50, 'Cannot be more than 50 characters').optional(),

        // Step 2: Contract Details - Autopay Information (conditionally required)
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

        // Step 2: Contract Details - Suppressions (Requirements 5.1-5.6)
        addSuppressions: z.boolean().optional(),
        suppressions: z.array(suppressionEntrySchema).default([])
      })
    }),

    // Step 3: Contacts & Access
    contacts: z.array(contactSchema).default([]),

    // Step 4: Operational Units (Requirements 5.1, 8.4)
    operationalUnits: z.array(operationalUnitSchema).default([])
  })
  .superRefine((data, ctx) => {
    // Custom validation: effectiveDate must be <= terminationDate if both are present
    if (
      data.contractDetails?.effectiveDate &&
      data.contractDetails?.terminationDate &&
      !Number.isNaN(new Date(data.contractDetails.effectiveDate).getTime()) &&
      !Number.isNaN(new Date(data.contractDetails.terminationDate).getTime()) &&
      new Date(data.contractDetails.effectiveDate) > new Date(data.contractDetails.terminationDate)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Effective date must be before or equal to Termination date',
        path: ['contractDetails', 'effectiveDate']
      });
    }
  });
// .superRefine((data, ctx) => {
//   // Conditional validation for autopay fields when payment method is ACH
//   if (data.paymentMethod === 'ach') {
//     if (!data.bankAccountType || data.bankAccountType.trim() === '') {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: 'Required field',
//         path: ['bankAccountType']
//       });
//     }
//     if (!data.routingNumber || data.routingNumber.trim() === '') {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: 'Required field',
//         path: ['routingNumber']
//       });
//     }
//     if (!data.accountNumber || data.accountNumber.trim() === '') {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: 'Required field',
//         path: ['accountNumber']
//       });
//     }
//     if (!data.accountHolderName || data.accountHolderName.trim() === '') {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: 'Required field',
//         path: ['accountHolderName']
//       });
//     }
//   }
// });

// Type for Combined Add Client Form data
export type AddClientCombinedFormData = z.infer<typeof addClientCombinedSchema>;

// Default values for Combined Add Client Form
export const defaultAddClientCombinedData: AddClientCombinedFormData = {
  draftId: '',
  // Step 1: Client Details
  clientDetails: {
    clientReferenceId: '',
    clientId: '',
    clientName: '',
    clientStatus: '',
    addresses: [defaultClientDetailsAddressData],
    runOffDaysMemberClaims: '',
    runOffDaysPharmacy: '',
    source: 'Manual',
    productOverrides: [],
    runOffDaysByClaimType: []
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
      // invoiceBreakout: '',
      claimInvoiceFrequency: '',
      feeInvoiceFrequency: '',
      invoiceAggregationLevel: '',
      invoiceType: '',
      invoicingClaimQuantityCounts: '',
      deliveryOption: '',
      supportDocumentVersion: '',
      // invoiceStaticData: '',
      feeInvoicePaymentTerm: '',
      // feeInvoicePaymentTermDayType: '',
      claimInvoicePaymentTerm: '',
      // claimInvoicePaymentTermDayType: '',
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

// Legacy export for backward compatibility
export const defaultFormData = defaultAddClientCombinedData;
export type AddClientFormData = AddClientCombinedFormData;
