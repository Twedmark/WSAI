const express = require("express");
const cors = require("cors");
const db = require("./database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const { check, validationResult } = require("express-validator");

const logger = require("./logger");

const rateLimit = require("express-rate-limit");

const {
  authorization,
  adminAuthorization,
  superAdminAuthorization,
} = require("./middleware/authorization");
const { getUserByEmail } = require("./database");

const loginValidate = [
  check("email", "Email is not valid")
    .isEmail()
    .trim()
    .escape()
    .normalizeEmail(),
  check("password", "Password must be at least 8 characters long")
    .isLength({
      min: 8,
    })
    .matches("[0-9]")
    .withMessage("Password Must Contain a Number")
    .matches("[A-Z]")
    .withMessage("Password Must Contain an Uppercase Letter")
    .trim()
    .escape(),
];

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ credentials: true, origin: ["http://localhost:3000"] }));
app.set("trust proxy", true);

const port = process.env.PORT;

const accountLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 create/login account requests per `window` (here, per 15 minutes)
  message:
    "Too many accounts created from this IP, please try again after 15 minutes",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const logIp = (req, res, next) => {
  logger.debug(`Request from ${req.ip}`);
  next();
};

app.get("/", (req, res) => {
  res.send("Try /getAllProducts :)");
});

// ---------------- User routes ----------------
app.get("/getAllUsers", superAdminAuthorization, async (req, res) => {
  logger.debug("-----getAllUsers-----");

  const result = await db.getAllUsers().catch((err) => {
    logger.error(err);
    res.send("Error");
  });

  res.status(200).json(result);
});

app.get("/getAllUsersWithRoles", superAdminAuthorization, async (req, res) => {
  logger.debug("-----getAllUsersWithRoles-----");

  const result = await db.getAllUsersWithRoles().catch((err) => {
    logger.error(err);
    res.send("Error");
  });

  res.status(200).json(result);
});

app.post("/createUser", loginValidate, accountLimiter, async (req, res) => {
  logger.debug("-----createUser-----");

  let email = req.body.email;
  let password = req.body.password;
  let hash = await bcrypt.hash(password, 10);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    const userExists = await db.getUserByEmail(email).catch((err) => {
      logger.error(err);
      res
        .status(500)
        .json({ message: "Error getting user to check if already exists" });
    });
    if (userExists.length > 0) {
      res.status(500).json({ message: "Error creating user" });
      return;
    }

    const resultId = await db.createUser(email, hash).catch((err) => {
      logger.error(err);
      res.status(500).json({ message: "Error creating user" });
    });

    db.assignRole(resultId, 1000);

    res.status(200).json({ email: email });
  }
});

app.post("/deleteUser", superAdminAuthorization, async (req, res) => {
  logger.debug("-----deleteUser-----");

  let userId = req.body.userId;

  const infoOfUser = await db.getUserById(userId);

  const result = await db.deleteUser(userId).catch((err) => {
    logger.error(err);
    res.status(500).json({ message: "Error deleting user" });
    return;
  });

  console.log(infoOfUser);
  logger.debug(
    `${req.email} deleted user '${infoOfUser[0].email}' with id '${userId}'`
  );

  const newUsers = await db.getAllUsersWithRoles();

  res.status(200).json(newUsers);
});

app.post("/addRole", superAdminAuthorization, async (req, res) => {
  logger.debug("-----addRole-----");

  let userId = req.body.userId;
  let roleName = req.body.role;

  const role = await db.getRoleByName(roleName);

  const result = await db.assignRole(userId, role[0].roleId).catch((err) => {
    logger.error(err);
    res.status(500).json({ message: "Error adding role" });
    return;
  });

  const infoOfUser = await db.getUserById(userId);
  logger.debug(
    `${req.email} added role '${roleName}' to user '${infoOfUser[0].email}' with id '${userId}'`
  );

  const newUsers = await db.getAllUsersWithRoles();

  res.status(200).json(newUsers);
});

app.post("/removeRole", superAdminAuthorization, async (req, res) => {
  logger.debug("-----removeRole-----");

  let userId = req.body.userId;
  let roleName = req.body.role;

  const role = await db.getRoleByName(roleName);

  const result = await db.removeRole(userId, role[0].roleId).catch((err) => {
    logger.error(err);
    res.status(500).json({ message: "Error removing role" });
    return;
  });

  const infoOfUser = await db.getUserById(userId);
  logger.debug(
    `${req.email} removed role '${roleName}' from user '${infoOfUser[0].email}' with id '${userId}'`
  );

  const newUsers = await db.getAllUsersWithRoles();

  res.status(200).json(newUsers);
});

const addMinutes = (minutes, date = new Date()) => {
  return new Date(date.setMinutes(date.getMinutes() + minutes));
};

app.post("/login", loginValidate, accountLimiter, logIp, async (req, res) => {
  logger.debug("-----login-----");
  let account = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    let result = await db.getUserByEmail(account.email).catch((err) => {
      logger.error(err);
      res.send("Error");
    });

    if (result.length == 0) {
      res.status(500).json({ message: "Wrong Email/Password" });
      return;
    }

    const comparedPassword = await bcrypt.compare(
      account.password,
      result[0].password
    );
    if (!comparedPassword) {
      logger.debug("Wrong password, ip: " + req.ip);
      res.status(500).json({ message: "Wrong Email/Password" });
      return;
    }

    const roles = await db.getRolesForUser(result[0].userId);
    let userRoles = roles.map((role) => {
      return role.rolename;
    });

    const accessToken = jwt.sign(
      { userId: result[0].userId, email: result[0].email, roles: userRoles },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    return res
      .cookie("token", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        expires: addMinutes(1440),
      })
      .status(200)
      .json({
        userId: result[0].userId,
        email: result[0].email,
        roles: userRoles,
        accessToken: accessToken,
      });
  }
});

