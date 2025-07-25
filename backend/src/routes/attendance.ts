import express from "express";
import { authenticateUser } from "../middleware/auth";
import { requireRole } from "../middleware/roles";
import { supabase } from "../utils/supabaseClient";

const router = express.Router();

/**
 * POST /api/v1/attendance/clock-in
 * Employee-only: Clock in for the day
 */
router.post(
  "/clock-in",
  authenticateUser,
  requireRole(["employee"]),
  async (req, res) => {
    const { id: userId } = res.locals.user;
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    // Check if already clocked in
    const { data: existing, error: checkError } = await supabase
      .from("attendance")
      .select("*")
      .eq("employee_id", userId)
      .eq("date", today)
      .maybeSingle();

    if (checkError) {
      return res.status(500).json({ error: checkError.message });
    }

    if (existing) {
      return res.status(400).json({ error: "Already clocked in for today" });
    }

    const { data, error } = await supabase.from("attendance").insert([
      {
        employee_id: userId,
        date: today,
        clock_in_time: new Date().toISOString(),
      },
    ]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json({ message: "Clock-in successful", data });
  }
);

/**
 * POST /api/v1/attendance/clock-out
 * Employee-only: Clock out for the day
 */
router.post(
  "/clock-out",
  authenticateUser,
  requireRole(["employee"]),
  async (req, res) => {
    const { id: userId } = res.locals.user;
    const today = new Date().toISOString().split("T")[0];

    const { data: attendance, error } = await supabase
      .from("attendance")
      .update({ clock_out_time: new Date().toISOString() })
      .eq("employee_id", userId)
      .eq("date", today)
      .is("clock_out_time", null)
      .select()
      .single();

    if (error || !attendance) {
      return res
        .status(400)
        .json({ error: "Failed to clock out or already clocked out" });
    }

    res.json({ message: "Clock-out successful", data: attendance });
  }
);

/**
 * GET /api/v1/attendance/history
 * Employee-only: View attendance history
 */
router.get(
  "/history",
  authenticateUser,
  requireRole(["employee"]),
  async (req, res) => {
    const { id: userId } = res.locals.user;

    const { data, error } = await supabase
      .from("attendance")
      .select("*")
      .eq("employee_id", userId)
      .order("date", { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  }
);

export default router;
