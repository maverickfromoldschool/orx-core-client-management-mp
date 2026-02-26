import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useCallback, useEffect} from 'react';

import {variantAssignmentSchema, VariantAssignmentSchemaType} from '../schemas/variant-assignment-schema';
import {VariantAssignmentFormData} from '../types';

/**
 * Hook for managing variant assignment form state and validation
 *
 * This hook integrates React Hook Form with Zod validation schema to provide
 * comprehensive form management including validation, submission, and error handling.
 * It supports both create and edit modes with pre-populated data.
 *
 * Requirements:
 * - 4.1: Open form dialog for creating new variant assignment
 * - 4.2: Require assignedProductVariant field
 * - 4.3: Allow setting boolean values (predefinedList, transactionProcessing, priceDetermination)
 * - 4.4: Allow specifying start and end dates
 * - 4.5: Save valid assignment and refresh table
 * - 4.6: Display validation errors and prevent invalid submission
 * - 5.1: Pre-populate form with existing data in edit mode
 * - 5.2: Allow modification of all editable fields
 * - 5.3: Update assignment and refresh table on valid save
 * - 5.4: Close dialog without saving on cancel
 * - 5.5: Display validation errors and prevent invalid submission
 */

export interface UseVariantAssignmentFormOptions {
  /**
   * Form mode: 'create' for new assignments, 'edit' for existing ones
   */
  mode: 'create' | 'edit';

  /**
   * Initial values for the form (used in edit mode)
   * Requirement 5.1: Pre-populate form with existing data
   */
  initialValues?: Partial<VariantAssignmentFormData>;

  /**
   * Callback invoked when form is successfully submitted
   * Requirement 4.5, 5.3: Save/update assignment
   */
  onSubmit: (data: VariantAssignmentFormData) => Promise<void>;

  /**
   * Callback invoked when form is cancelled
   * Requirement 5.4: Close dialog without saving
   */
  onCancel?: () => void;
}

/**
 * Default form values for create mode
 */
const DEFAULT_FORM_VALUES: VariantAssignmentFormData = {
  transactionProcessing: false,
  priceDetermination: false,
  startDate: '',
  endDate: '',
  variantField: '',
  priorityOrder: '',
  variantValues: []
};

/**
 * Custom hook for managing variant assignment form
 *
 * @param options - Configuration options for the form
 * @returns Form state, methods, and validation utilities
 */
export const useVariantAssignmentForm = (options: UseVariantAssignmentFormOptions) => {
  const {mode, initialValues, onSubmit, onCancel} = options;

  // Merge default values with initial values for edit mode
  const formDefaultValues = {
    ...DEFAULT_FORM_VALUES,
    ...(mode === 'edit' && initialValues ? initialValues : {})
  };

  // Initialize React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting, isDirty, isValid, touchedFields},
    reset,
    setValue,
    getValues,
    watch,
    control,
    trigger,
    clearErrors,
    setError
  } = useForm<VariantAssignmentSchemaType>({
    resolver: zodResolver(variantAssignmentSchema),
    defaultValues: formDefaultValues,
    mode: 'onChange' // Validate on change for immediate feedback
  });

  /**
   * Reset form to initial values when mode or initialValues change
   * This ensures the form is properly initialized when switching between create/edit
   */
  useEffect(() => {
    reset(formDefaultValues);
  }, [mode, initialValues, reset, formDefaultValues]);

  /**
   * Handle form submission with error handling
   * Requirements 4.5, 4.6, 5.3, 5.5: Submit valid data, prevent invalid submission
   */
  const handleFormSubmit = handleSubmit(async (data: VariantAssignmentSchemaType) => {
    try {
      // Convert schema type to form data type for submission
      const formData: VariantAssignmentFormData = {
        transactionProcessing: data.transactionProcessing,
        priceDetermination: data.priceDetermination,
        startDate: data.startDate ?? undefined,
        endDate: data.endDate ?? undefined,
        variantField: data.variantField ?? undefined,
        priorityOrder: data.priorityOrder ?? undefined,
        variantValues: data.variantValues ?? []
      };
      await onSubmit(formData);
      // Reset form after successful submission
      reset(DEFAULT_FORM_VALUES);
    } catch (error) {
      // Error handling is delegated to the parent component
      // The parent can display error messages via toast/notification
      console.error('Form submission error:', error);
      throw error;
    }
  });

  /**
   * Handle form cancellation
   * Requirement 5.4: Close dialog without saving
   */
  const handleCancel = useCallback(() => {
    reset(formDefaultValues);
    onCancel?.();
  }, [onCancel, reset, formDefaultValues]);

  /**
   * Reset form to default or initial values
   */
  const resetForm = useCallback(() => {
    reset(formDefaultValues);
  }, [reset, formDefaultValues]);

  /**
   * Set a specific field value programmatically
   * Requirement 5.2: Allow modification of all editable fields
   */
  const setFieldValue = useCallback(
    (field: keyof VariantAssignmentFormData, value: any) => {
      setValue(field as any, value, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true
      });
    },
    [setValue]
  );

  /**
   * Get a specific field value
   */
  const getFieldValue = useCallback(
    (field: keyof VariantAssignmentFormData): any => {
      return getValues(field as any);
    },
    [getValues]
  );

  /**
   * Manually trigger validation for a specific field or all fields
   */
  const validateField = useCallback(
    async (field?: keyof VariantAssignmentFormData) => {
      if (field) {
        return await trigger(field);
      }
      return await trigger();
    },
    [trigger]
  );

  /**
   * Clear errors for a specific field or all fields
   */
  const clearFieldErrors = useCallback(
    (field?: keyof VariantAssignmentFormData) => {
      if (field) {
        clearErrors(field);
      } else {
        clearErrors();
      }
    },
    [clearErrors]
  );

  /**
   * Set a custom error for a specific field
   */
  const setFieldError = useCallback(
    (field: keyof VariantAssignmentFormData, message: string) => {
      setError(field, {
        type: 'manual',
        message
      });
    },
    [setError]
  );

  /**
   * Check if a specific field has been touched
   */
  const isFieldTouched = useCallback(
    (field: keyof VariantAssignmentFormData): boolean => {
      return !!touchedFields[field];
    },
    [touchedFields]
  );

  /**
   * Check if a specific field has an error
   */
  const hasFieldError = useCallback(
    (field: keyof VariantAssignmentFormData): boolean => {
      return !!errors[field];
    },
    [errors]
  );

  /**
   * Get error message for a specific field
   */
  const getFieldError = useCallback(
    (field: keyof VariantAssignmentFormData): string | undefined => {
      return errors[field]?.message;
    },
    [errors]
  );

  return {
    // Form registration and control
    register,
    control,

    // Form state
    errors,
    isSubmitting,
    isDirty,
    isValid,
    touchedFields,

    // Form methods
    handleSubmit: handleFormSubmit,
    handleCancel,
    reset: resetForm,

    // Field-level operations
    setValue: setFieldValue,
    getValue: getFieldValue,
    watch,

    // Validation operations
    validate: validateField,
    clearErrors: clearFieldErrors,
    setError: setFieldError,

    // Utility methods
    isFieldTouched,
    hasFieldError,
    getFieldError,

    // Computed state
    canSubmit: isValid && !isSubmitting,
    hasErrors: Object.keys(errors).length > 0
  };
};
