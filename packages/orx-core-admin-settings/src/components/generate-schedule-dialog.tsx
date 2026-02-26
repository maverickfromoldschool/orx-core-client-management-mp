'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  Typography,
  Grid,
  TextField
} from '@mui/material';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, {Dayjs} from 'dayjs';
import CloseIcon from '@mui/icons-material/Close';

export interface GenerateScheduleDialogProps {
  open: boolean;
  onClose: () => void;
  onGenerate: (data: GenerateScheduleData) => void;
  billingPeriod: string;
  billCycleCode: string;
}

export interface GenerateScheduleData {
  billingPeriod: string;
  schedulePeriodStart: number;
  schedulePeriodEnd: number;
  periodStartDate: string;
  daysToSchedule: number;
  daysToClosure: number;
  daysToAccounting: number;
  billCycleCode: string;
  isUpdate: boolean;
}

export function GenerateScheduleDialog({
  open,
  onClose,
  onGenerate,
  billingPeriod,
  billCycleCode
}: GenerateScheduleDialogProps) {
  const [formData, setFormData] = React.useState({
    fromYear: '',
    toYear: '',
    periodStartDate: '',
    daysToSchedule: 0,
    daysToClosure: 0,
    daysToAccounting: 0
  });

  const [fromYearDate, setFromYearDate] = React.useState<Dayjs | null>(null);
  const [toYearDate, setToYearDate] = React.useState<Dayjs | null>(null);

  const handleClose = () => {
    // Reset form data
    setFormData({
      fromYear: '',
      toYear: '',
      periodStartDate: '',
      daysToSchedule: 0,
      daysToClosure: 0,
      daysToAccounting: 0
    });
    setFromYearDate(null);
    setToYearDate(null);
    onClose();
  };

  const handleGenerate = () => {
    // Transform form data to API format
    const apiData: GenerateScheduleData = {
      billingPeriod,
      schedulePeriodStart: parseInt(formData.fromYear, 10),
      schedulePeriodEnd: parseInt(formData.toYear, 10),
      periodStartDate: formData.periodStartDate ? dayjs(formData.periodStartDate).format('YYYY-MM-DDTHH:mm:ss') : '',
      daysToSchedule: formData.daysToSchedule,
      daysToClosure: formData.daysToClosure,
      daysToAccounting: formData.daysToAccounting,
      billCycleCode,
      isUpdate: true
    };
    onGenerate(apiData);

    // Reset form data after generating
    setFormData({
      fromYear: '',
      toYear: '',
      periodStartDate: '',
      daysToSchedule: 0,
      daysToClosure: 0,
      daysToAccounting: 0
    });
    setFromYearDate(null);
    setToYearDate(null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: '20px',
            color: '#002677',
            borderBottom: '1px solid #CBCCCD',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          Generate Bill Cycle Schedule
          <IconButton
            onClick={handleClose}
            sx={{
              color: '#4B4D4F',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{padding: '24px'}}>
          <Grid container spacing={2} sx={{pt: 2}}>
            {/* First Row: Billing Period, From Year, To Year */}
            <Grid item xs={12} md={4}>
              <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5}}>
                <Typography sx={{fontSize: '14px', fontWeight: 700, color: 'text.primary'}}>Billing Period</Typography>
              </Box>
              <TextField
                fullWidth
                value={billingPeriod}
                disabled
                size="small"
                InputProps={{
                  sx: {fontSize: '14px', backgroundColor: '#F5F5F5'}
                }}
              />
            </Grid>

            {/* From Year */}
            <Grid item xs={12} md={4}>
              <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5}}>
                <Typography sx={{fontSize: '14px', fontWeight: 700, color: 'text.primary'}}>From Year</Typography>
              </Box>
              <DatePicker
                value={fromYearDate}
                onChange={(newValue: any) => {
                  const dayjsValue = newValue ? dayjs(newValue) : null;
                  setFromYearDate(dayjsValue);
                  if (dayjsValue) {
                    setFormData({...formData, fromYear: dayjsValue.year().toString()});
                  }
                }}
                views={['year']}
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                    InputProps: {
                      sx: {fontSize: '14px'}
                    }
                  }
                }}
              />
            </Grid>

            {/* To Year */}
            <Grid item xs={12} md={4}>
              <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5}}>
                <Typography sx={{fontSize: '14px', fontWeight: 700, color: 'text.primary'}}>To Year</Typography>
              </Box>
              <DatePicker
                value={toYearDate}
                onChange={(newValue: any) => {
                  const dayjsValue = newValue ? dayjs(newValue) : null;
                  setToYearDate(dayjsValue);
                  if (dayjsValue) {
                    setFormData({...formData, toYear: dayjsValue.year().toString()});
                  }
                }}
                views={['year']}
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                    InputProps: {
                      sx: {fontSize: '14px'}
                    }
                  }
                }}
              />
            </Grid>

            {/* Period Start Date */}
            <Grid item xs={12} md={3}>
              <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5}}>
                <Typography sx={{fontSize: '14px', fontWeight: 700, color: 'text.primary'}}>
                  Period Start Date
                </Typography>
              </Box>
              <TextField
                fullWidth
                type="date"
                value={formData.periodStartDate}
                onChange={(e) => {
                  setFormData({...formData, periodStartDate: e.target.value});
                }}
                size="small"
                InputProps={{
                  sx: {fontSize: '14px'}
                }}
              />
            </Grid>

            {/* Days to Schedule */}
            <Grid item xs={12} md={3}>
              <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5}}>
                <Typography sx={{fontSize: '14px', fontWeight: 700, color: 'text.primary'}}>
                  Days to Schedule
                </Typography>
              </Box>
              <TextField
                fullWidth
                type="number"
                value={formData.daysToSchedule}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10) || 0;
                  setFormData({...formData, daysToSchedule: Math.max(0, value)});
                }}
                size="small"
                InputProps={{
                  sx: {fontSize: '14px'},
                  inputProps: {min: 0}
                }}
              />
            </Grid>

            {/* Days to Closure */}
            <Grid item xs={12} md={3}>
              <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5}}>
                <Typography sx={{fontSize: '14px', fontWeight: 700, color: 'text.primary'}}>Days to Closure</Typography>
              </Box>
              <TextField
                fullWidth
                type="number"
                value={formData.daysToClosure}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10) || 0;
                  setFormData({...formData, daysToClosure: Math.max(0, value)});
                }}
                size="small"
                InputProps={{
                  sx: {fontSize: '14px'},
                  inputProps: {min: 0}
                }}
              />
            </Grid>

            {/* Days to Accounting */}
            <Grid item xs={12} md={3}>
              <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5}}>
                <Typography sx={{fontSize: '14px', fontWeight: 700, color: 'text.primary'}}>
                  Days to Accounting
                </Typography>
              </Box>
              <TextField
                fullWidth
                type="number"
                value={formData.daysToAccounting}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10) || 0;
                  setFormData({...formData, daysToAccounting: Math.max(0, value)});
                }}
                size="small"
                InputProps={{
                  sx: {fontSize: '14px'},
                  inputProps: {min: 0}
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions
          sx={{
            padding: '16px 24px',
            borderTop: '1px solid #CBCCCD',
            gap: '12px'
          }}
        >
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              borderColor: '#002677',
              color: '#002677',
              borderRadius: '46px',
              padding: '6px 24px',
              fontSize: '14px',
              fontWeight: 700,
              textTransform: 'none',
              fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
              '&:hover': {
                borderColor: '#001a5c',
                backgroundColor: 'rgba(0, 38, 119, 0.04)'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            variant="contained"
            sx={{
              backgroundColor: '#002677',
              color: '#FFFFFF',
              borderRadius: '46px',
              padding: '6px 24px',
              fontSize: '14px',
              fontWeight: 700,
              textTransform: 'none',
              fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
              '&:hover': {
                backgroundColor: '#001a5c'
              }
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
