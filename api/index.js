const express = require('express');
const cors = require('cors');
const db = require('./database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT;

app.get('/', (req, res) => {
  res.send("Try /getAllUsers :)");
});

app.get('/getAllUsers', async (req, res) => {
  console.log('-----getAllUsers-----');

  const result = await db.getAllUsers()
  .catch((err) => {
    console.log(err);
    res.send("Error");
  });

  res.send(result);
});

app.get('/getUserByemail/', async (req, res) => {
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

  console.log(req.body);

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

app.get('/deleteUser/', async (req, res) => {
  console.log('-----deleteUser-----');

  let email = req.body.email;

  const result = await db.deleteUser(email)
  .catch((err) => {
    console.log(err);
    res.status(500).json({ message: "Error deleting user" });
  });

  res.status(200).json("User deleted");
});

app.listen(port, (err) => {
  if (err) {
    console.log("error listening on port 4000 ", err);
  }else {
    console.log("listening on port 4000");
  }
})
