import express from "express";
import { authenticateUser } from "../middleware/auth";
import { requireRole } from "../middleware/roles";
import { supabase } from "../utils/supabaseClient";

const router = express.Router();

/**
 * POST /api/v1/calendar/clock-in
 * Employee-only: Clock in
 */
router.post(
  "/clock-in",
  authenticateUser,
  requireRole(["employee"]),
  async (req, res) => {
    const userId = res.locals.user.id;

    const { data, error } = await supabase.from("attendance").insert([
      {
        employee_id: userId,
        clock_in: new Date().toISOString(),
      },
    ]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json({ message: "Clock-in recorded", data });
  }
);

/**
 * PUT /api/v1/calendar/clock-out
 * Employee-only: Clock out
 */
router.put(
  "/clock-out",
  authenticateUser,
  requireRole(["employee"]),
  async (req, res) => {
    const userId = res.locals.user.id;

    const { data: attendance, error: fetchError } = await supabase
      .from("attendance")
      .select("*")
      .eq("employee_id", userId)
      .is("clock_out", null)
      .order("clock_in", { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !attendance) {
      return res.status(404).json({ error: "No active clock-in found" });
    }

    const { error: updateError } = await supabase
      .from("attendance")
      .update({ clock_out: new Date().toISOString() })
      .eq("id", attendance.id);

    if (updateError) {
      return res.status(500).json({ error: updateError.message });
    }

    res.json({ message: "Clock-out recorded" });
  }
);

/**
 * GET /api/v1/calendar/my-attendance
 * Employee-only: Get current user's attendance history
 */
router.get(
  "/my-attendance",
  authenticateUser,
  requireRole(["employee"]),
  async (req, res) => {
    const userId = res.locals.user.id;

    const { data, error } = await supabase
      .from("attendance")
      .select("*")
      .eq("employee_id", userId)
      .order("clock_in", { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  }
);

/**
 * GET /api/v1/calendar/company-attendance
 * Manager-only: Get company-wide attendance
 */
router.get(
  "/company-attendance",
  authenticateUser,
  requireRole(["manager"]),
  async (req, res) => {
    const userId = res.locals.user.id;

    // Get manager's company
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("company_id")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({ error: "Manager profile not found" });
    }

    const { data, error } = await supabase
      .from("attendance")
      .select("*, user_profiles(first_name, last_name, department)")
      .eq("company_id", profile.company_id)
      .order("clock_in", { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  }
);

export default router;
