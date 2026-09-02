interface CalendarEvent {
  id: string;
  candidateName: string;
  jobTitle: string;
  scheduledAt: Date;
}

const mockScheduledEvents: CalendarEvent[] = [];

export const calendarService = {
  async scheduleInterview(event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> {
    console.log("=====================================");
    console.log(`🗓️ MOCK CALENDAR: Scheduling interview...`);
    console.log(`   Candidate: ${event.candidateName}`);
    console.log(`   Job: ${event.jobTitle}`);
    console.log(`   Time: ${event.scheduledAt}`);
    console.log("=====================================");

    const newEvent: CalendarEvent = { ...event, id: `evt-${Date.now()}` };
    mockScheduledEvents.unshift(newEvent);
    return newEvent;
  },

  async getScheduledInterviews(): Promise<CalendarEvent[]> {
    return [...mockScheduledEvents].sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());
  }
};
