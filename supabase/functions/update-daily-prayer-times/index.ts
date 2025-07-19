
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
    console.log('Starting prayer times update process...')
    
    // Use Rome timezone for accurate date calculation
    const today = new Date().toLocaleDateString('en-CA', { 
      timeZone: 'Europe/Rome' 
    })
    
    console.log(`Today's date (Rome timezone): ${today}`)
    
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
      console.error(`No prayer times found for date: ${today}`)
      throw new Error(`No prayer times found for today (${today})`)
    }

    console.log('Found prayer times:', prayerTimes)

    // Clear all existing records from current_prayer_times first
    console.log('Clearing all existing records from current_prayer_times...')
    const { error: deleteError } = await supabase
      .from('current_prayer_times')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all records

    if (deleteError) {
      console.error('Error clearing current prayer times:', deleteError)
      throw deleteError
    }

    console.log('Successfully cleared existing records, inserting new record for today...')

    // Insert new record for today
    const { data: upsertData, error: upsertError } = await supabase
      .from('current_prayer_times')
      .insert({
        date: today,
        fajr: prayerTimes.fajr,
        sunrise: prayerTimes.sunrise,
        dhuhr: prayerTimes.dhuhr,
        asr: prayerTimes.asr,
        maghrib: prayerTimes.maghrib,
        isha: prayerTimes.isha
      })
      .select()

    if (upsertError) {
      console.error('Error upserting current prayer times:', upsertError)
      throw upsertError
    }

    console.log('Successfully updated current prayer times:', upsertData)

    return new Response(JSON.stringify({ 
      success: true, 
      date: today,
      prayerTimes: prayerTimes,
      message: `Prayer times updated successfully for ${today}`,
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
      timestamp: new Date().toISOString(),
      details: error
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
