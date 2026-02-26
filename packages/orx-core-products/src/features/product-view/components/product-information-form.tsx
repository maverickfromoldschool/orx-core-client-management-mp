/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from 'react';
import {Box, TextField, Typography, IconButton} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import dayjs, {Dayjs} from 'dayjs';
import SearchIcon from '@mui/icons-material/Search';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import {z} from 'zod';
import {Controller, Control, FieldErrors} from 'react-hook-form';

import {COLORS} from '../constants';
import {useProductTypeOptions} from '../../../hooks/use-product-type-options';
import {useChargeTypeOptions} from '../../../hooks/use-charge-type-options';
import {useUomOptions} from '../../../hooks/use-uom-options';
import {useAccountingCodeOptions} from '../../../hooks/use-accounting-code-options';
import {ProductWithDetails} from '../../products-listing';
import {ProductGroupDetail} from '../../../hooks/use-get-product-group';

export const updateProductSchema = z.object({
  productCode: z.string().min(1, 'Product code is required'),
  productGroup: z.string().min(1, 'Product group is required'),
  productName: z.string().min(1, 'Product name is required'),
  baseUom: z.string().min(1, 'Base UOM is required'),
  productType: z.string().min(1, 'Product type is required'),
  accountingCode: z.string().optional(),
  chargeType: z.string().min(1, 'Charge type is required'),
  effectiveDate: z.string().min(1, 'Effective date is required'),
  expiryDate: z.string().nullable()
});

export type UpdateProductSchemaType = z.infer<typeof updateProductSchema>;

interface ProductInformationFormProps {
  productDetails: ProductWithDetails;
  productGroupDetails: ProductGroupDetail | null;
  control: Control<UpdateProductSchemaType>;
  errors: FieldErrors<UpdateProductSchemaType>;
  onRetire?: () => void;
  onDuplicate?: () => void;
}

/**
 * ProductInformationForm component
 * Form for editing product information
 */
