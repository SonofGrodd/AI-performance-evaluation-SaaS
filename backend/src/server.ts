import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import routes from "./routes/index"; // adjust if different

dotenv.config();

const app = express();

// ✅ Fix: Allow requests from your frontend
app.use(
  cors({
    origin: "http://localhost:5173", // your Vite frontend
    credentials: true, // if you're using cookies or auth headers
  })
);

// Recommended security middleware
app.use(helmet());

// Basic rate limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
  })
);

// JSON body parsing
app.use(express.json());

// Routes
app.use("/api/v1", routes);

export default app;
