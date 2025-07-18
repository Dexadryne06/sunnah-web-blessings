-- Enable pg_cron extension for scheduled tasks
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the prayer times update to run every day at 3:00 AM Rome time
SELECT cron.schedule(
  'daily-prayer-times-update',
  '0 3 * * *', -- Every day at 3:00 AM
  $$
  SELECT
    net.http_post(
        url := 'https://pspbnpkwnudwktxqmvos.supabase.co/functions/v1/update-daily-prayer-times',
        headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzcGJucGt3bnVkd2t0eHFtdm9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2NTUwNjMsImV4cCI6MjA2ODIzMTA2M30.gXKliZ0oN_0doArVVnp31PK1qTZvGRRVAH5sdZWlJ0M"}'::jsonb,
        body := '{"scheduled": true}'::jsonb
    ) as request_id;
  $$
);