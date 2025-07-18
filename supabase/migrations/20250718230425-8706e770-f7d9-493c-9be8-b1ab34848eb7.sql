-- Fix RLS policies for dashboard access

-- Allow admin users to view contacts
CREATE POLICY "Admins can view contacts" 
ON public.contacts 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()
));

-- Allow admin users to update contacts (for webhook status)
CREATE POLICY "Admins can update contacts" 
ON public.contacts 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()
));

-- Fix user_sessions policy - allow public access since it's just analytics
DROP POLICY IF EXISTS "Allow public insert on user_sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Allow public update on user_sessions" ON public.user_sessions;

CREATE POLICY "Allow public access to user_sessions" 
ON public.user_sessions 
FOR ALL 
USING (true)
WITH CHECK (true);