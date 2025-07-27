// backend/scripts/seedAdmin.ts

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const seedAdminUser = async () => {
  const adminEmail = "managerHR@fredan.com";
  const adminPassword = "admin123"; // Change after first login

  try {
    // ✅ Check for existing users manually (filter client-side)
    const { data: allUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();

    if (listError) {
      console.error("❌ Error listing users:", listError.message);
      return;
    }

    const existingUser = allUsers?.users.find((user) => user.email === adminEmail);

    if (existingUser) {
      console.log(`⚠️ User already exists: ${adminEmail}`);
      return;
    }

    // ✅ Create user via Admin API
    const { data: user, error } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
    });

    if (error) {
      console.error("❌ Error creating user:", error.message);
      return;
    }

    const userId = user.user?.id;

    if (!userId) {
      console.error("❌ No user ID returned from Supabase.");
      return;
    }

    console.log("✅ Admin user created:", user.user?.email);

    // ✅ Insert into user_profiles table
    const { error: profileError } = await supabaseAdmin.from("user_profiles").insert({
      id: userId,
      role: "manager",
      first_name: "System",
      last_name: "Admin",
      department: "Management",
      job_title: "Admin",
      company_id: 1, // Adjust this based on your seeded companies
    });

    if (profileError) {
      console.error("❌ Error inserting into user_profiles:", profileError.message);
      return;
    }

    console.log("✅ Admin profile inserted into user_profiles");
  } catch (err) {
    console.error("❌ Unexpected error:", err);
  }
};

seedAdminUser();
