/* eslint-disable @typescript-eslint/no-floating-promises */
import React, {useState} from 'react';
import {Box, Card, Typography} from '@mui/material';
import {useNavigate} from 'react-router-dom';

import {AddProductFormData, ProductsListingPageProps, ProductFilters, Product} from '../types';
import {useSaveProduct} from '../../../hooks/use-save-product';
import {useGetProducts} from '../../../hooks/use-get-products';

import {ProductsHeader} from './products-header';
import {ProductsTableHeader} from './products-table-header';
import {ProductsTable} from './products-table';
import {Pagination} from './pagination';
import {ProductsFilterDrawer} from './products-filter-drawer';
import {AddProductDialog} from './add-product-dialog';

/**
 * ProductsListingPage component
 * Main container for the products listing page
 * Combines header, table, pagination, and filter drawer components
 */
export const ProductsListingPage: React.FC<ProductsListingPageProps> = ({onCopy, initialFilters}) => {
  const navigate = useNavigate();
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [addProductDialogOpen, setAddProductDialogOpen] = useState(false);
  const {saveProduct} = useSaveProduct();

  // Fetch products with pagination
  const {products, isLoading, totalPages, currentPage, totalCount, fetchProducts, refetch} = useGetProducts({
    page: 0,
    pageSize: 10
  });

  /**
   * Handle page change
   */
  const handlePageChange = (page: number) => {
    fetchProducts({page, pageSize: 10});
  };

  /**
   * Handle search
   */
  const handleSearch = (searchTerm: string) => {
    fetchProducts({searchTerm, page: 0, pageSize: 10});
  };

  /**
   * Handle apply filters
   */
  const handleApplyFilters = (filters: ProductFilters) => {
    fetchProducts({
      page: 0,
      pageSize: 10,
      filters: {
        productType: filters.productType,
        productGroup: filters.productGroup,
        chargeType: filters.chargeType,
        status: filters.status
      }
    });
  };

  /**
   * Handle opening the filter drawer
   */
  const handleFiltersClick = () => {
    setFilterDrawerOpen(true);
  };

  /**
   * Handle closing the filter drawer
   */
  const handleCloseFilterDrawer = () => {
    setFilterDrawerOpen(false);
  };

  /**
   * Handle opening the add product dialog
   */
  const handleAddProductClick = () => {
    setAddProductDialogOpen(true);
  };

  /**
   * Handle closing the add product dialog
   */
  const handleCloseAddProductDialog = () => {
    setAddProductDialogOpen(false);
  };

  /**
   * Handle save product
   */
  const handleOnSaveProduct = async (formData: AddProductFormData) => {
    const status = await saveProduct(formData);
    if (status) {
      setAddProductDialogOpen(false);
      // Refetch products to show the newly added product
      await refetch();
    }
  };

  const handleOnEdit = (product: Product) => {
    navigate(`/product-details/${product.id}`);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        gap: '42px',
        width: '100%',
        margin: '0 auto',
        backgroundColor: '#FAFCFF',
        alignItems: 'center'
      }}
    >
      {/* Page Header with Search */}
      <ProductsHeader onSearch={handleSearch} />

      {/* Main Content Container */}
      <Card
        sx={{
          width: '1268px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #CBCCCD',
          borderRadius: '12px',
          boxShadow: 'none',
          padding: '36px 12px 24px 23px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}
      >
        {/* Page Title */}
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: '20px',
            lineHeight: '24px',
            color: '#002677'
          }}
        >
          Products Overview
        </Typography>

        {/* Inner Content Container */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            paddingLeft: '12px'
          }}
        >
          {/* Table Header with Actions */}
          <ProductsTableHeader
            totalCount={totalCount}
            onAddProduct={handleAddProductClick}
            onFiltersClick={handleFiltersClick}
          />

          {/* Products Table Container */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%'
            }}
          >
            {/* Products Table */}
            <ProductsTable products={products} onEdit={handleOnEdit} onCopy={onCopy} loading={isLoading} />
          </Box>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          )}
        </Box>
      </Card>

      {/* Filter Drawer */}
      <ProductsFilterDrawer
        open={filterDrawerOpen}
        onClose={handleCloseFilterDrawer}
        onApplyFilters={handleApplyFilters}
        initialFilters={initialFilters}
      />

      {/* Add Product Dialog */}
      <AddProductDialog
        open={addProductDialogOpen}
        onClose={handleCloseAddProductDialog}
        onSave={handleOnSaveProduct}
      />
    </Box>
  );
};
