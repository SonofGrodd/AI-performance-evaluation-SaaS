import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const email = "admin@example.com";
const password = "StrongAdminPass123!";
const companyName = "Test Company Inc";
const domain = "testcompany.com";

async function seedAdmin() {
  console.log("⏳ Seeding admin user...");

  // Create company
  const { data: company, error: companyError } = await supabase
    .from("companies")
    .insert([{ name: companyName, domain }])
    .select()
    .single();

  if (companyError) throw companyError;

  // Create user
  const { data: user, error: userError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });

  if (userError) throw userError;

  // Insert user profile
  const { error: profileError } = await supabase.from("user_profiles").insert([
    {
      id: user.user.id,
      company_id: company.id,
      first_name: "Admin",
      last_name: "User",
      role: "admin",
      department: "Operations",
      job_title: "System Admin"
    }
  ]);

  if (profileError) throw profileError;

  console.log("✅ Admin seeded successfully:");
  console.log(`  Email: ${email}`);
  console.log(`  Password: ${password}`);
  console.log(`  Company ID: ${company.id}`);
}

seedAdmin().catch((err) => {
  console.error("❌ Seeding failed:", err.message);
  process.exit(1);
});
