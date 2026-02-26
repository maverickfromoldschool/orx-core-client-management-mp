import React from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  Chip,
  Grid,
  TextField,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {DateTimePicker} from '@mui/x-date-pickers/DateTimePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import LockIcon from '@mui/icons-material/Lock';
import dayjs from 'dayjs';

import {priceListApiService} from '../../services';
import type {PriceListDetailsApi, EligibilityCondition, PriceListEntrySummary} from '../../services';
import {LoadingSpinner, ErrorMessage, Pagination} from '../../components';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const {children, value, index, ...other} = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`price-list-tabpanel-${index}`}
      aria-labelledby={`price-list-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{pt: 3}}>{children}</Box>}
    </div>
  );
}

/**
 * PriceListDetailsPage component displays detailed information about a price list
 */
export function PriceListDetailsPage() {
  const {priceListId} = useParams<{priceListId: string}>();
  const navigate = useNavigate();

  const [priceListData, setPriceListData] = React.useState<PriceListDetailsApi | null>(null);
  const [priceListEntries, setPriceListEntries] = React.useState<PriceListEntrySummary[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [entriesLoading, setEntriesLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState(0);
  const [conditionDialogOpen, setConditionDialogOpen] = React.useState(false);
  const [selectedCondition, setSelectedCondition] = React.useState<EligibilityCondition | null>(null);

  // Pagination state for Price List Entries tab
  const [entriesCurrentPage, setEntriesCurrentPage] = React.useState(1);
  const entriesPerPage = 10;

  // Fetch price list data
  const fetchPriceListData = React.useCallback(async () => {
    if (!priceListId) {
      setError('Price List ID is required');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await priceListApiService.getPriceListById(priceListId);
      setPriceListData(data);
    } catch (err) {
      const errorMessage = err as {message?: string};
      setError(errorMessage?.message || 'Failed to load price list details');
    } finally {
      setLoading(false);
    }
  }, [priceListId]);

  // Fetch price list entries
  const fetchPriceListEntries = React.useCallback(async () => {
    if (!priceListId) {
      return;
    }

    setEntriesLoading(true);

    try {
      const entries = await priceListApiService.getPriceListEntries(priceListId);
      setPriceListEntries(entries);
    } catch (err) {
      const errorMessage = err as {message?: string};
      console.error('Failed to load price list entries:', errorMessage?.message || err);
      setPriceListEntries([]);
    } finally {
      setEntriesLoading(false);
    }
  }, [priceListId]);

  React.useEffect(() => {
    fetchPriceListData().catch(console.error);
  }, [fetchPriceListData]);

  // Fetch entries when switching to entries tab
  React.useEffect(() => {
    if (activeTab === 1 && priceListEntries.length === 0 && !entriesLoading) {
      fetchPriceListEntries().catch(console.error);
    }
  }, [activeTab, fetchPriceListEntries, priceListEntries.length, entriesLoading]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleBack = () => {
    navigate('/price-lists');
  };

  const handleViewCondition = (condition: EligibilityCondition) => {
    setSelectedCondition(condition);
    setConditionDialogOpen(true);
  };

  const handleCloseConditionDialog = () => {
    setConditionDialogOpen(false);
    setSelectedCondition(null);
  };

  const handleViewEntry = (entry: PriceListEntrySummary) => {
    navigate(`/price-lists/${priceListId}/entries/${entry.priceListEntryId}`);
  };

  const handleEntriesPageChange = (page: number) => {
    setEntriesCurrentPage(page);
  };

  // Calculate paginated entries
  const paginatedEntries = React.useMemo(() => {
    if (!priceListEntries) return [];
    const startIndex = (entriesCurrentPage - 1) * entriesPerPage;
    const endIndex = startIndex + entriesPerPage;
    return priceListEntries.slice(startIndex, endIndex);
  }, [priceListEntries, entriesCurrentPage, entriesPerPage]);

  const entriesTotalPages = React.useMemo(() => {
    if (!priceListEntries) return 0;
    return Math.ceil(priceListEntries.length / entriesPerPage);
  }, [priceListEntries, entriesPerPage]);

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{py: 3}}>
        <LoadingSpinner message="Loading price list details..." />
      </Container>
    );
  }

  if (error || !priceListData) {
    return (
      <Container maxWidth="xl" sx={{py: 3}}>
        <ErrorMessage message={error || 'Price list not found'} onRetry={fetchPriceListData} />
      </Container>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="xl" sx={{py: 3, px: 0}}>
        {/* Header with Back Button */}
        <Box sx={{px: 3, mb: 2}}>
          <Button
            startIcon={<ArrowBackIosIcon />}
            onClick={handleBack}
            sx={{
              textTransform: 'none',
              color: '#002677',
              fontSize: '20px',
              fontWeight: 600,
              p: 0,
              '&:hover': {
                backgroundColor: 'transparent'
              }
            }}
          >
            Price List Details
          </Button>
        </Box>

        {/* Main Content Card */}
        <Box
          sx={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #CBCCCD',
            borderRadius: '8px',
            mx: 3
          }}
        >
          {/* Tabs Header */}
          <Box sx={{borderBottom: 1, borderColor: 'divider', px: 3}}>
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 2}}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                sx={{
                  minHeight: '48px',
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '14px',
                    minHeight: '48px',
                    color: '#4B4D4F',
                    fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                    '&.Mui-selected': {
                      color: '#002677'
                    }
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#002677',
                    height: '3px'
                  }
                }}
              >
                <Tab label="Main" />
                <Tab label="Price List Entries" />
              </Tabs>

              {/* Header Right Side - Code */}
              <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#002677',
                      fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                    }}
                  >
                    {priceListData.priceListCode}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Tab Content */}
          <Box sx={{px: 3, pb: 3}}>
            {/* Main Tab */}
            <TabPanel value={activeTab} index={0}>
              {/* Two Column Layout */}
              <Grid container spacing={3}>
                {/* Left Column - Form Fields */}
                <Grid item xs={12} md={6}>
                  {/* First Row: Code and Name */}
                  <Grid container spacing={2} sx={{mb: 2}}>
                    <Grid item xs={6}>
                      <div>
                        <Typography
                          component="label"
                          sx={{
                            fontSize: '14px',
                            fontWeight: 700,
                            color: '#323334',
                            display: 'block',
                            mb: 0.5,
                            fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                            height: '20px',
                            lineHeight: '20px'
                          }}
                        >
                          Price List Code
                        </Typography>
                        <TextField
                          value={priceListData.priceListCode}
                          disabled
                          fullWidth
                          size="small"
                          helperText={`${priceListData.priceListCode.length} / 50`}
                          InputProps={{
                            readOnly: true
                          }}
                          FormHelperTextProps={{
                            sx: {
                              textAlign: 'right',
                              fontSize: '12px',
                              color: '#6E7072',
                              marginTop: '4px',
                              fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                            }
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              fontSize: '14px',
                              backgroundColor: '#FFFFFF',
                              '& fieldset': {
                                borderColor: '#CBCCCD',
                                borderRadius: '4px'
                              },
                              '&.Mui-disabled': {
                                backgroundColor: '#FFFFFF'
                              }
                            },
                            '& .MuiInputBase-input': {
                              padding: '10px 12px',
                              fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                            }
                          }}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      <div>
                        <Typography
                          component="label"
                          sx={{
                            fontSize: '14px',
                            fontWeight: 700,
                            color: '#323334',
                            display: 'block',
                            mb: 0.5,
                            fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                            height: '20px',
                            lineHeight: '20px'
                          }}
                        >
                          Price List Name
                          <Typography component="span" sx={{color: '#C40000', ml: 0.5}}>
                            *
                          </Typography>
                        </Typography>
                        <TextField
                          value={priceListData.priceListName}
                          disabled
                          fullWidth
                          size="small"
                          helperText={`${priceListData.priceListName.length} / 50`}
                          InputProps={{
                            readOnly: true
                          }}
                          FormHelperTextProps={{
                            sx: {
                              textAlign: 'right',
                              fontSize: '12px',
                              color: '#6E7072',
                              marginTop: '4px',
                              fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                            }
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              fontSize: '14px',
                              backgroundColor: '#FFFFFF',
                              '& fieldset': {
                                borderColor: '#CBCCCD',
                                borderRadius: '4px'
                              },
                              '&.Mui-disabled': {
                                backgroundColor: '#FFFFFF'
                              }
                            },
                            '& .MuiInputBase-input': {
                              padding: '10px 12px',
                              fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                            }
                          }}
                        />
                      </div>
                    </Grid>
                  </Grid>

                  {/* Second Row: Business Sector and Price List Type */}
                  <Grid container spacing={2} sx={{mb: 2}}>
                    <Grid item xs={6}>
                      <div>
                        <Typography
                          component="label"
                          sx={{
                            fontSize: '14px',
                            fontWeight: 700,
                            color: '#323334',
                            display: 'block',
                            mb: 0.5,
                            fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                            height: '20px',
                            lineHeight: '20px'
                          }}
                        >
                          Business Sector
                        </Typography>
                        <Autocomplete
                          value={priceListData.businessSector}
                          disabled
                          options={['Administrative Services Only', 'Pharmacy Benefit Management']}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              InputProps={{
                                ...params.InputProps,
                                readOnly: true
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  fontSize: '14px',
                                  backgroundColor: '#FFFFFF',
                                  '& fieldset': {
                                    borderColor: '#CBCCCD',
                                    borderRadius: '4px'
                                  },
                                  '&.Mui-disabled': {
                                    backgroundColor: '#FFFFFF'
                                  }
                                },
                                '& .MuiInputBase-input': {
                                  padding: '4px 8px !important',
                                  fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                                }
                              }}
                            />
                          )}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      <div>
                        <Typography
                          component="label"
                          sx={{
                            fontSize: '14px',
                            fontWeight: 700,
                            color: '#323334',
                            display: 'block',
                            mb: 0.5,
                            fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                            height: '20px',
                            lineHeight: '20px'
                          }}
                        >
                          Price List Type
                        </Typography>
                        <Autocomplete
                          value={priceListData.priceListType}
                          disabled
                          options={['Base Price', 'Standard Price', 'Customer Specific']}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              InputProps={{
                                ...params.InputProps,
                                readOnly: true
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  fontSize: '14px',
                                  backgroundColor: '#FFFFFF',
                                  '& fieldset': {
                                    borderColor: '#CBCCCD',
                                    borderRadius: '4px'
                                  },
                                  '&.Mui-disabled': {
                                    backgroundColor: '#FFFFFF'
                                  }
                                },
                                '& .MuiInputBase-input': {
                                  padding: '4px 8px !important',
                                  fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                                }
                              }}
                            />
                          )}
                        />
                      </div>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2} sx={{mb: 2}}>
                    <Grid item xs={6}>
                      <div>
                        <Typography
                          component="label"
                          sx={{
                            fontSize: '14px',
                            fontWeight: 700,
                            color: '#323334',
                            display: 'block',
                            mb: 0.5,
                            fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                            height: '20px',
                            lineHeight: '20px'
                          }}
                        >
                          Effective Date/Time
                          <Typography component="span" sx={{color: '#C40000', ml: 0.5}}>
                            *
                          </Typography>
                        </Typography>
                        <DateTimePicker
                          value={dayjs(priceListData.effectiveDate)}
                          disabled
                          readOnly
                          slotProps={{
                            textField: {
                              size: 'small',
                              fullWidth: true,
                              InputProps: {
                                readOnly: true
                              },
                              sx: {
                                '& .MuiOutlinedInput-root': {
                                  fontSize: '14px',
                                  backgroundColor: '#FFFFFF',
                                  '& fieldset': {
                                    borderColor: '#CBCCCD',
                                    borderRadius: '4px'
                                  },
                                  '&.Mui-disabled': {
                                    backgroundColor: '#FFFFFF'
                                  }
                                },
                                '& .MuiInputBase-input': {
                                  padding: '10px 12px',
                                  fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                                }
                              }
                            }
                          }}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      <div>
                        <Typography
                          component="label"
                          sx={{
                            fontSize: '14px',
                            fontWeight: 700,
                            color: '#323334',
                            display: 'block',
                            mb: 0.5,
                            fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                            height: '20px',
                            lineHeight: '20px'
                          }}
                        >
                          Expiration Date/Time
                        </Typography>
                        <DateTimePicker
                          value={dayjs(priceListData.expirationDate)}
                          disabled
                          readOnly
                          slotProps={{
                            textField: {
                              size: 'small',
                              fullWidth: true,
                              InputProps: {
                                readOnly: true
                              },
                              sx: {
                                '& .MuiOutlinedInput-root': {
                                  fontSize: '14px',
                                  backgroundColor: '#FFFFFF',
                                  '& fieldset': {
                                    borderColor: '#CBCCCD',
                                    borderRadius: '4px'
                                  },
                                  '&.Mui-disabled': {
                                    backgroundColor: '#FFFFFF'
                                  }
                                },
                                '& .MuiInputBase-input': {
                                  padding: '10px 12px',
                                  fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                                }
                              }
                            }
                          }}
                        />
                      </div>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Right Column - Eligibility Conditions */}
                <Grid item xs={12} md={6}>
                  <div>
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2}}>
                      <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                        <Typography
                          sx={{
                            fontSize: '16px',
                            fontWeight: 700,
                            color: '#002677',
                            fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                          }}
                        >
                          Eligibility Conditions
                        </Typography>
                        <Chip
                          label={priceListData.eligibilityConditions.length}
                          size="small"
                          sx={{
                            backgroundColor: '#E8F0FE',
                            color: '#002677',
                            fontWeight: 600,
                            height: '24px',
                            minWidth: '32px',
                            fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Eligibility Conditions Table */}
                    <Box sx={{border: '1px solid #CBCCCD', borderRadius: '4px'}}>
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{backgroundColor: '#F5F5F5'}}>
                            <TableCell
                              sx={{
                                fontWeight: 700,
                                fontSize: '12px',
                                color: '#323334',
                                borderBottom: '1px solid #CBCCCD',
                                fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                                width: '60px',
                                padding: '8px'
                              }}
                            >
                              Seq No
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 700,
                                fontSize: '12px',
                                color: '#323334',
                                borderBottom: '1px solid #CBCCCD',
                                fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                                padding: '8px'
                              }}
                            >
                              Condition Description
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 700,
                                fontSize: '12px',
                                color: '#323334',
                                borderBottom: '1px solid #CBCCCD',
                                fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                                width: '100px',
                                textAlign: 'center',
                                padding: '8px'
                              }}
                            >
                              Action
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {priceListData.eligibilityConditions.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={3} sx={{textAlign: 'center', py: 4, borderBottom: 'none'}}>
                                <Typography
                                  sx={{
                                    fontSize: '12px',
                                    color: '#6E7072',
                                    fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                                  }}
                                >
                                  No eligibility conditions found
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ) : (
                            priceListData.eligibilityConditions.map((condition, index) => (
                              <TableRow
                                // eslint-disable-next-line react/no-array-index-key
                                key={`eligibility-condition-${index}`}
                                sx={{
                                  '&:hover': {backgroundColor: '#F9F9F9'},
                                  '&:last-child td': {borderBottom: 'none'}
                                }}
                              >
                                <TableCell
                                  sx={{
                                    fontSize: '12px',
                                    color: '#4B4D4F',
                                    borderBottom: '1px solid #EBEBEB',
                                    fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                                    padding: '8px'
                                  }}
                                >
                                  {index + 1}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    fontSize: '12px',
                                    color: '#4B4D4F',
                                    borderBottom: '1px solid #EBEBEB',
                                    fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                                    padding: '8px'
                                  }}
                                >
                                  {condition.conditionDescription}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    borderBottom: '1px solid #EBEBEB',
                                    textAlign: 'center',
                                    padding: '8px'
                                  }}
                                >
                                  <Tooltip title="View">
                                    <IconButton
                                      size="small"
                                      onClick={() => {
                                        handleViewCondition(condition);
                                      }}
                                      sx={{
                                        color: '#0C55B8',
                                        padding: '4px',
                                        '&:hover': {
                                          backgroundColor: 'rgba(12, 85, 184, 0.08)'
                                        }
                                      }}
                                    >
                                      <VisibilityOutlinedIcon sx={{fontSize: '16px'}} />
                                    </IconButton>
                                  </Tooltip>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </Box>
                  </div>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Price List Entries Tab */}
            <TabPanel value={activeTab} index={1}>
              <div>
                {/* Entries Table */}
                <Box sx={{border: '1px solid #CBCCCD', borderRadius: '4px'}}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{backgroundColor: '#F5F5F5'}}>
                        <TableCell
                          sx={{
                            fontWeight: 700,
                            fontSize: '14px',
                            color: '#323334',
                            borderBottom: '1px solid #CBCCCD',
                            fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                            padding: '12px',
                            textAlign: 'center'
                          }}
                        >
                          Actions
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 700,
                            fontSize: '14px',
                            color: '#323334',
                            borderBottom: '1px solid #CBCCCD',
                            fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                            padding: '12px'
                          }}
                        >
                          Service Description
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 700,
                            fontSize: '14px',
                            color: '#323334',
                            borderBottom: '1px solid #CBCCCD',
                            fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                            padding: '12px'
                          }}
                        >
                          Product Code
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 700,
                            fontSize: '14px',
                            color: '#323334',
                            borderBottom: '1px solid #CBCCCD',
                            fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                            padding: '12px'
                          }}
                        >
                          Pricing Currency
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 700,
                            fontSize: '14px',
                            color: '#323334',
                            borderBottom: '1px solid #CBCCCD',
                            fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                            padding: '12px'
                          }}
                        >
                          Effective Date
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 700,
                            fontSize: '14px',
                            color: '#323334',
                            borderBottom: '1px solid #CBCCCD',
                            fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                            padding: '12px'
                          }}
                        >
                          Expiration Date
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 700,
                            fontSize: '14px',
                            color: '#323334',
                            borderBottom: '1px solid #CBCCCD',
                            fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                            padding: '12px',
                            textAlign: 'center'
                          }}
                        >
                          Rule Count
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 700,
                            fontSize: '14px',
                            color: '#323334',
                            borderBottom: '1px solid #CBCCCD',
                            fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                            padding: '12px'
                          }}
                        >
                          Price
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 700,
                            fontSize: '14px',
                            color: '#323334',
                            borderBottom: '1px solid #CBCCCD',
                            fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                            padding: '12px',
                            textAlign: 'center'
                          }}
                        >
                          Status
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {entriesLoading && (
                        <TableRow>
                          <TableCell colSpan={9} sx={{textAlign: 'center', py: 4, borderBottom: 'none'}}>
                            <Typography
                              sx={{
                                fontSize: '14px',
                                color: '#6E7072',
                                fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                              }}
                            >
                              Loading entries...
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                      {!entriesLoading && (!priceListEntries || priceListEntries.length === 0) && (
                        <TableRow>
                          <TableCell colSpan={9} sx={{textAlign: 'center', py: 4, borderBottom: 'none'}}>
                            <Typography
                              sx={{
                                fontSize: '14px',
                                color: '#6E7072',
                                fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                              }}
                            >
                              No price list entries found
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                      {!entriesLoading &&
                        priceListEntries &&
                        priceListEntries.length > 0 &&
                        paginatedEntries.map((entry) => (
                          <TableRow
                            key={entry.priceListEntryId}
                            sx={{
                              '&:hover': {backgroundColor: '#F9F9F9'},
                              '&:last-child td': {borderBottom: 'none'}
                            }}
                          >
                            <TableCell
                              sx={{
                                borderBottom: '1px solid #EBEBEB',
                                textAlign: 'center',
                                padding: '12px'
                              }}
                            >
                              <Tooltip title="View">
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    handleViewEntry(entry);
                                  }}
                                  sx={{
                                    color: '#0C55B8',
                                    padding: '4px',
                                    '&:hover': {
                                      backgroundColor: 'rgba(12, 85, 184, 0.08)'
                                    }
                                  }}
                                >
                                  <VisibilityOutlinedIcon sx={{fontSize: '16px'}} />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: '14px',
                                color: '#4B4D4F',
                                borderBottom: '1px solid #EBEBEB',
                                fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                                padding: '12px'
                              }}
                            >
                              {entry.serviceDescription}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: '14px',
                                color: '#4B4D4F',
                                borderBottom: '1px solid #EBEBEB',
                                fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                                padding: '12px'
                              }}
                            >
                              {entry.productCode}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: '14px',
                                color: '#4B4D4F',
                                borderBottom: '1px solid #EBEBEB',
                                fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                                padding: '12px'
                              }}
                            >
                              {entry.pricingCurrency === 'USD' ? 'United States dollar (USD)' : entry.pricingCurrency}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: '14px',
                                color: '#4B4D4F',
                                borderBottom: '1px solid #EBEBEB',
                                fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                                padding: '12px'
                              }}
                            >
                              {dayjs(entry.effectiveDate).format('MMM D, YYYY')}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: '14px',
                                color: '#4B4D4F',
                                borderBottom: '1px solid #EBEBEB',
                                fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                                padding: '12px'
                              }}
                            >
                              {dayjs(entry.expirationDate).format('MMM D, YYYY')}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: '14px',
                                color: '#4B4D4F',
                                borderBottom: '1px solid #EBEBEB',
                                fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                                padding: '12px',
                                textAlign: 'center'
                              }}
                            >
                              {entry.ruleCount}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: '14px',
                                color: '#4B4D4F',
                                borderBottom: '1px solid #EBEBEB',
                                fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                                padding: '12px'
                              }}
                            >
                              {entry.price}
                            </TableCell>
                            <TableCell
                              sx={{
                                borderBottom: '1px solid #EBEBEB',
                                padding: '12px',
                                textAlign: 'center'
                              }}
                            >
                              <Chip
                                label={entry.status === 'ACT' ? 'Active' : 'Inactive'}
                                size="small"
                                sx={{
                                  backgroundColor: '#E8F5E9',
                                  color: '#2E7D32',
                                  fontWeight: 600,
                                  fontSize: '11px',
                                  height: '22px',
                                  fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </Box>

                {/* Pagination */}
                {priceListData.priceListEntries && priceListData.priceListEntries.length > 0 && (
                  <Pagination
                    currentPage={entriesCurrentPage}
                    totalPages={entriesTotalPages}
                    onPageChange={handleEntriesPageChange}
                  />
                )}
              </div>
            </TabPanel>
          </Box>

          {/* Action Buttons Footer */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
              px: 3,
              py: 2,
              borderTop: '1px solid #EBEBEB'
            }}
          >
            <Button
              variant="outlined"
              onClick={handleBack}
              sx={{
                textTransform: 'none',
                borderColor: '#002677',
                color: '#002677',
                fontSize: '14px',
                fontWeight: 600,
                borderRadius: '46px',
                padding: '6px 24px',
                fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                '&:hover': {
                  borderColor: '#001a5c',
                  backgroundColor: 'rgba(0, 38, 119, 0.04)'
                }
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>

        {/* Eligibility Condition View Dialog */}
        <Dialog
          open={conditionDialogOpen}
          onClose={handleCloseConditionDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '8px',
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
            }
          }}
        >
          <DialogTitle
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              borderBottom: '1px solid #EBEBEB',
              pb: 2,
              pt: 2.5,
              px: 3
            }}
          >
            <LockIcon sx={{fontSize: '20px', color: '#002677'}} />
            <Typography
              sx={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#002677',
                fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
              }}
            >
              View Eligibility Condition
            </Typography>
          </DialogTitle>

          <DialogContent sx={{px: 3, pt: 3, pb: 2}}>
            {/* Main Tab Content */}
            <div>
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#002677',
                  mb: 2,
                  pb: 1,
                  borderBottom: '2px solid #002677',
                  display: 'inline-block',
                  fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                }}
              >
                Main
              </Typography>

              {/* First Row: Condition Description (full width) */}
              <Box sx={{mb: 2}}>
                <Grid item xs={6}>
                  <Typography
                    component="label"
                    sx={{
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#323334',
                      display: 'block',
                      mb: 0.5,
                      fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                      height: '20px',
                      lineHeight: '20px'
                    }}
                  >
                    Description
                    <Typography component="span" sx={{color: '#C40000', ml: 0.5}}>
                      *
                    </Typography>
                  </Typography>
                  <TextField
                    value={selectedCondition?.conditionDescription || ''}
                    disabled
                    fullWidth
                    size="small"
                    helperText={`${selectedCondition?.conditionDescription?.length || 0} / 50`}
                    InputProps={{
                      readOnly: true
                    }}
                    FormHelperTextProps={{
                      sx: {
                        textAlign: 'right',
                        fontSize: '12px',
                        color: '#6E7072',
                        marginTop: '4px',
                        fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                      }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        fontSize: '14px',
                        backgroundColor: '#FFFFFF',
                        '& fieldset': {
                          borderColor: '#CBCCCD',
                          borderRadius: '4px'
                        },
                        '&.Mui-disabled': {
                          backgroundColor: '#FFFFFF'
                        }
                      },
                      '& .MuiInputBase-input': {
                        padding: '10px 12px',
                        fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                      }
                    }}
                  />
                </Grid>
              </Box>

              {/* Second Row: If Condition True and If Condition False (side by side) */}
              <Grid container spacing={2} sx={{mb: 2}}>
                <Grid item xs={6}>
                  <div>
                    <Typography
                      component="label"
                      sx={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: '#323334',
                        display: 'block',
                        mb: 0.5,
                        fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                        height: '20px',
                        lineHeight: '20px'
                      }}
                    >
                      If Condition True
                    </Typography>
                    <Autocomplete
                      value={selectedCondition?.ifConditionTrue || ''}
                      disabled
                      options={['Evaluate Next Condition', 'Error During Evaluation', 'Continue Processing']}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          InputProps={{
                            ...params.InputProps,
                            readOnly: true
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              fontSize: '14px',
                              backgroundColor: '#FFFFFF',
                              '& fieldset': {
                                borderColor: '#CBCCCD',
                                borderRadius: '4px'
                              },
                              '&.Mui-disabled': {
                                backgroundColor: '#FFFFFF'
                              }
                            },
                            '& .MuiInputBase-input': {
                              padding: '4px 8px !important',
                              fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                            }
                          }}
                        />
                      )}
                    />
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div>
                    <Typography
                      component="label"
                      sx={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: '#323334',
                        display: 'block',
                        mb: 0.5,
                        fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                        height: '20px',
                        lineHeight: '20px'
                      }}
                    >
                      If Condition False
                    </Typography>
                    <Autocomplete
                      value={selectedCondition?.ifConditionFalse || ''}
                      disabled
                      options={['Evaluate Next Condition', 'Error During Evaluation', 'Continue Processing']}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          InputProps={{
                            ...params.InputProps,
                            readOnly: true
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              fontSize: '14px',
                              backgroundColor: '#FFFFFF',
                              '& fieldset': {
                                borderColor: '#CBCCCD',
                                borderRadius: '4px'
                              },
                              '&.Mui-disabled': {
                                backgroundColor: '#FFFFFF'
                              }
                            },
                            '& .MuiInputBase-input': {
                              padding: '4px 8px !important',
                              fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                            }
                          }}
                        />
                      )}
                    />
                  </div>
                </Grid>
              </Grid>

              {/* Third Row: Condition Type (half width) */}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <div>
                    <Typography
                      component="label"
                      sx={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: '#323334',
                        display: 'block',
                        mb: 0.5,
                        fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                        height: '20px',
                        lineHeight: '20px'
                      }}
                    >
                      Condition Type
                    </Typography>
                    <Autocomplete
                      value={selectedCondition?.conditionType || ''}
                      disabled
                      options={['Contract Terms', 'Member Eligibility', 'Plan Coverage', 'Provider Network']}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          InputProps={{
                            ...params.InputProps,
                            readOnly: true
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              fontSize: '14px',
                              backgroundColor: '#FFFFFF',
                              '& fieldset': {
                                borderColor: '#CBCCCD'
                              },
                              '&.Mui-disabled': {
                                backgroundColor: '#FFFFFF'
                              }
                            },
                            '& .MuiInputBase-input': {
                              padding: '4px 8px !important',
                              fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                            }
                          }}
                        />
                      )}
                    />
                  </div>
                </Grid>
              </Grid>
            </div>
          </DialogContent>

          <DialogActions
            sx={{
              px: 3,
              py: 2,
              borderTop: '1px solid #EBEBEB'
            }}
          >
            <Button
              onClick={handleCloseConditionDialog}
              variant="outlined"
              sx={{
                textTransform: 'none',
                borderColor: '#002677',
                color: '#002677',
                fontSize: '14px',
                fontWeight: 600,
                px: 3,
                fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                '&:hover': {
                  borderColor: '#001a5c',
                  backgroundColor: 'rgba(0, 38, 119, 0.04)'
                }
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
}

export default PriceListDetailsPage;
