import express from "express";
import { supabase } from "../utils/supabaseClient";
import { authenticateUser } from "../middleware/auth";
import { requireRole } from "../middleware/roles";

const router = express.Router();

// POST - Create a new performance review [Manager Only]
router.post("/", authenticateUser, requireRole(["manager"]), async (req, res) => {
  const { employee_id, review_text, rating } = req.body;
  const manager_id = res.locals.user.id;

  const { data, error } = await supabase.from("performance_reviews").insert([
    {
      employee_id,
      manager_id,
      review_text,
      rating,
    },
  ]);

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json({ message: "Review created", data });
});

// GET - Fetch all reviews for current employee or manager
router.get("/", authenticateUser, requireRole(["employee", "manager"]), async (req, res) => {
  const userId = res.locals.user.id;
  const userRole = res.locals.user.role;

  const query = supabase.from("performance_reviews").select("*");

  if (userRole === "employee") {
    query.eq("employee_id", userId);
  } else if (userRole === "manager") {
    query.eq("manager_id", userId);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

export default router;
