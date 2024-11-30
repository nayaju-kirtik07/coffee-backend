const jwt = require("jsonwebtoken");

const Refresh_Token = process.env.RefreshToken;

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res.status(401).send("token is null");
  }

  jwt.verify(token, Refresh_Token, (err, user) => {
    if (err) return res.status(401).json({ error: err, success: false });
    req.user = user;
    next();
  });
}

module.exports = { authenticateToken };
