// Type for a single CAG item returned from the API
import React, {useState, useEffect} from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  TextField
} from '@mui/material';
import type {TextFieldProps} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SearchIcon from '@mui/icons-material/Search';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

import {cagsApiService} from '../services/cags-api.service';

import {CagsTable} from './cags-table';

export interface CAGListItem {
  id?: string;
  cagId?: string;
  carrierName?: string;
  carrier?: string;
  carrierId?: string;
  accountName?: string;
  account?: string;
  accountId?: string;
  groupName?: string;
  group?: string;
  groupId?: string;
}

// Type for the paged response from getCAGsPaged
export interface GetCAGsPagedResponse {
  cagList: CAGListItem[];
  count: number;
}

/** Assignment level types */
export type AssignmentLevel = 'carrier' | 'account' | 'group';

/** Unassigned CAG data structure */
export interface UnassignedCAG {
  id: string;
  carrierId?: string;
  carrierName?: string;
  accountId?: string;
  accountName?: string;
  groupId?: string;
  groupName?: string;
}

/**
 * Props for the AssignCags component
 */
export interface AssignCagsProps {
  /** Title for the accordion */
  title?: string;
  /** Callback when assignment level changes */
  onAssignmentLevelChange?: (level: AssignmentLevel) => void;
  operationUnit: {
    operationUnitInternalId?: string;
    [key: string]: any;
  };
  /** Control accordion expansion from parent */
  expanded?: boolean;
  /** Callback when accordion expansion changes */
  onExpandedChange?: (expanded: boolean) => void;
  /** Callback to handle CAG assignment */
  onAssignCAGs?: (payload: {
    operationUnitInternalId: string;
    cagIds: string[];
    assignmentType: string;
    startDate: string;
    endDate?: string;
  }) => Promise<void>;
}

/**
 * AssignCags component displays an accordion for assigning CAGs
 */
