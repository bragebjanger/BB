import express from 'express';
import HTTP_CODES from './utils/httpCodes.mjs';
import { v4 as uuidv4 } from 'uuid';
import cors from 'cors';

const server = express();
const port = process.env.PORT || 8000;

server.set('port', port);
server.use(express.static('public'));

server.use(cors());

const decks = {};

function createDeck(){
    const suits = ["Hearts", "Diamonds", "Spades", "Clubs"]
    const values = ["1","2","3","4","5","6","7","8","9","10","Jack","Queen","King","Ace"]

    const deck =[];
    for(const suit of suits){
        for(const value of values){
            deck.push({suit, value})
        }
    }

    return deck;
}

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function getDeck(req, res, next) {
    const { deck_id } = req.params;

    if (!decks[deck_id]) {
        return res.status(404)
            .json({ error: "Deck not found" })
            .end();
    }

    const deck = decks[deck_id];
    res.status(200)
        .json({ deck_id: deck_id, deck: deck })
        .end();
}

function getCardFromDeck(req, res, next) {
    const { deck_id } = req.params;

    if (!decks[deck_id]) {
        return res.status(404)
            .json({ error: "Deck not found" })
            .end();
    }

    const deck = decks[deck_id];

    if (deck.length === 0) {
        return res.status(400)
            .json({ error: "No cards left in the deck" })
            .end();
    }


    const drawnCard = deck.pop();


    res.status(200)
        .json({ deck_id: deck_id, drawn_card: drawnCard, remaining_deck: deck })
        .end();
}

function patchShuffleDeck(req, res, next) {
    const { deck_id } = req.params;

    if (!decks[deck_id]) {
        return res.status(404)
            .json({ error: "Deck not found" })
            .end();
    }

    const deck = decks[deck_id];
    shuffleDeck(deck);

    res.status(200)
        .json({ deck_id: deck_id, shuffled_deck: deck })
        .end();
}

function postCreateDeck(req, res, next) {
    const deckId = uuidv4();
    const deck = createDeck();

    decks[deckId] = deck;

    res.status(HTTP_CODES.SUCCESS.CREATED)
        .json({ deck_id: deckId })
        .end();
}


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
server.post("/temp/deck", postCreateDeck);
server.get("/temp/deck/:deck_id", getDeck);
server.get("/temp/deck/:deck_id/card", getCardFromDeck);
server.patch("/temp/deck/shuffle/:deck_id", patchShuffleDeck);


server.listen(server.get('port'), function () {
    console.log('Server running on port', server.get('port'));
});
