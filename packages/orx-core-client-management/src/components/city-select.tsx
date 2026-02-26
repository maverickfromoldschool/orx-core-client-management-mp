/* eslint-disable no-void */
/* eslint-disable no-console */
import React, {useEffect, useState} from 'react';
import {Autocomplete, TextField, Tooltip, Box, Typography} from '@mui/material';
import {Controller} from 'react-hook-form';
import type {Control, FieldError, FieldValues, Path} from 'react-hook-form';
import Error from '@mui/icons-material/Error';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {GetCity} from 'react-country-state-city';
import type {City} from 'react-country-state-city/dist/esm/types';

interface CitySelectProps<T extends FieldValues> {
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
  stateId?: number; // Required to fetch cities for a specific state
}

const CitySelect = <T extends FieldValues>({
  name,
  control,
  label,
  required = false,
  placeholder = 'Select a city',
  error,
  helpTooltip,
  disabled = false,
  fullWidth = true,
  countryId = 233, // 233 is the ID for United States
  stateId
}: CitySelectProps<T>) => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only fetch cities if both countryId and stateId are provided
    if (!countryId || !stateId) {
      setCities([]);
      return;
    }

    const fetchCities = async () => {
      try {
        setLoading(true);
        const citiesData = await GetCity(countryId, stateId);
        setCities(citiesData || []);
      } catch (err) {
        console.error('Error fetching cities:', err);
        setCities([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchCities();
  }, [countryId, stateId]);

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
        render={({field: {onChange, value, ...field}}) => (
          <Autocomplete
            {...field}
            options={cities}
            loading={loading}
            disabled={disabled || !stateId}
            fullWidth={fullWidth}
            disablePortal
            getOptionLabel={(option: City) => option.name || ''}
            isOptionEqualToValue={(option, val) => option.id === val?.id}
            value={value ? cities.find((city) => city.name === value || city.id === value) || null : null}
            onChange={(_, newValue) => {
              onChange(newValue ? newValue.name : '');
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={!stateId ? 'Please select a state first' : placeholder}
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
            noOptionsText={!stateId ? 'Please select a state first' : 'No cities found'}
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

export default CitySelect;
