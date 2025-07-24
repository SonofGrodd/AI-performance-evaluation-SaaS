import express from "express";
import { authenticateUser } from "../middleware/auth";
import { supabase } from "../utils/supabaseClient";

const router = express.Router();

// GET all departments for the user's company
router.get("/", authenticateUser, async (req, res) => {
  const user = res.locals.user;

  // Get user's profile
  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("company_id")
    .eq("id", user.id)
    .single();

  if (profileError || !profile)
    return res.status(404).json({ error: "User profile not found" });

  const { company_id } = profile;

  const { data: departments, error } = await supabase
    .from("departments")
    .select("*")
    .eq("company_id", company_id);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ departments });
});

// POST create a new department
router.post("/", authenticateUser, async (req, res) => {
  const user = res.locals.user;
  const { name, description } = req.body;

  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("company_id")
    .eq("id", user.id)
    .single();

  if (profileError || !profile)
    return res.status(404).json({ error: "User profile not found" });

  const { company_id } = profile;

  const { data, error } = await supabase.from("departments").insert([
    {
      name,
      description,
      company_id,
    },
  ]);

  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json({ department: data?.[0] });
});

// PUT update a department
router.put("/:id", authenticateUser, async (req, res) => {
  const user = res.locals.user;
  const departmentId = req.params.id;
  const { name, description } = req.body;

  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("company_id")
    .eq("id", user.id)
    .single();

  if (profileError || !profile)
    return res.status(404).json({ error: "User profile not found" });

  const { company_id } = profile;

  const { data, error } = await supabase
    .from("departments")
    .update({ name, description })
    .eq("id", departmentId)
    .eq("company_id", company_id)
    .select();

  if (error) return res.status(500).json({ error: error.message });

  res.json({ department: data?.[0] });
});

// DELETE a department
router.delete("/:id", authenticateUser, async (req, res) => {
  const user = res.locals.user;
  const departmentId = req.params.id;

  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("company_id")
    .eq("id", user.id)
    .single();

  if (profileError || !profile)
    return res.status(404).json({ error: "User profile not found" });

  const { company_id } = profile;

  const { error } = await supabase
    .from("departments")
    .delete()
    .eq("id", departmentId)
    .eq("company_id", company_id);

  if (error) return res.status(500).json({ error: error.message });

  res.status(204).send();
});

export default router;
