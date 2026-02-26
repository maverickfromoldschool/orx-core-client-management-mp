import {ProductAttribute} from './types';

/**
 * Format date string to MM/DD/YYYY format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

/**
 * Validate product attribute data
 */
export const validateAttribute = (attribute: Partial<ProductAttribute>): boolean => {
  return !!(attribute.attribute && attribute.attributeVal && attribute.startDate);
};

/**
 * Calculate total pages based on total count and page size
 */
export const calculateTotalPages = (totalCount: number, pageSize: number): number => {
  return Math.ceil(totalCount / pageSize);
};

/**
 * Get page range for pagination display
 */
export const getPageRange = (currentPage: number, totalPages: number, maxVisible = 5): number[] => {
  const pages: number[] = [];
  const halfVisible = Math.floor(maxVisible / 2);

  let startPage = Math.max(0, currentPage - halfVisible);
  const endPage = Math.min(totalPages - 1, startPage + maxVisible - 1);

  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(0, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i += 1) {
    pages.push(i);
  }

  return pages;
};
