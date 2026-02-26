'use client';

import React, {useEffect} from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
  Grid,
  MenuItem,
  Tooltip,
  Select,
  Switch
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {Controller, useForm} from 'react-hook-form';

import {UomDialogProps, UomDialogFormData} from './uom-dialog.types';

export const UomDialog: React.FC<UomDialogProps> = ({
  open,
  onClose,
  onSave,
  initialData,
  unitTypeOptions,
  isSaving = false
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: {errors}
  } = useForm<UomDialogFormData>({
    defaultValues: {
      uom: '',
      description: '',
      decimals: 0,
      unitTypeCd: '',
      appendToQuantity: 'N'
    }
  });

  // Reset form when dialog opens or initialData changes
  useEffect(() => {
    if (open) {
      if (initialData) {
        reset(initialData);
      } else {
        reset({
          uom: '',
          description: '',
          decimals: 0,
          unitTypeCd: '',
          appendToQuantity: 'N'
        });
      }
    }
  }, [open, initialData, reset]);

  const onSubmit = async (data: UomDialogFormData) => {
    await onSave(data);
  };

  // Generate decimals options (0-18)
  const decimalsOptions = Array.from({length: 19}, (_, i) => i);

  return (
    <Dialog
      open={open}
      onClose={isSaving ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      {/* Dialog Header */}
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 2
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: '20px',
            fontWeight: 700,
            color: '#002677'
          }}
        >
          {initialData ? 'Edit Unit of Measure' : 'Add New Unit of Measure'}
        </Typography>
        <IconButton
          onClick={onClose}
          disabled={isSaving}
          sx={{
            color: '#757575',
            '&:hover': {backgroundColor: 'rgba(0, 0, 0, 0.04)'}
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Dialog Content */}
      <DialogContent dividers sx={{overflow: 'auto', display: 'flex', flexDirection: 'column'}}>
        <Box sx={{pt: 1, px: 1, pb: 1}}>
          {/* First Row: Unit of Measure and Description */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Controller
                name="uom"
                control={control}
                rules={{
                  required: 'Unit of Measure is required',
                  maxLength: {
                    value: 50,
                    message: 'Unit of Measure cannot exceed 50 characters'
                  }
                }}
                render={({field}) => (
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
                        <Typography component="span" sx={{color: '#C40000', ml: 0.5}}>
                          *
                        </Typography>
                      </Typography>
                      <Tooltip title="The code representing the unit of measure." arrow placement="right">
                        <HelpOutlineIcon sx={{fontSize: '16px', color: '#0066F5', cursor: 'pointer'}} />
                      </Tooltip>
                    </Box>
                    <Box
                      component="input"
                      {...field}
                      disabled={isSaving || !!initialData}
                      placeholder="Enter unit of measure"
                      sx={{
                        width: '100%',
                        padding: '10px 12px',
                        fontSize: '14px',
                        border: errors.uom ? '1px solid #C40000' : '1px solid #CBCCCD',
                        borderRadius: '4px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        '&:hover': {
                          borderColor: errors.uom ? '#C40000' : '#999'
                        },
                        '&:focus': {
                          borderColor: errors.uom ? '#C40000' : '#0C55B8',
                          borderWidth: '1px'
                        },
                        '&:disabled': {
                          backgroundColor: '#F5F5F5',
                          cursor: 'not-allowed'
                        }
                      }}
                    />
                    {errors.uom && (
                      <Typography sx={{color: '#C40000', fontSize: '12px', mt: 0.5}}>{errors.uom.message}</Typography>
                    )}
                  </div>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="description"
                control={control}
                rules={{
                  required: 'Description is required',
                  maxLength: {
                    value: 200,
                    message: 'Description cannot exceed 200 characters'
                  }
                }}
                render={({field}) => (
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
                        Description
                        <Typography component="span" sx={{color: '#C40000', ml: 0.5}}>
                          *
                        </Typography>
                      </Typography>
                      <Tooltip title="A detailed description of the unit of measure." arrow placement="right">
                        <HelpOutlineIcon sx={{fontSize: '16px', color: '#0066F5', cursor: 'pointer'}} />
                      </Tooltip>
                    </Box>
                    <Box
                      component="input"
                      {...field}
                      disabled={isSaving}
                      placeholder="Enter description"
                      sx={{
                        width: '100%',
                        padding: '10px 12px',
                        fontSize: '14px',
                        border: errors.description ? '1px solid #C40000' : '1px solid #CBCCCD',
                        borderRadius: '4px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        '&:hover': {
                          borderColor: errors.description ? '#C40000' : '#999'
                        },
                        '&:focus': {
                          borderColor: errors.description ? '#C40000' : '#0C55B8',
                          borderWidth: '1px'
                        },
                        '&:disabled': {
                          backgroundColor: '#F5F5F5',
                          cursor: 'not-allowed'
                        }
                      }}
                    />
                    {errors.description && (
                      <Typography sx={{color: '#C40000', fontSize: '12px', mt: 0.5}}>
                        {errors.description.message}
                      </Typography>
                    )}
                  </div>
                )}
              />
            </Grid>
          </Grid>

          {/* Second Row: Decimals and Unit Type */}
          <Grid container spacing={2} sx={{mt: 2}}>
            <Grid item xs={12} md={6}>
              <Controller
                name="decimals"
                control={control}
                rules={{
                  required: 'Decimals is required'
                }}
                render={({field}) => (
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
                        Decimals
                        <Typography component="span" sx={{color: '#C40000', ml: 0.5}}>
                          *
                        </Typography>
                      </Typography>
                      <Tooltip title="Number of decimal places allowed for this unit." arrow placement="right">
                        <HelpOutlineIcon sx={{fontSize: '16px', color: '#0066F5', cursor: 'pointer'}} />
                      </Tooltip>
                    </Box>
                    <Select
                      {...field}
                      disabled={isSaving}
                      displayEmpty
                      sx={{
                        width: '100%',
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: errors.decimals ? '1px solid #C40000' : '1px solid #CBCCCD'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: errors.decimals ? '#C40000' : '#999'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: errors.decimals ? '#C40000' : '#0C55B8',
                          borderWidth: '1px'
                        },
                        '& .MuiSelect-select': {
                          padding: '10px 12px',
                          fontSize: '14px'
                        },
                        '&.Mui-disabled': {
                          backgroundColor: '#F5F5F5'
                        }
                      }}
                    >
                      <MenuItem value="" disabled>
                        Select decimals
                      </MenuItem>
                      {decimalsOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.decimals && (
                      <Typography sx={{color: '#C40000', fontSize: '12px', mt: 0.5}}>
                        {errors.decimals.message}
                      </Typography>
                    )}
                  </div>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="unitTypeCd"
                control={control}
                rules={{
                  required: 'Unit Type is required'
                }}
                render={({field}) => (
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
                        Unit Type
                        <Typography component="span" sx={{color: '#C40000', ml: 0.5}}>
                          *
                        </Typography>
                      </Typography>
                      <Tooltip title="The category or type of the unit of measure." arrow placement="right">
                        <HelpOutlineIcon sx={{fontSize: '16px', color: '#0066F5', cursor: 'pointer'}} />
                      </Tooltip>
                    </Box>
                    <Select
                      {...field}
                      disabled={isSaving}
                      displayEmpty
                      sx={{
                        width: '100%',
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: errors.unitTypeCd ? '1px solid #C40000' : '1px solid #CBCCCD'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: errors.unitTypeCd ? '#C40000' : '#999'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: errors.unitTypeCd ? '#C40000' : '#0C55B8',
                          borderWidth: '1px'
                        },
                        '& .MuiSelect-select': {
                          padding: '10px 12px',
                          fontSize: '14px'
                        },
                        '&.Mui-disabled': {
                          backgroundColor: '#F5F5F5'
                        }
                      }}
                    >
                      <MenuItem value="" disabled>
                        Select unit type
                      </MenuItem>
                      {unitTypeOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.unitTypeCd && (
                      <Typography sx={{color: '#C40000', fontSize: '12px', mt: 0.5}}>
                        {errors.unitTypeCd.message}
                      </Typography>
                    )}
                  </div>
                )}
              />
            </Grid>
          </Grid>

          {/* Third Row: Append to Count */}
          <Box sx={{mt: 3}}>
            <Controller
              name="appendToQuantity"
              control={control}
              render={({field}) => (
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5}}>
                  <Typography
                    sx={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: '#323334'
                    }}
                  >
                    Append to Count
                    <Typography component="span" sx={{color: '#C40000', ml: 0.5}}>
                      *
                    </Typography>
                  </Typography>
                  <Switch
                    checked={field.value === 'Y'}
                    onChange={(e) => {
                      field.onChange(e.target.checked ? 'Y' : 'N');
                    }}
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
                            border: '2px solid #002677'
                          },
                          '& .MuiSwitch-thumb': {
                            backgroundColor: '#002677',
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
                      color: '#323334'
                    }}
                  >
                    {field.value === 'Y' ? 'Yes' : 'No'}
                  </Typography>
                  <Tooltip title="Whether this unit should be appended to quantity values." arrow placement="right">
                    <HelpOutlineIcon sx={{fontSize: '16px', color: '#0066F5', cursor: 'pointer', ml: 0.5}} />
                  </Tooltip>
                </Box>
              )}
            />
          </Box>
        </Box>
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          gap: 1
        }}
      >
        <Button
          onClick={onClose}
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
          onClick={handleSubmit(onSubmit)}
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
};

export default UomDialog;
