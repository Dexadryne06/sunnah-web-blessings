-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create current_prayer_times table that will hold today's prayer times
CREATE TABLE public.current_prayer_times (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fajr TIME NOT NULL,
  sunrise TIME NOT NULL,
  dhuhr TIME NOT NULL,
  asr TIME NOT NULL,
  maghrib TIME NOT NULL,
  isha TIME NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.current_prayer_times ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Current prayer times are viewable by everyone" 
ON public.current_prayer_times 
FOR SELECT 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_current_prayer_times_updated_at
  BEFORE UPDATE ON public.current_prayer_times
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Schedule the function to run daily at 00:01
SELECT cron.schedule(
  'update-prayer-times-daily',
  '1 0 * * *',
  $$
  select
    net.http_post(
      url:='https://pspbnpkwnudwktxqmvos.supabase.co/functions/v1/update-daily-prayer-times',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzcGJucGt3bnVkd2t0eHFtdm9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2NTUwNjMsImV4cCI6MjA2ODIzMTA2M30.gXKliZ0oN_0doArVVnp31PK1qTZvGRRVAH5sdZWlJ0M"}'::jsonb,
      body:='{}'::jsonb
    ) as request_id;
  $$
);