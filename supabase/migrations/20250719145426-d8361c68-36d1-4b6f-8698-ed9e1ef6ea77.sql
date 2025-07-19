-- Add missing updated_at column to user_sessions table
ALTER TABLE public.user_sessions 
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();