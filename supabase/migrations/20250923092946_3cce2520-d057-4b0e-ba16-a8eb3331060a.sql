-- Fix security warnings by setting search_path for functions
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

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
    COALESCE(ARRAY(SELECT json_array_elements_text(NEW.raw_user_meta_data -> 'interests')), ARRAY[]::text[]),
    COALESCE(ARRAY(SELECT json_array_elements_text(NEW.raw_user_meta_data -> 'skills')), ARRAY[]::text[])
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;