export const ProductInformationForm: React.FC<ProductInformationFormProps> = ({
  productDetails,
  productGroupDetails,
  control,
  errors
}) => {
  const [effectiveDateOpen, setEffectiveDateOpen] = React.useState(false);
  const [expirationDateOpen, setExpirationDateOpen] = React.useState(false);
  const {productTypeOptions} = useProductTypeOptions();
  const {chargeTypeOptions} = useChargeTypeOptions();
  const {uomOptions, loadingUoms} = useUomOptions();
  const {accountingCodeOptions, loadingAccountingCodes} = useAccountingCodeOptions();

  // Common styles for text inputs matching add-product-dialog
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
      },
      '&.Mui-disabled': {
        backgroundColor: '#F5F5F5',
        '& fieldset': {
          borderColor: '#E0E0E0'
        }
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
      },
      '&.Mui-disabled': {
        color: '#9E9E9E',
        WebkitTextFillColor: '#9E9E9E'
      }
    }
  };

  const labelStyles = {
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: '24px',
    color: '#323334',
    marginBottom: '8px',
    display: 'block'
  };

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
      {/* Form Fields */}
      <Box sx={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
        {/* Row 1 */}
        <Box sx={{display: 'flex', gap: '24px', width: '100%'}}>
          {/* Product Code */}
          <Box sx={{flex: 1}}>
            <Typography component="label" sx={labelStyles}>
              Product Code <span style={{color: '#D32F2F'}}>*</span>
            </Typography>
            <Controller
              name="productCode"
              control={control}
              render={({field}) => (
                <TextField
                  {...field}
                  fullWidth
                  placeholder="Enter product code"
                  error={!!errors.productCode}
                  helperText={errors.productCode?.message}
                  sx={textFieldStyles}
                />
              )}
            />
          </Box>

          {/* Product Name */}
          <Box sx={{flex: 1}}>
            <Typography component="label" sx={labelStyles}>
              Product Name <span style={{color: '#D32F2F'}}>*</span>
            </Typography>
            <Controller
              name="productName"
              control={control}
              render={({field}) => (
                <TextField
                  {...field}
                  fullWidth
                  placeholder="Enter product name"
                  error={!!errors.productName}
                  helperText={errors.productName?.message || '0/1000'}
                  sx={textFieldStyles}
                  FormHelperTextProps={{
                    sx: {
                      textAlign: 'right',
                      fontSize: '14px',
                      color: '#757575',
                      marginTop: '4px'
                    }
                  }}
                />
              )}
            />
          </Box>

          {/* Product Group - Disabled */}
          <Box sx={{flex: 1}}>
            <Typography component="label" sx={labelStyles}>
              Product Group
            </Typography>
            <TextField
              value={productDetails.product.productGroup}
              disabled
              fullWidth
              placeholder="Product group"
              sx={textFieldStyles}
              helperText={
                <Typography
                  component="span"
                  sx={{
                    color: COLORS.TEXT_LINK,
                    fontSize: '14px'
                  }}
                >
                  {productGroupDetails?.name}
                </Typography>
              }
            />
          </Box>
        </Box>

        {/* Row 2 */}
        <Box sx={{display: 'flex', gap: '24px', width: '100%'}}>
          {/* Base UOM */}
          <Box sx={{flex: 1}}>
            <Box sx={{display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px'}}>
              <Typography component="label" sx={labelStyles}>
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

          {/* Product Type */}
          <Box sx={{flex: 1}}>
            <Box sx={{display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px'}}>
              <Typography component="label" sx={labelStyles}>
                Product Type
              </Typography>
              <IconButton size="small" sx={{padding: 0, color: '#0066F5', width: '16px', height: '16px'}}>
                <InfoOutlinedIcon sx={{fontSize: '16px'}} />
              </IconButton>
            </Box>
            <Controller
              name="productType"
              control={control}
              render={({field}) => {
                const selectedOption = productTypeOptions.find((o) => o.value === field.value);
                return (
                  <TextField
                    value={selectedOption?.label || field.value}
                    disabled
                    fullWidth
                    placeholder="Product type"
                    sx={textFieldStyles}
                  />
                );
              }}
            />
          </Box>

          {/* Charge Type */}
          <Box sx={{flex: 1}}>
            <Box sx={{display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px'}}>
              <Typography component="label" sx={labelStyles}>
                Charge Type
              </Typography>
              <IconButton size="small" sx={{padding: 0, color: '#0066F5', width: '16px', height: '16px'}}>
                <InfoOutlinedIcon sx={{fontSize: '16px'}} />
              </IconButton>
            </Box>
            <Controller
              name="chargeType"
              control={control}
              render={({field}) => {
                const selectedOption = chargeTypeOptions.find((o) => o.value === field.value);
                return (
                  <TextField
                    value={selectedOption?.label || field.value}
                    disabled
                    fullWidth
                    placeholder="Charge type"
                    sx={textFieldStyles}
                  />
                );
              }}
            />
          </Box>
        </Box>

        {/* Row 3 - Accounting Code and Date Fields */}
        <Box sx={{display: 'flex', gap: '24px', width: '100%'}}>
          {/* Accounting Code */}
          <Box sx={{flex: 1}}>
            <Typography component="label" sx={labelStyles}>
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

          {/* Effective Date */}
          <Box sx={{flex: 1}}>
            <Typography component="label" sx={labelStyles}>
              Effective date <span style={{color: '#D32F2F'}}>*</span>
            </Typography>
            <Controller
              name="effectiveDate"
              control={control}
              render={({field: {onChange, value, ...field}}) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Box sx={{position: 'relative'}}>
                    <DatePicker
                      {...field}
                      open={effectiveDateOpen}
                      onClose={() => {
                        setEffectiveDateOpen(false);
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
                            setEffectiveDateOpen(true);
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
                        setEffectiveDateOpen(true);
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
              )}
            />
          </Box>

          {/* Expiration Date */}
          <Box sx={{flex: 1}}>
            <Typography component="label" sx={labelStyles}>
              Expiration date
            </Typography>
            <Controller
              name="expiryDate"
              control={control}
              render={({field: {onChange, value, ...field}}) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Box sx={{position: 'relative'}}>
                    <DatePicker
                      {...field}
                      open={expirationDateOpen}
                      onClose={() => {
                        setExpirationDateOpen(false);
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
                          error: !!errors.expiryDate,
                          helperText: errors.expiryDate?.message,
                          placeholder: 'MM/DD/YYYY',
                          onClick: () => {
                            setExpirationDateOpen(true);
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
                        setExpirationDateOpen(true);
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
              )}
            />
          </Box>
        </Box>
      </Box>

      {/* Divider */}
      {/* <Box sx={{height: '1px', backgroundColor: COLORS.NEUTRAL_20, width: '100%'}} /> */}

      {/* Action Buttons */}
      {/* <Box sx={{display: 'flex', gap: '10px'}}>
        <Button
          variant="outlined"
          onClick={onRetire}
          sx={{
            padding: '10px 24px',
            borderRadius: '46px',
            backgroundColor: COLORS.SECONDARY_WARM_WHITE,
            border: `1px solid ${COLORS.SECONDARY_DARK_BLUE}`,
            color: COLORS.SECONDARY_DARK_BLUE,
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: '1.4em',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#f5f3ed',
              border: `1px solid ${COLORS.SECONDARY_DARK_BLUE}`
            }
          }}
        >
          Retire
        </Button>

        <Button
          variant="outlined"
          onClick={onDuplicate}
          startIcon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="9" y="9" width="13" height="13" rx="2" stroke={COLORS.SECONDARY_DARK_BLUE} strokeWidth="2" />
              <path
                d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5"
                stroke={COLORS.SECONDARY_DARK_BLUE}
                strokeWidth="2"
              />
            </svg>
          }
          sx={{
            padding: '8px 24px 8px 16px',
            borderRadius: '46px',
            backgroundColor: COLORS.SECONDARY_WARM_WHITE,
            border: `1px solid ${COLORS.SECONDARY_DARK_BLUE}`,
            color: COLORS.SECONDARY_DARK_BLUE,
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: '1.4em',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#f5f3ed',
              border: `1px solid ${COLORS.SECONDARY_DARK_BLUE}`
            }
          }}
        >
          Duplicate
        </Button>
      </Box> */}
    </Box>
  );
};
