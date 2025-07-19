
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type PrayerTime = {
  prayer: string;
  time: string;
};

export function usePrayerTimes() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPrayerTimes() {
      try {
        setLoading(true);
        
        // Get current prayer times first
        const { data: currentData, error: currentError } = await supabase
          .from('current_prayer_times')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (currentError) {
          console.error('Error fetching current prayer times:', currentError);
        }

        // Check if we have current data for today
        const today = new Date().toLocaleDateString('en-CA', { 
          timeZone: 'Europe/Rome' 
        });
        
        console.log('Today:', today);
        console.log('Current data:', currentData);

        // If we have current data for today, use it
        if (currentData && currentData.date === today) {
          console.log('Using current prayer times for today');
          const formattedTimes: PrayerTime[] = [
            { prayer: 'Fajr', time: currentData.fajr },
            { prayer: 'Sunrise', time: currentData.sunrise },
            { prayer: 'Dhuhr', time: currentData.dhuhr },
            { prayer: 'Asr', time: currentData.asr },
            { prayer: 'Maghrib', time: currentData.maghrib },
            { prayer: 'Isha', time: currentData.isha },
          ];
          setPrayerTimes(formattedTimes);
          setError(null);
          setLoading(false);
          return;
        }

        // If no current data or date mismatch, try to update
        console.log('Current prayer times need update, triggering refresh...');
        
        try {
          const { error: updateError } = await supabase.functions.invoke('update-daily-prayer-times');
          if (updateError) {
            console.error('Auto-update failed:', updateError);
          } else {
            console.log('Prayer times updated successfully');
            
            // Fetch updated data
            const { data: updatedData, error: refetchError } = await supabase
              .from('current_prayer_times')
              .select('*')
              .limit(1)
              .maybeSingle();
            
            if (!refetchError && updatedData) {
              console.log('Using updated current prayer times');
              const formattedTimes: PrayerTime[] = [
                { prayer: 'Fajr', time: updatedData.fajr },
                { prayer: 'Sunrise', time: updatedData.sunrise },
                { prayer: 'Dhuhr', time: updatedData.dhuhr },
                { prayer: 'Asr', time: updatedData.asr },
                { prayer: 'Maghrib', time: updatedData.maghrib },
                { prayer: 'Isha', time: updatedData.isha },
              ];
              setPrayerTimes(formattedTimes);
              setError(null);
              setLoading(false);
              return;
            }
          }
        } catch (autoUpdateError) {
          console.error('Auto-update error:', autoUpdateError);
        }

        // Fallback to prayer_times table for today only as last resort
        console.log('Fallback to prayer_times table');
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('prayer_times')
          .select('*')
          .eq('date', today)
          .limit(1)
          .maybeSingle();

        if (fallbackError) {
          console.error('Fallback error:', fallbackError);
          throw new Error('Non riesco a caricare gli orari di preghiera');
        }

        if (fallbackData) {
          console.log('Using fallback prayer times for today');
          const formattedTimes: PrayerTime[] = [
            { prayer: 'Fajr', time: fallbackData.fajr },
            { prayer: 'Sunrise', time: fallbackData.sunrise },
            { prayer: 'Dhuhr', time: fallbackData.dhuhr },
            { prayer: 'Asr', time: fallbackData.asr },
            { prayer: 'Maghrib', time: fallbackData.maghrib },
            { prayer: 'Isha', time: fallbackData.isha },
          ];
          setPrayerTimes(formattedTimes);
          setError(null);
        } else {
          throw new Error('Nessun orario di preghiera trovato per oggi');
        }
      } catch (err) {
        console.error('Error fetching prayer times:', err);
        setError(err instanceof Error ? err.message : 'Errore nel caricamento degli orari');
      } finally {
        setLoading(false);
      }
    }

    fetchPrayerTimes();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('current_prayer_times_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'current_prayer_times'
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          fetchPrayerTimes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { prayerTimes, loading, error };
}
