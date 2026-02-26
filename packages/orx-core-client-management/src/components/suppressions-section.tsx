import React, {useEffect} from 'react';
import {Control, FieldErrors, useFieldArray, UseFormSetValue, useWatch} from 'react-hook-form';
import {Box, Typography, Grid, Divider, IconButton, Button, Switch} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import {AddClientCombinedFormData} from '../stepper/schemas';
import {defaultOperationalUnitSuppressionEntryData} from '../stepper/schemas/default-values';
import {SUPPRESSION_TYPE_OPTIONS} from '../data/lookup';

import {FormSelectField} from './form-select-field';
import {FormDateField} from './form-date-field';

interface SuppressionsSectionProps {
  control: Control<AddClientCombinedFormData>;
  errors: FieldErrors<AddClientCombinedFormData>;
  operationalUnitIndex: number;
  setValue: UseFormSetValue<AddClientCombinedFormData>;
}

const SuppressionsSection: React.FC<SuppressionsSectionProps> = ({control, errors, operationalUnitIndex, setValue}) => {
  // Watch addSuppressions value to conditionally show suppression fields (Requirement 6.2)
  const addSuppressions = useWatch({
    control,
    name: `operationalUnits.${operationalUnitIndex}.addSuppressions`
  });

  // Nested useFieldArray for suppressions within each operational unit (Task 6.3)
  const {
    fields: suppressionFields,
    append: appendSuppression,
    remove: removeSuppression
  } = useFieldArray({
    control,
    name: `operationalUnits.${operationalUnitIndex}.suppressions`
  });

  // Initialize with one entry when Yes is selected (Task 6.3)
  useEffect(() => {
    if (addSuppressions === true && suppressionFields.length === 0) {
      appendSuppression(defaultOperationalUnitSuppressionEntryData);
    }
  }, [addSuppressions, suppressionFields.length, appendSuppression]);

  // Handle toggle change
  const handleToggleChange = (checked: boolean) => {
    setValue(`operationalUnits.${operationalUnitIndex}.addSuppressions`, checked);

    // Clear suppressions when toggled off
    if (!checked && suppressionFields.length > 0) {
      for (let i = suppressionFields.length - 1; i >= 0; i -= 1) {
        removeSuppression(i);
      }
    }
  };

  // Handle add another suppression (Task 6.4)
  const handleAddSuppression = () => {
    appendSuppression(defaultOperationalUnitSuppressionEntryData);
  };

  // Handle delete suppression (Task 6.5)
  const handleDeleteSuppression = (suppressionIndex: number) => {
    if (suppressionFields.length > 1) {
      removeSuppression(suppressionIndex);
    }
  };

  return (
    <Box sx={{mt: 3}}>
      {/* Horizontal divider before suppressions section */}
      <Divider sx={{mb: 3, borderColor: '#AAAAAA'}} />

      {/* Add Suppressions Toggle Switch (matching Contract Details) */}
      <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
        <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5}}>
          <Typography
            sx={{
              fontSize: '16px',
              fontWeight: 700,
              color: '#323334'
            }}
          >
            Add Suppressions
          </Typography>
          <Switch
            checked={addSuppressions === true}
            onChange={(e) => {
              handleToggleChange(e.target.checked);
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
                      backgroundSize: '12px 12px'
                    }
                  }
                }
              },
              '& .MuiSwitch-thumb': {
                boxSizing: 'border-box',
                width: 20,
                height: 20,
                backgroundColor: '#0C55B8',
                boxShadow: 'none',
                position: 'relative'
              },
              '& .MuiSwitch-track': {
                borderRadius: '41px',
                backgroundColor: '#FFFFFF',
                border: '2px solid #0C55B8',
                opacity: 1
              }
            }}
          />
          <Typography
            sx={{
              fontSize: '16px',
              fontWeight: 400,
              color: '#4B4D4F'
            }}
          >
            Yes
          </Typography>
        </Box>

        {/* Suppression Entry Fields - shown only when toggle is on (Task 6.2, 6.3) */}
        {addSuppressions === true && (
          <Box sx={{mt: 2}}>
            {suppressionFields.map((suppressionField, suppressionIndex) => (
              <Box key={suppressionField.id}>
                {/* Horizontal divider between suppression entries (Task 6.6) */}
                {suppressionIndex > 0 && <Divider sx={{my: 3, borderColor: '#AAAAAA'}} />}

                {/* Suppression Entry Row (Task 6.2) */}
                <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2}}>
                  {/* Delete button for suppressions (except first) (Task 6.5) */}
                  {suppressionFields.length > 1 && suppressionIndex > 0 && (
                    <Box sx={{display: 'flex', width: '100%', justifyContent: 'flex-end'}}>
                      <IconButton
                        onClick={() => {
                          handleDeleteSuppression(suppressionIndex);
                        }}
                        aria-label={`Delete suppression ${suppressionIndex + 1}`}
                        sx={{
                          padding: 0,
                          color: '#0C55B8',
                          '&:hover': {
                            backgroundColor: 'transparent',
                            color: '#002677'
                          }
                        }}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Box>
                  )}

                  <Box sx={{flex: 1, width: '100%'}}>
                    <Grid container spacing={3} alignItems="center">
                      {/* Suppression Type dropdown (Requirement 6.3) */}
                      <Grid item xs={12} md={4}>
                        <FormSelectField
                          name={`operationalUnits.${operationalUnitIndex}.suppressions.${suppressionIndex}.suppressionType`}
                          control={control}
                          label="Select Suppression Type"
                          options={SUPPRESSION_TYPE_OPTIONS}
                          placeholder="Select suppression type"
                          error={
                            errors.operationalUnits?.[operationalUnitIndex]?.suppressions?.[suppressionIndex]
                              ?.suppressionType
                          }
                        />
                      </Grid>
                      {/* Suppression Start Date picker (Requirement 6.4) */}
                      <Grid item xs={12} md={4}>
                        <FormDateField
                          name={`operationalUnits.${operationalUnitIndex}.suppressions.${suppressionIndex}.startDate`}
                          control={control}
                          label="Suppression Start Date"
                          placeholder="MM-DD-YYYY"
                          error={
                            errors.operationalUnits?.[operationalUnitIndex]?.suppressions?.[suppressionIndex]?.startDate
                          }
                        />
                      </Grid>
                      {/* Suppression End Date picker (Requirement 6.5) */}
                      <Grid item xs={12} md={4}>
                        <FormDateField
                          name={`operationalUnits.${operationalUnitIndex}.suppressions.${suppressionIndex}.endDate`}
                          control={control}
                          label="Suppression End Date"
                          placeholder="MM-DD-YYYY"
                          error={
                            errors.operationalUnits?.[operationalUnitIndex]?.suppressions?.[suppressionIndex]?.endDate
                          }
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Box>
            ))}

            {/* Add another suppression button (Task 6.4) */}
            <Box sx={{mt: 3}}>
              <Button
                variant="text"
                startIcon={<AddIcon />}
                onClick={handleAddSuppression}
                sx={{
                  color: '#0C55B8',
                  fontSize: '16px',
                  fontWeight: 700,
                  textTransform: 'none',
                  padding: '8px 16px',
                  '&:hover': {
                    backgroundColor: 'rgba(12, 85, 184, 0.08)'
                  }
                }}
              >
                Add another suppression
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SuppressionsSection;
