// scripts/insertAdminProfile.ts
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

(async () => {
  const { error } = await supabase.from("user_profiles").insert({
    id: "f75a7c48-ec48-4460-86ab-4ba942bc848f",       
    first_name: "System",
    last_name: "Admin",
    role: "manager",
    department: "Management",
    job_title: "Administrator",
    company_id: "12f1e71c-cb5d-4af0-b633-3d2e9fcbc7d4",
  });

  if (error) {
    console.error("❌ Insert failed:", error.message);
  } else {
    console.log("✅ Admin profile inserted into user_profiles");
  }
})();
