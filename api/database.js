const mysql = require("mysql");

require('dotenv').config();


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
  multipleStatements: false
});

const getAllUsers = async () => {
  return new Promise((resolve, reject)=>{
    db.query("SELECT * FROM Users", (err, result) => {
      if (err) {
        reject(err);
      }else {
        resolve(result);
      }
    });
  });
};

const getUserByUsername = (username) => {
  return new Promise((resolve, reject)=>{
    // username = username.replace(/[^a-zA-Z0-9]/g, '');
    let sql = "SELECT * FROM Users WHERE username=?;";
    let query = mysql.format(sql, [username]);
    db.query(query, (err, result) => {
      if (err) {
        console.log("err", err);
        reject(err);
      } else {
        console.log("result", result);
        resolve(result);
      }
    });
  });
};

const createUser = (username, password) => {
  return new Promise((resolve, reject)=>{
    // username = username.replace(/[^a-zA-Z0-9]/g, '');
    let sql = "INSERT INTO Users (username, password) VALUES (?, ?);";
    let query = mysql.format(sql, [username, password]);
    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      }else {
        resolve(result);
      }
    });
  });
};

const deleteUser = (username) => {
  return new Promise((resolve, reject)=>{
    // username = username.replace(/[^a-zA-Z0-9]/g, '');
    let sql = "DELETE FROM Users WHERE username=?;";
    let query = mysql.format(sql, [username]);
    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      }else {
        resolve(result);
      }
    });
  });
};

module.exports = { getAllUsers, getUserByUsername, createUser, deleteUser };