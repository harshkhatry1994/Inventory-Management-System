const express = require("express");
const router = express.Router();

const { protect, allowRoles } = require("../Helper/authMiddleware");

const {
  createManager,
  createEmployee,
  getAllUsers,
  deleteUser   // 👈 add this
} = require("../controllers/userController");

// ADMIN → MANAGER
router.post(
  "/create-manager",
  protect,
  allowRoles("admin"),
  createManager
);

// ADMIN + MANAGER → EMPLOYEE
router.post(
  "/create-employee",
  protect,
  allowRoles("admin", "manager"),
  createEmployee
);

//get all users (admin + manager)
router.get(
  "/", 
  protect, 
  allowRoles("admin", "manager","employee"), 
  getAllUsers
);
// DELETE USER 👇
router.delete(
  "/:id",
  protect,
  allowRoles("admin"),
  deleteUser
);

module.exports = router;