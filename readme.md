Link til Render:

https://bb-bzw5.onrender.com


Tabell til SQL:

CREATE TABLE quiz_questions (
  id SERIAL PRIMARY KEY,
  country VARCHAR(255) NOT NULL,
  correctanswer VARCHAR(255) NOT NULL,
  options TEXT[] NOT NULL
);
