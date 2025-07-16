-- Tabella per i contatti
CREATE TABLE public.contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabella per le registrazioni alle lezioni
CREATE TABLE public.lesson_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_name TEXT NOT NULL,
  parent_email TEXT NOT NULL,
  child_name TEXT NOT NULL,
  child_age INTEGER NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabella per le richieste di acquisto/prestito libri
CREATE TABLE public.book_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  request_type TEXT NOT NULL CHECK (request_type IN ('purchase', 'borrow')),
  selected_book TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabella per tracciare le interazioni con le donazioni
CREATE TABLE public.donation_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  interaction_type TEXT NOT NULL, -- 'like', 'copy_iban', 'copy_causale', etc.
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Abilita RLS su tutte le tabelle
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donation_interactions ENABLE ROW LEVEL SECURITY;

-- Politiche RLS per consentire inserimento pubblico (senza autenticazione)
CREATE POLICY "Allow public insert on contacts" ON public.contacts
FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow public insert on lesson_registrations" ON public.lesson_registrations
FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow public insert on book_requests" ON public.book_requests
FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow public insert on donation_interactions" ON public.donation_interactions
FOR INSERT TO anon WITH CHECK (true);

-- Funzione per aggiornare automaticamente updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger per aggiornare updated_at
CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON public.contacts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lesson_registrations_updated_at
  BEFORE UPDATE ON public.lesson_registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_book_requests_updated_at
  BEFORE UPDATE ON public.book_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();