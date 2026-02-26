/**
 * Product Variant Assignment Utilities
 *
 * Utility functions for formatting and data manipulation.
 */

import {DATE_FORMAT, BOOLEAN_DISPLAY} from './constants';

/**
 * Format a date string to MM/DD/YYYY format or return placeholder if null/empty
 *
 * @param date - ISO 8601 date string or null
 * @returns Formatted date string or placeholder
 */
export function formatDate(date: string | null): string {
  if (!date) {
    return DATE_FORMAT.PLACEHOLDER;
  }

  try {
    const dateObj = new Date(date);

    // Check if date is valid
    if (Number.isNaN(dateObj.getTime())) {
      return DATE_FORMAT.PLACEHOLDER;
    }

    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const year = dateObj.getFullYear();

    return `${month}/${day}/${year}`;
  } catch (error) {
    console.error(error);
    return DATE_FORMAT.PLACEHOLDER;
  }
}

/**
 * Format a boolean value to "Yes" or "No"
 *
 * @param value - Boolean value
 * @returns "Yes" for true, "No" for false
 */
export function formatBoolean(value: boolean): string {
  return value ? BOOLEAN_DISPLAY.TRUE : BOOLEAN_DISPLAY.FALSE;
}

/**
 * Parse a date string from MM/DD/YYYY format to ISO 8601 format
 *
 * @param dateString - Date string in MM/DD/YYYY format
 * @returns ISO 8601 date string or null if invalid
 */
export function parseDate(dateString: string): string | null {
  if (!dateString || dateString === DATE_FORMAT.PLACEHOLDER) {
    return null;
  }

  try {
    const parts = dateString.split('/');
    if (parts.length !== 3) {
      return null;
    }

    const month = parts[0];
    const day = parts[1];
    const year = parts[2];

    if (!month || !day || !year) {
      return null;
    }

    const dateObj = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));

    // Check if date is valid
    if (Number.isNaN(dateObj.getTime())) {
      return null;
    }

    const isoDate = dateObj.toISOString().split('T')[0];
    return isoDate || null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

/**
 * Check if a date string is valid
 *
 * @param dateString - Date string to validate
 * @returns True if valid, false otherwise
 */
export function isValidDate(dateString: string): boolean {
  if (!dateString) {
    return false;
  }

  try {
    const dateObj = new Date(dateString);
    return !Number.isNaN(dateObj.getTime());
  } catch (error) {
    console.error(error);
    return false;
  }
}

/**
 * Compare two dates
 *
 * @param date1 - First date string
 * @param date2 - Second date string
 * @returns -1 if date1 < date2, 0 if equal, 1 if date1 > date2
 */
export function compareDates(date1: string | null, date2: string | null): number {
  if (!date1 || !date2) {
    return 0;
  }

  const d1 = new Date(date1);
  const d2 = new Date(date2);

  if (d1.getTime() < d2.getTime()) {
    return -1;
  } else if (d1.getTime() > d2.getTime()) {
    return 1;
  }
  return 0;
}

/**
 * Check if filters are active (have non-null values)
 *
 * @param filters - Filter object
 * @returns True if any filter has a non-null value
 */
export function hasActiveFilters(filters: Record<string, any>): boolean {
  return Object.values(filters).some((value) => value !== null && value !== undefined);
}

/**
 * Generate pagination page numbers with ellipsis
 *
 * @param currentPage - Current page number
 * @param totalPages - Total number of pages
 * @param maxVisible - Maximum number of visible page numbers
 * @returns Array of page numbers or 'ellipsis' string
 */
export function generatePageNumbers(currentPage: number, totalPages: number, maxVisible = 7): (number | 'ellipsis')[] {
  if (totalPages <= maxVisible) {
    return Array.from({length: totalPages}, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [];
  const halfVisible = Math.floor(maxVisible / 2);

  // Always show first page
  pages.push(1);

  let startPage = Math.max(2, currentPage - halfVisible);
  let endPage = Math.min(totalPages - 1, currentPage + halfVisible);

  // Adjust if we're near the start
  if (currentPage <= halfVisible) {
    endPage = maxVisible - 1;
  }

  // Adjust if we're near the end
  if (currentPage >= totalPages - halfVisible) {
    startPage = totalPages - maxVisible + 2;
  }

  // Add ellipsis after first page if needed
  if (startPage > 2) {
    pages.push('ellipsis');
  }

  // Add middle pages
  for (let i = startPage; i <= endPage; i += 1) {
    pages.push(i);
  }

  // Add ellipsis before last page if needed
  if (endPage < totalPages - 1) {
    pages.push('ellipsis');
  }

  // Always show last page
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
}
