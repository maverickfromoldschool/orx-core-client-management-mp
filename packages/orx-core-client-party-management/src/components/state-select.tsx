/* eslint-disable no-void */
/* eslint-disable no-console */
import React, {useEffect, useState} from 'react';
import {Autocomplete, TextField, Tooltip, Box, Typography} from '@mui/material';
import {Controller} from 'react-hook-form';
import type {Control, FieldError, FieldValues, Path} from 'react-hook-form';
import Error from '@mui/icons-material/Error';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {GetState} from 'react-country-state-city';
import type {State} from 'react-country-state-city/dist/esm/types';

interface StateSelectProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  required?: boolean;
  placeholder?: string;
  error?: FieldError;
  helpTooltip?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  countryId?: number; // Default is 233 for United States
  onStateChange?: (state: State | null) => void; // Callback to pass selected state object
}

const StateSelect = <T extends FieldValues>({
  name,
  control,
  label,
  required = false,
  placeholder = 'Select a state',
  error,
  helpTooltip,
  disabled = false,
  fullWidth = true,
  countryId = 233, // 233 is the ID for United States
  onStateChange
}: StateSelectProps<T>) => {
  const [states, setStates] = useState<State[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        setLoading(true);
        const statesData = await GetState(countryId);
        setStates(statesData || []);
      } catch (err) {
        console.error('Error fetching states:', err);
        setStates([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchStates();
  }, [countryId]);

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
        render={({field: {onChange, value, ...field}}) => {
          // Find the current state object based on the value
          const currentState = value
            ? states.find((state) => state.name === value || state.id === value) || null
            : null;

          // Trigger callback when states are loaded and there's an initial value
          useEffect(() => {
            if (states.length > 0 && currentState && onStateChange) {
              onStateChange(currentState);
            }
          }, [states, currentState?.id]); // Only trigger when states load or state ID changes

          return (
            <Autocomplete
              {...field}
              options={states}
              loading={loading}
              disabled={disabled}
              fullWidth={fullWidth}
              disablePortal
              getOptionLabel={(option: State) => option.name || ''}
              isOptionEqualToValue={(option, val) => option.id === val?.id}
              value={currentState}
              onChange={(_, newValue) => {
                onChange(newValue ? newValue.name : '');
                // Call the callback if provided to pass the full state object
                if (onStateChange) {
                  onStateChange(newValue);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={placeholder}
                  error={!!error}
                  size="small"
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
              sx={{
                '& .MuiAutocomplete-popupIndicator': {
                  color: error ? '#C40000' : 'grey.600'
                }
              }}
            />
          );
        }}
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

export default StateSelect;
