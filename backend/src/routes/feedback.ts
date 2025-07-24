import express from "express";
import { authenticateUser } from "../middleware/auth";
import { requireRole } from "../middleware/roles";
import { supabase } from "../utils/supabaseClient";

const router = express.Router();

// POST /api/v1/feedback - Submit anonymous feedback (employees only)
router.post("/", authenticateUser, requireRole(["employee"]), async (req, res) => {
  const senderId = res.locals.user.id;
  const { recipientId, content, sentiment_label } = req.body;

  if (!recipientId || !content) {
    return res.status(400).json({ error: "Recipient and content are required." });
  }

  const { error } = await supabase.from("feedback").insert({
    sender_id: senderId,
    employee_id: recipientId,
    content,
    sentiment_label,
    is_anonymous: true,
  });

  if (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to submit feedback." });
  }

  res.json({ message: "Feedback submitted anonymously." });
});

// GET /api/v1/feedback/my-feedback - Get feedback for logged-in employee
router.get("/my-feedback", authenticateUser, requireRole(["employee"]), async (req, res) => {
  const userId = res.locals.user.id;

  const { data, error } = await supabase
    .from("feedback")
    .select("*")
    .eq("employee_id", userId);

  if (error) return res.status(500).json({ error: "Failed to fetch feedback." });

  res.json(data);
});

// GET /api/v1/feedback/for/:employeeId - Managers can fetch feedback for team members
router.get("/for/:employeeId", authenticateUser, requireRole(["manager"]), async (req, res) => {
  const { employeeId } = req.params;

  const { data, error } = await supabase
    .from("feedback")
    .select("*")
    .eq("employee_id", employeeId);

  if (error) return res.status(500).json({ error: "Failed to fetch feedback." });

  res.json(data);
});

export default router;
