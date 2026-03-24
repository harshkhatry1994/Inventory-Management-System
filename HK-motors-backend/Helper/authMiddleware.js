const jwt = require("jsonwebtoken");
const User = require("../models/user");

// 🔒 AUTH
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Token invalid or expired" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
};

// 🔥 ROLE CONTROL (IMPORTANT)
const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

// 🔥 EXPORT BOTH (CRITICAL)
module.exports = {
  protect,
  allowRoles
};