const mysql = require('mysql');

require('dotenv').config();

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_DATABASE = process.env.DB_DATABASE;
const DB_PORT = process.env.DB_PORT;

const db = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  port: DB_PORT,
  multipleStatements: true
});

// CREATE TABLES

db.connect(async (err, connection) => {
  let dropAllTables = `DROP TABLE UsersWithRoles; DROP TABLE Roles; DROP TABLE IF EXISTS Users;`;
  db.query(dropAllTables, async (err) => {
    if (err) {
      console.log('ERROR DROPPING TABLES', err);
      process.exit(1);
    }
    console.log('TABLES DROPPED!');
    process.exit(0);
  });
});