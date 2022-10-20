const mysql = require('mysql');

const bcrypt = require('bcrypt');

const pwd123Hashed = bcrypt.hashSync("pwd123", 10);

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

// CREATE MOCK DATA / USERS / ROLES

db.connect(async (err, connection) => {
  console.log('RUNNING CREATE TABLE SCRIPT');
  let userAccount = `INSERT INTO Users (userId, email, password) VALUES (null, "User ", "${pwd123Hashed}");`;
  let adminAccount = `INSERT INTO Users (userId, email, password) VALUES (null, "Admin ", "${pwd123Hashed}");`;
  let superAdminAccount = `INSERT INTO Users (userId, email, password) VALUES (null, "SuperAdmin ", "${pwd123Hashed}");`;

  let userRole = `INSERT INTO Roles (roleId, rolename) VALUES (1000, "User");`;
  let adminRole = `INSERT INTO Roles (roleId, rolename) VALUES (2000, "Admin");`;
  let superAdminRole = `INSERT INTO Roles (roleId, rolename) VALUES (3000, "SuperAdmin");`;

  let userWithUserRole = `INSERT INTO UsersWithRoles (userId, roleId) VALUES (1, 1000);`;
  let adminWithAdminRole = `INSERT INTO UsersWithRoles (userId, roleId) VALUES (2, 2000);`;
  let superAdminWithSuperAdminRole = `INSERT INTO UsersWithRoles (userId, roleId) VALUES (3, 3000);`;

  let query = userAccount + adminAccount + superAdminAccount + userRole + adminRole + superAdminRole + userWithUserRole + adminWithAdminRole + superAdminWithSuperAdminRole;
  db.query(query, async (err) => {
    if (err) {
      console.log('ERROR CREATING TABLES', err);
      process.exit(1);
    }
    console.log('USERS CREATED!');
    process.exit(0);
  });

});