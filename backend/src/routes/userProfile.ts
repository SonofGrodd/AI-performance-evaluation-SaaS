// src/routes/userProfiles.ts
import express from "express";
import { authenticateUser } from "../middleware/auth";
import { requireRole } from "../middleware/roles";
import { supabase } from "../utils/supabaseClient";

const router = express.Router();

/**
 * GET /api/v1/user-profiles
 * Manager-only: Get all user profiles in the company
 */
router.get(
  "/",
  authenticateUser,
  requireRole(["manager"]),
  async (req, res) => {
    const userId = res.locals.user.id;

    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("company_id")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({ error: "Manager profile not found" });
    }

    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("company_id", profile.company_id);

    if (error) return res.status(500).json({ error: error.message });

    res.json(data);
  }
);

/**
 * GET /api/v1/user-profiles/me
 * Employee: Get their own profile
 */
router.get(
  "/me",
  authenticateUser,
  requireRole(["employee", "manager"]),
  async (req, res) => {
    const userId = res.locals.user.id;

    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) return res.status(404).json({ error: "Profile not found" });

    res.json(data);
  }
);

/**
 * PUT /api/v1/user-profiles/me
 * Employee: Update their own profile
 */
router.put(
  "/me",
  authenticateUser,
  requireRole(["employee", "manager"]),
  async (req, res) => {
    const userId = res.locals.user.id;
    const updates = req.body;

    const { data, error } = await supabase
      .from("user_profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    res.json(data);
  }
);

export default router;
