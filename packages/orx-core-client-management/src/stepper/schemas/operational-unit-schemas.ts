import {z} from 'zod';

import {operationalUnitAddressSchema, defaultOperationalUnitAddressData} from './address-schemas';
import {billingAttributesOverrideSchema} from './add-client-schema';

// Suppression Entry schema for Operational Units (Step 4)
// Requirements: 6.3-6.5
export const operationalUnitSuppressionEntrySchema = z
  .object({
    suppressionType: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional()
  })
  .superRefine((data, ctx) => {
    if (
      data.startDate &&
      data.endDate &&
      !Number.isNaN(new Date(data.startDate).getTime()) &&
      !Number.isNaN(new Date(data.endDate).getTime()) &&
      new Date(data.startDate) > new Date(data.endDate)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Suppression start date must be before or equal to end date',
        path: ['suppressionStartDate']
      });
    }
  });

// Operational Unit schema
// Requirements: 2.1-2.10, 8.2-8.5
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
  billingAttributesOverride: billingAttributesOverrideSchema,

  // Suppressions (Requirements 6.1-6.11)
  addSuppressions: z.boolean().optional(),
  suppressions: z.array(operationalUnitSuppressionEntrySchema).optional()
});

// Type exports
export type OperationalUnitData = z.infer<typeof operationalUnitSchema>;
export type BillingAttributesOverrideData = z.infer<typeof billingAttributesOverrideSchema>;

// Default values for Operational Unit (Step 4)
// Requirements: 7.1
export const defaultOperationalUnitData: OperationalUnitData = {
  name: '',
  id: '',
  lobNumeric: '',
  lineOfBusiness: '',
  marketSegment: '',
  mrPlanType: '',
  mrGroupIndividual: '',
  mrClassification: '',
  passThroughTraditional: '',
  assignedContacts: [],
  addresses: [defaultOperationalUnitAddressData],
  billingAttributesOverride: undefined,
  addSuppressions: false,
  suppressions: []
};
