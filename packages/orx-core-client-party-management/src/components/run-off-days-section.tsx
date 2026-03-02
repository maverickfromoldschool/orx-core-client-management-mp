/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import React from 'react';
import {Box, Button, Grid, IconButton, Typography} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import type {Control, FieldErrors, UseFieldArrayAppend, UseFieldArrayRemove, FieldArrayWithId} from 'react-hook-form';

import type {AddClientCombinedFormData} from '../stepper/schemas';

import {FormTextField} from './form-text-field';

interface RunOffDaysSectionProps {
  control: Control<AddClientCombinedFormData>;
  errors: FieldErrors<AddClientCombinedFormData>;
  fields: FieldArrayWithId<AddClientCombinedFormData, 'clientDetails.runOffDaysByClaimType'>[];
  append: UseFieldArrayAppend<AddClientCombinedFormData, 'clientDetails.runOffDaysByClaimType'>;
  remove: UseFieldArrayRemove;
  readOnly?: boolean;
}

export const RunOffDaysSection: React.FC<RunOffDaysSectionProps> = ({
  control,
  errors,
  fields,
  append,
  remove,
  readOnly = false
}) => {
  const handleAddRunOffDays = () => {
    append({claimType: '', runOffDays: '0'});
  };

  return (
    <div>
      <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
        <Typography variant="subtitle1">Run Off Days by Claim Type</Typography>
        {!readOnly && (
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddRunOffDays}
            size="small"
            sx={{textTransform: 'none'}}
          >
            Add Claim Type
          </Button>
        )}
      </Box>

      {fields.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{fontStyle: 'italic', mb: 2}}>
          No run off days by claim type added yet.
        </Typography>
      )}

      {fields.map((field, index) => (
        <Box
          key={field.id}
          sx={{
            mb: 2,
            p: 2,
            border: '1px solid #E0E0E0',
            borderRadius: 1,
            backgroundColor: '#FAFAFA',
            position: 'relative'
          }}
        >
          {!readOnly && (
            <IconButton
              onClick={() => remove(index)}
              color="error"
              aria-label="Delete run off days entry"
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                padding: '4px'
              }}
            >
              <DeleteIcon />
            </IconButton>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormTextField
                name={`clientDetails.runOffDaysByClaimType.${index}.claimType`}
                control={control}
                label="Claim Type"
                required
                placeholder="Enter claim type"
                error={errors.clientDetails?.runOffDaysByClaimType?.[index]?.claimType}
                disabled={readOnly}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormTextField
                name={`clientDetails.runOffDaysByClaimType.${index}.runOffDays`}
                control={control}
                label="Run Off Days"
                required
                placeholder="Enter run off days"
                error={errors.clientDetails?.runOffDaysByClaimType?.[index]?.runOffDays}
                disabled={readOnly}
              />
            </Grid>
          </Grid>
        </Box>
      ))}
    </div>
  );
};
