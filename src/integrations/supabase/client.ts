import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// These values are public and can be exposed in the client
const supabaseUrl = 'https://kmtcqdnjsvixzkkssxxm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttdGNxZG5qc3ZpeHpra3NzeHhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc1MDA5MDQsImV4cCI6MjA1MzA3NjkwNH0.NBGWfQ_24eOHaKIuM1mZLcsyu4qPUGyWiXs2sJfQM5E';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);