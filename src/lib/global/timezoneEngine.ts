/**
 * Mocks getting the user's current timezone from their browser.
 * In a real application, this would use the Intl.DateTimeFormat API.
 * This should only be called on the client-side.
 * @returns The IANA timezone string (e.g., "America/New_York").
 */
export function getUserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (e) {
    // Fallback for environments where this API might not be available
    return 'UTC';
  }
}

/**
 * Converts a UTC date object to a formatted string in a target timezone.
 * @param utcDate - A Date object representing a time in UTC.
 * @param timezone - The target IANA timezone string.
 * @returns A formatted date and time string in the local timezone.
 */
export function convertUTCToLocal(utcDate: Date, timezone: string): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZone: timezone,
      timeZoneName: 'short',
    }).format(utcDate);
  } catch (e) {
    // Fallback for invalid timezones
    return utcDate.toLocaleString();
  }
}

/**
 * Converts a date from a local timezone to a UTC Date object.
 * This is complex to do reliably without a library like date-fns-tz,
 * so this is a simplified mock.
 * @param localDateTimeString - A date string like "2026-03-10T05:00:00".
 * @param timezone - The IANA timezone the string is from.
 * @returns A Date object representing the equivalent time in UTC.
 */
export function convertLocalToUTC(localDateTimeString: string, timezone: string): Date {
  // WARNING: This is a simplified mock. Parsing date strings is notoriously difficult.
  // A robust solution would use a library like date-fns-tz or luxon.
  const dateInLocal = new Date(localDateTimeString);

  // A rough approximation for demonstration purposes.
  // This does not correctly handle DST changes.
  const offset = new Date().getTimezoneOffset() * 60000;
  const localTime = dateInLocal.getTime();
  const utcTime = localTime + offset;
  return new Date(utcTime);
}
