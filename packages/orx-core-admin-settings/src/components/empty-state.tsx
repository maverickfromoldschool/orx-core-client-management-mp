import React from 'react';
import {Box, Typography} from '@mui/material';
import FolderOffOutlinedIcon from '@mui/icons-material/FolderOffOutlined';

/**
 * Props for the EmptyState component
 */
export interface EmptyStateProps {
  /** Title text (e.g., 'No lookup fields found') */
  title: string;
  /** Optional description text */
  description?: string;
  /** Optional action text for the link (e.g., 'adding a new lookup field') */
  actionText?: string;
  /** Callback when action link/button is clicked */
  onAction?: () => void;
  /** Icon size - 'small' (24px) or 'large' (64px). Default: 'small' */
  iconSize?: 'small' | 'large';
  /** Whether to show action as a button instead of inline link. Default: false */
  showButton?: boolean;
  /** Button text when showButton is true. Default: derived from actionText */
  buttonText?: string;
}

/**
 * Generic EmptyState component for displaying empty data states across the application
 * Supports both inline link and button action styles for flexibility
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  iconSize = 'small',
  showButton = false,
  buttonText
}) => {
  const iconFontSize = iconSize === 'large' ? 64 : 24;
  const iconColor = iconSize === 'large' ? '#BDBDBD' : '#6E7072';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '48px',
        minHeight: '300px',
        gap: iconSize === 'large' ? '16px' : '14px'
      }}
    >
      <FolderOffOutlinedIcon
        sx={{
          fontSize: iconFontSize,
          color: iconColor
        }}
      />
      <Typography
        sx={{
          fontSize: '16px',
          fontWeight: 700,
          color: iconSize === 'large' ? '#424242' : '#6E7072',
          fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
        }}
      >
        {title}
      </Typography>

      {/* Description or action text as inline link */}
      {!showButton && (description || actionText) && (
        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: 400,
            color: iconSize === 'large' ? '#757575' : '#6E7072',
            fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
            textAlign: 'center'
          }}
        >
          {description}
          {actionText && onAction && (
            <>
              {description ? ' ' : 'Start by '}
              <Box
                component="button"
                onClick={onAction}
                sx={{
                  color: '#0C55B8',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  font: 'inherit',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                {actionText}
              </Box>
              .
            </>
          )}
        </Typography>
      )}

      {/* Action button style (for attribute empty state) */}
      {showButton && onAction && (
        <Box
          component="button"
          onClick={onAction}
          sx={{
            backgroundColor: '#002677',
            color: '#FFFFFF',
            borderRadius: '46px',
            padding: '8px 24px',
            fontSize: '14px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
            mt: 1,
            '&:hover': {
              backgroundColor: '#001a5c'
            }
          }}
        >
          {buttonText || actionText || 'Add'}
        </Box>
      )}
    </Box>
  );
};

export default EmptyState;
