const express = require('express');
const cors = require('cors');
const db = require('./database');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT;

app.get('/', (req, res) => {
  res.send("Try /getAllUsers or /createUser");
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

app.get('/getUserByUsername/:username', async (req, res) => {
  console.log('-----getUserByUsername-----');

  let username = req.params.username;

  const result = await db.getUserByUsername(username)
  .catch((err) => {
    console.log(err);
    res.send("Error");
  });

  res.send(result);
});

app.post('/createUser', async (req, res) => {
  console.log('-----createUser-----');

  console.log(req.body);

  let username = req.body.username;
  let password = req.body.password;

  hash = await bcrypt.hash(password, 10);

  const result = await db.createUser(username, hash)
  .catch((err) => {
    console.log(err);
    res.send("Error");
  });

  res.send("User created");
});

app.get('/deleteUser/:username', async (req, res) => {
  console.log('-----deleteUser-----');

  let username = req.params.username;

  const result = await db.deleteUser(username)
  .catch((err) => {
    console.log(err);
    res.send("Error");
  });

  res.send("User deleted");
});

app.listen(port, (err) => {
  if (err) {
    console.log("error listening on port 4000 ", err);
  }else {
    console.log("listening on port 4000");
  }
})
