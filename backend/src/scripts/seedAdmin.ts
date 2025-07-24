// src/scripts/seedAdmin.ts
import { supabase } from "../utils/supabaseClient";
import { supabaseAdmin } from "../utils/supabaseAdminClient";

async function seedAdmin() {
  const adminEmail = "admin@example.com"; // Change this to your actual user email
  const companyName = "My Company";
  const companyDomain = "mycompany.com";

  console.log("⏳ Seeding admin user...");

  // 1. Get Supabase Auth user by email using admin client
  const { data: userList, error: userError } = await supabaseAdmin.auth.admin.listUsers({ email: adminEmail });

  const user = userList?.users?.[0];
  if (!user) {
    console.error("❌ Admin user not found in Supabase auth.users");
    return;
  }

  const userId = user.id;

  // 2. Check if company already exists
  const { data: existingCompany } = await supabase
    .from("companies")
    .select("*")
    .eq("domain", companyDomain)
    .single();

  let companyId = existingCompany?.id;

  // 3. Create company if it doesn't exist
  if (!companyId) {
    const { data: newCompany, error: companyError } = await supabase
      .from("companies")
      .insert({ name: companyName, domain: companyDomain })
      .select()
      .single();

    if (companyError) {
      console.error("❌ Failed to create company:", companyError.message);
      return;
    }

    companyId = newCompany.id;
  }

  // 4. Promote user to admin
  const { error: updateError } = await supabase
    .from("user_profiles")
    .update({
      role: "admin",
      company_id: companyId,
    })
    .eq("id", userId);

  if (updateError) {
    console.error("❌ Failed to update user profile:", updateError.message);
  } else {
    console.log("✅ Admin user seeded successfully!");
  }
}

seedAdmin();
