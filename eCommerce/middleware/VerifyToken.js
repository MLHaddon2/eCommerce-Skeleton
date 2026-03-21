 import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  // Try Authorization header first (set by axios after login in the same session),
  // then fall back to the httpOnly access_token cookie (used on page reload).
  const authHeader = req.headers['authorization'];
  const token = (authHeader && authHeader.split(' ')[1]) || req.cookies?.access_token;

  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token" });
    req.userID = decoded.userID;
    req.username = decoded.username;
    req.email = decoded.email;
    next();
  });
};