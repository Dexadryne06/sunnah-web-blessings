
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
        
        // Get current prayer times
        const { data: currentData, error: currentError } = await supabase
          .from('current_prayer_times')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (currentError) {
          throw currentError;
        }

        // Check if we need to update (no data or old date)
        const today = new Date().toLocaleDateString('en-CA', { 
          timeZone: 'Europe/Rome' 
        });
        
        const needsUpdate = !currentData || currentData.date !== today;

        if (needsUpdate) {
          console.log('Prayer times need update, triggering refresh...');
          
          // Try to update prayer times automatically
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
                const formattedTimes: PrayerTime[] = [
                  { prayer: 'Fajr', time: updatedData.fajr },
                  { prayer: 'Sunrise', time: updatedData.sunrise },
                  { prayer: 'Dhuhr', time: updatedData.dhuhr },
                  { prayer: 'Asr', time: updatedData.asr },
                  { prayer: 'Maghrib', time: updatedData.maghrib },
                  { prayer: 'Isha', time: updatedData.isha },
                ];
                setPrayerTimes(formattedTimes);
                setLoading(false);
                return;
              }
            }
          } catch (autoUpdateError) {
            console.error('Auto-update error:', autoUpdateError);
          }
        }

        // Use existing data or fall back to prayer_times table
        if (currentData && !needsUpdate) {
          const formattedTimes: PrayerTime[] = [
            { prayer: 'Fajr', time: currentData.fajr },
            { prayer: 'Sunrise', time: currentData.sunrise },
            { prayer: 'Dhuhr', time: currentData.dhuhr },
            { prayer: 'Asr', time: currentData.asr },
            { prayer: 'Maghrib', time: currentData.maghrib },
            { prayer: 'Isha', time: currentData.isha },
          ];
          setPrayerTimes(formattedTimes);
        } else {
          // Fallback to prayer_times table for today
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('prayer_times')
            .select('*')
            .eq('date', today)
            .limit(1)
            .maybeSingle();

          if (fallbackError) {
            console.error('Fallback error:', fallbackError);
            // Don't throw, just use default times
          }

          if (fallbackData) {
            const formattedTimes: PrayerTime[] = [
              { prayer: 'Fajr', time: fallbackData.fajr },
              { prayer: 'Sunrise', time: fallbackData.sunrise },
              { prayer: 'Dhuhr', time: fallbackData.dhuhr },
              { prayer: 'Asr', time: fallbackData.asr },
              { prayer: 'Maghrib', time: fallbackData.maghrib },
              { prayer: 'Isha', time: fallbackData.isha },
            ];
            setPrayerTimes(formattedTimes);
          }
        }
      } catch (err) {
        console.error('Error fetching prayer times:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch prayer times');
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
        () => {
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
