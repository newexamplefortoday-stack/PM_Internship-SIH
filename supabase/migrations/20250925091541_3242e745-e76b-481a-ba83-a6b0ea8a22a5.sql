-- Add email column to profiles table
ALTER TABLE public.profiles ADD COLUMN email text;

-- Update existing profiles with email from auth.users
UPDATE public.profiles 
SET email = auth.users.email 
FROM auth.users 
WHERE profiles.user_id = auth.users.id;

-- Update the trigger function to include email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, name, age, mobile, education, location, interests, skills, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', ''),
    COALESCE((NEW.raw_user_meta_data ->> 'age')::integer, 0),
    COALESCE(NEW.raw_user_meta_data ->> 'mobile', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'education', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'location', ''),
    -- Handle interests array correctly for jsonb
    CASE 
      WHEN NEW.raw_user_meta_data -> 'interests' IS NOT NULL 
      THEN ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data -> 'interests'))
      ELSE ARRAY[]::text[]
    END,
    -- Handle skills array correctly for jsonb
    CASE 
      WHEN NEW.raw_user_meta_data -> 'skills' IS NOT NULL 
      THEN ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data -> 'skills'))
      ELSE ARRAY[]::text[]
    END,
    NEW.email
  );
  RETURN NEW;
END;
$function$;
