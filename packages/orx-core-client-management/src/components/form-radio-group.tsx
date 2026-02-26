import React from 'react';
import {Box, Typography, RadioGroup, FormControlLabel, Radio} from '@mui/material';
import {Controller} from 'react-hook-form';
import type {Control, FieldError, FieldValues, Path} from 'react-hook-form';

interface RadioOption {
  value: string;
  label: string;
}

interface FormRadioGroupProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  options: RadioOption[];
  row?: boolean;
  error?: FieldError;
  disabled?: boolean;
}

export const FormRadioGroup = <T extends FieldValues>({
  name,
  control,
  label,
  options,
  row = true,
  error,
  disabled = false
}: FormRadioGroupProps<T>) => {
  return (
    <div>
      <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
        <Typography
          component="label"
          sx={{
            fontSize: '16px',
            fontWeight: 700,
            color: 'text.primary',
            lineHeight: 1.4
          }}
        >
          {label}
        </Typography>
        <Controller
          name={name}
          control={control}
          render={({field}) => (
            <RadioGroup
              {...field}
              row={row}
              sx={{
                gap: 2
              }}
            >
              {options.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  disabled={disabled}
                  control={
                    <Radio
                      size="small"
                      sx={{
                        color: error ? '#C40000' : 'grey.400',
                        '&.Mui-checked': {
                          color: '#002677'
                        },
                        '&:hover': {
                          backgroundColor: 'rgba(0, 38, 119, 0.04)'
                        },
                        padding: '4px'
                      }}
                    />
                  }
                  label={
                    <Typography
                      sx={{
                        fontSize: '16px',
                        fontWeight: 400,
                        color: 'text.primary'
                      }}
                    >
                      {option.label}
                    </Typography>
                  }
                  sx={{
                    marginLeft: 0,
                    marginRight: 0,
                    '& .MuiFormControlLabel-label': {
                      marginLeft: '4px'
                    }
                  }}
                />
              ))}
            </RadioGroup>
          )}
        />
      </Box>
      {error && (
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
          {error.message}
        </Typography>
      )}
    </div>
  );
};

export default FormRadioGroup;