export const AssignCags: React.FC<AssignCagsProps> = ({
  title = 'Assign CAG List',
  onAssignmentLevelChange,
  operationUnit,
  expanded: controlledExpanded,
  onExpandedChange,
  onAssignCAGs
}) => {
  const [internalExpanded, setInternalExpanded] = useState<boolean>(false);

  // Use controlled expanded state if provided, otherwise use internal state
  const expanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  const [assignmentLevel, setAssignmentLevel] = useState<AssignmentLevel>('carrier');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [carrierName, setCarrierName] = useState<string>('');
  const [carrierId, setCarrierId] = useState<string>('');
  const [accountName, setAccountName] = useState<string>('');
  const [accountId, setAccountId] = useState<string>('');
  const [groupName, setGroupName] = useState<string>('');
  const [groupId, setGroupId] = useState<string>('');
  const [assignAction, setAssignAction] = useState<string>('Assign');
  const [selectedCAGIds, setSelectedCAGIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [unassignedCAGs, setUnassignedCAGs] = useState<UnassignedCAG[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [isAssigning, setIsAssigning] = useState<boolean>(false);
  const [dateWarning, setDateWarning] = useState<string>('');

  const PAGE_SIZE = 10;

  /**
   * Fetch unassigned CAGs based on assignment level and filter values
   * Can accept optional parameters to override current state (useful for clear/reset)
   */
  const fetchUnassignedCAGs = async (overrideParams?: {
    carrierId?: string;
    carrierName?: string;
    accountId?: string;
    accountName?: string;
    groupId?: string;
    groupName?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
  }) => {
    setLoading(true);
    try {
      // Use override params if provided, otherwise use current state
      const params: Record<string, any> = {
        carrierId: overrideParams?.carrierId !== undefined ? overrideParams.carrierId : carrierId,
        carrierName: overrideParams?.carrierName !== undefined ? overrideParams.carrierName : carrierName,
        assignmentLevel
      };

      // Add account fields if assignment level includes account
      if (assignmentLevel === 'account' || assignmentLevel === 'group') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        params['accountId'] = overrideParams?.accountId !== undefined ? overrideParams.accountId : accountId;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        params['accountName'] = overrideParams?.accountName !== undefined ? overrideParams.accountName : accountName;
      }

      // Add group fields if assignment level includes group
      if (assignmentLevel === 'group') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        params['groupId'] = overrideParams?.groupId !== undefined ? overrideParams.groupId : groupId;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        params['groupName'] = overrideParams?.groupName !== undefined ? overrideParams.groupName : groupName;
      }

      // Add date filters
      const effectiveStartDate = overrideParams?.startDate !== undefined ? overrideParams.startDate : startDate;
      const effectiveEndDate = overrideParams?.endDate !== undefined ? overrideParams.endDate : endDate;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (effectiveStartDate) params['startDate'] = effectiveStartDate;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (effectiveEndDate) params['endDate'] = effectiveEndDate;

      // Remove empty string values from params
      const cleanedParams = Object.entries(params).reduce<Record<string, string>>((acc, [key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {});

      const response = (await cagsApiService.getCAGsPaged({
        page: (overrideParams?.page !== undefined ? overrideParams.page : currentPage) - 1,
        size: PAGE_SIZE,
        params: cleanedParams
      })) as GetCAGsPagedResponse;

      if (response && Array.isArray(response.cagList)) {
        const transformedData = response.cagList.map((item: CAGListItem) => ({
          id: item.id || item.cagId || '',
          carrierName: item.carrierName || item.carrier || '',
          carrierId: item.carrierId || '',
          accountName: item.accountName || item.account || '',
          accountId: item.accountId || '',
          groupName: item.groupName || item.group || '',
          groupId: item.groupId || ''
        }));
        const totalCount = response?.count || response.cagList.length;
        const calculatedTotalPages = Math.ceil(totalCount / PAGE_SIZE);
        setUnassignedCAGs(transformedData);
        setTotalPages(calculatedTotalPages);
        setTotalElements(totalCount);
      } else {
        setUnassignedCAGs([]);
        setTotalPages(0);
        setTotalElements(0);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching unassigned CAGs:', error);
      setUnassignedCAGs([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Effect to fetch CAGs when assignment level or page changes
   */
  useEffect(() => {
    // Fetch CAGs when assignment level or page changes
    fetchUnassignedCAGs().catch((err: unknown) => {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch CAGs:', err);
    });
  }, [assignmentLevel, currentPage]);

  const handleAccordionChange = (_event: React.SyntheticEvent, isExpanded: boolean) => {
    if (controlledExpanded !== undefined && onExpandedChange) {
      // If controlled, notify parent
      onExpandedChange(isExpanded);
    } else {
      // If uncontrolled, update internal state
      setInternalExpanded(isExpanded);
    }
  };

  const handleAssignmentLevelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLevel = event.target.value as AssignmentLevel;
    setAssignmentLevel(newLevel);
    setCurrentPage(1); // Reset to first page
    if (onAssignmentLevelChange) {
      onAssignmentLevelChange(newLevel);
    }
    // API call will be triggered by useEffect
  };

  const handleStartDateChange = (value: dayjs.Dayjs | null) => {
    const formattedDate = value ? value.format('YYYY-MM-DD') : '';
    setStartDate(formattedDate);
    // Clear warning when user selects a date
    if (formattedDate) {
      setDateWarning('');
    }
  };

  const handleEndDateChange = (value: dayjs.Dayjs | null) => {
    const formattedDate = value ? value.format('YYYY-MM-DD') : '';
    setEndDate(formattedDate);
  };

  const handleSearch = () => {
    // Trigger API call with current filter values
    setCurrentPage(1); // Reset to first page
    fetchUnassignedCAGs().catch((err: unknown) => {
      // eslint-disable-next-line no-console
      console.error('Search failed:', err);
    });
  };

  const handleClear = () => {
    // Clear all filter fields in state
    setCarrierName('');
    setCarrierId('');
    setAccountName('');
    setAccountId('');
    setGroupName('');
    setGroupId('');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
    setSelectedCAGIds([]);

    // Immediately fetch with empty params (avoids stale state issue)
    fetchUnassignedCAGs({
      carrierId: '',
      carrierName: '',
      accountId: '',
      accountName: '',
      groupId: '',
      groupName: '',
      startDate: '',
      endDate: '',
      page: 1
    }).catch((err: unknown) => {
      // eslint-disable-next-line no-console
      console.error('Clear failed:', err);
    });
  };

  const handleApply = () => {
    if (selectedCAGIds.length === 0) {
      return;
    }
    // Open confirmation dialog
    setConfirmDialogOpen(true);
  };

  const handleConfirmAssign = async () => {
    // Validate start date first
    if (!startDate) {
      setDateWarning('Start Date is mandatory. Please select a start date.');
      return;
    }

    setIsAssigning(true);
    try {
      // Validate required fields
      if (!operationUnit?.operationUnitInternalId) {
        // eslint-disable-next-line no-console
        console.error('Operational unit internal ID is missing');
        // eslint-disable-next-line no-alert
        alert('Operational unit information is missing. Please refresh the page and try again.');
        setIsAssigning(false);
        return;
      }

      if (selectedCAGIds.length === 0) {
        // eslint-disable-next-line no-console
        console.error('No CAG IDs selected');
        // eslint-disable-next-line no-alert
        alert('Please select at least one CAG to assign.');
        setIsAssigning(false);
        return;
      }

      const requestPayload = {
        operationUnitInternalId: operationUnit.operationUnitInternalId,
        cagIds: selectedCAGIds,
        assignmentType: assignmentLevel,
        startDate,
        ...(endDate && {endDate})
      };

      // Make API call to assign CAGs via parent handler
      if (onAssignCAGs) {
        await onAssignCAGs(requestPayload);
      }

      // Close dialog
      setConfirmDialogOpen(false);

      // Clear selections and dates
      setSelectedCAGIds([]);
      setStartDate('');
      setEndDate('');
      setDateWarning(''); // Clear warning after successful assignment

      // Refresh the table data
      fetchUnassignedCAGs().catch((err: unknown) => {
        // eslint-disable-next-line no-console
        console.error('Failed to refresh table:', err);
      });
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error('Error assigning CAGs:', error);
      // eslint-disable-next-line no-console, @typescript-eslint/no-unsafe-member-access
      console.error('Error response:', error?.response?.data);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const errorMessage =
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        error?.response?.data?.message || error?.message || 'Failed to assign CAGs. Please try again.';
      // eslint-disable-next-line no-alert
      alert(errorMessage);
    } finally {
      setIsAssigning(false);
    }
  };

  const handleCancelAssign = () => {
    setConfirmDialogOpen(false);
    setDateWarning(''); // Clear warning when dialog is closed
  };

  const handleAssignActionChange = (event: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    setAssignAction(event.target.value);
  };

  const handleSelectAllCAGs = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedCAGIds(unassignedCAGs.map((cag) => cag.id));
    } else {
      setSelectedCAGIds([]);
    }
  };

  const handleSelectCAG = (id: string) => {
    setSelectedCAGIds((prev) => (prev.includes(id) ? prev.filter((cagId) => cagId !== id) : [...prev, id]));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedCAGIds([]); // Clear selections when changing pages
  };

  // Helper function to calculate column span based on assignment level
  const getColumnSpan = () => {
    if (assignmentLevel === 'carrier') return 2;
    if (assignmentLevel === 'account') return 3;
    return 4;
  };

  return (
    <>
      <Accordion
        id="assign-cags-accordion"
        expanded={expanded}
        onChange={handleAccordionChange}
        sx={{
          borderRadius: '4px',
          border: '1px solid #CBCCCD',
          boxShadow: 'none',
          backgroundColor: '#FFFFFF',
          overflow: 'hidden',
          '&:before': {
            display: 'none'
          },
          '&.Mui-expanded': {
            margin: 0
          },
          '&:not(.Mui-expanded)': {
            minHeight: '64px'
          }
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            px: 3,
            py: 2.5,
            minHeight: '64px',
            '& .MuiAccordionSummary-content': {
              margin: 0,
              '&.Mui-expanded': {
                margin: 0
              }
            }
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: '20px',
              fontWeight: 700,
              color: '#002677',
              fontFamily: '"Enterprise Sans VF", sans-serif'
            }}
          >
            {title}{' '}
            {operationUnit['operationUnitName'] && (
              <span style={{color: '#000000'}}>- {operationUnit['operationUnitName']}</span>
            )}
          </Typography>
        </AccordionSummary>

        <AccordionDetails sx={{px: 3, py: 2, minHeight: 'auto'}}>
          <div>
            <FormControl component="fieldset">
              <FormLabel
                component="legend"
                sx={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#000000',
                  fontFamily: '"Enterprise Sans VF", sans-serif',
                  mb: 2,
                  '&.Mui-focused': {
                    color: '#000000'
                  }
                }}
              >
                Search CAGs
                <span style={{color: '#FF0000'}}>*</span>
              </FormLabel>
              <RadioGroup
                value={assignmentLevel}
                onChange={handleAssignmentLevelChange}
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 3
                }}
              >
                <FormControlLabel
                  value="carrier"
                  control={<Radio sx={{'&.Mui-checked': {color: '#002677'}}} />}
                  label={
                    <Typography
                      sx={{
                        fontSize: '14px',
                        color: '#4B4D4F',
                        fontFamily: '"Enterprise Sans VF", sans-serif'
                      }}
                    >
                      Carrier
                    </Typography>
                  }
                />
                <FormControlLabel
                  value="account"
                  control={<Radio sx={{'&.Mui-checked': {color: '#002677'}}} />}
                  label={
                    <Typography
                      sx={{
                        fontSize: '14px',
                        color: '#4B4D4F',
                        fontFamily: '"Enterprise Sans VF", sans-serif'
                      }}
                    >
                      Carrier + Account
                    </Typography>
                  }
                />
                <FormControlLabel
                  value="group"
                  control={<Radio sx={{'&.Mui-checked': {color: '#002677'}}} />}
                  label={
                    <Typography
                      sx={{
                        fontSize: '14px',
                        color: '#4B4D4F',
                        fontFamily: '"Enterprise Sans VF", sans-serif'
                      }}
                    >
                      Carrier + Account + Group
                    </Typography>
                  }
                />
              </RadioGroup>
            </FormControl>

            {/* Filter by section */}
            <Box sx={{mt: 3}}>
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 400,
                  color: '#4B4D4F',
                  fontFamily: '"Enterprise Sans VF", sans-serif',
                  mb: 2
                }}
              >
                Filter by:
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{display: 'flex', alignItems: 'center', mb: 0.5}}>
                    <Typography
                      component="label"
                      sx={{
                        fontSize: '16px',
                        fontWeight: 700,
                        color: 'text.primary',
                        lineHeight: 1.4
                      }}
                    >
                      Carrier Name
                    </Typography>
                  </Box>
                  <TextField
                    value={carrierName}
                    onChange={(e) => {
                      setCarrierName(e.target.value);
                    }}
                    placeholder="Enter carrier name"
                    fullWidth
                    size="small"
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
                        fontSize: '14px',
                        fontFamily: '"Enterprise Sans VF", sans-serif'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{display: 'flex', alignItems: 'center', mb: 0.5}}>
                    <Typography
                      component="label"
                      sx={{
                        fontSize: '16px',
                        fontWeight: 700,
                        color: 'text.primary',
                        lineHeight: 1.4
                      }}
                    >
                      Carrier ID
                    </Typography>
                  </Box>
                  <TextField
                    value={carrierId}
                    onChange={(e) => {
                      setCarrierId(e.target.value);
                    }}
                    placeholder="Enter carrier ID"
                    fullWidth
                    size="small"
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
                        fontSize: '14px',
                        fontFamily: '"Enterprise Sans VF", sans-serif'
                      }
                    }}
                  />
                </Grid>
              </Grid>

              {/* Account fields - shown when account or group is selected */}
              {(assignmentLevel === 'account' || assignmentLevel === 'group') && (
                <Grid container spacing={2} sx={{mt: 1}}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{display: 'flex', alignItems: 'center', mb: 0.5}}>
                      <Typography
                        component="label"
                        sx={{
                          fontSize: '16px',
                          fontWeight: 700,
                          color: 'text.primary',
                          lineHeight: 1.4
                        }}
                      >
                        Account Name
                      </Typography>
                    </Box>
                    <TextField
                      value={accountName}
                      onChange={(e) => {
                        setAccountName(e.target.value);
                      }}
                      placeholder="Enter account name"
                      fullWidth
                      size="small"
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
                          fontSize: '14px',
                          fontFamily: '"Enterprise Sans VF", sans-serif'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{display: 'flex', alignItems: 'center', mb: 0.5}}>
                      <Typography
                        component="label"
                        sx={{
                          fontSize: '16px',
                          fontWeight: 700,
                          color: 'text.primary',
                          lineHeight: 1.4
                        }}
                      >
                        Account ID
                      </Typography>
                    </Box>
                    <TextField
                      value={accountId}
                      onChange={(e) => {
                        setAccountId(e.target.value);
                      }}
                      placeholder="Enter account ID"
                      fullWidth
                      size="small"
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
                          fontSize: '14px',
                          fontFamily: '"Enterprise Sans VF", sans-serif'
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              )}

              {/* Group fields - shown only when group is selected */}
              {assignmentLevel === 'group' && (
                <Grid container spacing={2} sx={{mt: 1}}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{display: 'flex', alignItems: 'center', mb: 0.5}}>
                      <Typography
                        component="label"
                        sx={{
                          fontSize: '16px',
                          fontWeight: 700,
                          color: 'text.primary',
                          lineHeight: 1.4
                        }}
                      >
                        Group Name
                      </Typography>
                    </Box>
                    <TextField
                      value={groupName}
                      onChange={(e) => {
                        setGroupName(e.target.value);
                      }}
                      placeholder="Enter group name"
                      fullWidth
                      size="small"
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
                          fontSize: '14px',
                          fontFamily: '"Enterprise Sans VF", sans-serif'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{display: 'flex', alignItems: 'center', mb: 0.5}}>
                      <Typography
                        component="label"
                        sx={{
                          fontSize: '16px',
                          fontWeight: 700,
                          color: 'text.primary',
                          lineHeight: 1.4
                        }}
                      >
                        Group ID
                      </Typography>
                    </Box>
                    <TextField
                      value={groupId}
                      onChange={(e) => {
                        setGroupId(e.target.value);
                      }}
                      placeholder="Enter group ID"
                      fullWidth
                      size="small"
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
                          fontSize: '14px',
                          fontFamily: '"Enterprise Sans VF", sans-serif'
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              )}

              {/* Search and Clear buttons */}
              <Box sx={{display: 'flex', alignItems: 'center', gap: 2, mt: 2}}>
                <Button
                  variant="contained"
                  startIcon={<SearchIcon />}
                  onClick={handleSearch}
                  sx={{
                    backgroundColor: '#002677',
                    color: '#FFFFFF',
                    textTransform: 'none',
                    borderRadius: '46px',
                    px: 3,
                    py: 0.5,
                    minHeight: '32px',
                    fontFamily: '"Enterprise Sans VF", sans-serif',
                    fontSize: '14px',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: '#001a5c'
                    }
                  }}
                >
                  Search
                </Button>
                <Button
                  variant="text"
                  onClick={handleClear}
                  sx={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#002677',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontFamily: '"Enterprise Sans VF", sans-serif',
                    textTransform: 'none',
                    minWidth: 'auto',
                    padding: 0,
                    '&:hover': {
                      color: '#001a5c',
                      backgroundColor: 'transparent',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Clear
                </Button>
              </Box>
            </Box>
            {/* CAGs Table Component */}
            <CagsTable
              totalElements={totalElements}
              unassignedCAGs={unassignedCAGs}
              assignAction={assignAction}
              handleApply={handleApply}
              handleAssignActionChange={handleAssignActionChange}
              loading={loading}
              assignmentLevel={assignmentLevel}
              selectedCAGIds={selectedCAGIds}
              handleSelectAllCAGs={handleSelectAllCAGs}
              handleSelectCAG={handleSelectCAG}
              getColumnSpan={getColumnSpan}
              totalPages={totalPages}
              currentPage={currentPage}
              handlePageChange={handlePageChange}
            />
          </div>
        </AccordionDetails>
      </Accordion>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={handleCancelAssign}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '8px',
            padding: '8px'
          }
        }}
      >
        <DialogTitle
          sx={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#4B4D4F',
            fontFamily: '"Enterprise Sans VF", sans-serif',
            pb: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span>Bulk Actions:{assignAction.charAt(0).toUpperCase() + assignAction.slice(1)}</span>
          <IconButton
            onClick={handleCancelAssign}
            disabled={isAssigning}
            sx={{
              padding: '4px',
              color: '#4B4D4F',
              '&:hover': {
                backgroundColor: '#F5F5F5'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography
            sx={{
              fontSize: '14px',
              color: '#4B4D4F',
              fontFamily: '"Enterprise Sans VF", sans-serif',
              mb: 2
            }}
          >
            You are about to assign {selectedCAGIds.length} {assignmentLevel}
            {selectedCAGIds.length > 1 ? 's' : ''} to {operationUnit['operationUnitName']}. Please provide the
            assignment dates below.
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{display: 'flex', alignItems: 'center', mb: 0.5}}>
                <Typography
                  component="label"
                  sx={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: 'text.primary',
                    lineHeight: 1.4
                  }}
                >
                  Start Date
                  <Typography component="span" sx={{color: '#C40000', ml: 0.5}}>
                    *
                  </Typography>
                </Typography>
              </Box>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={startDate ? dayjs(startDate, 'YYYY-MM-DD') : null}
                  onChange={handleStartDateChange}
                  disabled={isAssigning}
                  inputFormat="YYYY-MM-DD"
                  components={{
                    OpenPickerIcon: CalendarMonthIcon
                  }}
                  OpenPickerButtonProps={{
                    sx: {
                      backgroundColor: '#002677',
                      borderRadius: '6px 6px 6px 6px',
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
                  renderInput={(params: TextFieldProps) => (
                    <TextField
                      {...params}
                      fullWidth
                      size="small"
                      placeholder="YYYY-MM-DD"
                      sx={{
                        height: '40px',
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '4px',
                          height: '40px',
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
                          fontSize: '16px'
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
              {dateWarning && (
                <Typography
                  sx={{
                    fontSize: '12px',
                    color: '#C40000',
                    fontFamily: '"Enterprise Sans VF", sans-serif',
                    mt: 0.5
                  }}
                >
                  {dateWarning}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <Box sx={{display: 'flex', alignItems: 'center', mb: 0.5}}>
                <Typography
                  component="label"
                  sx={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: 'text.primary',
                    lineHeight: 1.4
                  }}
                >
                  End Date
                </Typography>
              </Box>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={endDate ? dayjs(endDate, 'YYYY-MM-DD') : null}
                  onChange={handleEndDateChange}
                  disabled={isAssigning}
                  inputFormat="YYYY-MM-DD"
                  components={{
                    OpenPickerIcon: CalendarMonthIcon
                  }}
                  OpenPickerButtonProps={{
                    sx: {
                      backgroundColor: '#002677',
                      borderRadius: '6px 6px 6px 6px',
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
                  renderInput={(params: TextFieldProps) => (
                    <TextField
                      {...params}
                      fullWidth
                      size="small"
                      placeholder="YYYY-MM-DD"
                      sx={{
                        height: '40px',
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '4px',
                          height: '40px',
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
                          fontSize: '16px'
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
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{px: 3, pb: 2, justifyContent: 'flex-start', gap: '10px'}}>
          <Button
            onClick={handleConfirmAssign}
            disabled={isAssigning || !startDate}
            variant="contained"
            sx={{
              width: '133px',
              height: '40px',
              borderRadius: '46px',
              padding: '10px 24px',
              fontSize: '14px',
              fontWeight: 600,
              backgroundColor: '#002677',
              color: '#FBF9F4',
              textTransform: 'none',
              fontFamily: '"Enterprise Sans VF", sans-serif',
              '&:hover': {
                backgroundColor: '#001A52'
              },
              '&.Mui-disabled': {
                backgroundColor: '#E5E5E6',
                color: '#999999'
              }
            }}
          >
            {isAssigning ? 'Assigning...' : `Yes, ${assignAction.charAt(0).toUpperCase() + assignAction.slice(1)}`}
          </Button>
          <Button
            onClick={handleCancelAssign}
            disabled={isAssigning}
            sx={{
              width: '133px',
              height: '40px',
              borderRadius: '46px',
              padding: '10px 24px',
              fontSize: '14px',
              fontWeight: 600,
              border: '1px solid #002677',
              backgroundColor: '#FBF9F4',
              color: '#002677',
              textTransform: 'none',
              fontFamily: '"Enterprise Sans VF", sans-serif',
              '&:hover': {
                backgroundColor: '#FBF9F4'
              }
            }}
          >
            No,Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AssignCags;
