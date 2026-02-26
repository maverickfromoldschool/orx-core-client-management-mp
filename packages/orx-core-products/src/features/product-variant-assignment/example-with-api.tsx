/**
 * Example: Using Variant Assignment API Service
 *
 * This file demonstrates how to integrate the variantAssignmentApiService
 * with the ProductVariantAssignmentPage component.
 */

import React from 'react';

import type {VariantAssignmentFilters} from './types';

import {ProductVariantAssignmentPage, variantAssignmentApiService} from './index';

/**
 * Example wrapper component that integrates the API service
 */
export const ProductVariantAssignmentPageWithApi: React.FC<{productId: string; productGroup: string}> = ({
  productId,
  productGroup
}) => {
  /**
   * Handler to fetch variant assignments from API
   */
  const handleFetchAssignments = async (
    assignmentProductId: string,
    page: number,
    pageSize: number,
    filters: VariantAssignmentFilters
  ) => {
    // Call the API service
    return await variantAssignmentApiService.getVariantAssignments({
      productId: assignmentProductId,
      page: page - 1, // Convert to 0-based for API
      size: pageSize,
      transactionProcessing: filters.transactionProcessing ?? undefined,
      priceDetermination: filters.priceDetermination ?? undefined,
      startDate: filters.startDateFrom ?? undefined,
      endDate: filters.endDateTo ?? undefined
    });
  };

  /**
   * Handler to create a new variant assignment
   */
  const handleCreateAssignment = async (assignmentProductId: string, data: any) => {
    return await variantAssignmentApiService.createVariantAssignment(assignmentProductId, data, productGroup);
  };

  /**
   * Handler to update an existing variant assignment
   */
  const handleUpdateAssignment = async (assignmentProductId: string, id: string, data: any) => {
    return await variantAssignmentApiService.updateVariantAssignment(assignmentProductId, id, data, productGroup);
  };

  /**
   * Handler to delete a variant assignment
   */
  const handleDeleteAssignment = async (assignmentProductId: string, id: string) => {
    await variantAssignmentApiService.deleteVariantAssignment(assignmentProductId, id);
  };

  /**
   * Handler to bulk delete variant assignments
   */
  const handleBulkDeleteAssignments = async (assignmentProductId: string, ids: string[]) => {
    const response = await variantAssignmentApiService.bulkDeleteVariantAssignments(assignmentProductId, ids);
    return {
      successCount: response.successCount,
      failedIds: response.failedIds
    };
  };

  /**
   * Handler for back navigation
   */
  const handleBack = () => {
    // Implement your navigation logic here
  };

  /**
   * Handler for cancel action
   */
  const handleCancel = () => {
    // Implement your cancel logic here
  };

  return (
    <ProductVariantAssignmentPage
      productId={productId}
      productGroup={productGroup}
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
 * CONFIGURATION STEPS:
 *
 * 1. Update the API endpoint in variant-assignment-api.service.ts:
 *    - Replace VARIANT_ASSIGNMENT_ENDPOINT with your actual endpoint
 *    - Example: const VARIANT_ASSIGNMENT_ENDPOINT = '/api/products/variant-assignments';
 *
 * 2. Set the API_BASE_URL environment variable:
 *    - Add REACT_APP_API_BASE_URL to your .env file
 *    - Example: REACT_APP_API_BASE_URL=https://your-api-domain.com
 *
 * 3. Adjust API response mapping if needed:
 *    - Check mapApiResponseToVariantAssignment in variant-assignment-api.service.ts
 *    - Ensure field names match your API response structure
 *
 * 4. Update authentication/headers if required:
 *    - Modify axios interceptors in variant-assignment-api.service.ts
 *    - Add authorization headers or tokens as needed
 */
