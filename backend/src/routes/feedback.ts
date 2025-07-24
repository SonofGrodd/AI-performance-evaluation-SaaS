import express from "express";
import { authenticateUser } from "../middleware/auth";
import { supabase } from "../utils/supabaseClient";
import OpenAI from "openai";

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// POST /api/v1/feedback
router.post("/", authenticateUser, async (req, res) => {
  const reviewer_id = res.locals.user.id;
  const {
    employee_id,
    review_id,
    feedback_text,
    feedback_type = "continuous",
    is_anonymous = false,
  } = req.body;

  if (!employee_id || !feedback_text) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Call OpenAI for sentiment analysis
  const aiPrompt = `Classify this feedback as positive, neutral, or negative and return a sentiment score between -1 and 1:\n\n"${feedback_text}"`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: aiPrompt }],
    });

    const aiResponse = completion.choices[0].message.content || "";
    const sentimentMatch = aiResponse.match(/(positive|neutral|negative)/i);
    const scoreMatch = aiResponse.match(/-?\\d+\\.\\d+/);

    const sentiment_label = sentimentMatch ? sentimentMatch[1].toLowerCase() : null;
    const sentiment_score = scoreMatch ? parseFloat(scoreMatch[0]) : null;

    const { data, error } = await supabase.from("feedback").insert([
      {
        employee_id,
        review_id,
        reviewer_id: is_anonymous ? null : reviewer_id,
        feedback_text,
        feedback_type,
        is_anonymous,
        sentiment_label,
        sentiment_score,
        ai_insights: { raw_response: aiResponse },
      },
    ]).select().single();

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json(data);
  } catch (err) {
    console.error("OpenAI error:", err);
    return res.status(500).json({ error: "AI sentiment analysis failed" });
  }
});

// GET /api/v1/feedback
router.get("/", authenticateUser, async (req, res) => {
  const userId = res.locals.user.id;

  const { data, error } = await supabase
    .from("feedback")
    .select("*")
    .or(`employee_id.eq.${userId},reviewer_id.eq.${userId}`)
    .order("created_at", { ascending: false });

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json(data);
});

// DELETE /api/v1/feedback/:id
router.delete("/:id", authenticateUser, async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from("feedback").delete().eq("id", id);
  if (error) return res.status(400).json({ error: error.message });

  res.status(204).send();
});

export default router;
