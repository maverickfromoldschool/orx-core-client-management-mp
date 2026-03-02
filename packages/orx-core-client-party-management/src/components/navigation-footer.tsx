import React, {useState, useEffect} from 'react';
import {Box, Button} from '@mui/material';

/**
 * Props for the NavigationFooter component
 */
export interface NavigationFooterProps {
  /** Callback when Next button is clicked */
  onNext: () => void;
  /** Callback when Go Back button is clicked */
  onBack: () => void;
  /** Label for the Next button. Defaults to "Next" */
  nextLabel?: string;
  /** Label for the Go Back button. Defaults to "Go Back" */
  backLabel?: string;
  /** Whether to show the Go Back button. Defaults to true */
  showBack?: boolean;
  /** Whether to show the Next button. Defaults to true */
  showNext?: boolean;
  /** Whether the Next button is disabled. Defaults to false */
  nextDisabled?: boolean;
  /** Whether the footer should have a fixed position at the bottom. Defaults to false */
  fixedPosition?: boolean;
  /** Whether to automatically enable fixed positioning when vertical scroll is detected. Defaults to false */
  autoFixOnScroll?: boolean;
}

export const NAV_FOOTER_MIN_HEIGHT = 77;

/**
 * NavigationFooter component displays navigation buttons for multi-step forms.
 *
 * Requirements:
 * - 9.1: Display "Next" primary button aligned to the right
 * - 9.2: Display "Go Back" tertiary button to the left of Next button
 * - 9.3: Next button has dark blue background (#002677) with white text and 46px border radius
 * - 9.4: Go Back button has white background with dark gray border (#323334) and 46px border radius
 * - 9.7: Footer bar with top border (#CBCCCD) and 4px vertical padding, 84px horizontal padding
 * - 9.8: Button group has 10px gap between buttons
 */
export const NavigationFooter: React.FC<NavigationFooterProps> = ({
  onNext,
  onBack,
  nextLabel = 'Next',
  backLabel = 'Go Back',
  showBack = true,
  showNext = true,
  nextDisabled = false,
  fixedPosition = true,
  autoFixOnScroll = true
}) => {
  const [hasVerticalScroll, setHasVerticalScroll] = useState(false);

  useEffect(() => {
    if (!autoFixOnScroll) {
      return undefined;
    }

    const checkScrollable = () => {
      // Check if document height exceeds viewport height
      const isScrollable = document.documentElement.scrollHeight > window.innerHeight;
      setHasVerticalScroll(isScrollable);
    };

    // Check on mount
    checkScrollable();

    // Check on resize
    window.addEventListener('resize', checkScrollable);

    // Optional: Use MutationObserver to detect DOM changes that might affect height
    const observer = new MutationObserver(checkScrollable);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true
    });

    return () => {
      window.removeEventListener('resize', checkScrollable);
      observer.disconnect();
    };
  }, [autoFixOnScroll]);

  // Determine if footer should be fixed
  const shouldBeFixed = autoFixOnScroll ? hasVerticalScroll : fixedPosition;

  let parentSx: Record<string, string | number> = {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '10px', // Figma: 10px gap between buttons
    borderTop: '1px solid #CBCCCD', // Figma: top border
    padding: '4px 84px', // Figma: 4px vertical, 84px horizontal padding
    backgroundColor: '#FFFFFF', // Figma: white background
    minHeight: '77px', // Figma: 77px height
    marginTop: 3,
    marginLeft: '-84px', // Extend to full width
    marginRight: '-84px',
    width: 'calc(100% + 168px)' // Account for negative margins
  };
  if (shouldBeFixed) {
    parentSx = {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: '10px', // Figma: 10px gap between buttons
      borderTop: '1px solid #CBCCCD', // Figma: top border
      padding: '4px 84px', // Figma: 4px vertical, 84px horizontal padding
      backgroundColor: '#FFFFFF', // Figma: white background
      minHeight: `${NAV_FOOTER_MIN_HEIGHT}px`, // Figma: 77px height
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1000
    };
  }

  return (
    <Box sx={parentSx}>
      {/* Next button - Primary button (Figma: Dark Blue fill) */}
      {showNext && (
        <Button
          variant="contained"
          onClick={onNext}
          disabled={nextDisabled}
          sx={{
            backgroundColor: '#002677', // Figma: Optum/Secondary/Dark Blue
            color: '#FBF9F4', // Figma: Optum/Secondary/Warm White
            borderRadius: '46px', // Figma: 46px border radius
            padding: '10px 24px', // Figma: 10px 24px padding
            fontSize: '16px', // Figma: Desktop/Body/L/Bold
            fontWeight: 700,
            lineHeight: 1.4,
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#001a5c',
              boxShadow: 'none'
            },
            '&:disabled': {
              backgroundColor: '#CBCCCD',
              color: '#FFFFFF'
            }
          }}
        >
          {nextLabel}
        </Button>
      )}

      {/* Go Back button - Tertiary button (Figma: White fill with border) */}
      {showBack && (
        <Button
          variant="outlined"
          onClick={onBack}
          sx={{
            backgroundColor: '#FFFFFF', // Figma: Neutrals/White
            color: '#323334', // Figma: Neutrals/Neutral 80
            borderColor: '#323334', // Figma: Neutrals/Neutral 80 stroke
            borderWidth: '1px',
            borderRadius: '46px', // Figma: 46px border radius
            padding: '10px 24px', // Figma: 10px 24px padding
            fontSize: '16px', // Figma: Desktop/Body/L/Bold
            fontWeight: 700,
            lineHeight: 1.4,
            textTransform: 'none',
            height: '42px', // Figma: fixed height 42px
            '&:hover': {
              backgroundColor: '#F5F5F5',
              borderColor: '#323334'
            }
          }}
        >
          {backLabel}
        </Button>
      )}
    </Box>
  );
};

export default NavigationFooter;
