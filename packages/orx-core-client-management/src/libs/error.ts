import {z} from 'zod';

export const validationErrorDetailSchema = z.object({
  field: z.string(),
  message: z.string()
});

export const apiErrorDetailsSchema = z.object({
  success: z.boolean(),
  timestamp: z.string(),
  traceId: z.string(),
  message: z.string(),
  errorCode: z.string(),
  details: z.array(validationErrorDetailSchema).optional(),
  path: z.string().optional()
});

export const apiErrorSchema = z.object({
  message: z.string(),
  code: z.string(),
  details: apiErrorDetailsSchema.optional()
});

export type ValidationErrorDetail = z.infer<typeof validationErrorDetailSchema>;
export type ApiErrorDetails = z.infer<typeof apiErrorDetailsSchema>;
export type ApiError = z.infer<typeof apiErrorSchema>;

// Helper function to safely parse API errors
export function parseApiError(error: unknown): ApiError | null {
  const result = apiErrorSchema.safeParse(error);
  return result.success ? result.data : null;
}

// Helper to check if it's a validation error
export function isValidationError(error: unknown): error is ApiError & {
  details: ApiErrorDetails & {errorCode: 'VALIDATION_ERROR'; details: ValidationErrorDetail[]};
} {
  const parsed = parseApiError(error);
  return parsed !== null && parsed.details?.errorCode === 'VALIDATION_ERROR' && Array.isArray(parsed.details.details);
}

// Map API field paths to UI form field paths
export function mapApiFieldToFormField(apiField: string): string {
  // API uses different structure than UI form
  // Examples:
  // API: "clientDetails.addresses[0].zip" -> UI: "clientDetails.addresses.0.zip"
  // API: "contactsAndAccesses.contacts[0].status" -> UI: "contacts.0.status"
  // API: "operationalUnits.operationalUnits[0].billingAddress.zip" -> UI: "operationalUnits.0.addresses.0.zip"

  let formField = apiField;

  // Handle contactsAndAccesses -> contacts
  formField = formField.replace(/^contactsAndAccesses\.contacts/, 'contacts');

  // Handle operationalUnits.operationalUnits -> operationalUnits
  formField = formField.replace(/^operationalUnits\.operationalUnits/, 'operationalUnits');

  // Handle billingAddress -> addresses (for operational units)
  formField = formField.replace(/\.billingAddress\./, '.addresses.0.');

  // Convert array notation from [0] to .0
  formField = formField.replace(/\[(\d+)\]/g, '.$1');

  return formField;
}

// Determine which step contains the field
export function getStepForField(apiField: string): number {
  if (apiField.startsWith('clientDetails')) {
    return 0; // Client Details
  }
  if (apiField.startsWith('contractDetails')) {
    return 1; // Contract Details
  }
  if (apiField.startsWith('contactsAndAccesses')) {
    return 2; // Contacts & Access
  }
  if (apiField.startsWith('operationalUnits')) {
    return 3; // Operational Units
  }
  return -1; // Unknown
}
