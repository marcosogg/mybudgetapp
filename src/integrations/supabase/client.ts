import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://kmtcqdnjsvixzkkssxxm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttdGNxZG5qc3ZpeHpra3NzeHhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc1MDA5MDQsImV4cCI6MjA1MzA3NjkwNH0.NBGWfQ_24eOHaKIuM1mZLcsyu4qPUGyWiXs2sJfQM5E";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);