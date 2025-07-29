// File: backend/src/utils/supabaseAnonClient.ts
import { createClient } from '@supabase/supabase-js';

// Supabase anon (public) key client — used for sign-in, sign-up, etc.
const supabaseUrl    = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
