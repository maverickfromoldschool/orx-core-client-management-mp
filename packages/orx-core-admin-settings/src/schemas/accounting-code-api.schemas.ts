import {z} from 'zod';

/**
 * ISO 8601 date string validation
 */
const isoDateString = z.string().refine(
  (val) => {
    if (val === null) return true;
    const date = new Date(val);
    return !Number.isNaN(date.getTime());
  },
  {message: 'Invalid ISO 8601 date format'}
);

/**
 * Accounting code entry schema
 */
export const accountingCodeEntrySchema = z.object({
  accountingCode: z.string().min(1, 'Accounting code is required'),
  effectiveDate: isoDateString,
  expiryDate: z.union([isoDateString, z.null()]),
  glAccountNumber: z.string().min(1, 'GL account number is required'),
  createdBy: z.string().optional(),
  modifiedBy: z.string().optional(),
  createdDate: z.union([isoDateString, z.null()]).optional(),
  modifiedDate: z.union([isoDateString, z.null()]).optional(),
  version: z.number().optional()
});

/**
 * Create accounting code request schema
 */
export const createAccountingCodeRequestSchema = z.object({
  accountingCode: z
    .string()
    .min(1, 'Accounting code is required')
    .max(30, 'Accounting code must be 30 characters or less'),
  accountingCodeEntries: z.array(accountingCodeEntrySchema).min(1, 'At least one accounting code entry is required'),
  description: z.string().min(1, 'Description is required').max(254, 'Description must be 254 characters or less'),
  notes: z.string().max(1000, 'Notes must be 1000 characters or less').optional(),
  glAccountType: z.string().min(1, 'GL account type is required'),
  glAccountName: z
    .string()
    .min(1, 'GL account name is required')
    .max(254, 'GL account name must be 254 characters or less'),
  glRulePlugin: z.string().optional(),
  displaySequence: z.string().regex(/^\d+$/, 'Display sequence must be a numeric string'),
  glAccountNumber: z.string().min(1, 'GL account number is required'),
  glAccountTypeDescription: z.string().optional(),
  glAccountGroup: z
    .string()
    .min(1, 'GL account group is required')
    .max(3, 'GL account group must be 3 characters or less')
});

/**
 * Created accounting code schema
 */
export const createdAccountingCodeSchema = z.object({
  createdBy: z.string(),
  modifiedBy: z.string(),
  createdDate: z.union([isoDateString, z.null()]),
  modifiedDate: z.union([isoDateString, z.null()]),
  version: z.number(),
  accountingCode: z.string(),
  description: z.string(),
  notes: z.string(),
  glAccountType: z.string(),
  glAccountName: z.string(),
  glRulePlugin: z.string(),
  displaySequence: z.number(),
  glAccountNumber: z.string(),
  glAccountTypeDescription: z.union([z.string(), z.null()]),
  glAccountGroup: z.string(),
  accountingCodeEntries: z.array(accountingCodeEntrySchema)
});

/**
 * Create accounting code response schema
 */
export const createAccountingCodeResponseSchema = z.object({
  success: z.boolean(),
  data: createdAccountingCodeSchema,
  message: z.string()
});

/**
 * Get accounting code response schema
 */
export const getAccountingCodeResponseSchema = z.object({
  success: z.boolean(),
  data: createdAccountingCodeSchema,
  message: z.string()
});

/**
 * Accounting code list item schema (without entries)
 */
export const accountingCodeListItemSchema = z.object({
  createdBy: z.string(),
  modifiedBy: z.string(),
  createdDate: z.union([isoDateString, z.null()]),
  modifiedDate: z.union([isoDateString, z.null()]),
  version: z.number(),
  accountingCode: z.string(),
  description: z.string(),
  notes: z.string(),
  glAccountType: z.string(),
  glAccountName: z.string(),
  glRulePlugin: z.string(),
  displaySequence: z.number(),
  glAccountNumber: z.string(),
  glAccountTypeDescription: z.union([z.string(), z.null()]),
  glAccountGroup: z.string(),
  accountingCodeEntries: z.null()
});

/**
 * Paginated data schema
 */
export const paginatedDataSchema = z.object({
  totalPages: z.number(),
  currentPage: z.number(),
  totalRecord: z.number(),
  data: z.array(accountingCodeListItemSchema)
});

/**
 * Get accounting codes list response schema
 */
export const getAccountingCodesListResponseSchema = z.object({
  success: z.boolean(),
  data: paginatedDataSchema,
  message: z.string()
});

/**
 * Update accounting code request schema
 */
export const updateAccountingCodeRequestSchema = z.object({
  accountingCode: z
    .string()
    .min(1, 'Accounting code is required')
    .max(30, 'Accounting code must be 30 characters or less'),
  accountingCodeEntries: z.array(accountingCodeEntrySchema).min(1, 'At least one accounting code entry is required'),
  description: z.string().min(1, 'Description is required').max(254, 'Description must be 254 characters or less'),
  notes: z.string().max(1000, 'Notes must be 1000 characters or less').optional(),
  glAccountType: z.string().min(1, 'GL account type is required'),
  glAccountName: z
    .string()
    .min(1, 'GL account name is required')
    .max(254, 'GL account name must be 254 characters or less'),
  glRulePlugin: z.string().optional(),
  displaySequence: z.string().regex(/^\d+$/, 'Display sequence must be a numeric string'),
  glAccountNumber: z.string().min(1, 'GL account number is required'),
  glAccountTypeDescription: z.string().optional(),
  glAccountGroup: z
    .string()
    .min(1, 'GL account group is required')
    .max(3, 'GL account group must be 3 characters or less')
});

/**
 * Updated accounting code schema
 */
export const updatedAccountingCodeSchema = z.object({
  createdBy: z.string(),
  modifiedBy: z.string(),
  createdDate: z.union([isoDateString, z.null()]),
  modifiedDate: z.union([isoDateString, z.null()]),
  version: z.number(),
  accountingCode: z.string(),
  description: z.string(),
  notes: z.string(),
  glAccountType: z.string(),
  glAccountName: z.string(),
  glRulePlugin: z.string(),
  displaySequence: z.number(),
  glAccountNumber: z.string(),
  glAccountTypeDescription: z.union([z.string(), z.null()]),
  glAccountGroup: z.string(),
  accountingCodeEntries: z.array(accountingCodeEntrySchema)
});

/**
 * Update accounting code response schema
 */
export const updateAccountingCodeResponseSchema = z.object({
  success: z.boolean(),
  data: updatedAccountingCodeSchema,
  message: z.string()
});

/**
 * Type inference from schemas
 */
export type AccountingCodeEntry = z.infer<typeof accountingCodeEntrySchema>;
export type AccountingCodeListItem = z.infer<typeof accountingCodeListItemSchema>;
export type PaginatedData = z.infer<typeof paginatedDataSchema>;
export type GetAccountingCodesListResponse = z.infer<typeof getAccountingCodesListResponseSchema>;
export type CreateAccountingCodeRequest = z.infer<typeof createAccountingCodeRequestSchema>;
export type CreatedAccountingCode = z.infer<typeof createdAccountingCodeSchema>;
export type CreateAccountingCodeResponse = z.infer<typeof createAccountingCodeResponseSchema>;
export type GetAccountingCodeResponse = z.infer<typeof getAccountingCodeResponseSchema>;
export type UpdateAccountingCodeRequest = z.infer<typeof updateAccountingCodeRequestSchema>;
export type UpdatedAccountingCode = z.infer<typeof updatedAccountingCodeSchema>;
export type UpdateAccountingCodeResponse = z.infer<typeof updateAccountingCodeResponseSchema>;
