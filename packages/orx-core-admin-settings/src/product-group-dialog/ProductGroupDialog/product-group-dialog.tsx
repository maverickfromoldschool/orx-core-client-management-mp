import React, {useEffect, useState} from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
  Switch,
  Tabs,
  Tab,
  Chip,
  FormControl,
  Autocomplete,
  TextField
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import {Controller, useForm} from 'react-hook-form';

import type {ProductGroupFormData} from '../../components/product-group-types';
import {apiDataToFormData, formDataToApiData} from '../../components/product-group-mappers';

import type {ProductGroupDialogProps, DropdownOption} from './product-group-dialog.types';

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
      id={`product-group-tabpanel-${index}`}
      aria-labelledby={`product-group-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{py: 3}}>{children}</Box>}
    </div>
  );
}

export function ProductGroupDialog({
  open,
  mode,
  onClose,
  onSave,
  initialValue,
  isSaving = false,
  productCategoryOptions,
  externalSystemOptions,
  accountingCodeOptions,
  attributeOptions,
  variantOptions,
  uomOptions,
  lookupsLoading = false
}: ProductGroupDialogProps) {
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: {errors, isValid}
  } = useForm<ProductGroupFormData>({
    mode: 'onChange',
    defaultValues: {
      productGroup: '',
      name: '',
      productCategory: '',
      externalSystem: '',
      administrative: false,
      retrievalSettings: false,
      baseUOM: '',
      billingDeterminants: false,
      accountingCode: '',
      externalReferenceNumber: ''
    }
  });

  const productGroup = watch('productGroup');
  const name = watch('name');

  // Reset form when dialog opens or initialValue changes
  useEffect(() => {
    if (open) {
      if (initialValue) {
        const {
          formData,
          selectedAttributes: attrs,
          selectedVariants: vars,
          notes: notesText
        } = apiDataToFormData(initialValue, [], [], '');

        reset({
          ...formData,
          productGroup: mode === 'copy' ? '' : formData.productGroup
        });
        setSelectedAttributes(attrs);
        setSelectedVariants(vars);
        setNotes(notesText);
      } else {
        reset({
          productGroup: '',
          name: '',
          productCategory: '',
          externalSystem: '',
          administrative: false,
          retrievalSettings: false,
          baseUOM: '',
          billingDeterminants: false,
          accountingCode: '',
          externalReferenceNumber: ''
        });
        setSelectedAttributes([]);
        setSelectedVariants([]);
        setNotes('');
      }
      setCurrentTab(0);
    }
  }, [open, initialValue, mode, reset]);

  const onSubmit = (data: ProductGroupFormData) => {
    const apiData = formDataToApiData(
      data,
      selectedAttributes,
      selectedVariants,
      notes,
      mode === 'edit' ? initialValue : undefined
    );
    onSave(apiData);
  };

  const handleClose = () => {
    if (!isSaving) {
      onClose();
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleRemoveAttribute = (attr: string) => {
    setSelectedAttributes((prev) => prev.filter((a) => a !== attr));
  };

  const handleRemoveVariant = (variant: string) => {
    setSelectedVariants((prev) => prev.filter((v) => v !== variant));
  };

  const handleAddAttribute = (value: string) => {
    if (value && !selectedAttributes.includes(value)) {
      setSelectedAttributes((prev) => [...prev, value]);
    }
  };

  const handleAddVariant = (value: string) => {
    if (value && !selectedVariants.includes(value)) {
      setSelectedVariants((prev) => [...prev, value]);
    }
  };

  const getDialogTitle = () => {
    if (mode === 'create') return 'Add Product Group';
    if (mode === 'copy') return 'Copy Product Group';
    return 'Edit Product Group';
  };

  const dialogTitle = getDialogTitle();

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          minHeight: '600px'
        }
      }}
    >
      {/* Dialog Title */}
      <DialogTitle
        sx={{
          fontSize: '20px',
          fontWeight: 700,
          color: '#002677',
          fontFamily: '"Enterprise Sans VF", sans-serif',
          borderBottom: '1px solid #CBCCCD',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {dialogTitle}
        <IconButton
          onClick={handleClose}
          disabled={isSaving}
          size="small"
          sx={{
            color: '#6F7172'
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Tabs */}
      <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          aria-label="product group tabs"
          sx={{
            px: 3,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '14px',
              fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
              color: '#4B4D4F',
              '&.Mui-selected': {
                color: '#002677'
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#002677'
            }
          }}
        >
          <Tab label="Main" />
          <Tab label="Retrieval Settings" />
          <Tab label="Notes" />
        </Tabs>
      </Box>

      {/* Dialog Content */}
      <DialogContent sx={{px: 3}}>
        <form id="product-group-form" onSubmit={handleSubmit(onSubmit)}>
          {/* Tab 1: Main */}
          <TabPanel value={currentTab} index={0}>
            <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
              {/* Row 1: Product Group and Name */}
              <Box sx={{display: 'flex', gap: 2}}>
                <Box sx={{flex: 1}}>
                  <Typography
                    component="label"
                    sx={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: 'text.primary',
                      display: 'block',
                      mb: 0.5
                    }}
                  >
                    Product Group
                    <Typography component="span" sx={{color: '#C40000', ml: 0.5}}>
                      *
                    </Typography>
                  </Typography>
                  <Controller
                    name="productGroup"
                    control={control}
                    rules={{
                      required: 'Required field',
                      maxLength: {
                        value: 30,
                        message: 'Maximum 30 characters'
                      }
                    }}
                    render={({field}) => (
                      <div>
                        <Box
                          component="input"
                          {...field}
                          disabled={mode === 'edit'}
                          placeholder="e.g., ANLYS-GEN"
                          maxLength={30}
                          sx={{
                            width: '100%',
                            padding: '10px 12px',
                            fontSize: '14px',
                            border: errors.productGroup ? '1px solid #C40000' : '1px solid #CBCCCD',
                            borderRadius: '4px',
                            outline: 'none',
                            boxSizing: 'border-box',
                            fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                            '&:hover': {
                              borderColor: errors.productGroup ? '#C40000' : '#999'
                            },
                            '&:focus': {
                              borderColor: errors.productGroup ? '#C40000' : '#0C55B8',
                              borderWidth: '1px'
                            },
                            '&:disabled': {
                              backgroundColor: '#F5F5F5',
                              cursor: 'not-allowed'
                            }
                          }}
                        />
                        {errors.productGroup ? (
                          <Typography sx={{color: '#C40000', fontSize: '12px', mt: 0.5}}>
                            {errors.productGroup.message}
                          </Typography>
                        ) : (
                          <Typography sx={{fontSize: '12px', color: '#6E7072', mt: 0.5, textAlign: 'right'}}>
                            {productGroup.length}/30
                          </Typography>
                        )}
                      </div>
                    )}
                  />
                </Box>
                <Box sx={{flex: 1}}>
                  <Typography
                    component="label"
                    sx={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: 'text.primary',
                      display: 'block',
                      mb: 0.5
                    }}
                  >
                    Name
                    <Typography component="span" sx={{color: '#C40000', ml: 0.5}}>
                      *
                    </Typography>
                  </Typography>
                  <Controller
                    name="name"
                    control={control}
                    rules={{
                      required: 'Required field',
                      maxLength: {
                        value: 50,
                        message: 'Maximum 50 characters'
                      }
                    }}
                    render={({field}) => (
                      <div>
                        <Box
                          component="input"
                          {...field}
                          placeholder="e.g., Account Services"
                          maxLength={50}
                          sx={{
                            width: '100%',
                            padding: '10px 12px',
                            fontSize: '14px',
                            border: errors.name ? '1px solid #C40000' : '1px solid #CBCCCD',
                            borderRadius: '4px',
                            outline: 'none',
                            boxSizing: 'border-box',
                            fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                            '&:hover': {
                              borderColor: errors.name ? '#C40000' : '#999'
                            },
                            '&:focus': {
                              borderColor: errors.name ? '#C40000' : '#0C55B8',
                              borderWidth: '1px'
                            }
                          }}
                        />
                        {errors.name ? (
                          <Typography sx={{color: '#C40000', fontSize: '12px', mt: 0.5}}>
                            {errors.name.message}
                          </Typography>
                        ) : (
                          <Typography sx={{fontSize: '12px', color: '#6E7072', mt: 0.5, textAlign: 'right'}}>
                            {name.length}/50
                          </Typography>
                        )}
                      </div>
                    )}
                  />
                </Box>
              </Box>

              {/* Row 2: Product Category */}
              <Box sx={{display: 'flex', gap: 2}}>
                <Box sx={{flex: 1}}>
                  <Typography
                    component="label"
                    sx={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: 'text.primary',
                      display: 'block',
                      mb: 0.5
                    }}
                  >
                    Product Category
                    <Typography component="span" sx={{color: '#C40000', ml: 0.5}}>
                      *
                    </Typography>
                  </Typography>
                  <Controller
                    name="productCategory"
                    control={control}
                    rules={{required: 'Required field'}}
                    render={({field}) => (
                      <div>
                        <Box
                          component="select"
                          {...field}
                          disabled={lookupsLoading}
                          sx={{
                            width: '100%',
                            padding: '10px 12px',
                            fontSize: '14px',
                            border: errors.productCategory ? '1px solid #C40000' : '1px solid #CBCCCD',
                            borderRadius: '4px',
                            outline: 'none',
                            boxSizing: 'border-box',
                            fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                            backgroundColor: '#FFFFFF',
                            cursor: 'pointer',
                            '&:hover': {
                              borderColor: errors.productCategory ? '#C40000' : '#999'
                            },
                            '&:focus': {
                              borderColor: errors.productCategory ? '#C40000' : '#0C55B8',
                              borderWidth: '1px'
                            },
                            '&:disabled': {
                              backgroundColor: '#F5F5F5',
                              cursor: 'not-allowed'
                            }
                          }}
                        >
                          <option value="">{lookupsLoading ? 'Loading...' : 'Select category'}</option>
                          {productCategoryOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label} ({option.value})
                            </option>
                          ))}
                        </Box>
                        {errors.productCategory && (
                          <Typography sx={{color: '#C40000', fontSize: '12px', mt: 0.5}}>
                            {errors.productCategory.message}
                          </Typography>
                        )}
                      </div>
                    )}
                  />
                </Box>
              </Box>

              {/* Row 3: Base UOM and Accounting Code */}
              <Box sx={{display: 'flex', gap: 2}}>
                <Box sx={{flex: 1}}>
                  <Typography
                    component="label"
                    sx={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: 'text.primary',
                      display: 'block',
                      mb: 0.5
                    }}
                  >
                    Base UOM
                  </Typography>
                  <Controller
                    name="baseUOM"
                    control={control}
                    render={({field: {onChange, value}}) => (
                      <Autocomplete<DropdownOption>
                        value={uomOptions.find((opt) => opt.value === value) || null}
                        onChange={(_event, newValue) => {
                          onChange(newValue ? newValue.value : '');
                        }}
                        options={uomOptions}
                        getOptionLabel={(option) => `${option.label} (${option.value})`}
                        disabled={lookupsLoading}
                        popupIcon={<SearchIcon />}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={lookupsLoading ? 'Loading...' : 'Search for UOM'}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                padding: '2px 12px',
                                fontSize: '14px',
                                fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                                '& fieldset': {
                                  borderColor: '#CBCCCD'
                                },
                                '&:hover fieldset': {
                                  borderColor: '#999'
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#0C55B8',
                                  borderWidth: '1px'
                                }
                              },
                              '& .MuiInputBase-input': {
                                fontSize: '14px',
                                fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                              }
                            }}
                          />
                        )}
                        sx={{
                          '& .MuiAutocomplete-popupIndicator': {
                            color: '#0C55B8'
                          }
                        }}
                      />
                    )}
                  />
                </Box>
                <Box sx={{flex: 1}}>
                  <Typography
                    component="label"
                    sx={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: 'text.primary',
                      display: 'block',
                      mb: 0.5
                    }}
                  >
                    Accounting Code
                  </Typography>
                  <Controller
                    name="accountingCode"
                    control={control}
                    render={({field: {onChange, value}}) => (
                      <Autocomplete
                        value={accountingCodeOptions.find((opt) => opt.value === value) || null}
                        onChange={(_event, newValue) => {
                          onChange(newValue ? newValue.value : '');
                        }}
                        options={accountingCodeOptions}
                        getOptionLabel={(option) => `${option.label} (${option.value})`}
                        disabled={lookupsLoading}
                        popupIcon={<SearchIcon />}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={lookupsLoading ? 'Loading...' : 'Search accounting code'}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                padding: '2px 12px',
                                fontSize: '14px',
                                fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                                '& fieldset': {
                                  borderColor: '#CBCCCD'
                                },
                                '&:hover fieldset': {
                                  borderColor: '#999'
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#0C55B8',
                                  borderWidth: '1px'
                                }
                              },
                              '& .MuiInputBase-input': {
                                fontSize: '14px',
                                fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                              }
                            }}
                          />
                        )}
                        sx={{
                          '& .MuiAutocomplete-popupIndicator': {
                            color: '#0C55B8'
                          }
                        }}
                      />
                    )}
                  />
                </Box>
              </Box>

              {/* Row 4: External System and External Reference Number */}
              <Box sx={{display: 'flex', gap: 2}}>
                <Box sx={{flex: 1}}>
                  <Typography
                    component="label"
                    sx={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: 'text.primary',
                      display: 'block',
                      mb: 0.5
                    }}
                  >
                    External System
                  </Typography>
                  <Controller
                    name="externalSystem"
                    control={control}
                    render={({field}) => (
                      <Box
                        component="select"
                        {...field}
                        disabled={lookupsLoading}
                        sx={{
                          width: '100%',
                          padding: '10px 12px',
                          fontSize: '14px',
                          border: '1px solid #CBCCCD',
                          borderRadius: '4px',
                          outline: 'none',
                          boxSizing: 'border-box',
                          fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                          backgroundColor: '#FFFFFF',
                          cursor: 'pointer',
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
                      >
                        <option value="">{lookupsLoading ? 'Loading...' : 'Select external system'}</option>
                        {externalSystemOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label} ({option.value})
                          </option>
                        ))}
                      </Box>
                    )}
                  />
                </Box>
                <Box sx={{flex: 1}}>
                  <Typography
                    component="label"
                    sx={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: 'text.primary',
                      display: 'block',
                      mb: 0.5
                    }}
                  >
                    External Reference Number
                  </Typography>
                  <Controller
                    name="externalReferenceNumber"
                    control={control}
                    render={({field}) => (
                      <Box
                        component="input"
                        {...field}
                        placeholder="Enter reference number"
                        sx={{
                          width: '100%',
                          padding: '10px 12px',
                          fontSize: '14px',
                          border: '1px solid #CBCCCD',
                          borderRadius: '4px',
                          outline: 'none',
                          boxSizing: 'border-box',
                          fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                          '&:hover': {
                            borderColor: '#999'
                          },
                          '&:focus': {
                            borderColor: '#0C55B8',
                            borderWidth: '1px'
                          }
                        }}
                      />
                    )}
                  />
                </Box>
              </Box>

              {/* Row 5: Switches */}
              <Box sx={{display: 'flex', gap: 3, alignItems: 'center'}}>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5}}>
                  <Typography sx={{fontSize: '16px', fontWeight: 700, color: '#323334'}}>
                    Billing Determinants
                  </Typography>
                  <Controller
                    name="billingDeterminants"
                    control={control}
                    render={({field}) => (
                      <Switch
                        checked={field.value}
                        onChange={field.onChange}
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
                    )}
                  />
                  <Controller
                    name="billingDeterminants"
                    control={control}
                    render={({field}) => (
                      <Typography sx={{fontSize: '14px', fontWeight: 400, color: '#323334', minWidth: '30px'}}>
                        {field.value ? 'Yes' : 'No'}
                      </Typography>
                    )}
                  />
                </Box>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5}}>
                  <Typography sx={{fontSize: '16px', fontWeight: 700, color: '#323334'}}>
                    Administrative Group
                  </Typography>
                  <Controller
                    name="administrative"
                    control={control}
                    render={({field}) => (
                      <Switch
                        checked={field.value}
                        onChange={field.onChange}
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
                    )}
                  />
                  <Controller
                    name="administrative"
                    control={control}
                    render={({field}) => (
                      <Typography sx={{fontSize: '14px', fontWeight: 400, color: '#323334', minWidth: '30px'}}>
                        {field.value ? 'Yes' : 'No'}
                      </Typography>
                    )}
                  />
                </Box>
              </Box>
            </Box>
          </TabPanel>

          {/* Tab 2: Retrieval Settings */}
          <TabPanel value={currentTab} index={1}>
            {/* Attributes Section */}
            <Box sx={{mb: 4}}>
              <Typography sx={{fontSize: '18px', fontWeight: 700, mb: 2, color: '#002677'}}>Attributes</Typography>
              <FormControl fullWidth>
                <Typography sx={{fontSize: '14px', fontWeight: 600, mb: 1}}>Attribute(s)</Typography>
                <Box sx={{mb: 2}}>
                  <Box
                    component="select"
                    disabled={lookupsLoading}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      handleAddAttribute(e.target.value);
                      e.target.value = '';
                    }}
                    sx={{
                      width: '100%',
                      padding: '10px 12px',
                      fontSize: '14px',
                      border: '1px solid #CBCCCD',
                      borderRadius: '4px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                      backgroundColor: '#FFFFFF',
                      cursor: 'pointer',
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
                  >
                    <option value="">{lookupsLoading ? 'Loading...' : 'Select attribute to add'}</option>
                    {attributeOptions
                      .filter((opt) => !selectedAttributes.includes(opt.value))
                      .map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label} ({option.value})
                        </option>
                      ))}
                  </Box>
                </Box>
                <Box
                  sx={{
                    border: '1px solid #CBCCCD',
                    borderRadius: '4px',
                    p: 1.5,
                    minHeight: '56px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    alignItems: 'center'
                  }}
                >
                  {selectedAttributes.length === 0 ? (
                    <Typography sx={{color: '#6F7172', fontSize: '14px'}}>No attributes selected</Typography>
                  ) : (
                    selectedAttributes.map((attr) => (
                      <Chip
                        key={attr}
                        label={attributeOptions.find((opt) => opt.value === attr)?.label || attr}
                        onDelete={() => {
                          handleRemoveAttribute(attr);
                        }}
                        sx={{backgroundColor: '#E0E0E0'}}
                      />
                    ))
                  )}
                </Box>
              </FormControl>
            </Box>

            {/* Variants Section */}
            <div>
              <Typography sx={{fontSize: '18px', fontWeight: 700, mb: 2, color: '#002677'}}>Variants</Typography>
              <FormControl fullWidth>
                <Typography sx={{fontSize: '14px', fontWeight: 600, mb: 1}}>Variant(s)</Typography>
                <Box sx={{mb: 2}}>
                  <Box
                    component="select"
                    disabled={lookupsLoading}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      handleAddVariant(e.target.value);
                      e.target.value = '';
                    }}
                    sx={{
                      width: '100%',
                      padding: '10px 12px',
                      fontSize: '14px',
                      border: '1px solid #CBCCCD',
                      borderRadius: '4px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                      backgroundColor: '#FFFFFF',
                      cursor: 'pointer',
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
                  >
                    <option value="">{lookupsLoading ? 'Loading...' : 'Select variant to add'}</option>
                    {variantOptions
                      .filter((opt) => !selectedVariants.includes(opt.value))
                      .map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label} ({option.value})
                        </option>
                      ))}
                  </Box>
                </Box>
                <Box
                  sx={{
                    border: '1px solid #CBCCCD',
                    borderRadius: '4px',
                    p: 1.5,
                    minHeight: '56px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    alignItems: 'center'
                  }}
                >
                  {selectedVariants.length === 0 ? (
                    <Typography sx={{color: '#6F7172', fontSize: '14px'}}>No variants selected</Typography>
                  ) : (
                    selectedVariants.map((variant) => (
                      <Chip
                        key={variant}
                        label={variantOptions.find((opt) => opt.value === variant)?.label || variant}
                        onDelete={() => {
                          handleRemoveVariant(variant);
                        }}
                        sx={{backgroundColor: '#E0E0E0'}}
                      />
                    ))
                  )}
                </Box>
              </FormControl>
            </div>
          </TabPanel>

          {/* Tab 3: Plugins */}
          {/* Tab 3: Notes */}
          <TabPanel value={currentTab} index={2}>
            <Typography sx={{fontSize: '14px', color: '#6F7172', mb: 2}}>
              Please describe the nature of the product group in context.
            </Typography>
            <Box
              component="textarea"
              value={notes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setNotes(e.target.value);
              }}
              placeholder="Enter notes here..."
              maxLength={1000}
              rows={8}
              sx={{
                width: '100%',
                padding: '10px',
                fontSize: '14px',
                border: '1px solid #CBCCCD',
                borderRadius: '4px',
                outline: 'none',
                fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                resize: 'vertical',
                marginBottom: 1,
                boxSizing: 'border-box',
                '&:hover': {
                  borderColor: '#999'
                },
                '&:focus': {
                  borderColor: '#0C55B8',
                  borderWidth: '1px'
                }
              }}
            />
            <Typography
              sx={{
                fontSize: '12px',
                color: '#6F7172',
                textAlign: 'right',
                fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
              }}
            >
              {notes.length} / 1000
            </Typography>
          </TabPanel>
        </form>
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: '1px solid #CBCCCD'
        }}
      >
        <Button
          onClick={handleClose}
          disabled={isSaving}
          variant="outlined"
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
          type="submit"
          form="product-group-form"
          disabled={!isValid || isSaving}
          variant="contained"
          sx={{
            backgroundColor: '#002677',
            color: '#FFFFFF',
            borderRadius: '46px',
            textTransform: 'none',
            fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
            fontWeight: 700,
            px: 3,
            '&:hover': {
              backgroundColor: '#001a5c'
            },
            '&.Mui-disabled': {
              backgroundColor: '#E0E0E0',
              color: '#9E9E9E'
            }
          }}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProductGroupDialog;
