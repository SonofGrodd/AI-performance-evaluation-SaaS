import express from "express";
import { authenticateUser } from "../middleware/auth";
import { supabase } from "../utils/supabaseClient";

const router = express.Router();

// POST /api/v1/users/sync-profile
router.post("/sync-profile", authenticateUser, async (req, res) => {
  const userId = res.locals.user.id;
  const {
    first_name,
    last_name,
    role = "employee",
    department,
    job_title,
    hire_date,
    company_id,
    avatar_url,
    manager_id,
  } = req.body;

  if (!company_id || !first_name || !last_name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Upsert profile (insert if new, update if exists)
  const { data, error } = await supabase.from("user_profiles").upsert([
    {
      id: userId,
      company_id,
      first_name,
      last_name,
      role,
      department,
      job_title,
      hire_date,
      avatar_url,
      manager_id,
    },
  ])
  .select()
  .single();

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json({ message: "Profile synced", data });
});

export default router;
