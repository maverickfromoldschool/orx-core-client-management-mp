import React from 'react';
import {Box, TextField, Tooltip, Typography} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

interface ReadOnlyFieldProps {
  label: string;
  value: string | undefined | null;
  placeholder?: string;
  required?: boolean;
  helpTooltip?: string;
  fullWidth?: boolean;
}

export const ReadOnlyField: React.FC<ReadOnlyFieldProps> = ({
  label,
  value,
  placeholder = '',
  required = false,
  helpTooltip,
  fullWidth = true
}) => {
  const displayValue = value && value.trim() !== '' ? value : '';
  const displayPlaceholder = placeholder;

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
      <TextField
        value={displayValue}
        placeholder={displayPlaceholder}
        disabled
        fullWidth={fullWidth}
        size="small"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '4px',
            backgroundColor: '#FFFFFF',
            '& fieldset': {
              borderWidth: '1px',
              borderColor: 'grey.300'
            },
            '&.Mui-disabled': {
              backgroundColor: '#FFFFFF',
              '& fieldset': {
                borderColor: 'grey.300'
              }
            }
          },
          '& .MuiInputBase-input': {
            padding: '10px 12px',
            fontSize: '14px',
            '&.Mui-disabled': {
              WebkitTextFillColor: '#4B4D4F',
              color: '#4B4D4F'
            }
          },
          '& .MuiInputBase-input::placeholder': {
            color: '#6B6D6F',
            opacity: 1
          }
        }}
      />
    </Box>
  );
};

export default ReadOnlyField;
