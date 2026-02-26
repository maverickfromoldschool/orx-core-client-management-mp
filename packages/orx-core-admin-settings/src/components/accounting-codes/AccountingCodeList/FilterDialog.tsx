import React, {useState} from 'react';
import {Drawer, Button, TextField, Box, IconButton, Typography, Divider} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export interface FilterValues {
  accountingCode: string;
  description: string;
  glAccountType: string;
  glAccountName: string;
  glAccountNumber: string;
  glAccountGroup: string;
}

export interface FilterDialogProps {
  open: boolean;
  onClose: () => void;
  onApply: (filters: FilterValues) => void;
  onClear: () => void;
  initialValues?: Partial<FilterValues>;
}

export const FilterDialog: React.FC<FilterDialogProps> = ({open, onClose, onApply, onClear, initialValues = {}}) => {
  const [filters, setFilters] = useState<FilterValues>({
    accountingCode: initialValues.accountingCode || '',
    description: initialValues.description || '',
    glAccountType: initialValues.glAccountType || '',
    glAccountName: initialValues.glAccountName || '',
    glAccountNumber: initialValues.glAccountNumber || '',
    glAccountGroup: initialValues.glAccountGroup || ''
  });

  const handleChange = (field: keyof FilterValues) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleClear = () => {
    setFilters({
      accountingCode: '',
      description: '',
      glAccountType: '',
      glAccountName: '',
      glAccountNumber: '',
      glAccountGroup: ''
    });
    onClear();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: {xs: '100%', sm: 400},
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
        }
      }}
    >
      <Box sx={{display: 'flex', flexDirection: 'column', height: '100%'}}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 3,
            pb: 2
          }}
        >
          <Typography variant="h5" sx={{fontWeight: 600, color: '#002677'}}>
            Filters
          </Typography>
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{
              color: 'text.secondary',
              '&:hover': {
                bgcolor: 'grey.100'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Subtitle */}
        <Box sx={{px: 3, pb: 2}}>
          <Typography variant="body2" sx={{color: 'text.secondary'}}>
            Select the filtering options to fetch the required data
          </Typography>
        </Box>

        <Divider />

        {/* Content - Scrollable */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            px: 3,
            py: 3
          }}
        >
          <Box sx={{display: 'flex', flexDirection: 'column', gap: 2.5}}>
            {/* Accounting Code */}
            <div>
              <Typography
                variant="body2"
                sx={{
                  mb: 0.75,
                  fontWeight: 500,
                  color: 'text.primary'
                }}
              >
                Accounting Code
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter accounting code"
                value={filters.accountingCode}
                onChange={handleChange('accountingCode')}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1
                  }
                }}
              />
            </div>

            {/* Description */}
            <div>
              <Typography
                variant="body2"
                sx={{
                  mb: 0.75,
                  fontWeight: 500,
                  color: 'text.primary'
                }}
              >
                Description
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter description"
                value={filters.description}
                onChange={handleChange('description')}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1
                  }
                }}
              />
            </div>

            {/* GL Account Type */}
            <div>
              <Typography
                variant="body2"
                sx={{
                  mb: 0.75,
                  fontWeight: 500,
                  color: 'text.primary'
                }}
              >
                GL Account Type
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter GL account type"
                value={filters.glAccountType}
                onChange={handleChange('glAccountType')}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1
                  }
                }}
              />
            </div>

            {/* GL Account Name */}
            <div>
              <Typography
                variant="body2"
                sx={{
                  mb: 0.75,
                  fontWeight: 500,
                  color: 'text.primary'
                }}
              >
                GL Account Name
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter GL account name"
                value={filters.glAccountName}
                onChange={handleChange('glAccountName')}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1
                  }
                }}
              />
            </div>

            {/* GL Account Number */}
            <div>
              <Typography
                variant="body2"
                sx={{
                  mb: 0.75,
                  fontWeight: 500,
                  color: 'text.primary'
                }}
              >
                GL Account Number
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter GL account number"
                value={filters.glAccountNumber}
                onChange={handleChange('glAccountNumber')}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1
                  }
                }}
              />
            </div>

            {/* GL Account Group */}
            <div>
              <Typography
                variant="body2"
                sx={{
                  mb: 0.75,
                  fontWeight: 500,
                  color: 'text.primary'
                }}
              >
                GL Account Group
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter GL account group"
                value={filters.glAccountGroup}
                onChange={handleChange('glAccountGroup')}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1
                  }
                }}
              />
            </div>
          </Box>
        </Box>

        <Divider />

        {/* Footer - Action Buttons */}
        <Box
          sx={{
            px: 3,
            py: 2.5,
            display: 'flex',
            gap: 1.5,
            justifyContent: 'center',
            bgcolor: 'background.paper'
          }}
        >
          <Button
            variant="contained"
            onClick={handleApply}
            sx={{
              textTransform: 'none',
              bgcolor: '#003087',
              color: 'white',
              px: 4,
              py: 1,
              borderRadius: '24px',
              minWidth: 120,
              '&:hover': {
                bgcolor: '#002060'
              }
            }}
          >
            Filter
          </Button>
          <Button
            variant="outlined"
            onClick={handleClear}
            sx={{
              textTransform: 'none',
              borderColor: 'divider',
              color: 'text.primary',
              px: 4,
              py: 1,
              borderRadius: '24px',
              minWidth: 120,
              '&:hover': {
                borderColor: 'text.primary',
                bgcolor: 'grey.50'
              }
            }}
          >
            Clear
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default FilterDialog;
