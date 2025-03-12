import pg from "pg";
const { Pool } = pg;

console.log("Initialiserer databasekobling...");
console.log("DATABASE_URL:", process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Feil ved tilkobling til databasen:', err);
  } else {
    console.log('Tilkobling til databasen vellykket. Nåværende tid:', res.rows[0].now);
  }
});

export default pool;