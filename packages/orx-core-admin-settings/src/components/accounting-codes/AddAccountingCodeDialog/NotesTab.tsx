/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from 'react';
import {Controller, Control, FieldErrors} from 'react-hook-form';
import {Box, TextField, Typography} from '@mui/material';

import {AddAccountingCodeFormData} from './AddAccountingCodeDialog.types';

interface NotesTabProps {
  control: Control<AddAccountingCodeFormData>;
  errors: FieldErrors<AddAccountingCodeFormData>;
  watch: (name: keyof AddAccountingCodeFormData) => any;
}

export const NotesTab: React.FC<NotesTabProps> = ({control, errors, watch}) => {
  const notesValue = watch('notes') || '';

  return (
    <Box sx={{py: 3, px: 1}}>
      <Typography variant="body2" color="text.secondary" sx={{mb: 2.5, fontSize: '0.875rem'}}>
        Please describe the behavior of the accounting code in context
      </Typography>

      <Controller
        name="notes"
        control={control}
        defaultValue=""
        render={({field}) => (
          <TextField
            {...field}
            multiline
            rows={8}
            fullWidth
            placeholder="Enter notes here..."
            error={!!errors.notes}
            helperText={errors.notes?.message}
            inputProps={{maxLength: 1000}}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#fff',
                alignItems: 'flex-start',
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

      <Typography variant="caption" sx={{color: 'text.secondary', mt: 1, display: 'block', textAlign: 'right'}}>
        {notesValue.length} / 1000
      </Typography>
    </Box>
  );
};
