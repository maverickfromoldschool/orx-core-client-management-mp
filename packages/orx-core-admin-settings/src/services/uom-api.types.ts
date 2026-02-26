/**
 * Type definitions for Unit of Measure (UOM) API
 */

/** UOM interface matching API response structure */
export interface UomApiResponse {
  uom: string;
  description: string;
  decimals: number;
  unitTypeCd: string;
  appendToQuantity: string;
  createdBy: string;
  modifiedBy: string;
  createdDate: string;
  modifiedDate: string;
}

/** Request payload for creating a UOM */
export interface UomCreateRequest {
  uom: string;
  description: string;
  decimals: number;
  unitTypeCd: string;
  appendToQuantity: string;
  createdBy: string;
  modifiedBy: string;
}

/** Request payload for updating a UOM */
export interface UomUpdateRequest {
  uom: string;
  description: string;
  decimals: number;
  unitTypeCd: string;
  appendToQuantity: string;
  createdBy: string;
  modifiedBy: string;
}

/** API response structure for list of UOMs */
export interface UomsApiResponse {
  success: boolean;
  data: {
    currentPage: number;
    totalPages: number;
    totalRecord: number;
    data: UomApiResponse[];
  };
  message: string;
}

/** Query parameters for getting UOMs */
export interface GetUomsParams {
  page?: number;
  size?: number;
  uom?: string;
  description?: string;
  decimals?: number;
  unitTypeCd?: string;
  appendToQuantity?: string;
}
