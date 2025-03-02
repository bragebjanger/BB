const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

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
    res.json({ status: "success", data: capitals });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`API kjører på http://localhost:${PORT}`));