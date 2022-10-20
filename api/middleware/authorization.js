const jwt = require('jsonwebtoken');

const authorization = (req, res, next) => {
  if (!req.cookies.token) return res.status(401).json({message: "Unauthorized"});
  
  const token = req.cookies.token;

  const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

  if (!data) {
    res.status(403).json({ message: "Unauthorized" });
  }

  req.email = data.email;
  req.token = data.token;
  req.roles = data.roles;

  next();
}

const adminAuthorization = (req, res, next) => {
  if (!req.cookies.token) return res.status(401).json({message: "Unauthorized"});
  
  const token = req.cookies.token;

  const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

  if (!data) {
    res.status(403).json({ message: "Unauthorized" });
  }

  if (!data.roles.includes("Admin")) {
    res.status(403).json({ message: "Unauthorized" });
  }

  req.email = data.email;
  req.token = data.token;
  req.roles = data.roles;

  next();
}

const superAdminAuthorization = (req, res, next) => {
  if (!req.cookies.token) return res.status(401).json({message: "Unauthorized no token"});
  
  const token = req.cookies.token;

  const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

  if (!data) {
    res.status(403).json({ message: "Unauthorized token" });
    return;
  }

  if (!data.roles.includes("SuperAdmin")) {
    res.status(403).json({ message: "Unauthorized not high enough clearence level" });
    return;
  }

  req.email = data.email;
  req.token = data.token;
  req.roles = data.roles;

  next();
}

module.exports = {
  authorization,
  adminAuthorization,
  superAdminAuthorization
}