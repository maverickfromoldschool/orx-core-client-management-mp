import DeleteIcon from '@mui/icons-material/Delete';
import React, {useState} from 'react';
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Button,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Dialog,
  DialogContent,
  TextField,
  DialogTitle,
  DialogActions
} from '@mui/material';
import type {SelectChangeEvent, TextFieldProps} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

import {ClientPagination} from './client-pagination';
import {AssignedCagsFilterDrawer, AssignedCagsFilterValues} from './assigned-cags-filter-drawer';

/** Bulk action types */
export type BulkAction = 'delete' | 'inactivate' | 'activate' | '';

/**
 * Interface for assigned CAG data
 */
export interface AssignedCAG {
  id: string;
  carrierName: string;
  carrierId: string;
  accountName: string;
  accountId: string;
  groupName: string;
  groupId: string;
  assignmentStatus: string;
  startDate: string;
  endDate?: string;
  clientName?: string;
  operationUnitName?: string;
}

/**
 * Props for the AssignedCags component
 */
export interface AssignedCagsProps {
  /** Array of assigned CAG data to display */
  cags: AssignedCAG[];
  /** Currently selected CAG IDs */
  selectedIds: string[];
  /** Callback when selection changes */
  onSelectionChange: (selectedIds: string[]) => void;
  /** Callback when CAG name is clicked */
  onCAGClick?: (cag: AssignedCAG) => void;
  /** Callback when edit action is clicked */
  onEditCAG?: (cagId: string) => void;
  /** Callback when save edit is clicked */
  onSaveEdit?: (ouCagId: string, endDate: string) => Promise<void>;
  /** Callback when deactivate action is clicked */
  onDeactivateCAG?: (cagId: string) => void;
  /** Callback when delete action is clicked */
  onDeleteCAG?: (cagIds: string[]) => void;
  /** Callback when Assign CAG button is clicked */
  onAssignCAG: () => void;
  /** Callback when Filters button is clicked */
  onFiltersClick?: () => void;
  /** Callback when filters are applied */
  onFiltersApply?: (filters: AssignedCagsFilterValues) => void;
  /** Callback when bulk action is applied */
  onBulkAction?: (action: BulkAction) => void;
  /** Whether data is loading */
  isLoading?: boolean;
  /** Card title */
  title?: string;
  /** Selected operational unit */
  operationUnit?: {
    operationUnitInternalId?: string;
    operationUnitId?: string;
    operationUnitName?: string;
    [key: string]: any;
  } | null;
}

/**
 * AssignedCags component displays assigned CAG records in a data table
 * Similar to ClientTable but for CAG data
 */
