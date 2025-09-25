-- Fix the database function to handle jsonb arrays correctly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, age, mobile, education, location, interests, skills)
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
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;