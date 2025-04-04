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
  if (!dateString) return '';
  
  // Parse the date string
  const date = new Date(dateString);
  
  // Format the date in user's locale with explicit timezone handling
  try {
    // The date will be automatically converted to the user's local timezone
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone // Explicitly use the browser's timezone
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
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  try {
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone // Explicitly use the browser's timezone
    }).format(date);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    // Fallback if Intl API fails
    return date.toLocaleDateString();
  }
}

/**
 * Utility function that converts a UTC timestamp to a specific timezone
 * This is especially useful for server-side rendering where the server might be in a different timezone
 * 
 * @param dateString - ISO date string from the database (UTC)
 * @param timezone - Target timezone (defaults to 'America/Vancouver' for BC, Canada)
 * @returns Formatted date string in the specified timezone
 */
export function formatDateTimeWithTimezone(dateString: string, timezone: string = 'America/Vancouver'): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  try {
    return new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone: timezone
    }).format(date);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    // Fallback if Intl API fails
    return date.toLocaleString('en-CA', { timeZone: timezone });
  }
} 