app.post("/loginWithToken", authorization, async (req, res) => {
  logger.debug("-----loginWithToken-----");

  const token = req.cookies.token;

  const result = await db.getUserByToken(token).catch((err) => {
    logger.error(err);
    res.send("Error");
  });

  if (result.length == 0) {
    res.status(500).clearCookie("token").json({ message: "User not found" });
    return;
  }

  const roles = await db.getRolesForUser(result[0].userId);
  let userRoles = roles.map((role) => {
    return role.rolename;
  });

  if (!result) {
    logger.debug("User not found");
    res.status(403).json({ message: "User not found" });
  }

  const refreshToken = jwt.sign(
    { userId: result[0].userId, email: result[0].email, roles: userRoles },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  const user = {
    userId: result[0].userId,
    email: result[0].email,
    roles: userRoles,
    token: refreshToken,
  };

  res.cookie("token", token, { httpOnly: true, expires: addMinutes(1440) });

  res.status(200).json(user);
});

app.get("/logout", async (req, res) => {
  logger.debug("-----logout-----");
  res.clearCookie("token").status(200).json({ message: "Logged out" });
});

// ---------------- Product routes ----------------
/* app.get('/getAllProducts', apiLimiter, async (req, res) => {
  logger.debug('-----getAllProducts-----');

  let result = await db.getAllProducts()
  .catch((err) => {
    logger.error(err);
    res.status(400).send("Error getting products");
  });

  res.status(200).json(result);
}); */

app.get("/getRandomProducts/:amount", apiLimiter, async (req, res) => {
  logger.debug("-----getRandomProducts-----");

  let amount = Number(req.params.amount);
  let result = await db.getRandomProducts(amount).catch((err) => {
    logger.error(err);
    res.status(400).send("Error getting products");
  });

  res.status(200).json(result);
});

app.get("/getProductById/:id", apiLimiter, async (req, res) => {
  logger.debug("-----getProductById-----");

  let id = req.params.id;
  let result = await db.getProductById(id).catch((err) => {
    logger.error(err);
    res.send("Error getting product");
  });

  res.status(200).json(result);
});

app.post("/getMultipleProducts", apiLimiter, async (req, res) => {
  logger.debug("-----getMultipleProducts-----");

  let arrayOfProductIds = req.body;

  let result = await db.getMultipleProducts(arrayOfProductIds).catch((err) => {
    logger.error(err);
    res.status(400).json("Error getting receipts");
  });
  res.status(200).json(result);
});

app.post("/addProduct", adminAuthorization, async (req, res) => {
  logger.debug("-----addProduct-----");

  let product = req.body;

  let result = await db.createProduct(product).catch((err) => {
    logger.error(err);
    res.status(400).json("Error adding product");
    return;
  });
  logger.debug(
    `${req.email} added product '${product.name}' with id '${result}'`
  );

  res.status(200).json({ message: "Product added", id: result });
});

app.delete("/deleteProduct/:id", adminAuthorization, async (req, res) => {
  logger.debug("-----deleteProduct-----");

  let id = req.params.id;

  let result = await db.deleteProduct(id).catch((err) => {
    logger.error(err);
    res.status(400).json("Error deleting product");
    return;
  });

  logger.debug(`${req.email} deleted product with id '${id}'`);

  res.status(200).json({ message: "Product deleted" });
});

app.put("/editProduct/:id", adminAuthorization, async (req, res) => {
  logger.debug("-----editProduct-----");

  let id = req.params.id;
  let product = req.body;

  let result = await db.editProduct(product).catch((err) => {
    logger.error(err);
    res.status(400).json("Error editing product");
    return;
  });

  logger.debug(`${req.email} edited product with id '${id}'`);

  res.status(200).json({ message: "Product edited" });
});

// ---------------- Receipt routes ----------------
app.get("/getReceiptFromUser", authorization, async (req, res) => {
  logger.debug("-----getReceiptFromUser-----");

  let userEmail = req.email;
  let user = await getUserByEmail(userEmail).catch((err) => {
    logger.error(err);
    res.send("Error getting email while getting receipt");
  });

  let result = await db.getReceiptFromUser(user[0].userId).catch((err) => {
    logger.error(err);
    res.send("Error getting receipt");
  });

  res.status(200).json(result);
});

app.post("/addReceipt", authorization, async (req, res) => {
  logger.debug("-----addReceipt-----");
  let receipt = req.body;
  const token = req.cookies.token;

  const userId = await db.getUserByToken(token).catch((err) => {
    logger.error(err);
    res.status(400).json("Error");
  });
  receipt.userId = userId[0].userId;

  receipt.products = JSON.stringify(receipt.products);

  let result = await db.createReceipt(receipt).catch((err) => {
    logger.error(err);
    res.status(400).json("Error adding receipt");
    return;
  });

  res.status(200).json({ message: "Receipt added", id: result });
});

app.listen(port, (err) => {
  if (err) {
    logger.error("error listening on port 4000 ", err);
  } else {
    logger.debug("listening on port 4000");
  }
});
