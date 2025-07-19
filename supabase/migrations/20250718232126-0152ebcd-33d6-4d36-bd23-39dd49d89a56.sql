
-- Allow public read access to edge_function_logs for dashboard
DROP POLICY IF EXISTS "Admins can view edge function logs" ON public.edge_function_logs;

CREATE POLICY "Allow dashboard access to edge_function_logs" 
ON public.edge_function_logs 
FOR SELECT 
USING (true);

-- Ensure the edge functions can still insert logs
CREATE POLICY IF NOT EXISTS "Edge functions can insert logs" 
ON public.edge_function_logs 
FOR INSERT 
WITH CHECK (true);
