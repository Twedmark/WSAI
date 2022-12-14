const mysql = require("mysql");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const logger = require("./logger");

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
  multipleStatements: false,
});

let db = {};

// ---> User queries <---
db.getAllUsers = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM Users", (err, result) => {
      if (err) {
        reject("Could not get all users: SQL ERROR ", err);
      } else {
        resolve(result);
      }
    });
  });
};

db.getAllUsersWithRoles = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT Users.userId, Users.email, Users.password, GROUP_CONCAT(Roles.roleName) AS roles FROM Users INNER JOIN UsersWithRoles ON Users.userId = UsersWithRoles.userId INNER JOIN Roles ON UsersWithRoles.roleId = Roles.roleId GROUP BY Users.userId",
      (err, result) => {
        if (err) {
          reject("Could not get all users: SQL ERROR ", err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

db.getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    // email = email.replace(/[^a-zA-Z0-9]/g, '');
    let sql = "SELECT * FROM Users WHERE email=?;";
    let query = mysql.format(sql, [email]);
    pool.query(query, (err, result) => {
      if (err) {
        logger.debug("Could not get user: SQL ERROR ", err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

db.getUserById = (userId) => {
  return new Promise((resolve, reject) => {
    let sql = "SELECT * FROM Users WHERE userId=?;";
    let query = mysql.format(sql, [userId]);
    pool.query(query, (err, result) => {
      if (err) {
        logger.debug("Could not get user: SQL ERROR ", err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

db.getUserByToken = (token) => {
  return new Promise((resolve, reject) => {
    const email = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET).email;
    if (!email) {
      reject("Could not get user by token: No email in token");
    } else {
      let sql = "SELECT * FROM Users WHERE email=?;";
      let query = mysql.format(sql, [email]);
      pool.query(query, (err, result) => {
        if (err) {
          logger.debug("Could not get user: SQL ERROR ", err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    }
  });
};

db.getUserinfoWithRole = (roleId) => {
  return new Promise((resolve, reject) => {
    let sql =
      "SELECT * FROM Users INNER JOIN UsersWithRoles ON Users.userId=UsersWithRoles.userId WHERE roleId=?;";
    let query = mysql.format(sql, [roleId]);
    pool.query(query, (err, result) => {
      if (err) {
        logger.debug("Could not get user info with role: SQL ERROR ", err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

db.createUser = (email, password) => {
  return new Promise((resolve, reject) => {
    // email = email.replace(/[^a-zA-Z0-9]/g, '');
    let sql =
      "INSERT INTO Users (userId, email, password) VALUES (null, ?, ?);";
    let query = mysql.format(sql, [email, password]);
    pool.query(query, (err, result) => {
      if (err) {
        reject("Could not create user: SQL ERROR ", err);
      } else {
        resolve(result.insertId);
      }
    });
  });
};

db.assignRole = (email, role) => {
  return new Promise((resolve, reject) => {
    let sql = "INSERT INTO UsersWithRoles (userId, roleId) VALUES (?, ?);";
    let query = mysql.format(sql, [email, role]);
    pool.query(query, (err, result) => {
      if (err) {
        reject("Could not assign role: SQL ERROR ", err);
      } else {
        resolve(result);
      }
    });
  });
};

db.removeRole = (email, role) => {
  return new Promise((resolve, reject) => {
    let sql = "DELETE FROM UsersWithRoles WHERE userId=? AND roleId=?;";
    let query = mysql.format(sql, [email, role]);
    pool.query(query, (err, result) => {
      if (err) {
        reject("Could not remove role: SQL ERROR ", err);
      } else {
        resolve(result);
      }
    });
  });
};

db.deleteUser = (userId) => {
  return new Promise((resolve, reject) => {
    // remove all roles in usersWithRoles for this user
    let sqlUsersWithRoles = "DELETE FROM UsersWithRoles WHERE userId=?;";
    let queryUsersWithRoles = mysql.format(sqlUsersWithRoles, [userId]);
    pool.query(queryUsersWithRoles, (err, result) => {
      if (err) {
        reject("Could not delete user roles: SQL ERROR ", err);
      } else {
        //remove receipts for this user
        let sqlReceipts = "DELETE FROM Receipts WHERE userId=?;";
        let queryReceipts = mysql.format(sqlReceipts, [userId]);
        pool.query(queryReceipts, (err, result) => {
          if (err) {
            reject("Could not delete user receipts: SQL ERROR ", err);
          } else {
            // remove user from Users table
            let sqlUsers = "DELETE FROM Users WHERE userId=?;";
            let queryUsers = mysql.format(sqlUsers, [userId]);
            pool.query(queryUsers, (err, result) => {
              if (err) {
                reject("Could not delete user: SQL ERROR ", err);
              } else {
                resolve(result);
              }
            });
          }
        });
      }
    });
  });
};

db.getRolesForUser = (userId) => {
  return new Promise((resolve, reject) => {
    let sql =
      "SELECT rolename FROM UsersWithRoles INNER JOIN Roles ON Roles.roleId=UsersWithRoles.roleId WHERE userId=?;";
    let query = mysql.format(sql, [userId]);
    pool.query(query, (err, result) => {
      if (err) {
        logger.debug("Could not get roles for user: SQL ERROR ", err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

db.getRoleByName = (roleName) => {
  return new Promise((resolve, reject) => {
    let sql = "SELECT * FROM Roles WHERE roleName=?;";
    let query = mysql.format(sql, [roleName]);
    pool.query(query, (err, result) => {
      if (err) {
        logger.debug("Could not get role by name: SQL ERROR ", err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

// ---> Product queries <---
db.getAllProducts = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM Products", (err, result) => {
      if (err) {
        reject("Could not get all products: SQL ERROR ", err);
      } else {
        resolve(result);
      }
    });
  });
};

db.getMultipleProducts = (productIds) => {
  return new Promise((resolve, reject) => {
    let sql = "SELECT * FROM Products WHERE productId IN (?);";
    let query = mysql.format(sql, [productIds]);
    pool.query(query, (err, result) => {
      if (err) {
        reject("Could not get multiple products: SQL ERROR ", err);
      } else {
        resolve(result);
      }
    });
  });
};

db.getRandomProducts = (amount) => {
  return new Promise((resolve, reject) => {
    let sql = "SELECT * FROM Products ORDER BY RAND() LIMIT ?;";
    let query = mysql.format(sql, [amount]);
    pool.query(query, (err, result) => {
      if (err) {
        reject("Could not get random products: SQL ERROR ", err);
      } else {
        resolve(result);
      }
    });
  });
};

db.getProductById = (productId) => {
  return new Promise((resolve, reject) => {
    let sql = "SELECT * FROM Products WHERE productId=?;";
    let query = mysql.format(sql, [productId]);
    pool.query(query, (err, result) => {
      if (err) {
        logger.debug("Could not get product: SQL ERROR ", err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

db.createProduct = (product) => {
  return new Promise((resolve, reject) => {
    console.log(product.images);
    let sql =
      "INSERT INTO Products (productId, name, price, description, images) VALUES (null, ?, ?, ?, ?);";
    let query = mysql.format(sql, [
      product.name,
      product.price,
      product.description,
      product.images,
    ]);
    pool.query(query, (err, result) => {
      if (err) {
        console.log(err);
        reject("Could not create product: SQL ERROR ", err);
      } else {
        resolve(result.insertId);
      }
    });
  });
};

db.deleteProduct = (productId) => {
  return new Promise((resolve, reject) => {
    let sql = "DELETE FROM Products WHERE productId=?;";
    let query = mysql.format(sql, [productId]);
    pool.query(query, (err, result) => {
      if (err) {
        reject("Could not delete product: SQL ERROR ", err);
      } else {
        resolve(result);
      }
    });
  });
};

db.editProduct = (product) => {
  return new Promise((resolve, reject) => {
    let sql =
      "UPDATE Products SET name=?, price=?, description=?, images=? WHERE productId=?;";
    let query = mysql.format(sql, [
      product.name,
      product.price,
      product.description,
      product.images,
      product.productId,
    ]);
    pool.query(query, (err, result) => {
      if (err) {
        reject("Could not edit product: SQL ERROR ", err);
      } else {
        resolve(result);
      }
    });
  });
};

// ---> receipt queries <---
db.createReceipt = (receipt) => {
  return new Promise((resolve, reject) => {
    console.log("Creating receipt", receipt);
    let sql =
      "INSERT INTO Receipts (receiptId, userId, products, totalPrice, createdAt) VALUES (null, ?, ?, ?, NOW());";
    let query = mysql.format(sql, [
      receipt.userId,
      [receipt.products],
      receipt.totalPrice,
    ]);
    console.log(query);
    pool.query(query, (err, result) => {
      if (err) {
        reject("Could not create receipt: SQL ERROR ", err);
      } else {
        resolve(result.insertId);
      }
    });
  });
};

db.getReceiptFromUser = (userId) => {
  return new Promise((resolve, reject) => {
    let sql = "SELECT * FROM Receipts WHERE userId=?;";
    let query = mysql.format(sql, [userId]);
    pool.query(query, (err, result) => {
      if (err) {
        logger.debug("Could not get receipt: SQL ERROR ", err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = db;
