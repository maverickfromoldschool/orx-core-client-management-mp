import React from 'react';
import {Drawer, Box, Typography, Divider, Stack, Button, IconButton} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ClientListFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  onApply: () => void;
  onClear: () => void;
  // Add props for filter values and handlers as needed
  children: React.ReactNode; // Render filter fields from parent
}

export const ClientListFilterDrawer: React.FC<ClientListFilterDrawerProps> = ({
  open,
  onClose,
  onApply,
  onClear,
  children
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
      <Box sx={{flex: 1, overflowY: 'auto', p: 3, pt: 2, paddingTop: '40px'}}>{children}</Box>
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
