// Main component
export {ProductsListingPage} from './components/products-listing-page';

// Sub-components (for flexibility)
export {ProductsHeader} from './components/products-header';
export {ProductsTableHeader} from './components/products-table-header';
export {ProductsTable} from './components/products-table';
export {Pagination} from './components/pagination';
export {ProductsFilterDrawer} from './components/products-filter-drawer';
export {AddProductDialog} from './components/add-product-dialog';

// Hooks
export {useGetProducts, type UseGetProductsReturn, type GetProductsParams} from '../../hooks/use-get-products';
export {
  useGetProductById,
  type UseGetProductByIdReturn,
  type ProductDetail,
  type ProductWithDetails
} from '../../hooks/use-get-product-by-id';
export {useSaveProduct} from '../../hooks/use-save-product';

// Types
export type {
  Product,
  ProductApiResponse,
  GetProductsApiResponse,
  ProductsListingPageProps,
  ProductsHeaderProps,
  ProductsTableHeaderProps,
  ProductsTableProps,
  PaginationProps,
  ProductFilters,
  ProductsFilterDrawerProps,
  AddProductFormData,
  AddProductDialogProps
} from './types';

// Utilities
export {generateMockProducts, sampleProducts} from './utils';

// Schemas
export {addProductSchema, type AddProductSchemaType} from './schemas/add-product-schema';
