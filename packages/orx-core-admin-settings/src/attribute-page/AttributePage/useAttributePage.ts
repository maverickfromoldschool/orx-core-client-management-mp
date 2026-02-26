import {useState, useCallback, useEffect} from 'react';
import axios from 'axios';

import {AttributeData} from '../../components/attribute-types';

const API_BASE_URL = process.env['REACT_APP_API_BASE_URL'] || 'https://coreweb-dev-api.optum.com';

/**
 * API Response wrapper
 */
interface ApiDataResponse {
  totalPages: number;
  currentPage: number;
  totalRecord: number;
  data: AttributeData[];
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
      displayName?: string;
      notes?: string;
      description?: string;
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
 * Small defensive mapper for lookup responses
 * Handles the specific backend response format
 */
const mapLookupToDropdownOptions = (response: LookupApiResponse): DropdownOption[] => {
  try {
    // Navigate to content[0].values
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
        // value comes from id.fieldVal
        const value = item?.id?.fieldVal || '';
        // label comes from displayName or description as fallback
        const label = item?.displayName || item?.description || value || 'Unknown';

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
 * Mapper specifically for field options
 * Uses content[i].field for both label and value
 */
const mapFieldOptionsToDropdownOptions = (response: LookupApiResponse): DropdownOption[] => {
  try {
    const content = response?.content;
    if (!content || !Array.isArray(content) || content.length === 0) {
      return [];
    }

    return content
      .map((item) => {
        // Safely access field property
        const fieldValue = typeof item === 'object' && item !== null && 'field' in item ? String(item['field']) : '';
        return {
          value: fieldValue.trim(),
          label: fieldValue.trim()
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
    console.error('Error mapping field options:', err);
    return [];
  }
};

export interface UseAttributePageReturn {
  data: AttributeData[];
  isLoading: boolean;
  error: string | null;
  totalElements: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (size: number) => void;
  handleSave: (attribute: AttributeData) => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
  handleBulkAction: (action: string, selectedIds: string[]) => Promise<void>;
  handleExport: () => void;
  loadAttributes: (page?: number, size?: number, filters?: Record<string, string | number | null>) => Promise<void>;
  dataTypeOptions: DropdownOption[];
  fieldTypeOptions: DropdownOption[];
  fieldOptions: DropdownOption[];
  entityOptions: DropdownOption[];
  lookupsLoading: boolean;
}

/**
 * Custom hook for managing attribute page state and API interactions
 */
export function useAttributePage(): UseAttributePageReturn {
  const [data, setData] = useState<AttributeData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0); // 0-indexed
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Lookup options state
  const [dataTypeOptions, setDataTypeOptions] = useState<DropdownOption[]>([]);
  const [fieldTypeOptions, setFieldTypeOptions] = useState<DropdownOption[]>([]);
  const [fieldOptions, setFieldOptions] = useState<DropdownOption[]>([]);
  const [entityOptions, setEntityOptions] = useState<DropdownOption[]>([]);
  const [lookupsLoading, setLookupsLoading] = useState(true);

  /**
   * Load attributes from API
   */
  const loadAttributes = useCallback(
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
        const response = await axios.get<ApiResponse>(`${API_BASE_URL}/attribute`, {
          params
        });

        if (!response.data.success) {
          throw new Error(response.data.message || 'Failed to fetch attributes');
        }

        // Use API data directly - no mapping needed!
        setData(response.data.data.data);
        setTotalElements(response.data.data.totalRecord);
        setTotalPages(response.data.data.totalPages);
      } catch (err: unknown) {
        let errorMessage = 'Failed to load attributes';
        if (axios.isAxiosError(err)) {
          const apiError = err.response?.data as {message?: string} | undefined;
          errorMessage = apiError?.message ?? err.message;
        }
        setError(errorMessage);
        // eslint-disable-next-line no-console
        console.error('Error loading attributes:', err);
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
        const [dataTypeRes, fieldTypeRes, fieldRes, entityRes] = await Promise.all([
          axios.post<LookupApiResponse>(`${API_BASE_URL}/api/lookups/search`, {
            field: 'DATA_TYPE',
            page: 0,
            size: 100
          }),
          axios.post<LookupApiResponse>(`${API_BASE_URL}/api/lookups/search`, {
            field: 'PREDEFINED_FIELD_TYPE',
            page: 0,
            size: 100
          }),
          axios.post<LookupApiResponse>(`${API_BASE_URL}/api/lookups/search`, {
            field: '',
            page: 0,
            size: 100
          }),
          axios.post<LookupApiResponse>(`${API_BASE_URL}/api/lookups/search`, {
            field: 'ENTITY',
            page: 0,
            size: 100
          })
        ]);

        setDataTypeOptions(mapLookupToDropdownOptions(dataTypeRes.data));
        setFieldTypeOptions(mapLookupToDropdownOptions(fieldTypeRes.data));
        setFieldOptions(mapFieldOptionsToDropdownOptions(fieldRes.data));
        setEntityOptions(mapLookupToDropdownOptions(entityRes.data));
      } catch (err: unknown) {
        // eslint-disable-next-line no-console
        console.error('Error fetching lookups:', err);
        // Set empty arrays on error so dropdowns still work
        setDataTypeOptions([]);
        setFieldTypeOptions([]);
        setFieldOptions([]);
        setEntityOptions([]);
      } finally {
        setLookupsLoading(false);
      }
    };

    fetchLookups().catch((err: unknown) => {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch lookups:', err);
    });
  }, []); // Fetch once on mount

  /**
   * Load attributes on mount and when page/size changes
   */
  useEffect(() => {
    loadAttributes().catch((err: unknown) => {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch attributes on mount:', err);
    });
  }, [currentPage, itemsPerPage, loadAttributes]);

  /**
   * Handle save (create or update)
   */
  const handleSave = useCallback(
    async (attribute: AttributeData) => {
      setIsLoading(true);
      setError(null);

      try {
        // Check if this is an existing attribute (has createdDate or version)
        const isUpdate = attribute.createdDate !== undefined || attribute.version !== undefined;

        if (isUpdate) {
          // Update existing attribute
          await axios.put<AttributeData>(`${API_BASE_URL}/attribute`, attribute);
        } else {
          // Create new attribute
          await axios.post<AttributeData>(`${API_BASE_URL}/attribute`, attribute);
        }

        // Reload the current page
        await loadAttributes(currentPage, itemsPerPage);
      } catch (err: unknown) {
        let errorMessage = 'Failed to save attribute';
        if (axios.isAxiosError(err)) {
          const apiError = err.response?.data as {message?: string} | undefined;
          errorMessage = apiError?.message ?? err.message;
        }
        setError(errorMessage);
        // eslint-disable-next-line no-console
        console.error('Error saving attribute:', err);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage, itemsPerPage, loadAttributes]
  );

  /**
   * Handle delete
   */
  const handleDelete = useCallback(
    async (id: string) => {
      setIsLoading(true);
      setError(null);

      try {
        await axios.delete(`${API_BASE_URL}/attribute/${id}`);

        // Reload the current page
        await loadAttributes(currentPage, itemsPerPage);
      } catch (err: unknown) {
        let errorMessage = 'Failed to delete attribute';
        if (axios.isAxiosError(err)) {
          const apiError = err.response?.data as {message?: string} | undefined;
          errorMessage = apiError?.message ?? err.message;
        }
        setError(errorMessage);
        // eslint-disable-next-line no-console
        console.error('Error deleting attribute:', err);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage, itemsPerPage, loadAttributes]
  );

  /**
   * Handle bulk actions (delete, archive, etc.)
   */
  const handleBulkAction = useCallback(
    async (action: string, selectedIds: string[]) => {
      setIsLoading(true);
      setError(null);

      try {
        if (action === 'delete') {
          // Delete attributes one by one
          await Promise.all(selectedIds.map(async (id) => axios.delete(`${API_BASE_URL}/attribute/${id}`)));
        } else if (action === 'archive') {
          // TODO: Implement archive functionality when backend supports it
          // eslint-disable-next-line no-console
          console.log('Archive action not yet implemented');
        }

        // Reload the current page
        await loadAttributes(currentPage, itemsPerPage);
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
    [currentPage, itemsPerPage, loadAttributes]
  );

  /**
   * Handle export
   */
  const handleExport = useCallback(() => {
    try {
      // Mock implementation - replace with actual export endpoint when available
      const csvData = data.map((attr) => `${attr.attribute},${attr.description}`).join('\n');

      const csv = `attribute,description\n${csvData}`;
      const blob = new Blob([csv], {type: 'text/csv'});

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `attributes-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: unknown) {
      // eslint-disable-next-line no-console
      console.error('Error exporting attributes:', err);
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
    loadAttributes,
    dataTypeOptions,
    fieldTypeOptions,
    fieldOptions,
    entityOptions,
    lookupsLoading
  };
}
