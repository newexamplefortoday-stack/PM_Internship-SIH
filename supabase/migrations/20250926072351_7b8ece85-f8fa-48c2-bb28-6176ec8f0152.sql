-- Update internships to link to the existing admin
UPDATE public.internships 
SET company_id = (SELECT id FROM public.admins LIMIT 1)
WHERE company_id IS NULL;