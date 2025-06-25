
export interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  access_code: string;
  organizer_id: string;
  created_at: string;
  updated_at: string;
}

export interface EventParticipant {
  id: string;
  event_id: string;
  user_id: string;
  role: 'organizer' | 'speaker' | 'sponsor' | 'attendee' | 'volunteer';
  created_at: string;
}

export interface ContentFolder {
  id: string;
  name: string;
  type: 'speakers' | 'sponsors' | 'attendees' | 'volunteers' | 'atmosphere' | 'ai-content';
  description: string;
  icon: string;
}
