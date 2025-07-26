import express from "express";
import { authenticateUser } from "../middleware/auth";
import { requireRole } from "../middleware/roles";
import { supabase } from "../utils/supabaseClient";

const router = express.Router();

/**
 * POST /api/v1/three-sixty-reviews
 * Any employee can create a 360 review for another employee (anonymously or not)
 */
router.post("/", authenticateUser, requireRole(["employee"]), async (req, res) => {
  const reviewer_id = res.locals.user.id;
  const { reviewee_id, review_cycle_id, ratings, comments } = req.body;

  const { data, error } = await supabase
    .from("three_sixty_reviews")
    .insert([
      {
        reviewer_id,
        reviewee_id,
        review_cycle_id,
        ratings,
        comments,
      },
    ])
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

/**
 * GET /api/v1/three-sixty-reviews/:reviewee_id
 * Manager-only: View 360 reviews received by a specific employee
 */
router.get("/:reviewee_id", authenticateUser, requireRole(["manager"]), async (req, res) => {
  const { reviewee_id } = req.params;

  const { data, error } = await supabase
    .from("three_sixty_reviews")
    .select("*")
    .eq("reviewee_id", reviewee_id);

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

/**
 * PUT /api/v1/three-sixty-reviews/:id
 * Manager-only: Update a review (if needed for moderation)
 */
router.put("/:id", authenticateUser, requireRole(["manager"]), async (req, res) => {
  const { id } = req.params;
  const { ratings, comments } = req.body;

  const { data, error } = await supabase
    .from("three_sixty_reviews")
    .update({ ratings, comments })
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

/**
 * DELETE /api/v1/three-sixty-reviews/:id
 * Manager-only: Delete a review
 */
router.delete("/:id", authenticateUser, requireRole(["manager"]), async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("three_sixty_reviews")
    .delete()
    .eq("id", id);

  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
});

export default router;
