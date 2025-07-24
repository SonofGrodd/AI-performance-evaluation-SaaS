import express from "express";
import { authenticateUser } from "../middleware/auth";
import { supabase } from "../utils/supabaseClient";

const router = express.Router();

// POST /api/v1/attendance/clock-in
router.post("/clock-in", authenticateUser, async (req, res) => {
  const userId = res.locals.user.id;

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("company_id")
    .eq("id", userId)
    .single();

  const { error } = await supabase.from("attendance_logs").insert([
    {
      employee_id: userId,
      company_id: profile?.company_id,
      clock_in: new Date(),
    },
  ]);

  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json({ message: "Clock-in recorded" });
});

// POST /api/v1/attendance/clock-out
router.post("/clock-out", authenticateUser, async (req, res) => {
  const userId = res.locals.user.id;

  const { data, error } = await supabase
    .from("attendance_logs")
    .update({ clock_out: new Date() })
    .eq("employee_id", userId)
    .eq("date", new Date().toISOString().split("T")[0]);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: "Clock-out recorded" });
});

// GET /api/v1/attendance/my-logs
router.get("/my-logs", authenticateUser, async (req, res) => {
  const userId = res.locals.user.id;

  const { data, error } = await supabase
    .from("attendance_logs")
    .select("*")
    .eq("employee_id", userId)
    .order("date", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

export default router;
