import React from 'react';
import {useNavigate} from 'react-router-dom';

import {ProductVariantAssignmentPage} from './components';
import {
  VariantAssignment,
  VariantAssignmentFormData,
  VariantAssignmentFilters,
  VariantAssignmentResponse
} from './types';
import {variantAssignmentApiService} from './services';

/**
 * Example usage of ProductVariantAssignmentPage component
 *
 * This demonstrates how to integrate the Product Variant Assignment feature
 * into a parent application with real API integration.
 *
 * UPDATED: This example now uses the real API service to fetch product variants
 * from the backend using the hardcoded product ID: 297e01839c4c520c019c514fda740006
 *
 * Integration Steps:
 * 1. Import the ProductVariantAssignmentPage component
 * 2. Import the variantAssignmentApiService
 * 3. Provide a productId for the variant assignments
 * 4. Connect the API service methods to the page callbacks
 * 5. Handle navigation callbacks (onBack, onCancel)
 * 6. Optionally customize pagination settings
 */

/**
 * Example component demonstrating ProductVariantAssignmentPage usage with real API
 */
export const ProductVariantAssignmentExample: React.FC<{productId: string; productGroup: string}> = ({
  productId,
  productGroup
}) => {
  const navigation = useNavigate();

  /**
   * Fetch variant assignments from API
   */
  const handleFetchAssignments = async (
    assignmentProductId: string,
    page: number,
    pageSize: number,
    filters: VariantAssignmentFilters
  ): Promise<VariantAssignmentResponse> => {
    return variantAssignmentApiService.getVariantAssignments({
      productId: assignmentProductId,
      page: page - 1, // Convert from 1-based to 0-based
      size: pageSize,
      transactionProcessing: filters.transactionProcessing ?? undefined,
      priceDetermination: filters.priceDetermination ?? undefined,
      startDate: filters.startDateFrom ?? undefined,
      endDate: filters.endDateTo ?? undefined
    });
  };

  /**
   * Create a new variant assignment
   */
  const handleCreateAssignment = async (
    assignmentProductId: string,
    data: VariantAssignmentFormData
  ): Promise<VariantAssignment> => {
    return variantAssignmentApiService.createVariantAssignment(assignmentProductId, data, productGroup);
  };

  /**
   * Update an existing variant assignment
   */
  const handleUpdateAssignment = async (
    assignmentProductId: string,
    id: string,
    data: VariantAssignmentFormData
  ): Promise<VariantAssignment> => {
    return variantAssignmentApiService.updateVariantAssignment(assignmentProductId, id, data, productGroup);
  };

  /**
   * Delete a variant assignment
   */
  const handleDeleteAssignment = async (assignmentProductId: string, id: string): Promise<void> => {
    return variantAssignmentApiService.deleteVariantAssignment(assignmentProductId, id);
  };

  /**
   * Bulk delete variant assignments
   */
  const handleBulkDeleteAssignments = async (
    assignmentProductId: string,
    ids: string[]
  ): Promise<{successCount: number; failedIds: string[]}> => {
    const response = await variantAssignmentApiService.bulkDeleteVariantAssignments(assignmentProductId, ids);
    return {
      successCount: response.successCount,
      failedIds: response.failedIds
    };
  };

  /**
   * Handle back navigation
   * Navigate to previous page or product list
   */
  const handleBack = () => {
    // Example: navigate to product details page
    navigation(`/product-details/${productId}`);
  };

  /**
   * Handle cancel action
   * Close any open dialogs or navigate away
   */
  const handleCancel = () => {
    // Example: navigate to product list
    navigation(`/product-details/${productId}`);
  };

  return (
    <ProductVariantAssignmentPage
      productId={productId}
      productGroup={productGroup}
      initialPage={1}
      pageSize={10}
      onFetchAssignments={handleFetchAssignments}
      onCreateAssignment={handleCreateAssignment}
      onUpdateAssignment={handleUpdateAssignment}
      onDeleteAssignment={handleDeleteAssignment}
      onBulkDeleteAssignments={handleBulkDeleteAssignments}
      onBack={handleBack}
      onCancel={handleCancel}
    />
  );
};

