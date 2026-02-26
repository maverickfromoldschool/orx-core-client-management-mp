'use client';

import React from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  Typography,
  Switch,
  Grid,
  Tooltip,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Autocomplete,
  TextField
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from '@mui/icons-material/Error';

import {lookupApiService} from '../services';

import {EmptyState} from './empty-state';
import type {VariantDialogProps} from './variant-dialog.types';

export function VariantDialog({open, onClose, onSave, initialData, isSaving = false}: VariantDialogProps) {
  const [activeTab, setActiveTab] = React.useState(0);
  const [formData, setFormData] = React.useState({
    variantField: '',
    variantName: '',
    dataType: 'String',
    systemDefined: false,
    predefined: false,
    relatedEntity: '',
    attribute: '',
    fieldType: '',
    field: '',
    notes: ''
  });

  const [errors, setErrors] = React.useState({
    variantField: '',
    variantName: '',
    dataType: ''
  });

  const [touched, setTouched] = React.useState({
    variantField: false,
    variantName: false,
    dataType: false
  });

  // Variant values state
  const [variantValues, setVariantValues] = React.useState<{id: string; value: string; description: string}[]>([]);
  const [isAddingNew, setIsAddingNew] = React.useState(false);
  const [newValue, setNewValue] = React.useState('');
  const [newDescription, setNewDescription] = React.useState('');
  const [valueError, setValueError] = React.useState('');
  const [descriptionError, setDescriptionError] = React.useState('');
  const [valueTouched, setValueTouched] = React.useState(false);
  const [descriptionTouched, setDescriptionTouched] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editValue, setEditValue] = React.useState('');
  const [editDescription, setEditDescription] = React.useState('');
  const [editValueError, setEditValueError] = React.useState('');
  const [editDescriptionError, setEditDescriptionError] = React.useState('');
  const [editValueTouched, setEditValueTouched] = React.useState(false);
  const [editDescriptionTouched, setEditDescriptionTouched] = React.useState(false);

  // Entity autocomplete options
  const [entityOptions, setEntityOptions] = React.useState<string[]>([]);
  const [entityLoading, setEntityLoading] = React.useState(false);

  // Attribute autocomplete options
  const [attributeOptions, setAttributeOptions] = React.useState<{label: string; value: string}[]>([]);
  const [attributeLoading, setAttributeLoading] = React.useState(false);

  // Field Type autocomplete options
  const [fieldTypeOptions, setFieldTypeOptions] = React.useState<{label: string; value: string}[]>([]);
  const [fieldTypeLoading, setFieldTypeLoading] = React.useState(false);

  // Field autocomplete options
  const [fieldOptions, setFieldOptions] = React.useState<{label: string; value: string}[]>([]);
  const [fieldLoading, setFieldLoading] = React.useState(false);

  // Data Type autocomplete options
  const [dataTypeOptions, setDataTypeOptions] = React.useState<{label: string; value: string}[]>([]);
  const [dataTypeLoading, setDataTypeLoading] = React.useState(false);

  const API_BASE_URL = process.env['REACT_APP_API_BASE_URL'] || 'https://coreweb-dev-api.optum.com';

  // Fetch data type options from lookup API
  React.useEffect(() => {
    const fetchDataTypeOptions = async () => {
      setDataTypeLoading(true);
      try {
        const response = await lookupApiService.searchLookupFields({
          page: 0,
          size: 100,
          field: 'DATA_TYPE'
        });

        if (response?.fields && response.fields.length > 0) {
          const field = response.fields[0];
          if (field?.values && field.values.length > 0) {
            const options = field.values.map((value) => ({
              value: value.fieldValue,
              label: `${value.description || value.displayName || value.fieldValue} (${value.fieldValue})`
            }));
            setDataTypeOptions(options);
          }
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch data type options:', error);
        setDataTypeOptions([]);
      } finally {
        setDataTypeLoading(false);
      }
    };

    if (open) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      fetchDataTypeOptions();
    }
  }, [open]);

  // Fetch entity values from lookup API
  React.useEffect(() => {
    const fetchEntityOptions = async () => {
      setEntityLoading(true);
      try {
        const response = await lookupApiService.searchLookupFields({
          page: 0,
          size: 100
        });

        // Find the ENTITY lookup field
        const entityLookup = response.fields.find((field) => field.lookupField === 'ENTITY');

        if (entityLookup?.values) {
          // Extract field values from the lookup
          const options = entityLookup.values.map((val) => val.fieldValue);
          setEntityOptions(options);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch entity options:', error);
      } finally {
        setEntityLoading(false);
      }
    };

    if (open) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      fetchEntityOptions();
    }
  }, [open]);

  // Fetch attribute options when entity changes
  React.useEffect(() => {
    const fetchAttributeOptions = async () => {
      if (!formData.relatedEntity) {
        setAttributeOptions([]);
        return;
      }

      setAttributeLoading(true);
      try {
        const response = await axios.get<{
          success: boolean;
          data: {data: {attribute: string; description: string}[]};
        }>(`${API_BASE_URL}/attribute`, {
          params: {
            entity: formData.relatedEntity,
            page: 0,
            size: 100
          }
        });

        if (response.data?.success && response.data.data?.data) {
          const options = response.data.data.data.map((attr) => ({
            value: attr.attribute,
            label: attr.description || attr.attribute
          }));
          setAttributeOptions(options);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch attribute options:', error);
        setAttributeOptions([]);
      } finally {
        setAttributeLoading(false);
      }
    };

    if (open && formData.relatedEntity) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      fetchAttributeOptions();
    }
  }, [open, formData.relatedEntity, API_BASE_URL]);

  // Fetch field type options when predefined is true
  React.useEffect(() => {
    const fetchFieldTypeOptions = async () => {
      if (!formData.predefined) {
        setFieldTypeOptions([]);
        return;
      }

      setFieldTypeLoading(true);
      try {
        const response = await lookupApiService.searchLookupFields({
          page: 0,
          size: 100,
          field: 'PREDEFINED_FIELD_TYPE'
        });

        if (response?.fields && response.fields.length > 0) {
          // Get the values array from the first field (PREDEFINED_FIELD_TYPE)
          const field = response.fields[0];
          if (field?.values && field.values.length > 0) {
            const options = field.values.map((value) => ({
              value: value.fieldValue,
              label: value.description || value.displayName || value.fieldValue
            }));
            setFieldTypeOptions(options);
          }
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch field type options:', error);
        setFieldTypeOptions([]);
      } finally {
        setFieldTypeLoading(false);
      }
    };

    if (open && formData.predefined) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      fetchFieldTypeOptions();
    }
  }, [open, formData.predefined]);

  // Fetch field options when fieldType changes
  React.useEffect(() => {
    const fetchFieldOptions = async () => {
      if (!formData.fieldType) {
        setFieldOptions([]);
        return;
      }

      // Find the selected field type option to check its label
      const selectedFieldTypeOption = fieldTypeOptions.find((opt) => opt.value === formData.fieldType);
      const fieldTypeLabel = selectedFieldTypeOption?.label?.toLowerCase() || '';
      const fieldTypeValue = formData.fieldType.toLowerCase();

      // Check if it's a lookup field type (check both label and value)
      const isLookupFieldType = fieldTypeLabel.includes('lookup') || fieldTypeValue.includes('lookup');

      if (!isLookupFieldType) {
        setFieldOptions([]);
        return;
      }

      setFieldLoading(true);
      try {
        const response = await lookupApiService.searchLookupFields({
          page: 0,
          size: 100
        });
        if (response?.fields && response.fields.length > 0) {
          // Map the fields to options using the field's displayName (description)
          const options = response.fields.map((field) => ({
            value: field.lookupField,
            label: field.displayName || field.lookupField
          }));
          setFieldOptions(options);
        } else {
          setFieldOptions([]);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch field options:', error);
        setFieldOptions([]);
      } finally {
        setFieldLoading(false);
      }
    };

    if (open) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      fetchFieldOptions();
    }
  }, [open, formData.fieldType, fieldTypeOptions]);

  // Reset form when dialog opens or initialData changes
  React.useEffect(() => {
    if (open) {
      setActiveTab(0); // Reset to Main tab
      if (initialData) {
        setFormData({
          variantField: initialData.variantField,
          variantName: initialData.variantName,
          dataType: initialData.dataType,
          systemDefined: initialData.systemDefined,
          predefined: initialData.predefined,
          relatedEntity: initialData.relatedEntity || '',
          attribute: initialData.attribute || '',
          fieldType: initialData.fieldType || '',
          field: initialData.field || '',
          notes: initialData.notes || ''
        });
        // Populate variant values from initialData
        setVariantValues(initialData.variantValues || []);
      } else {
        setFormData({
          variantField: '',
          variantName: '',
          dataType: 'String',
          systemDefined: false,
          predefined: false,
          relatedEntity: '',
          attribute: '',
          fieldType: '',
          field: '',
          notes: ''
        });
        // Clear variant values for new variant
        setVariantValues([]);
      }
      setErrors({
        variantField: '',
        variantName: '',
        dataType: ''
      });
      setTouched({
        variantField: false,
        variantName: false,
        dataType: false
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
      variantField: '',
      variantName: '',
      dataType: ''
    };

    if (!formData.variantField.trim()) {
      newErrors.variantField = 'Variant field is required';
    }

    if (!formData.variantName.trim()) {
      newErrors.variantName = 'Variant name is required';
    }

    if (!formData.dataType.trim()) {
      newErrors.dataType = 'Data type is required';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== '');
  };

  const handleSave = () => {
    // Mark all fields as touched
    setTouched({
      variantField: true,
      variantName: true,
      dataType: true
    });

    if (validateForm()) {
      // Find the selected attribute's display name (label)
      const selectedAttribute = attributeOptions.find((opt) => opt.value === formData.attribute);

      onSave({
        id: initialData?.id || String(Date.now()),
        ...formData,
        attributeName: selectedAttribute?.label || formData.attribute || undefined,
        variantValues
      });
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {value} = e.target;
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (touched[field as keyof typeof touched]) {
      const newErrors = {...errors};
      if (value.trim()) {
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
    if (!formData[field as keyof typeof formData] || !String(formData[field as keyof typeof formData]).trim()) {
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
    (field: 'systemDefined' | 'predefined') => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.checked
      }));
    };

  const handleTabChange = (_event: React.SyntheticEvent, newTab: number) => {
    setActiveTab(newTab);
  };

  // Variant Values handlers
  const handleAddVariantValue = () => {
    setIsAddingNew(true);
    setNewValue('');
    setNewDescription('');
    setValueError('');
    setDescriptionError('');
    setValueTouched(false);
    setDescriptionTouched(false);
  };

  const handleSaveNewVariantValue = () => {
    let hasError = false;

    if (!newValue.trim()) {
      setValueError('Required field');
      hasError = true;
    }

    if (!newDescription.trim()) {
      setDescriptionError('Required field');
      hasError = true;
    }

    if (hasError) return;

    const newVariantValue = {
      id: `variant-value-${Date.now()}`,
      value: newValue.trim(),
      description: newDescription.trim()
    };
    setVariantValues([newVariantValue, ...variantValues]);
    setIsAddingNew(false);
    setNewValue('');
    setNewDescription('');
    setValueError('');
    setDescriptionError('');
    setValueTouched(false);
    setDescriptionTouched(false);
  };

  const handleCancelNewVariantValue = () => {
    setIsAddingNew(false);
    setNewValue('');
    setNewDescription('');
    setValueError('');
    setDescriptionError('');
    setValueTouched(false);
    setDescriptionTouched(false);
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target;
    setNewValue(value);
    if (valueTouched) {
      if (!value.trim()) {
        setValueError('Required field');
      } else {
        setValueError('');
      }
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target;
    setNewDescription(value);
    if (descriptionTouched && !value.trim()) {
      setDescriptionError('Required field');
    } else {
      setDescriptionError('');
    }
  };

  const handleValueBlur = () => {
    setValueTouched(true);
    if (!newValue.trim()) {
      setValueError('Required field');
    }
  };

  const handleDescriptionBlur = () => {
    setDescriptionTouched(true);
    if (!newDescription.trim()) {
      setDescriptionError('Required field');
    }
  };

  const handleEditVariantValue = (variantValue: {id: string; value: string; description: string}) => {
    setEditingId(variantValue.id);
    setEditValue(variantValue.value);
    setEditDescription(variantValue.description);
    setEditValueError('');
    setEditDescriptionError('');
    setEditValueTouched(false);
    setEditDescriptionTouched(false);
  };

  const handleSaveEditVariantValue = () => {
    let hasError = false;

    if (!editValue.trim()) {
      setEditValueError('Required field');
      hasError = true;
    }

    if (!editDescription.trim()) {
      setEditDescriptionError('Required field');
      hasError = true;
    }

    if (hasError) return;

    setVariantValues(
      variantValues.map((v) =>
        v.id === editingId ? {...v, value: editValue.trim(), description: editDescription.trim()} : v
      )
    );
    setEditingId(null);
    setEditValue('');
    setEditDescription('');
    setEditValueError('');
    setEditDescriptionError('');
    setEditValueTouched(false);
    setEditDescriptionTouched(false);
  };

  const handleCancelEditVariantValue = () => {
    setEditingId(null);
    setEditValue('');
    setEditDescription('');
    setEditValueError('');
    setEditDescriptionError('');
    setEditValueTouched(false);
    setEditDescriptionTouched(false);
  };

  const handleEditValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target;
    setEditValue(value);
    if (editValueTouched) {
      if (!value.trim()) {
        setEditValueError('Required field');
      } else {
        setEditValueError('');
      }
    }
  };

  const handleEditDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target;
    setEditDescription(value);
    if (editDescriptionTouched && !value.trim()) {
      setEditDescriptionError('Required field');
    } else {
      setEditDescriptionError('');
    }
  };

  const handleEditValueBlur = () => {
    setEditValueTouched(true);
    if (!editValue.trim()) {
      setEditValueError('Required field');
    }
  };

  const handleEditDescriptionBlur = () => {
    setEditDescriptionTouched(true);
    if (!editDescription.trim()) {
      setEditDescriptionError('Required field');
    }
  };

  const handleDeleteVariantValue = (id: string) => {
    setVariantValues(variantValues.filter((v) => v.id !== id));
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          height: activeTab === 1 ? '90vh' : 'auto',
          maxHeight: '90vh',
          minHeight: activeTab === 1 ? '90vh' : 'auto'
        }
      }}
    >
      <DialogTitle>
        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <Typography variant="h6" sx={{fontWeight: 700, color: '#002677'}}>
            {initialData ? 'Edit Variant' : 'Add New Variant'}
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
          <Tab label="Variant Values" disabled={!formData.predefined} />
          <Tab label="Notes" />
        </Tabs>
      </Box>

      <DialogContent
        dividers
        sx={{overflow: activeTab === 1 ? 'hidden' : 'auto', display: 'flex', flexDirection: 'column'}}
      >
        {/* Main Tab */}
        {activeTab === 0 && (
          <Box sx={{pt: 1, px: 1, pb: 1}}>
            {/* First Row: Variant Field and Variant Name */}
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
                      Variant Field
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
                    value={formData.variantField}
                    onChange={handleChange('variantField')}
                    onBlur={handleBlur('variantField')}
                    disabled={isSaving || !!initialData}
                    placeholder="Enter variant field"
                    sx={{
                      width: '100%',
                      padding: '10px 12px',
                      fontSize: '14px',
                      border: errors.variantField ? '1px solid #C40000' : '1px solid #CBCCCD',
                      borderRadius: '4px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      '&:hover': {
                        borderColor: errors.variantField ? '#C40000' : '#999'
                      },
                      '&:focus': {
                        borderColor: errors.variantField ? '#C40000' : '#0C55B8',
                        borderWidth: '1px'
                      },
                      '&:disabled': {
                        backgroundColor: '#F5F5F5',
                        cursor: 'not-allowed'
                      }
                    }}
                  />
                  {errors.variantField && (
                    <Typography sx={{color: '#C40000', fontSize: '12px', mt: 0.5}}>{errors.variantField}</Typography>
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
                      Variant Name
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
                    value={formData.variantName}
                    onChange={handleChange('variantName')}
                    onBlur={handleBlur('variantName')}
                    disabled={isSaving}
                    placeholder="Enter variant name"
                    sx={{
                      width: '100%',
                      padding: '10px 12px',
                      fontSize: '14px',
                      border: errors.variantName ? '1px solid #C40000' : '1px solid #CBCCCD',
                      borderRadius: '4px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      '&:hover': {
                        borderColor: errors.variantName ? '#C40000' : '#999'
                      },
                      '&:focus': {
                        borderColor: errors.variantName ? '#C40000' : '#0C55B8',
                        borderWidth: '1px'
                      },
                      '&:disabled': {
                        backgroundColor: '#F5F5F5',
                        cursor: 'not-allowed'
                      }
                    }}
                  />
                  {errors.variantName && (
                    <Typography sx={{color: '#C40000', fontSize: '12px', mt: 0.5}}>{errors.variantName}</Typography>
                  )}
                </div>
              </Grid>
            </Grid>

            {/* Second Row: Data Type and Related Entity */}
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
                    <Tooltip title="Select the data type for this variant." arrow placement="right">
                      <HelpOutlineIcon sx={{fontSize: '16px', color: '#0066F5', cursor: 'pointer'}} />
                    </Tooltip>
                  </Box>
                  <Autocomplete
                    value={dataTypeOptions.find((opt) => opt.value === formData.dataType) || null}
                    onChange={(event, selectedValue) => {
                      setFormData((prev) => ({...prev, dataType: selectedValue?.value || ''}));
                      if (selectedValue) {
                        setErrors((prev) => ({...prev, dataType: ''}));
                      }
                    }}
                    onBlur={() => {
                      setTouched((prev) => ({...prev, dataType: true}));
                      if (!formData.dataType.trim()) {
                        setErrors((prev) => ({...prev, dataType: 'Required field'}));
                      }
                    }}
                    options={dataTypeOptions}
                    loading={dataTypeLoading}
                    disabled={isSaving}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select data type"
                        error={!!errors.dataType}
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
                  />
                  {errors.dataType && (
                    <Typography sx={{color: '#C40000', fontSize: '12px', mt: 0.5}}>{errors.dataType}</Typography>
                  )}
                </div>
              </Grid>
            </Grid>

            {/* Third Row: Related Entity */}
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
                      Related Entity
                    </Typography>
                    <Tooltip title="Specify the entity this variant is related to." arrow placement="right">
                      <HelpOutlineIcon sx={{fontSize: '16px', color: '#0066F5', cursor: 'pointer'}} />
                    </Tooltip>
                  </Box>
                  <Autocomplete
                    value={formData.relatedEntity || null}
                    onChange={(event, selectedValue) => {
                      setFormData((prev) => ({...prev, relatedEntity: selectedValue || ''}));
                    }}
                    options={entityOptions}
                    loading={entityLoading}
                    disabled={isSaving}
                    freeSolo
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select or enter entity"
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
                  />
                </div>
              </Grid>
              {formData.relatedEntity && (
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
                        Attribute
                      </Typography>
                      <Tooltip title="Select the attribute associated with this entity." arrow placement="right">
                        <HelpOutlineIcon sx={{fontSize: '16px', color: '#0066F5', cursor: 'pointer'}} />
                      </Tooltip>
                    </Box>
                    <Autocomplete
                      value={attributeOptions.find((opt) => opt.value === formData.attribute) || null}
                      onChange={(event, selectedValue) => {
                        setFormData((prev) => ({...prev, attribute: selectedValue?.value || ''}));
                      }}
                      options={attributeOptions}
                      loading={attributeLoading}
                      disabled={isSaving}
                      getOptionLabel={(option) => option.label}
                      isOptionEqualToValue={(option, value) => option.value === value.value}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select attribute"
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
                    />
                  </div>
                </Grid>
              )}
            </Grid>

            {/* Fourth Row: System Defined and Predefined Switches */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box sx={{mt: 3.5}}>
                  <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5, overflow: 'visible'}}>
                    <Typography
                      sx={{
                        fontSize: '16px',
                        fontWeight: 700,
                        color: '#323334'
                      }}
                    >
                      System Defined?
                    </Typography>
                    <Switch
                      checked={formData.systemDefined}
                      onChange={handleSwitchChange('systemDefined')}
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
                      {formData.systemDefined ? 'Yes' : 'No'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{mt: 3.5}}>
                  <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5, overflow: 'visible'}}>
                    <Typography
                      sx={{
                        fontSize: '16px',
                        fontWeight: 700,
                        color: '#323334'
                      }}
                    >
                      Predefined?
                    </Typography>
                    <Switch
                      checked={formData.predefined}
                      onChange={handleSwitchChange('predefined')}
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
                      {formData.predefined ? 'Yes' : 'No'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {/* Fifth Row: Field Type (shown when predefined is true) */}
            {formData.predefined && (
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
                        Field Type
                      </Typography>
                      <Tooltip title="Select the field type for this predefined variant." arrow placement="right">
                        <HelpOutlineIcon sx={{fontSize: '16px', color: '#0066F5', cursor: 'pointer'}} />
                      </Tooltip>
                    </Box>
                    <Autocomplete
                      value={fieldTypeOptions.find((opt) => opt.value === formData.fieldType) || null}
                      onChange={(event, selectedValue) => {
                        setFormData((prev) => ({...prev, fieldType: selectedValue?.value || ''}));
                      }}
                      options={fieldTypeOptions}
                      loading={fieldTypeLoading}
                      disabled={isSaving}
                      getOptionLabel={(option) => option.label}
                      isOptionEqualToValue={(option, value) => option.value === value.value}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select field type"
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
                        Field
                      </Typography>
                      <Tooltip title="Select the field for this predefined variant." arrow placement="right">
                        <HelpOutlineIcon sx={{fontSize: '16px', color: '#0066F5', cursor: 'pointer'}} />
                      </Tooltip>
                    </Box>
                    <Autocomplete
                      value={fieldOptions.find((opt) => opt.value === formData.field) || null}
                      onChange={(event, selectedValue) => {
                        setFormData((prev) => ({...prev, field: selectedValue?.value || ''}));
                      }}
                      options={fieldOptions}
                      loading={fieldLoading}
                      disabled={isSaving}
                      getOptionLabel={(option) => option.label}
                      isOptionEqualToValue={(option, value) => option.value === value.value}
                      renderInput={(params) => {
                        // Determine placeholder based on field type
                        let placeholder = 'Select field type first';
                        if (formData.fieldType) {
                          const selectedFieldTypeOption = fieldTypeOptions.find(
                            (opt) => opt.value === formData.fieldType
                          );
                          const fieldTypeLabel = selectedFieldTypeOption?.label?.toLowerCase() || '';
                          const fieldTypeValue = formData.fieldType.toLowerCase();
                          const isLookupFieldType =
                            fieldTypeLabel.includes('lookup') || fieldTypeValue.includes('lookup');

                          if (isLookupFieldType) {
                            placeholder = fieldLoading ? 'Loading...' : 'Select field';
                          } else {
                            placeholder = 'No values available for this field type';
                          }
                        }

                        return (
                          <TextField
                            {...params}
                            placeholder={placeholder}
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
                        );
                      }}
                    />
                  </div>
                </Grid>
              </Grid>
            )}
          </Box>
        )}

        {/* Variant Values Tab */}
        {activeTab === 1 && (
          <Box sx={{pt: 1, px: 1, pb: 1}}>
            {/* Header with count and Add button */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                pb: 1.5
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
                Number of entries: {variantValues.length}
              </Typography>

              {/* Add Value Button */}
              <Button
                startIcon={<AddIcon />}
                variant="contained"
                onClick={handleAddVariantValue}
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

            {/* Table with fixed header and scrollable body */}
            <Box sx={{display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden'}}>
              <Table sx={{tableLayout: 'fixed', width: '100%'}}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        fontSize: '14px',
                        color: '#323334',
                        borderBottom: '1px solid #CBCCCD',
                        fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                        backgroundColor: '#FFFFFF',
                        width: '40%',
                        padding: '8px'
                      }}
                    >
                      Value
                      <Box component="span" sx={{color: '#C40000', ml: 0.5}}>
                        *
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        fontSize: '14px',
                        color: '#323334',
                        borderBottom: '1px solid #CBCCCD',
                        fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                        backgroundColor: '#FFFFFF',
                        width: '45%',
                        padding: '8px'
                      }}
                    >
                      Description
                      <Box component="span" sx={{color: '#C40000', ml: 0.5}}>
                        *
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        fontSize: '14px',
                        color: '#323334',
                        borderBottom: '1px solid #CBCCCD',
                        fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                        backgroundColor: '#FFFFFF',
                        width: '15%',
                        padding: '8px'
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
              </Table>

              {/* Scrollable table body */}
              <Box sx={{overflowY: 'auto', flexGrow: 1, maxHeight: 'calc(90vh - 300px)'}}>
                <Table sx={{tableLayout: 'fixed', width: '100%'}}>
                  <TableBody>
                    {/* Empty State */}
                    {variantValues.length === 0 && !isAddingNew ? (
                      <TableRow>
                        <TableCell colSpan={3} sx={{borderBottom: 'none', padding: 0}}>
                          <EmptyState
                            title="No Values Yet"
                            actionText="adding a value"
                            onAction={handleAddVariantValue}
                            iconSize="small"
                          />
                        </TableCell>
                      </TableRow>
                    ) : (
                      <>
                        {/* Add New Row */}
                        {isAddingNew && (
                          <TableRow>
                            <TableCell
                              sx={{
                                borderBottom: '1px solid #CBCCCD',
                                padding: '8px',
                                width: '40%',
                                verticalAlign: 'top'
                              }}
                            >
                              <div>
                                <Box
                                  component="input"
                                  value={newValue}
                                  onChange={handleValueChange}
                                  onBlur={handleValueBlur}
                                  placeholder="Enter value"
                                  sx={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    fontSize: '14px',
                                    border: valueError ? '1px solid #C40000' : '1px solid #CBCCCD',
                                    borderRadius: '4px',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                                    '&:hover': {
                                      borderColor: valueError ? '#C40000' : '#999'
                                    },
                                    '&:focus': {
                                      borderColor: valueError ? '#C40000' : '#0C55B8',
                                      borderWidth: '1px'
                                    }
                                  }}
                                />
                                {valueError && (
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
                                    {valueError}
                                  </Typography>
                                )}
                              </div>
                            </TableCell>
                            <TableCell
                              sx={{
                                borderBottom: '1px solid #CBCCCD',
                                padding: '8px',
                                width: '45%',
                                verticalAlign: 'top'
                              }}
                            >
                              <div>
                                <Box
                                  component="input"
                                  value={newDescription}
                                  onChange={handleDescriptionChange}
                                  onBlur={handleDescriptionBlur}
                                  placeholder="Enter description"
                                  sx={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    fontSize: '14px',
                                    border: descriptionError ? '1px solid #C40000' : '1px solid #CBCCCD',
                                    borderRadius: '4px',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                                    '&:hover': {
                                      borderColor: descriptionError ? '#C40000' : '#999'
                                    },
                                    '&:focus': {
                                      borderColor: descriptionError ? '#C40000' : '#0C55B8',
                                      borderWidth: '1px'
                                    }
                                  }}
                                />
                                {descriptionError && (
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
                                    {descriptionError}
                                  </Typography>
                                )}
                              </div>
                            </TableCell>
                            <TableCell
                              sx={{
                                borderBottom: '1px solid #CBCCCD',
                                padding: '8px',
                                width: '15%',
                                verticalAlign: 'top'
                              }}
                            >
                              <Box sx={{display: 'flex', gap: 0.5}}>
                                <Tooltip title="Save" arrow>
                                  <IconButton size="small" onClick={handleSaveNewVariantValue} sx={{color: '#0C55B8'}}>
                                    <CheckIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Discard" arrow>
                                  <IconButton
                                    size="small"
                                    onClick={handleCancelNewVariantValue}
                                    sx={{color: '#0C55B8'}}
                                  >
                                    <CloseIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </TableCell>
                          </TableRow>
                        )}

                        {/* Existing Values */}
                        {variantValues.map((variantValue) => (
                          <TableRow key={variantValue.id}>
                            {editingId === variantValue.id ? (
                              <>
                                <TableCell
                                  sx={{
                                    borderBottom: '1px solid #CBCCCD',
                                    padding: '8px',
                                    width: '40%',
                                    verticalAlign: 'top'
                                  }}
                                >
                                  <div>
                                    <Box
                                      component="input"
                                      value={editValue}
                                      onChange={handleEditValueChange}
                                      onBlur={handleEditValueBlur}
                                      placeholder="Enter value"
                                      sx={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        fontSize: '14px',
                                        border: editValueError ? '1px solid #C40000' : '1px solid #CBCCCD',
                                        borderRadius: '4px',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                        fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                                        '&:hover': {
                                          borderColor: editValueError ? '#C40000' : '#999'
                                        },
                                        '&:focus': {
                                          borderColor: editValueError ? '#C40000' : '#0C55B8',
                                          borderWidth: '1px'
                                        }
                                      }}
                                    />
                                    {editValueError && (
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
                                        {editValueError}
                                      </Typography>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell
                                  sx={{
                                    borderBottom: '1px solid #CBCCCD',
                                    padding: '8px',
                                    width: '45%',
                                    verticalAlign: 'top'
                                  }}
                                >
                                  <div>
                                    <Box
                                      component="input"
                                      value={editDescription}
                                      onChange={handleEditDescriptionChange}
                                      onBlur={handleEditDescriptionBlur}
                                      placeholder="Enter description"
                                      sx={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        fontSize: '14px',
                                        border: editDescriptionError ? '1px solid #C40000' : '1px solid #CBCCCD',
                                        borderRadius: '4px',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                        fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                                        '&:hover': {
                                          borderColor: editDescriptionError ? '#C40000' : '#999'
                                        },
                                        '&:focus': {
                                          borderColor: editDescriptionError ? '#C40000' : '#0C55B8',
                                          borderWidth: '1px'
                                        }
                                      }}
                                    />
                                    {editDescriptionError && (
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
                                        {editDescriptionError}
                                      </Typography>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell
                                  sx={{
                                    borderBottom: '1px solid #CBCCCD',
                                    padding: '8px',
                                    width: '15%',
                                    verticalAlign: 'top'
                                  }}
                                >
                                  <Box sx={{display: 'flex', gap: 0.5}}>
                                    <Tooltip title="Save" arrow>
                                      <IconButton
                                        size="small"
                                        onClick={handleSaveEditVariantValue}
                                        sx={{color: '#0C55B8'}}
                                      >
                                        <CheckIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Discard" arrow>
                                      <IconButton
                                        size="small"
                                        onClick={handleCancelEditVariantValue}
                                        sx={{color: '#0C55B8'}}
                                      >
                                        <CloseIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </Box>
                                </TableCell>
                              </>
                            ) : (
                              <>
                                <TableCell sx={{borderBottom: '1px solid #CBCCCD', padding: '8px', width: '40%'}}>
                                  <Box
                                    component="input"
                                    value={variantValue.value}
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
                                      cursor: 'not-allowed'
                                    }}
                                  />
                                </TableCell>
                                <TableCell sx={{borderBottom: '1px solid #CBCCCD', padding: '8px', width: '45%'}}>
                                  <Box
                                    component="input"
                                    value={variantValue.description}
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
                                      cursor: 'not-allowed'
                                    }}
                                  />
                                </TableCell>
                                <TableCell sx={{borderBottom: '1px solid #CBCCCD', padding: '8px', width: '15%'}}>
                                  <Box sx={{display: 'flex', gap: 1}}>
                                    <Tooltip title="Edit" arrow>
                                      <IconButton
                                        size="small"
                                        sx={{color: '#0C55B8'}}
                                        onClick={() => {
                                          handleEditVariantValue(variantValue);
                                        }}
                                      >
                                        <EditOutlinedIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete" arrow>
                                      <IconButton
                                        size="small"
                                        onClick={() => {
                                          handleDeleteVariantValue(variantValue.id);
                                        }}
                                        sx={{color: '#0C55B8'}}
                                      >
                                        <DeleteOutlineIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </Box>
                                </TableCell>
                              </>
                            )}
                          </TableRow>
                        ))}
                      </>
                    )}
                  </TableBody>
                </Table>
              </Box>
            </Box>
          </Box>
        )}

        {/* Notes Tab */}
        {activeTab === 2 && (
          <Box sx={{pt: 1, px: 1, pb: 1}}>
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
              Please use this space to add notes/describe the variant.
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

export default VariantDialog;
