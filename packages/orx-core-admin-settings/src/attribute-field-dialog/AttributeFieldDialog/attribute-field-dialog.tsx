import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  Switch,
  Chip,
  IconButton,
  Tabs,
  Tab,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Autocomplete
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CheckIcon from '@mui/icons-material/Check';
import {useNotification} from '@optum-rx-core/orx-core-notification';

import type {AttributeData, AttributeValue, AttributeEntity} from '../../components/attribute-types';
import {AttributeHelpers} from '../../components/attribute-types';
import {EmptyState} from '../../components/empty-state';

import {AttributeFieldDialogProps} from './attribute-field-dialog.types';

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
      id={`attribute-tabpanel-${index}`}
      aria-labelledby={`attribute-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{py: 3}}>{children}</Box>}
    </div>
  );
}

export function AttributeFieldDialog(props: AttributeFieldDialogProps) {
  const {open, onClose, onSave} = props;
  const {showInfo} = useNotification();

  const [tabValue, setTabValue] = React.useState(0);

  // Form state
  const [attributeField, setAttributeField] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [dataType, setDataType] = React.useState('');
  const [unitOfMeasure, setUnitOfMeasure] = React.useState('');
  const [systemDefinedLookup, setSystemDefinedLookup] = React.useState<'Y' | 'N'>('N');
  const [predefinedSw, setPredefinedSw] = React.useState<'Y' | 'N'>('N');
  const [required, setRequired] = React.useState<'Y' | 'N'>('N');
  const [fieldType, setFieldType] = React.useState('');
  const [field, setField] = React.useState('');
  const [attributeEntity, setAttributeEntity] = React.useState<AttributeEntity[]>([]);
  const [attributeValues, setAttributeValues] = React.useState<AttributeValue[]>([]);
  const [notes, setNotes] = React.useState('');

  // State for adding/editing values
  const [isAddingValue, setIsAddingValue] = React.useState(false);
  const [editingValueId, setEditingValueId] = React.useState<string | null>(null);
  const [newValue, setNewValue] = React.useState('');
  const [newValueDescription, setNewValueDescription] = React.useState('');

  // State for entity input
  const [entityInput, setEntityInput] = React.useState('');

  // Error states
  const [attributeFieldError, setAttributeFieldError] = React.useState('');
  const [descriptionError, setDescriptionError] = React.useState('');
  const [dataTypeError, setDataTypeError] = React.useState('');
  const [entitiesError, setEntitiesError] = React.useState('');

  // Initialize form when attribute prop changes
  React.useEffect(() => {
    if (props.attribute) {
      setAttributeField(props.attribute.attribute || '');
      setDescription(props.attribute.description || '');
      setDataType(props.attribute.dataType || '');
      setUnitOfMeasure(props.attribute.unitOfMeasure || '');
      setSystemDefinedLookup(props.attribute.systemDefinedLookup || 'N');
      setPredefinedSw(props.attribute.predefinedSw || 'N');
      setRequired(props.attribute.required || 'N');
      setFieldType(props.attribute.predefinedFieldType || '');
      setField(props.attribute.predefinedField || '');
      setAttributeEntity(props.attribute.attributeEntity || []);
      setAttributeValues(props.attribute.attributeValues || []);
      setNotes(props.attribute.notes || '');
    } else {
      // Reset form for new attribute
      setAttributeField('');
      setDescription('');
      setDataType('');
      setUnitOfMeasure('');
      setSystemDefinedLookup('N');
      setPredefinedSw('N');
      setRequired('N');
      setFieldType('');
      setField('');
      setAttributeEntity([]);
      setAttributeValues([]);
      setNotes('');
    }
    setTabValue(0);
    // Reset editing states when dialog opens/closes
    setIsAddingValue(false);
    setEditingValueId(null);
    setNewValue('');
    setNewValueDescription('');
    // Reset error states
    setAttributeFieldError('');
    setDescriptionError('');
    setDataTypeError('');
    setEntitiesError('');
  }, [props.attribute, open]);

  const handleTabChange = (_event: React.SyntheticEvent, newTabValue: number) => {
    setTabValue(newTabValue);
  };

  const handleSave = () => {
    // Validate required fields
    let hasError = false;

    if (!attributeField.trim()) {
      setAttributeFieldError('Required field');
      hasError = true;
    } else {
      setAttributeFieldError('');
    }

    if (!description.trim()) {
      setDescriptionError('Required field');
      hasError = true;
    } else {
      setDescriptionError('');
    }

    if (!dataType.trim()) {
      setDataTypeError('Required field');
      hasError = true;
    } else {
      setDataTypeError('');
    }

    if (attributeEntity.length === 0) {
      setEntitiesError('At least one entity is required');
      hasError = true;
    } else {
      setEntitiesError('');
    }

    if (hasError) {
      return;
    }

    const updatedAttribute: AttributeData = {
      attribute: attributeField,
      description,
      dataType,
      unitOfMeasure: unitOfMeasure || null,
      systemDefinedLookup,
      predefinedSw,
      required,
      predefinedFieldType: fieldType || null,
      predefinedField: field || null,
      notes: notes || null,
      attributeEntity,
      attributeValues: predefinedSw === 'N' ? [] : attributeValues,
      createdBy: props.attribute?.createdBy || 'System',
      modifiedBy: 'System',
      createdDate: props.attribute?.createdDate,
      modifiedDate: props.attribute?.modifiedDate,
      version: props.attribute?.version
    };
    onSave(updatedAttribute);
  };

  const handleAddEntity = (entityName: string) => {
    if (entityName && !attributeEntity.some((e) => e.entity === entityName)) {
      const newEntity = AttributeHelpers.createEntity(attributeField || 'NewAttribute', entityName, 'System');
      setAttributeEntity([...attributeEntity, newEntity]);
      setEntityInput('');
    }
  };

  const handleRemoveEntity = (entityToRemove: string) => {
    const updatedEntities = attributeEntity.filter((e) => e.entity !== entityToRemove);
    setAttributeEntity(updatedEntities);
    if (updatedEntities.length === 0) {
      setEntitiesError('At least one entity is required');
    }
  };

  const handleAddValue = () => {
    if (newValue) {
      const newAttributeValue = AttributeHelpers.createValue(
        attributeField || 'NewAttribute',
        newValue,
        newValueDescription,
        'System'
      );
      setAttributeValues([...attributeValues, newAttributeValue]);
      setNewValue('');
      setNewValueDescription('');
      setIsAddingValue(false);
    }
  };

  const handleEditValue = (valueId: string) => {
    const valueToEdit = attributeValues.find((v) => v.attributeValue === valueId);
    if (valueToEdit) {
      setNewValue(valueToEdit.attributeValue);
      setNewValueDescription(valueToEdit.description);
      setEditingValueId(valueId);
      setIsAddingValue(true);
    }
  };

  const handleSaveEditedValue = () => {
    if (editingValueId && newValue) {
      setAttributeValues(
        attributeValues.map((v) =>
          v.attributeValue === editingValueId
            ? {
                ...v,
                attributeValue: newValue,
                description: newValueDescription
              }
            : v
        )
      );
      setNewValue('');
      setNewValueDescription('');
      setEditingValueId(null);
      setIsAddingValue(false);
    }
  };

  const handleDeleteValue = (valueId: string) => {
    setAttributeValues(attributeValues.filter((v) => v.attributeValue !== valueId));
  };

  const handleCancelValueEdit = () => {
    setNewValue('');
    setNewValueDescription('');
    setEditingValueId(null);
    setIsAddingValue(false);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          minHeight: '600px'
        }
      }}
    >
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
        {props.attribute ? 'Edit Attribute' : 'Add Attribute'}
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: '#6F7172'
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="attribute dialog tabs"
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
          <Tab label="Attribute Values" disabled={predefinedSw === 'N'} />
          <Tab label="Notes" />
        </Tabs>
      </Box>

      <DialogContent sx={{px: 3}}>
        {/* Tab 1: Main */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
            {/* Row 1: Attribute Field and Description */}
            <Box sx={{display: 'flex', gap: 2}}>
              <Box sx={{flex: 1}}>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5}}>
                  <Typography
                    component="label"
                    sx={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: 'text.primary'
                    }}
                  >
                    Attribute Field
                    <Typography component="span" sx={{color: '#C40000', ml: 0.5}}>
                      *
                    </Typography>
                  </Typography>
                  <Tooltip
                    title="This is a system identifier which cannot be altered once created."
                    arrow
                    placement="right"
                  >
                    <HelpOutlineIcon sx={{fontSize: '16px', color: '#0066F5', cursor: 'pointer'}} />
                  </Tooltip>
                </Box>
                <Box
                  component="input"
                  value={attributeField}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setAttributeField(e.target.value);
                    if (attributeFieldError && e.target.value.trim()) {
                      setAttributeFieldError('');
                    }
                  }}
                  onBlur={() => {
                    if (!attributeField.trim()) {
                      setAttributeFieldError('Required field');
                    }
                  }}
                  disabled={!!props.attribute}
                  placeholder="Enter attribute field"
                  maxLength={30}
                  sx={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '14px',
                    border: attributeFieldError ? '1px solid #C40000' : '1px solid #CBCCCD',
                    borderRadius: '4px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                    '&:hover': {
                      borderColor: attributeFieldError ? '#C40000' : '#999'
                    },
                    '&:focus': {
                      borderColor: attributeFieldError ? '#C40000' : '#0C55B8',
                      borderWidth: '1px'
                    },
                    '&:disabled': {
                      backgroundColor: '#F5F5F5',
                      cursor: 'not-allowed'
                    }
                  }}
                />
                {attributeFieldError ? (
                  <Typography sx={{color: '#C40000', fontSize: '12px', mt: 0.5}}>{attributeFieldError}</Typography>
                ) : (
                  <Typography sx={{fontSize: '12px', color: '#6E7072', mt: 0.5, textAlign: 'right'}}>
                    {attributeField.length}/30
                  </Typography>
                )}
              </Box>
              <Box sx={{flex: 1}}>
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
                  <Tooltip
                    title="The description provides additional details about the attribute."
                    arrow
                    placement="right"
                  >
                    <HelpOutlineIcon sx={{fontSize: '16px', color: '#0066F5', cursor: 'pointer'}} />
                  </Tooltip>
                </Box>
                <Box
                  component="input"
                  value={description}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setDescription(e.target.value);
                    if (descriptionError && e.target.value.trim()) {
                      setDescriptionError('');
                    }
                  }}
                  onBlur={() => {
                    if (!description.trim()) {
                      setDescriptionError('Required field');
                    }
                  }}
                  placeholder="Enter description"
                  maxLength={50}
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
                {descriptionError ? (
                  <Typography sx={{color: '#C40000', fontSize: '12px', mt: 0.5}}>{descriptionError}</Typography>
                ) : (
                  <Typography sx={{fontSize: '12px', color: '#6E7072', mt: 0.5, textAlign: 'right'}}>
                    {description.length}/50
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Row 2: Data Type and Unit of Measure */}
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
                  Data Type
                  <Typography component="span" sx={{color: '#C40000', ml: 0.5}}>
                    *
                  </Typography>
                </Typography>
                <Box
                  component="select"
                  value={dataType}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setDataType(e.target.value);
                    if (dataTypeError && e.target.value.trim()) {
                      setDataTypeError('');
                    }
                  }}
                  onBlur={() => {
                    if (!dataType.trim()) {
                      setDataTypeError('Required field');
                    }
                  }}
                  disabled={props.lookupsLoading || attributeValues.length > 0}
                  sx={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '14px',
                    border: dataTypeError ? '1px solid #C40000' : '1px solid #CBCCCD',
                    borderRadius: '4px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                    backgroundColor: '#FFFFFF',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: dataTypeError ? '#C40000' : '#999'
                    },
                    '&:focus': {
                      borderColor: dataTypeError ? '#C40000' : '#0C55B8',
                      borderWidth: '1px'
                    },
                    '&:disabled': {
                      backgroundColor: '#F5F5F5',
                      cursor: 'not-allowed'
                    }
                  }}
                >
                  <option value="">{props.lookupsLoading ? 'Loading...' : 'Select data type'}</option>
                  {props.dataTypeOptions?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label} ({option.value})
                    </option>
                  ))}
                </Box>
                {dataTypeError && (
                  <Typography sx={{color: '#C40000', fontSize: '12px', mt: 0.5}}>{dataTypeError}</Typography>
                )}
              </Box>
            </Box>

            {/* Row 3: Toggles */}
            <Box sx={{display: 'flex', gap: 3, alignItems: 'center'}}>
              <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5}}>
                <Typography sx={{fontSize: '16px', fontWeight: 700, color: '#323334'}}>System Defined</Typography>
                <Switch
                  checked={AttributeHelpers.toBoolean(systemDefinedLookup)}
                  onChange={(e) => {
                    setSystemDefinedLookup(AttributeHelpers.fromBoolean(e.target.checked));
                  }}
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
                <Typography sx={{fontSize: '14px', fontWeight: 400, color: '#323334', minWidth: '30px'}}>
                  {AttributeHelpers.toBoolean(systemDefinedLookup) ? 'Yes' : 'No'}
                </Typography>
              </Box>
              <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5}}>
                <Typography sx={{fontSize: '16px', fontWeight: 700, color: '#323334'}}>Predefined List</Typography>
                <Switch
                  checked={AttributeHelpers.toBoolean(predefinedSw)}
                  onChange={(e) => {
                    setPredefinedSw(AttributeHelpers.fromBoolean(e.target.checked));
                  }}
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
                <Typography sx={{fontSize: '14px', fontWeight: 400, color: '#323334', minWidth: '30px'}}>
                  {AttributeHelpers.toBoolean(predefinedSw) ? 'Yes' : 'No'}
                </Typography>
              </Box>
              <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5}}>
                <Typography sx={{fontSize: '16px', fontWeight: 700, color: '#323334'}}>Required</Typography>
                <Switch
                  checked={AttributeHelpers.toBoolean(required)}
                  onChange={(e) => {
                    setRequired(AttributeHelpers.fromBoolean(e.target.checked));
                  }}
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
                <Typography sx={{fontSize: '14px', fontWeight: 400, color: '#323334', minWidth: '30px'}}>
                  {AttributeHelpers.toBoolean(required) ? 'Yes' : 'No'}
                </Typography>
              </Box>
            </Box>

            {/* Row 4: Field Type and Field */}
            {AttributeHelpers.toBoolean(predefinedSw) && (
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
                    Field Type
                  </Typography>
                  <Box
                    component="select"
                    value={fieldType}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      setFieldType(e.target.value);
                    }}
                    disabled={props.lookupsLoading}
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
                    <option value="">{props.lookupsLoading ? 'Loading...' : 'Select field type'}</option>
                    {props.fieldTypeOptions?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Box>
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
                    Field
                  </Typography>
                  <Box sx={{position: 'relative'}}>
                    <Autocomplete
                      value={props.fieldOptions?.find((option) => option.value === field) || null}
                      onChange={(_event, selectedValue) => {
                        setField(selectedValue?.value || '');
                      }}
                      options={props.fieldOptions || []}
                      getOptionLabel={(option) => option.label}
                      disabled={props.lookupsLoading}
                      loading={props.lookupsLoading}
                      loadingText="Loading..."
                      noOptionsText="No options available"
                      size="small"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select field"
                          size="small"
                          sx={{
                            '& .MuiInputBase-root': {
                              fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                              fontSize: '14px',
                              paddingRight: '40px',
                              height: '40px'
                            },
                            '& .MuiInputBase-input': {
                              padding: '10px 12px',
                              height: '20px'
                            },
                            '& .MuiOutlinedInput-root': {
                              padding: 0,
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
                              '&.Mui-disabled fieldset': {
                                borderColor: '#CBCCCD'
                              }
                            },
                            '& .MuiAutocomplete-endAdornment': {
                              display: 'none'
                            }
                          }}
                        />
                      )}
                    />
                    <SearchIcon
                      sx={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: '20px',
                        color: '#0C55B8',
                        pointerEvents: 'none',
                        zIndex: 1
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            )}

            {/* Entity Selection */}
            <Box sx={{display: 'block'}}>
              <Typography
                component="label"
                sx={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: 'text.primary',
                  mb: 0.5,
                  display: 'block'
                }}
              >
                Entity(s)
                <Typography component="span" sx={{color: '#C40000', ml: 0.5}}>
                  *
                </Typography>
              </Typography>
              <Box
                component="select"
                value={entityInput}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const entity = e.target.value;
                  if (entity) {
                    handleAddEntity(entity);
                    if (entitiesError) {
                      setEntitiesError('');
                    }
                  }
                }}
                disabled={props.lookupsLoading}
                sx={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: '14px',
                  border: entitiesError ? '1px solid #C40000' : '1px solid #CBCCCD',
                  borderRadius: '4px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: entitiesError ? '#C40000' : '#999'
                  },
                  '&:focus': {
                    borderColor: entitiesError ? '#C40000' : '#0C55B8',
                    borderWidth: '1px'
                  },
                  '&:disabled': {
                    backgroundColor: '#F5F5F5',
                    cursor: 'not-allowed'
                  }
                }}
              >
                <option value="">{props.lookupsLoading ? 'Loading...' : 'Select entity to add'}</option>
                {props.entityOptions?.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    disabled={attributeEntity.some((e) => e.entity === option.value)}
                  >
                    {option.label}
                  </option>
                ))}
              </Box>
              {entitiesError && (
                <Typography sx={{color: '#C40000', fontSize: '12px', mt: 0.5}}>{entitiesError}</Typography>
              )}

              {/* Entity Chips */}
              {attributeEntity.length > 0 && (
                <Box sx={{display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2}}>
                  {attributeEntity.map((entityObj) => (
                    <Chip
                      key={entityObj.entity}
                      label={entityObj.entity}
                      onDelete={() => {
                        handleRemoveEntity(entityObj.entity);
                      }}
                      sx={{
                        backgroundColor: '#E8F0FE',
                        color: '#002677',
                        fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                        '& .MuiChip-deleteIcon': {
                          color: '#002677'
                        }
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        </TabPanel>

        {/* Tab 2: Attribute Values */}
        <TabPanel value={tabValue} index={1}>
          <div>
            {/* Header with count and Add button */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 2
              }}
            >
              <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                <Typography
                  sx={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#323334',
                    fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                  }}
                >
                  Entries
                </Typography>
                <Chip
                  label={attributeValues.length}
                  size="small"
                  sx={{
                    backgroundColor: '#E8F0FE',
                    color: '#002677',
                    fontWeight: 600,
                    height: '22px'
                  }}
                />
              </Box>
              <Button
                startIcon={<AddIcon />}
                onClick={() => {
                  if (!dataType.trim()) {
                    showInfo('Please select a Data Type before adding attribute values', {
                      position: {
                        vertical: 'bottom',
                        horizontal: 'center'
                      }
                    });
                    return;
                  }
                  setIsAddingValue(true);
                }}
                variant="contained"
                size="small"
                sx={{
                  backgroundColor: '#002677',
                  color: '#FFFFFF',
                  borderRadius: '46px',
                  textTransform: 'none',
                  fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                }}
              >
                Add Value
              </Button>
            </Box>

            {/* Values Table */}
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        fontSize: '14px',
                        color: '#323334',
                        fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                        borderBottom: '1px solid #CBCCCD'
                      }}
                    >
                      Value
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        fontSize: '14px',
                        color: '#323334',
                        fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                        borderBottom: '1px solid #CBCCCD'
                      }}
                    >
                      Description
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        fontSize: '14px',
                        color: '#323334',
                        fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                        borderBottom: '1px solid #CBCCCD',
                        width: 100
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attributeValues.length === 0 && !isAddingValue ? (
                    <TableRow>
                      <TableCell colSpan={3} sx={{borderBottom: 'none', padding: 0}}>
                        <EmptyState
                          title="No Values Yet"
                          actionText="adding a value"
                          onAction={() => {
                            setIsAddingValue(true);
                          }}
                          iconSize="small"
                        />
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {attributeValues.map((value) => (
                        <TableRow key={value.attributeValue}>
                          <TableCell
                            sx={{
                              fontSize: '14px',
                              color: '#323334',
                              fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                              borderBottom: '1px solid #CBCCCD'
                            }}
                          >
                            {editingValueId === value.attributeValue ? (
                              <Box
                                component="input"
                                value={newValue}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                  setNewValue(e.target.value);
                                }}
                                placeholder="Enter value"
                                sx={{
                                  width: '100%',
                                  padding: '8px 10px',
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
                            ) : (
                              value.attributeValue
                            )}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: '14px',
                              color: '#323334',
                              fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                              borderBottom: '1px solid #CBCCCD'
                            }}
                          >
                            {editingValueId === value.attributeValue ? (
                              <Box
                                component="input"
                                value={newValueDescription}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                  setNewValueDescription(e.target.value);
                                }}
                                placeholder="Enter description"
                                sx={{
                                  width: '100%',
                                  padding: '8px 10px',
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
                            ) : (
                              value.description
                            )}
                          </TableCell>
                          <TableCell
                            sx={{
                              borderBottom: '1px solid #CBCCCD'
                            }}
                          >
                            {editingValueId === value.attributeValue ? (
                              <Box sx={{display: 'flex', gap: 0.5}}>
                                <Tooltip title="Confirm" arrow>
                                  <IconButton
                                    size="small"
                                    onClick={handleSaveEditedValue}
                                    disabled={!newValue}
                                    sx={{
                                      color: '#0C55B8',
                                      '&:disabled': {
                                        color: '#CBCCCD'
                                      }
                                    }}
                                  >
                                    <CheckIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Cancel" arrow>
                                  <IconButton
                                    size="small"
                                    onClick={handleCancelValueEdit}
                                    sx={{
                                      color: '#C41E3A'
                                    }}
                                  >
                                    <CloseIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            ) : (
                              <Box sx={{display: 'flex', gap: 0.5}}>
                                <Tooltip title="Edit" arrow>
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      handleEditValue(value.attributeValue);
                                    }}
                                    sx={{
                                      color: '#0C55B8'
                                    }}
                                  >
                                    <EditOutlinedIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete" arrow>
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      handleDeleteValue(value.attributeValue);
                                    }}
                                    sx={{
                                      color: '#0C55B8'
                                    }}
                                  >
                                    <DeleteOutlineIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                      {/* Add New Value Row */}
                      {isAddingValue && !editingValueId && (
                        <TableRow>
                          <TableCell
                            sx={{
                              borderBottom: '1px solid #CBCCCD',
                              py: 1
                            }}
                          >
                            <Box
                              component="input"
                              value={newValue}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setNewValue(e.target.value);
                              }}
                              placeholder="Enter value"
                              autoFocus
                              sx={{
                                width: '100%',
                                padding: '8px 10px',
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
                          </TableCell>
                          <TableCell
                            sx={{
                              borderBottom: '1px solid #CBCCCD',
                              py: 1
                            }}
                          >
                            <Box
                              component="input"
                              value={newValueDescription}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setNewValueDescription(e.target.value);
                              }}
                              placeholder="Enter description"
                              sx={{
                                width: '100%',
                                padding: '8px 10px',
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
                          </TableCell>
                          <TableCell
                            sx={{
                              borderBottom: '1px solid #CBCCCD',
                              py: 1
                            }}
                          >
                            <Box sx={{display: 'flex', gap: 0.5}}>
                              <Tooltip title="Confirm" arrow>
                                <IconButton
                                  size="small"
                                  onClick={handleAddValue}
                                  disabled={!newValue}
                                  sx={{
                                    color: '#0C55B8',
                                    '&:disabled': {
                                      color: '#CBCCCD'
                                    }
                                  }}
                                >
                                  <CheckIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Cancel" arrow>
                                <IconButton
                                  size="small"
                                  onClick={handleCancelValueEdit}
                                  sx={{
                                    color: '#C41E3A'
                                  }}
                                >
                                  <CloseIcon fontSize="small" />
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
            </TableContainer>
          </div>
        </TabPanel>

        {/* Tab 3: Notes */}
        <TabPanel value={tabValue} index={2}>
          <div>
            <TextField
              label="Notes"
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
              }}
              multiline
              rows={10}
              fullWidth
              placeholder="Please provide a detailed description of the attribute."
              helperText={`${notes.length} / 1000`}
              inputProps={{maxLength: 1000}}
              sx={{
                '& .MuiInputLabel-root': {
                  fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                },
                '& .MuiInputBase-input': {
                  fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                },
                '& .MuiFormHelperText-root': {
                  textAlign: 'right'
                }
              }}
            />
          </div>
        </TabPanel>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: '1px solid #CBCCCD'
        }}
      >
        <Button
          onClick={onClose}
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
          onClick={handleSave}
          variant="contained"
          disabled={!attributeField.trim() || !description.trim() || !dataType.trim() || attributeEntity.length === 0}
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
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AttributeFieldDialog;
