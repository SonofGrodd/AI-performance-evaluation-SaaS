// src/utils/supabaseAdminClient.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // store in .env

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
