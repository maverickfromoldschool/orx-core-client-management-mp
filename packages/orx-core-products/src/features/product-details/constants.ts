/**
 * Product Details Feature Constants
 */

/**
 * Color palette for the product details feature
 */
export const COLORS = {
  background: {
    page: '#FAFCFF',
    card: '#FFFFFF',
    iconContainer: '#ECFAFC'
  },
  border: {
    default: '#CBCCCD',
    divider: '#CBCCCD'
  },
  text: {
    heading: '#002677',
    primary: '#000000',
    secondary: '#4B4D4F',
    label: '#323334',
    link: '#0C55B8'
  },
  button: {
    primary: {
      background: '#002677',
      text: '#FBF9F4',
      hover: '#001a5c'
    },
    secondary: {
      background: '#FBF9F4',
      text: '#002677',
      border: '#002677',
      hover: '#f5f0e8'
    },
    tertiary: {
      background: '#FFFFFF',
      text: '#323334',
      border: '#323334',
      hover: '#f5f5f5'
    }
  },
  status: {
    active: {
      background: '#EFF6EF',
      text: '#007000'
    },
    inactive: {
      background: '#F5F5F5',
      text: '#4B4D4F'
    },
    pending: {
      background: '#FFF4E5',
      text: '#FF9800'
    }
  }
} as const;

/**
 * Typography settings
 */
export const TYPOGRAPHY = {
  fontFamily: 'Enterprise Sans VF',
  heading: {
    large: {
      fontSize: '32px',
      lineHeight: '38.4px',
      fontWeight: 700
    },
    medium: {
      fontSize: '29px',
      lineHeight: '34.8px',
      fontWeight: 700
    },
    small: {
      fontSize: '20px',
      lineHeight: '24px',
      fontWeight: 700
    }
  },
  body: {
    large: {
      regular: {
        fontSize: '16px',
        lineHeight: '22.4px',
        fontWeight: 400
      },
      bold: {
        fontSize: '16px',
        lineHeight: '22.4px',
        fontWeight: 700
      }
    },
    medium: {
      regular: {
        fontSize: '14px',
        lineHeight: '19.6px',
        fontWeight: 400
      },
      bold: {
        fontSize: '14px',
        lineHeight: '19.6px',
        fontWeight: 700
      }
    },
    small: {
      fontSize: '12px',
      lineHeight: '14.4px',
      fontWeight: 500
    }
  }
} as const;

/**
 * Spacing values
 */
export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '42px'
} as const;

/**
 * Border radius values
 */
export const BORDER_RADIUS = {
  small: '4px',
  medium: '10px',
  large: '12px',
  pill: '46px'
} as const;

/**
 * Card dimensions
 */
export const DIMENSIONS = {
  pageWidth: '1440px',
  contentWidth: '1272px',
  cardWidth: '1268px',
  summaryCardWidth: '598px',
  iconSize: {
    small: '20px',
    medium: '24px',
    large: '48px'
  }
} as const;

/**
 * Menu item types for Add New dropdown
 */
export const ADD_NEW_MENU_ITEMS = [
  {
    value: 'relationship' as const,
    label: 'Product Relationship'
  },
  {
    value: 'variant' as const,
    label: 'Product Variant'
  }
] as const;

/**
 * View details types
 */
export const VIEW_DETAILS_TYPES = {
  INFORMATION: 'information' as const,
  RELATIONSHIP: 'relationship' as const,
  VARIANT: 'variant' as const,
  PRICE_LIST: 'priceList' as const
} as const;

/**
 * Product status values
 */
export const PRODUCT_STATUS = {
  ACTIVE: 'active' as const,
  INACTIVE: 'inactive' as const,
  PENDING: 'pending' as const
} as const;
