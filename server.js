const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const capitals = [
    { country: "Norway", capital: "Oslo" },
    { country: "Sweden", capital: "Stockholm" },
    { country: "France", capital: "Paris" },
    { country: "Japan", capital: "Tokyo" },
    { country: "Brazil", capital: "Brasilia" }
];