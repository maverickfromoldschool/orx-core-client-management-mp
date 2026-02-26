/**
 * Format date string to display format
 * @param dateString - ISO date string
 * @returns Formatted date string (e.g., "Jan 24 2026, 7:56:40 PM")
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  };
  return date.toLocaleString('en-US', options);
};

/**
 * Get status badge color based on status
 * @param status - Product status
 * @returns Object with background and text colors
 */
export const getStatusColors = (status: 'active' | 'inactive' | 'pending') => {
  const colorMap = {
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
  };

  return colorMap[status] || colorMap.active;
};

/**
 * Calculate total count for product information
 * @param attributesCount - Number of attributes
 * @param transactionLabelsCount - Number of transaction labels
 * @returns Total count
 */
export const calculateTotalCount = (attributesCount: number, transactionLabelsCount: number): number => {
  return attributesCount + transactionLabelsCount;
};
