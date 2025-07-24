import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import performanceReviewRoutes from "./routes/performanceReviews";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Fredan AI Staff Assessment API is running ✅");
});

app.use("/api/v1/performance-reviews", performanceReviewRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
