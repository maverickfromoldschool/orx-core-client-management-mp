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

// Type exports
export type AddressData = z.infer<typeof addressSchema>;
export type ClientDetailsAddressData = z.infer<typeof clientDetailsAddressSchema>;
export type OperationalUnitAddressData = z.infer<typeof operationalUnitAddressSchema>;

// Default values
export const defaultAddressData: AddressData = {
  addressType: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  zip: ''
};

export const defaultClientDetailsAddressData: ClientDetailsAddressData = {
  addressType: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  zip: ''
};

export const defaultOperationalUnitAddressData: OperationalUnitAddressData = {
  addressType: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  zip: ''
};
