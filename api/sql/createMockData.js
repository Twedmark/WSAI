const mysql = require("mysql");

const bcrypt = require("bcrypt");

const mockProducts = require("./products.json");

const pwd123Hashed = bcrypt.hashSync("Pwd12345", 10);

require("dotenv").config();

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
  multipleStatements: true,
});

// CREATE MOCK DATA / USERS / ROLES

// MOCK RECEIPT
const MockReceipt = [{ 95: 1 }, { 124: 2 }, { 149: 5 }];
const MockReceipt2 = [{ 35: 4 }, { 114: 1 }, { 200: 3 }];

db.connect(async (err, connection) => {
  console.log("RUNNING CREATE MOCK DATA SCRIPT");
  let userAccount = `INSERT INTO Users (userId, email, password) VALUES (null, "User@user.com", "${pwd123Hashed}");`;
  let adminAccount = `INSERT INTO Users (userId, email, password) VALUES (null, "Admin@admin.com", "${pwd123Hashed}");`;
  let superAdminAccount = `INSERT INTO Users (userId, email, password) VALUES (null, "SuperAdmin@superadmin.com", "${pwd123Hashed}");`;

  let userRole = `INSERT INTO Roles (roleId, rolename) VALUES (1000, "User");`;
  let adminRole = `INSERT INTO Roles (roleId, rolename) VALUES (2000, "Admin");`;
  let superAdminRole = `INSERT INTO Roles (roleId, rolename) VALUES (3000, "SuperAdmin");`;

  let userWithUserRole = `INSERT INTO UsersWithRoles (userId, roleId) VALUES (1, 1000);`;
  let adminWithUserRole = `INSERT INTO UsersWithRoles (userId, roleId) VALUES (2, 1000);`;
  let adminWithAdminRole = `INSERT INTO UsersWithRoles (userId, roleId) VALUES (2, 2000);`;
  let superAdminWithUserRole = `INSERT INTO UsersWithRoles (userId, roleId) VALUES (3, 1000);`;
  let superAdminWithAdminRole = `INSERT INTO UsersWithRoles (userId, roleId) VALUES (3, 2000);`;
  let superAdminWithSuperAdminRole = `INSERT INTO UsersWithRoles (userId, roleId) VALUES (3, 3000);`;

  let userReceipt = `INSERT INTO Receipts (receiptId, products, userId, totalPrice, createdAt) VALUES (null, '${JSON.stringify(
    MockReceipt
  )}', 1, 9001, NOW());`;
  let userReceipt2 = `INSERT INTO Receipts (receiptId, products, userId, totalPrice, createdAt) VALUES (null, '${JSON.stringify(
    MockReceipt2
  )}', 1, 9002, NOW());`;

  mockProducts.forEach(async (product, index) => {
    let insertProduct = `INSERT INTO Products (productId, name, price, description, images) VALUES (null, "${product.name}", "${product.price}", "${product.description}", "${product.images}");`;
    await db.query(insertProduct, (err, result) => {
      if (err) {
        console.log("ERROR ADDING MOCK PRODUCTS", err);
        process.exit(1);
      }
      console.log(`Product ${index} inserted`);
    });
  });

  let query =
    userAccount +
    adminAccount +
    superAdminAccount +
    userRole +
    adminRole +
    superAdminRole +
    userWithUserRole +
    adminWithUserRole +
    adminWithAdminRole +
    superAdminWithUserRole +
    superAdminWithAdminRole +
    superAdminWithSuperAdminRole +
    userReceipt +
    userReceipt2;
  db.query(query, async (err) => {
    if (err) {
      console.log("ERROR CREATING MOCK DATA", err);
      process.exit(1);
    }
    console.log("USERS AND PRODUCTS CREATED!");
    process.exit(0);
  });
});
