import type {ProductWithDetails} from '../../hooks/use-get-product-by-id';

/**
 * Product details data structure
 */
export interface ProductDetails {
  id: string;
  name: string;
  code: string;
  productType: string;
  chargeType: string;
  effectiveDate: string;
  status: 'active' | 'inactive' | 'pending';
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
}

/**
 * Product information summary
 */
export interface ProductInformation {
  attributesCount: number;
  transactionLabelsCount: number;
}

/**
 * Product relationship summary
 */
export interface ProductRelationship {
  count: number;
}

/**
 * Product variant summary
 */
export interface ProductVariant {
  count: number;
}

/**
 * Price list entry summary
 */
export interface PriceListEntry {
  count: number;
}

/**
 * Product details card data
 */
export interface ProductDetailsCardData {
  productInformation: ProductInformation;
  productRelationship: ProductRelationship;
  productVariant: ProductVariant;
  priceListEntry: PriceListEntry;
}

/**
 * Props for ProductDetailsPage component
 */
export interface ProductDetailsPageProps {
  productDetails: ProductDetails;
  cardData: ProductDetailsCardData;
  onAddProduct?: () => void;
  onCancel?: () => void;
  onDuplicate?: () => void;
  onAddNew?: (type: 'relationship' | 'variant') => void;
  onRetire?: () => void;
  onViewDetails?: (type: 'information' | 'relationship' | 'variant' | 'priceList') => void;
}

/**
 * Props for ProductDetailsHeader component
 */
export interface ProductDetailsHeaderProps {
  onAddProduct?: () => void;
  onCancel?: () => void;
}

/**
 * Props for ProductDetailsCard component
 */
export interface ProductDetailsCardProps {
  productDetails: ProductWithDetails;
  onDuplicate?: () => void;
  onAddNew?: (type: 'relationship' | 'variant') => void;
  onRetire?: () => void;
  onViewDetails?: (type: 'information' | 'relationship' | 'variant' | 'priceList') => void;
}

/**
 * Props for ProductInfoSection component
 */
export interface ProductInfoSectionProps {
  productDetails: ProductWithDetails;
}

/**
 * Props for ProductSummaryCards component
 */
export interface ProductSummaryCardsProps {
  productDetails: ProductWithDetails;
  onViewDetails?: (type: 'information' | 'relationship' | 'variant' | 'priceList') => void;
}

/**
 * Props for ProductActions component
 */
export interface ProductActionsProps {
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  onDuplicate?: () => void;
  onAddNew?: (type: 'relationship' | 'variant') => void;
  onRetire?: () => void;
}