export const AssignedCags: React.FC<AssignedCagsProps> = ({
  cags,
  selectedIds,
  onSelectionChange,
  onCAGClick,
  onEditCAG,
  onSaveEdit,
  onDeactivateCAG,
  onAssignCAG,
  onFiltersClick,
  onFiltersApply,
  onBulkAction,
  onDeleteCAG,
  isLoading = false,
  title = 'List of Assigned CAGs',
  operationUnit
}) => {
  const [expanded, setExpanded] = useState<boolean>(true);
  const [selectedAction, setSelectedAction] = useState<BulkAction>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [selectedCAG, setSelectedCAG] = useState<AssignedCAG | null>(null);
  const [editEndDate, setEditEndDate] = useState<string>('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [isBulkAction, setIsBulkAction] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState<boolean>(false);
  const [filterValues, setFilterValues] = useState<AssignedCagsFilterValues>({
    carrierName: '',
    carrierId: '',
    accountName: '',
    accountId: '',
    groupName: '',
    groupId: '',
    assignmentStatus: '',
    startDate: '',
    endDate: ''
  });
  const rowsPerPage = 10;
  // Ensure cags is always an array
  const safeCAGs = Array.isArray(cags) ? cags : [];

  // Calculate pagination
  const totalPages = Math.ceil(safeCAGs.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedCags = safeCAGs.slice(startIndex, endIndex);

  // Handle accordion change
  const handleAccordionChange = (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  // Handle bulk action change
  const handleActionChange = (event: SelectChangeEvent<BulkAction>) => {
    setSelectedAction(event.target.value as BulkAction);
  };

  // Handle apply button click
  const handleApply = () => {
    setIsBulkAction(true);
    setConfirmDialogOpen(true);
  };

  // Handle individual selection
  const handleSelectCAG = (cagId: string) => {
    if (selectedIds.includes(cagId)) {
      onSelectionChange(selectedIds.filter((id) => id !== cagId));
    } else {
      onSelectionChange([...selectedIds, cagId]);
    }
  };

  const handleCAGClick = (cag: AssignedCAG) => () => {
    if (onCAGClick) {
      onCAGClick(cag);
    }
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle edit dialog
  const handleOpenEditDialog = (cag: AssignedCAG) => {
    const newCAg = {...cag, operationUnitName: operationUnit?.operationUnitName || ''};
    setSelectedCAG(newCAg);
    setEditEndDate(newCAg.endDate || '');
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedCAG(null);
    setEditEndDate('');
  };

  const handleDeleteCag = (cag: AssignedCAG) => {
    setSelectedCAG(cag);
    setSelectedAction('delete');
    setIsBulkAction(false);
    setConfirmDialogOpen(true);
  };
  const handleInactivateCag = (cag: AssignedCAG) => {
    setSelectedCAG(cag);
    setSelectedAction('inactivate');
    setIsBulkAction(false);
    setConfirmDialogOpen(true);
  };

  const handleConfirmAction = () => {
    if (selectedAction && isBulkAction && onBulkAction) {
      // Bulk action
      onBulkAction(selectedAction);
    } else if (selectedAction && selectedCAG && !isBulkAction) {
      // Row-level action
      if (selectedAction === 'inactivate' && onDeactivateCAG) {
        onDeactivateCAG(selectedCAG.id);
      } else if (selectedAction === 'delete' && onDeleteCAG) {
        onDeleteCAG([selectedCAG.id]);
      }
    }

    // Reset dialog state
    setConfirmDialogOpen(false);
    setIsBulkAction(false);
    setSelectedCAG(null);
    setSelectedAction('');
  };
  const handleCancelConfirm = () => {
    setConfirmDialogOpen(false);
    setIsBulkAction(false);
    setSelectedCAG(null);
    setSelectedAction('');
  };

  // Generate dynamic subtext for confirm dialog
  const getConfirmDialogSubtext = () => {
    if (!selectedAction) return '';

    if (isBulkAction) {
      const count = selectedIds.length;
      return `You are about to ${selectedAction} ${count} carrier account${count > 1 ? 's' : ''} and ${count} carrier assignment${count > 1 ? 's' : ''}. Are you sure you want to proceed?`;
    } else {
      return `You are about to ${selectedAction} a carrier account assignment. Are you sure you want to proceed?`;
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedCAG || !editEndDate || !onSaveEdit) {
      return;
    }
    setIsSaving(true);
    try {
      await onSaveEdit(selectedCAG.id, editEndDate);

      // Close dialog after successful save
      handleCloseEditDialog();
    } catch {
      // error intentionally ignored
    } finally {
      setIsSaving(false);
    }
  };

  // Filter drawer handlers
  const handleOpenFilterDrawer = () => {
    setFilterDrawerOpen(true);
    if (onFiltersClick) {
      onFiltersClick();
    }
  };

  const handleCloseFilterDrawer = () => {
    setFilterDrawerOpen(false);
  };

  const handleApplyFilters = () => {
    if (onFiltersApply) {
      onFiltersApply(filterValues);
    }
    setFilterDrawerOpen(false);
  };

  const handleClearFilters = () => {
    const clearedFilters: AssignedCagsFilterValues = {
      carrierName: '',
      carrierId: '',
      accountName: '',
      accountId: '',
      groupName: '',
      groupId: '',
      assignmentStatus: '',
      startDate: '',
      endDate: ''
    };
    setFilterValues(clearedFilters);
    if (onFiltersApply) {
      onFiltersApply(clearedFilters);
    }
  };

  const handleFilterChange = (field: keyof AssignedCagsFilterValues, value: string) => {
    setFilterValues((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <>
      <Accordion
        expanded={expanded}
        onChange={handleAccordionChange}
        sx={{
          borderRadius: '12px',
          border: '1px solid #CBCCCD',
          boxShadow: 'none',
          backgroundColor: '#FFFFFF',
          '&:before': {
            display: 'none'
          },
          '&.Mui-expanded': {
            margin: 0
          }
        }}
      >
        {/* Accordion Header */}
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            px: 3,
            py: 2,
            '& .MuiAccordionSummary-content': {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
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
            {operationUnit?.['operationUnitName'] && (
              <span style={{color: '#000000'}}>- {operationUnit['operationUnitName']}</span>
            )}
          </Typography>

          <Button
            variant="contained"
            onClick={(event) => {
              event.stopPropagation();
              onAssignCAG();
            }}
            sx={{
              backgroundColor: '#002677',
              color: '#FFFFFF',
              textTransform: 'none',
              borderRadius: '46px',
              px: 3,
              mr: 2,
              fontFamily: '"Enterprise Sans VF", sans-serif',
              fontSize: '14px',
              fontWeight: 700,
              '&:hover': {
                backgroundColor: '#001a5c'
              }
            }}
          >
            Assign more CAGs
          </Button>
        </AccordionSummary>

        {/* Accordion Content */}
        <AccordionDetails sx={{px: 0, py: 0}}>
          {/* Action Bar */}
          <Box
            sx={{
              px: 3,
              py: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid #E5E5E6',
              borderBottom: '1px solid #E5E5E6'
            }}
          >
            {/* Left side - CAG count */}
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#4B4D4F',
                fontFamily: '"Enterprise Sans VF", sans-serif'
              }}
            >
              Number of assigned CAGs: {safeCAGs.length}
            </Typography>

            {/* Right side - Action buttons */}
            <Box sx={{display: 'flex', alignItems: 'center', gap: '12px'}}>
              {/* Apply link */}
              <Typography
                component="span"
                onClick={selectedIds.length > 0 ? handleApply : undefined}
                sx={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: selectedIds.length > 0 ? '#0C55B8' : '#CBCCCD',
                  textDecoration: selectedIds.length > 0 ? 'underline' : 'none',
                  cursor: selectedIds.length > 0 ? 'pointer' : 'not-allowed',
                  fontFamily: '"Enterprise Sans VF", sans-serif',
                  '&:hover': {
                    textDecoration: selectedIds.length > 0 ? 'underline' : 'none'
                  }
                }}
              >
                Apply
              </Typography>

              {/* Bulk actions dropdown */}
              <FormControl size="small" sx={{minWidth: 140}}>
                <Select
                  value={selectedAction}
                  onChange={handleActionChange}
                  displayEmpty
                  disabled={selectedIds.length === 0}
                  IconComponent={KeyboardArrowDownIcon}
                  sx={{
                    fontSize: '14px',
                    color: '#4B4D4F',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '4px',
                    fontFamily: '"Enterprise Sans VF", sans-serif',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#CBCCCD'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#002677'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#002677'
                    },
                    '& .MuiSelect-select': {
                      padding: '8px 12px'
                    }
                  }}
                  renderValue={(value) => {
                    if (!value) {
                      return 'Bulk actions';
                    }
                    return value.charAt(0).toUpperCase() + value.slice(1);
                  }}
                >
                  <MenuItem value="" disabled>
                    Bulk actions
                  </MenuItem>
                  <MenuItem value="activate">Activate</MenuItem>
                  <MenuItem value="inactivate">Inactivate</MenuItem>
                  <MenuItem value="delete">Delete</MenuItem>
                </Select>
              </FormControl>

              {/* Filters button */}
              <Button
                variant="outlined"
                size="small"
                endIcon={<FilterListIcon sx={{fontSize: '16px'}} />}
                onClick={handleOpenFilterDrawer}
                sx={{
                  borderColor: '#002677',
                  color: '#002677',
                  borderRadius: '46px',
                  padding: '6px 16px',
                  fontSize: '14px',
                  fontWeight: 700,
                  textTransform: 'none',
                  fontFamily: '"Enterprise Sans VF", sans-serif',
                  '&:hover': {
                    borderColor: '#001a5c',
                    backgroundColor: 'rgba(0, 38, 119, 0.04)'
                  }
                }}
              >
                Filters
              </Button>
            </Box>
          </Box>

          {/* Table */}
          <TableContainer sx={{px: 3}}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontFamily: '"Enterprise Sans VF", sans-serif',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#000000',
                      borderBottom: '2px solid #E5E5E6',
                      position: 'sticky',
                      left: 0,
                      backgroundColor: '#FFFFFF',
                      zIndex: 1,
                      borderRight: '2px solid #E5E5E6',
                      width: '150px'
                    }}
                  >
                    Actions
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"Enterprise Sans VF", sans-serif',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#000000',
                      borderBottom: '2px solid #E5E5E6'
                    }}
                  >
                    Carrier Name & ID
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"Enterprise Sans VF", sans-serif',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#000000',
                      borderBottom: '2px solid #E5E5E6'
                    }}
                  >
                    Account Name & ID
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"Enterprise Sans VF", sans-serif',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#000000',
                      borderBottom: '2px solid #E5E5E6'
                    }}
                  >
                    Group Name & ID
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"Enterprise Sans VF", sans-serif',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#000000',
                      borderBottom: '2px solid #E5E5E6'
                    }}
                  >
                    Assignment Status
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"Enterprise Sans VF", sans-serif',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#000000',
                      borderBottom: '2px solid #E5E5E6'
                    }}
                  >
                    Start Date
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"Enterprise Sans VF", sans-serif',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#000000',
                      borderBottom: '2px solid #E5E5E6'
                    }}
                  >
                    End Date
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{py: 4}}>
                      <Typography
                        sx={{
                          fontSize: '14px',
                          color: '#6E7072',
                          fontFamily: '"Enterprise Sans VF", sans-serif'
                        }}
                      >
                        Loading...
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading && safeCAGs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{py: 4}}>
                      <Typography
                        sx={{
                          fontSize: '14px',
                          color: '#6E7072',
                          fontFamily: '"Enterprise Sans VF", sans-serif'
                        }}
                      >
                        No CAGs assigned
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading && safeCAGs.length > 0 && (
                  <>
                    {paginatedCags.map((cag) => (
                      <TableRow
                        key={cag.id}
                        sx={{
                          opacity: cag.assignmentStatus?.toUpperCase() === 'INACTIVE' ? 0.5 : 1,
                          '&:hover': {
                            backgroundColor: '#F5F7FA'
                          }
                        }}
                      >
                        {/* Actions Column - Sticky */}
                        <TableCell
                          sx={{
                            fontFamily: '"Enterprise Sans VF", sans-serif',
                            fontSize: '14px',
                            fontWeight: 400,
                            color: '#4B4D4F',
                            borderBottom: '1px solid #E5E5E6',
                            position: 'sticky',
                            left: 0,
                            backgroundColor: '#FFFFFF',
                            zIndex: 1,
                            borderRight: '2px solid #E5E5E6'
                          }}
                        >
                          <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                            <Checkbox
                              checked={selectedIds.includes(cag.id)}
                              onChange={() => {
                                handleSelectCAG(cag.id);
                              }}
                              sx={{
                                color: '#CBCCCD',
                                '&.Mui-checked': {
                                  color: '#002677'
                                },
                                p: 0.5
                              }}
                            />
                            <Tooltip title="Inactivate" placement="top">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  handleInactivateCag(cag);
                                }}
                                sx={{
                                  color: '#0C55B8',
                                  p: 0.5,
                                  '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                  }
                                }}
                              >
                                <DoNotDisturbIcon sx={{fontSize: '18px'}} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete" placement="top">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  handleDeleteCag(cag);
                                }}
                                sx={{
                                  color: '#B80000',
                                  p: 0.5,
                                  '&:hover': {
                                    backgroundColor: 'rgba(184, 0, 0, 0.08)'
                                  }
                                }}
                              >
                                <DeleteIcon sx={{fontSize: '18px'}} />
                              </IconButton>
                            </Tooltip>
                            {onEditCAG && (
                              <Tooltip title="Edit" placement="top">
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    handleOpenEditDialog(cag);
                                  }}
                                  sx={{
                                    color: '#0C55B8',
                                    p: 0.5,
                                    '&:hover': {
                                      backgroundColor: 'rgba(12, 85, 184, 0.04)'
                                    }
                                  }}
                                >
                                  <EditIcon sx={{fontSize: '18px'}} />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell
                          onClick={handleCAGClick(cag)}
                          sx={{
                            fontFamily: '"Enterprise Sans VF", sans-serif',
                            fontSize: '14px',
                            fontWeight: 400,
                            color: '#4B4D4F',
                            cursor: onCAGClick ? 'pointer' : 'default',
                            borderBottom: '1px solid #E5E5E6',
                            '&:hover': onCAGClick
                              ? {
                                  textDecoration: 'underline'
                                }
                              : {}
                          }}
                        >
                          <div>
                            <div>{cag.carrierName}</div>
                            <Box sx={{color: '#4B4D4F', fontSize: '12px'}}>{cag.carrierId}</Box>
                          </div>
                        </TableCell>
                        <TableCell
                          sx={{
                            fontFamily: '"Enterprise Sans VF", sans-serif',
                            fontSize: '14px',
                            fontWeight: 400,
                            color: '#4B4D4F',
                            borderBottom: '1px solid #E5E5E6'
                          }}
                        >
                          <div>
                            <div>{cag.accountName}</div>
                            <Box sx={{color: '#4B4D4F', fontSize: '12px'}}>{cag.accountId}</Box>
                          </div>
                        </TableCell>
                        <TableCell
                          sx={{
                            fontFamily: '"Enterprise Sans VF", sans-serif',
                            fontSize: '14px',
                            fontWeight: 400,
                            color: '#4B4D4F',
                            borderBottom: '1px solid #E5E5E6'
                          }}
                        >
                          <div>
                            <div>{cag.groupName}</div>
                            <Box sx={{color: '#4B4D4F', fontSize: '12px'}}>{cag.groupId}</Box>
                          </div>
                        </TableCell>
                        <TableCell
                          sx={{
                            fontFamily: '"Enterprise Sans VF", sans-serif',
                            fontSize: '14px',
                            fontWeight: 400,
                            color: '#4B4D4F',
                            borderBottom: '1px solid #E5E5E6'
                          }}
                        >
                          <Box
                            sx={{
                              display: 'inline-block',
                              px: 2,
                              py: 0.5,
                              borderRadius: '4px',
                              backgroundColor: cag.assignmentStatus?.toUpperCase() === 'ACTIVE' ? '#FFFFFF' : '#F3F3F3',
                              color: '#4B4D4F',
                              border:
                                cag.assignmentStatus?.toUpperCase() === 'ACTIVE'
                                  ? '1px solid #FF612B'
                                  : '1px solid #4B4D4F',
                              fontSize: '12px',
                              fontWeight: 600
                            }}
                          >
                            {cag.assignmentStatus}
                          </Box>
                        </TableCell>
                        <TableCell
                          sx={{
                            fontFamily: '"Enterprise Sans VF", sans-serif',
                            fontSize: '14px',
                            fontWeight: 400,
                            color: '#4B4D4F',
                            borderBottom: '1px solid #E5E5E6'
                          }}
                        >
                          {cag.startDate}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontFamily: '"Enterprise Sans VF", sans-serif',
                            fontSize: '14px',
                            fontWeight: 400,
                            color: '#4B4D4F',
                            borderBottom: '1px solid #E5E5E6'
                          }}
                        >
                          {cag.endDate || '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {!isLoading && safeCAGs.length > 0 && (
            <ClientPagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          )}
        </AccordionDetails>
      </Accordion>
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        maxWidth={false}
        PaperProps={{
          sx: {
            width: '660px',
            height: '630px',
            borderRadius: '24px'
          }
        }}
      >
        <DialogContent
          sx={{
            px: '40px',
            py: 3,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Title and Close Button */}
          <Box sx={{height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <Typography
              sx={{
                fontFamily: '"Enterprise Sans VF", sans-serif',
                fontSize: '20px',
                fontWeight: 700,
                color: '#002677',
                lineHeight: 0
              }}
            >
              Edit Assignment
            </Typography>
            <IconButton
              onClick={handleCloseEditDialog}
              sx={{
                color: '#002677',
                padding: '4px',
                height: '44px',
                '&:hover': {
                  backgroundColor: 'rgba(0, 38, 119, 0.04)'
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Subtext */}
          <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
            <Typography
              sx={{
                fontFamily: '"Enterprise Sans VF", sans-serif',
                fontSize: '16px',
                fontWeight: 400,
                lineHeight: '140%',
                letterSpacing: '0%',
                color: '#4B4D4F'
              }}
            >
              You can only update the{' '}
              <Box component="span" sx={{fontWeight: 700}}>
                end date
              </Box>
              . To make any other changes, mark this assignment as inactive and create a new one.
            </Typography>
          </Box>

          {/* Box with CAG Data */}
          {selectedCAG && (
            <Box
              sx={{
                border: '1px solid #CBCCCD',
                borderRadius: '8px',
                px: 2,
                py: 2,
                mb: 2,
                backgroundColor: ' #FAFCFF',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Assignment Details Header */}
              <Typography
                sx={{
                  fontFamily: '"Enterprise Sans VF", sans-serif',
                  fontSize: '16px',
                  fontWeight: 700,
                  fontStyle: 'medium',
                  lineHeight: '140%',
                  letterSpacing: '0%',
                  color: '#2C2E2F',
                  mb: 1.5
                }}
              >
                Assignment Details
              </Typography>

              {/* Data Fields */}
              {[
                {label: 'Client', value: selectedCAG.clientName},
                {label: 'Operation Unit', value: selectedCAG.operationUnitName},
                {label: 'Carrier', value: selectedCAG.carrierName},
                {label: 'Account', value: selectedCAG.accountName},
                {label: 'Group', value: selectedCAG.groupName},
                {label: 'Start Date', value: selectedCAG.startDate, isLast: true}
              ].map((field) => (
                <Box key={selectedCAG.id} sx={{display: 'flex', mb: field.isLast ? 0 : 1.5}}>
                  <Typography
                    sx={{
                      fontFamily: '"Enterprise Sans VF", sans-serif',
                      fontSize: '16px',
                      fontWeight: 700,
                      fontStyle: 'medium',
                      lineHeight: '140%',

                      color: '#2C2E2F'
                    }}
                  >
                    {field.label} :
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: '"Enterprise Sans VF", sans-serif',
                      fontSize: '16px',
                      fontWeight: 500,
                      fontStyle: 'medium',
                      lineHeight: '140%',

                      color: '#4B4D4F'
                    }}
                  >
                    {field.value || '-'}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          {/* End Date Field */}
          <Box sx={{mb: 2}}>
            <Typography
              sx={{
                fontFamily: '"Enterprise Sans VF", sans-serif',
                fontSize: '16px',
                fontWeight: 700,
                color: 'text.primary',
                mb: 0.5,
                lineHeight: 1.4
              }}
            >
              End Date
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={editEndDate ? dayjs(editEndDate, 'YYYY-MM-DD') : null}
                onChange={(newValue) => {
                  setEditEndDate(newValue ? dayjs(newValue).format('YYYY-MM-DD') : '');
                }}
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
          </Box>

          {/* Spacer to push buttons up and create bottom gap */}
          <Box sx={{flexGrow: 1}} />
          {/* Action Buttons */}
          <Box sx={{display: 'flex', gap: 2, alignItems: 'center', mb: 0}}>
            <Button
              variant="contained"
              onClick={handleSaveEdit}
              disabled={isSaving || !editEndDate}
              sx={{
                textTransform: 'none',
                fontFamily: '"Enterprise Sans VF", sans-serif',
                fontSize: '16px',
                fontWeight: 700,
                backgroundColor: '#002677',
                color: '#FBF9F4',
                width: '85px',
                height: '40px',
                borderRadius: '46px',
                paddingTop: '10px',
                paddingRight: '24px',
                paddingBottom: '10px',
                paddingLeft: '24px',
                gap: '10px',
                opacity: 1,
                '&:hover': {
                  backgroundColor: '#001a57'
                },
                '&.Mui-disabled': {
                  backgroundColor: '#E5E5E6',
                  color: '#999999'
                }
              }}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
            <Button
              variant="outlined"
              onClick={handleCloseEditDialog}
              disabled={isSaving}
              sx={{
                textTransform: 'none',
                fontFamily: '"Enterprise Sans VF", sans-serif',
                fontSize: '16px',
                fontWeight: 700,
                border: '1px solid #002677',
                borderColor: '#002677',
                backgroundColor: '#FBF9F4',
                color: '#002677',
                width: '101px',
                height: '40px',
                borderRadius: '46px',
                paddingTop: '10px',
                paddingRight: '24px',
                paddingBottom: '10px',
                paddingLeft: '24px',
                gap: '10px',
                opacity: 1,
                borderWidth: '1px',
                '&:hover': {
                  borderColor: '#001a57',
                  backgroundColor: '#FBF9F4'
                }
              }}
            >
              Cancel
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
      <Dialog
        open={confirmDialogOpen}
        onClose={handleCancelConfirm}
        maxWidth="xs"
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
          <span>
            {isBulkAction ? 'Bulk Actions: ' : ''}
            {selectedAction.charAt(0).toUpperCase() + selectedAction.slice(1)}
          </span>
          <IconButton
            onClick={handleCancelConfirm}
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
              fontFamily: '"Enterprise Sans VF", sans-serif'
            }}
          >
            {getConfirmDialogSubtext()}
          </Typography>
        </DialogContent>
        <DialogActions sx={{px: 3, pb: 2, justifyContent: 'flex-start', gap: '10px'}}>
          <Button
            onClick={handleConfirmAction}
            variant="contained"
            sx={{
              minWidth: '133px',
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
            {`Yes, ${selectedAction.charAt(0).toUpperCase() + selectedAction.slice(1)}`}
          </Button>
          <Button
            onClick={handleCancelConfirm}
            sx={{
              minWidth: '133px',
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

      {/* Filter Drawer */}
      <AssignedCagsFilterDrawer
        open={filterDrawerOpen}
        onClose={handleCloseFilterDrawer}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
      />
    </>
  );
};
export default AssignedCags;
