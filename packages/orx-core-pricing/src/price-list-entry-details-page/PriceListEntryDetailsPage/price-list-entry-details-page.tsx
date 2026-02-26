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
import type {PriceListEntry, PriceRule, EligibilityCondition} from '../../services';
import {LoadingSpinner, ErrorMessage} from '../../components';

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
      id={`entry-tabpanel-${index}`}
      aria-labelledby={`entry-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{pt: 3}}>{children}</Box>}
    </div>
  );
}

/**
 * PriceListEntryDetailsPage component displays detailed information about a price list entry
 */
export function PriceListEntryDetailsPage() {
  const {priceListId, entryId} = useParams<{priceListId: string; entryId: string}>();
  const navigate = useNavigate();

  const [entryData, setEntryData] = React.useState<PriceListEntry | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState(0);
  const [selectedRule, setSelectedRule] = React.useState<PriceRule | null>(null);
  const [conditionDialogOpen, setConditionDialogOpen] = React.useState(false);
  const [selectedCondition, setSelectedCondition] = React.useState<EligibilityCondition | null>(null);

  // Fetch entry data
  const fetchEntryData = React.useCallback(async () => {
    if (!priceListId || !entryId) {
      setError('Price List ID and Entry ID are required');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const entry = await priceListApiService.getPriceListEntryById(entryId);
      setEntryData(entry);
    } catch (err) {
      const errorMessage = err as {message?: string};
      setError(errorMessage?.message || 'Failed to load entry details');
    } finally {
      setLoading(false);
    }
  }, [priceListId, entryId]);

  React.useEffect(() => {
    fetchEntryData().catch(console.error);
  }, [fetchEntryData]);

  const handleBack = () => {
    navigate(`/price-lists/${priceListId}`);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleViewRule = (rule: PriceRule) => {
    setSelectedRule(rule);
  };

  const handleBackToRulesList = () => {
    setSelectedRule(null);
  };

  const handleCloseConditionDialog = () => {
    setConditionDialogOpen(false);
    setSelectedCondition(null);
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{py: 3}}>
        <LoadingSpinner message="Loading entry details..." />
      </Container>
    );
  }

  if (error || !entryData) {
    return (
      <Container maxWidth="xl" sx={{py: 3}}>
        <ErrorMessage message={error || 'Entry not found'} onRetry={fetchEntryData} />
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
            Price List Entry
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
          {/* Tabs */}
          <Box sx={{borderBottom: 1, borderColor: 'divider', px: 3}}>
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
              <Tab label="Entry Details" />
              <Tab
                label={
                  <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                    <span>Price Rules</span>
                    <Chip
                      label={entryData.priceRules?.length || 0}
                      size="small"
                      sx={{
                        backgroundColor: '#E8F0FE',
                        color: '#002677',
                        fontWeight: 600,
                        height: '20px',
                        minWidth: '24px',
                        fontSize: '11px',
                        fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                      }}
                    />
                  </Box>
                }
              />
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box sx={{px: 3, pb: 3}}>
            {/* Entry Details Tab */}
            <TabPanel value={activeTab} index={0}>
              <div>
                {/* First Row: Service Description (half width) */}
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
                        Service Description
                        <Typography component="span" sx={{color: '#C40000', ml: 0.5}}>
                          *
                        </Typography>
                      </Typography>
                      <TextField
                        value={entryData.serviceDescription}
                        disabled
                        fullWidth
                        size="small"
                        helperText={`${entryData.serviceDescription.length} / 100`}
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

                {/* Second Row: Product Code and Pricing Currency */}
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
                        Product Code
                        <Typography component="span" sx={{color: '#C40000', ml: 0.5}}>
                          *
                        </Typography>
                      </Typography>
                      <TextField
                        value={entryData.productCode}
                        disabled
                        fullWidth
                        size="small"
                        InputProps={{
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
                        Pricing Currency
                        <Typography component="span" sx={{color: '#C40000', ml: 0.5}}>
                          *
                        </Typography>
                      </Typography>
                      <Autocomplete
                        value={entryData.pricingCurrency === 'USD' ? 'United States dollar' : entryData.pricingCurrency}
                        disabled
                        options={['United States dollar', 'Euro', 'British Pound']}
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

                {/* Third Row: Effective Date and Expiration Date */}
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
                        value={dayjs(entryData.effectiveDate)}
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
                        value={dayjs(entryData.expirationDate)}
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
              </div>
            </TabPanel>

            {/* Price Rules Tab */}
            <TabPanel value={activeTab} index={1}>
              {!selectedRule ? (
                // Show Rules List
                <div>
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
                            Price Rule Name
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
                            Pricing Scheme
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
                            Value Type
                          </TableCell>
                          {/* <TableCell
                            sx={{
                              fontWeight: 700,
                              fontSize: '14px',
                              color: '#323334',
                              borderBottom: '1px solid #CBCCCD',
                              fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                              padding: '12px'
                            }}
                          >
                            Line Quantity Attribute
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
                            Accounting Code
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
                            Decimals Precision
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
                            Rounding Policy
                          </TableCell> */}
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
                            Rate
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {!entryData.priceRules || entryData.priceRules.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} sx={{textAlign: 'center', py: 4, borderBottom: 'none'}}>
                              <Typography
                                sx={{
                                  fontSize: '14px',
                                  color: '#6E7072',
                                  fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                                }}
                              >
                                No price rules found
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ) : (
                          entryData.priceRules.map((rule) => (
                            <TableRow
                              key={rule.ruleId}
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
                                      handleViewRule(rule);
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
                                {rule.ruleName}
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
                                {rule.pricingScheme}
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
                                {rule.valueType}
                              </TableCell>
                              {/* <TableCell
                                sx={{
                                  fontSize: '14px',
                                  color: '#4B4D4F',
                                  borderBottom: '1px solid #EBEBEB',
                                  fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                                  padding: '12px'
                                }}
                              >
                                {rule.lineQuantityAttribute}
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
                                {rule.roundingPolicy}
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
                                {rule.accountingCode}
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
                                {rule.decimalPosition}
                              </TableCell> */}
                              <TableCell
                                sx={{
                                  fontSize: '14px',
                                  color: '#4B4D4F',
                                  borderBottom: '1px solid #EBEBEB',
                                  fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                                  padding: '12px'
                                }}
                              >
                                {rule.rate}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </Box>
                </div>
              ) : (
                // Show Rule Details Inline
                <div>
                  {/* Back Button */}
                  <Box sx={{mb: 3}}>
                    <Button
                      startIcon={<ArrowBackIosIcon />}
                      onClick={handleBackToRulesList}
                      sx={{
                        textTransform: 'none',
                        color: '#002677',
                        fontSize: '18px',
                        fontWeight: 600,
                        p: 0,
                        '&:hover': {
                          backgroundColor: 'transparent'
                        }
                      }}
                    >
                      Price Rules
                    </Button>
                  </Box>

                  {/* Rule Details Content - Two Column Layout */}
                  <Grid container spacing={3}>
                    {/* Left Column - Form Fields */}
                    <Grid item xs={12} md={6}>
                      {/* First Row: Rule Name and Pricing Scheme */}
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
                              Price Rule Name
                              <Typography component="span" sx={{color: '#C40000', ml: 0.5}}>
                                *
                              </Typography>
                            </Typography>
                            <TextField
                              value={selectedRule.ruleName}
                              disabled
                              fullWidth
                              size="small"
                              helperText={`${selectedRule.ruleName.length} / 50`}
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
                              Pricing Scheme
                            </Typography>
                            <Autocomplete
                              value={selectedRule.pricingScheme}
                              disabled
                              options={['Flat-Fee Pricing (FLT)', 'Tiered Pricing', 'Volume Pricing']}
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

                      {/* Second Row: Value Type and Line Quantity Attribute */}
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
                              Value Type
                            </Typography>
                            <Autocomplete
                              value={selectedRule.valueType}
                              disabled
                              options={['Amount (AMT)', 'Percentage', 'Fixed']}
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
                              Line Quantity Attribute
                            </Typography>
                            <Autocomplete
                              value={selectedRule.lineQuantityAttribute}
                              disabled
                              options={['Line', 'Quantity', 'Unit']}
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

                      {/* Third Row: Accounting Code (half width) */}
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
                              Accounting Code
                            </Typography>
                            <TextField
                              value={selectedRule.accountingCode}
                              disabled
                              fullWidth
                              size="small"
                              InputProps={{
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
                              Decimals Precision
                            </Typography>
                            <Autocomplete
                              value={
                                selectedRule.decimalPosition !== undefined
                                  ? selectedRule.decimalPosition.toString()
                                  : '2'
                              }
                              disabled
                              options={['0', '1', '2', '3', '4']}
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

                      {/* Fourth Row: Decimal Position and Rounding Policy */}
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
                              Rounding Policy
                            </Typography>
                            <Autocomplete
                              value={selectedRule.roundingPolicy}
                              disabled
                              options={['Nearest (NR)', 'Round Up', 'Round Down', 'Truncate']}
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
                    </Grid>

                    {/* Right Column - Price Details and Eligibility Conditions */}
                    <Grid item xs={12} md={6}>
                      {/* Price Details Section */}
                      <Box sx={{mb: 3}}>
                        <Typography
                          sx={{
                            fontSize: '16px',
                            fontWeight: 700,
                            color: '#002677',
                            mb: 2,
                            fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                          }}
                        >
                          Price Details
                        </Typography>
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
                            Rate
                            <Typography component="span" sx={{color: '#C40000', ml: 0.5}}>
                              *
                            </Typography>
                          </Typography>
                          <TextField
                            value={selectedRule.rate}
                            disabled
                            fullWidth
                            size="small"
                            InputProps={{
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
                                padding: '10px 12px',
                                fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                              }
                            }}
                          />
                        </div>
                      </Box>

                      {/* Eligibility Conditions Section */}
                      {/* <Box>
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
                              label={selectedRule.eligibilityConditions.length}
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
                              {selectedRule.eligibilityConditions.length === 0 ? (
                                <TableRow>
                                  <TableCell colSpan={3} sx={{textAlign: 'center', py: 4, borderBottom: 'none'}}>
                                    <Typography
                                      sx={{
                                        fontSize: '12px',
                                        color: '#6E7072',
                                        fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                                      }}
                                    >
                                      No eligibility condition is added to price rule.
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              ) : (
                                selectedRule.eligibilityConditions.map((condition, index) => (
                                  <TableRow
                                    key={index}
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
                                          onClick={() => handleViewCondition(condition, index)}
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
                      </Box> */}
                    </Grid>
                  </Grid>
                </div>
              )}
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
                    InputProps={{
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
                        padding: '10px 12px',
                        fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                      }
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: '12px',
                      color: '#6E7072',
                      mt: 0.5,
                      fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                    }}
                  >
                    {selectedCondition?.conditionDescription?.length || 0} / 50
                  </Typography>
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

export default PriceListEntryDetailsPage;
