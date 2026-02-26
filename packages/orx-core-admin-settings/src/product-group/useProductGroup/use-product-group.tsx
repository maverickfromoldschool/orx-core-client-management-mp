'use client';

import {useState, useCallback, useEffect} from 'react';
import axios from 'axios';

import {ProductGroupData} from '../../components/product-group-types';

const API_BASE_URL = process.env['REACT_APP_API_BASE_URL'] || 'https://coreweb-dev-api.optum.com';

/**
 * API Response wrapper
 */
interface ApiDataResponse {
  totalPages: number;
  currentPage: number;
  totalRecord: number;
  data: ProductGroupData[];
}

interface ApiResponse {
  success: boolean;
  data: ApiDataResponse;
  message: string;
}

/**
 * Lookup API response - actual structure from backend
 */
interface LookupApiResponse {
  content?: {
    values?: {
      id?: {
        fieldVal?: string;
        [key: string]: any;
      };
      lookupValue?: string;
      description?: string;
      displayName?: string;
      notes?: string;
      [key: string]: any;
    }[];
    [key: string]: any;
  }[];
  page?: any;
}

/**
 * Dropdown option format
 */
interface DropdownOption {
  label: string;
  value: string;
}

/**
 * Accounting Code API response
 */
interface AccountingCodeItem {
  description?: string;
  accountingCode?: string;
  [key: string]: any;
}

interface AccountingCodeApiResponse {
  data?: {
    data?: AccountingCodeItem[];
    [key: string]: any;
  };
  [key: string]: any;
}

/**
 * Attribute API response
 */
interface AttributeItem {
  attribute?: string;
  description?: string;
  [key: string]: any;
}

interface AttributeApiResponse {
  data?: {
    data?: AttributeItem[];
    [key: string]: any;
  };
  [key: string]: any;
}

/**
 * Variant API response
 */
interface VariantItem {
  variant?: string;
  name?: string;
  [key: string]: any;
}

interface VariantApiResponse {
  data?: {
    data?: VariantItem[];
    [key: string]: any;
  };
  [key: string]: any;
}

/**
 * UOM API response - has nested data structure
 * Axios response.data contains {success, data: {totalPages, currentPage, totalRecord, data: [items]}, message}
 */
interface UOMItem {
  uom?: string;
  description?: string;
  [key: string]: any;
}

interface UOMDataWrapper {
  totalPages?: number;
  currentPage?: number;
  totalRecord?: number;
  data?: UOMItem[];
  [key: string]: any;
}

interface UOMApiResponseBody {
  success?: boolean;
  data?: UOMDataWrapper;
  message?: string;
  [key: string]: any;
}

type UOMApiResponse = UOMApiResponseBody;

/**
 * Mapper for Product Category and External System lookup responses
 * Uses item.description as label and item.lookupValue as value
 */
const mapLookupToDropdownOptions = (response: LookupApiResponse): DropdownOption[] => {
  try {
    const content = response?.content;
    if (!content || !Array.isArray(content) || content.length === 0) {
      return [];
    }

    const values = content[0]?.values?.filter((item) => item?.['disableDisplaySw'] !== 'Y');
    if (!values || !Array.isArray(values)) {
      return [];
    }

    return values
      .map((item) => {
        // value comes from lookupValue
        const value = item?.id?.fieldVal || '';
        // label comes from displayName, with fallback to notes, description, or value
        const label = item?.displayName || item?.notes || item?.description || value || 'Unknown';

        return {
          value: value?.trim() || '',
          label: label?.trim() || ''
        };
      })
      .filter((opt) => opt.value !== '') // Remove empty values
      .filter(
        (opt, index, self) =>
          // Remove duplicates based on value
          index === self.findIndex((t) => t.value === opt.value)
      );
  } catch (err: unknown) {
    // eslint-disable-next-line no-console
    console.error('Error mapping lookup response:', err);
    return [];
  }
};

/**
 * Mapper for Accounting Code API response
 * Uses item.description as label and item.accountingCode as value
 */
const mapAccountingCodeToDropdownOptions = (response: AccountingCodeApiResponse): DropdownOption[] => {
  try {
    const data = response?.data?.data;
    if (!data || !Array.isArray(data) || data.length === 0) {
      return [];
    }

    return data
      .map((item) => ({
        value: item?.accountingCode?.trim() || '',
        label: item?.description?.trim() || item?.accountingCode?.trim() || ''
      }))
      .filter((opt) => opt.value !== '') // Remove empty values
      .filter(
        (opt, index, self) =>
          // Remove duplicates based on value
          index === self.findIndex((t) => t.value === opt.value)
      );
  } catch (err: unknown) {
    // eslint-disable-next-line no-console
    console.error('Error mapping accounting code response:', err);
    return [];
  }
};

