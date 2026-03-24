const jwt = require("jsonwebtoken");
const User = require("../models/user");

// 🔐 PROTECT MIDDLEWARE
const protect = async (req, res, next) => {
  let token;

  console.log("AUTH HEADER:", req.headers.authorization); // ✅ DEBUG

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // ✅ VERIFY TOKEN
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ✅ GET USER
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      return next();
    } catch (error) {
      console.log("TOKEN ERROR:", error.message); // ✅ DEBUG
      return res.status(401).json({ message: "Not authorized" });
    }
  }

  return res.status(401).json({ message: "No token provided" });
};

// 🔥 ROLE MIDDLEWARE
const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

module.exports = { protect, allowRoles };