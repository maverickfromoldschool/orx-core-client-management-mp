import {useCallback} from 'react';
import {type UseFormSetError} from 'react-hook-form';
import {useNotification} from '@optum-rx-core/orx-core-notification';

import {type AddClientCombinedFormData} from '../stepper/schemas';

import {isValidationError, mapApiFieldToFormField, getStepForField} from './error';

export interface UseApiValidationErrorsOptions {
  /**
   * React Hook Form's setError function to set field-level errors
   */
  setError: UseFormSetError<AddClientCombinedFormData>;

  /**
   * Callback to navigate to a specific step when errors are found
   */
  onNavigateToStep?: (stepIndex: number) => void;

  /**
   * Whether to show error notification toast. Default: true
   */
  showNotification?: boolean;
}

export interface ValidationErrorResult {
  /**
   * Whether the error was a validation error
   */
  isValidation: boolean;

  /**
   * Total count of validation errors
   */
  errorCount: number;

  /**
   * The earliest step (0-3) that contains errors, or -1 if no errors
   */
  earliestStep: number;

  /**
   * Map of step index to array of field paths with errors
   */
  fieldsByStep: Record<number, string[]>;

  /**
   * Array of error messages
   */
  errorMessages: string[];
}

/**
 * Custom hook to handle API validation errors and automatically:
 * - Parse validation errors from API responses
 * - Map API field paths to form field paths
 * - Set errors on individual form fields
 * - Navigate to the earliest step with errors
 * - Display error notifications
 *
 * @example
 * ```tsx
 * const { handleApiError } = useApiValidationErrors({
 *   setError,
 *   onNavigateToStep: setCurrentStep
 * });
 *
 * try {
 *   await clientApiService.submitClient(data);
 * } catch (error) {
 *   const result = handleApiError(error);
 *   if (!result.isValidation) {
 *     // Handle non-validation errors
 *   }
 * }
 * ```
 */
export function useApiValidationErrors(options: UseApiValidationErrorsOptions) {
  const {setError, onNavigateToStep, showNotification = true} = options;
  const {showError} = useNotification();

  /**
   * Handle API error and process validation errors
   * @param error - The error object from the API
   * @returns ValidationErrorResult with details about the validation errors
   */
  const handleApiError = useCallback(
    (error: unknown): ValidationErrorResult => {
      const result: ValidationErrorResult = {
        isValidation: false,
        errorCount: 0,
        earliestStep: -1,
        fieldsByStep: {},
        errorMessages: []
      };

      if (!isValidationError(error)) {
        // Not a validation error, show generic error if notification is enabled
        if (showNotification) {
          showError('An unexpected error occurred. Please try again.');
        }
        return result;
      }

      // Process validation errors
      const errorDetails = error.details.details;
      const errorCount = errorDetails.length;

      result.isValidation = true;
      result.errorCount = errorCount;
      result.errorMessages = errorDetails.map((detail) => detail.message);

      // Find the earliest step that has errors
      let earliestStep = 4; // Start with confirmation step
      const fieldsByStep: Record<number, string[]> = {};

      // Set form errors and track which steps have errors
      errorDetails.forEach((detail) => {
        const formFieldPath = mapApiFieldToFormField(detail.field);
        const stepIndex = getStepForField(detail.field);

        // eslint-disable-next-line no-console
        console.log(`Mapping API field "${detail.field}" to form field "${formFieldPath}" on step ${stepIndex}`);

        // Track earliest step with errors
        if (stepIndex >= 0 && stepIndex < earliestStep) {
          earliestStep = stepIndex;
        }

        // Group fields by step for logging and result
        if (stepIndex >= 0) {
          if (!fieldsByStep[stepIndex]) {
            fieldsByStep[stepIndex] = [];
          }
          fieldsByStep[stepIndex].push(formFieldPath);
        }

        // Set the error on the form field
        setError(formFieldPath as any, {
          type: 'server',
          message: detail.message
        });
      });

      result.earliestStep = earliestStep;
      result.fieldsByStep = fieldsByStep;

      // eslint-disable-next-line no-console
      console.log('Fields with errors by step:', fieldsByStep);
      // eslint-disable-next-line no-console
      console.log(`Navigating to earliest error step: ${earliestStep}`);

      // Navigate to the earliest step with errors
      if (earliestStep < 4 && onNavigateToStep) {
        onNavigateToStep(earliestStep);
      }

      // Show error notification with details
      if (showNotification) {
        const errorMessage = `Validation failed (${errorCount} error${errorCount !== 1 ? 's' : ''}). Please review and correct: ${result.errorMessages.join(', ')}`;
        showError(errorMessage);
      }

      return result;
    },
    [setError, onNavigateToStep, showNotification, showError]
  );

  return {
    handleApiError
  };
}