/**
 * Integration with React Router example
 *
 * ```tsx
 * import { useNavigate, useParams } from 'react-router-dom';
 * import { ProductVariantAssignmentPage } from '@optum-rx/orx-core-products';
 * import { variantAssignmentService } from './services/variant-assignment-service';
 *
 * export const ProductVariantAssignmentRoute: React.FC = () => {
 *   const navigate = useNavigate();
 *   const { productId } = useParams<{ productId: string }>();
 *
 *   return (
 *     <ProductVariantAssignmentPage
 *       productId={productId!}
 *       onFetchAssignments={variantAssignmentService.fetchAssignments}
 *       onCreateAssignment={variantAssignmentService.createAssignment}
 *       onUpdateAssignment={variantAssignmentService.updateAssignment}
 *       onDeleteAssignment={variantAssignmentService.deleteAssignment}
 *       onBulkDeleteAssignments={variantAssignmentService.bulkDeleteAssignments}
 *       onBack={() => navigate(`/products/${productId}`)}
 *       onCancel={() => navigate('/products')}
 *     />
 *   );
 * };
 * ```
 */

/**
 * Integration with API service example
 *
 * ```tsx
 * // services/variant-assignment-service.ts
 * import axios from 'axios';
 * import {
 *   VariantAssignmentResponse,
 *   VariantAssignment,
 *   VariantAssignmentFormData,
 *   VariantAssignmentFilters,
 * } from '@optum-rx/orx-core-products';
 *
 * const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
 *
 * export const variantAssignmentService = {
 *   async fetchAssignments(
 *     productId: string,
 *     page: number,
 *     pageSize: number,
 *     filters: VariantAssignmentFilters
 *   ): Promise<VariantAssignmentResponse> {
 *     const response = await axios.get(
 *       `${API_BASE_URL}/products/${productId}/variant-assignments`,
 *       {
 *         params: {
 *           page,
 *           pageSize,
 *           ...filters,
 *         },
 *       }
 *     );
 *     return response.data;
 *   },
 *
 *   async createAssignment(
 *     productId: string,
 *     data: VariantAssignmentFormData
 *   ): Promise<VariantAssignment> {
 *     const response = await axios.post(
 *       `${API_BASE_URL}/products/${productId}/variant-assignments`,
 *       {
 *         ...data,
 *         priorityOrder: typeof data.priorityOrder === 'string'
 *           ? parseInt(data.priorityOrder, 10)
 *           : data.priorityOrder,
 *       }
 *     );
 *     return response.data;
 *   },
 *
 *   async updateAssignment(
 *     productId: string,
 *     id: string,
 *     data: VariantAssignmentFormData
 *   ): Promise<VariantAssignment> {
 *     const response = await axios.put(
 *       `${API_BASE_URL}/products/${productId}/variant-assignments/${id}`,
 *       {
 *         ...data,
 *         priorityOrder: typeof data.priorityOrder === 'string'
 *           ? parseInt(data.priorityOrder, 10)
 *           : data.priorityOrder,
 *       }
 *     );
 *     return response.data;
 *   },
 *
 *   async deleteAssignment(productId: string, id: string): Promise<void> {
 *     await axios.delete(
 *       `${API_BASE_URL}/products/${productId}/variant-assignments/${id}`
 *     );
 *   },
 *
 *   async bulkDeleteAssignments(
 *     productId: string,
 *     ids: string[]
 *   ): Promise<{ successCount: number; failedIds: string[] }> {
 *     const response = await axios.delete(
 *       `${API_BASE_URL}/products/${productId}/variant-assignments/bulk`,
 *       {
 *         data: { ids },
 *       }
 *     );
 *     return response.data;
 *   },
 * };
 * ```
 */

export default ProductVariantAssignmentExample;
