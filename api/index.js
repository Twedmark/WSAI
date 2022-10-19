const express = require('express');
const cors = require('cors');
const db = require('./database');
const bcrypt = require('bcrypt');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.get('/getUserByemail/', async (req, res) => {
  console.log('-----getUserByemail-----');

  let email = req.body.email;

  const result = await db.getUserByemail(email)
  .catch((err) => {
    console.log(err);
    res.send("Error");
  });

  res.send(result);
});

app.post('/createUser', async (req, res) => {
  console.log('-----createUser-----');

  console.log(req.body);

  let email = req.body.email;
  let password = req.body.password;
  let hash = await bcrypt.hash(password, 10);

  if(!email || !password) {
    res.send("No email or password");
    return;
  }

  const userExists = await db.getUserByemail(email)
  .catch((err) => {
    console.log(err);
    res.send("Error");
  });
  if(userExists.length > 0){
    res.send("User already exists");
    return;
  }

  const result = await db.createUser(email, hash)
  .catch((err) => {
    console.log(err);
    res.send("Error");
  });

  db.assignRole(result, 1000);

  res.send("User created");
});

app.get('/deleteUser/', async (req, res) => {
  console.log('-----deleteUser-----');

  let email = req.body.email;

  const result = await db.deleteUser(email)
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
