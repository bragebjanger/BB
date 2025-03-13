Dette programmet skal være en Hovedstadsquiz som kan brukes som flashcards ved å la brukeren legge inn flere spørsmål med svaralternativer for så å kunne gå igjennom hvert land i en ny quiz. Alt fungerer med PWA og Databasen lar seg oppdateres dynamisk fra html siden


Link til Render:

https://bb-bzw5.onrender.com


Tabell til SQL:

CREATE TABLE quiz_questions (
  id SERIAL PRIMARY KEY,
  country VARCHAR(255) NOT NULL,
  correctanswer VARCHAR(255) NOT NULL,
  options TEXT[] NOT NULL
);
