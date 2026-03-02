import React from 'react';
import {TextField, Tooltip, Box, Typography} from '@mui/material';
import {Controller} from 'react-hook-form';
import type {Control, FieldError, FieldValues, Path} from 'react-hook-form';
import Error from '@mui/icons-material/Error';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

interface FormTextFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  required?: boolean;
  placeholder?: string;
  error?: FieldError;
  helpTooltip?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

export const FormTextField = <T extends FieldValues>({
  name,
  control,
  label,
  required = false,
  placeholder,
  error,
  helpTooltip,
  disabled = false,
  fullWidth = true
}: FormTextFieldProps<T>) => {
  return (
    <Box sx={{width: fullWidth ? '100%' : 'auto'}}>
      <Box sx={{display: 'flex', alignItems: 'center', mb: 0.5}}>
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
        {helpTooltip && (
          <Tooltip title={helpTooltip} arrow placement="top">
            <HelpOutlineIcon
              sx={{
                ml: 0.5,
                fontSize: '18px',
                color: 'grey.700',
                cursor: 'help'
              }}
            />
          </Tooltip>
        )}
      </Box>
      <Controller
        name={name}
        control={control}
        render={({field}) => (
          <TextField
            {...field}
            placeholder={placeholder}
            disabled={disabled}
            fullWidth={fullWidth}
            error={!!error}
            size="small"
            // InputProps={{
            //   endAdornment: error ? (
            //     <InputAdornment position="end">
            //       <ErrorOutlineIcon sx={{color: '#C40000', fontSize: '20px'}} />
            //     </InputAdornment>
            //   ) : undefined
            // }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '4px',
                '& fieldset': {
                  borderWidth: '1px',
                  borderColor: error ? '#C40000' : 'grey.300'
                },
                '&:hover fieldset': {
                  borderColor: error ? '#C40000' : 'grey.400'
                },
                '&.Mui-focused fieldset': {
                  borderColor: error ? '#C40000' : 'primary.main',
                  borderWidth: '1px'
                }
              },
              '& .MuiInputBase-input': {
                padding: '10px 12px',
                fontSize: '14px'
              }
            }}
          />
        )}
      />
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

export default FormTextField;
