const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async function (req, res, next) {
  try {
    const token =
      req.headers.authorization?.split(" ")[1] || req.cookies?.token;
    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-passwordHash");
    if (!req.user) return res.status(401).json({ message: "User not found" });

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Unauthorized" });
  }
};
