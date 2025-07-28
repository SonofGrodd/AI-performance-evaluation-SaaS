// File: src/routes/recognition.ts

import express from "express";
import { authenticateUser } from "../middleware/auth";
import { requireRole } from "../middleware/roles";
import { supabase } from "../utils/supabaseClient";

const router = express.Router();

// POST /recognition
router.post("/", authenticateUser, requireRole(["manager"]), async (req, res) => {
  const { employee_id, badge_name, reason } = req.body;

  const { data, error } = await supabase
    .from("recognition")
    .insert([{ employee_id, badge_name, reason }])
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// GET all recognition entries for a company
router.get("/", authenticateUser, requireRole(["manager"]), async (req, res) => {
  const { id: userId } = res.locals.user;

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("company_id")
    .eq("id", userId)
    .single();

  const { data, error } = await supabase
    .from("recognition")
    .select("*")
    .eq("company_id", profile?.company_id);

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

export default router;
