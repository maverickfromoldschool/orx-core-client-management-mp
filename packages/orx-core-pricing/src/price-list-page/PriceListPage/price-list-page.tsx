import React from 'react';
import {useNavigate} from 'react-router-dom';
import {Container} from '@mui/material';

import type {PriceListSummary} from '../../services';
import {priceListApiService} from '../../services';
import {PriceListOverviewCard} from '../../components';
import FilterPanel, {FilterField} from '../../components/filter-panel';

// Define filter fields matching all table columns
const FILTER_FIELDS: FilterField[] = [
  {
    label: 'Price List Code',
    fieldKey: 'priceListCode',
    fieldType: 'text'
  },
  {
    label: 'Price List Name',
    fieldKey: 'priceListName',
    fieldType: 'text'
  },
  {
    label: 'Business Sector',
    fieldKey: 'businessSector',
    fieldType: 'text'
  },
  {
    label: 'Price List Type',
    fieldKey: 'priceListType',
    fieldType: 'text'
  },
  {
    label: 'Effective Date',
    fieldKey: 'effectiveDate',
    fieldType: 'date'
  },
  {
    label: 'Status',
    fieldKey: 'status',
    fieldType: 'dropdown',
    values: [
      {label: 'Active', value: 'Active'},
      {label: 'Inactive', value: 'Inactive'}
    ]
  }
];

export function PriceListPage() {
  const navigate = useNavigate();
  const [data, setData] = React.useState<PriceListSummary[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [totalItems, setTotalItems] = React.useState(0);
  const [filterPanelOpen, setFilterPanelOpen] = React.useState(false);
  const [appliedFilters, setAppliedFilters] = React.useState<Record<string, string | number | null>>({});

  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Fetch price lists
  const fetchPriceLists = React.useCallback(
    async (page: number) => {
      setIsLoading(true);
      try {
        const response = await priceListApiService.getPriceLists({
          page: page - 1,
          size: itemsPerPage,
          priceListCode: appliedFilters['priceListCode'] as string | undefined,
          priceListName: appliedFilters['priceListName'] as string | undefined,
          businessSector: appliedFilters['businessSector'] as string | undefined,
          priceListType: appliedFilters['priceListType'] as string | undefined,
          effectiveDate: appliedFilters['effectiveDate'] as string | undefined,
          status: appliedFilters['status'] as string | undefined
        });

        // Map API response to PriceListSummary format
        const mappedData: PriceListSummary[] = response.content.map((item) => ({
          id: item.priceListId,
          priceListCode: item.priceListCode,
          priceListName: item.priceListName,
          businessSector: item.businessSector,
          priceListType: item.priceListType,
          priceListEntries: item.priceListEntries,
          effectiveDate: item.effectiveDate,
          status: item.status
        }));

        setData(mappedData);
        setTotalItems(response.page.totalElements);
      } catch (error) {
        console.error('Failed to fetch price lists:', error);
        setData([]);
        setTotalItems(0);
      } finally {
        setIsLoading(false);
      }
    },
    [appliedFilters, itemsPerPage]
  );

  React.useEffect(() => {
    fetchPriceLists(currentPage).catch(console.error);
  }, [currentPage, fetchPriceLists]);

  const handleView = (priceListId: string) => {
    navigate(`/price-lists/${priceListId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFiltersClick = () => {
    setFilterPanelOpen(true);
  };

  const handleFilterPanelClose = () => {
    setFilterPanelOpen(false);
  };

  const handleApplyFilters = (filters: Record<string, string | number | null>) => {
    setAppliedFilters(filters);
    setCurrentPage(1); // Reset to first page when filters change
    setFilterPanelOpen(false);
    // Trigger data fetch with new filters
    fetchPriceLists(1).catch(console.error);
  };

  return (
    <Container maxWidth="xl" sx={{py: 3}}>
      {/* Overview Card */}
      <PriceListOverviewCard
        data={data}
        totalItems={totalItems}
        currentPage={currentPage}
        totalPages={totalPages}
        isLoading={isLoading}
        onView={handleView}
        onPageChange={handlePageChange}
        onFiltersClick={handleFiltersClick}
      />

      {/* Filter Panel */}
      <FilterPanel
        open={filterPanelOpen}
        onClose={handleFilterPanelClose}
        fields={FILTER_FIELDS}
        currentFilters={appliedFilters}
        onApply={handleApplyFilters}
      />
    </Container>
  );
}

export default PriceListPage;
