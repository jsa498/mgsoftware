/**
 * Date utility functions for consistent handling across the application
 */

/**
 * Formats a date string consistently across environments and timezones
 * by explicitly working with the original UTC time from database
 * 
 * @param dateString - ISO date string from the database
 * @returns Formatted date string in the local timezone
 */
export function formatDateTime(dateString: string): string {
  // Parse the date string as UTC
  const date = new Date(dateString);
  
  // Format the date in user's locale with explicit timezone conversion
  try {
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
      timeZoneName: 'short'
    }).format(date);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    // Fallback if Intl API fails
    return date.toLocaleString();
  }
}

/**
 * Formats just the date portion (without time)
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  
  try {
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    // Fallback if Intl API fails
    return date.toLocaleDateString();
  }
} 