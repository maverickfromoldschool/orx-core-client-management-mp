'use client';

import React, {useState} from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  InputAdornment,
  Select,
  FormControl,
  SelectChangeEvent,
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

import {FileCenterListPage} from '../../file-center-list-page/FileCenterListPage/file-center-list-page';
import {FileUploadDialog} from '../../file-upload-dialog/FileUploadDialog/file-upload-dialog';
import {type UploadType} from '../../file-center-list-page/FileCenterListPage/file-center-list-page.types';

import {FileCenterHomeProps} from './file-center-home.types';

const dropdownOptions = [
  {label: 'All Files', value: 'all'},
  {label: 'Client Uploads', value: 'client'},
  {label: 'Price Uploads', value: 'pricelist'}
];

export function FileCenterHome(props: FileCenterHomeProps) {
  const {title = 'File Center'} = props;
  const [dropdownValue, setDropdownValue] = useState<string>('all');
  const [uploadType, setUploadType] = useState<UploadType>('client');
  const [searchValue, setSearchValue] = useState<string>('');
  const [debouncedSearchValue, setDebouncedSearchValue] = useState<string>('');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('success');

  const handleDropdownChange = (event: SelectChangeEvent) => {
    const newValue = event.target.value;
    setDropdownValue(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setSearchValue(newValue);
  };

  // Debounce search input - wait 500ms after user stops typing
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchValue]);

  const handleUpload = (files: File[] | FileList, result?: {success: boolean; data?: any; error?: string}) => {
    const uploadedFiles = Array.isArray(files) ? files : Array.from(files ?? []);
    if (!uploadedFiles || uploadedFiles.length === 0) return;
    const fileName = uploadedFiles[0]?.name ?? 'file';

    if (result?.success) {
      // show success snackbar when upload succeeds
      setSnackbarMessage(`'${fileName}' has been uploaded and is being processed. You’ll be notified when it’s done.`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      // Auto-hide after 6 seconds
      setTimeout(() => {
        setSnackbarOpen(false);
      }, 6000);
    }
    // Note: Error notifications are handled by the axios interceptor
    // so we don't need to show them here to avoid duplicates
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '100vw',
        backgroundColor: '#FAFCFF',
        minHeight: '100vh',
        padding: '0px 84px',
        margin: 0,
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      <>
        {/* Snackbar for upload notifications - positioned above search bar */}
        {snackbarOpen && (
          <Box
            sx={{
              position: 'absolute',
              top: '40px',
              right: '84px',
              zIndex: 1400
            }}
          >
            <Alert
              onClose={handleSnackbarClose}
              severity={snackbarSeverity}
              variant="filled"
              sx={{
                width: '722px',
                height: '56px',
                opacity: 1,
                gap: '8px',
                paddingTop: '16px',
                paddingRight: '16px',
                paddingBottom: '16px',
                paddingLeft: '16px',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#E8F5E9 !important',
                fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                fontWeight: 700,
                fontStyle: 'normal',
                fontSize: '16px',
                lineHeight: '20px',
                letterSpacing: '0%',
                color: '#007000',
                '& .MuiAlert-message': {
                  fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                  fontWeight: 700,
                  fontSize: '16px',
                  lineHeight: '20px',
                  letterSpacing: '0%',
                  color: '#007000'
                },
                '& .MuiAlert-action': {
                  paddingLeft: '8px'
                }
              }}
            >
              {snackbarMessage}
            </Alert>
          </Box>
        )}

        {/* Row with Title, Dropdown, and Search */}
        <Box
          sx={{
            height: '88px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: '100%',
            overflow: 'hidden',
            boxSizing: 'border-box'
          }}
        >
          {/* Title */}
          <Typography
            sx={{
              fontWeight: 600,
              flex: '0 0 auto',
              minWidth: '150px',
              color: '#002677',
              fontSize: '26px'
            }}
          >
            {title}
          </Typography>

          {/* Dropdown */}
          <FormControl
            sx={{
              width: '300px',
              minWidth: '200px',
              maxWidth: '300px',
              height: '40px',
              flexShrink: 1
            }}
          >
            <Select
              labelId="file-type-select-label"
              id="file-type-select"
              value={dropdownValue}
              onChange={handleDropdownChange}
              size="small"
              sx={{
                backgroundColor: '#ffffff',
                height: '40px',
                opacity: 1,
                '& .MuiSelect-select': {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }
              }}
            >
              {dropdownOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Search Box */}
          <TextField
            placeholder="Search"
            value={searchValue}
            onChange={handleSearchChange}
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {searchValue ? (
                    <Box
                      component="button"
                      onClick={() => {
                        setSearchValue('');
                      }}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        marginRight: '4px',
                        color: '#6E7072',
                        '&:hover': {
                          color: '#002677'
                        }
                      }}
                      aria-label="Clear search"
                    >
                      <CloseIcon sx={{color: '#6E7072', fontSize: '20px'}} />
                    </Box>
                  ) : null}
                  <SearchIcon sx={{color: '#6E7072', fontSize: '20px'}} />
                </InputAdornment>
              )
            }}
            sx={{
              width: '397px',
              minWidth: '250px',
              maxWidth: '397px',
              flexShrink: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: '46px',
                backgroundColor: '#FFFFFF',
                fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                fontSize: '16px',
                height: '40px',
                '& fieldset': {
                  borderColor: '#CBCCCD'
                },
                '&:hover fieldset': {
                  borderColor: '#002677'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#002677',
                  borderWidth: '1px'
                },
                '&.Mui-disabled fieldset': {
                  borderColor: '#CBCCCD'
                }
              },
              '& .MuiInputBase-input': {
                py: '10px',
                '&::placeholder': {
                  color: '#6E7072',
                  opacity: 1
                },
                '&.Mui-disabled': {
                  color: '#6E7072',
                  WebkitTextFillColor: '#6E7072'
                }
              }
            }}
          />
        </Box>

        <FileCenterListPage
          title="File History"
          fileTypeFilter={dropdownValue as 'all' | 'client' | 'pricelist'}
          searchQuery={debouncedSearchValue}
          openUploadDialog={(nextUploadType = 'client') => {
            setUploadType(nextUploadType);
            setIsUploadDialogOpen(true);
          }}
        />
        <FileUploadDialog
          open={isUploadDialogOpen}
          onClose={() => {
            setIsUploadDialogOpen(false);
          }}
          uploadType={uploadType}
          title={uploadType === 'price' ? 'Upload Price' : 'Upload Client'}
          onUpload={handleUpload}
        />
      </>
    </Box>
  );
}

export default FileCenterHome;
