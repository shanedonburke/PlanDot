/**
 * @returns Today's date with the time set to midnight
 */
export function getTodaysDate(): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * Determines whether an object represents a valid date.
 * @param date The date to check
 * @returns True if the date is a {@link Date} object with a valid time.
 */
export function isValidDate(date: Date): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}