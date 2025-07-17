-- Insert initial prayer times into current_prayer_times
INSERT INTO current_prayer_times (date, fajr, sunrise, dhuhr, asr, maghrib, isha)
SELECT date, fajr, sunrise, dhuhr, asr, maghrib, isha
FROM prayer_times 
WHERE date = CURRENT_DATE
ON CONFLICT (date) DO UPDATE SET
  fajr = EXCLUDED.fajr,
  sunrise = EXCLUDED.sunrise,
  dhuhr = EXCLUDED.dhuhr,
  asr = EXCLUDED.asr,
  maghrib = EXCLUDED.maghrib,
  isha = EXCLUDED.isha;