const mysql = require("mysql");
require('dotenv').config();


const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_DATABASE = process.env.DB_DATABASE;
const DB_PORT = process.env.DB_PORT;

const pool = mysql.createPool({
  connectionLimit: 100,
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  port: DB_PORT,
  multipleStatements: false
});

let db = {}

db.getAllUsers = async () => {
  return new Promise((resolve, reject)=>{
    pool.query("SELECT * FROM Users", (err, result) => {
      if (err) {
        reject("Could not get all users: SQL ERROR ",err);
      }else {
        resolve(result);
      }
    });
  });
};

db.getUserByemail = (email) => {
  return new Promise((resolve, reject)=>{
    // email = email.replace(/[^a-zA-Z0-9]/g, '');
    let sql = "SELECT * FROM Users WHERE email=?;";
    let query = mysql.format(sql, [email]);
    console.log(query);
    pool.query(query, (err, result) => {
      if (err) {
        console.log("Could not get user: SQL ERROR ", err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

db.createUser = (email, password) => {
  return new Promise((resolve, reject)=>{
    // email = email.replace(/[^a-zA-Z0-9]/g, '');
    let sql = "INSERT INTO Users (userId, email, password) VALUES (null, ?, ?);";
    let query = mysql.format(sql, [email, password]);
    pool.query(query, (err, result) => {
      if (err) {
        reject("Could not create user: SQL ERROR ",err);
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
    pool.query(query, (err, result) => {
      if (err) {
        reject("Could not assign role: SQL ERROR ",err);
      }else {
        resolve(result);
      }
    });
  });
};

db.deleteUser = (email) => {
  return new Promise((resolve, reject)=>{
    // email = email.replace(/[^a-zA-Z0-9]/g, '');
    let sql = "DELETE FROM Users WHERE email=?;";
    let query = mysql.format(sql, [email]);
    pool.query(query, (err, result) => {
      if (err) {
        reject("Could not delete user: SQL ERROR ",err);
      }else {
        resolve(result);
      }
    });
  });
};

db.getRolesForUser = (userId) => {
  return new Promise((resolve, reject)=>{
    let sql = "SELECT * FROM UsersWithRoles INNER JOIN Roles ON Roles.roleId=UsersWithRoles.roleId WHERE userId=?;";
    let query = mysql.format(sql, [userId]);
    pool.query(query, (err, result) => {
      if (err) {
        console.log("Could not get roles for user: SQL ERROR ", err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

db.getAllProducts = async () => {
  return new Promise((resolve, reject)=>{
    pool.query("SELECT * FROM Products", (err, result) => {
      if (err) {
        reject("Could not get all products: SQL ERROR ",err);
      }else {
        resolve(result);
      }
    });
  }
  );
};

db.getRandomProducts = (amount) => {
  return new Promise((resolve, reject)=>{
    let sql = "SELECT * FROM Products ORDER BY RAND() LIMIT ?;";
    let query = mysql.format(sql, [amount]);
    console.log(query);
    pool.query(query, (err, result) => {
      if (err) {
        reject("Could not get random products: SQL ERROR ",err);
      }else {
        resolve(result);
      }
    });
  });
};

db.getProductById = (productId) => {
  return new Promise((resolve, reject)=>{
    let sql = "SELECT * FROM Products WHERE productId=?;";
    let query = mysql.format(sql, [productId]);
    pool.query(query, (err, result) => {
      if (err) {
        console.log("Could not get product: SQL ERROR ", err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  }
  );
};

module.exports = db;