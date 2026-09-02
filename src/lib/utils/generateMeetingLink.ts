/**
 * Mocks the generation of a unique meeting link.
 * In a real application, this would call a service like Google Meet or Zoom API.
 * @returns A mock meeting URL string.
 */
export function generateMeetingLink(): string {
  const randomId = Math.random().toString(36).substring(2, 10);
  return `https://meet.baalvion.com/${randomId}`;
}
