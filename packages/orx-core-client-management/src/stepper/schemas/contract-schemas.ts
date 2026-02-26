import {z} from 'zod';

import {suppressionEntrySchema} from './add-client-schema';

// Contract Details Step Schema (Step 2)
// Requirements: 2.1-2.13, 3.1-3.13, 4.5-4.8, 6.1-6.6
export const contractDetailsStepSchema = z
  .object({
    // Contract Information (Requirements 2.1-2.11)
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
    // Billing Attributes (Requirements 3.1-3.15)
    // invoiceBreakout: z.string().min(1, 'Required field').max(50, 'Cannot be more than 50 characters'),
    invoiceBreakout: z.string().max(50, 'Cannot be more than 50 characters').optional(),
    claimInvoiceFrequency: z.string().min(1, 'Required field').max(50, 'Cannot be more than 50 characters'),
    feeInvoiceFrequency: z.string().min(1, 'Required field').max(50, 'Cannot be more than 50 characters'),
    invoiceAggregationLevel: z.string().min(1, 'Required field').max(50, 'Cannot be more than 50 characters'),
    invoiceType: z.string().min(1, 'Required field').max(50, 'Cannot be more than 50 characters'),
    invoicingClaimQuantityCounts: z.string().max(50, 'Cannot be more than 50 characters').optional(),
    deliveryOption: z.string().min(1, 'Required field').max(50, 'Cannot be more than 50 characters'),
    supportDocumentVersion: z.string().min(1, 'Required field').max(50, 'Cannot be more than 50 characters'),
    invoiceStaticData: z.string().max(50, 'Cannot be more than 50 characters').optional(), // Requirements 3.11
    feeInvoicePaymentTerm: z.string().max(50, 'Cannot be more than 50 characters').optional(), // Requirements 3.12 - dropdown
    feeInvoicePaymentTermDayType: z.string().max(50, 'Cannot be more than 50 characters').optional(), // Requirements 3.13
    claimInvoicePaymentTerm: z.string().max(50, 'Cannot be more than 50 characters').optional(), // Requirements 3.14 - dropdown
    claimInvoicePaymentTermDayType: z.string().max(50, 'Cannot be more than 50 characters').optional(), // Requirements 3.15
    paymentMethod: z.string().max(50, 'Cannot be more than 50 characters').optional(),

    // Autopay Information (Requirements 4.5-4.8) - conditionally required
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

    // Suppressions (Requirements 5.1-5.6)
    addSuppressions: z.boolean().default(false),
    suppressions: z.array(suppressionEntrySchema).default([])
  })
  .superRefine((data, ctx) => {
    // Custom validation: effectiveDate must be <= terminationDate if both are present
    if (
      data.effectiveDate &&
      data.terminationDate &&
      !Number.isNaN(new Date(data.effectiveDate).getTime()) &&
      !Number.isNaN(new Date(data.terminationDate).getTime()) &&
      new Date(data.effectiveDate) > new Date(data.terminationDate)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Effective date must be before or equal to Termination date',
        path: ['effectiveDate']
      });
    }
  });

// Contract Details Step Schema with conditional autopay validation (Requirements 6.5)
// Note: This is commented out as it's defined in add-client-schema.ts (legacy)
// If needed in the future for modular use, uncomment and remove from add-client-schema.ts
// export const contractDetailsStepSchemaWithAutopay = contractDetailsStepSchema.superRefine(
//   (data, ctx: z.RefinementCtx) => {
//     if (data.paymentMethod === 'ach') {
//       if (!data.bankAccountType || data.bankAccountType.trim() === '') {
//         ctx.addIssue({
//           code: 'custom',
//           message: 'Required field',
//           path: ['bankAccountType']
//         });
//       }
//       if (!data.routingNumber || data.routingNumber.trim() === '') {
//         ctx.addIssue({
//           code: 'custom',
//           message: 'Required field',
//           path: ['routingNumber']
//         });
//       }
//       if (!data.accountNumber || data.accountNumber.trim() === '') {
//         ctx.addIssue({
//           code: 'custom',
//           message: 'Required field',
//           path: ['accountNumber']
//         });
//       }
//       if (!data.accountHolderName || data.accountHolderName.trim() === '') {
//         ctx.addIssue({
//           code: 'custom',
//           message: 'Required field',
//           path: ['accountHolderName']
//         });
//       }
//     }
//   }
// );

// Type exports
export type ContractDetailsStepFormData = z.infer<typeof contractDetailsStepSchema>;

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
};
