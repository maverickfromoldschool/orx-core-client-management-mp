/* eslint-disable @typescript-eslint/no-unsafe-call */
import React, {useRef} from 'react';
import {Box, Typography, Button} from '@mui/material';
import {useNavigate, useParams} from 'react-router-dom';

import {COLORS} from '../constants';

interface ProductViewHeaderProps {
  lastModifiedBy: string;
  lastModifiedDate: string;
  onCancel?: () => void;
  isSaveDisabled?: boolean;
}

/**
 * ProductViewHeader component
 * Displays the page title and action buttons
 */
export const ProductViewHeader: React.FC<ProductViewHeaderProps> = ({
  lastModifiedBy,
  lastModifiedDate,
  onCancel,
  isSaveDisabled = true
}) => {
  const navigation = useNavigate();
  const {productId} = useParams();
  const ref = useRef<HTMLDivElement>(null);

  const handleBackClick = () => {
    navigation(`/details/${productId}`);
  };

  const handleCancelClick = () => {
    if (onCancel) {
      onCancel();
    }
    navigation('/');
  };

  return (
    <Box
      ref={ref}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        padding: '10px 1px 24px',
        borderBottom: `1px solid #CBCCCD`,
        width: '100%'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px'
        }}
      >
        {/* Left side - Title and metadata */}
        <Box sx={{display: 'flex', alignItems: 'center', gap: '12px'}}>
          <Box sx={{display: 'flex', alignItems: 'center', gap: '12px'}}>
            {/* Back arrow icon */}
            <Box
              onClick={handleBackClick}
              sx={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                '&:hover': {
                  opacity: 0.7
                }
              }}
            >
              <svg width="12" height="19" viewBox="0 0 12 19" fill="none">
                <path
                  d="M11 1L2 9.5L11 18"
                  stroke={COLORS.TEXT_LINK}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Box>

            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '29px',
                lineHeight: '1.2em',
                color: COLORS.TEXT_HEADINGS
              }}
            >
              Product Information
            </Typography>

            <Box
              sx={{
                width: '0px',
                height: '35px',
                borderLeft: `1px solid #CBCCCD`
              }}
            />

            <Typography
              sx={{
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '1.36em',
                color: COLORS.TEXT_LABELS
              }}
            >
              Last Modified by: {lastModifiedBy} on {lastModifiedDate}
            </Typography>
          </Box>
        </Box>

        {/* Right side - Action buttons */}
        <Box sx={{display: 'flex', alignItems: 'center', gap: '8px'}}>
          <Button
            type="submit"
            variant="contained"
            disabled={isSaveDisabled}
            sx={{
              padding: '10px 24px',
              borderRadius: '46px',
              backgroundColor: isSaveDisabled ? '#F2F2F2' : COLORS.SECONDARY_DARK_BLUE,
              color: isSaveDisabled ? '#4B4D4F' : COLORS.NEUTRAL_WHITE,
              fontWeight: 700,
              fontSize: '16px',
              lineHeight: '1.4em',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: isSaveDisabled ? '#F2F2F2' : '#001a5c'
              },
              '&.Mui-disabled': {
                backgroundColor: '#F2F2F2',
                color: '#4B4D4F'
              }
            }}
          >
            Save
          </Button>

          <Button
            variant="outlined"
            onClick={handleCancelClick}
            sx={{
              padding: '10px 24px',
              borderRadius: '46px',
              backgroundColor: COLORS.NEUTRAL_WHITE,
              border: `1px solid ${COLORS.NEUTRAL_80}`,
              color: COLORS.NEUTRAL_80,
              fontWeight: 700,
              fontSize: '16px',
              lineHeight: '1.4em',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#f5f5f5',
                border: `1px solid ${COLORS.NEUTRAL_80}`
              }
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
