-- Allow public read access to contacts for dashboard
DROP POLICY IF EXISTS "Admins can view contacts" ON public.contacts;

CREATE POLICY "Allow dashboard access to contacts" 
ON public.contacts 
FOR SELECT 
USING (true);

-- Also ensure book_requests, lesson_registrations and donation_interactions are readable
CREATE POLICY "Allow dashboard access to book_requests" 
ON public.book_requests 
FOR SELECT 
USING (true);

CREATE POLICY "Allow dashboard access to lesson_registrations" 
ON public.lesson_registrations 
FOR SELECT 
USING (true);

CREATE POLICY "Allow dashboard access to donation_interactions" 
ON public.donation_interactions 
FOR SELECT 
USING (true);