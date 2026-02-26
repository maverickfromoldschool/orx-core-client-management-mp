export * from './orx-core-products/OrxCoreProducts/orx-core-products';
export * from './orx-core-products/OrxCoreProducts/orx-core-products.types';

export * from './orx-core-products/useOrxCoreProducts/use-orx-core-products';
export * from './orx-core-products/useOrxCoreProducts/use-orx-core-products.types';

export * from './events/events';
export * from './events/events.types';

export * from './events/useRouteEvent/use-route-event';
export * from './events/useRouteEvent/use-route-event.types';

export * from './events/useAnalyticsEvent/use-analytics-event';
export * from './events/useAnalyticsEvent/use-analytics-event.types';

export * from './useClickLink/use-click-link';
export * from './useClickLink/use-click-link.types';

export * from './events/useErrorEvent/use-error-event';
export * from './events/useErrorEvent/use-error-event.types';
export * from './router/Router/router';
export * from './router/Router/router.types';

export * from './router/useRouter/use-router';
export * from './router/useRouter/use-router.types';
export * from './pages/product-list-page/ProductListPage/product-list-page';
export * from './pages/product-list-page/ProductListPage/product-list-page.types';

export * from './pages/product-list-page/useProductListPage/use-product-list-page';
export * from './pages/product-list-page/useProductListPage/use-product-list-page.types';
export * from './pages/product-details-page/ProductDetailsPage/product-details-page';
export * from './pages/product-details-page/ProductDetailsPage/product-details-page.types';

export * from './pages/product-details-page/useProductDetailsPage/use-product-details-page';
export * from './pages/product-details-page/useProductDetailsPage/use-product-details-page.types';

// Product Details Feature (New Implementation)
export {
  ProductDetailsPage as ProductDetailsFeaturePage,
  ProductDetailsHeader,
  ProductDetailsCard,
  ProductInfoSection,
  ProductSummaryCards,
  ProductActions
} from './features/product-details/components';

export {useProductDetails} from './features/product-details/hooks';

export type {
  ProductDetails,
  ProductInformation,
  ProductRelationship,
  ProductVariant,
  PriceListEntry,
  ProductDetailsCardData,
  ProductDetailsPageProps as ProductDetailsFeaturePageProps,
  ProductDetailsHeaderProps,
  ProductDetailsCardProps,
  ProductInfoSectionProps,
  ProductSummaryCardsProps,
  ProductActionsProps
} from './features/product-details/types';
export * from './pages/product-view-page/ProductViewPage/product-view-page';

export * from './pages/product-view-page/useProductViewPage/use-product-view-page';
export * from './pages/product-view-page/useProductViewPage/use-product-view-page.types';

// Product View Feature (New Implementation)
export {
  ProductViewPage as ProductViewFeaturePage,
  ProductViewHeader,
  ProductViewTabs,
  ProductInformationForm,
  ProductAttributesTable
} from './features/product-view/components';

export {useProductView} from './features/product-view/hooks';

export type {
  ProductAttribute,
  ProductInformation as ProductViewInformation,
  ProductViewPageProps,
  ProductInformationFormProps,
  ProductAttributesTableProps,
  TabValue
} from './features/product-view/types';

export {COLORS, TAB_LABELS, DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS} from './features/product-view/constants';
export * from './pages/product-variant-assignment-page/ProductVariantAssignmentPage/product-variant-assignment-page';
export * from './pages/product-variant-assignment-page/ProductVariantAssignmentPage/product-variant-assignment-page.types';

export * from './pages/product-variant-assignment-page/useProductVariantAssignmentPage/use-product-variant-assignment-page';
export * from './pages/product-variant-assignment-page/useProductVariantAssignmentPage/use-product-variant-assignment-page.types';

// Hooks
export {useUpdateProduct} from './hooks/use-update-product';
export type {
  UpdateProductPayload,
  UpdatedProduct,
  UpdateProductResponse,
  UseUpdateProductReturn
} from './hooks/use-update-product';

export {useGetAttribute} from './hooks/use-get-attribute';
export type {AttributeDetail, AttributeEntity, AttributeValue, UseGetAttributeReturn} from './hooks/use-get-attribute';
