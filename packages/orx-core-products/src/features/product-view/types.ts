import {ProductGroupDetail} from '../../hooks/use-get-product-group';
import {ProductWithDetails} from '../products-listing';

/**
 * Product attribute data structure
 */
export interface ProductAttribute {
  productExtId: string;
  productId: string;
  attribute: string;
  attributeVal: string;
  startDate: string;
  endDate?: string | null;
}

/**
 * Product information data structure
 */
export interface ProductInformation {
  productCode: string;
  productName: string;
  productGroup: string;
  productGroupDescription: string;
  baseUom: string;
  productType: string;
  chargeType: string;
  effectiveDate: string;
  expirationDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
}

/**
 * Props for ProductViewPage component
 */
export interface ProductViewPageProps {
  productInformation: ProductInformation;
  onSave?: () => void;
  onCancel?: () => void;
  onRetire?: () => void;
  onDuplicate?: () => void;
  onAssignAttributes?: () => void;
  onEditAttribute?: (attributeId: string) => void;
  onDeleteAttribute?: (attributeId: string) => void;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  pageSize?: number;
}

/**
 * Props for ProductInformationForm component
 */
export interface ProductInformationFormProps {
  productDetails: ProductWithDetails;
  onSave?: () => void;
  onCancel?: () => void;
  onRetire?: () => void;
  onDuplicate?: () => void;
}

/**
 * Props for ProductAttributesTable component
 */
export interface ProductAttributesTableProps {
  productId: string;
  attributes: ProductAttribute[];
  productGroupDetails: ProductGroupDetail | null;
}

/**
 * Tab value type
 */
export type TabValue = 'product-information' | 'transaction-fields';
