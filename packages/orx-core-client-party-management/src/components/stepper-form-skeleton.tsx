import React, {FC} from 'react';
import {Skeleton, Stack, Divider, Grid, Box} from '@mui/material';

const StepperFormSkeleton: FC = () => {
  return (
    <Box
      sx={{
        padding: '24px',
        maxWidth: '100%',
        margin: '0 auto',
        backgroundColor: '#F5F5F5',
        minHeight: '100vh'
      }}
    >
      {/* Page Title and Back Button */}
      <Box sx={{mb: 3}}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{mb: 2}}>
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="text" width="25%" height={40} />
        </Stack>
        <Stack direction="row" justifyContent="flex-end">
          <Skeleton variant="rounded" width={100} height={40} sx={{borderRadius: '46px'}} />
        </Stack>
      </Box>

      {/* Divider */}
      <Divider sx={{my: 3, borderColor: '#E5E5E6'}} />

      {/* Stepper Skeleton */}
      <Box sx={{mb: 3}}>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
          {[1, 2, 3, 4, 5].map((step) => (
            <Box key={step} sx={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <Skeleton variant="circular" width={step === 1 ? 24 : 20} height={step === 1 ? 24 : 20} sx={{mb: 1}} />
              <Skeleton variant="text" width="80%" height={16} />
            </Box>
          ))}
        </Stack>
      </Box>

      {/* Form Box - Accordion Style */}
      <Box
        sx={{
          border: '1px solid #CBCCCD',
          borderRadius: '12px',
          backgroundColor: '#FFFFFF',
          mb: 3
        }}
      >
        {/* Accordion Header */}
        <Box sx={{p: '16px 24px', borderBottom: '1px solid #CBCCCD'}}>
          <Skeleton variant="text" width="30%" height={32} sx={{mb: 1}} />
          <Skeleton variant="text" width="50%" height={20} />
        </Box>

        {/* Accordion Content - Form Fields */}
        <Box sx={{p: '24px'}}>
          {/* First Row - 3 columns */}
          <Grid container spacing={3} sx={{mb: 3}}>
            <Grid item xs={12} md={4}>
              <Skeleton variant="text" width="60%" height={20} sx={{mb: 1}} />
              <Skeleton variant="rounded" height={56} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Skeleton variant="text" width="40%" height={20} sx={{mb: 1}} />
              <Skeleton variant="rounded" height={56} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Skeleton variant="text" width="50%" height={20} sx={{mb: 1}} />
              <Skeleton variant="rounded" height={56} />
            </Grid>
          </Grid>

          {/* Address Section Title */}
          <Box sx={{mb: 2}}>
            <Skeleton variant="text" width="20%" height={28} sx={{mb: 1}} />
            <Skeleton variant="text" width="40%" height={20} />
          </Box>

          {/* Address Fields - 2 rows x 3 columns */}
          <Grid container spacing={3} sx={{mb: 3}}>
            <Grid item xs={12} md={4}>
              <Skeleton variant="text" width="60%" height={20} sx={{mb: 1}} />
              <Skeleton variant="rounded" height={56} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Skeleton variant="text" width="50%" height={20} sx={{mb: 1}} />
              <Skeleton variant="rounded" height={56} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Skeleton variant="text" width="40%" height={20} sx={{mb: 1}} />
              <Skeleton variant="rounded" height={56} />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Skeleton variant="text" width="30%" height={20} sx={{mb: 1}} />
              <Skeleton variant="rounded" height={56} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Skeleton variant="text" width="45%" height={20} sx={{mb: 1}} />
              <Skeleton variant="rounded" height={56} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Skeleton variant="text" width="50%" height={20} sx={{mb: 1}} />
              <Skeleton variant="rounded" height={56} />
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Navigation Footer */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2,
          pt: 3,
          borderTop: '1px solid #E5E5E6'
        }}
      >
        <Skeleton variant="rounded" width={120} height={40} sx={{borderRadius: '46px'}} />
      </Box>
    </Box>
  );
};

export default StepperFormSkeleton;