/**
 * Mapper for Attribute API response
 * Uses item.description as label and item.attribute as value
 */
const mapAttributeToDropdownOptions = (response: AttributeApiResponse): DropdownOption[] => {
  try {
    const data = response?.data?.data;
    if (!data || !Array.isArray(data) || data.length === 0) {
      return [];
    }

    return data
      .map((item) => ({
        value: item?.attribute?.trim() || '',
        label: item?.description?.trim() || item?.attribute?.trim() || ''
      }))
      .filter((opt) => opt.value !== '') // Remove empty values
      .filter(
        (opt, index, self) =>
          // Remove duplicates based on value
          index === self.findIndex((t) => t.value === opt.value)
      );
  } catch (err: unknown) {
    // eslint-disable-next-line no-console
    console.error('Error mapping attribute response:', err);
    return [];
  }
};

/**
 * Mapper for Variant API response
 * Uses item.name as label and item.variant as value
 */
const mapVariantToDropdownOptions = (response: VariantApiResponse): DropdownOption[] => {
  try {
    const data = response?.data?.data;
    if (!data || !Array.isArray(data) || data.length === 0) {
      return [];
    }

    return data
      .map((item) => ({
        value: item?.variant?.trim() || '',
        label: item?.name?.trim() || item?.variant?.trim() || ''
      }))
      .filter((opt) => opt.value !== '') // Remove empty values
      .filter(
        (opt, index, self) =>
          // Remove duplicates based on value
          index === self.findIndex((t) => t.value === opt.value)
      );
  } catch (err: unknown) {
    // eslint-disable-next-line no-console
    console.error('Error mapping variant response:', err);
    return [];
  }
};

/**
 * Mapper for UOM API response
 * Receives the UOM items array directly
 * Uses item.description as label and item.uom as value
 */
const mapUOMToDropdownOptions = (data: UOMItem[]): DropdownOption[] => {
  try {
    if (!data || !Array.isArray(data) || data.length === 0) {
      // eslint-disable-next-line no-console
      console.log('UOM data is empty or not an array:', data);
      return [];
    }

    // eslint-disable-next-line no-console
    console.log('UOM data received:', data);

    return data
      .map((item) => {
        const uomValue = (item?.uom || '').trim();
        const description = (item?.description || '').trim();
        return {
          value: uomValue,
          label: description || uomValue || ''
        };
      })
      .filter((opt) => opt.value !== '') // Remove empty values
      .filter(
        (opt, index, self) =>
          // Remove duplicates based on value
          index === self.findIndex((t) => t.value === opt.value)
      );
  } catch (err: unknown) {
    // eslint-disable-next-line no-console
    console.error('Error mapping UOM response:', err);
    return [];
  }
};

export interface UseProductGroupReturn {
  data: ProductGroupData[];
  isLoading: boolean;
  error: string | null;
  totalElements: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (size: number) => void;
  handleSave: (productGroup: ProductGroupData) => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
  handleBulkAction: (action: string, selectedIds: string[]) => Promise<void>;
  handleExport: () => void;
  loadProductGroups: (page?: number, size?: number, filters?: Record<string, string | number | null>) => Promise<void>;
  productCategoryOptions: DropdownOption[];
  externalSystemOptions: DropdownOption[];
  accountingCodeOptions: DropdownOption[];
  attributeOptions: DropdownOption[];
  variantOptions: DropdownOption[];
  uomOptions: DropdownOption[];
  lookupsLoading: boolean;
}

/**
 * Custom hook for managing product group page state and API interactions
 */
