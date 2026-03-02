import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  Divider,
  Stack,
  Button,
  IconButton,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import dayjs from 'dayjs';

export interface AssignedCagsFilterValues {
  carrierName: string;
  carrierId: string;
  accountName: string;
  accountId: string;
  groupName: string;
  groupId: string;
  assignmentStatus: string;
  startDate: string;
  endDate: string;
}

interface AssignedCagsFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  onApply: () => void;
  onClear: () => void;
  filterValues: AssignedCagsFilterValues;
  onFilterChange: (field: keyof AssignedCagsFilterValues, value: string) => void;
}

export const AssignedCagsFilterDrawer: React.FC<AssignedCagsFilterDrawerProps> = ({
  open,
  onClose,
  onApply,
  onClear,
  filterValues,
  onFilterChange
}) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 508,
          maxWidth: '100vw',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          opacity: 1,
          transform: 'rotate(0deg)',
          position: 'fixed',
          paddingX: '10px'
        }
      }}
    >
      <Box sx={{p: 3, pb: 2, pt: 5}}>
        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <div>
            <Typography
              variant="h6"
              sx={{fontWeight: 700, fontStyle: 'bold', fontSize: '25px', color: '#002677'}}
              fontWeight={700}
              gutterBottom
            >
              Filters
            </Typography>
            <Typography variant="body2" sx={{color: '#4B4D4F', fontSize: '14px', fontWeight: 400}} gutterBottom>
              Select the filtering options to fetch the required data.
            </Typography>
          </div>
          <IconButton aria-label="close" onClick={onClose} sx={{ml: 2}}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{mt: 2}} />
      </Box>
      <Box sx={{flex: 1, overflowY: 'auto', p: 3, pt: 2, paddingTop: '40px'}}>
        <Stack spacing={3}>
          {/* Carrier Name */}
          <TextField
            label="Carrier Name"
            value={filterValues.carrierName}
            onChange={(e) => {
              onFilterChange('carrierName', e.target.value);
            }}
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '4px',
                height: '48px'
              }
            }}
          />

          {/* Carrier ID */}
          <TextField
            label="Carrier ID"
            value={filterValues.carrierId}
            onChange={(e) => {
              onFilterChange('carrierId', e.target.value);
            }}
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '4px',
                height: '48px'
              }
            }}
          />

          {/* Account Name */}
          <TextField
            label="Account Name"
            value={filterValues.accountName}
            onChange={(e) => {
              onFilterChange('accountName', e.target.value);
            }}
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '4px',
                height: '48px'
              }
            }}
          />

          {/* Account ID */}
          <TextField
            label="Account ID"
            value={filterValues.accountId}
            onChange={(e) => {
              onFilterChange('accountId', e.target.value);
            }}
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '4px',
                height: '48px'
              }
            }}
          />

          {/* Group Name */}
          <TextField
            label="Group Name"
            value={filterValues.groupName}
            onChange={(e) => {
              onFilterChange('groupName', e.target.value);
            }}
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '4px',
                height: '48px'
              }
            }}
          />

          {/* Group ID */}
          <TextField
            label="Group ID"
            value={filterValues.groupId}
            onChange={(e) => {
              onFilterChange('groupId', e.target.value);
            }}
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '4px',
                height: '48px'
              }
            }}
          />

          {/* Assignment Status */}
          <FormControl fullWidth>
            <InputLabel>Assignment Status</InputLabel>
            <Select
              value={filterValues.assignmentStatus}
              onChange={(e) => {
                onFilterChange('assignmentStatus', e.target.value);
              }}
              label="Assignment Status"
              sx={{
                borderRadius: '4px',
                height: '48px'
              }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="INACTIVE">Inactive</MenuItem>
            </Select>
          </FormControl>

          {/* Start Date */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={filterValues.startDate ? dayjs(filterValues.startDate, 'MM-DD-YYYY') : null}
              onChange={(newValue) => {
                onFilterChange('startDate', newValue?.isValid() ? newValue.format('MM-DD-YYYY') : '');
              }}
              inputFormat="MM-DD-YYYY"
              components={{
                OpenPickerIcon: CalendarMonthIcon
              }}
              OpenPickerButtonProps={{
                sx: {
                  backgroundColor: '#002677',
                  borderRadius: '6px 6px 6px 6px',
                  height: '100%',
                  width: '48px',
                  marginRight: '-14px',
                  color: '#FFFFFF',
                  '&:hover': {
                    backgroundColor: '#001d5c'
                  },
                  '& .MuiSvgIcon-root': {
                    fontSize: '24px'
                  }
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  size="small"
                  placeholder="MM-DD-YYYY"
                  label="Start Date"
                  sx={{
                    height: '40px',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '4px',
                      height: '40px',
                      '& fieldset': {
                        borderWidth: '1px',
                        borderColor: 'grey.300'
                      },
                      '&:hover fieldset': {
                        borderColor: 'grey.400'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                        borderWidth: '1px'
                      }
                    },
                    '& .MuiInputBase-input': {
                      padding: '10px 12px',
                      fontSize: '16px'
                    },
                    '& .MuiInputAdornment-root': {
                      marginLeft: 0,
                      height: '100%',
                      maxHeight: 'none'
                    }
                  }}
                />
              )}
            />
          </LocalizationProvider>

          {/* End Date */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={filterValues.endDate ? dayjs(filterValues.endDate, 'MM-DD-YYYY') : null}
              onChange={(newValue) => {
                onFilterChange('endDate', newValue?.isValid() ? newValue.format('MM-DD-YYYY') : '');
              }}
              inputFormat="MM-DD-YYYY"
              components={{
                OpenPickerIcon: CalendarMonthIcon
              }}
              OpenPickerButtonProps={{
                sx: {
                  backgroundColor: '#002677',
                  borderRadius: '6px 6px 6px 6px',
                  height: '100%',
                  width: '48px',
                  marginRight: '-14px',
                  color: '#FFFFFF',
                  '&:hover': {
                    backgroundColor: '#001d5c'
                  },
                  '& .MuiSvgIcon-root': {
                    fontSize: '24px'
                  }
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  size="small"
                  placeholder="MM-DD-YYYY"
                  label="End Date"
                  sx={{
                    height: '40px',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '4px',
                      height: '40px',
                      '& fieldset': {
                        borderWidth: '1px',
                        borderColor: 'grey.300'
                      },
                      '&:hover fieldset': {
                        borderColor: 'grey.400'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                        borderWidth: '1px'
                      }
                    },
                    '& .MuiInputBase-input': {
                      padding: '10px 12px',
                      fontSize: '16px'
                    },
                    '& .MuiInputAdornment-root': {
                      marginLeft: 0,
                      height: '100%',
                      maxHeight: 'none'
                    }
                  }}
                />
              )}
            />
          </LocalizationProvider>
        </Stack>
      </Box>
      <Divider />
      <Box sx={{p: 3, pt: 2}}>
        <Box sx={{width: '100%', display: 'flex', justifyContent: 'center', mt: 2}}>
          <Stack direction="row" spacing={2} sx={{gap: '10px'}}>
            <Button
              variant="contained"
              onClick={onApply}
              sx={{
                width: '89px',
                height: '40px',
                opacity: 1,
                borderRadius: '46px',
                padding: '10px 24px',
                fontSize: '16px',
                fontWeight: 700,
                textTransform: 'none',
                boxShadow: 'none',
                backgroundColor: '#002677',
                color: '#FFFFFF',
                '&:hover': {
                  backgroundColor: '#001a5c',
                  boxShadow: 'none'
                }
              }}
            >
              Filter
            </Button>
            <Button
              variant="outlined"
              onClick={onClear}
              sx={{
                width: '89px',
                height: '40px',
                opacity: 1,
                borderRadius: '46px',
                padding: '10px 24px',
                fontSize: '16px',
                fontWeight: 700,
                textTransform: 'none',
                backgroundColor: '#FFFFFF',
                color: '#4B4D4F',
                borderColor: '#4B4D4F',
                '&:hover': {
                  backgroundColor: '#F5F5F5',
                  borderColor: '#4B4D4F'
                }
              }}
            >
              Clear
            </Button>
          </Stack>
        </Box>
      </Box>
    </Drawer>
  );
};
