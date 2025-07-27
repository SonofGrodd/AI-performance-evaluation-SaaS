// scripts/findUserId.ts
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

(async () => {
  const { data, error } = await supabase.auth.admin.listUsers();

  if (error) {
    console.error("❌ Error fetching users:", error.message);
    return;
  }

  const user = data.users.find((u) => u.email === "manager@fredan.com");

  if (!user) {
    console.log("⚠️ No user found with that email.");
  } else {
    console.log("✅ Found user ID:", user.id);
  }
})();
