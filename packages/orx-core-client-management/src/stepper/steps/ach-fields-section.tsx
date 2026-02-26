import React from 'react';
import {Box, Grid} from '@mui/material';
import type {Control, FieldErrors} from 'react-hook-form';

import type {AddClientCombinedFormData} from '../schemas';
import {FormSelectField} from '../../components/form-select-field';
import {FormTextField} from '../../components/form-text-field';
import {BANK_ACCOUNT_TYPE_OPTIONS} from '../../data/lookup';

interface AchFieldsSectionProps {
  control: Control<AddClientCombinedFormData>;
  errors: FieldErrors<AddClientCombinedFormData>;
  namePrefix?: string;
}

export const AchFieldsSection: React.FC<AchFieldsSectionProps> = ({control, errors, namePrefix = ''}) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
  const getFieldName = (field: string): any => (namePrefix ? `${namePrefix}.${field}` : field);
  const getFieldError = (field: string) => {
    if (!namePrefix) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
      return (errors as any)[field];
    }
    const parts = namePrefix.split('.');
    let errorObj: any = errors;
    // eslint-disable-next-line no-restricted-syntax
    for (const part of parts) {
      if (part.includes('[') && part.includes(']')) {
        const splitResult = part.split('[');
        const arrayName = splitResult[0];
        const indexStr = splitResult[1];
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (indexStr && arrayName && errorObj?.[arrayName]) {
          // eslint-disable-next-line no-restricted-globals
          const index = parseInt(indexStr.replace(']', ''), 10);
          // eslint-disable-next-line no-restricted-globals, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          if (!isNaN(index)) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            errorObj = errorObj[arrayName][index];
          }
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        errorObj = errorObj?.[part];
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return errorObj?.[field];
  };

  return (
    <>
      <Box
        sx={{
          borderTop: '1px solid #CBCCCD',
          mb: 3
        }}
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <FormSelectField
            /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
            name={getFieldName('bankAccountType')}
            control={control}
            label="Bank Account Type"
            options={BANK_ACCOUNT_TYPE_OPTIONS}
            placeholder="Select account type"
            /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
            error={getFieldError('bankAccountType')}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormTextField
            /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
            name={getFieldName('routingNumber')}
            control={control}
            label="Routing Number"
            placeholder="Enter routing number"
            /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
            error={getFieldError('routingNumber')}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormTextField
            /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
            name={getFieldName('accountNumber')}
            control={control}
            label="Account Number"
            placeholder="Enter account number"
            /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
            error={getFieldError('accountNumber')}
          />
        </Grid>
      </Grid>
    </>
  );
};
