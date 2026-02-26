/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable import/no-extraneous-dependencies */
import React, {useState} from 'react';
import {Control, FieldErrors, UseFormSetValue, UseFormWatch} from 'react-hook-form';
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Paper,
  Tooltip,
  InputAdornment
} from '@mui/material';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import {EditAccountingCodeFormData, GLAccountNumberEntry} from './EditAccountingCodeDialog.types';

interface GLAccountNumberTabProps {
  control: Control<EditAccountingCodeFormData>;
  errors: FieldErrors<EditAccountingCodeFormData>;
  watch: UseFormWatch<EditAccountingCodeFormData>;
  setValue: UseFormSetValue<EditAccountingCodeFormData>;
  onPendingEntryChange?: (hasPendingEntry: boolean) => void;
}

// Helper function to check if Main tab is valid
const isMainTabValid = (
  watch: UseFormWatch<EditAccountingCodeFormData>,
  errors: FieldErrors<EditAccountingCodeFormData>
): boolean => {
  const accountingCode = watch('accountingCode');
  const name = watch('name');
  const glAccountType = watch('glAccountType');
  const glAccountName = watch('glAccountName');
  const displaySequence = watch('displaySequence');
  const glAccountGroup = watch('glAccountGroup');

  // Check if all required fields have values
  const hasAllRequiredFields =
    !!accountingCode &&
    !!name &&
    !!glAccountType &&
    !!glAccountName &&
    displaySequence !== undefined &&
    displaySequence >= 1 &&
    !!glAccountGroup;

  // Check if there are no errors in Main tab fields
  const hasNoMainTabErrors =
    !errors.accountingCode &&
    !errors.name &&
    !errors.glAccountType &&
    !errors.glAccountName &&
    !errors.displaySequence &&
    !errors.glAccountGroup;

  return hasAllRequiredFields && hasNoMainTabErrors;
};

