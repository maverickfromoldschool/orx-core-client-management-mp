/**
 * Zod Validation Schema for Product Variant Assignment
 *
 * This schema validates form data for creating and editing variant assignments.
 * It ensures data integrity and provides clear validation error messages.
 *
 * Requirements validated:
 * - 6.1: variantField validation (string, required, min 1, max 255)
 * - 6.2: defaultValue validation (string, optional, max 255)
 * - 6.3: dataType validation (string, optional, max 100)
 * - 6.4: priorityOrder validation (string | number, required, positive)
 * - 6.5: variantValues validation (array of objects)
 * - 6.6: transactionProcessing and priceDetermination (boolean, default false)
 * - 6.9: Date range validation (startDate <= endDate)
 * - 6.10: Date format validation (ISO 8601)
 * - 6.11: Variant field trimming and non-empty validation
 * - 6.12: Priority order numeric validation
 */

import {z} from 'zod';

/**
 * ISO 8601 date string regex pattern
 * Matches formats: YYYY-MM-DD, YYYY-MM-DDTHH:mm:ss, YYYY-MM-DDTHH:mm:ss.sssZ
 */
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/;

/**
 * Variant value schema for table display
 */
const variantValueSchema = z.object({
  value: z.string().min(1, 'Value is required').max(255, 'Value must be 255 characters or less'),
  description: z.string().min(1, 'Description is required').max(500, 'Description must be 500 characters or less')
});

/**
 * Zod schema for variant assignment form data
 *
 * Validates all fields according to requirements:
 * - variantField: Required, non-empty after trim, max 255 characters
 * - defaultValue: Optional, max 255 characters
 * - dataType: Optional, max 100 characters
 * - priorityOrder: Required, positive integer (string or number)
 * - variantValues: Array of variant value objects
 * - transactionProcessing: Boolean, default false
 * - priceDetermination: Boolean, default false
 * - startDate: Required valid date
 * - endDate: Optional valid date or null
 * - Date range: If both dates provided, startDate must be <= endDate
 */
export const variantAssignmentSchema = z
  .object({
    variantField: z
      .string()
      .min(1, 'Variant Field is required')
      .max(255, 'Variant Field must be 255 characters or less')
      .trim()
      .refine((val) => val.length > 0, {message: 'Variant Field cannot be empty or whitespace only'}),
    defaultValue: z.string().max(255, 'Default Value must be 255 characters or less').optional().or(z.literal('')),
    dataType: z.string().max(100, 'Data Type must be 100 characters or less').optional().or(z.literal('')),
    priorityOrder: z
      .union([
        z.string().regex(/^\d+$/, 'Priority Order must be a number'),
        z.number().int().positive('Priority Order must be a positive integer')
      ])
      .refine(
        (val) => {
          const num = typeof val === 'string' ? parseInt(val, 10) : val;
          return num > 0;
        },
        {message: 'Priority Order must be greater than 0'}
      ),
    variantValues: z.array(variantValueSchema),
    transactionProcessing: z.boolean(),
    priceDetermination: z.boolean(),
    startDate: z
      .string()
      .regex(ISO_DATE_REGEX, 'Invalid date format. Expected ISO 8601 format (YYYY-MM-DD)')
      .refine(
        (dateStr) => {
          const date = new Date(dateStr);
          return !Number.isNaN(date.getTime());
        },
        {message: 'Invalid date value'}
      ),
    endDate: z
      .string()
      .regex(ISO_DATE_REGEX, 'Invalid date format. Expected ISO 8601 format (YYYY-MM-DD)')
      .refine(
        (dateStr) => {
          const date = new Date(dateStr);
          return !Number.isNaN(date.getTime());
        },
        {message: 'Invalid date value'}
      )
      .optional()
      .or(z.literal(''))
  })
  .refine(
    (data) => {
      // Date range validation: startDate <= endDate
      if (data.startDate && data.endDate) {
        const start = new Date(data.startDate);
        const end = new Date(data.endDate);
        return start <= end;
      }
      return true;
    },
    {
      message: 'Start Date must be before or equal to End Date',
      path: ['endDate'] // Error will be associated with endDate field
    }
  );

/**
 * TypeScript type inferred from the Zod schema
 * This ensures type safety between validation and TypeScript types
 */
export type VariantAssignmentSchemaType = z.infer<typeof variantAssignmentSchema>;
