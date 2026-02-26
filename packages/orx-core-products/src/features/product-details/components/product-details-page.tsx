/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import React, {useState} from 'react';
import {Box} from '@mui/material';
import {useNavigate, useParams} from 'react-router-dom';

import {ProductDetailsPageProps} from '../types';
import {AddProductDialog, AddProductFormData, useGetProductById} from '../../products-listing';
import {useSaveProduct} from '../../../hooks/use-save-product';

import {ProductDetailsHeader} from './product-details-header';
import {ProductDetailsCard} from './product-details-card';

/**
 * ProductDetailsPage component
 * Main container for the product details page
 * Combines header and card components
 */
export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({onDuplicate, onRetire}) => {
  const navigate = useNavigate();
  const {productId} = useParams();
  const {isLoading, productData} = useGetProductById(productId);
  const [addProductDialogOpen, setAddProductDialogOpen] = useState(false);
  const {saveProduct} = useSaveProduct();

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
    const product = await saveProduct(formData);
    if (product) {
      setAddProductDialogOpen(false);
      navigate(`/product-details/${product.message.productId}`);
    }
  };

  const handleOnAddProduct = () => {
    setAddProductDialogOpen(true);
  };

  const handleOnCancel = () => {
    navigate('/');
  };

  const handleOnAddNew = (type: 'relationship' | 'variant') => {
    if (type === 'variant') {
      navigate(`/product-variant-assignment?productId=${productId}`);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!productData) {
    return <div>Product Not Found!</div>;
  }

  const handleViewDetails = (type: 'information' | 'relationship' | 'variant' | 'priceList') => {
    if (type === 'information') {
      navigate(`/product-information/${productId}`);
    } else if (type === 'variant') {
      navigate(`/product-variant-assignment?productId=${productId}`);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        gap: '42px',
        width: '100%',
        backgroundColor: '#FAFCFF',
        alignItems: 'center'
      }}
    >
      {/* Page Header */}
      <ProductDetailsHeader onAddProduct={handleOnAddProduct} onCancel={handleOnCancel} />

      {/* Main Content Card */}
      <ProductDetailsCard
        productDetails={productData}
        onDuplicate={onDuplicate}
        onAddNew={handleOnAddNew}
        onRetire={onRetire}
        onViewDetails={handleViewDetails}
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
