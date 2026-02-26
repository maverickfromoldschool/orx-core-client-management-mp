import React from 'react';
import {Box, IconButton} from '@mui/material';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import dayjs, {Dayjs} from 'dayjs';

import {COLORS} from '../constants';

interface DateFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  isOpen: boolean;
  onToggle: (open: boolean) => void;
}

export const DateField: React.FC<DateFieldProps> = ({value, onChange, disabled = false, isOpen, onToggle}) => {
  const handleDateChange = (newValue: Dayjs | null) => {
    if (newValue) {
      onChange(newValue.format('MM/DD/YYYY'));
    } else {
      onChange('');
    }
  };

  const handleIconClick = () => {
    if (!disabled) {
      onToggle(true);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{position: 'relative'}}>
        <DatePicker
          open={isOpen}
          onClose={() => {
            onToggle(false);
          }}
          value={value ? dayjs(value, 'MM/DD/YYYY') : null}
          onChange={handleDateChange}
          disabled={disabled}
          slots={{
            openPickerButton: () => null
          }}
          slotProps={{
            textField: {
              fullWidth: true,
              placeholder: '_ _/_ _/_ _ _ _',
              onClick: () => {
                if (!disabled) {
                  onToggle(true);
                }
              },
              sx: {
                '& .MuiOutlinedInput-root': {
                  height: '40px',
                  paddingRight: 0,
                  backgroundColor: disabled ? COLORS.NEUTRAL_20 : COLORS.NEUTRAL_WHITE,
                  '& fieldset': {
                    border: disabled ? 'none' : `1px solid ${COLORS.NEUTRAL_70}`
                  },
                  '& input': {
                    padding: '8px 12px',
                    fontSize: '16px'
                  },
                  '& input::placeholder': {
                    color: COLORS.TEXT_LABELS,
                    opacity: 1
                  }
                }
              }
            }
          }}
        />
        <IconButton
          onClick={handleIconClick}
          disabled={disabled}
          sx={{
            position: 'absolute',
            right: '0',
            top: '0',
            backgroundColor: COLORS.SECONDARY_DARK_BLUE,
            borderRadius: '0 4px 4px 0',
            width: '40px',
            height: '40px',
            '&:hover': {
              backgroundColor: disabled ? COLORS.SECONDARY_DARK_BLUE : '#001a5c'
            },
            '&.Mui-disabled': {
              backgroundColor: COLORS.SECONDARY_DARK_BLUE
            }
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5zm2 4h10v2H7v-2z"
              fill={COLORS.SECONDARY_WARM_WHITE}
            />
          </svg>
        </IconButton>
      </Box>
    </LocalizationProvider>
  );
};
