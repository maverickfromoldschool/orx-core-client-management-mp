import React from 'react';
import {Box, Button, Typography} from '@mui/material';

/**
 * Props for VariantAssignmentHeader component
 */
export interface VariantAssignmentHeaderProps {
  onBack: () => void;
  onCancel: () => void;
}

/**
 * VariantAssignmentHeader component
 * Displays the page header with "Product Variants" title, back button, and cancel button
 *
 * @param {VariantAssignmentHeaderProps} props - Component props
 * @returns {JSX.Element} The rendered header component
 */
export const VariantAssignmentHeader: React.FC<VariantAssignmentHeaderProps> = ({onBack, onCancel}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 1px 24px',
        borderBottom: '1px solid #CBCCCD'
      }}
    >
      {/* Title Container with Back Icon */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        {/* Back Button with Chevron Left Icon */}
        <Box
          component="svg"
          sx={{
            width: '12px',
            height: '19px',
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.8
            }
          }}
          viewBox="0 0 12 19"
          fill="none"
          onClick={onBack}
          role="button"
          aria-label="Go back"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onBack();
            }
          }}
        >
          <path d="M10 2L2 9.5L10 17" stroke="#0C55B8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </Box>

        {/* Product Variants Title */}
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: '29px',
            lineHeight: '34.8px',
            color: '#002677'
          }}
        >
          Product Variants
        </Typography>
      </Box>

      {/* Cancel Button (Tertiary Style) */}
      <Button
        variant="outlined"
        onClick={onCancel}
        sx={{
          backgroundColor: '#FFFFFF',
          color: '#323334',
          fontWeight: 700,
          fontSize: '16px',
          lineHeight: '22.4px',
          textTransform: 'none',
          padding: '10px 24px',
          borderRadius: '46px',
          border: '1px solid #323334',
          '&:hover': {
            backgroundColor: '#f5f5f5',
            border: '1px solid #323334'
          }
        }}
      >
        Cancel
      </Button>
    </Box>
  );
};
