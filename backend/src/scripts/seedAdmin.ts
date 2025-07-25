
import { supabaseAdmin } from "../utils/supabaseAdminClient";

const adminEmail = "admin@example.com";

const seed = async () => {
  console.log("⏳ Seeding admin user...");

  const { data: users, error: listError } =
    await supabaseAdmin.auth.admin.listUsers();

  if (listError) throw listError;

  const existing = users.users.find((u) => u.email === adminEmail);
  if (existing) {
    console.log("✅ Admin already exists.");
    return;
  }

  const { data: user, error: createError } =
    await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: "admin123",
      email_confirm: true,
    });

  if (createError) throw createError;

  await supabaseAdmin.from("user_profiles").insert([
    {
      id: user.user?.id,
      first_name: "Admin",
      last_name: "User",
      company_id: "your-company-id", // Replace
      role: "manager",
    },
  ]);

  console.log("✅ Admin seeded.");
};

seed().catch((err) => {
  console.error("❌ Seeding failed:", err.message);
  process.exit(1);
});
