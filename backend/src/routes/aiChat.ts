import express from "express";
import { authenticateUser } from "../middleware/auth";
import { supabase } from "../utils/supabaseClient";
import { OpenAI } from "openai";

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/chat", authenticateUser, async (req, res) => {
  const userId = res.locals.user.id;
  const { message } = req.body;

  if (!message) return res.status(400).json({ error: "Message is required" });

  // Get performance review
  const { data: review } = await supabase
    .from("performance_reviews")
    .select("*")
    .eq("employee_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const { data: feedback } = await supabase
    .from("feedback")
    .select("feedback_text, sentiment_label")
    .eq("employee_id", userId);

  const { data: insights } = await supabase
    .from("ai_insights")
    .select("*")
    .eq("employee_id", userId)
    .eq("is_active", true);

  const prompt = `
You are an AI performance assistant for employees. Given the following:
- Most recent review: ${JSON.stringify(review)}
- Feedback: ${JSON.stringify(feedback)}
- AI Insights: ${JSON.stringify(insights)}

Answer the following employee's question in a friendly and supportive tone:
"${message}"
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an employee performance assistant." },
        { role: "user", content: prompt },
      ],
    });

    const aiResponse = completion.choices[0].message.content;
    res.json({ response: aiResponse });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate AI response" });
  }
});

export default router;
