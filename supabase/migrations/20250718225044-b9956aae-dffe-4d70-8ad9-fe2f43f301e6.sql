-- Create admin authentication table
CREATE TABLE public.admin_auth (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_auth ENABLE ROW LEVEL SECURITY;

-- Insert default admin user (password: admin)
-- Using bcrypt hash for 'admin'
INSERT INTO public.admin_auth (username, password_hash) 
VALUES ('admin', '$2b$10$8K1p/a0dqbVXiCtP4/9MZOLMrPJTBTfuDkpMwQE/qeE.FdLNvI6y6');

-- Add RLS policy for admin authentication
CREATE POLICY "Allow admin auth access" 
ON public.admin_auth 
FOR SELECT 
USING (true);

-- Create edge function logs storage table
CREATE TABLE public.edge_function_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  function_name TEXT NOT NULL,
  log_level TEXT NOT NULL CHECK (log_level IN ('info', 'warn', 'error', 'debug')),
  message TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for logs
ALTER TABLE public.edge_function_logs ENABLE ROW LEVEL SECURITY;

-- Allow admin access to logs
CREATE POLICY "Admins can view edge function logs" 
ON public.edge_function_logs 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()
));

-- Allow edge functions to insert logs
CREATE POLICY "Edge functions can insert logs" 
ON public.edge_function_logs 
FOR INSERT 
WITH CHECK (true);

-- Add webhook column to contacts table
ALTER TABLE public.contacts ADD COLUMN webhook_sent BOOLEAN DEFAULT false;
ALTER TABLE public.contacts ADD COLUMN responded_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.contacts ADD COLUMN response_status TEXT;

-- Add download details to analytics_events 
ALTER TABLE public.analytics_events ADD COLUMN download_details JSONB;