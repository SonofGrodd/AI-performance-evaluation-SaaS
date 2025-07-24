import express from "express";
import { authenticateUser } from "../middleware/auth";
import { supabase } from "../utils/supabaseClient";

const router = express.Router();

// ✅ GET /api/v1/notifications
router.get("/", authenticateUser, async (req, res) => {
  const userId = res.locals.user.id;

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("recipient_id", userId)
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

// ✅ PATCH /api/v1/notifications/:id/read
router.patch("/:id/read", authenticateUser, async (req, res) => {
  const userId = res.locals.user.id;
  const notificationId = req.params.id;

  const { error } = await supabase
    .from("notifications")
    .update({
      is_read: true,
      read_at: new Date().toISOString(),
    })
    .eq("id", notificationId)
    .eq("recipient_id", userId);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: "Notification marked as read." });
});

// ✅ POST /api/v1/notifications (Optional — for internal/system usage)
router.post("/", authenticateUser, async (req, res) => {
  const { recipient_id, type, title, message, link } = req.body;

  if (!recipient_id || !type || !title) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const { error } = await supabase.from("notifications").insert([
    {
      recipient_id,
      type,
      title,
      message,
      link,
    },
  ]);

  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json({ message: "Notification sent." });
});

export default router;
