/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import React, {useMemo, useState} from 'react';
import {Box} from '@mui/material';
import {useParams} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';

import {ProductViewPageProps, TabValue} from '../types';
import {COLORS} from '../constants';
import {ProductWithDetails, useGetProductById} from '../../products-listing';
import {useUpdateProduct} from '../../../hooks/use-update-product';
import {useGetProductGroup} from '../../../hooks/use-get-product-group';

import {ProductViewHeader} from './product-view-header';
import {ProductViewTabs} from './product-view-tabs';
import {ProductInformationForm, updateProductSchema, UpdateProductSchemaType} from './product-information-form';
import {ProductAttributesTable} from './product-attributes-table';
import {TransactionFieldsPage} from './transaction-fields-page';

/**
 * ProductViewPage component
 * Main container for the product view page with tabs and content
 */
const ProductViewPageInner: React.FC<ProductViewPageProps & {productData: ProductWithDetails}> = ({
  onCancel,
  onRetire,
  onDuplicate,
  productData
}) => {
  const {updateProduct, isLoading} = useUpdateProduct();
  const {productGroupData} = useGetProductGroup(productData.product.productGroup);
  const [activeTab, setActiveTab] = useState<TabValue>('product-information');
  const attributes = useMemo(
    () =>
      productData.productAttributes.map((attr) => {
        const formatDate = (dateString: string) => {
          if (!dateString) return dateString;
          const date = new Date(dateString);
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const year = date.getFullYear();
          return `${month}/${day}/${year}`;
        };

        return {
          productExtId: attr.productExtId,
          productId: attr.productId,
          attribute: attr.attribute,
          attributeVal: attr.attributeVal,
          startDate: formatDate(attr.startDt),
          endDate: attr.endDt ? formatDate(attr.endDt) : null
        };
      }),
    [productData.productAttributes]
  );
  const {
    control,
    handleSubmit,
    formState: {errors, isValid}
  } = useForm<UpdateProductSchemaType>({
    resolver: zodResolver(updateProductSchema),
    mode: 'onChange',
    defaultValues: productData
      ? {
          productCode: productData.product.productCode || '',
          productGroup: productData.product.productGroup || '',
          productName: productData.product.productName || '',
          baseUom: productData.product.baseUom || '',
          productType: productData.product.productType || '',
          chargeType: productData.product.chargeTypeCode || '',
          effectiveDate: productData.product.effectiveDate || '',
          expiryDate: productData.product.expiryDate || '',
          accountingCode: productData.product.accountingCode || ''
        }
      : undefined
  });

  const handleTabChange = (tab: TabValue) => {
    setActiveTab(tab);
  };

  const onSubmit = (data: UpdateProductSchemaType) => {
    let expiryDateValue: string | null = null;
    if (data.expiryDate && !data.expiryDate.includes('T')) {
      expiryDateValue = `${data.expiryDate}T00:00:00`;
    }

    updateProduct({
      productId: productData.product.productId,
      productName: data.productName,
      productCode: data.productCode,
      baseUom: data.baseUom,
      effectiveDate: data.effectiveDate,
      expiryDate: expiryDateValue,
      chargeTypeCode: data.chargeType,
      productType: data.productType,
      productGroup: data.productGroup,
      status: productData.product.status,
      accountingCode: data.accountingCode
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '30px',
        width: '1272px',
        margin: '0 auto'
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Content Container */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '31px',
            width: '100%'
          }}
        >
          {/* Header */}
          <ProductViewHeader
            lastModifiedBy={productData.product.modifiedBy}
            lastModifiedDate={productData.product.modifiedDate}
            onCancel={onCancel}
            isSaveDisabled={!isValid || isLoading}
          />

          {/* Tabs */}
          <ProductViewTabs activeTab={activeTab} onTabChange={handleTabChange} />

          {/* Tab Content */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}
          >
            {activeTab === 'product-information' && (
              <>
                {/* Product Information Form */}
                <ProductInformationForm
                  productGroupDetails={productGroupData}
                  productDetails={productData}
                  control={control}
                  errors={errors}
                  onRetire={onRetire}
                  onDuplicate={onDuplicate}
                />

                {/* Product Attributes Section */}
                <Box
                  sx={{
                    backgroundColor: COLORS.BLUE_EXTRA_LIGHT,
                    border: `1px solid ${COLORS.NEUTRAL_30}`,
                    borderRadius: '12px',
                    padding: '24px 24px 32px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                  }}
                >
                  <Box
                    sx={{
                      fontWeight: 700,
                      fontSize: '20px',
                      lineHeight: '1.2em',
                      color: COLORS.TEXT_HEADINGS
                    }}
                  >
                    Product Attributes
                  </Box>

                  <ProductAttributesTable
                    productGroupDetails={productGroupData}
                    productId={productData.product.productId}
                    attributes={attributes || []}
                  />
                </Box>
              </>
            )}

            {activeTab === 'transaction-fields' && <TransactionFieldsPage productId={productData.product.productId} />}
          </Box>
        </Box>
      </form>
    </Box>
  );
};

export const ProductViewPage: React.FC<ProductViewPageProps> = (props) => {
  const {productId} = useParams();
  const {isLoading, productData} = useGetProductById(productId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!productData) {
    return <div>Product Not Found!</div>;
  }

  return <ProductViewPageInner productData={productData} {...props} />;
};
