// File: src/routes/goalTracking.ts

import express from "express";
import { authenticateUser } from "../middleware/auth";
import { requireRole } from "../middleware/roles";
import { supabase } from "../utils/supabaseClient";

const router = express.Router();

// POST /goal-tracking
router.post("/", authenticateUser, requireRole(["manager"]), async (req, res) => {
  const { employee_id, goal, status } = req.body;

  const { data, error } = await supabase
    .from("goal_tracking")
    .insert([{ employee_id, goal, status }])
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// GET all goals for a company
router.get("/", authenticateUser, requireRole(["manager"]), async (req, res) => {
  const { id: userId } = res.locals.user;

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("company_id")
    .eq("id", userId)
    .single();

  const { data, error } = await supabase
    .from("goal_tracking")
    .select("*")
    .eq("company_id", profile?.company_id);

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

export default router;
