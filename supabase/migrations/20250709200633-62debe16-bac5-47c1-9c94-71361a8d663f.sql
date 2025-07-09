-- Create sample event "Organized AI Hackathon #1"
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
  '00000000-0000-0000-0000-000000000000', -- placeholder organizer ID
  now(),
  now()
);