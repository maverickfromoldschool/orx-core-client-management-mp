import {z} from 'zod';

import {clientDetailsAddressSchema, defaultClientDetailsAddressData} from './address-schemas';

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

// Default values for Client Details Step
export const defaultClientDetailsStepData: ClientDetailsStepFormData = {
  clientReferenceId: '',
  clientId: '',
  clientName: '',

  addresses: [defaultClientDetailsAddressData]
};
