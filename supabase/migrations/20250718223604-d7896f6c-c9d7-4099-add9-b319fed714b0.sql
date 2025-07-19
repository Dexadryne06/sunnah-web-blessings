-- Add policy to allow service role to insert/update current_prayer_times
CREATE POLICY "Service role can manage current prayer times" 
ON public.current_prayer_times 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Also allow the anon role (used by edge functions) to insert/update
CREATE POLICY "Allow edge functions to manage current prayer times" 
ON public.current_prayer_times 
FOR ALL 
TO anon 
USING (true) 
WITH CHECK (true);