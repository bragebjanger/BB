import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { getQuestions, addQuestion, deleteQuestion } from "../Utils/dbManager.js";
import QuizQuestion from "../Utils/quizQuestions.js"; // Ensure this file exists

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Rate limiting middleware
const rateLimit = (limit, windowInMinutes) => {
  const requestCounts = new Map();

  return (req, res, next) => {
    const ip = req.ip;
    const currentTime = Date.now();
    const windowStart = currentTime - windowInMinutes * 60 * 1000;

    if (!requestCounts.has(ip)) {
      requestCounts.set(ip, { count: 1, lastRequestTime: currentTime });
    } else {
      const clientData = requestCounts.get(ip);

      if (clientData.lastRequestTime < windowStart) {
        clientData.count = 1;
        clientData.lastRequestTime = currentTime;
      } else {
        clientData.count += 1;
      }

      if (clientData.count > limit) {
        return res.status(429).json({
          status: "error",
          message: "Too many requests. Please try again later.",
        });
      }
    }

    next();
  };
};

const RATE_LIMIT = 100; // Allow 100 requests per client
const WINDOW_IN_MINUTES = 15; // Time window in minutes
app.use(rateLimit(RATE_LIMIT, WINDOW_IN_MINUTES));

app.use(express.static(path.join(__dirname, '../public')));

// Endpoint to fetch quiz questions
app.get("/quiz", async (req, res) => {
  try {
    const questions = await getQuestions();
    res.json({ status: "success", data: questions });
  } catch (err) {
    console.error("Error fetching quiz questions:", err.message);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

// Endpoint to add a new question
app.post("/quiz/add", async (req, res) => {
  const { country, correctanswer, options } = req.body;
  const question = new QuizQuestion(null, country, correctanswer, options);

  if (!question.isValid()) {
    return res.status(400).json({ status: "error", message: "Invalid question data" });
  }

  try {
    const newQuestion = await addQuestion(question);
    res.json({ status: "success", data: newQuestion });
  } catch (err) {
    console.error("Error adding question:", err.message);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

// Endpoint to delete a question
app.delete("/quiz/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await deleteQuestion(id);
    res.json({ status: "success", message: "Question deleted" });
  } catch (err) {
    console.error("Error deleting question:", err.message);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});