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

app.post('/login', async (req, res) => {
  console.log('-----login-----');
  let acccount = req.body;
  console.log(acccount.email);

  let result = await db.getUserByemail(acccount.email)
  .catch((err) => {
    console.log(err);
    res.send("Error");
  });

  console.log(result)
  if(result.length == 0){
    res.status(500).json({message: "User not found"});
    return;
  }

  const compatePassword = await bcrypt.compare(result.password, account.password);
  if(!compatePassword){
    res.status(500).json({message: "Wrong password"});
    return;
  }


  // här ska till att man hämtar alla roller och lägger dom i token
  const roles = db.getRolesForUser(result.userId);
  let userRoles = roles.map(role => { 
    return role.rolename;
  });


  const accessToken = jwt.sign(
    { userId: result.userId, email: result.email, roles: userRoles },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '8h' }
  );

  res.status(200).json({ email: result.email,  accessToken: accessToken });
});


app.listen(port, (err) => {
  if (err) {
    console.log("error listening on port 4000 ", err);
  }else {
    console.log("listening on port 4000");
  }
})
