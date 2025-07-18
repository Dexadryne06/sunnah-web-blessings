-- Add a dummy admin user for dashboard access
INSERT INTO public.admin_users (user_id, email, role) 
VALUES ('00000000-0000-0000-0000-000000000000', 'admin@example.com', 'admin')
ON CONFLICT (user_id) DO NOTHING;