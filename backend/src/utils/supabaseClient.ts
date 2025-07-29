// File: backend/src/utils/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;  // <- Must be service role

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    // You generally want JWTs to be sent in the Authorization header
    persistSession: false,
  },
});
