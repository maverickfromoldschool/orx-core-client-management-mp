import React, {useState, ChangeEvent} from 'react';
import {Box, Typography, TextField, InputAdornment, IconButton} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import {ProductsHeaderProps} from '../types';

/**
 * ProductsHeader component
 * Displays the page title and search input
 */
export const ProductsHeader: React.FC<ProductsHeaderProps> = ({onSearch}) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {value} = event.target;
    setSearchValue(value);
    onSearch?.(value);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '1268px',
        backgroundColor: '#FAFCFF',
        padding: '26.5px 0'
      }}
    >
      {/* Page Title */}
      <Typography
        variant="h1"
        sx={{
          fontWeight: 700,
          fontSize: '26px',
          lineHeight: '31.2px',
          color: '#002677'
        }}
      >
        Products
      </Typography>

      {/* Search Input */}
      <TextField
        placeholder="Search"
        value={searchValue}
        onChange={handleSearchChange}
        sx={{
          width: '397px',
          '& .MuiOutlinedInput-root': {
            height: '40px',
            backgroundColor: '#FFFFFF',
            borderRadius: '46px',
            fontSize: '16px',
            lineHeight: '22.4px',
            color: '#323334',
            '& fieldset': {
              borderColor: '#000000',
              borderWidth: '1px'
            },
            '&:hover fieldset': {
              borderColor: '#000000'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#000000',
              borderWidth: '1px'
            }
          },
          '& .MuiOutlinedInput-input': {
            padding: '8.5px 16px',
            '&::placeholder': {
              color: '#323334',
              opacity: 1
            }
          }
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton edge="end" aria-label="search">
                <SearchIcon sx={{color: '#000000'}} />
              </IconButton>
            </InputAdornment>
          )
        }}
      />
    </Box>
  );
};
