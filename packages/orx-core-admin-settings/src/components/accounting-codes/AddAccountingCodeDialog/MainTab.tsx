/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from 'react';
import {Controller, Control, FieldErrors} from 'react-hook-form';
import {TextField, MenuItem, Grid, Typography, Box} from '@mui/material';

import {AddAccountingCodeFormData} from './AddAccountingCodeDialog.types';

interface MainTabProps {
  control: Control<AddAccountingCodeFormData>;
  errors: FieldErrors<AddAccountingCodeFormData>;
  glAccountTypes?: {value: string; label: string}[];
  glAccountGroups?: {value: string; label: string}[];
  glAccountingKeyPlugins?: {value: string; label: string}[];
  watch: (name: keyof AddAccountingCodeFormData) => any;
}

export const MainTab: React.FC<MainTabProps> = ({
  control,
  errors,
  glAccountTypes = [],
  glAccountGroups = [],
  watch
}) => {
  const accountingCodeValue = watch('accountingCode') || '';
  const nameValue = watch('name') || '';
  const glAccountNameValue = watch('glAccountName') || '';

  return (
    <Box sx={{py: 3, px: 1}}>
      <Grid container spacing={2.5}>
        {/* Row 1: Accounting Code and Name */}
        <Grid item xs={12} md={6}>
          <div>
            <Typography
              variant="body2"
              sx={{
                mb: 0.5,
                fontSize: '0.875rem',
                fontWeight: 400,
                color: 'text.primary'
              }}
            >
              Accounting Code<span style={{color: '#d32f2f', marginLeft: '2px'}}>*</span>
            </Typography>
            <Controller
              name="accountingCode"
              control={control}
              defaultValue=""
              render={({field}) => (
                <TextField
                  {...field}
                  fullWidth
                  placeholder="Enter accounting code"
                  error={!!errors.accountingCode}
                  helperText={errors.accountingCode?.message}
                  inputProps={{maxLength: 30}}
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
                      fontSize: '0.875rem',
                      padding: '10px 12px'
                    }
                  }}
                />
              )}
            />
            <Typography variant="caption" sx={{color: 'text.secondary', mt: 0.5, display: 'block', textAlign: 'right'}}>
              {accountingCodeValue.length} / 30
            </Typography>
          </div>
        </Grid>

        <Grid item xs={12} md={6}>
          <div>
            <Typography
              variant="body2"
              sx={{
                mb: 0.5,
                fontSize: '0.875rem',
                fontWeight: 400,
                color: 'text.primary'
              }}
            >
              Name<span style={{color: '#d32f2f', marginLeft: '2px'}}>*</span>
            </Typography>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              render={({field}) => (
                <TextField
                  {...field}
                  fullWidth
                  placeholder="Enter name"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  inputProps={{maxLength: 50}}
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
                      fontSize: '0.875rem',
                      padding: '10px 12px'
                    }
                  }}
                />
              )}
            />
            <Typography variant="caption" sx={{color: 'text.secondary', mt: 0.5, display: 'block', textAlign: 'right'}}>
              {nameValue.length} / 50
            </Typography>
          </div>
        </Grid>

        {/* Row 2: GL Account Type and GL Account Name */}
        <Grid item xs={12} md={6}>
          <div>
            <Typography
              variant="body2"
              sx={{
                mb: 0.5,
                fontSize: '0.875rem',
                fontWeight: 400,
                color: 'text.primary'
              }}
            >
              GL Account Type<span style={{color: '#d32f2f', marginLeft: '2px'}}>*</span>
            </Typography>
            <Controller
              name="glAccountType"
              control={control}
              defaultValue=""
              render={({field}) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  placeholder="Select GL Account Type"
                  error={!!errors.glAccountType}
                  helperText={errors.glAccountType?.message}
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
                      fontSize: '0.875rem',
                      padding: '10px 12px'
                    }
                  }}
                >
                  {glAccountTypes.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </div>
        </Grid>

        <Grid item xs={12} md={6}>
          <div>
            <Typography
              variant="body2"
              sx={{
                mb: 0.5,
                fontSize: '0.875rem',
                fontWeight: 400,
                color: 'text.primary'
              }}
            >
              GL Account Name<span style={{color: '#d32f2f', marginLeft: '2px'}}>*</span>
            </Typography>
            <Controller
              name="glAccountName"
              control={control}
              defaultValue=""
              render={({field}) => (
                <TextField
                  {...field}
                  fullWidth
                  placeholder="Enter GL account name"
                  error={!!errors.glAccountName}
                  helperText={errors.glAccountName?.message}
                  inputProps={{maxLength: 254}}
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
                      fontSize: '0.875rem',
                      padding: '10px 12px'
                    }
                  }}
                />
              )}
            />
            <Typography variant="caption" sx={{color: 'text.secondary', mt: 0.5, display: 'block', textAlign: 'right'}}>
              {glAccountNameValue.length} / 254
            </Typography>
          </div>
        </Grid>

        {/* Row 3: GL Account Group and Display Sequence */}
        <Grid item xs={12} md={6}>
          <div>
            <Typography
              variant="body2"
              sx={{
                mb: 0.5,
                fontSize: '0.875rem',
                fontWeight: 400,
                color: 'text.primary'
              }}
            >
              GL Account Group<span style={{color: '#d32f2f', marginLeft: '2px'}}>*</span>
            </Typography>
            <Controller
              name="glAccountGroup"
              control={control}
              defaultValue=""
              render={({field}) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  placeholder="Select GL Account Group"
                  error={!!errors.glAccountGroup}
                  helperText={errors.glAccountGroup?.message}
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
                      fontSize: '0.875rem',
                      padding: '10px 12px'
                    }
                  }}
                >
                  {glAccountGroups.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </div>
        </Grid>

        <Grid item xs={12} md={6}>
          <div>
            <Typography
              variant="body2"
              sx={{
                mb: 0.5,
                fontSize: '0.875rem',
                fontWeight: 400,
                color: 'text.primary'
              }}
            >
              Display Sequence<span style={{color: '#d32f2f', marginLeft: '2px'}}>*</span>
            </Typography>
            <Controller
              name="displaySequence"
              control={control}
              defaultValue={1}
              render={({field}) => (
                <TextField
                  {...field}
                  type="number"
                  fullWidth
                  placeholder="Enter display sequence"
                  error={!!errors.displaySequence}
                  helperText={errors.displaySequence?.message}
                  onChange={(e) => {
                    field.onChange(parseInt(e.target.value, 10));
                  }}
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
                      fontSize: '0.875rem',
                      padding: '10px 12px'
                    }
                  }}
                />
              )}
            />
          </div>
        </Grid>
      </Grid>
    </Box>
  );
};
