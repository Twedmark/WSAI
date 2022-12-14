const jwt = require("jsonwebtoken");
const logger = require("../logger");

const authorization = (req, res, next) => {
  if (!req.cookies.token) {
    logger.debug("Unauthorized, no token");
    return res.status(401).json({ message: "Unauthorized, no token" });
  }

  const token = req.cookies.token;

  const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  if (!data) {
    logger.debug("Unauthorized, token not valid");
    res.status(403).json({ message: "Unauthorized, token not valid" });
  }

  req.email = data.email;
  req.token = data.token;
  req.roles = data.roles;

  next();
};

const adminAuthorization = (req, res, next) => {
  if (!req.cookies.token) {
    logger.debug("Unauthorized, no token");
    return res.status(401).json({ message: "Unauthorized, no token" });
  }

  const token = req.cookies.token;

  const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  if (!data) {
    logger.debug("Unauthorized, token not valid");
    res.status(403).json({ message: "Unauthorized, token not valid" });
  }

  if (!data.roles.includes("Admin")) {
    logger.debug("Unauthorized, not admin");
    res.status(403).json({ message: "Unauthorized, not admin" });
  }

  req.email = data.email;
  req.token = data.token;
  req.roles = data.roles;

  next();
};

const superAdminAuthorization = (req, res, next) => {
  if (!req.cookies.token) {
    logger.debug("Unauthorized, no token");
    return res.status(401).json({ message: "Unauthorized, no token" });
  }

  const token = req.cookies.token;

  const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  if (!data) {
    logger.debug("Unauthorized, token not valid");
    return res.status(403).json({ message: "Unauthorized, token not valid" });
  }

  if (!data.roles.includes("SuperAdmin")) {
    logger.debug("Unauthorized, not super admin");
    return res
      .status(403)
      .json({ message: "Unauthorized not high enough clearence level" });
  }

  req.email = data.email;
  req.token = data.token;
  req.roles = data.roles;

  next();
};

module.exports = {
  authorization,
  adminAuthorization,
  superAdminAuthorization,
};
