-- First, create a proper admin authentication system

-- Create admin users table with proper structure
CREATE TABLE IF NOT EXISTS public.admin_users_secure (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on admin_users_secure
ALTER TABLE public.admin_users_secure ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin_user(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.admin_users_secure 
    WHERE user_id = user_uuid 
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create policies for admin_users_secure
CREATE POLICY "Admin users can view their own record" 
ON public.admin_users_secure 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Admin users can update their last_login" 
ON public.admin_users_secure 
FOR UPDATE 
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Update existing RLS policies to use the new admin check function
DROP POLICY IF EXISTS "Admins can view all analytics_events" ON public.analytics_events;
CREATE POLICY "Admins can view all analytics_events" 
ON public.analytics_events 
FOR SELECT 
USING (public.is_admin_user());

DROP POLICY IF EXISTS "Admins can view all user_sessions" ON public.user_sessions;
CREATE POLICY "Admins can view all user_sessions" 
ON public.user_sessions 
FOR SELECT 
USING (public.is_admin_user());

DROP POLICY IF EXISTS "Admins can view edge function logs" ON public.edge_function_logs;
CREATE POLICY "Admins can view edge function logs" 
ON public.edge_function_logs 
FOR SELECT 
USING (public.is_admin_user());

DROP POLICY IF EXISTS "Admins can update contacts" ON public.contacts;
CREATE POLICY "Admins can update contacts" 
ON public.contacts 
FOR UPDATE 
USING (public.is_admin_user());

-- Create audit log table for security events
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  event_type TEXT NOT NULL,
  event_description TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on security audit log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs" 
ON public.security_audit_log 
FOR SELECT 
USING (public.is_admin_user());

-- Anyone can insert audit logs (for security events)
CREATE POLICY "Allow audit log inserts" 
ON public.security_audit_log 
FOR INSERT 
WITH CHECK (true);

-- Create function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_event_type TEXT,
  p_event_description TEXT,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.security_audit_log (
    user_id,
    event_type,
    event_description,
    ip_address,
    user_agent,
    metadata
  ) VALUES (
    auth.uid(),
    p_event_type,
    p_event_description,
    p_ip_address,
    p_user_agent,
    p_metadata
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add rate limiting table
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier TEXT NOT NULL, -- IP address or user ID
  action TEXT NOT NULL, -- 'login_attempt', 'contact_form', etc.
  attempts INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  blocked_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(identifier, action)
);

-- Enable RLS on rate limits
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Only admins can view rate limit data
CREATE POLICY "Admins can view rate limits" 
ON public.rate_limits 
FOR SELECT 
USING (public.is_admin_user());

-- Allow edge functions to manage rate limits
CREATE POLICY "Edge functions can manage rate limits" 
ON public.rate_limits 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create function to check rate limits
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_identifier TEXT,
  p_action TEXT,
  p_max_attempts INTEGER DEFAULT 5,
  p_window_minutes INTEGER DEFAULT 15
)
RETURNS BOOLEAN AS $$
DECLARE
  current_attempts INTEGER;
  window_start TIMESTAMP WITH TIME ZONE;
  is_blocked BOOLEAN;
BEGIN
  -- Clean up old rate limit entries
  DELETE FROM public.rate_limits 
  WHERE window_start < (now() - INTERVAL '1 hour');
  
  -- Check if currently blocked
  SELECT blocked_until > now() INTO is_blocked
  FROM public.rate_limits
  WHERE identifier = p_identifier AND action = p_action;
  
  IF is_blocked THEN
    RETURN FALSE;
  END IF;
  
  -- Get current attempts in window
  SELECT attempts, window_start INTO current_attempts, window_start
  FROM public.rate_limits
  WHERE identifier = p_identifier 
  AND action = p_action
  AND window_start > (now() - (p_window_minutes || ' minutes')::INTERVAL);
  
  IF current_attempts IS NULL THEN
    -- First attempt in window
    INSERT INTO public.rate_limits (identifier, action, attempts, window_start)
    VALUES (p_identifier, p_action, 1, now())
    ON CONFLICT (identifier, action) 
    DO UPDATE SET 
      attempts = 1, 
      window_start = now(),
      blocked_until = NULL,
      updated_at = now();
    RETURN TRUE;
  ELSIF current_attempts < p_max_attempts THEN
    -- Within limit, increment
    UPDATE public.rate_limits 
    SET attempts = attempts + 1, updated_at = now()
    WHERE identifier = p_identifier AND action = p_action;
    RETURN TRUE;
  ELSE
    -- Exceeded limit, block for window duration
    UPDATE public.rate_limits 
    SET 
      blocked_until = now() + (p_window_minutes || ' minutes')::INTERVAL,
      updated_at = now()
    WHERE identifier = p_identifier AND action = p_action;
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for updating timestamps
CREATE TRIGGER update_admin_users_secure_updated_at
  BEFORE UPDATE ON public.admin_users_secure
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rate_limits_updated_at
  BEFORE UPDATE ON public.rate_limits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();