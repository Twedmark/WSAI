const express = require('express');
const cors = require('cors');
const db = require('./database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const logger = require("./logger");

const { authorization, adminAuthorization, superAdminAuthorization } = require('./middleware/authorization');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use( cors({credentials: true, origin: ['http://localhost:3000'] }) );

const port = process.env.PORT;

app.get('/', (req, res) => {
  res.send("Try /getAllUsers :)");
});

app.get('/getAllUsers', superAdminAuthorization, async (req, res) => {
  logger.debug('-----getAllUsers-----');

  const result = await db.getAllUsers()
  .catch((err) => {
    logger.error(err);
    res.send("Error");
  });

  res.status(200).json(result);
});

app.get('/getAllUsersWithRoles', superAdminAuthorization, async (req, res) => {
  logger.debug('-----getAllUsersWithRoles-----');

  const result = await db.getAllUsersWithRoles()
  .catch((err) => {
    logger.error(err);
    res.send("Error");
  });

  res.status(200).json(result);
});

//TODO: add get self by token

app.post('/getUserByemail/', superAdminAuthorization, async (req, res) => {
  logger.debug('-----getUserByemail-----');

  let email = req.body.email;

  const result = await db.getUserByemail(email)
  .catch((err) => {
    logger.err(err);
    res.status(500).json({ message: "Error getting user" });
  });

  res.status(200).send(result);
});

app.post('/createUser', async (req, res) => {
  logger.debug('-----createUser-----');

  let email = req.body.email;
  let password = req.body.password;
  let hash = await bcrypt.hash(password, 10);

  if(!email || !password) {
    res.status(500).json({ message: "Email or password missing in request" });
    return;
  }

  const userExists = await db.getUserByemail(email)
  .catch((err) => {
    logger.error(err);
    res.status(500).json({ message: "Error getting user to check if already exists" });
  });
  if(userExists.length > 0){
    res.status(500).json({ message: "User already exists" });
    return;
  }

  const resultId = await db.createUser(email, hash)
  .catch((err) => {
    logger.error(err);
    res.status(500).json({ message: "Error creating user" });
  });

  db.assignRole(resultId, 1000);

  res.status(200).json({ email: email });
});

app.get('/deleteUser/', superAdminAuthorization, async (req, res) => {
  logger.debug('-----deleteUser-----');

  let email = req.body.email;

  const result = await db.deleteUser(email)
  .catch((err) => {
    logger.error(err);
    res.status(500).json({ message: "Error deleting user" });
  });

  res.status(200).json("User deleted");
});

const addMinutes = (minutes, date = new Date()) => {   return new Date(date.setMinutes(date.getMinutes() + minutes)); };

app.post('/login', async (req, res) => {
  logger.debug('-----login-----');
  let account = req.body;

  let result = await db.getUserByemail(account.email)
  .catch((err) => {
    logger.error(err);
    res.send("Error");
  });

  if(result.length == 0){
    res.status(500).json({message: "User not found"});
    return;
  }

  const comparedPassword = await bcrypt.compare(account.password, result[0].password);
  if(!comparedPassword){
    res.status(500).json({message: "Wrong password"});
    return;
  }

  const roles = await db.getRolesForUser(result[0].userId);
  let userRoles = roles.map(role => { 
    return role.rolename;
  });

  const accessToken = jwt.sign(
    { userId: result[0].userId, email: result[0].email, roles: userRoles },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '1d' }
  );

  return res.
  cookie('token', accessToken, { httpOnly: true, secure: true, sameSite: "strict", expires: addMinutes(1440) }).
  status(200).
  json({ email: result[0].email, roles: userRoles, accessToken: accessToken });
});

app.post('/loginWithToken', authorization, async (req, res) => {
  logger.debug('-----loginWithToken-----');

  const token = req.cookies.token;

  const result = await db.getUserByToken(token)
  .catch((err) => {
    logger.error(err);
    res.send("Error");
  });

  const roles = await db.getRolesForUser(result[0].userId);
  let userRoles = roles.map(role => { 
    return role.rolename;
  });

  if (!result) {
    logger.debug("User not found");
    res.status(403).json({ message: "User not found" });
  }

  const refreshToken = jwt.sign({userId: result[0].userId, email: result[0].email, roles: userRoles }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });

  const user = {
    userId: result[0].userId,
    email: result[0].email,
    roles: userRoles,
    token: refreshToken
  }

  res.cookie('token', token, { httpOnly: true, expires: addMinutes(1440) });

  res.status(200).json(user);
});

app.get('/logout', async (req, res) => {
  logger.debug('-----logout-----');
  res.clearCookie('token').status(200).json({ message: "Logged out" });
});

app.get('/getAllProducts', async (req, res) => {
  logger.debug('-----getAllProducts-----');
  let result = await db.getAllProducts()
  .catch((err) => {
    logger.error(err);
    res.status(400).send("Error getting products");
  });
  res.status(200).json(result);
});

app.get('/getRandomProducts/:amount', async (req, res) => {
  logger.debug('-----getRandomProducts-----');
  let amount = Number(req.params.amount);
  let result = await db.getRandomProducts(amount)
  .catch((err) => {
    logger.error(err);
    res.status(400).send("Error getting products");
  });
  res.status(200).json(result);
});

app.get('/getProductById/:id', async (req, res) => {
  logger.debug('-----getProductById-----');
  let id = req.params.id;
  let result = await db.getProductById(id)
  .catch((err) => {
    logger.error(err);
    res.send("Error getting product");
  });
  res.status(200).json(result);
});


app.listen(port, (err) => {
  if (err) {
    logger.error("error listening on port 4000 ", err);
  }else {
    logger.debug("listening on port 4000");
  }
})
