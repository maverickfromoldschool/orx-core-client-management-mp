/**
 * Formats a date string or Date object to MM/DD/YYYY format
 */
export const formatDate = (dateInput: string | Date): string => {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

/**
 * Returns current date in MM/DD/YYYY format
 */
export const getTodayFormatted = (): string => {
  return formatDate(new Date());
};
