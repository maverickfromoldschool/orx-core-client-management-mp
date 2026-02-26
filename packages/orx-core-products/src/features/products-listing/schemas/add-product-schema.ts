import {z} from 'zod';

/**
 * Validation schema for Add Product form
 * Uses Zod for runtime type validation
 */
export const addProductSchema = z.object({
  productCode: z.string().min(1, 'Product code is required'),
  productGroup: z.string().min(1, 'Product group is required'),
  productName: z.string().min(1, 'Product name is required'),
  baseUom: z.string().min(1, 'Base UOM is required'),
  productType: z.string().min(1, 'Product type is required'),
  bundleClass: z.string().optional(),
  accountingCode: z.string().optional(),
  chargeType: z.string().min(1, 'Charge type is required'),
  effectiveDate: z.string().min(1, 'Effective date is required')
});

export type AddProductSchemaType = z.infer<typeof addProductSchema>;
