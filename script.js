import express from 'express';
import HTTP_CODES from './utils/httpCodes.mjs';

const server = express();
const port = process.env.PORT || 8000;

server.set('port', port);
server.use(express.static('public'));


function getRoot(req, res, next) {
    res.status(HTTP_CODES.SUCCESS.OK).send('Hello World').end();
}


function getPoem(req, res, next) {
    const poem = `
        I wrote some code, 
        it broke in fright,
        I fixed one bug -
        now ten take flight.
    `;
    res.status(HTTP_CODES.SUCCESS.OK).send(poem).end();
}

function getQuote(req, res, next) {
    const quotes = [
        "The only limit to our realization of tomorrow is our doubts of today. - Franklin D. Roosevelt",
        "You shall not pass. - Gandalf",
        "Success is not the key to happiness. Happiness is the key to success. - Albert Schweitzer",
        "I don't like sand. It's coarse and rough and irritating and it gets everywhere. - Anakin Skywalker",
        "What you get by achieving your goals is not as important as what you become by achieving your goals. - Zig Ziglar"
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    res.status(HTTP_CODES.SUCCESS.OK).send(randomQuote).end();
}

function postSum(req, res, next) {
    const a = parseFloat(req.params.a);
    const b = parseFloat(req.params.b);
    
    const sum = a + b;
    res.status(HTTP_CODES.SUCCESS.OK)
        .json({ sum })
        .end();
}

server.get("/", getRoot);
server.get("/tmp/poem", getPoem);
server.get("/tmp/quote", getQuote);
server.post("/tmp/sum/:a/:b", postSum);

server.listen(server.get('port'), function () {
    console.log('Server running on port', server.get('port'));
});
