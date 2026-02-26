'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  Typography,
  Grid,
  Tooltip,
  Switch,
  Autocomplete,
  TextField,
  Tabs,
  Tab
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import {useTransactionAttributeOptions} from '../../../hooks/use-transaction-attribute-options';
import {useDataTypeOptions} from '../../../hooks/use-data-type-options';
import {useUomOptions} from '../../../hooks/use-uom-options';

import type {TransactionFieldDialogProps} from './transaction-field-dialog.types';

export function TransactionFieldDialog({
  open,
  onClose,
  onSave,
  initialData,
  isSaving = false
}: TransactionFieldDialogProps) {
  const [activeTab, setActiveTab] = React.useState(0);
  const [formData, setFormData] = React.useState({
    transactionAttribute: '',
    label: '',
    dataType: 'Quantity',
    unitOfMeasure: '',
    displaySequence: 1,
    valueCap: '',
    required: false,
    negativeAllowed: false,
    summarization: false,
    accountUsage: false,
    calculated: false,
    notes: ''
  });

  const [errors, setErrors] = React.useState({
    transactionAttribute: '',
    label: '',
    dataType: '',
    unitOfMeasure: '',
    displaySequence: '',
    valueCap: ''
  });

  const [touched, setTouched] = React.useState({
    transactionAttribute: false,
    label: false,
    dataType: false,
    unitOfMeasure: false,
    displaySequence: false,
    valueCap: false
  });

  // Fetch transaction attribute options using the hook
  const {transactionAttributeOptions, loadingTransactionAttributes} = useTransactionAttributeOptions();

  // Fetch data type options using the hook
  const {dataTypeOptions, loadingDataTypes} = useDataTypeOptions();

  // Fetch unit of measure options using the hook
  const {uomOptions, loadingUoms} = useUomOptions({page: 0, size: 50});

  // Check if Unit of Measure should be shown
  const showUnitOfMeasure = formData.dataType === 'QTY' || formData.dataType === 'NBR';

  // Check if Value Cap should be shown
  const showValueCap = formData.dataType === 'NBR';

  // Reset form when dialog opens or initialData changes
  React.useEffect(() => {
    if (open) {
      setActiveTab(0); // Reset to Main tab
      if (initialData) {
        setFormData({
          transactionAttribute: initialData.transactionAttribute,
          label: initialData.label,
          dataType: initialData.dataType,
          unitOfMeasure: initialData.unitOfMeasure,
          displaySequence: initialData.displaySequence,
          valueCap: '',
          required: initialData.required,
          negativeAllowed: initialData.negativeAllowed,
          summarization: initialData.summarization,
          accountUsage: initialData.accountUsage,
          calculated: initialData.calculated || false,
          notes: ''
        });
      } else {
        setFormData({
          transactionAttribute: '',
          label: '',
          dataType: 'Quantity',
          unitOfMeasure: '',
          displaySequence: 1,
          valueCap: '',
          required: false,
          negativeAllowed: false,
          summarization: false,
          accountUsage: false,
          calculated: false,
          notes: ''
        });
      }
      setErrors({
        transactionAttribute: '',
        label: '',
        dataType: '',
        unitOfMeasure: '',
        displaySequence: '',
        valueCap: ''
      });
      setTouched({
        transactionAttribute: false,
        label: false,
        dataType: false,
        unitOfMeasure: false,
        displaySequence: false,
        valueCap: false
      });
    }
  }, [open, initialData]);

  const handleClose = () => {
    if (!isSaving) {
      onClose();
    }
  };

  const validateForm = () => {
    const newErrors = {
      transactionAttribute: '',
      label: '',
      dataType: '',
      unitOfMeasure: '',
      displaySequence: '',
      valueCap: ''
    };

    if (!formData.transactionAttribute.trim()) {
      newErrors.transactionAttribute = 'Transaction attribute is required';
    }

    if (!formData.label.trim()) {
      newErrors.label = 'Label is required';
    }

    if (!formData.dataType.trim()) {
      newErrors.dataType = 'Data type is required';
    }

    // Unit of Measure is not required anymore

    if (!formData.displaySequence || formData.displaySequence < 1 || formData.displaySequence > 99) {
      newErrors.displaySequence = 'Display sequence must be between 1 and 99';
    }

    // Validate Value Cap if data type is Number
    if (formData.dataType === 'Number' && formData.valueCap) {
      const valueCapNum = Number(formData.valueCap);
      if (Number.isNaN(valueCapNum)) {
        newErrors.valueCap = 'Value cap must be a number';
      } else if (valueCapNum < 0 || valueCapNum > 999) {
        newErrors.valueCap = 'Value cap must be between 0 and 999';
      }
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== '');
  };

  const handleSave = () => {
    // Mark all fields as touched
    setTouched({
      transactionAttribute: true,
      label: true,
      dataType: true,
      unitOfMeasure: true,
      displaySequence: true,
      valueCap: true
    });

    if (validateForm()) {
      onSave({
        id: initialData?.id || String(Date.now()),
        ...formData
      });
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {value} = e.target;

    // Special handling for valueCap
    if (field === 'valueCap') {
      // Only allow numbers
      if (value && !/^\d*$/.test(value)) {
        return; // Don't update if non-numeric
      }
      setFormData((prev) => ({
        ...prev,
        [field]: value
      }));

      // Validate on change
      if (touched.valueCap) {
        const newErrors = {...errors};
        if (value) {
          const valueCapNum = Number(value);
          if (valueCapNum < 0 || valueCapNum > 999) {
            newErrors.valueCap = 'Value cap must be between 0 and 999';
          } else {
            newErrors.valueCap = '';
          }
        } else {
          newErrors.valueCap = '';
        }
        setErrors(newErrors);
      }
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [field]: field === 'displaySequence' ? Number(value) : value
    }));

    // Clear error when user starts typing
    if (touched[field as keyof typeof touched]) {
      const newErrors = {...errors};
      if (field === 'displaySequence') {
        if (Number(value) >= 1) {
          newErrors[field as keyof typeof errors] = '';
        } else {
          newErrors[field as keyof typeof errors] = 'Display sequence must be at least 1';
        }
      } else if (value.trim()) {
        newErrors[field as keyof typeof errors] = '';
      } else {
        newErrors[field as keyof typeof errors] = `${
          field.charAt(0).toUpperCase() +
          field
            .slice(1)
            .replace(/([A-Z])/g, ' $1')
            .trim()
        } is required`;
      }
      setErrors(newErrors);
    }
  };

  const handleBlur = (field: string) => () => {
    setTouched((prev) => ({
      ...prev,
      [field]: true
    }));

    const newErrors = {...errors};

    if (field === 'valueCap') {
      if (formData.valueCap) {
        const valueCapNum = Number(formData.valueCap);
        if (Number.isNaN(valueCapNum)) {
          newErrors.valueCap = 'Value cap must be a number';
        } else if (valueCapNum < 0 || valueCapNum > 999) {
          newErrors.valueCap = 'Value cap must be between 0 and 999';
        } else {
          newErrors.valueCap = '';
        }
      } else {
        newErrors.valueCap = '';
      }
    } else if (field === 'displaySequence') {
      if (!formData.displaySequence || formData.displaySequence < 1 || formData.displaySequence > 99) {
        newErrors[field as keyof typeof errors] = 'Display sequence must be between 1 and 99';
      } else {
        newErrors[field as keyof typeof errors] = '';
      }
    } else if (!formData[field as keyof typeof formData] || !String(formData[field as keyof typeof formData]).trim()) {
      newErrors[field as keyof typeof errors] = `${
        field.charAt(0).toUpperCase() +
        field
          .slice(1)
          .replace(/([A-Z])/g, ' $1')
          .trim()
      } is required`;
    } else {
      newErrors[field as keyof typeof errors] = '';
    }
    setErrors(newErrors);
  };

  const handleSwitchChange =
    (field: 'required' | 'negativeAllowed' | 'summarization' | 'accountUsage' | 'calculated') =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.checked
      }));
    };

  const handleTabChange = (_event: React.SyntheticEvent, newTab: number) => {
    setActiveTab(newTab);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <Typography variant="h6" sx={{fontWeight: 700, color: '#002677'}}>
            {initialData ? 'Edit Transaction Field' : 'Add New Transaction Field'}
          </Typography>
          <IconButton onClick={handleClose} disabled={isSaving}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

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
          <Tab label="Main" />
          <Tab label="Notes" />
        </Tabs>
      </Box>

      <DialogContent dividers sx={{overflow: 'auto'}}>
        {/* Main Tab */}
        {activeTab === 0 && (
          <Box sx={{pt: 1, px: 1, pb: 1}}>
            {/* First Row: Transaction Attribute and Label */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <div>
                  <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5}}>
                    <Typography
                      component="label"
                      sx={{
                        fontSize: '16px',
                        fontWeight: 700,
                        color: 'text.primary'
                      }}
                    >
                      Transaction Attribute
                      <Typography component="span" sx={{color: '#C40000', ml: 0.5}}>
                        *
                      </Typography>
                    </Typography>
                  </Box>
                  <Autocomplete
                    value={
                      transactionAttributeOptions.find((opt) => opt.value === formData.transactionAttribute) || null
                    }
                    onChange={(event, selectedValue) => {
                      const newValue = selectedValue?.value || '';
                      setFormData((prev) => ({
                        ...prev,
                        transactionAttribute: newValue
                      }));
                      // Clear error when value is selected
                      if (touched.transactionAttribute && newValue) {
                        setErrors((prev) => ({...prev, transactionAttribute: ''}));
                      }
                    }}
                    options={transactionAttributeOptions}
                    getOptionLabel={(option) => option.label}
                    loading={loadingTransactionAttributes}
                    disabled={isSaving || !!initialData}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select transaction attribute"
                        error={touched.transactionAttribute && !!errors.transactionAttribute}
                        helperText={touched.transactionAttribute ? errors.transactionAttribute : ''}
                        onBlur={handleBlur('transactionAttribute')}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            fontSize: '14px',
                            '& fieldset': {
                              borderColor: errors.transactionAttribute ? '#C40000' : '#CBCCCD'
                            },
                            '&:hover fieldset': {
                              borderColor: errors.transactionAttribute ? '#C40000' : '#999'
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: errors.transactionAttribute ? '#C40000' : '#0C55B8',
                              borderWidth: '1px'
                            },
                            '&.Mui-disabled': {
                              backgroundColor: '#F5F5F5'
                            }
                          },
                          '& .MuiInputBase-input': {
                            padding: '0px 8px !important',
                            height: '20px',
                            boxSizing: 'content-box'
                          },
                          '& .MuiAutocomplete-endAdornment': {
                            right: '8px'
                          },
                          '& .MuiFormHelperText-root': {
                            color: '#C40000',
                            fontSize: '12px',
                            marginLeft: 0,
                            marginTop: '4px'
                          }
                        }}
                      />
                    )}
                    sx={{width: '100%'}}
                  />
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <div>
                  <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5}}>
                    <Typography
                      component="label"
                      sx={{
                        fontSize: '16px',
                        fontWeight: 700,
                        color: 'text.primary'
                      }}
                    >
                      Label
                      <Typography component="span" sx={{color: '#C40000', ml: 0.5}}>
                        *
                      </Typography>
                    </Typography>
                  </Box>
                  <Box
                    component="input"
                    value={formData.label}
                    onChange={handleChange('label')}
                    onBlur={handleBlur('label')}
                    disabled={isSaving}
                    placeholder="Enter label"
                    sx={{
                      width: '100%',
                      padding: '10px 12px',
                      fontSize: '14px',
                      border: errors.label ? '1px solid #C40000' : '1px solid #CBCCCD',
                      borderRadius: '4px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      '&:hover': {
                        borderColor: errors.label ? '#C40000' : '#999'
                      },
                      '&:focus': {
                        borderColor: errors.label ? '#C40000' : '#0C55B8',
                        borderWidth: '1px'
                      },
                      '&:disabled': {
                        backgroundColor: '#F5F5F5',
                        cursor: 'not-allowed'
                      }
                    }}
                  />
                  {errors.label && (
                    <Typography sx={{color: '#C40000', fontSize: '12px', mt: 0.5}}>{errors.label}</Typography>
                  )}
                </div>
              </Grid>
            </Grid>

            {/* Second Row: Data Type and Unit of Measure (conditional) */}
            <Grid container spacing={2} sx={{mt: 2}}>
              <Grid item xs={12} md={6}>
                <div>
                  <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5}}>
                    <Typography
                      component="label"
                      sx={{
                        fontSize: '16px',
                        fontWeight: 700,
                        color: 'text.primary'
                      }}
                    >
                      Data Type
                      <Typography component="span" sx={{color: '#C40000', ml: 0.5}}>
                        *
                      </Typography>
                    </Typography>
                  </Box>
                  <Autocomplete
                    value={dataTypeOptions.find((opt) => opt.value === formData.dataType) || null}
                    onChange={(event, selectedValue) => {
                      const newValue = selectedValue?.value || '';
                      setFormData((prev) => ({
                        ...prev,
                        dataType: newValue
                      }));
                      // Clear error when value is selected
                      if (touched.dataType && newValue) {
                        setErrors((prev) => ({...prev, dataType: ''}));
                      }
                    }}
                    options={dataTypeOptions}
                    getOptionLabel={(option) => option.label}
                    loading={loadingDataTypes}
                    disabled={isSaving}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select data type"
                        error={touched.dataType && !!errors.dataType}
                        helperText={touched.dataType ? errors.dataType : ''}
                        onBlur={handleBlur('dataType')}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            fontSize: '14px',
                            '& fieldset': {
                              borderColor: errors.dataType ? '#C40000' : '#CBCCCD'
                            },
                            '&:hover fieldset': {
                              borderColor: errors.dataType ? '#C40000' : '#999'
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: errors.dataType ? '#C40000' : '#0C55B8',
                              borderWidth: '1px'
                            },
                            '&.Mui-disabled': {
                              backgroundColor: '#F5F5F5'
                            }
                          },
                          '& .MuiInputBase-input': {
                            padding: '0px 8px !important',
                            height: '20px',
                            boxSizing: 'content-box'
                          },
                          '& .MuiAutocomplete-endAdornment': {
                            right: '8px'
                          },
                          '& .MuiFormHelperText-root': {
                            color: '#C40000',
                            fontSize: '12px',
                            marginLeft: 0,
                            marginTop: '4px'
                          }
                        }}
                      />
                    )}
                    sx={{width: '100%'}}
                  />
                </div>
              </Grid>
              {showUnitOfMeasure && (
                <Grid item xs={12} md={6}>
                  <div>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5}}>
                      <Typography
                        component="label"
                        sx={{
                          fontSize: '16px',
                          fontWeight: 700,
                          color: 'text.primary'
                        }}
                      >
                        Unit of Measure
                      </Typography>
                    </Box>
                    <Autocomplete
                      value={uomOptions.find((opt) => opt.value === formData.unitOfMeasure) || null}
                      onChange={(event, selectedValue) => {
                        const newValue = typeof selectedValue === 'string' ? selectedValue : selectedValue?.value || '';
                        setFormData((prev) => ({
                          ...prev,
                          unitOfMeasure: newValue
                        }));
                      }}
                      options={uomOptions}
                      groupBy={(option) => option.unitTypeCd}
                      getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                      loading={loadingUoms}
                      disabled={isSaving}
                      freeSolo
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select or enter unit of measure"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              fontSize: '14px',
                              '& fieldset': {
                                borderColor: '#CBCCCD'
                              },
                              '&:hover fieldset': {
                                borderColor: '#999'
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#0C55B8',
                                borderWidth: '1px'
                              },
                              '&.Mui-disabled': {
                                backgroundColor: '#F5F5F5'
                              }
                            },
                            '& .MuiInputBase-input': {
                              padding: '0px 8px !important',
                              height: '20px',
                              boxSizing: 'content-box'
                            },
                            '& .MuiAutocomplete-endAdornment': {
                              right: '8px'
                            }
                          }}
                        />
                      )}
                      sx={{width: '100%'}}
                    />
                  </div>
                </Grid>
              )}
            </Grid>

            {/* Third Row: Value Cap (conditional) and Display Sequence */}
            <Grid container spacing={2} sx={{mt: 2}}>
              {showValueCap ? (
                <>
                  <Grid item xs={12} md={6}>
                    <div>
                      <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5}}>
                        <Typography
                          component="label"
                          sx={{
                            fontSize: '16px',
                            fontWeight: 700,
                            color: 'text.primary'
                          }}
                        >
                          Value Cap
                        </Typography>
                      </Box>
                      <Box
                        component="input"
                        type="text"
                        value={formData.valueCap}
                        onChange={handleChange('valueCap')}
                        onBlur={handleBlur('valueCap')}
                        disabled={isSaving}
                        placeholder="Enter value cap (0-999)"
                        sx={{
                          width: '100%',
                          padding: '10px 12px',
                          fontSize: '14px',
                          border: errors.valueCap ? '1px solid #C40000' : '1px solid #CBCCCD',
                          borderRadius: '4px',
                          outline: 'none',
                          boxSizing: 'border-box',
                          '&:hover': {
                            borderColor: errors.valueCap ? '#C40000' : '#999'
                          },
                          '&:focus': {
                            borderColor: errors.valueCap ? '#C40000' : '#0C55B8',
                            borderWidth: '1px'
                          },
                          '&:disabled': {
                            backgroundColor: '#F5F5F5',
                            cursor: 'not-allowed'
                          }
                        }}
                      />
                      {errors.valueCap && (
                        <Typography sx={{color: '#C40000', fontSize: '12px', mt: 0.5}}>{errors.valueCap}</Typography>
                      )}
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <div>
                      <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5}}>
                        <Typography
                          component="label"
                          sx={{
                            fontSize: '16px',
                            fontWeight: 700,
                            color: 'text.primary'
                          }}
                        >
                          Display Sequence
                          <Typography component="span" sx={{color: '#C40000', ml: 0.5}}>
                            *
                          </Typography>
                        </Typography>
                      </Box>
                      <Box
                        component="input"
                        type="number"
                        value={formData.displaySequence}
                        onChange={handleChange('displaySequence')}
                        onBlur={handleBlur('displaySequence')}
                        disabled={isSaving}
                        placeholder="Enter display sequence"
                        min="1"
                        sx={{
                          width: '100%',
                          padding: '10px 12px',
                          fontSize: '14px',
                          border: errors.displaySequence ? '1px solid #C40000' : '1px solid #CBCCCD',
                          borderRadius: '4px',
                          outline: 'none',
                          boxSizing: 'border-box',
                          '&:hover': {
                            borderColor: errors.displaySequence ? '#C40000' : '#999'
                          },
                          '&:focus': {
                            borderColor: errors.displaySequence ? '#C40000' : '#0C55B8',
                            borderWidth: '1px'
                          },
                          '&:disabled': {
                            backgroundColor: '#F5F5F5',
                            cursor: 'not-allowed'
                          }
                        }}
                      />
                      {errors.displaySequence && (
                        <Typography sx={{color: '#C40000', fontSize: '12px', mt: 0.5}}>
                          {errors.displaySequence}
                        </Typography>
                      )}
                    </div>
                  </Grid>
                </>
              ) : (
                <Grid item xs={12} md={6}>
                  <div>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5}}>
                      <Typography
                        component="label"
                        sx={{
                          fontSize: '16px',
                          fontWeight: 700,
                          color: 'text.primary'
                        }}
                      >
                        Display Sequence
                        <Typography component="span" sx={{color: '#C40000', ml: 0.5}}>
                          *
                        </Typography>
                      </Typography>
                    </Box>
                    <Box
                      component="input"
                      type="number"
                      value={formData.displaySequence}
                      onChange={handleChange('displaySequence')}
                      onBlur={handleBlur('displaySequence')}
                      disabled={isSaving}
                      placeholder="Enter display sequence"
                      min="1"
                      sx={{
                        width: '100%',
                        padding: '10px 12px',
                        fontSize: '14px',
                        border: errors.displaySequence ? '1px solid #C40000' : '1px solid #CBCCCD',
                        borderRadius: '4px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        '&:hover': {
                          borderColor: errors.displaySequence ? '#C40000' : '#999'
                        },
                        '&:focus': {
                          borderColor: errors.displaySequence ? '#C40000' : '#0C55B8',
                          borderWidth: '1px'
                        },
                        '&:disabled': {
                          backgroundColor: '#F5F5F5',
                          cursor: 'not-allowed'
                        }
                      }}
                    />
                    {errors.displaySequence && (
                      <Typography sx={{color: '#C40000', fontSize: '12px', mt: 0.5}}>
                        {errors.displaySequence}
                      </Typography>
                    )}
                  </div>
                </Grid>
              )}
            </Grid>

            {/* Fourth Row: Toggle Switches */}
            <Grid container spacing={2} sx={{mt: 2}}>
              <Grid item xs={12} md={6}>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5}}>
                  <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5, minWidth: '150px'}}>
                    <Typography
                      sx={{
                        fontSize: '16px',
                        fontWeight: 700,
                        color: '#323334'
                      }}
                    >
                      Required
                    </Typography>
                    <Tooltip
                      title="This indicates if the attribute is mandatory to support price computation for the product."
                      arrow
                      placement="top"
                    >
                      <HelpOutlineIcon sx={{fontSize: '16px', color: '#0066F5', cursor: 'help'}} />
                    </Tooltip>
                  </Box>
                  <Switch
                    checked={formData.required}
                    onChange={handleSwitchChange('required')}
                    disabled={isSaving}
                    sx={{
                      width: 36,
                      height: 20,
                      padding: 0,
                      '& .MuiSwitch-switchBase': {
                        padding: 0,
                        margin: 0,
                        transitionDuration: '300ms',
                        '&.Mui-checked': {
                          transform: 'translateX(16px)',
                          '& + .MuiSwitch-track': {
                            backgroundColor: '#FFFFFF',
                            opacity: 1,
                            border: '2px solid #0C55B8'
                          },
                          '& .MuiSwitch-thumb': {
                            backgroundColor: '#0C55B8',
                            '&:before': {
                              content: '""',
                              position: 'absolute',
                              width: '100%',
                              height: '100%',
                              backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white"><path d="M8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z"/></svg>')`,
                              backgroundRepeat: 'no-repeat',
                              backgroundPosition: 'center',
                              backgroundSize: '10px 10px'
                            }
                          }
                        },
                        '&.Mui-disabled': {
                          '& .MuiSwitch-thumb': {
                            backgroundColor: '#B1B2B4'
                          },
                          '&.Mui-checked .MuiSwitch-thumb': {
                            backgroundColor: '#B1B2B4'
                          },
                          '& + .MuiSwitch-track': {
                            opacity: 1,
                            border: '2px solid #B1B2B4',
                            backgroundColor: '#FFFFFF'
                          }
                        }
                      },
                      '& .MuiSwitch-thumb': {
                        width: 20,
                        height: 20,
                        backgroundColor: '#757575',
                        boxShadow: 'none'
                      },
                      '& .MuiSwitch-track': {
                        borderRadius: 10,
                        border: '2px solid #757575',
                        backgroundColor: '#FFFFFF',
                        opacity: 1,
                        transition: 'background-color 300ms, border-color 300ms',
                        boxSizing: 'border-box'
                      }
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 400,
                      color: '#323334',
                      minWidth: '30px'
                    }}
                  >
                    {formData.required ? 'Yes' : 'No'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5}}>
                  <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5, minWidth: '150px'}}>
                    <Typography
                      sx={{
                        fontSize: '16px',
                        fontWeight: 700,
                        color: '#323334'
                      }}
                    >
                      Negative Allowed
                    </Typography>
                    <Tooltip
                      title="This indicates if the transaction field allows for a negative value to be processed, input from transactions or user entry."
                      arrow
                      placement="top"
                    >
                      <HelpOutlineIcon sx={{fontSize: '16px', color: '#0066F5', cursor: 'help'}} />
                    </Tooltip>
                  </Box>
                  <Switch
                    checked={formData.negativeAllowed}
                    onChange={handleSwitchChange('negativeAllowed')}
                    disabled={isSaving}
                    sx={{
                      width: 36,
                      height: 20,
                      padding: 0,
                      '& .MuiSwitch-switchBase': {
                        padding: 0,
                        margin: 0,
                        transitionDuration: '300ms',
                        '&.Mui-checked': {
                          transform: 'translateX(16px)',
                          '& + .MuiSwitch-track': {
                            backgroundColor: '#FFFFFF',
                            opacity: 1,
                            border: '2px solid #0C55B8'
                          },
                          '& .MuiSwitch-thumb': {
                            backgroundColor: '#0C55B8',
                            '&:before': {
                              content: '""',
                              position: 'absolute',
                              width: '100%',
                              height: '100%',
                              backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white"><path d="M8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z"/></svg>')`,
                              backgroundRepeat: 'no-repeat',
                              backgroundPosition: 'center',
                              backgroundSize: '10px 10px'
                            }
                          }
                        },
                        '&.Mui-disabled': {
                          '& .MuiSwitch-thumb': {
                            backgroundColor: '#B1B2B4'
                          },
                          '&.Mui-checked .MuiSwitch-thumb': {
                            backgroundColor: '#B1B2B4'
                          },
                          '& + .MuiSwitch-track': {
                            opacity: 1,
                            border: '2px solid #B1B2B4',
                            backgroundColor: '#FFFFFF'
                          }
                        }
                      },
                      '& .MuiSwitch-thumb': {
                        width: 20,
                        height: 20,
                        backgroundColor: '#757575',
                        boxShadow: 'none'
                      },
                      '& .MuiSwitch-track': {
                        borderRadius: 10,
                        border: '2px solid #757575',
                        backgroundColor: '#FFFFFF',
                        opacity: 1,
                        transition: 'background-color 300ms, border-color 300ms',
                        boxSizing: 'border-box'
                      }
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 400,
                      color: '#323334',
                      minWidth: '30px'
                    }}
                  >
                    {formData.negativeAllowed ? 'Yes' : 'No'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5, mt: 2}}>
                  <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5, minWidth: '150px'}}>
                    <Typography
                      sx={{
                        fontSize: '16px',
                        fontWeight: 700,
                        color: '#323334'
                      }}
                    >
                      Summarization
                    </Typography>
                    <Tooltip
                      title="Enabling the flag serves 2 purposes. It allows for usage to be aggregated from transactions that contribute to a single charge. Additionally, it pools usage across accounts in the customer hierarchy for tier benefits. This summarization is performed for the measurement period indicated in the price list entry."
                      arrow
                      placement="top"
                    >
                      <HelpOutlineIcon sx={{fontSize: '16px', color: '#0066F5', cursor: 'help'}} />
                    </Tooltip>
                  </Box>
                  <Switch
                    checked={formData.summarization}
                    onChange={handleSwitchChange('summarization')}
                    disabled={isSaving}
                    sx={{
                      width: 36,
                      height: 20,
                      padding: 0,
                      '& .MuiSwitch-switchBase': {
                        padding: 0,
                        margin: 0,
                        transitionDuration: '300ms',
                        '&.Mui-checked': {
                          transform: 'translateX(16px)',
                          '& + .MuiSwitch-track': {
                            backgroundColor: '#FFFFFF',
                            opacity: 1,
                            border: '2px solid #0C55B8'
                          },
                          '& .MuiSwitch-thumb': {
                            backgroundColor: '#0C55B8',
                            '&:before': {
                              content: '""',
                              position: 'absolute',
                              width: '100%',
                              height: '100%',
                              backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white"><path d="M8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z"/></svg>')`,
                              backgroundRepeat: 'no-repeat',
                              backgroundPosition: 'center',
                              backgroundSize: '10px 10px'
                            }
                          }
                        },
                        '&.Mui-disabled': {
                          '& .MuiSwitch-thumb': {
                            backgroundColor: '#B1B2B4'
                          },
                          '&.Mui-checked .MuiSwitch-thumb': {
                            backgroundColor: '#B1B2B4'
                          },
                          '& + .MuiSwitch-track': {
                            opacity: 1,
                            border: '2px solid #B1B2B4',
                            backgroundColor: '#FFFFFF'
                          }
                        }
                      },
                      '& .MuiSwitch-thumb': {
                        width: 20,
                        height: 20,
                        backgroundColor: '#757575',
                        boxShadow: 'none'
                      },
                      '& .MuiSwitch-track': {
                        borderRadius: 10,
                        border: '2px solid #757575',
                        backgroundColor: '#FFFFFF',
                        opacity: 1,
                        transition: 'background-color 300ms, border-color 300ms',
                        boxSizing: 'border-box'
                      }
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 400,
                      color: '#323334',
                      minWidth: '30px'
                    }}
                  >
                    {formData.summarization ? 'Yes' : 'No'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5, mt: 2}}>
                  <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5, minWidth: '150px'}}>
                    <Typography
                      sx={{
                        fontSize: '16px',
                        fontWeight: 700,
                        color: '#323334'
                      }}
                    >
                      Account Usage
                    </Typography>
                    <Tooltip
                      title="Enabling this switch will indicate that the recorded usage linked to this user-defined field, such as balance details, will be applicable to all products associated with the account."
                      arrow
                      placement="top"
                    >
                      <HelpOutlineIcon sx={{fontSize: '16px', color: '#0066F5', cursor: 'help'}} />
                    </Tooltip>
                  </Box>
                  <Switch
                    checked={formData.accountUsage}
                    onChange={handleSwitchChange('accountUsage')}
                    disabled={isSaving}
                    sx={{
                      width: 36,
                      height: 20,
                      padding: 0,
                      '& .MuiSwitch-switchBase': {
                        padding: 0,
                        margin: 0,
                        transitionDuration: '300ms',
                        '&.Mui-checked': {
                          transform: 'translateX(16px)',
                          '& + .MuiSwitch-track': {
                            backgroundColor: '#FFFFFF',
                            opacity: 1,
                            border: '2px solid #0C55B8'
                          },
                          '& .MuiSwitch-thumb': {
                            backgroundColor: '#0C55B8',
                            '&:before': {
                              content: '""',
                              position: 'absolute',
                              width: '100%',
                              height: '100%',
                              backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white"><path d="M8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z"/></svg>')`,
                              backgroundRepeat: 'no-repeat',
                              backgroundPosition: 'center',
                              backgroundSize: '10px 10px'
                            }
                          }
                        },
                        '&.Mui-disabled': {
                          '& .MuiSwitch-thumb': {
                            backgroundColor: '#B1B2B4'
                          },
                          '&.Mui-checked .MuiSwitch-thumb': {
                            backgroundColor: '#B1B2B4'
                          },
                          '& + .MuiSwitch-track': {
                            opacity: 1,
                            border: '2px solid #B1B2B4',
                            backgroundColor: '#FFFFFF'
                          }
                        }
                      },
                      '& .MuiSwitch-thumb': {
                        width: 20,
                        height: 20,
                        backgroundColor: '#757575',
                        boxShadow: 'none'
                      },
                      '& .MuiSwitch-track': {
                        borderRadius: 10,
                        border: '2px solid #757575',
                        backgroundColor: '#FFFFFF',
                        opacity: 1,
                        transition: 'background-color 300ms, border-color 300ms',
                        boxSizing: 'border-box'
                      }
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 400,
                      color: '#323334',
                      minWidth: '30px'
                    }}
                  >
                    {formData.accountUsage ? 'Yes' : 'No'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5, mt: 2}}>
                  <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5, minWidth: '150px'}}>
                    <Typography
                      sx={{
                        fontSize: '16px',
                        fontWeight: 700,
                        color: '#323334'
                      }}
                    >
                      Calculated
                    </Typography>
                    <Tooltip
                      title="Enabling this flag will make the field unavailable for user input, as its value is computed."
                      arrow
                      placement="top"
                    >
                      <HelpOutlineIcon sx={{fontSize: '16px', color: '#0066F5', cursor: 'help'}} />
                    </Tooltip>
                  </Box>
                  <Switch
                    checked={formData.calculated}
                    onChange={handleSwitchChange('calculated')}
                    disabled={isSaving}
                    sx={{
                      width: 36,
                      height: 20,
                      padding: 0,
                      '& .MuiSwitch-switchBase': {
                        padding: 0,
                        margin: 0,
                        transitionDuration: '300ms',
                        '&.Mui-checked': {
                          transform: 'translateX(16px)',
                          '& + .MuiSwitch-track': {
                            backgroundColor: '#FFFFFF',
                            opacity: 1,
                            border: '2px solid #0C55B8'
                          },
                          '& .MuiSwitch-thumb': {
                            backgroundColor: '#0C55B8',
                            '&:before': {
                              content: '""',
                              position: 'absolute',
                              width: '100%',
                              height: '100%',
                              backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white"><path d="M8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z"/></svg>')`,
                              backgroundRepeat: 'no-repeat',
                              backgroundPosition: 'center',
                              backgroundSize: '10px 10px'
                            }
                          }
                        },
                        '&.Mui-disabled': {
                          '& .MuiSwitch-thumb': {
                            backgroundColor: '#B1B2B4'
                          },
                          '&.Mui-checked .MuiSwitch-thumb': {
                            backgroundColor: '#B1B2B4'
                          },
                          '& + .MuiSwitch-track': {
                            opacity: 1,
                            border: '2px solid #B1B2B4',
                            backgroundColor: '#FFFFFF'
                          }
                        }
                      },
                      '& .MuiSwitch-thumb': {
                        width: 20,
                        height: 20,
                        backgroundColor: '#757575',
                        boxShadow: 'none'
                      },
                      '& .MuiSwitch-track': {
                        borderRadius: 10,
                        border: '2px solid #757575',
                        backgroundColor: '#FFFFFF',
                        opacity: 1,
                        transition: 'background-color 300ms, border-color 300ms',
                        boxSizing: 'border-box'
                      }
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 400,
                      color: '#323334',
                      minWidth: '30px'
                    }}
                  >
                    {formData.calculated ? 'Yes' : 'No'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Notes Tab */}
        {activeTab === 1 && (
          <Box sx={{pt: 2, px: 1, pb: 1}}>
            <Typography
              component="label"
              sx={{
                fontSize: '16px',
                fontWeight: 700,
                color: 'text.primary',
                display: 'block',
                mb: 1
              }}
            >
              Notes
            </Typography>
            <Box
              component="textarea"
              value={formData.notes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                if (e.target.value.length <= 1000) {
                  setFormData((prev) => ({
                    ...prev,
                    notes: e.target.value
                  }));
                }
              }}
              disabled={isSaving}
              placeholder="Enter notes"
              sx={{
                width: '100%',
                minHeight: '200px',
                padding: '10px 12px',
                fontSize: '14px',
                border: '1px solid #CBCCCD',
                borderRadius: '4px',
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                resize: 'vertical',
                '&:hover': {
                  borderColor: '#999'
                },
                '&:focus': {
                  borderColor: '#0C55B8',
                  borderWidth: '1px'
                },
                '&:disabled': {
                  backgroundColor: '#F5F5F5',
                  cursor: 'not-allowed'
                }
              }}
            />
            <Typography sx={{fontSize: '12px', color: '#6E7072', mt: 0.5, textAlign: 'right'}}>
              {formData.notes.length}/1000
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{px: 3, py: 2, gap: 1}}>
        <Button
          onClick={handleClose}
          variant="outlined"
          disabled={isSaving}
          sx={{
            borderColor: '#002677',
            color: '#002677',
            borderRadius: '46px',
            padding: '6px 24px',
            fontSize: '14px',
            fontWeight: 700,
            textTransform: 'none',
            fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
            '&:hover': {
              borderColor: '#001a5c',
              backgroundColor: 'rgba(0, 38, 119, 0.04)'
            }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={isSaving}
          sx={{
            backgroundColor: '#002677',
            color: '#FFFFFF',
            borderRadius: '46px',
            padding: '6px 24px',
            fontSize: '14px',
            fontWeight: 700,
            textTransform: 'none',
            fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
            '&:hover': {
              backgroundColor: '#001a5c'
            }
          }}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TransactionFieldDialog;
