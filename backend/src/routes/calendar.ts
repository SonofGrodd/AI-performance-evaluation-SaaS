import express from "express";
import { authenticateUser } from "../middleware/auth";
import { supabase } from "../utils/supabaseClient";

const router = express.Router();

// GET /api/v1/calendar/events
router.get("/events", authenticateUser, async (req, res) => {
  const userId = res.locals.user.id;

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("company_id")
    .eq("id", userId)
    .single();

  if (!profile) return res.status(404).json({ error: "Profile not found" });

  const { data, error } = await supabase
    .from("calendar_events")
    .select("*")
    .eq("company_id", profile.company_id);

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

// POST /api/v1/calendar/events
router.post("/events", authenticateUser, async (req, res) => {
  const userId = res.locals.user.id;
  const { title, description, event_type, start_date, end_date } = req.body;

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("company_id")
    .eq("id", userId)
    .single();

  if (!profile) return res.status(404).json({ error: "Profile not found" });

  const { data, error } = await supabase
    .from("calendar_events")
    .insert([
      {
        employee_id: userId,
        company_id: profile.company_id,
        title,
        description,
        event_type,
        start_date,
        end_date,
      },
    ])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json(data);
});

export default router;
