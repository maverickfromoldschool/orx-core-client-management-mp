import React, {useEffect, useState} from 'react';
import {
  Box,
  Button,
  Divider,
  Drawer,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import dayjs, {Dayjs} from 'dayjs';

export interface FilterField {
  label: string;
  fieldKey: string;
  fieldType: 'text' | 'dropdown' | 'date';
  values?: {label: string; value: string | number}[];
}

export interface FilterPanelProps {
  open: boolean;
  onClose: () => void;
  fields: FilterField[];
  currentFilters?: Record<string, string | number | null>;
  onApply: (filters: Record<string, string | number | null>) => void;
}

export default function FilterPanel(props: FilterPanelProps) {
  const {open, onClose, fields, currentFilters = {}, onApply} = props;

  // Local draft state for editing
  const [values, setValues] = useState<Record<string, string | number | null>>(currentFilters);

  // When panel opens, sync with current applied filters
  useEffect(() => {
    if (open) {
      setValues(currentFilters);
    }
  }, [open, currentFilters]);

  const handleTextChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({...prev, [key]: e.target.value ?? null}));
  };

  const handleDateChange = (key: string) => (date: Dayjs | null) => {
    // Convert Dayjs to YYYY-MM-DD format to match backend API expectation
    const dateValue = date ? date.format('YYYY-MM-DD') : null;
    setValues((prev) => ({...prev, [key]: dateValue}));
  };

  const handleSelectChange = (key: string) => (e: SelectChangeEvent<string | number>) => {
    // SelectChangeEvent has value as string always; cast numbers if needed
    const raw = e.target.value as string;
    // try to detect numeric option values
    const field = fields.find((f) => f.fieldKey === key);
    const opt = field?.values?.find((v) => String(v.value) === raw);
    const val = opt ? opt.value : raw;
    setValues((prev) => ({...prev, [key]: val}));
  };

  const handleApply = () => {
    // basic validation: nothing special, only include non-empty values
    const payload: Record<string, string | number | null> = {};
    Object.keys(values).forEach((k) => {
      const v = values[k];
      if (v !== '' && v !== null && v !== undefined) {
        payload[k] = v;
      }
    });
    onApply(payload);
  };

  const handleClear = () => {
    const cleared: Record<string, string | number | null> = {};
    fields.forEach((f) => {
      cleared[f.fieldKey] = null;
    });
    setValues(cleared);
    // Apply the cleared filters to trigger API call
    // onApply({});
  };

  const handleClose = () => {
    // Revert to last applied filters when closing without applying
    setValues(currentFilters);
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      PaperProps={{sx: {width: {xs: 'calc(100% - 48px)', sm: 450}}}}
    >
      <Box role="presentation" sx={{height: '100%', display: 'flex', flexDirection: 'column'}}>
        {/* Header */}
        <Box sx={{p: 3, pb: 1, display: 'flex', alignItems: 'flex-start', gap: 2}}>
          <Box sx={{flex: 1}}>
            <Typography sx={{fontSize: '25px', fontWeight: 700, lineHeight: '36px', color: '#002677'}}>
              Filters
            </Typography>
            <Typography sx={{fontWeight: 400, fontSize: '14px', lineHeight: '18px', color: '#4B4D4F'}}>
              Select the filtering options to fetch the required data.
            </Typography>
          </Box>
          <IconButton aria-label="close filters" onClick={handleClose} size="large">
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        {/* Body */}
        <Box sx={{p: 3, overflowY: 'auto', flex: 1}}>
          <Stack spacing={3}>
            {fields.map((f) => (
              <Box key={f.fieldKey}>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    fontSize: '15px',
                    fontWeight: 700,
                    lineHeight: '20px',
                    color: '#323334',
                    mb: 1
                  }}
                >
                  {f.label}
                </Typography>
                {f.fieldType === 'text' && (
                  <TextField
                    fullWidth
                    size="small"
                    placeholder={`Enter ${f.label.toLowerCase()}`}
                    value={values[f.fieldKey] ?? ''}
                    onChange={handleTextChange(f.fieldKey)}
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
                      }
                    }}
                  />
                )}
                {f.fieldType === 'date' && (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={values[f.fieldKey] ? dayjs(values[f.fieldKey] as string) : null}
                      onChange={handleDateChange(f.fieldKey)}
                      format="MM-DD-YYYY"
                      slots={{
                        openPickerIcon: CalendarMonthIcon
                      }}
                      slotProps={{
                        openPickerButton: {
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
                        },
                        textField: {
                          fullWidth: true,
                          size: 'small',
                          placeholder: 'MM-DD-YYYY',
                          sx: {
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
                          }
                        }
                      }}
                    />
                  </LocalizationProvider>
                )}
                {f.fieldType === 'dropdown' && (
                  <FormControl fullWidth size="small">
                    <Select
                      displayEmpty
                      value={values[f.fieldKey] == null ? '' : String(values[f.fieldKey])}
                      onChange={handleSelectChange(f.fieldKey)}
                      renderValue={(selected) => {
                        if (selected === '' || selected == null) {
                          return (
                            <span style={{color: '#9E9E9E', fontSize: '16px'}}>Select {f.label.toLowerCase()}</span>
                          );
                        }
                        const opt = (f.values || []).find((o) => o.value === selected);
                        return opt ? opt.label : selected;
                      }}
                      aria-label={f.label}
                      sx={{
                        height: '40px',
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
                          fontSize: '16px'
                        },
                        '& .MuiSelect-icon': {
                          color: 'grey.700',
                          right: '8px'
                        }
                      }}
                    >
                      <MenuItem value="">(none)</MenuItem>
                      {(f.values || []).map((opt) => (
                        <MenuItem key={String(opt.value)} value={String(opt.value)}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </Box>
            ))}
          </Stack>
        </Box>

        <Divider />

        {/* Footer */}
        <Box sx={{p: 2, display: 'flex', justifyContent: 'center', gap: 2}}>
          <Button
            variant="contained"
            onClick={handleApply}
            color="primary"
            sx={{
              width: '89px',
              height: '40px',
              opacity: 1,
              borderRadius: '46px',
              padding: '10px 24px',
              fontSize: '16px',
              fontWeight: 700,
              textTransform: 'none',
              boxShadow: 'none',
              backgroundColor: '#002677',
              color: '#FFFFFF',
              '&:hover': {
                backgroundColor: '#001a5c',
                boxShadow: 'none'
              }
            }}
          >
            Filter
          </Button>
          <Button
            variant="outlined"
            onClick={handleClear}
            sx={{
              width: '89px',
              height: '40px',
              opacity: 1,
              borderRadius: '46px',
              padding: '10px 24px',
              fontSize: '16px',
              fontWeight: 700,
              textTransform: 'none',
              backgroundColor: '#FFFFFF',
              color: '#4B4D4F',
              borderColor: '#4B4D4F',
              '&:hover': {
                backgroundColor: '#F5F5F5',
                borderColor: '#4B4D4F'
              }
            }}
          >
            Clear
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
