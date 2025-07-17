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
        const { data, error } = await supabase
          .from('current_prayer_times')
          .select('*')
          .limit(1)
          .single();

        if (error) throw error;

        if (data) {
          const formattedTimes: PrayerTime[] = [
            { prayer: 'Fajr', time: data.fajr },
            { prayer: 'Sunrise', time: data.sunrise },
            { prayer: 'Dhuhr', time: data.dhuhr },
            { prayer: 'Asr', time: data.asr },
            { prayer: 'Maghrib', time: data.maghrib },
            { prayer: 'Isha', time: data.isha },
          ];
          setPrayerTimes(formattedTimes);
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