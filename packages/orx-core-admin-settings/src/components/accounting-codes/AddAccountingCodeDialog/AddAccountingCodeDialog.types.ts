import {z} from 'zod';

// GL Account Number entry schema
export const glAccountNumberSchema = z.object({
  glAccountNumber: z.string().min(1, 'GL Account Number is required'),
  effectiveDate: z.date({message: 'Effective Date is required'}),
  expirationDate: z.date().optional()
});

export type GLAccountNumberEntry = z.infer<typeof glAccountNumberSchema>;

// Main form schema
export const addAccountingCodeSchema = z.object({
  accountingCode: z
    .string()
    .min(1, 'Accounting Code is required')
    .max(30, 'Accounting Code must be 30 characters or less'),
  name: z.string().min(1, 'Name is required').max(50, 'Name must be 50 characters or less'),
  glAccountType: z.string().min(1, 'GL Account Type is required'),
  glAccountName: z
    .string()
    .min(1, 'GL Account Name is required')
    .max(254, 'GL Account Name must be 254 characters or less'),
  displaySequence: z.number().min(1, 'Display Sequence must be at least 1'),
  glAccountGroup: z
    .string()
    .min(1, 'GL Account Group is required')
    .max(3, 'GL Account Group must be 3 characters or less'),
  glAccountingKeyPlugin: z.string().optional(),
  glAccountNumbers: z.array(glAccountNumberSchema).optional(),
  notes: z.string().max(1000, 'Notes must be 1000 characters or less').optional()
});

export type AddAccountingCodeFormData = z.infer<typeof addAccountingCodeSchema>;

export interface AddAccountingCodeDialogProps {
  /**
   * Whether the dialog is open
   */
  open: boolean;

  /**
   * Callback when dialog is closed
   */
  onClose: () => void;

  /**
   * Callback when form is submitted successfully
   */
  onSubmit: (data: AddAccountingCodeFormData) => void | Promise<void>;

  /**
   * Initial data for editing (optional)
   */
  initialData?: Partial<AddAccountingCodeFormData>;

  /**
   * Loading state during submission
   */
  loading?: boolean;

  /**
   * Available GL Account Types for dropdown
   */
  glAccountTypes?: {value: string; label: string}[];

  /**
   * Available GL Account Groups for dropdown
   */
  glAccountGroups?: {value: string; label: string}[];

  /**
   * Available GL Accounting Key Plugins for dropdown
   */
  glAccountingKeyPlugins?: {value: string; label: string}[];
}
