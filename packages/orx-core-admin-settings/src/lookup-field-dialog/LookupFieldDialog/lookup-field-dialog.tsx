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
  Switch,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FolderOffOutlinedIcon from '@mui/icons-material/FolderOffOutlined';
import CheckIcon from '@mui/icons-material/Check';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ErrorIcon from '@mui/icons-material/Error';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import DoDisturbOnOutlinedIcon from '@mui/icons-material/DoDisturbOnOutlined';
import DoDisturbOffOutlinedIcon from '@mui/icons-material/DoDisturbOffOutlined';
import PersonIcon from '@mui/icons-material/Person';
import ComputerIcon from '@mui/icons-material/Computer';
import {Controller, useForm} from 'react-hook-form';

import {LookupFieldDialogProps, LookupFieldData} from './lookup-field-dialog.types';

export const LookupFieldDialog: React.FC<LookupFieldDialogProps> = ({
  open,
  onClose,
  onSave,
  initialData,
  isSaving = false
}) => {
  const [values, setValues] = React.useState<
    {id: string; fieldValue: string; displayName: string; description?: string; disabled?: boolean}[]
  >([]);
  const [isAddingNew, setIsAddingNew] = React.useState(false);
  const [newFieldValue, setNewFieldValue] = React.useState('');
  const [newDisplayName, setNewDisplayName] = React.useState('');
  const [fieldValueError, setFieldValueError] = React.useState('');
  const [displayNameError, setDisplayNameError] = React.useState('');
  const [fieldValueTouched, setFieldValueTouched] = React.useState(false);
  const [displayNameTouched, setDisplayNameTouched] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editFieldValue, setEditFieldValue] = React.useState('');
  const [editDisplayName, setEditDisplayName] = React.useState('');
  const [editFieldValueError, setEditFieldValueError] = React.useState('');
  const [editDisplayNameError, setEditDisplayNameError] = React.useState('');
  const [editFieldValueTouched, setEditFieldValueTouched] = React.useState(false);
  const [editDisplayNameTouched, setEditDisplayNameTouched] = React.useState(false);
  const [descriptionDialogOpen, setDescriptionDialogOpen] = React.useState(false);
  const [currentDescription, setCurrentDescription] = React.useState('');
  const [editingDescriptionId, setEditingDescriptionId] = React.useState<string | null>(null);
  const [newRowDescription, setNewRowDescription] = React.useState('');

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: {errors}
  } = useForm<LookupFieldData>({
    defaultValues: {
      lookupField: '',
      displayName: '',
      maxStoredValueLength: '',
      numericValue: false
    }
  });

  // Watch the numeric value toggle and max stored value length
  const numericValue = watch('numericValue');
  const maxStoredValueLength = watch('maxStoredValueLength');

  // Reset form when dialog opens or initialData changes
  useEffect(() => {
    if (open) {
      if (initialData) {
        reset(initialData);
        // Load existing values if editing
        if (initialData.values) {
          setValues(initialData.values);
        } else {
          setValues([]);
        }
      } else {
        reset({
          lookupField: '',
          displayName: '',
          maxStoredValueLength: '',
          numericValue: false
        });
        setValues([]);
      }
    }
  }, [open, initialData, reset]);

  const onSubmit = (data: LookupFieldData) => {
    // Include the values array with the form data
    const completeData: LookupFieldData = {
      ...data,
      values
    };
    onSave(completeData);
  };

  const handleClose = () => {
    if (!isSaving) {
      onClose();
    }
  };

  const handleAddValue = () => {
    setIsAddingNew(true);
    setNewFieldValue('');
    setNewDisplayName('');
    setNewRowDescription('');
    setFieldValueError('');
    setDisplayNameError('');
    setFieldValueTouched(false);
    setDisplayNameTouched(false);
  };

  const handleSaveNewValue = () => {
    let hasError = false;

    if (!newFieldValue.trim()) {
      setFieldValueError('Required field');
      hasError = true;
    } else if (numericValue && !/^\d+$/.test(newFieldValue.trim())) {
      setFieldValueError('Value needs to be numeric');
      hasError = true;
    }

    if (!newDisplayName.trim()) {
      setDisplayNameError('Required field');
      hasError = true;
    }

    if (hasError) return;

    const newValue = {
      id: `value-${Date.now()}`,
      fieldValue: newFieldValue.trim(),
      displayName: newDisplayName.trim(),
      description: newRowDescription
    };
    setValues([...values, newValue]);
    setIsAddingNew(false);
    setNewFieldValue('');
    setNewDisplayName('');
    setNewRowDescription('');
    setFieldValueError('');
    setDisplayNameError('');
    setFieldValueTouched(false);
    setDisplayNameTouched(false);
  };

  const handleCancelNewValue = () => {
    setIsAddingNew(false);
    setNewFieldValue('');
    setNewDisplayName('');
    setNewRowDescription('');
    setFieldValueError('');
    setDisplayNameError('');
    setFieldValueTouched(false);
    setDisplayNameTouched(false);
  };

  const handleFieldValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target;
    setNewFieldValue(value);
    if (fieldValueTouched) {
      if (!value.trim()) {
        setFieldValueError('Required field');
      } else if (numericValue && !/^\d+$/.test(value.trim())) {
        setFieldValueError('Value needs to be numeric');
      } else {
        setFieldValueError('');
      }
    }
  };

  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target;
    setNewDisplayName(value);
    if (displayNameTouched && !value.trim()) {
      setDisplayNameError('Required field');
    } else {
      setDisplayNameError('');
    }
  };

  const handleFieldValueBlur = () => {
    setFieldValueTouched(true);
    if (!newFieldValue.trim()) {
      setFieldValueError('Required field');
    } else if (numericValue && !/^\d+$/.test(newFieldValue.trim())) {
      setFieldValueError('Value needs to be numeric');
    } else {
      setFieldValueError('');
    }
  };

  const handleDisplayNameBlur = () => {
    setDisplayNameTouched(true);
    if (!newDisplayName.trim()) {
      setDisplayNameError('Required field');
    }
  };

  const handleEdit = (value: {id: string; fieldValue: string; displayName: string}) => {
    setEditingId(value.id);
    setEditFieldValue(value.fieldValue);
    setEditDisplayName(value.displayName);
    setEditFieldValueError('');
    setEditDisplayNameError('');
    setEditFieldValueTouched(false);
    setEditDisplayNameTouched(false);
  };

  const handleSaveEdit = () => {
    let hasError = false;

    if (!editFieldValue.trim()) {
      setEditFieldValueError('Required field');
      hasError = true;
    } else if (numericValue && !/^\d+$/.test(editFieldValue.trim())) {
      setEditFieldValueError('Value needs to be numeric');
      hasError = true;
    }

    if (!editDisplayName.trim()) {
      setEditDisplayNameError('Required field');
      hasError = true;
    }

    if (hasError) return;

    setValues(
      values.map((v) =>
        v.id === editingId ? {...v, fieldValue: editFieldValue.trim(), displayName: editDisplayName.trim()} : v
      )
    );
    setEditingId(null);
    setEditFieldValue('');
    setEditDisplayName('');
    setEditFieldValueError('');
    setEditDisplayNameError('');
    setEditFieldValueTouched(false);
    setEditDisplayNameTouched(false);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFieldValue('');
    setEditDisplayName('');
    setEditFieldValueError('');
    setEditDisplayNameError('');
    setEditFieldValueTouched(false);
    setEditDisplayNameTouched(false);
  };

  const handleEditFieldValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target;
    setEditFieldValue(value);
    if (editFieldValueTouched) {
      if (!value.trim()) {
        setEditFieldValueError('Required field');
      } else if (numericValue && !/^\d+$/.test(value.trim())) {
        setEditFieldValueError('Value needs to be numeric');
      } else {
        setEditFieldValueError('');
      }
    }
  };

  const handleEditDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target;
    setEditDisplayName(value);
    if (editDisplayNameTouched && !value.trim()) {
      setEditDisplayNameError('Required field');
    } else {
      setEditDisplayNameError('');
    }
  };

  const handleEditFieldValueBlur = () => {
    setEditFieldValueTouched(true);
    if (!editFieldValue.trim()) {
      setEditFieldValueError('Required field');
    } else if (numericValue && !/^\d+$/.test(editFieldValue.trim())) {
      setEditFieldValueError('Value needs to be numeric');
    } else {
      setEditFieldValueError('');
    }
  };

  const handleEditDisplayNameBlur = () => {
    setEditDisplayNameTouched(true);
    if (!editDisplayName.trim()) {
      setEditDisplayNameError('Required field');
    }
  };

  const handleOpenDescription = (id: string) => {
    if (id === 'new') {
      setEditingDescriptionId('new');
      setCurrentDescription(newRowDescription);
    } else {
      const value = values.find((v) => v.id === id);
      setEditingDescriptionId(id);
      setCurrentDescription(value?.description || '');
    }
    setDescriptionDialogOpen(true);
  };

  const handleSaveDescription = () => {
    if (editingDescriptionId === 'new') {
      setNewRowDescription(currentDescription);
    } else if (editingDescriptionId) {
      setValues(values.map((v) => (v.id === editingDescriptionId ? {...v, description: currentDescription} : v)));
    }
    setDescriptionDialogOpen(false);
    setCurrentDescription('');
    setEditingDescriptionId(null);
  };

  const handleCloseDescription = () => {
    setDescriptionDialogOpen(false);
    setCurrentDescription('');
    setEditingDescriptionId(null);
  };

  const handleToggleDisabled = (id: string) => {
    setValues(values.map((v) => (v.id === id ? {...v, disabled: !v.disabled} : v)));
  };

  const handleDeleteValue = (id: string) => {
    setValues(values.filter((v) => v.id !== id));
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          height: '95vh',
          maxHeight: '95vh'
        }
      }}
    >
      <DialogTitle>
        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <Typography variant="h6" sx={{fontWeight: 700, color: '#002677'}}>
            {initialData ? 'Edit Lookup Field' : 'Add New Lookup Field'}
          </Typography>
          <IconButton onClick={handleClose} disabled={isSaving}>
            <CloseIcon />
          </IconButton>
        </Box>
        {initialData?.managedBy && (
          <Box sx={{mt: 1}}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                padding: '4px 8px',
                borderRadius: '4px',
                backgroundColor: initialData.managedBy === 'User' ? '#EEF4FF' : '#FEF9EA',
                color: initialData.managedBy === 'User' ? '#002677' : '#826100',
                fontSize: '12px',
                fontWeight: 600,
                lineHeight: 1
              }}
            >
              {initialData.managedBy === 'User' ? (
                <PersonIcon sx={{fontSize: '16px', color: '#002677', display: 'flex'}} />
              ) : (
                <ComputerIcon sx={{fontSize: '16px', color: '#826100', display: 'flex'}} />
              )}
              <Box component="span" sx={{lineHeight: '16px'}}>
                {initialData.managedBy} Managed
              </Box>
            </Box>
          </Box>
        )}
      </DialogTitle>
      <DialogContent dividers sx={{overflow: 'auto', display: 'flex', flexDirection: 'column'}}>
        <Box sx={{pt: 1, px: 1, pb: 1}}>
          {/* First Row: Lookup Field (Identifier) and Display Name */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Controller
                name="lookupField"
                control={control}
                rules={{required: 'Lookup field is required'}}
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
                        Lookup Field (Identifier)
                        <Typography component="span" sx={{color: '#C40000', ml: 0.5}}>
                          *
                        </Typography>
                      </Typography>
                      <Tooltip
                        title="This is a system identifier which is hidden from end users and cannot be altered once created."
                        arrow
                        placement="right"
                      >
                        <HelpOutlineIcon sx={{fontSize: '16px', color: '#0066F5', cursor: 'pointer'}} />
                      </Tooltip>
                    </Box>
                    <Box
                      component="input"
                      {...field}
                      disabled={isSaving || !!initialData}
                      placeholder="Enter lookup field"
                      sx={{
                        width: '100%',
                        padding: '10px 12px',
                        fontSize: '14px',
                        border: errors.lookupField ? '1px solid #C40000' : '1px solid #CBCCCD',
                        borderRadius: '4px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        '&:hover': {
                          borderColor: errors.lookupField ? '#C40000' : '#999'
                        },
                        '&:focus': {
                          borderColor: errors.lookupField ? '#C40000' : '#0C55B8',
                          borderWidth: '1px'
                        },
                        '&:disabled': {
                          backgroundColor: '#F5F5F5',
                          cursor: 'not-allowed'
                        }
                      }}
                    />
                    {errors.lookupField && (
                      <Typography sx={{color: '#C40000', fontSize: '12px', mt: 0.5}}>
                        {errors.lookupField.message}
                      </Typography>
                    )}
                  </div>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="displayName"
                control={control}
                rules={{required: 'Display name is required'}}
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
                        Display Name
                        <Typography component="span" sx={{color: '#C40000', ml: 0.5}}>
                          *
                        </Typography>
                      </Typography>
                      <Tooltip title="The display name is the label shown to the user." arrow placement="right">
                        <HelpOutlineIcon sx={{fontSize: '16px', color: '#0066F5', cursor: 'pointer'}} />
                      </Tooltip>
                    </Box>
                    <Box
                      component="input"
                      {...field}
                      disabled={isSaving}
                      placeholder="Enter display name"
                      sx={{
                        width: '100%',
                        padding: '10px 12px',
                        fontSize: '14px',
                        border: errors.displayName ? '1px solid #C40000' : '1px solid #CBCCCD',
                        borderRadius: '4px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        '&:hover': {
                          borderColor: errors.displayName ? '#C40000' : '#999'
                        },
                        '&:focus': {
                          borderColor: errors.displayName ? '#C40000' : '#0C55B8',
                          borderWidth: '1px'
                        },
                        '&:disabled': {
                          backgroundColor: '#F5F5F5',
                          cursor: 'not-allowed'
                        }
                      }}
                    />
                    {errors.displayName && (
                      <Typography sx={{color: '#C40000', fontSize: '12px', mt: 0.5}}>
                        {errors.displayName.message}
                      </Typography>
                    )}
                  </div>
                )}
              />
            </Grid>
          </Grid>

          {/* Second Row: Max Stored Value Length and Numeric Value Toggle */}
          <Grid container spacing={2} sx={{mt: 2}}>
            <Grid item xs={12} md={6}>
              <Controller
                name="maxStoredValueLength"
                control={control}
                rules={{required: 'Max stored value length is required'}}
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
                        Max Stored Value Length
                        <Typography component="span" sx={{color: '#C40000', ml: 0.5}}>
                          *
                        </Typography>
                      </Typography>
                      <Tooltip
                        title="Limits the stored value's length: it restricts digit count for numeric values and character count for non-numeric values."
                        arrow
                        placement="right"
                      >
                        <HelpOutlineIcon sx={{fontSize: '16px', color: '#0066F5', cursor: 'pointer'}} />
                      </Tooltip>
                    </Box>
                    <Box
                      component="input"
                      {...field}
                      disabled={isSaving || !!initialData}
                      placeholder="Enter max length"
                      type="number"
                      sx={{
                        width: '100%',
                        padding: '10px 12px',
                        fontSize: '14px',
                        border: errors.maxStoredValueLength ? '1px solid #C40000' : '1px solid #CBCCCD',
                        borderRadius: '4px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        '&:hover': {
                          borderColor: errors.maxStoredValueLength ? '#C40000' : '#999'
                        },
                        '&:focus': {
                          borderColor: errors.maxStoredValueLength ? '#C40000' : '#0C55B8',
                          borderWidth: '1px'
                        },
                        '&:disabled': {
                          backgroundColor: '#F5F5F5',
                          cursor: 'not-allowed'
                        }
                      }}
                    />
                    {errors.maxStoredValueLength && (
                      <Typography sx={{color: '#C40000', fontSize: '12px', mt: 0.5}}>
                        {errors.maxStoredValueLength.message}
                      </Typography>
                    )}
                  </div>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="numericValue"
                control={control}
                render={({field}) => (
                  <Box sx={{mt: 3.5}}>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5, overflow: 'visible'}}>
                      <Typography
                        sx={{
                          fontSize: '16px',
                          fontWeight: 700,
                          color: '#323334'
                        }}
                      >
                        Numeric value?
                      </Typography>
                      <Switch
                        checked={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.checked);
                        }}
                        disabled={isSaving || !!initialData}
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
                        {field.value ? 'Yes' : 'No'}
                      </Typography>
                    </Box>
                  </Box>
                )}
              />
            </Grid>
          </Grid>

          {/* Values Section */}
          <Box sx={{mt: 2, pt: 2, borderTop: '1px solid #CBCCCD'}}>
            {/* Header with count and search - becomes sticky */}
            <Box
              sx={{
                position: 'sticky',
                top: -9,
                backgroundColor: '#FFFFFF',
                zIndex: 10,
                pb: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#4B4D4F',
                  fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                }}
              >
                Number of options: {values.length}
              </Typography>

              <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                {/* Search Input */}
                <TextField
                  placeholder="Search for values"
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon sx={{color: '#0C55B8', fontSize: '20px'}} />
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    width: '280px',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '46px',
                      backgroundColor: '#FFFFFF',
                      fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                      fontSize: '14px',
                      height: '40px',
                      '& fieldset': {
                        borderColor: '#CBCCCD'
                      },
                      '&:hover fieldset': {
                        borderColor: '#CBCCCD'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#CBCCCD',
                        borderWidth: '1px'
                      }
                    },
                    '& .MuiInputBase-input': {
                      py: '8px',
                      '&::placeholder': {
                        color: '#6E7072',
                        opacity: 1
                      }
                    }
                  }}
                />

                {/* Add Value Button */}
                <Button
                  startIcon={<AddIcon />}
                  variant="contained"
                  onClick={handleAddValue}
                  sx={{
                    backgroundColor: '#002677',
                    color: '#FFFFFF',
                    borderRadius: '46px',
                    padding: '6px 16px',
                    fontSize: '14px',
                    fontWeight: 700,
                    textTransform: 'none',
                    fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                    height: '40px',
                    '&:hover': {
                      backgroundColor: '#001a5c'
                    }
                  }}
                >
                  Add Value
                </Button>
              </Box>
            </Box>

            {/* Table with Headers - Single table with sticky header */}
            <Box
              sx={{
                mt: 0,
                maxHeight: '400px',
                overflowY: 'auto',
                border: '1px solid #CBCCCD',
                borderRadius: '4px'
              }}
            >
              <Table sx={{tableLayout: 'fixed', width: '100%'}}>
                <TableHead
                  sx={{
                    position: 'sticky',
                    top: 0,
                    backgroundColor: '#FFFFFF',
                    zIndex: 10,
                    '& th': {
                      backgroundColor: '#FFFFFF'
                    }
                  }}
                >
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        fontSize: '14px',
                        color: '#323334',
                        borderBottom: '2px solid #CBCCCD',
                        fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                        width: '35%',
                        padding: '12px 8px'
                      }}
                    >
                      Field Value (identifier)
                      <Box component="span" sx={{color: '#C40000', ml: 0.5}}>
                        *
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        fontSize: '14px',
                        color: '#323334',
                        borderBottom: '2px solid #CBCCCD',
                        fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                        width: '40%',
                        padding: '12px 8px'
                      }}
                    >
                      Display Name
                      <Box component="span" sx={{color: '#C40000', ml: 0.5}}>
                        *
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        fontSize: '14px',
                        color: '#323334',
                        borderBottom: '2px solid #CBCCCD',
                        fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                        width: '25%',
                        padding: '12px 8px'
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {values.length === 0 && !isAddingNew ? (
                    <TableRow>
                      <TableCell colSpan={3} sx={{borderBottom: 'none', padding: 0}}>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '48px',
                            minHeight: '200px',
                            gap: '8px'
                          }}
                        >
                          <FolderOffOutlinedIcon
                            sx={{
                              fontSize: '24px',
                              color: '#6E7072',
                              mb: 1
                            }}
                          />
                          <Typography
                            sx={{
                              fontSize: '16px',
                              fontWeight: 400,
                              color: '#6E7072',
                              fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                            }}
                          >
                            No values found for this field
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: '14px',
                              fontWeight: 400,
                              color: '#6E7072',
                              fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                              textAlign: 'center'
                            }}
                          >
                            Start by{' '}
                            <Box
                              component="button"
                              onClick={handleAddValue}
                              sx={{
                                color: '#0C55B8',
                                textDecoration: 'underline',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                font: 'inherit',
                                '&:hover': {
                                  textDecoration: 'underline'
                                }
                              }}
                            >
                              adding a value
                            </Box>
                            .
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {values.map((value) => (
                        <TableRow key={value.id}>
                          {editingId === value.id ? (
                            <>
                              <TableCell sx={{borderBottom: '1px solid #CBCCCD', padding: '8px', verticalAlign: 'top'}}>
                                <div>
                                  <Box
                                    component="input"
                                    value={editFieldValue}
                                    onChange={handleEditFieldValueChange}
                                    onBlur={handleEditFieldValueBlur}
                                    placeholder="Enter field value"
                                    maxLength={maxStoredValueLength ? parseInt(maxStoredValueLength, 10) : undefined}
                                    sx={{
                                      width: '100%',
                                      padding: '10px 12px',
                                      fontSize: '14px',
                                      border: editFieldValueError ? '1px solid #C40000' : '1px solid #CBCCCD',
                                      borderRadius: '4px',
                                      outline: 'none',
                                      boxSizing: 'border-box',
                                      fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                                      '&:hover': {
                                        borderColor: editFieldValueError ? '#C40000' : '#999'
                                      },
                                      '&:focus': {
                                        borderColor: editFieldValueError ? '#C40000' : '#0C55B8',
                                        borderWidth: '1px'
                                      }
                                    }}
                                  />
                                  {editFieldValueError && (
                                    <Typography
                                      sx={{
                                        color: '#C40000',
                                        fontSize: '12px',
                                        mt: 0.5,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5
                                      }}
                                    >
                                      <ErrorIcon sx={{color: '#C40000', fontSize: '16px'}} />
                                      {editFieldValueError}
                                    </Typography>
                                  )}
                                  {maxStoredValueLength && !editFieldValueError && (
                                    <Typography
                                      sx={{
                                        fontSize: '12px',
                                        color: '#6E7072',
                                        mt: 0.5,
                                        textAlign: 'right'
                                      }}
                                    >
                                      {editFieldValue.length}/{maxStoredValueLength}
                                    </Typography>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell sx={{borderBottom: '1px solid #CBCCCD', padding: '8px', verticalAlign: 'top'}}>
                                <div>
                                  <Box
                                    component="input"
                                    value={editDisplayName}
                                    onChange={handleEditDisplayNameChange}
                                    onBlur={handleEditDisplayNameBlur}
                                    placeholder="Enter display name"
                                    sx={{
                                      width: '100%',
                                      padding: '10px 12px',
                                      fontSize: '14px',
                                      border: editDisplayNameError ? '1px solid #C40000' : '1px solid #CBCCCD',
                                      borderRadius: '4px',
                                      outline: 'none',
                                      boxSizing: 'border-box',
                                      fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                                      '&:hover': {
                                        borderColor: editDisplayNameError ? '#C40000' : '#999'
                                      },
                                      '&:focus': {
                                        borderColor: editDisplayNameError ? '#C40000' : '#0C55B8',
                                        borderWidth: '1px'
                                      }
                                    }}
                                  />
                                  {editDisplayNameError && (
                                    <Typography
                                      sx={{
                                        color: '#C40000',
                                        fontSize: '12px',
                                        mt: 0.5,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5
                                      }}
                                    >
                                      <ErrorIcon sx={{color: '#C40000', fontSize: '16px'}} />
                                      {editDisplayNameError}
                                    </Typography>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell
                                sx={{borderBottom: '1px solid #CBCCCD', verticalAlign: 'top', paddingTop: '8px'}}
                              >
                                <Box sx={{display: 'flex', gap: 0.5}}>
                                  <Tooltip title="Save" arrow>
                                    <IconButton size="small" onClick={handleSaveEdit} sx={{color: '#0C55B8'}}>
                                      <CheckIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Discard" arrow>
                                    <IconButton size="small" onClick={handleCancelEdit} sx={{color: '#0C55B8'}}>
                                      <CloseIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Notes" arrow>
                                    <IconButton
                                      size="small"
                                      sx={{color: '#0C55B8'}}
                                      onClick={() => {
                                        handleOpenDescription(value.id);
                                      }}
                                    >
                                      <DescriptionOutlinedIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </TableCell>
                            </>
                          ) : (
                            <>
                              <TableCell sx={{borderBottom: '1px solid #CBCCCD', padding: '8px'}}>
                                <Box
                                  component="input"
                                  value={value.fieldValue}
                                  disabled
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
                                    color: '#323334',
                                    cursor: 'not-allowed',
                                    opacity: value.disabled ? 0.5 : 1
                                  }}
                                />
                              </TableCell>
                              <TableCell sx={{borderBottom: '1px solid #CBCCCD', padding: '8px'}}>
                                <Box
                                  component="input"
                                  value={value.displayName}
                                  disabled
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
                                    color: '#323334',
                                    cursor: 'not-allowed',
                                    opacity: value.disabled ? 0.5 : 1
                                  }}
                                />
                              </TableCell>
                              <TableCell sx={{borderBottom: '1px solid #CBCCCD'}}>
                                <Box sx={{display: 'flex', gap: 1}}>
                                  <IconButton
                                    size="small"
                                    sx={{color: '#0C55B8'}}
                                    onClick={() => {
                                      handleEdit(value);
                                    }}
                                    title="Edit"
                                  >
                                    <EditOutlinedIcon fontSize="small" />
                                  </IconButton>
                                  <Tooltip title={value.disabled ? 'Enable' : 'Disable'} arrow>
                                    <IconButton
                                      size="small"
                                      sx={{color: '#0C55B8'}}
                                      onClick={() => {
                                        handleToggleDisabled(value.id);
                                      }}
                                    >
                                      {value.disabled ? (
                                        <DoDisturbOffOutlinedIcon fontSize="small" />
                                      ) : (
                                        <DoDisturbOnOutlinedIcon fontSize="small" />
                                      )}
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Delete" arrow>
                                    <IconButton
                                      size="small"
                                      onClick={() => {
                                        handleDeleteValue(value.id);
                                      }}
                                      sx={{
                                        color: '#0C55B8 !important',
                                        opacity: initialData?.managedBy === 'System' ? 0.5 : 1,
                                        cursor: initialData?.managedBy === 'System' ? 'not-allowed' : 'pointer'
                                      }}
                                      disabled={initialData?.managedBy === 'System'}
                                    >
                                      <DeleteOutlineIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Notes" arrow>
                                    <IconButton
                                      size="small"
                                      sx={{color: '#0C55B8'}}
                                      onClick={() => {
                                        handleOpenDescription(value.id);
                                      }}
                                    >
                                      <DescriptionOutlinedIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </TableCell>
                            </>
                          )}
                        </TableRow>
                      ))}
                      {isAddingNew && (
                        <TableRow>
                          <TableCell sx={{borderBottom: '1px solid #CBCCCD', padding: '8px', verticalAlign: 'top'}}>
                            <div>
                              <Box
                                component="input"
                                value={newFieldValue}
                                onChange={handleFieldValueChange}
                                onBlur={handleFieldValueBlur}
                                placeholder="Enter field value"
                                maxLength={maxStoredValueLength ? parseInt(maxStoredValueLength, 10) : undefined}
                                sx={{
                                  width: '100%',
                                  padding: '10px 12px',
                                  fontSize: '14px',
                                  border: fieldValueError ? '1px solid #C40000' : '1px solid #CBCCCD',
                                  borderRadius: '4px',
                                  outline: 'none',
                                  boxSizing: 'border-box',
                                  fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                                  '&:hover': {
                                    borderColor: fieldValueError ? '#C40000' : '#999'
                                  },
                                  '&:focus': {
                                    borderColor: fieldValueError ? '#C40000' : '#0C55B8',
                                    borderWidth: '1px'
                                  }
                                }}
                              />
                              {fieldValueError && (
                                <Typography
                                  sx={{
                                    color: '#C40000',
                                    fontSize: '12px',
                                    mt: 0.5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5
                                  }}
                                >
                                  <ErrorIcon sx={{color: '#C40000', fontSize: '16px'}} />
                                  {fieldValueError}
                                </Typography>
                              )}
                              {maxStoredValueLength && !fieldValueError && (
                                <Typography
                                  sx={{
                                    fontSize: '12px',
                                    color: '#6E7072',
                                    mt: 0.5,
                                    textAlign: 'right'
                                  }}
                                >
                                  {newFieldValue.length}/{maxStoredValueLength}
                                </Typography>
                              )}
                            </div>
                          </TableCell>
                          <TableCell sx={{borderBottom: '1px solid #CBCCCD', padding: '8px', verticalAlign: 'top'}}>
                            <div>
                              <Box
                                component="input"
                                value={newDisplayName}
                                onChange={handleDisplayNameChange}
                                onBlur={handleDisplayNameBlur}
                                placeholder="Enter display name"
                                sx={{
                                  width: '100%',
                                  padding: '10px 12px',
                                  fontSize: '14px',
                                  border: displayNameError ? '1px solid #C40000' : '1px solid #CBCCCD',
                                  borderRadius: '4px',
                                  outline: 'none',
                                  boxSizing: 'border-box',
                                  fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                                  '&:hover': {
                                    borderColor: displayNameError ? '#C40000' : '#999'
                                  },
                                  '&:focus': {
                                    borderColor: displayNameError ? '#C40000' : '#0C55B8',
                                    borderWidth: '1px'
                                  }
                                }}
                              />
                              {displayNameError && (
                                <Typography
                                  sx={{
                                    color: '#C40000',
                                    fontSize: '12px',
                                    mt: 0.5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5
                                  }}
                                >
                                  <ErrorIcon sx={{color: '#C40000', fontSize: '16px'}} />
                                  {displayNameError}
                                </Typography>
                              )}
                            </div>
                          </TableCell>
                          <TableCell sx={{borderBottom: '1px solid #CBCCCD', verticalAlign: 'top', paddingTop: '8px'}}>
                            <Box sx={{display: 'flex', gap: 0.5}}>
                              <Tooltip title="Save" arrow>
                                <IconButton size="small" onClick={handleSaveNewValue} sx={{color: '#0C55B8'}}>
                                  <CheckIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Discard" arrow>
                                <IconButton size="small" onClick={handleCancelNewValue} sx={{color: '#0C55B8'}}>
                                  <CloseIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Notes" arrow>
                                <IconButton
                                  size="small"
                                  sx={{color: '#0C55B8'}}
                                  onClick={() => {
                                    handleOpenDescription('new');
                                  }}
                                >
                                  <DescriptionOutlinedIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Box>
        </Box>
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

      {/* Description Dialog */}
      <Dialog open={descriptionDialogOpen} onClose={handleCloseDescription} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <Typography variant="h6" sx={{fontSize: '18px', fontWeight: 700}}>
              Notes
            </Typography>
            <IconButton onClick={handleCloseDescription} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography sx={{fontSize: '14px', color: '#6E7072', mb: 2}}>
            Please use this space to add notes/describe the lookup value.
          </Typography>
          <Box
            component="textarea"
            value={currentDescription}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              if (e.target.value.length <= 1000) {
                setCurrentDescription(e.target.value);
              }
            }}
            placeholder="Enter notes..."
            maxLength={1000}
            sx={{
              width: '100%',
              minHeight: '120px',
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
              }
            }}
          />
          <Typography sx={{fontSize: '12px', color: '#6E7072', mt: 0.5, textAlign: 'right'}}>
            {currentDescription.length}/1000
          </Typography>
        </DialogContent>
        <DialogActions sx={{px: 3, py: 2, gap: 1}}>
          <Button
            onClick={handleCloseDescription}
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
            onClick={handleSaveDescription}
            variant="contained"
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
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};
