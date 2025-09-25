-- Create admin table for company administrators
CREATE TABLE public.admins (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  company_name text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  is_active boolean NOT NULL DEFAULT true
);

-- Enable RLS for admins table
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Add company_id to internships table to link internships to companies
ALTER TABLE public.internships ADD COLUMN company_id uuid REFERENCES public.admins(id);

-- Update existing internships to link them to a default admin (will be updated manually)
-- We'll leave company_id as nullable for now since existing internships exist

-- Create policies for admins table
CREATE POLICY "Admins can view their own record"
  ON public.admins
  FOR SELECT
  USING (auth.uid()::text = id::text);

-- Create policies for internships - admins can manage their company's internships
CREATE POLICY "Admins can view their company internships"
  ON public.internships
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admins 
      WHERE admins.id = internships.company_id 
      AND auth.uid()::text = admins.id::text
    )
  );

-- Create policies for applications - admins can view applications for their internships
CREATE POLICY "Admins can view applications for their internships"
  ON public.applications
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.internships i
      JOIN public.admins a ON i.company_id = a.id
      WHERE i.id = applications.internship_id
      AND auth.uid()::text = a.id::text
    )
  );

-- Allow admins to update application status
CREATE POLICY "Admins can update applications for their internships"
  ON public.applications
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.internships i
      JOIN public.admins a ON i.company_id = a.id
      WHERE i.id = applications.internship_id
      AND auth.uid()::text = a.id::text
    )
  );

-- Create trigger for updating updated_at on admins table
CREATE TRIGGER update_admins_updated_at
  BEFORE UPDATE ON public.admins
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert a sample admin for testing (password is 'admin123' hashed with bcrypt)
-- You can manually add more admins by inserting into this table
INSERT INTO public.admins (email, password_hash, company_name)
VALUES (
  'admin@techcorp.com',
  '$2b$10$rN8NfU.6oJ9LGQLagZUTA.RCKgHKGBQm7YCgp8E.QvLs.XhGp9Mm6',
  'TechCorp Solutions'
);