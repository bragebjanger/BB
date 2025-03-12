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


console.log("Starter serveren...");

console.log("Miljøvariabler:");
console.log("DATABASE_URL:", process.env.DATABASE_URL);
console.log("PORT:", process.env.PORT || 3000);

app.get("/", (req, res) => {
  console.log("GET / - Mottatt forespørsel til rot-URL-en");
  const indexPath = path.join(__dirname, '../public/index.html');
  console.log("Serving index.html from:", indexPath);
  res.sendFile(indexPath);
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


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API kjører på http://localhost:${PORT}`);
});