-- Fix the admin user registration system completely

-- First, drop any existing triggers and functions
DROP TRIGGER IF EXISTS on_auth_user_created_admin ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_admin_user();

-- Create improved function with proper error handling and logging
CREATE OR REPLACE FUNCTION public.handle_new_admin_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    admin_id UUID;
BEGIN
    -- Log the trigger execution
    INSERT INTO public.security_audit_log (
        user_id,
        event_type,
        event_description,
        metadata
    ) VALUES (
        NEW.id,
        'admin_user_trigger',
        'Processing new user registration for admin creation',
        jsonb_build_object('email', NEW.email, 'user_id', NEW.id)
    );

    -- Create admin user record
    BEGIN
        INSERT INTO public.admin_users_secure (user_id, email, role, is_active)
        VALUES (NEW.id, NEW.email, 'admin', true)
        RETURNING id INTO admin_id;
        
        -- Log successful admin creation
        INSERT INTO public.security_audit_log (
            user_id,
            event_type,
            event_description,
            metadata
        ) VALUES (
            NEW.id,
            'admin_user_created',
            'Admin user successfully created automatically',
            jsonb_build_object('email', NEW.email, 'admin_id', admin_id)
        );
        
    EXCEPTION WHEN OTHERS THEN
        -- Log any errors
        INSERT INTO public.security_audit_log (
            user_id,
            event_type,
            event_description,
            metadata
        ) VALUES (
            NEW.id,
            'admin_user_creation_error',
            'Failed to create admin user: ' || SQLERRM,
            jsonb_build_object('error', SQLERRM, 'sqlstate', SQLSTATE)
        );
        -- Don't fail the user creation, just log the error
    END;
    
    RETURN NEW;
END;
$$;

-- Create the trigger on auth.users
CREATE TRIGGER on_auth_user_created_admin
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_admin_user();

-- Also fix the INSERT policy to be more explicit
DROP POLICY IF EXISTS "Allow admin user registration" ON public.admin_users_secure;
DROP POLICY IF EXISTS "Service role can manage admin users" ON public.admin_users_secure;

CREATE POLICY "Allow admin user registration" 
ON public.admin_users_secure 
FOR INSERT 
WITH CHECK (
    -- Allow if it's the same user creating their own admin record
    user_id = auth.uid() 
    OR 
    -- Allow service role (for triggers)
    auth.jwt() ->> 'role' = 'service_role'
    OR
    -- Allow authenticated trigger execution
    current_setting('is_superuser', true) = 'on'
);

-- Allow service role full access for admin management
CREATE POLICY "Service role can manage admin users" 
ON public.admin_users_secure 
FOR ALL 
USING (auth.jwt() ->> 'role' = 'service_role')
WITH CHECK (auth.jwt() ->> 'role' = 'service_role');