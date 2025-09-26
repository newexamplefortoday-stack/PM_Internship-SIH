-- Add name and email columns to applications table for student information
ALTER TABLE public.applications ADD COLUMN student_name text;
ALTER TABLE public.applications ADD COLUMN student_email text;
