import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://ebdxjqzmkxwpviivxkpo.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViZHhqcXpta3h3cHZpaXZ4a3BvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczOTA5MjAsImV4cCI6MjA3Mjk2NjkyMH0.NZr29DLw9gZt_5LE_LckaeGzseXpPq0npBrMbdYDax4";

export const supabase = createClient(supabaseUrl, supabaseKey);
