import express from "express";
import cors from "cors";
import path from "path";
import pool from "../Utils/db.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

app.use(express.static(path.join(__dirname, '../public')));

// Endpoint to fetch quiz questions
app.get("/quiz", async (req, res) => {
  try {
    const allQuestions = await pool.query("SELECT * FROM quiz_questions");
    res.json({ status: "success", data: allQuestions.rows });
  } catch (err) {
    console.error("Error fetching quiz questions:", err.message);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

// Endpoint to add a new question
app.post("/quiz/add", async (req, res) => {
  const { country, correctanswer, options } = req.body;
  try {
    const newQuestion = await pool.query(
      "INSERT INTO quiz_questions (country, correctanswer, options) VALUES ($1, $2, $3) RETURNING *",
      [country, correctanswer, options]
    );
    res.json({ status: "success", data: newQuestion.rows[0] });
  } catch (err) {
    console.error("Error adding question:", err.message);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

// Endpoint to delete a question
app.delete("/quiz/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM quiz_questions WHERE id = $1", [id]);
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