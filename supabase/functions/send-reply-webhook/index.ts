import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ReplyRequest {
  contact_id: string;
  name: string;
  email: string;
  original_message: string;
  reply_message?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: ReplyRequest = await req.json();
    
    // Log the function call
    console.log('Reply webhook called for contact:', data.contact_id);
    
    // Here you could add logic to send emails, notifications, etc.
    // For now, we'll just log the activity
    
    const replyData = {
      action: 'contact_reply',
      contact_id: data.contact_id,
      contact_name: data.name,
      contact_email: data.email,
      original_message: data.original_message,
      reply_timestamp: new Date().toISOString(),
      status: 'processed'
    };

    // Send to external webhook
    const webhookResponse = await fetch('https://primary-production-a9d2d.up.railway.app/webhook-test/a5301f42-598a-4f34-9a89-50668cd136dd', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(replyData),
    });

    if (!webhookResponse.ok) {
      throw new Error(`Webhook failed: ${webhookResponse.status}`);
    }

    console.log('Reply webhook sent successfully');

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Reply processed successfully' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error) {
    console.error('Error in send-reply-webhook:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});