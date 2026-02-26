import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
  MenuItem
} from '@mui/material';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import dayjs, {Dayjs} from 'dayjs';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';

import {AddProductDialogProps} from '../types';
import {addProductSchema, AddProductSchemaType} from '../schemas/add-product-schema';
import {useProductGroupOptions} from '../../../hooks/use-product-group-options';
import {useProductTypeOptions} from '../../../hooks/use-product-type-options';
import {useChargeTypeOptions} from '../../../hooks/use-charge-type-options';
import {useUomOptions} from '../../../hooks/use-uom-options';
import {useAccountingCodeOptions} from '../../../hooks/use-accounting-code-options';

/**
 * AddProductDialog component
 * Modal dialog for adding a new product with form validation
 * Design based on Figma: CORE - Dev Ready (node-id: 1301-5331)
 */
export const AddProductDialog: React.FC<AddProductDialogProps> = ({open, onClose, onSave, initialValues}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: {errors, isValid}
  } = useForm<AddProductSchemaType>({
    resolver: zodResolver(addProductSchema),
    mode: 'onChange',
    defaultValues: {
      productCode: initialValues?.productCode || '',
      productGroup: initialValues?.productGroup || '',
      productName: initialValues?.productName || '',
      baseUom: initialValues?.baseUom || '',
      productType: initialValues?.productType || '',
      bundleClass: initialValues?.bundleClass || '',
      accountingCode: initialValues?.accountingCode || '',
      chargeType: initialValues?.chargeType || '',
      effectiveDate: initialValues?.effectiveDate || ''
    }
  });

  /**
   * Handle dialog close and reset form
   */
  const handleClose = () => {
    reset();
    onClose();
  };

  /**
   * Handle form submission
   */
  const onSubmit = (data: AddProductSchemaType) => {
    onSave?.(data);
  };

  // Lookup options
  const {productGroupOptions, loadingProductGroups} = useProductGroupOptions();
  const {productTypeOptions, loadingProductTypes} = useProductTypeOptions();
  const {chargeTypeOptions, loadingChargeTypes} = useChargeTypeOptions();
  const {uomOptions, loadingUoms} = useUomOptions();
  const {accountingCodeOptions, loadingAccountingCodes} = useAccountingCodeOptions();

  // Common styles for text inputs
  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      height: '40px',
      backgroundColor: '#FFFFFF',
      borderRadius: '4px',
      fontSize: '16px',
      '& fieldset': {
        borderColor: '#CBCCCD',
        borderWidth: '1px'
      },
      '&:hover fieldset': {
        borderColor: '#323334',
        borderWidth: '1px'
      },
      '&.Mui-focused fieldset': {
        borderColor: '#0066F5',
        borderWidth: '2px'
      }
    },
    '& .MuiInputBase-input': {
      padding: '8px 16px',
      fontSize: '16px',
      lineHeight: '24px',
      color: '#323334',
      '&::placeholder': {
        color: '#757575',
        opacity: 1
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          width: '852px',
          minHeight: '664px',
          borderRadius: '24px',
          padding: '24px',
          backgroundColor: '#F8F8F8',
          boxShadow:
            '0px 11px 15px -7px rgba(0, 0, 0, 0.2), 0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12)'
        }
      }}
    >
      {/* Dialog Header */}
      <DialogTitle
        sx={{
          padding: 0,
          marginBottom: '40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: '28.83px',
            lineHeight: '36px',
            letterSpacing: '0%',
            verticalAlign: 'middle',
            color: '#002677'
          }}
        >
          Add Product
        </Typography>
        <IconButton
          onClick={handleClose}
          size="small"
          aria-label="close dialog"
          sx={{
            padding: '4px',
            color: '#323334',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)'
            }
          }}
        >
          <CloseIcon sx={{fontSize: '24px'}} />
        </IconButton>
      </DialogTitle>

      {/* Dialog Content */}
      <DialogContent sx={{padding: 0, overflow: 'visible'}}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              marginBottom: '40px'
            }}
          >
            {/* Row 1: Product Code & Product Group */}
            <Box sx={{display: 'flex', gap: '24px'}}>
              {/* Product Code */}
              <Box sx={{flex: 1}}>
                <Box sx={{display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px'}}>
                  <Typography
                    component="label"
                    sx={{
                      fontWeight: 400,
                      fontSize: '16px',
                      lineHeight: '24px',
                      color: '#323334'
                    }}
                  >
                    Product Code <span style={{color: '#D32F2F'}}>*</span>
                  </Typography>
                  <IconButton size="small" sx={{padding: 0, color: '#0066F5', width: '16px', height: '16px'}}>
                    <InfoOutlinedIcon sx={{fontSize: '16px'}} />
                  </IconButton>
                </Box>
                <Controller
                  name="productCode"
                  control={control}
                  render={({field}) => (
                    <TextField
                      {...field}
                      fullWidth
                      placeholder="code"
                      error={!!errors.productCode}
                      helperText={errors.productCode?.message}
                      sx={textFieldStyles}
                    />
                  )}
                />
              </Box>

              {/* Product Group */}
              <Box sx={{flex: 1, position: 'relative'}}>
                <Box sx={{display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px'}}>
                  <Typography
                    component="label"
                    sx={{
                      fontWeight: 400,
                      fontSize: '16px',
                      lineHeight: '24px',
                      color: '#323334'
                    }}
                  >
                    Product Group <span style={{color: '#D32F2F'}}>*</span>
                  </Typography>
                  <IconButton size="small" sx={{padding: 0, color: '#0066F5', width: '16px', height: '16px'}}>
                    <InfoOutlinedIcon sx={{fontSize: '16px'}} />
                  </IconButton>
                </Box>
                <Controller
                  name="productGroup"
                  control={control}
                  render={({field}) => {
                    const selectedOption = productGroupOptions.find((o) => o.value === field.value) || null;
                    return (
                      <Box sx={{position: 'relative'}}>
                        <Autocomplete
                          options={productGroupOptions}
                          getOptionLabel={(opt) => opt.label || ''}
                          value={selectedOption}
                          onChange={(_, newValue) => {
                            field.onChange(newValue ? newValue.value : '');
                          }}
                          loading={loadingProductGroups}
                          isOptionEqualToValue={(option, val) => option.value === val.value}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              placeholder="Search or select product group"
                              error={!!errors.productGroup}
                              helperText={errors.productGroup?.message}
                              sx={{
                                ...textFieldStyles,
                                '& .MuiInputBase-input': {
                                  paddingRight: '44px'
                                }
                              }}
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    {loadingProductGroups ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                  </>
                                )
                              }}
                            />
                          )}
                        />
                        <IconButton
                          sx={{
                            position: 'absolute',
                            right: '0',
                            top: '0',
                            backgroundColor: '#002677',
                            borderRadius: '0 4px 4px 0',
                            width: '40px',
                            height: '40px',
                            pointerEvents: 'none',
                            '&:hover': {
                              backgroundColor: '#001a5c'
                            }
                          }}
                        >
                          <SearchIcon sx={{color: '#FFFFFF', fontSize: '20px'}} />
                        </IconButton>
                      </Box>
                    );
                  }}
                />
              </Box>
            </Box>

            {/* Row 2: Product Name & Base UOM */}
            <Box sx={{display: 'flex', gap: '24px'}}>
              {/* Product Name */}
              <Box sx={{flex: 1}}>
                <Box sx={{display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px'}}>
                  <Typography
                    component="label"
                    sx={{
                      fontWeight: 400,
                      fontSize: '16px',
                      lineHeight: '24px',
                      color: '#323334'
                    }}
                  >
                    Product Name <span style={{color: '#D32F2F'}}>*</span>
                  </Typography>
                  <IconButton size="small" sx={{padding: 0, color: '#0066F5', width: '16px', height: '16px'}}>
                    <InfoOutlinedIcon sx={{fontSize: '16px'}} />
                  </IconButton>
                </Box>
                <Controller
                  name="productName"
                  control={control}
                  render={({field}) => (
                    <TextField
                      {...field}
                      fullWidth
                      placeholder="Enter product name"
                      error={!!errors.productName}
                      helperText={errors.productName?.message}
                      sx={textFieldStyles}
                    />
                  )}
                />
              </Box>

              {/* Base UOM */}
              <Box sx={{flex: 1, position: 'relative'}}>
                <Box sx={{display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px'}}>
                  <Typography
                    component="label"
                    sx={{
                      fontWeight: 400,
                      fontSize: '16px',
                      lineHeight: '24px',
                      color: '#323334'
                    }}
                  >
                    Base UOM <span style={{color: '#D32F2F'}}>*</span>
                  </Typography>
                  <IconButton size="small" sx={{padding: 0, color: '#0066F5', width: '16px', height: '16px'}}>
                    <InfoOutlinedIcon sx={{fontSize: '16px'}} />
                  </IconButton>
                </Box>
                <Controller
                  name="baseUom"
                  control={control}
                  render={({field}) => {
                    const selectedOption = uomOptions.find((o) => o.value === field.value) || null;
                    return (
                      <Box sx={{position: 'relative'}}>
                        <Autocomplete
                          options={uomOptions}
                          getOptionLabel={(opt) => opt.label || ''}
                          value={selectedOption}
                          onChange={(_, newValue) => {
                            field.onChange(newValue ? newValue.value : '');
                          }}
                          loading={loadingUoms}
                          isOptionEqualToValue={(option, val) => option.value === val.value}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              placeholder="Select base UOM"
                              error={!!errors.baseUom}
                              helperText={errors.baseUom?.message}
                              sx={{
                                ...textFieldStyles,
                                '& .MuiInputBase-input': {
                                  paddingRight: '44px'
                                }
                              }}
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    {loadingUoms ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                  </>
                                )
                              }}
                            />
                          )}
                        />
                        <IconButton
                          sx={{
                            position: 'absolute',
                            right: '0',
                            top: '0',
                            backgroundColor: '#002677',
                            borderRadius: '0 4px 4px 0',
                            width: '40px',
                            height: '40px',
                            pointerEvents: 'none',
                            '&:hover': {
                              backgroundColor: '#001a5c'
                            }
                          }}
                        >
                          <SearchIcon sx={{color: '#FFFFFF', fontSize: '20px'}} />
                        </IconButton>
                      </Box>
                    );
                  }}
                />
              </Box>
            </Box>

            {/* Row 3: Product Type & Bundle Class */}
            <Box sx={{display: 'flex', gap: '24px'}}>
              {/* Product Type */}
              <Box sx={{flex: 1}}>
                <Box sx={{display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px'}}>
                  <Typography
                    component="label"
                    sx={{
                      fontWeight: 400,
                      fontSize: '16px',
                      lineHeight: '24px',
                      color: '#323334'
                    }}
                  >
                    Product Type <span style={{color: '#D32F2F'}}>*</span>
                  </Typography>
                  <IconButton size="small" sx={{padding: 0, color: '#0066F5', width: '16px', height: '16px'}}>
                    <InfoOutlinedIcon sx={{fontSize: '16px'}} />
                  </IconButton>
                </Box>
                <Controller
                  name="productType"
                  control={control}
                  render={({field}) => {
                    const selectedOption = productTypeOptions.find((o) => o.value === field.value) || null;
                    return (
                      <Box sx={{position: 'relative'}}>
                        <Autocomplete
                          options={productTypeOptions}
                          getOptionLabel={(opt) => opt.label || ''}
                          value={selectedOption}
                          onChange={(_, newValue) => {
                            field.onChange(newValue ? newValue.value : '');
                          }}
                          loading={loadingProductTypes}
                          isOptionEqualToValue={(option, val) => option.value === val.value}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              placeholder="Select product type"
                              error={!!errors.productType}
                              helperText={errors.productType?.message}
                              sx={{
                                ...textFieldStyles,
                                '& .MuiInputBase-input': {
                                  paddingRight: '44px'
                                }
                              }}
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    {loadingProductTypes ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                  </>
                                )
                              }}
                            />
                          )}
                        />
                        <IconButton
                          sx={{
                            position: 'absolute',
                            right: '0',
                            top: '0',
                            backgroundColor: '#002677',
                            borderRadius: '0 4px 4px 0',
                            width: '40px',
                            height: '40px',
                            pointerEvents: 'none',
                            '&:hover': {
                              backgroundColor: '#001a5c'
                            }
                          }}
                        >
                          <SearchIcon sx={{color: '#FFFFFF', fontSize: '20px'}} />
                        </IconButton>
                      </Box>
                    );
                  }}
                />
              </Box>

              {/* Bundle Class */}
              <Box sx={{flex: 1}}>
                <Typography
                  component="label"
                  sx={{
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '24px',
                    color: '#9E9E9E',
                    marginBottom: '8px',
                    display: 'block'
                  }}
                >
                  Bundle class
                </Typography>
                <Controller
                  name="bundleClass"
                  control={control}
                  render={({field}) => (
                    <TextField
                      {...field}
                      fullWidth
                      select
                      placeholder="Select bundle class"
                      disabled
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          height: '40px',
                          backgroundColor: '#F5F5F5',
                          borderRadius: '4px',
                          fontSize: '16px',
                          '& fieldset': {
                            borderColor: '#E0E0E0',
                            borderWidth: '1px'
                          }
                        },
                        '& .MuiInputBase-input': {
                          padding: '8px 16px',
                          fontSize: '16px',
                          lineHeight: '24px',
                          color: '#9E9E9E'
                        }
                      }}
                    >
                      <MenuItem value="">
                        <em>Select bundle class</em>
                      </MenuItem>
                    </TextField>
                  )}
                />
              </Box>
            </Box>

            {/* Row 4: Accounting Code & Charge Type */}
            <Box sx={{display: 'flex', gap: '24px'}}>
              {/* Accounting Code */}
              <Box sx={{flex: 1}}>
                <Typography
                  component="label"
                  sx={{
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '24px',
                    color: '#323334',
                    marginBottom: '8px',
                    display: 'block'
                  }}
                >
                  Accounting code
                </Typography>
                <Controller
                  name="accountingCode"
                  control={control}
                  render={({field}) => {
                    const selectedOption = accountingCodeOptions.find((o) => o.value === field.value) || null;
                    return (
                      <Box sx={{position: 'relative'}}>
                        <Autocomplete
                          options={accountingCodeOptions}
                          getOptionLabel={(opt) => opt.label || ''}
                          value={selectedOption}
                          onChange={(_, newValue) => {
                            field.onChange(newValue ? newValue.value : '');
                          }}
                          loading={loadingAccountingCodes}
                          isOptionEqualToValue={(option, val) => option.value === val.value}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              placeholder="Search or select accounting code"
                              error={!!errors.accountingCode}
                              helperText={errors.accountingCode?.message}
                              sx={{
                                ...textFieldStyles,
                                '& .MuiInputBase-input': {
                                  paddingRight: '44px'
                                }
                              }}
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    {loadingAccountingCodes ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                  </>
                                )
                              }}
                            />
                          )}
                        />
                        <IconButton
                          sx={{
                            position: 'absolute',
                            right: '0',
                            top: '0',
                            backgroundColor: '#002677',
                            borderRadius: '0 4px 4px 0',
                            width: '40px',
                            height: '40px',
                            pointerEvents: 'none',
                            '&:hover': {
                              backgroundColor: '#001a5c'
                            }
                          }}
                        >
                          <SearchIcon sx={{color: '#FFFFFF', fontSize: '20px'}} />
                        </IconButton>
                      </Box>
                    );
                  }}
                />
              </Box>

              {/* Charge Type */}
              <Box sx={{flex: 1}}>
                <Box sx={{display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px'}}>
                  <Typography
                    component="label"
                    sx={{
                      fontWeight: 400,
                      fontSize: '16px',
                      lineHeight: '24px',
                      color: '#323334'
                    }}
                  >
                    Charge type <span style={{color: '#D32F2F'}}>*</span>
                  </Typography>
                  <IconButton size="small" sx={{padding: 0, color: '#0066F5', width: '16px', height: '16px'}}>
                    <InfoOutlinedIcon sx={{fontSize: '16px'}} />
                  </IconButton>
                </Box>
                <Controller
                  name="chargeType"
                  control={control}
                  render={({field}) => {
                    const selectedOption = chargeTypeOptions.find((o) => o.value === field.value) || null;
                    return (
                      <Box sx={{position: 'relative'}}>
                        <Autocomplete
                          options={chargeTypeOptions}
                          getOptionLabel={(opt) => opt.label || ''}
                          value={selectedOption}
                          onChange={(_, newValue) => {
                            field.onChange(newValue ? newValue.value : '');
                          }}
                          loading={loadingChargeTypes}
                          isOptionEqualToValue={(option, val) => option.value === val.value}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              placeholder="Select charge type"
                              error={!!errors.chargeType}
                              helperText={errors.chargeType?.message}
                              sx={{
                                ...textFieldStyles,
                                '& .MuiInputBase-input': {
                                  paddingRight: '44px'
                                }
                              }}
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    {loadingChargeTypes ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                  </>
                                )
                              }}
                            />
                          )}
                        />
                        <IconButton
                          sx={{
                            position: 'absolute',
                            right: '0',
                            top: '0',
                            backgroundColor: '#002677',
                            borderRadius: '0 4px 4px 0',
                            width: '40px',
                            height: '40px',
                            pointerEvents: 'none',
                            '&:hover': {
                              backgroundColor: '#001a5c'
                            }
                          }}
                        >
                          <SearchIcon sx={{color: '#FFFFFF', fontSize: '20px'}} />
                        </IconButton>
                      </Box>
                    );
                  }}
                />
              </Box>
            </Box>

            {/* Row 5: Effective Date */}
            <Box sx={{flex: 1, flexDirection: 'row', gap: '24px'}}>
              <Box sx={{flex: 1, maxWidth: '48.5%'}}>
                <Typography
                  component="label"
                  sx={{
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '24px',
                    color: '#323334',
                    marginBottom: '8px',
                    display: 'block'
                  }}
                >
                  Effective date <span style={{color: '#D32F2F'}}>*</span>
                </Typography>
                <Controller
                  name="effectiveDate"
                  control={control}
                  render={({field: {onChange, value, ...field}}) => {
                    const [isDatePickerOpen, setIsDatePickerOpen] = React.useState(false);

                    return (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Box sx={{position: 'relative'}}>
                          <DatePicker
                            {...field}
                            open={isDatePickerOpen}
                            onClose={() => {
                              setIsDatePickerOpen(false);
                            }}
                            value={value ? dayjs(value) : null}
                            onChange={(newValue: Dayjs | null) => {
                              onChange(newValue ? newValue.format('YYYY-MM-DD') : '');
                            }}
                            slots={{
                              openPickerButton: () => null
                            }}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                error: !!errors.effectiveDate,
                                helperText: errors.effectiveDate?.message,
                                placeholder: 'MM/DD/YYYY',
                                onClick: () => {
                                  setIsDatePickerOpen(true);
                                },
                                sx: {
                                  ...textFieldStyles,
                                  '& .MuiInputBase-input': {
                                    paddingRight: '44px'
                                  }
                                }
                              }
                            }}
                          />
                          <IconButton
                            onClick={() => {
                              setIsDatePickerOpen(true);
                            }}
                            sx={{
                              position: 'absolute',
                              right: '0',
                              top: '0',
                              backgroundColor: '#002677',
                              borderRadius: '0 4px 4px 0',
                              width: '40px',
                              height: '40px',
                              '&:hover': {
                                backgroundColor: '#001a5c'
                              }
                            }}
                          >
                            <CalendarTodayIcon sx={{color: '#FFFFFF', fontSize: '20px'}} />
                          </IconButton>
                        </Box>
                      </LocalizationProvider>
                    );
                  }}
                />
              </Box>
              <Box sx={{flex: 1}} />
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box
            sx={{
              display: 'flex',
              gap: '16px',
              paddingTop: '32px',
              borderTop: '1px solid #E0E0E0'
            }}
          >
            <Button
              type="submit"
              variant="contained"
              disabled={!isValid}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '16px',
                lineHeight: '24px',
                backgroundColor: '#002677',
                color: '#FFFFFF',
                width: '85px',
                height: '40px',
                padding: '10px 24px',
                borderRadius: '46px',
                gap: '10px',
                opacity: 1,
                minWidth: 'unset',
                '&:hover': {
                  backgroundColor: '#001a5c'
                },
                '&.Mui-disabled': {
                  backgroundColor: '#E0E0E0',
                  color: '#9E9E9E',
                  '&:hover': {
                    backgroundColor: '#E0E0E0'
                  }
                }
              }}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              onClick={handleClose}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '16px',
                lineHeight: '24px',
                color: '#323334',
                borderColor: '#323334',
                borderWidth: '1px',
                width: '101px',
                height: '40px',
                padding: '10px 24px',
                borderRadius: '46px',
                gap: '10px',
                opacity: 1,
                minWidth: 'unset',
                '&:hover': {
                  borderColor: '#323334',
                  borderWidth: '1px',
                  backgroundColor: 'rgba(50, 51, 52, 0.04)'
                }
              }}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};
