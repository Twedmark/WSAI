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

const getUserByemail = (email) => {
  return new Promise((resolve, reject)=>{
    // email = email.replace(/[^a-zA-Z0-9]/g, '');
    let sql = "SELECT * FROM Users WHERE email=?;";
    let query = mysql.format(sql, [email]);
    db.query(query, (err, result) => {
      if (err) {
        console.log("err", err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const createUser = (email, password) => {
  return new Promise((resolve, reject)=>{
    // email = email.replace(/[^a-zA-Z0-9]/g, '');
    let sql = "INSERT INTO Users (userId, email, password) VALUES (null, ?, ?);";
    let query = mysql.format(sql, [email, password]);
    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      }else {
        resolve(result.insertId);
      }
    });
  });
};

const assignRole = (email, role) => {
  return new Promise((resolve, reject)=>{
    let sql = "INSERT INTO UsersWithRoles (userId, roleId) VALUES (?, ?);";
    let query = mysql.format(sql, [email, role]);
    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      }else {
        resolve(result);
      }
    });
  });
};

const deleteUser = (email) => {
  return new Promise((resolve, reject)=>{
    // email = email.replace(/[^a-zA-Z0-9]/g, '');
    let sql = "DELETE FROM Users WHERE email=?;";
    let query = mysql.format(sql, [email]);
    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      }else {
        resolve(result);
      }
    });
  });
};

module.exports = { getAllUsers, getUserByemail, createUser, deleteUser, assignRole };