const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres', //username of the psql database 
  host: 'localhost',
  database: 'resume_db', //enter the name of the database 
  password: '', //enter your databse password
  port: 5432, // default PostgreSQL port
});

module.exports = pool;
