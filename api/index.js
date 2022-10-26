const express = require('express');
const cors = require('cors');
const db = require('./database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const { authorization, adminAuthorization, superAdminAuthorization } = require('./middleware/authorization');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

const port = process.env.PORT;

app.get('/', (req, res) => {
  res.send("Try /getAllUsers :)");
});

app.get('/getAllUsers', superAdminAuthorization, async (req, res) => {
  console.log('-----getAllUsers-----');

  const result = await db.getAllUsers()
  .catch((err) => {
    console.log(err);
    res.send("Error");
  });

  res.status(200).json(result);
});

//TODO: add get self by token

app.post('/getUserByemail/', superAdminAuthorization, async (req, res) => {
  console.log('-----getUserByemail-----');

  let email = req.body.email;

  const result = await db.getUserByemail(email)
  .catch((err) => {
    console.log(err);
    res.status(500).json({ message: "Error getting user" });
  });

  res.status(200).send(result);
});

app.post('/createUser', async (req, res) => {
  console.log('-----createUser-----');

  let email = req.body.email;
  let password = req.body.password;
  let hash = await bcrypt.hash(password, 10);

  if(!email || !password) {
    res.status(500).json({ message: "Email or password missing in request" });
    return;
  }

  const userExists = await db.getUserByemail(email)
  .catch((err) => {
    console.log(err);
    res.status(500).json({ message: "Error getting user to check if already exists" });
  });
  if(userExists.length > 0){
    res.status(500).json({ message: "User already exists" });
    return;
  }

  const resultId = await db.createUser(email, hash)
  .catch((err) => {
    console.log(err);
    res.status(500).json({ message: "Error creating user" });
  });

  db.assignRole(resultId, 1000);

  res.status(200).json({ email: email });
});

app.get('/deleteUser/', superAdminAuthorization, async (req, res) => {
  console.log('-----deleteUser-----');

  let email = req.body.email;

  const result = await db.deleteUser(email)
  .catch((err) => {
    console.log(err);
    res.status(500).json({ message: "Error deleting user" });
  });

  res.status(200).json("User deleted");
});

app.post('/login', async (req, res) => {
  console.log('-----login-----');
  let account = req.body;

  let result = await db.getUserByemail(account.email)
  .catch((err) => {
    console.log(err);
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
    { userId: result[0].userId, email: result.email, roles: userRoles },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '8h' }
  );

  res.status(200).cookie('token', accessToken, { httpOnly: true }).
  json({ email: result[0].email, roles: userRoles, accessToken: accessToken });
});


app.get('/getAllProducts', async (req, res) => {
  console.log('-----getAllProducts-----');
  let result = await db.getAllProducts()
  .catch((err) => {
    console.log(err);
    res.send("Error getting products");
  });
  res.status(200).json(result);
});

app.get('/getProductById/:id', async (req, res) => {
  console.log('-----getProductById-----');
  let id = req.params.id;
  let result = await db.getProductById(id)
  .catch((err) => {
    console.log(err);
    res.send("Error getting product");
  });
  res.status(200).json(result);
});



app.listen(port, (err) => {
  if (err) {
    console.log("error listening on port 4000 ", err);
  }else {
    console.log("listening on port 4000");
  }
})
