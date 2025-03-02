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

app.get("/quiz", (req, res) => {
    res.json({ status: "success", data: capitals });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`API kjører på http://localhost:${PORT}`));