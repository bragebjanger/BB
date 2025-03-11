import express from 'express'
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
const path = require("path");
app.use(express.static(path.join(__dirname, 'public')));

const quizQuestions = [
    {
        id: 1,
        country: "Norway",
        correctAnswer: "Oslo",
        options: ["Oslo", "Stockholm", "Copenhagen", "Helsinki"]
    },
    {
        id: 2,
        country: "France",
        correctAnswer: "Paris",
        options: ["Paris", "Berlin", "Madrid", "Rome"]
    },
    {
        id: 3,
        country: "Japan",
        correctAnswer: "Tokyo",
        options: ["Seoul", "Beijing", "Bangkok", "Tokyo"]
    },
    {
        id: 4,
        country: "Sweden",
        correctAnswer: "Stockholm",
        options: ["Copenhagen", "Stockholm", "Helsinki", "Oslo"]
    },
    {
        id: 5,
        country: "USA",
        correctAnswer: "Washington DC",
        options: ["New York", "Los Angeles", "Washington DC", "Houston"]
    },
    {
        id: 6,
        country: "Brazil",
        correctAnswer: "Brasilia",
        options: ["Brasilia", "Rio De Janeiro", "Sao Paulo", "Salvador"]
    },
    {
        id: 7,
        country: "Australia",
        correctAnswer: "Canberra",
        options: ["Victoria", "Sidney", "Perth", "Canberra"]
    },
    {
        id: 8,
        country: "England",
        correctAnswer: "London",
        options: ["Derby", "Southampton", "London", "York"]
    },
    {
        id: 9,
        country: "Germany",
        correctAnswer: "Berlin",
        options: ["Berlin", "Hamburg", "Dusseldorf", "Munchen"]
    },
    {
        id: 10,
        country: "Italy",
        correctAnswer: "Rome",
        options: ["Venice", "Napoli", "Firenze", "Rome"]
    }
];

app.get("/quiz", (req, res) => {
    res.json({ status: "success", data: quizQuestions });
});

app.get("/quiz/:id", (req, res) => {
    const { id } = req.params;
    const question = findQuestionById(quizQuestions, id);
    res.json({ status: "success", data: question });
  });

app.post("/quiz", (req, res) => {
  const { question, correctAnswer, options } = req.body;
  const newQuestion = {
    id: quizQuestions.length + 1,
    question,
    correctAnswer,
    options
  };
  quizQuestions.push(newQuestion);
  res.json({ status: "success", data: newQuestion });
});

app.put("/quiz/:id", (req, res) => {
    const { id } = req.params;
    const { question, correctAnswer, options } = req.body;
    const questionToUpdate = findQuestionById(quizQuestions, id);
    if (questionToUpdate) {
      questionToUpdate.question = question || questionToUpdate.question;
      questionToUpdate.correctAnswer = correctAnswer || questionToUpdate.correctAnswer;
      questionToUpdate.options = options || questionToUpdate.options;
      res.json({ status: "success", data: questionToUpdate });
    } else {
      res.status(404).json({ status: "error", message: "Question not found" });
    }
  });

app.delete("/quiz/:id", (req, res) => {
    const { id } = req.params;
    const questionIndex = quizQuestions.findIndex(q => q.id == id);
    
    if (questionIndex !== -1) {
      quizQuestions.splice(questionIndex, 1);
      res.json({ status: "success", message: "Question deleted" });
    } else {
      res.status(404).json({ status: "error", message: "Question not found" });
    }
});

function findQuestionById(node, id) {
    if (!node) return null;
    if (node.id == id) return node;
  }

const PORT = 3000;
app.listen(PORT, () => console.log(`API kjører på http://localhost:${PORT}`));