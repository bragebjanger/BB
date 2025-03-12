const express = require("express");
const cors = require("cors");
const path = require("path");
const pool = require('./db.cjs');

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get("/quiz", async (req, res) => {
    try {
        const allQuestions = await pool.query("SELECT * FROM quiz_questions");
        res.json({ status: "success", data: allQuestions.rows });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ status: "error", message: "Server error" });
    }
});

app.get("/quiz/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const question = await pool.query("SELECT * FROM quiz_questions WHERE id = $1", [id]);
        res.json({ status: "success", data: question.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ status: "error", message: "Server error" });
    }
});

app.post("/quiz", async (req, res) => {
    try {
        const { country, correctAnswer, options } = req.body;
        const newQuestion = await pool.query(
            "INSERT INTO quiz_questions (country, correctAnswer, options) VALUES ($1, $2, $3) RETURNING *",
            [country, correctAnswer, options]
        );
        res.json({ status: "success", data: newQuestion.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ status: "error", message: "Server error" });
    }
});

app.put("/quiz/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { country, correctAnswer, options } = req.body;
        const updatedQuestion = await pool.query(
            "UPDATE quiz_questions SET country = $1, correctAnswer = $2, options = $3 WHERE id = $4 RETURNING *",
            [country, correctAnswer, options, id]
        );
        res.json({ status: "success", data: updatedQuestion.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ status: "error", message: "Server error" });
    }
});

app.delete("/quiz/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM quiz_questions WHERE id = $1", [id]);
        res.json({ status: "success", message: "Question deleted" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ status: "error", message: "Server error" });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`API kjører på http://localhost:${PORT}`));