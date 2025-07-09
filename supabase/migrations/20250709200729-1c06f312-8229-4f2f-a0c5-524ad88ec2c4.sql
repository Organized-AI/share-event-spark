-- Create sample event "Organized AI Hackathon #1" without organizer_id
INSERT INTO public.events (
  name,
  description,
  location,
  event_date,
  organizer_id,
  created_at,
  updated_at
) VALUES (
  'Organized AI Hackathon #1',
  'A collaborative hackathon focused on building innovative AI solutions for real-world problems.',
  'Tech Hub Downtown',
  '2024-08-15 09:00:00+00:00',
  NULL, -- no organizer for now since auth is disabled
  now(),
  now()
);