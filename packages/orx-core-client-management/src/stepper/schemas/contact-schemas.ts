import {z} from 'zod';

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
  email: z
    .string()
    .trim()
    .min(1, 'Required field')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email'),
  status: z
    .string()
    .trim()
    .max(50, 'Cannot be more than 50 characters')
    .refine((val) => !val || /^[a-zA-Z ]+$/.test(val), {
      message: 'Only letters and spaces are allowed'
    })
    .optional(),
  sendEmailNotification: z.boolean().default(false)
});

// Contacts & Access Step Schema (Step 3)
export const contactsAccessSchema = z.object({
  contacts: z.array(contactSchema).min(1, 'At least one contact is required')
});

// Type exports
export type Contact = z.infer<typeof contactSchema>;
export type ContactsAccessFormData = z.infer<typeof contactsAccessSchema>;

// Legacy type alias for backward compatibility
export type ContactData = Contact;

// Default values
export const defaultContactData: Contact = {
  contactType: '',
  firstName: '',
  lastName: '',
  email: '',
  status: '',
  sendEmailNotification: false
};

export const defaultContactsAccessData: ContactsAccessFormData = {
  contacts: [defaultContactData]
};
