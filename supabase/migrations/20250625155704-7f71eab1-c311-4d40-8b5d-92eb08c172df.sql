
-- Make organizer_id nullable to allow Luma imports without requiring a user
ALTER TABLE public.events ALTER COLUMN organizer_id DROP NOT NULL;
