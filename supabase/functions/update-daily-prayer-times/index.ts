import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseUrl = "https://pspbnpkwnudwktxqmvos.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzcGJucGt3bnVkd2t0eHFtdm9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2NTUwNjMsImV4cCI6MjA2ODIzMTA2M30.gXKliZ0oN_0doArVVnp31PK1qTZvGRRVAH5sdZWlJ0M"
const supabase = createClient(supabaseUrl, supabaseAnonKey)

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Use Rome timezone for accurate date calculation
    const today = new Date().toLocaleDateString('en-CA', { 
      timeZone: 'Europe/Rome' 
    })
    
    // Get today's prayer times from the prayer_times table
    const { data: prayerTimes, error: selectError } = await supabase
      .from('prayer_times')
      .select('*')
      .eq('date', today)
      .maybeSingle()

    if (selectError) {
      console.error('Error fetching prayer times:', selectError)
      throw selectError
    }

    if (!prayerTimes) {
      throw new Error('No prayer times found for today')
    }

    // Update or insert into current_prayer_times
    const { error: upsertError } = await supabase
      .from('current_prayer_times')
      .upsert({
        date: today,
        fajr: prayerTimes.fajr,
        sunrise: prayerTimes.sunrise,
        dhuhr: prayerTimes.dhuhr,
        asr: prayerTimes.asr,
        maghrib: prayerTimes.maghrib,
        isha: prayerTimes.isha
      })

    if (upsertError) {
      console.error('Error upserting current prayer times:', upsertError)
      throw upsertError
    }

    return new Response(JSON.stringify({ 
      success: true, 
      date: today,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Error in update-daily-prayer-times:', error)
    return new Response(JSON.stringify({ 
      error: error.message,
      today: new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Rome' }),
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})