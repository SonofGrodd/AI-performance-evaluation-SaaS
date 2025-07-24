import express from "express";
import { authenticateUser } from "../middleware/auth";
import { supabase } from "../utils/supabaseClient";

const router = express.Router();

// POST /api/v1/peer-reviews
router.post("/", authenticateUser, async (req, res) => {
  const { employee_id, feedback_text } = req.body;
  const reviewer_id = res.locals.user.id;

  if (!employee_id || !feedback_text) {
    return res.status(400).json({ error: "employee_id and feedback_text are required" });
  }

  const { data, error } = await supabase
    .from("feedback")
    .insert([
      {
        employee_id,
        reviewer_id,
        feedback_text,
        feedback_type: "peer",
        is_anonymous: true,
      },
    ])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json(data);
});

// GET /api/v1/peer-reviews
router.get("/", authenticateUser, async (req, res) => {
  const reviewerId = res.locals.user.id;

  const { data, error } = await supabase
    .from("feedback")
    .select("*")
    .eq("reviewer_id", reviewerId)
    .eq("feedback_type", "peer")
    .eq("is_anonymous", true);

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

// DELETE /api/v1/peer-reviews/:id
router.delete("/:id", authenticateUser, async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from("feedback").delete().eq("id", id);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: "Deleted successfully" });
});

export default router;
