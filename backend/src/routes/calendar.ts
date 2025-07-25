import express from "express";
import { authenticateUser } from "../middleware/auth";
import { requireRole } from "../middleware/roles";
import { supabase } from "../utils/supabaseClient";

const router = express.Router();

/**
 * GET /api/v1/calendar
 * Employee-only: Fetch calendar events for the logged-in user
 */
router.get(
  "/",
  authenticateUser,
  requireRole(["employee"]),
  async (req, res) => {
    const { id: userId } = res.locals.user;

    const { data, error } = await supabase
      .from("calendar")
      .select("*")
      .eq("employee_id", userId)
      .order("date", { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  }
);

/**
 * POST /api/v1/calendar
 * Manager-only: Create a calendar event for an employee
 */
router.post(
  "/",
  authenticateUser,
  requireRole(["manager"]),
  async (req, res) => {
    const { title, description, date, employee_id } = req.body;

    const { data, error } = await supabase.from("calendar").insert([
      {
        title,
        description,
        date,
        employee_id,
      },
    ]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json({ message: "Event created", data });
  }
);

/**
 * DELETE /api/v1/calendar/:id
 * Manager-only: Delete a calendar event by ID
 */
router.delete(
  "/:id",
  authenticateUser,
  requireRole(["manager"]),
  async (req, res) => {
    const { id } = req.params;

    const { error } = await supabase.from("calendar").delete().eq("id", id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(204).send();
  }
);

export default router;
