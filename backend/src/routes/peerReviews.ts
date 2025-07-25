import express from "express";
import { authenticateUser } from "../middleware/auth";
import { requireRole } from "../middleware/roles";
import { supabase } from "../utils/supabaseClient";

const router = express.Router();

/**
 * POST /api/v1/peer-reviews
 * Employee-only: Submit a peer review (can be anonymous)
 */
router.post(
  "/",
  authenticateUser,
  requireRole(["employee"]),
  async (req, res) => {
    const { id: reviewerId } = res.locals.user;
    const { reviewee_id, review_text, is_anonymous } = req.body;

    const { data, error } = await supabase.from("peer_reviews").insert([
      {
        reviewerId,
        reviewee_id,
        review_text,
        is_anonymous,
      },
    ]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json({ message: "Peer review submitted", data });
  }
);

/**
 * GET /api/v1/peer-reviews/:employee_id
 * Manager-only: View all peer reviews for an employee
 */
router.get(
  "/:employee_id",
  authenticateUser,
  requireRole(["manager"]),
  async (req, res) => {
    const { employee_id } = req.params;

    const { data, error } = await supabase
      .from("peer_reviews")
      .select("id, review_text, is_anonymous, created_at")
      .eq("reviewee_id", employee_id)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  }
);

export default router;
