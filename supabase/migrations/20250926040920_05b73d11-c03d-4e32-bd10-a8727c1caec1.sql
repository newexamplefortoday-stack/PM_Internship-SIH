-- Create trigger function to auto-populate student info from profile
CREATE OR REPLACE FUNCTION public.populate_student_info_on_application()
RETURNS TRIGGER AS $$
BEGIN
  -- Get student name and email from profiles table
  SELECT name, email
  INTO NEW.student_name, NEW.student_email
  FROM public.profiles
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to auto-populate student info before insert
CREATE TRIGGER populate_student_info_trigger
  BEFORE INSERT ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.populate_student_info_on_application();