export function useProductGroup(): UseProductGroupReturn {
  const [data, setData] = useState<ProductGroupData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0); // 0-indexed
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Lookup options state
  const [productCategoryOptions, setProductCategoryOptions] = useState<DropdownOption[]>([]);
  const [externalSystemOptions, setExternalSystemOptions] = useState<DropdownOption[]>([]);
  const [accountingCodeOptions, setAccountingCodeOptions] = useState<DropdownOption[]>([]);
  const [attributeOptions, setAttributeOptions] = useState<DropdownOption[]>([]);
  const [variantOptions, setVariantOptions] = useState<DropdownOption[]>([]);
  const [uomOptions, setUomOptions] = useState<DropdownOption[]>([]);
  const [lookupsLoading, setLookupsLoading] = useState(false);

  /**
   * Load product groups from API
   */
  const loadProductGroups = useCallback(
    async (page?: number, size?: number, filters?: Record<string, string | number | null>) => {
      setIsLoading(true);
      setError(null);

      try {
        const pageToFetch = page !== undefined ? page : currentPage;
        const sizeToFetch = size !== undefined ? size : itemsPerPage;

        // Build params object with pagination and filters
        const params: Record<string, string | number> = {
          page: pageToFetch,
          size: sizeToFetch
        };

        // Add filters to params if provided
        if (filters) {
          Object.keys(filters).forEach((key) => {
            const value = filters[key];
            if (value !== null && value !== undefined && value !== '') {
              params[key] = value;
            }
          });
        }

        // API uses 0-indexed pages
        const response = await axios.get<ApiResponse>(`${API_BASE_URL}/admin/v1/productGroup`, {
          params
        });

        if (!response.data.success) {
          throw new Error(response.data.message || 'Failed to fetch product groups');
        }

        // Use API data directly
        setData(response.data.data.data);
        setTotalElements(response.data.data.totalRecord);
        setTotalPages(response.data.data.totalPages);
      } catch (err: unknown) {
        let errorMessage = 'Failed to load product groups';
        if (axios.isAxiosError(err)) {
          const apiError = err.response?.data as {message?: string} | undefined;
          errorMessage = apiError?.message ?? err.message;
        }
        setError(errorMessage);
        // eslint-disable-next-line no-console
        console.error('Error loading product groups:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage, itemsPerPage]
  );

  /**
   * Fetch lookups once on mount
   */
  useEffect(() => {
    const fetchLookups = async () => {
      setLookupsLoading(true);
      try {
        const results = await Promise.allSettled([
          axios.post<LookupApiResponse>(`${API_BASE_URL}/api/lookups/search`, {
            field: 'PRODUCT_CATEGORY',
            page: 0,
            size: 100
          }),
          axios.post<LookupApiResponse>(`${API_BASE_URL}/api/lookups/search`, {
            field: 'EXTERNAL_SYSTEM',
            page: 0,
            size: 100
          }),
          axios.get<AccountingCodeApiResponse>(`${API_BASE_URL}/admin/v1/accounting-code`),
          axios.get<AttributeApiResponse>(`${API_BASE_URL}/attribute?entity=Product`),
          axios.get<VariantApiResponse>(`${API_BASE_URL}/variant?entity=Product`),
          axios.get<UOMApiResponse>(`${API_BASE_URL}/admin/v1/uom`)
        ]);

        // Extract successful responses
        const productCategoryRes = results[0].status === 'fulfilled' ? results[0].value : null;
        const externalSystemRes = results[1].status === 'fulfilled' ? results[1].value : null;
        const accountingCodeRes = results[2].status === 'fulfilled' ? results[2].value : null;
        const attributeRes = results[3].status === 'fulfilled' ? results[3].value : null;
        const variantRes = results[4].status === 'fulfilled' ? results[4].value : null;
        const uomRes = results[5].status === 'fulfilled' ? results[5].value : null;

        // eslint-disable-next-line no-console
        console.log('UOM API Response:', uomRes);

        const productCategoryOpts = productCategoryRes ? mapLookupToDropdownOptions(productCategoryRes.data) : [];
        const externalSystemOpts = externalSystemRes ? mapLookupToDropdownOptions(externalSystemRes.data) : [];
        const accountingCodeOpts = accountingCodeRes ? mapAccountingCodeToDropdownOptions(accountingCodeRes.data) : [];
        const attributeOpts = attributeRes ? mapAttributeToDropdownOptions(attributeRes.data) : [];
        const variantOpts = variantRes ? mapVariantToDropdownOptions(variantRes.data) : [];
        const uomOpts = uomRes?.data?.data?.data ? mapUOMToDropdownOptions(uomRes.data.data.data) : [];

        // eslint-disable-next-line no-console
        console.log('UOM Options after mapping:', uomOpts);

        setProductCategoryOptions(productCategoryOpts);
        setExternalSystemOptions(externalSystemOpts);
        setAccountingCodeOptions(accountingCodeOpts);
        setAttributeOptions(attributeOpts);
        setVariantOptions(variantOpts);
        setUomOptions(uomOpts);
      } catch (err: unknown) {
        // eslint-disable-next-line no-console
        console.error('Error fetching lookups:', err);
        // Set empty arrays on error so dropdowns still work
        setProductCategoryOptions([]);
        setExternalSystemOptions([]);
        setAccountingCodeOptions([]);
        setAttributeOptions([]);
        setVariantOptions([]);
        setUomOptions([]);
      } finally {
        setLookupsLoading(false);
      }
    };

    fetchLookups().catch((err: unknown) => {
      // eslint-disable-next-line no-console
      console.error('Error in fetchLookups:', err);
    });
  }, []); // Only run once on mount

  /**
   * Load product groups on mount and when page/size changes
   */
  useEffect(() => {
    loadProductGroups().catch((err: unknown) => {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch product groups on mount:', err);
    });
  }, [currentPage, itemsPerPage, loadProductGroups]);

  /**
   * Handle save (create or update)
   */
  const handleSave = useCallback(
    async (productGroup: ProductGroupData) => {
      setIsLoading(true);
      setError(null);

      try {
        // Check if this is an existing product group (has version)
        const isUpdate = productGroup.version !== undefined;

        if (isUpdate) {
          // Update existing product group
          await axios.put(`${API_BASE_URL}/admin/v1/productGroup`, productGroup);
        } else {
          // Create new product group
          await axios.post(`${API_BASE_URL}/admin/v1/productGroup`, productGroup);
        }

        // Reload the current page
        await loadProductGroups(currentPage, itemsPerPage);
      } catch (err: unknown) {
        let errorMessage = 'Failed to save product group';
        if (axios.isAxiosError(err)) {
          const apiError = err.response?.data as {message?: string} | undefined;
          errorMessage = apiError?.message ?? err.message;
        }
        setError(errorMessage);
        // eslint-disable-next-line no-console
        console.error('Error saving product group:', err);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage, itemsPerPage, loadProductGroups]
  );

  /**
   * Handle delete
   */
  const handleDelete = useCallback(
    async (productGroupId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        await axios.delete(`${API_BASE_URL}/admin/v1/productGroup/${productGroupId}`);

        // Reload the current page
        await loadProductGroups(currentPage, itemsPerPage);
      } catch (err: unknown) {
        let errorMessage = 'Failed to delete product group';
        if (axios.isAxiosError(err)) {
          const apiError = err.response?.data as {message?: string} | undefined;
          errorMessage = apiError?.message ?? err.message;
        }
        setError(errorMessage);
        // eslint-disable-next-line no-console
        console.error('Error deleting product group:', err);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage, itemsPerPage, loadProductGroups]
  );

  /**
   * Handle bulk actions (delete, etc.)
   */
  const handleBulkAction = useCallback(
    async (action: string, selectedIds: string[]) => {
      setIsLoading(true);
      setError(null);

      try {
        if (action === 'delete') {
          // Delete product groups one by one
          await Promise.all(selectedIds.map(async (id) => axios.delete(`${API_BASE_URL}/admin/v1/productGroup/${id}`)));
        } else {
          // eslint-disable-next-line no-console
          console.log(`Action ${action} not yet implemented`);
        }

        // Reload the current page
        await loadProductGroups(currentPage, itemsPerPage);
      } catch (err: unknown) {
        let errorMessage = 'Failed to perform bulk action';
        if (axios.isAxiosError(err)) {
          const apiError = err.response?.data as {message?: string} | undefined;
          errorMessage = apiError?.message ?? err.message;
        }
        setError(errorMessage);
        // eslint-disable-next-line no-console
        console.error('Error performing bulk action:', err);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage, itemsPerPage, loadProductGroups]
  );

  /**
   * Handle export
   */
  const handleExport = useCallback(() => {
    try {
      // Mock implementation - replace with actual export endpoint when available
      const csvData = data
        .map((pg) => `${pg.productGroup},${pg.name},${pg.productCategory || ''},${pg.displaySequence || ''}`)
        .join('\n');

      const csv = `productGroup,name,productCategory,displaySequence\n${csvData}`;
      const blob = new Blob([csv], {type: 'text/csv'});

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `product-groups-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: unknown) {
      // eslint-disable-next-line no-console
      console.error('Error exporting product groups:', err);
    }
  }, [data]);

  return {
    data,
    isLoading,
    error,
    totalElements,
    totalPages,
    currentPage,
    itemsPerPage,
    setCurrentPage,
    setItemsPerPage,
    handleSave,
    handleDelete,
    handleBulkAction,
    handleExport,
    loadProductGroups,
    productCategoryOptions,
    externalSystemOptions,
    accountingCodeOptions,
    attributeOptions,
    variantOptions,
    uomOptions,
    lookupsLoading
  };
}

export default useProductGroup;
