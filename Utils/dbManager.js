import pool from './db.js';

export async function getQuestions() {
  const result = await pool.query("SELECT * FROM quiz_questions");
  return result.rows;
}

export async function addQuestion(question) {
  const result = await pool.query(
    "INSERT INTO quiz_questions (country, correctanswer, options) VALUES ($1, $2, $3) RETURNING *",
    [question.country, question.correctanswer, question.options]
  );
  return result.rows[0];
}

export async function deleteQuestion(id) {
  await pool.query("DELETE FROM quiz_questions WHERE id = $1", [id]);
}