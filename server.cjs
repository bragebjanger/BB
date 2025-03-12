const express = require("express");
const cors = require("cors");
const path = require("path");
const pool = require('./db.cjs');
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// Logg når serveren starter
console.log("Starter serveren...");

// Logg miljøvariabler for debugging
console.log("Miljøvariabler:");
console.log("DATABASE_URL:", process.env.DATABASE_URL);
console.log("PORT:", process.env.PORT || 3000);

app.get("/", (req, res) => {
  console.log("GET / - Mottatt forespørsel til rot-URL-en");
  res.send("Velkommen til Capital Quiz API-et!");
});

app.get("/quiz", async (req, res) => {
  console.log("GET /quiz - Mottatt forespørsel om alle quiz-spørsmål");
  try {
    const allQuestions = await pool.query("SELECT * FROM quiz_questions");
    console.log("Spørring vellykket. Antall spørsmål:", allQuestions.rows.length);
    res.json({ status: "success", data: allQuestions.rows });
  } catch (err) {
    console.error("Feil under henting av quiz-spørsmål:", err.message);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

app.get("/quiz/:id", async (req, res) => {
  const { id } = req.params;
  console.log(`GET /quiz/${id} - Mottatt forespørsel om quiz-spørsmål med ID ${id}`);
  try {
    const question = await pool.query("SELECT * FROM quiz_questions WHERE id = $1", [id]);
    if (question.rows.length === 0) {
      console.log(`Ingen spørsmål funnet med ID ${id}`);
      return res.status(404).json({ status: "error", message: "Question not found" });
    }
    console.log("Spørsmål funnet:", question.rows[0]);
    res.json({ status: "success", data: question.rows[0] });
  } catch (err) {
    console.error("Feil under henting av quiz-spørsmål:", err.message);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

app.post("/quiz", async (req, res) => {
  console.log("POST /quiz - Mottatt forespørsel om å opprette et nytt quiz-spørsmål");
  try {
    const { country, correctAnswer, options } = req.body;
    console.log("Mottatt data:", { country, correctAnswer, options });
    const newQuestion = await pool.query(
      "INSERT INTO quiz_questions (country, correctAnswer, options) VALUES ($1, $2, $3) RETURNING *",
      [country, correctAnswer, options]
    );
    console.log("Nytt spørsmål opprettet:", newQuestion.rows[0]);
    res.json({ status: "success", data: newQuestion.rows[0] });
  } catch (err) {
    console.error("Feil under opprettelse av quiz-spørsmål:", err.message);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

app.put("/quiz/:id", async (req, res) => {
  const { id } = req.params;
  console.log(`PUT /quiz/${id} - Mottatt forespørsel om å oppdatere quiz-spørsmål med ID ${id}`);
  try {
    const { country, correctAnswer, options } = req.body;
    console.log("Mottatt data:", { country, correctAnswer, options });
    const updatedQuestion = await pool.query(
      "UPDATE quiz_questions SET country = $1, correctAnswer = $2, options = $3 WHERE id = $4 RETURNING *",
      [country, correctAnswer, options, id]
    );
    if (updatedQuestion.rows.length === 0) {
      console.log(`Ingen spørsmål funnet med ID ${id} for oppdatering`);
      return res.status(404).json({ status: "error", message: "Question not found" });
    }
    console.log("Spørsmål oppdatert:", updatedQuestion.rows[0]);
    res.json({ status: "success", data: updatedQuestion.rows[0] });
  } catch (err) {
    console.error("Feil under oppdatering av quiz-spørsmål:", err.message);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

app.delete("/quiz/:id", async (req, res) => {
  const { id } = req.params;
  console.log(`DELETE /quiz/${id} - Mottatt forespørsel om å slette quiz-spørsmål med ID ${id}`);
  try {
    const result = await pool.query("DELETE FROM quiz_questions WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      console.log(`Ingen spørsmål funnet med ID ${id} for sletting`);
      return res.status(404).json({ status: "error", message: "Question not found" });
    }
    console.log(`Spørsmål med ID ${id} slettet`);
    res.json({ status: "success", message: "Question deleted" });
  } catch (err) {
    console.error("Feil under sletting av quiz-spørsmål:", err.message);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API kjører på http://localhost:${PORT}`);
});