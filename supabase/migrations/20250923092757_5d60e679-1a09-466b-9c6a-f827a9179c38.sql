-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  mobile TEXT NOT NULL UNIQUE,
  education TEXT NOT NULL,
  location TEXT NOT NULL,
  interests TEXT[],
  skills TEXT[],
  profile_completion INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create internships table
CREATE TABLE public.internships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  company_logo TEXT,
  location TEXT NOT NULL,
  stipend INTEGER NOT NULL,
  duration_months INTEGER NOT NULL,
  required_skills TEXT[],
  description TEXT NOT NULL,
  eligibility_criteria TEXT[],
  benefits TEXT[],
  application_deadline DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cities table for search functionality
CREATE TABLE public.cities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  state TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create applications table to track user applications
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  internship_id UUID NOT NULL REFERENCES public.internships(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, internship_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for internships (public read, admin write)
CREATE POLICY "Anyone can view active internships" 
ON public.internships 
FOR SELECT 
USING (is_active = true);

-- RLS Policies for cities (public read)
CREATE POLICY "Anyone can view cities" 
ON public.cities 
FOR SELECT 
USING (true);

-- RLS Policies for applications
CREATE POLICY "Users can view their own applications" 
ON public.applications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own applications" 
ON public.applications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert cities data
INSERT INTO public.cities (name, state) VALUES
('Mumbai', 'Maharashtra'),
('Delhi', 'Delhi'),
('Bangalore', 'Karnataka'),
('Hyderabad', 'Telangana'),
('Chennai', 'Tamil Nadu'),
('Kolkata', 'West Bengal'),
('Pune', 'Maharashtra'),
('Ahmedabad', 'Gujarat'),
('Jaipur', 'Rajasthan'),
('Lucknow', 'Uttar Pradesh'),
('Kanpur', 'Uttar Pradesh'),
('Nagpur', 'Maharashtra'),
('Indore', 'Madhya Pradesh'),
('Thane', 'Maharashtra'),
('Bhopal', 'Madhya Pradesh'),
('Visakhapatnam', 'Andhra Pradesh'),
('Pimpri-Chinchwad', 'Maharashtra');

-- Insert dummy internship data
INSERT INTO public.internships (title, company_name, company_logo, location, stipend, duration_months, required_skills, description, eligibility_criteria, benefits, application_deadline, is_active) VALUES
('Data Science Intern', 'TechCorp Solutions', '/placeholder.svg', 'Mumbai', 25000, 6, ARRAY['Python', 'Machine Learning', 'SQL'], 'Work on cutting-edge data science projects with real-world impact. Learn from industry experts and contribute to innovative solutions.', ARRAY['Age 18-25', 'Engineering/Science Background', 'Basic Programming Knowledge'], ARRAY['Stipend of ₹25,000', 'Certificate', 'Mentorship'], '2024-12-31', true),
('Digital Marketing Intern', 'MarketPro Agency', '/placeholder.svg', 'Delhi', 20000, 4, ARRAY['Digital Marketing', 'Social Media', 'Content Creation'], 'Join our dynamic marketing team and learn the latest digital marketing strategies and tools.', ARRAY['Age 18-25', 'Any Graduation', 'Creative Mindset'], ARRAY['Stipend of ₹20,000', 'Industry Exposure', 'Certificate'], '2024-12-25', true),
('Software Development Intern', 'InnovateTech', '/placeholder.svg', 'Bangalore', 30000, 6, ARRAY['JavaScript', 'React', 'Node.js'], 'Build scalable web applications and work with modern technologies in an agile environment.', ARRAY['Age 18-25', 'Engineering Background', 'Programming Skills'], ARRAY['Stipend of ₹30,000', 'Full-time Opportunity', 'Training'], '2024-12-20', true),
('UI/UX Design Intern', 'DesignHub Studio', '/placeholder.svg', 'Pune', 22000, 5, ARRAY['Figma', 'Adobe Creative Suite', 'Prototyping'], 'Create beautiful and user-friendly designs for mobile and web applications.', ARRAY['Age 18-25', 'Design Background', 'Portfolio Required'], ARRAY['Stipend of ₹22,000', 'Creative Freedom', 'Mentorship'], '2024-12-28', true),
('Business Analyst Intern', 'ConsultCorp', '/placeholder.svg', 'Hyderabad', 28000, 6, ARRAY['Excel', 'Data Analysis', 'Business Intelligence'], 'Analyze business processes and provide insights to improve operational efficiency.', ARRAY['Age 18-25', 'MBA/Engineering', 'Analytical Skills'], ARRAY['Stipend of ₹28,000', 'Client Interaction', 'Certificate'], '2024-12-15', true),
('Content Writing Intern', 'MediaWorks', '/placeholder.svg', 'Chennai', 18000, 3, ARRAY['Content Writing', 'SEO', 'Research'], 'Create engaging content for various platforms and learn content marketing strategies.', ARRAY['Age 18-25', 'English Proficiency', 'Writing Samples'], ARRAY['Stipend of ₹18,000', 'Published Work', 'Certificate'], '2024-12-22', true),
('Mobile App Development Intern', 'AppGenius', '/placeholder.svg', 'Kolkata', 26000, 5, ARRAY['Flutter', 'React Native', 'Mobile Development'], 'Develop cross-platform mobile applications and learn mobile development best practices.', ARRAY['Age 18-25', 'Computer Science', 'Mobile Dev Interest'], ARRAY['Stipend of ₹26,000', 'App Store Publishing', 'Training'], '2024-12-18', true),
('Financial Analyst Intern', 'FinanceHub', '/placeholder.svg', 'Ahmedabad', 24000, 4, ARRAY['Financial Modeling', 'Excel', 'Accounting'], 'Work with financial data and learn investment analysis and financial planning.', ARRAY['Age 18-25', 'Commerce/Finance Background', 'Numerical Skills'], ARRAY['Stipend of ₹24,000', 'Industry Training', 'Certificate'], '2024-12-30', true);

-- Create function to handle new user registration
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();