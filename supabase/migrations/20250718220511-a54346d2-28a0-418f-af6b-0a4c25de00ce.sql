-- Create analytics table for tracking all user interactions
CREATE TABLE public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  event_name TEXT NOT NULL,
  user_session TEXT,
  page_url TEXT,
  element_text TEXT,
  element_id TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT
);

-- Create admin users table
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create session tracking table
CREATE TABLE public.user_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_time TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  pages_visited INTEGER DEFAULT 1,
  total_clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Policies for analytics_events (allow public insert for tracking)
CREATE POLICY "Allow public insert on analytics_events" 
ON public.analytics_events 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all analytics_events" 
ON public.analytics_events 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.admin_users 
  WHERE user_id = auth.uid()
));

-- Policies for admin_users
CREATE POLICY "Admins can view admin_users" 
ON public.admin_users 
FOR SELECT 
USING (user_id = auth.uid());

-- Policies for user_sessions
CREATE POLICY "Allow public insert on user_sessions" 
ON public.user_sessions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update on user_sessions" 
ON public.user_sessions 
FOR UPDATE 
USING (true);

CREATE POLICY "Admins can view all user_sessions" 
ON public.user_sessions 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.admin_users 
  WHERE user_id = auth.uid()
));

-- Create indexes for better performance
CREATE INDEX idx_analytics_events_event_type ON public.analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON public.analytics_events(created_at);
CREATE INDEX idx_analytics_events_page_url ON public.analytics_events(page_url);
CREATE INDEX idx_user_sessions_session_id ON public.user_sessions(session_id);
CREATE INDEX idx_user_sessions_start_time ON public.user_sessions(start_time);

-- Create trigger for updating user_sessions updated_at
CREATE TRIGGER update_user_sessions_updated_at
BEFORE UPDATE ON public.user_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();