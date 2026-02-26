import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {Typography, Box, InputAdornment, Stack, TextField, FormControl, Select, MenuItem} from '@mui/material';
import {useBreadcrumbs} from '@optum-rx-core/orx-core-client-shared';
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import SearchIcon from '@mui/icons-material/Search';

import {ClientListFilterDrawer} from '../../components/client-list-filter-drawer';
import {Client, ClientStatus} from '../../types';
import {ClientsOverviewCard} from '../../components/clients-overview-card';
import {clientApiService} from '../../services/client-api.service';

import {ClientListPageProps} from './client-list-page.types';

const PAGE_SIZE = 10;

// Interface for API client object from Spring Boot
interface ApiClient {
  clientId: string | null;
  draftId: string | null;
  clientName: string;
  clientStatus: string;
  clientReferenceId: string;
  effectiveDate: string | null;
  numberOfOperationalUnits: number;
}

// Interface for Spring Boot Page response
interface SpringBootPageResponse {
  content: ApiClient[];
  page: {
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  };
}

export function ClientListPage(props: ClientListPageProps) {
  // Filter drawer state
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  // Filter state for all required fields
  const [filterClientId, setFilterClientId] = useState('');
  const [filterClientName, setFilterClientName] = useState('');
  // const [filterClientReferenceId, setFilterClientReferenceId] = useState('');
  // const [filterDraftId, setFilterDraftId] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterEffectiveDate, setFilterEffectiveDate] = useState('');

  // Open/close handlers
  const handleOpenFilterDrawer = () => {
    setFilterDrawerOpen(true);
  };
  const handleCloseFilterDrawer = () => {
    setFilterDrawerOpen(false);
  };

  // Apply filters (replace with real logic)
  const handleApplyFilters = () => {
    // TODO: Use filter values to update API/search
    setFilterDrawerOpen(false);
  };

  // Clear filters
  const handleClearFilters = () => {
    setFilterClientId('');
    setFilterClientName('');
    // setFilterClientReferenceId('');
    // setFilterDraftId('');
    setFilterStatus('');
    setFilterEffectiveDate('');
  };
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const {setBreadcrumbs} = useBreadcrumbs();

  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>([]);
  const [showSuccessBanner] = useState(!!props.successMessage);
  const [bannerMessage] = useState(props.successMessage);

  // API state
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalClients, setTotalClients] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    setBreadcrumbs([
      {name: 'Home', link: '/'},
      {name: 'Clients', link: '/clients'}
    ]);
  }, [setBreadcrumbs]);

  // Fetch clients from API
  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);

      try {
        const response = (await clientApiService.getClientsPaged({
          page: currentPage - 1, // API uses 0-based page
          size: PAGE_SIZE,
          searchQuery: searchQuery || undefined
        })) as SpringBootPageResponse;

        // Map API response fields to our Client interface
        const mappedClients: Client[] = (response.content || []).map((apiClient: ApiClient) => {
          // Use draftId for drafts (when clientId is null), clientId for active clients
          // const uniqueId = apiClient.clientId || apiClient.draftId || '';
          // Only show clientId in the clientId column, not draftId
          // const displayClientId = apiClient.clientId || '-';

          return {
            clientId: apiClient.clientId ? apiClient.clientId : '',
            draftId: apiClient.draftId ? apiClient.draftId : '',
            // draftId :apiClient.draftId,
            clientName: apiClient.clientName,

            status: apiClient.clientStatus === 'ACTIVE' ? 'Complete' : 'Draft',
            clientReferenceId: apiClient.clientReferenceId,
            effectiveDate: apiClient.effectiveDate || '',
            operationalUnitsCount: apiClient.numberOfOperationalUnits || 0
          };
        });

        setClients(mappedClients);
        setTotalClients(response.page.totalElements || 0);
        setTotalPages(response.page.totalPages || 0);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        // eslint-disable-next-line no-console
        console.error('Failed to fetch clients:', err);
      }
    };

    fetchClients().catch((err: unknown) => {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch clients:', err);
    });
  }, [currentPage, searchQuery]);

  // Get current page clients (already from API, no need to filter)
  const paginatedClients = clients;

  // Reset to page 1 when search changes
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
    setSelectedClientIds([]);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedClientIds([]);
  };

  // Handle selection change
  const handleSelectionChange = (selectedIds: string[]) => {
    setSelectedClientIds(selectedIds);
  };

  // Handle client click - navigate to view page only if Complete status
  const handleClientClick = (client: Client) => {
    if (client.status === 'Complete') {
      navigate(`/view-client/${client.clientId}`);
    }
    // For Draft status, do nothing (handled by Edit button)
  };

  // Handle edit client - navigate to edit mode or draft mode based on status
  const handleEditClient = (clientId: string, status: ClientStatus, draftId?: string) => {
    // console.log(`/edit-client?mode=draft&clientId=${clientId}&draftId=${draftId}`);
    navigate(`/edit-client?mode=draft&clientId=${clientId}&draftId=${draftId}`);
  };

  // Handle Add Client button click - Requirements: 5.2
  const handleAddClient = () => {
    navigate(`/add-client`);
  };

  // Handle Show Details button click
  const handleShowDetails = () => {
    navigate('/manage-cags');
  };

  // Handle Filters button click
  const handleFiltersClick = handleOpenFilterDrawer;

  // Handle bulk action - Requirements: 4.4
  const handleBulkAction = (action: string) => {
    // eslint-disable-next-line no-console
    console.log('Bulk action:', action, 'on clients:', selectedClientIds);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#FAFCFF'
      }}
    >
      {/* Header - Requirements: 1.1 */}
      {/* <Header activeNavItem="Clients" /> */}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flex: 1,
          px: '84px',
          py: 3
        }}
      >
        {/* Breadcrumbs - Requirements: 1.2 */}
        {/* <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" sx={{ color: '#6E7072' }} />}
          aria-label="breadcrumb"
          sx={{ mb: 2 }}
        >
          <Link
            href="/"
            underline="hover"
            sx={{
              fontFamily: '"Enterprise Sans VF", sans-serif',
              fontSize: '14px',
              fontWeight: 400,
              color: '#0C55B8',
            }}
          >
            Home
          </Link>
          <Typography
            sx={{
              fontFamily: '"Enterprise Sans VF", sans-serif',
              fontSize: '14px',
              fontWeight: 400,
              color: '#4B4D4F',
            }}
          >
            Clients
          </Typography>
        </Breadcrumbs> */}

        {/* Section Header with Title and Search - Requirements: 1.3, 2.1, 2.3, 2.4 */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontFamily: '"Enterprise Sans VF", sans-serif',
              fontSize: '26px',
              fontWeight: 700,
              color: '#002677'
            }}
          >
            Clients
          </Typography>

          {/* Search Input - Requirements: 2.1, 2.3, 2.4 */}
          <TextField
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon sx={{color: '#0C55B8', fontSize: '20px'}} />
                </InputAdornment>
              )
            }}
            sx={{
              width: '320px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '46px',
                backgroundColor: '#FFFFFF',
                fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                fontSize: '16px',
                height: '44px',
                '& fieldset': {
                  borderColor: '#CBCCCD'
                },
                '&:hover fieldset': {
                  borderColor: '#CBCCCD'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#CBCCCD',
                  borderWidth: '1px'
                }
              },
              '& .MuiInputBase-input': {
                py: '10px',
                '&::placeholder': {
                  color: '#6E7072',
                  opacity: 1
                }
              }
            }}
          />
        </Box>

        {/* Success Banner - Requirements: 7.1, 7.2, 7.3, 7.4 */}
        {showSuccessBanner && bannerMessage && (
          <Box sx={{mb: 3}}>
            {/* <SuccessBanner
              message={bannerMessage}
              visible={showSuccessBanner}
              onDismiss={handleDismissBanner}
            /> */}
          </Box>
        )}

        {/* Clients Overview Card - Requirements: 8.1, 8.2, 8.3 */}
        <ClientsOverviewCard
          clients={paginatedClients}
          totalClients={totalClients}
          selectedIds={selectedClientIds}
          currentPage={currentPage}
          totalPages={totalPages}
          isLoading={isLoading}
          onSelectionChange={handleSelectionChange}
          onClientClick={handleClientClick}
          onEditClient={handleEditClient}
          // onDeleteClient={handleDeleteClient}
          onPageChange={handlePageChange}
          onAddClient={handleAddClient}
          onShowDetails={handleShowDetails}
          onFiltersClick={handleFiltersClick}
          onBulkAction={handleBulkAction}
        />
      </Box>

      {/* Filter Drawer Integration */}
      <ClientListFilterDrawer
        open={filterDrawerOpen}
        onClose={handleCloseFilterDrawer}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      >
        <Stack spacing={4}>
          {/* Client Id */}
          <Box sx={{width: '100%'}}>
            <Typography
              component="label"
              sx={{fontSize: '16px', fontWeight: 700, color: 'text.primary', lineHeight: 1.4, mb: 0.5}}
            >
              Client Id
            </Typography>
            <TextField
              value={filterClientId}
              onChange={(e) => {
                setFilterClientId(e.target.value);
              }}
              fullWidth
              size="small"
              placeholder="Enter Client Id"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '4px',
                  '& fieldset': {
                    borderWidth: '1px',
                    borderColor: 'grey.300'
                  },
                  '&:hover fieldset': {
                    borderColor: 'grey.400'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                    borderWidth: '1px'
                  }
                },
                '& .MuiInputBase-input': {
                  padding: '10px 12px',
                  fontSize: '14px'
                }
              }}
            />
          </Box>
          {/* Client Name */}
          <Box sx={{width: '100%'}}>
            <Typography
              component="label"
              sx={{fontSize: '16px', fontWeight: 700, color: 'text.primary', lineHeight: 1.4, mb: 0.5}}
            >
              Client Name
            </Typography>
            <TextField
              value={filterClientName}
              onChange={(e) => {
                setFilterClientName(e.target.value);
              }}
              fullWidth
              size="small"
              placeholder="Enter Client Name"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '4px',
                  '& fieldset': {
                    borderWidth: '1px',
                    borderColor: 'grey.300'
                  },
                  '&:hover fieldset': {
                    borderColor: 'grey.400'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                    borderWidth: '1px'
                  }
                },
                '& .MuiInputBase-input': {
                  padding: '10px 12px',
                  fontSize: '14px'
                }
              }}
            />
          </Box>

          {/* Client Status (Dropdown) */}
          <Box sx={{width: '100%'}}>
            <Typography
              component="label"
              sx={{fontSize: '16px', fontWeight: 700, color: 'text.primary', lineHeight: 1.4, mb: 0.5}}
            >
              Client Status
            </Typography>
            <div>
              <FormControl fullWidth size="small">
                <Select
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                  }}
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected) {
                      return <span style={{color: '#9E9E9E', fontSize: 14}}>Select Status</span>;
                    }
                    return selected;
                  }}
                  sx={{
                    borderRadius: '4px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderWidth: '1px',
                      borderColor: 'grey.300'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'grey.400'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                      borderWidth: '1px'
                    },
                    '& .MuiSelect-select': {
                      padding: '10px 12px',
                      fontSize: '14px'
                    },
                    '& .MuiSelect-icon': {
                      color: 'grey.700',
                      right: '8px'
                    }
                  }}
                >
                  <MenuItem value="">
                    <span style={{color: '#9E9E9E', fontSize: 14}}>Select Status</span>
                  </MenuItem>
                  <MenuItem value="Complete">Complete</MenuItem>
                  <MenuItem value="Draft">Draft</MenuItem>
                </Select>
              </FormControl>
            </div>
          </Box>
          <Box sx={{width: '100%'}}>
            <Typography
              component="label"
              sx={{fontSize: '16px', fontWeight: 700, color: 'text.primary', lineHeight: 1.4, mb: 0.5}}
            >
              Effective Date
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={filterEffectiveDate ? dayjs(filterEffectiveDate, 'MM-DD-YYYY') : null}
                onChange={(newValue) => {
                  setFilterEffectiveDate(newValue?.isValid() ? newValue.format('MM-DD-YYYY') : '');
                }}
                inputFormat="MM-DD-YYYY"
                components={{
                  OpenPickerIcon: CalendarMonthIcon
                }}
                OpenPickerButtonProps={{
                  sx: {
                    backgroundColor: '#002677',
                    borderRadius: '6px',
                    height: '100%',
                    width: '48px',
                    marginRight: '-14px',
                    color: '#FFFFFF',
                    '&:hover': {
                      backgroundColor: '#001d5c'
                    },
                    '& .MuiSvgIcon-root': {
                      fontSize: '24px'
                    }
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    size="small"
                    placeholder="MM-DD-YYYY"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '4px',
                        '& fieldset': {
                          borderWidth: '1px',
                          borderColor: 'grey.300'
                        },
                        '&:hover fieldset': {
                          borderColor: 'grey.400'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'primary.main',
                          borderWidth: '1px'
                        }
                      },
                      '& .MuiInputBase-input': {
                        padding: '10px 12px',
                        fontSize: '14px'
                      },
                      '& .MuiInputAdornment-root': {
                        marginLeft: 0,
                        height: '100%',
                        maxHeight: 'none'
                      }
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </Box>
        </Stack>
      </ClientListFilterDrawer>

      {/* Footer - Requirements: 1.4 */}
      {/* <Footer /> */}
    </Box>
  );
}

export default ClientListPage;
