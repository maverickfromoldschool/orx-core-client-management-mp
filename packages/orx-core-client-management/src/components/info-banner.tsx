import React from 'react';
import {Alert, AlertTitle, Box} from '@mui/material';
import FlagIcon from '@mui/icons-material/Flag';

interface InfoBannerProps {
  title: string;
  message: string | React.ReactNode;
}

export const InfoBanner: React.FC<InfoBannerProps> = ({title, message}) => {
  return (
    <Alert
      severity="info"
      icon={
        <FlagIcon
          sx={{
            color: '#002677',
            fontSize: '24px'
          }}
        />
      }
      sx={{
        backgroundColor: '#E5F8FB',
        border: '1px solid #002677',
        borderRadius: '12px',
        padding: '16px 24px',
        '& .MuiAlert-icon': {
          marginRight: '12px',
          padding: 0,
          alignItems: 'flex-start',
          paddingTop: '2px'
        },
        '& .MuiAlert-message': {
          padding: 0
        }
      }}
    >
      <div>
        <AlertTitle
          sx={{
            fontSize: '16px',
            fontWeight: 700,
            color: '#000000',
            marginBottom: '4px',
            lineHeight: 1.4
          }}
        >
          {title}
        </AlertTitle>
        <Box
          component="span"
          sx={{
            fontSize: '16px',
            fontWeight: 400,
            color: '#4B4D4F',
            lineHeight: 1.4
          }}
        >
          {message}
        </Box>
      </div>
    </Alert>
  );
};

export default InfoBanner;
