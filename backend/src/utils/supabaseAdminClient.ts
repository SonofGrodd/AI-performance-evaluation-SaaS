// File: backend/src/utils/supabaseAdminClient.ts
import { createClient } from '@supabase/supabase-js';

// Supabase service-role (admin) key client — used for JWT verification & privileged data access
const supabaseAdminUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseAdminUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment');
}

export const supabaseAdmin = createClient(supabaseAdminUrl, supabaseServiceRoleKey);
