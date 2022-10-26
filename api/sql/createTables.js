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

// DROP AND CREATE TABLES

db.connect(async (err, connection) => {
  console.log('RUNNING CREATE TABLE SCRIPT');
  let dropAllTables = `DROP TABLE IF EXISTS UsersWithRoles; DROP TABLE IF EXISTS Roles; DROP TABLE IF EXISTS Users; DROP TABLE IF EXISTS Products;`;

  let createUsersTable = `CREATE TABLE Users (
    userId int NOT NULL AUTO_INCREMENT, 
    email varchar(45) NOT NULL, 
    password varchar(100) NOT NULL, 
    PRIMARY KEY (userId)) 
    ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
    `;
  let createRolesTable = `CREATE TABLE Roles (
    roleId int NOT NULL AUTO_INCREMENT,
    rolename varchar(45) NOT NULL,
    PRIMARY KEY (roleId)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `;

  let createUsersWithRolesTable = `CREATE TABLE UsersWithRoles (
    userId int NOT NULL,
    roleId int NOT NULL,
    CONSTRAINT FK_Role FOREIGN KEY (roleId) REFERENCES Roles(roleId),
    CONSTRAINT FK_User FOREIGN KEY (userId) REFERENCES Users(userId)
    ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `;

  let createProductTable = `CREATE TABLE Products (
    productId int NOT NULL AUTO_INCREMENT,
    name varchar(50) NOT NULL,
    price varchar(25) NOT NULL,
    description varchar(1000),
    material varchar(100),
    dimensions varchar(100),
    specification varchar(100),
    images varchar(1000),
    PRIMARY KEY (productId))
    ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `;

  db.query(dropAllTables, async (err) => {
    if (err) {
      console.log('ERROR DROPPING TABLES', err);
      process.exit(1);
    }
    console.log("ALL TABLES DROPPED!");
    db.query(createUsersTable, async (err) => {
      if (err) {
        console.log('ERROR CREATING USERS TABLE', err);
        process.exit(1);
      }
      console.log('USERS TABLE CREATED!');
      db.query(createRolesTable, async (err) => {
        if (err) {
          console.log('ERROR CREATING ROLES TABLE', err);
          process.exit(1);
        }
        console.log('ROLES TABLE CREATED!');
        db.query(createUsersWithRolesTable, async (err) => {
          if (err) {
            console.log('ERROR CREATING USERS WITH ROLES TABLE', err);
            process.exit(1);
          }
          console.log('USERSWITHROLE TABLE CREATED!');
          db.query(createProductTable, async (err) =>{
            if (err) {
              console.log('ERROR CREATING PRODUCTS TABLE', err);
              process.exit(1);
            }
            console.log('PRODUCTS TABLE CREATED!');
            process.exit(0);
          });
        });
      });
    });
  });
});
