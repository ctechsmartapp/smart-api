import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

function authenticateAccessToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  console.log("header :", authHeader);
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null)
    return res.status(401).json({ error: "Access token missing" });
  console.log("token received :", token);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.error("JWT verify error:", err);

      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
}

function authenticateRefreshToken(req, res, next) {
  const token = req.body.refreshToken;
  console.log(token);
  if (!token) return res.status(401).json({ error: "Refresh token missing" });

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.error("Refresh token error:", err);
      return res
        .status(403)
        .json({ error: "Invalid or expired refresh token" });
    }
    req.user = user;
    next();
  });
}

function generateAccessToken(user) {
  return jwt.sign(
    {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "55m" }
  );
}

function getRefreshToken(user) {
  return jwt.sign(
    {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "15d" }
  );
}

export {
  authenticateAccessToken,
  authenticateRefreshToken,
  generateAccessToken,
  getRefreshToken,
};
