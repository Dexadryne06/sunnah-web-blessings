-- Create prayer_times table
CREATE TABLE public.prayer_times (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  fajr TIME NOT NULL,
  sunrise TIME NOT NULL,
  dhuhr TIME NOT NULL,
  asr TIME NOT NULL,
  maghrib TIME NOT NULL,
  isha TIME NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.prayer_times ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (anyone can view prayer times)
CREATE POLICY "Prayer times are viewable by everyone" 
ON public.prayer_times 
FOR SELECT 
USING (true);

-- Create policy for API/system insert (for N8N webhook)
CREATE POLICY "Allow public insert on prayer_times" 
ON public.prayer_times 
FOR INSERT 
WITH CHECK (true);

-- Create policy for API/system update (for N8N webhook)
CREATE POLICY "Allow public update on prayer_times" 
ON public.prayer_times 
FOR UPDATE 
USING (true);

-- Create index for better performance on date queries
CREATE INDEX idx_prayer_times_date ON public.prayer_times (date);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_prayer_times_updated_at
  BEFORE UPDATE ON public.prayer_times
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();