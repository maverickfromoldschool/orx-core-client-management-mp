/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import React from 'react';
import {Box, Button, Grid, IconButton, Typography} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import type {Control, FieldErrors, UseFieldArrayAppend, UseFieldArrayRemove, FieldArrayWithId} from 'react-hook-form';

import type {AddClientCombinedFormData} from '../stepper/schemas';

import {FormTextField} from './form-text-field';

interface ProductOverrideSectionProps {
  control: Control<AddClientCombinedFormData>;
  errors: FieldErrors<AddClientCombinedFormData>;
  fields: FieldArrayWithId<AddClientCombinedFormData, 'clientDetails.productOverrides'>[];
  append: UseFieldArrayAppend<AddClientCombinedFormData, 'clientDetails.productOverrides'>;
  remove: UseFieldArrayRemove;
  readOnly?: boolean;
}

export const ProductOverrideSection: React.FC<ProductOverrideSectionProps> = ({
  control,
  errors,
  fields,
  append,
  remove,
  readOnly = false
}) => {
  const handleAddOverride = () => {
    append({productCode: '', productDescription: ''});
  };

  return (
    <div>
      <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
        <Typography variant="subtitle1">Override Product Description Option</Typography>
        {!readOnly && (
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddOverride}
            size="small"
            sx={{textTransform: 'none'}}
          >
            Add Override
          </Button>
        )}
      </Box>

      {fields.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{fontStyle: 'italic', mb: 2}}>
          No product overrides added yet.
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
              aria-label="Delete product override"
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
                name={`clientDetails.productOverrides.${index}.productCode`}
                control={control}
                label="Product Code"
                required
                placeholder="Enter product code"
                error={errors.clientDetails?.productOverrides?.[index]?.productCode}
                disabled={readOnly}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormTextField
                name={`clientDetails.productOverrides.${index}.productDescription`}
                control={control}
                label="Product Description"
                required
                placeholder="Enter product description"
                error={errors.clientDetails?.productOverrides?.[index]?.productDescription}
                disabled={readOnly}
              />
            </Grid>
          </Grid>
        </Box>
      ))}
    </div>
  );
};
