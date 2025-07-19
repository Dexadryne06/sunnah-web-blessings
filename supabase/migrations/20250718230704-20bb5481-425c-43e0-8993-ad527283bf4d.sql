-- Add unique constraint and dummy admin user for dashboard access
ALTER TABLE public.admin_users ADD CONSTRAINT admin_users_user_id_unique UNIQUE (user_id);

-- Insert a dummy admin user for dashboard access  
INSERT INTO public.admin_users (user_id, email, role) 
VALUES ('00000000-0000-0000-0000-000000000000', 'admin@example.com', 'admin');