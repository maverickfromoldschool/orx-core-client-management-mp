'use client';

import React from 'react';
import axios from 'axios';

import {useLookupExtensionApi, LookupExtensionApi} from '../useLookupExtensionApi/use-lookup-extension-api';

import {UseLookupExtensionPageProps, UseLookupExtensionPageReturn} from './use-lookup-extension-page.types';

const API_BASE_URL = process.env['REACT_APP_API_BASE_URL'] || 'https://coreweb-dev-api.optum.com';

/**
 * Lookup API response - actual structure from backend
 */
interface LookupApiResponse {
  content?: {
    field?: string;
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
 * Mapper for lookup field options
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

// Local useDebounce implementation to avoid depending on external package in dev
function useDebounce<T>(value: T, delay = 200) {
  const [debounced, setDebounced] = React.useState<T>(value);

  React.useEffect(() => {
    const id = setTimeout(() => {
      setDebounced(value);
    }, delay);
    return () => {
      clearTimeout(id);
    };
  }, [value, delay]);

  return debounced;
}

export function useLookupExtensionPage(props: UseLookupExtensionPageProps): UseLookupExtensionPageReturn {
  const {text} = props;
  const {searchLookupExtensions} = useLookupExtensionApi();
  const [value, setValue] = React.useState(text);

  React.useEffect(() => {
    setValue(text);
  }, [text]);

  const [query, setQuery] = React.useState('');
  const debouncedQuery = useDebounce(query, 200);

  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(10);
  const [refreshCounter, setRefreshCounter] = React.useState(0);
  const [filters, setFilters] = React.useState<Record<string, string | number | null>>({});

  const [data, setData] = React.useState<Record<string, unknown>[]>([]);
  const [total, setTotal] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  // Lookup code options state
  const [lookupCodeOptions, setLookupCodeOptions] = React.useState<DropdownOption[]>([]);
  const [lookupsLoading, setLookupsLoading] = React.useState(false);

  // Data Type options state
  const [dataTypeOptions, setDataTypeOptions] = React.useState<DropdownOption[]>([]);
  const [dataTypesLoading, setDataTypesLoading] = React.useState(false);

  /**
   * Fetch lookup codes once on mount
   */
  React.useEffect(() => {
    const fetchLookupCodes = async () => {
      setLookupsLoading(true);
      try {
        const response = await axios.post<LookupApiResponse>(`${API_BASE_URL}/api/lookups/search`, {
          field: '',
          page: 0,
          size: 100
        });

        const lookupCodeOpts = mapFieldOptionsToDropdownOptions(response.data);
        setLookupCodeOptions(lookupCodeOpts);
      } catch (err: unknown) {
        // eslint-disable-next-line no-console
        console.error('Error fetching lookup codes:', err);
        // Set empty array on error so dropdown still works
        setLookupCodeOptions([]);
      } finally {
        setLookupsLoading(false);
      }
    };

    fetchLookupCodes().catch((err: unknown) => {
      // eslint-disable-next-line no-console
      console.error('Error in fetchLookupCodes:', err);
    });
  }, []); // Only run once on mount

  /**
   * Fetch Data Type options once on mount
   */
  React.useEffect(() => {
    const fetchDataTypeOptions = async () => {
      setDataTypesLoading(true);
      try {
        // eslint-disable-next-line no-console
        console.log('[useLookupExtensionPage] Fetching Data Type options with field: DATA_TYPE');

        const response = await axios.post<LookupApiResponse>(`${API_BASE_URL}/api/lookups/search`, {
          field: 'DATA_TYPE',
          page: 0,
          size: 100
        });

        // eslint-disable-next-line no-console
        console.log('[useLookupExtensionPage] Data Type options response:', response.data);

        // Map the lookup values to dropdown options
        const content = response.data?.content;
        if (content && Array.isArray(content) && content.length > 0) {
          const valuesData = content[0]?.values?.filter((item) => item?.['disableDisplaySw'] !== 'Y');
          if (valuesData && Array.isArray(valuesData)) {
            const dataTypeOpts = valuesData
              .map((item) => {
                const itemValue = item?.id?.fieldVal || '';
                const itemLabel = item?.displayName || item?.description || itemValue || '';
                return {
                  value: itemValue.trim(),
                  label: itemLabel.trim()
                };
              })
              .filter((opt) => opt.value !== '');
            setDataTypeOptions(dataTypeOpts);
          }
        }
      } catch (err: unknown) {
        // eslint-disable-next-line no-console
        console.error('Error fetching Data Type options:', err);
        setDataTypeOptions([]);
      } finally {
        setDataTypesLoading(false);
      }
    };

    fetchDataTypeOptions().catch((err: unknown) => {
      // eslint-disable-next-line no-console
      console.error('Error in fetchDataTypeOptions:', err);
    });
  }, []); // Only run once on mount

  React.useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    // Call real API with search parameters
    // The API uses 0-based pages; our local `page` state is 1-based.
    const searchParams = {
      page: page - 1,
      size: pageSize,
      name: (debouncedQuery || filters['name'] || undefined) as string | undefined,
      extensionCode: (filters['extensionCode'] || undefined) as string | undefined,
      field: (filters['field'] || undefined) as string | undefined,
      systemDefined: (filters['systemDefined'] || undefined) as string | undefined
    };

    // eslint-disable-next-line no-console
    console.log('[useLookupExtensionPage] Calling searchLookupExtensions with params:', searchParams);

    searchLookupExtensions(searchParams)
      .then((res) => {
        if (!mounted) return;
        // API returns: { success, data: { data: [], totalRecord, currentPage, totalPages }, message }
        // Transform API data to table format
        const transformedData = res.data.data.map((item: LookupExtensionApi) => ({
          createdBy: item.createdBy || '',
          modifiedBy: item.modifiedBy || '',
          createdDate: item.createdDate || '',
          modifiedDate: item.modifiedDate || '',
          version: item.version || 0,
          objectCode: item.extensionCode,
          name: item.name,
          field: item.field,
          json: item.jsonData || {fields: [], entries: []},
          systemDefined: item.systemSw,
          userMapping: item.userMappingSw,
          multipleOccurrences: item.multipleOccurrencesSw
        }));
        setData(transformedData as unknown as Record<string, unknown>[]);
        setTotal(res.data.totalRecord);
        setTotalPages(res.data.totalPages ?? 1);
      })
      .catch((err: unknown) => {
        if (!mounted) return;
        setError(err as Error);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [page, pageSize, debouncedQuery, refreshCounter, filters, searchLookupExtensions]);

  function onClick() {
    // preserve small demo behavior expected by tests: change value
    setValue('new value');
  }

  function onSearchChange(val: string) {
    setQuery(val);
    setPage(1);
  }

  function onPageChange(newPage: number) {
    setPage(newPage);
  }

  function refresh() {
    // Force a re-fetch by updating a dependency (e.g., reset to page 1 or toggle a refresh flag)
    // For simplicity, we'll just increment a counter to trigger the effect
    setRefreshCounter((prev) => prev + 1);
  }

  function applyFilters(newFilters: Record<string, string | number | null>) {
    setFilters(newFilters);
    setPage(1); // Reset to first page when applying filters
  }

  return {
    value,
    onClick,
    // api state
    data,
    total,
    totalPages,
    page,
    pageSize,
    loading,
    error,
    onSearchChange,
    onPageChange,
    lookupCodeOptions,
    lookupsLoading,
    dataTypeOptions,
    dataTypesLoading,
    refresh,
    applyFilters,
    filters
  };
}

export default useLookupExtensionPage;
