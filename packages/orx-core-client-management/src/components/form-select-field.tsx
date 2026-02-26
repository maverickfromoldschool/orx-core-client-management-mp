import React from 'react';
import {FormControl, Select, MenuItem, Box, Typography} from '@mui/material';
import {Controller} from 'react-hook-form';
import type {Control, FieldError, FieldValues, Path} from 'react-hook-form';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Error from '@mui/icons-material/Error';

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  options: SelectOption[];
  required?: boolean;
  placeholder?: string;
  error?: FieldError;
  disabled?: boolean;
  fullWidth?: boolean;
  hideLabel?: boolean;
}

export const FormSelectField = <T extends FieldValues>({
  name,
  control,
  label,
  options,
  required = false,
  placeholder = 'Select...',
  error,
  disabled = false,
  fullWidth = true,
  hideLabel = false
}: FormSelectFieldProps<T>) => {
  return (
    <Box sx={{width: fullWidth ? '100%' : 'auto'}}>
      <Box sx={{display: 'flex', alignItems: 'center', mb: 0.5, minHeight: '22.4px'}}>
        {!hideLabel && (
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
            {required && (
              <Typography component="span" sx={{color: '#C40000', ml: 0.5}}>
                *
              </Typography>
            )}
          </Typography>
        )}
      </Box>
      <FormControl fullWidth={fullWidth} error={!!error} size="small">
        <Controller
          name={name}
          control={control}
          render={({field}) => (
            <Select
              {...field}
              displayEmpty
              disabled={disabled}
              IconComponent={KeyboardArrowDownIcon}
              renderValue={(selected) => {
                if (!selected || selected === '') {
                  return <Typography sx={{color: 'grey.500', fontSize: '14px'}}>{placeholder}</Typography>;
                }
                const selectedOption = options.find((opt) => opt.value === selected);
                return selectedOption?.label || selected;
              }}
              sx={{
                borderRadius: '4px',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderWidth: '1px',
                  borderColor: error ? '#C40000' : 'grey.300'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: error ? '#C40000' : 'grey.400'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: error ? '#C40000' : 'primary.main',
                  borderWidth: '1px'
                },
                '& .MuiSelect-select': {
                  padding: '10px 12px',
                  fontSize: '14px'
                },
                '& .MuiSelect-icon': {
                  color: 'grey.700',
                  right: '8px'
                }
              }}
            >
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </FormControl>
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
          <Error sx={{color: '#C40000', fontSize: '18px'}} />

          {error.message}
        </Typography>
      )}
    </Box>
  );
};

export default FormSelectField;
