/**
 * Product Variant Assignment Constants
 *
 * Configuration values and constants used throughout the feature.
 */

/**
 * Pagination configuration
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  DEFAULT_PAGE: 1,
  MAX_VISIBLE_PAGES: 7
} as const;

/**
 * Date format configuration
 */
export const DATE_FORMAT = {
  DISPLAY: 'MM/DD/YYYY',
  PLACEHOLDER: '_ _/_ _ /_ _ _ _',
  ISO: 'YYYY-MM-DD'
} as const;

/**
 * Boolean display values
 */
export const BOOLEAN_DISPLAY = {
  TRUE: 'Yes',
  FALSE: 'No'
} as const;

/**
 * Table configuration
 */
export const TABLE = {
  ROW_HEIGHT: 52,
  HEADER_HEIGHT: 56,
  ALTERNATING_ROW_COLOR: '#FAFAFA',
  DEFAULT_ROW_COLOR: '#FFFFFF'
} as const;

/**
 * Background colors
 */
export const BACKGROUND_COLORS = {
  PAGE: '#FAFCFF',
  TABLE_ROW_EVEN: '#FAFAFA',
  TABLE_ROW_ODD: '#FFFFFF'
} as const;

/**
 * API retry configuration
 */
export const API_RETRY = {
  MAX_ATTEMPTS: 3,
  INITIAL_DELAY: 1000,
  BACKOFF_MULTIPLIER: 2
} as const;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection and try again.',
  SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
  VALIDATION_ERROR: 'Please correct the errors in the form before submitting.',
  DELETE_ERROR: 'Failed to delete the variant assignment. Please try again.',
  BULK_DELETE_ERROR: 'Some items could not be deleted. Please try again.',
  LOAD_ERROR: 'Failed to load variant assignments. Please try again.',
  SAVE_ERROR: 'Failed to save the variant assignment. Please try again.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  PERMISSION_DENIED: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested variant assignment was not found.'
} as const;

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  CREATE: 'Variant assignment created successfully.',
  UPDATE: 'Variant assignment updated successfully.',
  DELETE: 'Variant assignment deleted successfully.',
  BULK_DELETE: 'Selected variant assignments deleted successfully.'
} as const;

/**
 * Form field names
 */
export const FORM_FIELDS = {
  ASSIGNED_PRODUCT_VARIANT: 'assignedProductVariant',
  PREDEFINED_LIST: 'predefinedList',
  TRANSACTION_PROCESSING: 'transactionProcessing',
  PRICE_DETERMINATION: 'priceDetermination',
  START_DATE: 'startDate',
  END_DATE: 'endDate'
} as const;

/**
 * Column identifiers for the table
 */
export const COLUMNS = {
  CHECKBOX: 'checkbox',
  ACTIONS: 'actions',
  ASSIGNED_PRODUCT_VARIANT: 'assignedProductVariant',
  PREDEFINED_LIST: 'predefinedList',
  TRANSACTION_PROCESSING: 'transactionProcessing',
  PRICE_DETERMINATION: 'priceDetermination',
  START_DATE: 'startDate',
  END_DATE: 'endDate'
} as const;

/**
 * Dialog modes
 */
export const DIALOG_MODE = {
  CREATE: 'create',
  EDIT: 'edit'
} as const;

/**
 * Delete target types
 */
export const DELETE_TARGET = {
  SINGLE: 'single',
  BULK: 'bulk'
} as const;

/**
 * Loading state timeouts
 */
export const LOADING_TIMEOUTS = {
  TOAST_AUTO_DISMISS: 10000,
  DEBOUNCE_DELAY: 300
} as const;

/**
 * Validation constraints
 */
export const VALIDATION = {
  MAX_PRODUCT_VARIANT_LENGTH: 255,
  MIN_PRODUCT_VARIANT_LENGTH: 1
} as const;