export const GLAccountNumberTab: React.FC<GLAccountNumberTabProps> = ({
  control,
  errors,
  watch,
  setValue,
  onPendingEntryChange
}) => {
  const [showNewEntryRow, setShowNewEntryRow] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<GLAccountNumberEntry>>({
    glAccountNumber: '',
    effectiveDate: undefined,
    expirationDate: undefined
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [dateError, setDateError] = useState<string>('');
  const [glAccountNumberError, setGlAccountNumberError] = useState<string>('');
  const [effectiveDateError, setEffectiveDateError] = useState<string>('');

  const glAccountNumbers = watch('glAccountNumbers') || [];
  const mainTabValid = isMainTabValid(watch, errors);

  const normalizeEndDate = (date?: Date | string) => (date ? new Date(date) : new Date(8640000000000000));

  const validateDates = (effectiveDate?: Date, expirationDate?: Date, excludeIndex?: number): boolean => {
    if (!effectiveDate) {
      setDateError('');
      return true;
    }

    // Check for overlapping dates with existing entries
    const hasOverlap = glAccountNumbers.some((entry, index) => {
      if (index === excludeIndex || index === editingIndex) return false; // Skip the entry being edited

      const existingStart = new Date(entry.effectiveDate);
      const existingEnd = normalizeEndDate(entry.expirationDate);
      const newStart = effectiveDate;
      const newEnd = normalizeEndDate(expirationDate);

      return (
        (newStart >= existingStart && newStart <= existingEnd) ||
        (newEnd >= existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      );
    });

    if (hasOverlap) {
      setDateError('Overlapping Date');
      return false;
    }

    setDateError('');
    return true;
  };

  const handleAddEntry = () => {
    // Validate GL Account Number
    if (!newEntry.glAccountNumber || newEntry.glAccountNumber.trim() === '') {
      setGlAccountNumberError('Please select a valid value');
      return;
    }

    // Validate Effective Date
    if (!newEntry.effectiveDate) {
      setEffectiveDateError('Please select a valid value');
      return;
    }

    if (validateDates(newEntry.effectiveDate, newEntry.expirationDate)) {
      const updatedEntries = [...glAccountNumbers, newEntry as GLAccountNumberEntry];
      setValue('glAccountNumbers', updatedEntries);
      setNewEntry({
        glAccountNumber: '',
        effectiveDate: undefined,
        expirationDate: undefined
      });
      setDateError('');
      setGlAccountNumberError('');
      setEffectiveDateError('');
      setShowNewEntryRow(false); // Hide the row after adding
      onPendingEntryChange?.(false);
    }
  };

  const handleShowNewEntryRow = () => {
    setShowNewEntryRow(true);
    onPendingEntryChange?.(true);
  };

  const handleCancelNewEntry = () => {
    setShowNewEntryRow(false);
    setNewEntry({
      glAccountNumber: '',
      effectiveDate: undefined,
      expirationDate: undefined
    });
    setDateError('');
    setGlAccountNumberError('');
    setEffectiveDateError('');
    onPendingEntryChange?.(false);
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
  };

  const handleSaveEdit = (index: number) => {
    setEditingIndex(null);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
  };

  const handleUpdateEntry = (index: number, field: keyof GLAccountNumberEntry, value: string | Date | undefined) => {
    const updatedEntries = [...glAccountNumbers];
    const entry = updatedEntries[index];
    if (!entry) return;

    updatedEntries[index] = {
      ...entry,
      [field]: value
    };
    setValue('glAccountNumbers', updatedEntries);

    // Validate dates if updating date fields
    if (field === 'effectiveDate' || field === 'expirationDate') {
      const updatedEntry = updatedEntries[index];
      if (updatedEntry) {
        validateDates(updatedEntry.effectiveDate, updatedEntry.expirationDate, index);
      }
    }
  };

  const handleRemoveEntry = (index: number) => {
    const updatedEntries = glAccountNumbers.filter((_, i) => i !== index);
    setValue('glAccountNumbers', updatedEntries);
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{py: 3, px: 1}}>
        {/* Validation Message */}
        {!mainTabValid && (
          <Box
            sx={{
              mb: 2,
              p: 1.5,
              bgcolor: '#fff3e0',
              border: '1px solid #ffb74d',
              borderRadius: '4px'
            }}
          >
            <Typography variant="body2" sx={{color: '#e65100', fontSize: '0.875rem'}}>
              Please complete all required fields in the Main tab before adding GL Account Numbers.
            </Typography>
          </Box>
        )}

        {/* Add Account Number Button */}
        <Box sx={{display: 'flex', justifyContent: 'flex-end', mb: 2}}>
          <Button
            variant="contained"
            onClick={handleShowNewEntryRow}
            disabled={!mainTabValid}
            sx={{
              bgcolor: '#003087',
              '&:hover': {
                bgcolor: '#002060',
                boxShadow: 'none'
              },
              textTransform: 'none',
              px: 3,
              fontSize: '0.875rem',
              boxShadow: 'none',
              borderRadius: '24px'
            }}
          >
            Add Account Number
          </Button>
        </Box>

        {/* Table */}
        <TableContainer
          component={Paper}
          sx={{
            boxShadow: 'none',
            border: '1px solid #e0e0e0',
            borderRadius: '4px'
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{bgcolor: '#fafafa'}}>
                <TableCell sx={{fontWeight: 600, fontSize: '0.875rem', color: 'text.primary'}}>
                  GL Account Number
                </TableCell>
                <TableCell sx={{fontWeight: 600, fontSize: '0.875rem', color: 'text.primary'}}>
                  Effective Date
                </TableCell>
                <TableCell sx={{fontWeight: 600, fontSize: '0.875rem', color: 'text.primary'}}>
                  Expiration Date
                </TableCell>
                <TableCell sx={{fontWeight: 600, fontSize: '0.875rem', color: 'text.primary'}}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* New Entry Row - Show only when button is clicked and Main tab is valid */}
              {showNewEntryRow && mainTabValid && (
                <TableRow sx={{bgcolor: '#f5f5f5'}}>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      value={newEntry.glAccountNumber || ''}
                      onChange={(e) => {
                        const valueWithoutSpaces = e.target.value.replace(/\s/g, '');
                        setNewEntry({
                          ...newEntry,
                          glAccountNumber: valueWithoutSpaces
                        });
                        if (valueWithoutSpaces.trim()) {
                          setGlAccountNumberError('');
                        }
                      }}
                      onBlur={() => {
                        if (!newEntry.glAccountNumber || newEntry.glAccountNumber.trim() === '') {
                          setGlAccountNumberError('Please select a valid value');
                        }
                      }}
                      placeholder="Enter GL Account Number"
                      error={!!glAccountNumberError}
                      InputProps={{
                        endAdornment: glAccountNumberError ? (
                          <InputAdornment position="end">
                            <Tooltip title={glAccountNumberError} placement="top" arrow>
                              <InfoOutlinedIcon sx={{color: 'error.main', fontSize: '1.25rem'}} />
                            </Tooltip>
                          </InputAdornment>
                        ) : null
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: '#fff',
                          '& fieldset': {
                            borderColor: glAccountNumberError ? 'error.main' : '#e0e0e0'
                          },
                          '&:hover fieldset': {
                            borderColor: glAccountNumberError ? 'error.main' : '#bdbdbd'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: glAccountNumberError ? 'error.main' : '#003087',
                            borderWidth: '1px'
                          }
                        },
                        '& .MuiInputBase-input': {
                          fontSize: '0.875rem'
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{position: 'relative'}}>
                      <DatePicker
                        value={newEntry.effectiveDate || null}
                        onChange={(date) => {
                          const dateValue = date ? (date as Date) : undefined;
                          setNewEntry({...newEntry, effectiveDate: dateValue});
                          if (dateValue) {
                            setEffectiveDateError('');
                          }
                          validateDates(dateValue, newEntry.expirationDate);
                        }}
                        onClose={() => {
                          if (!newEntry.effectiveDate) {
                            setEffectiveDateError('Please select a valid value');
                          }
                        }}
                        slotProps={{
                          textField: {
                            size: 'small',
                            fullWidth: true,
                            error: !!dateError || !!effectiveDateError,
                            helperText: dateError,
                            onBlur: () => {
                              if (!newEntry.effectiveDate) {
                                setEffectiveDateError('Please select a valid value');
                              }
                            },
                            sx: {
                              '& .MuiOutlinedInput-root': {
                                backgroundColor: '#fff',
                                '& fieldset': {
                                  borderColor: dateError || effectiveDateError ? 'error.main' : '#e0e0e0'
                                },
                                '&:hover fieldset': {
                                  borderColor: dateError || effectiveDateError ? 'error.main' : '#bdbdbd'
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: dateError || effectiveDateError ? 'error.main' : '#003087',
                                  borderWidth: '1px'
                                }
                              },
                              '& .MuiInputBase-input': {
                                fontSize: '0.875rem'
                              }
                            }
                          }
                        }}
                      />
                      {effectiveDateError && (
                        <Box
                          sx={{
                            position: 'absolute',
                            right: 40,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 1,
                            pointerEvents: 'auto'
                          }}
                        >
                          <Tooltip title={effectiveDateError} placement="top" arrow>
                            <InfoOutlinedIcon sx={{color: 'error.main', fontSize: '1.25rem'}} />
                          </Tooltip>
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <DatePicker
                      value={newEntry.expirationDate || null}
                      onChange={(date) => {
                        const dateValue = date ? (date as Date) : undefined;
                        setNewEntry({...newEntry, expirationDate: dateValue});
                        validateDates(newEntry.effectiveDate, dateValue);
                      }}
                      slotProps={{
                        textField: {
                          size: 'small',
                          fullWidth: true,
                          sx: {
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: '#fff',
                              '& fieldset': {
                                borderColor: '#e0e0e0'
                              },
                              '&:hover fieldset': {
                                borderColor: '#bdbdbd'
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#003087',
                                borderWidth: '1px'
                              }
                            },
                            '& .MuiInputBase-input': {
                              fontSize: '0.875rem'
                            }
                          }
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{display: 'flex', gap: 0.5}}>
                      <IconButton
                        size="small"
                        sx={{
                          color: 'success.main',
                          '&.Mui-disabled': {
                            color: 'action.disabled'
                          }
                        }}
                        onClick={handleAddEntry}
                        disabled={!newEntry.glAccountNumber || !newEntry.effectiveDate || !!dateError}
                        title="Save"
                      >
                        <CheckIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{color: 'text.secondary'}}
                        onClick={handleCancelNewEntry}
                        title="Cancel"
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              )}

              {/* Empty State */}
              {glAccountNumbers.length === 0 && !showNewEntryRow && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{py: 6}}>
                    <Typography variant="body2" color="text.secondary">
                      No account number added for GL account number history.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {/* Existing Entries */}
              {glAccountNumbers.map((entry, index) => (
                <TableRow key={index}>
                  {editingIndex === index ? (
                    <>
                      {/* Editing Mode */}
                      <TableCell>
                        <TextField
                          fullWidth
                          size="small"
                          value={entry.glAccountNumber}
                          onChange={(e) =>
                            handleUpdateEntry(index, 'glAccountNumber', e.target.value.replace(/\s/g, ''))
                          }
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: '#fff',
                              '& fieldset': {
                                borderColor: '#e0e0e0'
                              },
                              '&:hover fieldset': {
                                borderColor: '#bdbdbd'
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#003087',
                                borderWidth: '1px'
                              }
                            },
                            '& .MuiInputBase-input': {
                              fontSize: '0.875rem'
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <DatePicker
                          value={entry.effectiveDate ? new Date(entry.effectiveDate) : null}
                          onChange={(date) => date && handleUpdateEntry(index, 'effectiveDate', date as Date)}
                          slotProps={{
                            textField: {
                              size: 'small',
                              fullWidth: true,
                              sx: {
                                '& .MuiOutlinedInput-root': {
                                  backgroundColor: '#fff',
                                  '& fieldset': {
                                    borderColor: '#e0e0e0'
                                  },
                                  '&:hover fieldset': {
                                    borderColor: '#bdbdbd'
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: '#003087',
                                    borderWidth: '1px'
                                  }
                                },
                                '& .MuiInputBase-input': {
                                  fontSize: '0.875rem'
                                }
                              }
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <DatePicker
                          value={entry.expirationDate ? new Date(entry.expirationDate) : null}
                          onChange={(date) =>
                            handleUpdateEntry(index, 'expirationDate', date ? (date as Date) : undefined)
                          }
                          slotProps={{
                            textField: {
                              size: 'small',
                              fullWidth: true,
                              sx: {
                                '& .MuiOutlinedInput-root': {
                                  backgroundColor: '#fff',
                                  '& fieldset': {
                                    borderColor: '#e0e0e0'
                                  },
                                  '&:hover fieldset': {
                                    borderColor: '#bdbdbd'
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: '#003087',
                                    borderWidth: '1px'
                                  }
                                },
                                '& .MuiInputBase-input': {
                                  fontSize: '0.875rem'
                                }
                              }
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{display: 'flex', gap: 0.5}}>
                          <IconButton
                            size="small"
                            sx={{color: 'success.main'}}
                            onClick={() => handleSaveEdit(index)}
                            title="Save"
                          >
                            <CheckIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            sx={{color: 'text.secondary'}}
                            onClick={handleCancelEdit}
                            title="Cancel"
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      {/* View Mode */}
                      <TableCell>
                        <Typography variant="body2">{entry.glAccountNumber}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {entry.effectiveDate ? new Date(entry.effectiveDate).toLocaleDateString() : ''}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {entry.expirationDate ? new Date(entry.expirationDate).toLocaleDateString() : ''}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{display: 'flex', gap: 0.5}}>
                          <IconButton
                            size="small"
                            sx={{color: '#003087'}}
                            onClick={() => handleStartEdit(index)}
                            title="Edit"
                          >
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M2 16H3.425L13.2 6.225L11.775 4.8L2 14.575V16ZM1 18C0.716667 18 0.479167 17.9042 0.2875 17.7125C0.0958333 17.5208 0 17.2833 0 17V14.575C0 14.3083 0.05 14.0542 0.15 13.8125C0.25 13.5708 0.391667 13.3583 0.575 13.175L13.2 0.575C13.4 0.391667 13.6208 0.25 13.8625 0.15C14.1042 0.05 14.3583 0 14.625 0C14.8917 0 15.15 0.05 15.4 0.15C15.65 0.25 15.8667 0.4 16.05 0.6L17.425 2C17.625 2.18333 17.7708 2.4 17.8625 2.65C17.9542 2.9 18 3.15 18 3.4C18 3.66667 17.9542 3.92083 17.8625 4.1625C17.7708 4.40417 17.625 4.625 17.425 4.825L4.825 17.425C4.64167 17.6083 4.42917 17.75 4.1875 17.85C3.94583 17.95 3.69167 18 3.425 18H1ZM12.475 5.525L11.775 4.8L13.2 6.225L12.475 5.525Z"
                                fill="#0C55B8"
                              />
                            </svg>
                          </IconButton>
                          <IconButton
                            size="small"
                            sx={{color: 'error.main'}}
                            onClick={() => handleRemoveEntry(index)}
                            title="Delete"
                          >
                            <svg
                              width="16"
                              height="18"
                              viewBox="0 0 16 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M3 18C2.45 18 1.97917 17.8042 1.5875 17.4125C1.19583 17.0208 1 16.55 1 16V3C0.716667 3 0.479167 2.90417 0.2875 2.7125C0.0958333 2.52083 0 2.28333 0 2C0 1.71667 0.0958333 1.47917 0.2875 1.2875C0.479167 1.09583 0.716667 1 1 1H5C5 0.716667 5.09583 0.479167 5.2875 0.2875C5.47917 0.0958333 5.71667 0 6 0H10C10.2833 0 10.5208 0.0958333 10.7125 0.2875C10.9042 0.479167 11 0.716667 11 1H15C15.2833 1 15.5208 1.09583 15.7125 1.2875C15.9042 1.47917 16 1.71667 16 2C16 2.28333 15.9042 2.52083 15.7125 2.7125C15.5208 2.90417 15.2833 3 15 3V16C15 16.55 14.8042 17.0208 14.4125 17.4125C14.0208 17.8042 13.55 18 13 18H3ZM13 3H3V16H13V3ZM5 14H7V5H5V14ZM9 14H11V5H9V14Z"
                                fill="#0C55B8"
                              />
                            </svg>
                          </IconButton>
                        </Box>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </LocalizationProvider>
  );
};
