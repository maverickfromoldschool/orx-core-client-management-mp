/**
 * Product Variant Assignment Types
 *
 * Type definitions for the Product Variant Assignment feature.
 * These types define the data structures used throughout the feature.
 */

import {GridRowSelectionModel, GridRowId} from '@mui/x-data-grid';

// Re-export MUI DataGrid types for convenience
export type {GridRowSelectionModel, GridRowId};

/**
 * Variant value item for table display
 */
export interface VariantValue {
  value: string;
  description: string;
}

/**
 * Variant assignment record (REVISED)
 */
export interface VariantAssignment {
  id: string;
  variantField: string;
  defaultValue?: string;
  dataType?: string;
  priorityOrder: number;
  transactionProcessing: boolean;
  priceDetermination: boolean;
  startDate: string | null; // ISO 8601 format
  endDate: string | null; // ISO 8601 format
  variantValues: VariantValue[];
  productCode?: string | null;
  createdBy?: string;
  createdDate?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
}

/**
 * Form data for creating/editing variant assignments (REVISED)
 */
export interface VariantAssignmentFormData {
  variantField: string;
  defaultValue?: string;
  dataType?: string;
  priorityOrder: string | number;
  transactionProcessing: boolean;
  priceDetermination: boolean;
  startDate: string;
  endDate?: string;
  variantValues: VariantValue[];
}

/**
 * Filter criteria for variant assignments (REVISED)
 */
export interface VariantAssignmentFilters {
  transactionProcessing?: boolean | null;
  priceDetermination?: boolean | null;
  startDateFrom?: string | null;
  startDateTo?: string | null;
  endDateFrom?: string | null;
  endDateTo?: string | null;
}

/**
 * API response for paginated variant assignments
 */
export interface VariantAssignmentResponse {
  data: VariantAssignment[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Bulk action types
 */
export type BulkActionType = 'delete';

/**
 * Selection state
 */
export interface SelectionState {
  selectedIds: string[];
  selectAll: boolean;
}

/**
 * API request for creating a variant assignment (REVISED)
 */
export interface CreateVariantAssignmentRequest {
  variantField: string;
  defaultValue?: string;
  dataType?: string;
  priorityOrder: number;
  transactionProcessing: boolean;
  priceDetermination: boolean;
  startDate: string | null;
  endDate: string | null;
  variantValues: VariantValue[];
}

/**
 * API request for updating a variant assignment (REVISED)
 */
export interface UpdateVariantAssignmentRequest {
  variantField: string;
  defaultValue?: string;
  dataType?: string;
  priorityOrder: number;
  transactionProcessing: boolean;
  priceDetermination: boolean;
  startDate: string | null;
  endDate: string | null;
  variantValues: VariantValue[];
}

/**
 * API request for bulk delete
 */
export interface BulkDeleteRequest {
  ids: string[];
}

/**
 * API response for bulk delete
 */
export interface BulkDeleteResponse {
  successCount: number;
  failedIds: string[];
}

/**
 * API query parameters for fetching variant assignments (REVISED)
 */
export interface GetVariantAssignmentsParams {
  page: number;
  pageSize: number;
  transactionProcessing?: boolean;
  priceDetermination?: boolean;
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
}

/**
 * Props for Pagination component
 */
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

/**
 * Props for VariantAssignmentHeader component
 */
export interface VariantAssignmentHeaderProps {
  onBack: () => void;
  onCancel: () => void;
}

/**
 * Props for VariantAssignmentTableHeader component
 */
export interface VariantAssignmentTableHeaderProps {
  totalCount: number;
  selectedCount: number;
  onAssignVariants: () => void;
  onBulkDelete: () => void;
  onFiltersClick: () => void;
  bulkActionsDisabled: boolean;
  loading?: boolean;
}

/**
 * Props for VariantAssignmentFormDialog component
 */
export interface VariantAssignmentFormDialogProps {
  open: boolean;
  mode: 'create' | 'edit';
  initialValues?: Partial<VariantAssignmentFormData>;
  onClose: () => void;
  onSubmit: (data: VariantAssignmentFormData) => Promise<void>;
  loading?: boolean;
}

/**
 * Props for VariantAssignmentFilterDrawer component
 */
export interface VariantAssignmentFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  onApplyFilters: (filters: VariantAssignmentFilters) => void;
  initialFilters?: VariantAssignmentFilters;
  loading?: boolean;
}
