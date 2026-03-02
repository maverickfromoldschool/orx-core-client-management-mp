import React from 'react';
import {FormControl, Select, Box, Typography} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface ReadOnlySelectFieldProps {
  label: string;
  value: string | undefined | null;
  placeholder?: string;
  required?: boolean;
  fullWidth?: boolean;
}

export const ReadOnlySelectField: React.FC<ReadOnlySelectFieldProps> = ({
  label,
  value,
  placeholder = 'Select...',
  required = false,
  fullWidth = true
}) => {
  const displayValue = value && value.trim() !== '' ? value : '';

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
      </Box>
      <FormControl fullWidth={fullWidth} size="small">
        <Select
          value={displayValue}
          displayEmpty
          disabled
          IconComponent={KeyboardArrowDownIcon}
          renderValue={() => {
            if (!displayValue) {
              return <Typography sx={{color: '#6B6D6F', fontSize: '14px'}}>{placeholder}</Typography>;
            }
            return <Typography sx={{color: '#4B4D4F', fontSize: '14px'}}>{displayValue}</Typography>;
          }}
          sx={{
            borderRadius: '4px',
            backgroundColor: '#FFFFFF',
            '& .MuiOutlinedInput-notchedOutline': {
              borderWidth: '1px',
              borderColor: 'grey.300'
            },
            '&.Mui-disabled': {
              backgroundColor: '#FFFFFF',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'grey.300'
              }
            },
            '& .MuiSelect-select': {
              padding: '10px 12px',
              fontSize: '14px',
              '&.Mui-disabled': {
                WebkitTextFillColor: '#4B4D4F'
              }
            },
            '& .MuiSelect-icon': {
              color: 'grey.500',
              right: '8px'
            }
          }}
        >
          {/* Empty - read-only select doesn't need menu items */}
        </Select>
      </FormControl>
    </Box>
  );
};

export default ReadOnlySelectField;
