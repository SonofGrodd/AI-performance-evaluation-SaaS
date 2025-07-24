import express from "express";
import { authenticateUser } from "../middleware/auth";
import { requireRole } from "../middleware/roles";
import { supabase } from "../utils/supabaseClient";

const router = express.Router();

// POST /api/v1/feedback
router.post("/", authenticateUser, requireRole(["manager"]), async (req, res) => {
  const { employee_id, message, sentiment_label } = req.body;
  const sender_id = res.locals.user.id;

  const { data, error } = await supabase.from("feedback").insert([
    {
      employee_id,
      sender_id,
      message,
      sentiment_label,
    },
  ]);

  if (error) return res.status(400).json({ error: error.message });

  res.status(201).json({ message: "Feedback submitted", data });
});

// GET /api/v1/feedback
router.get("/", authenticateUser, requireRole(["manager", "employee"]), async (req, res) => {
  const userId = res.locals.user.id;

  const { data, error } = await supabase
    .from("feedback")
    .select("*")
    .eq("employee_id", userId)
    .order("created_at", { ascending: false });

  if (error) return res.status(400).json({ error: error.message });

  res.json({ feedback: data });
});

export default router;
