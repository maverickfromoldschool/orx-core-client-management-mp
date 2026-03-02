import React from 'react';
import {Box, IconButton, Divider} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import type {Control, FieldErrors, FieldError} from 'react-hook-form';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import {AddClientCombinedFormData} from '../stepper/schemas';
import {SUPPRESSION_TYPE_OPTIONS} from '../data/lookup';

import {FormSelectField} from './form-select-field';
import {FormDateField} from './form-date-field';

interface SuppressionRowProps {
  index: number;
  control: Control<AddClientCombinedFormData>;
  errors: FieldErrors<AddClientCombinedFormData>;
  onRemove: () => void;
  showDelete: boolean;
  showDivider?: boolean;
  namePrefix?: string;
}

const SuppressionRow: React.FC<SuppressionRowProps> = ({
  index,
  control,
  errors,
  onRemove,
  showDelete,
  showDivider = false,
  namePrefix = ''
}) => {
  // Helper to build field name with optional prefix
  const getFieldName = (fieldName: string): any => {
    // For operational units (billingAttributesOverride), use service* prefix
    // For contract details, use suppression* prefix
    let actualFieldName = fieldName;
    if (namePrefix) {
      // Operational units: convert suppressionStartDate -> serviceStartDate
      if (fieldName === 'suppressionStartDate') actualFieldName = 'serviceStartDate';
      if (fieldName === 'suppressionEndDate') actualFieldName = 'serviceEndDate';
    }
    return namePrefix
      ? `${namePrefix}.suppressions.${index}.${actualFieldName}`
      : `contractDetails.billingAttributes.suppressions.${index}.${actualFieldName}`;
  };

  // Get nested errors for suppressions array
  const getFieldError = (fieldName: string): FieldError => {
    // For operational units (billingAttributesOverride), use service* prefix
    // For contract details, use suppression* prefix
    let actualFieldName = fieldName;
    if (namePrefix) {
      if (fieldName === 'suppressionStartDate') actualFieldName = 'serviceStartDate';
      if (fieldName === 'suppressionEndDate') actualFieldName = 'serviceEndDate';
    }

    if (namePrefix) {
      // For operational units: operationalUnits[0].billingAttributesOverride.suppressions[0].suppressionType
      const parts = namePrefix.split('.');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let errorObj: any = errors;
      // eslint-disable-next-line no-restricted-syntax, @typescript-eslint/no-unsafe-member-access
      for (const part of parts) {
        if (part.includes('[') && part.includes(']')) {
          const match = /(\w+)\[(\d+)\]/.exec(part);
          if (match?.[1]) {
            const key = match[1];
            const idx = match[2] ? parseInt(match[2], 10) : 0;
            errorObj = errorObj?.[key]?.[idx]; // eslint-disable-line @typescript-eslint/no-unsafe-member-access
          }
        } else {
          errorObj = errorObj?.[part]; // eslint-disable-line @typescript-eslint/no-unsafe-member-access
        }
      }
      return errorObj?.suppressions?.[index]?.[actualFieldName]; // eslint-disable-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    }
    // For contract details: contractDetails.suppressions[0].suppressionType
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (errors.contractDetails?.billingAttributes?.suppressions as any)?.[index]?.[actualFieldName] as FieldError; // eslint-disable-line @typescript-eslint/no-unsafe-member-access
  };

  return (
    <>
      {/* Horizontal divider between rows (Requirements 5.11) */}
      {showDivider && (
        <Divider
          sx={{
            borderColor: '#CBCCCD',
            my: 3
          }}
        />
      )}

      {/* Suppression Row: Type, Start Date, End Date with Delete Button */}
      <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2}}>
        {/* Delete Button Box */}
        {showDelete && (
          <Box sx={{display: 'flex', width: '100%', justifyContent: 'flex-end'}}>
            <IconButton
              onClick={onRemove}
              aria-label="Delete suppression"
              disableRipple
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

        {/* Form Fields Box */}
        <Box sx={{flex: 1, width: '100%'}}>
          <Grid container spacing={3} alignItems="center">
            <Grid xs={12} md={4}>
              <FormSelectField
                name={getFieldName('suppressionType')}
                control={control}
                label="Select Suppression Type"
                options={SUPPRESSION_TYPE_OPTIONS}
                placeholder="Select suppression type"
                error={getFieldError('suppressionType')}
              />
            </Grid>
            <Grid xs={12} md={4}>
              <FormDateField
                name={getFieldName('suppressionStartDate')}
                control={control}
                label="Suppression Start Date"
                error={getFieldError('suppressionStartDate')}
              />
            </Grid>
            <Grid xs={12} md={4}>
              <FormDateField
                name={getFieldName('suppressionEndDate')}
                control={control}
                label="Suppression End Date"
                error={getFieldError('suppressionEndDate')}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default SuppressionRow;
