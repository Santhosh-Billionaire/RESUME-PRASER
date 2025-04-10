const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'resume_db',
  password: '172314',
  port: 5432, // default PostgreSQL port
});

module.exports = pool;
