-- Update admins table to store plain text passwords instead of hash
ALTER TABLE public.admins 
RENAME COLUMN password_hash TO password;

-- Update the sample admin with plain text password
UPDATE public.admins 
SET password = 'admin123' 
WHERE email = 'admin@techcorp.com';