import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const formData: ContactFormData = await req.json();
    const clientIP = req.headers.get('cf-connecting-ip') || 
                     req.headers.get('x-forwarded-for') || 
                     'unknown';

    // Input validation
    if (!formData.name || !formData.email || !formData.message) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return new Response(JSON.stringify({ 
        error: 'Invalid email format' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Rate limiting check
    const { data: rateLimitOk } = await supabase.rpc('check_rate_limit', {
      p_identifier: clientIP,
      p_action: 'contact_form',
      p_max_attempts: 3,
      p_window_minutes: 15
    });

    if (!rateLimitOk) {
      return new Response(JSON.stringify({ 
        error: 'Rate limit exceeded. Please try again later.' 
      }), {
        status: 429,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Sanitize input
    const sanitizedData = {
      name: formData.name.trim().substring(0, 100),
      email: formData.email.trim().toLowerCase().substring(0, 255),
      message: formData.message.trim().substring(0, 1000)
    };

    // Save to database
    const { error: dbError } = await supabase
      .from('contacts')
      .insert([sanitizedData]);

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to save contact form');
    }

    // Log security event
    await supabase.rpc('log_security_event', {
      p_event_type: 'contact_form_submission',
      p_event_description: `Contact form submitted by ${sanitizedData.email}`,
      p_ip_address: clientIP,
      p_user_agent: req.headers.get('user-agent'),
      p_metadata: { 
        email: sanitizedData.email,
        name: sanitizedData.name 
      }
    });

    // Send to external webhook (with error handling)
    try {
      const webhookResponse = await fetch(
        'https://primary-production-a9d2d.up.railway.app/webhook/a966bf4f-96d0-4c94-bbde-9d09719d2093', 
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...sanitizedData,
            timestamp: new Date().toISOString()
          }),
        }
      );

      if (!webhookResponse.ok) {
        console.error('Webhook failed:', webhookResponse.status);
      }
    } catch (webhookError) {
      console.error('Webhook error:', webhookError);
      // Don't fail the entire request if webhook fails
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Contact form submitted successfully' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error) {
    console.error('Error in secure-contact-form:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});