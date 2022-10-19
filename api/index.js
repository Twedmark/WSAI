const express = require('express');
const mysql = require("mysql");
const bcrypt = require('bcrypt');
const cors = require('cors');

require('dotenv').config();

const app = express();

const port = process.env.PORT;

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_DATABASE = process.env.DB_DATABASE;
const DB_PORT = process.env.DB_PORT;

const db = mysql.createPool({
  connectionLimit: 100,
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  port: DB_PORT,
  insecureAuth: true,
});

app.get('/', (req, res) => {
  res.send("Try /getAllUsers or /createUser");
});

app.get('/getAllUsers', async (req, res) => {
  console.log('-----getAllUsers-----');
  
  db.getConnection((err, connection) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    console.log('Connected!!');

    connection.query(
      `SELECT * FROM Users;`,
      async (err, result) => {
        if (err) {
          console.log(err);
          res.send(err);
        }
        console.log(result);
        res.send(result);
      }
    );
  });
});

app.get('/getUserByUsername/:username', async (req, res) => {
  console.log('-----getUserByUsername-----');

  let username = req.params.username;

  db.getConnection((err, connection) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    console.log('Connected!!');

    connection.query(
      `SELECT * FROM Users WHERE username='${username}';`,
      async (err, result) => {
        if (err) {
          console.log(err);
          res.send(err);
        }
        console.log(result);
        res.send(result);
      }
    );
  });
});


app.get('/createUser', async (req, res) => {
  console.log('-----createUser-----');

  const username = 'test';
  const password = 'pwd123';

  db.getConnection((err, connection) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    console.log('Connected!!');

    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        console.log(err);
        res.send(err);
      }
      console.log('Hashed password');

      connection.query(
        `INSERT INTO Users (userId, username, password) VALUES (null, '${username}', '${hash}')`,
        async (err, result) => {
          if (err) {
            console.log(err);
            res.send(err);
          }
          console.log(result);
          res.send(result);
        }
      );
    });
  });
});

app.get('/deleteUser/:username', async (req, res) => {
  console.log('-----deleteUser-----');

  let username = req.params.username;

  db.getConnection((err, connection) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    console.log('Connected!!');

    connection.query(
      `DELETE FROM Users WHERE username='${username}';`,
      async (err, result) => {
        if (err) {
          console.log(err);
          res.send(err);
        }
        console.log(result);
        res.send(result);
      }
    );
  });
});

app.listen(port, (err) => {
  if (err) {
    console.log("error listening on port 4000 ", err);
  }else {
    console.log("listening on port 4000");
  }
})
