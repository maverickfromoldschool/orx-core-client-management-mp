/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/**
 * Product data structure from API response
 */
export interface ProductApiResponse {
  productId: string;
  productName: string;
  productCode: string;
  chargeTypeCode: string;
  productGroup: string;
  productType: string;
  effectiveDate: string;
  status: string;
  variants: null | unknown;
  relationships: null | unknown;
  attributes: null | unknown;
  priceListEntryPresent: null | unknown;
  administrativeGroup: null | unknown;
  internalUse: string;
  productCategory: null | string;
  productDescription: string;
  productSectorCd: null | string;
}

/**
 * Product data structure for UI display
 */
export interface Product {
  id: string;
  product: string;
  productCode: string;
  productGroup: string;
  productGroupLink?: string;
  productType: string;
  productTypeDesc?: string | undefined | null;
  chargeType: string;
  chargeTypeCodeDesc?: string | undefined | null;
  effectiveDate: string;
  status?: 'active' | 'inactive' | 'pending';
}

/**
 * API response structure for get all products
 */
export interface GetProductsApiResponse {
  success: boolean;
  message: {
    totalPages: number;
    currentPage: number;
    totalRecord: number;
    data: ProductApiResponse[];
  };
  data: string;
}

/**
 * Product filters structure
 */
export interface ProductFilters {
  product: string;
  productCode: string;
  productGroup: string;
  productType: string;
  chargeType: string;
  effectiveDate: string;
  status: string;
}

/**
 * Add Product form data structure
 */
export interface AddProductFormData {
  productCode: string;
  productGroup: string;
  productName: string;
  baseUom: string;
  productType: string;
  bundleClass?: string;
  accountingCode?: string;
  chargeType: string;
  effectiveDate: string;
}

/**
 * Props for ProductsListingPage component
 */
export interface ProductsListingPageProps {
  onEdit?: (product: Product) => void;
  onCopy?: (product: Product) => void;
  initialFilters?: ProductFilters;
  initialPage?: number;
  pageSize?: number;
}

/**
 * Props for ProductsHeader component
 */
export interface ProductsHeaderProps {
  onSearch?: (searchTerm: string) => void;
}

/**
 * Props for ProductsTableHeader component
 */
export interface ProductsTableHeaderProps {
  totalCount: number;
  onAddProduct?: () => void;
  onFiltersClick?: () => void;
}

/**
 * Props for ProductsTable component
 */
export interface ProductsTableProps {
  products: Product[];
  onEdit?: (product: Product) => void;
  onCopy?: (product: Product) => void;
  loading?: boolean;
}

/**
 * Props for Pagination component
 */
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * Props for ProductsFilterDrawer component
 */
export interface ProductsFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  onApplyFilters?: (filters: ProductFilters) => void;
  initialFilters?: ProductFilters;
}

/**
 * Props for AddProductDialog component
 */
export interface AddProductDialogProps {
  open: boolean;
  onClose: () => void;
  onSave?: (productData: AddProductFormData) => void;
  initialValues?: Partial<AddProductFormData>;
}
