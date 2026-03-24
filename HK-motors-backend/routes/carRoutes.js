const express = require("express");
const router = express.Router();

const { protect, allowRoles } = require("../Helper/authMiddleware");
const upload = require("../Middleware/upload");

const {
  addCar,
  getCars,
  getCarById,
  updateCar,
  deleteCar
} = require("../controllers/carController");

// ✅ GET ALL CARS (Public / Logged-in)
router.get("/", getCars);
router.get("/:id", getCarById);

// ✅ ADD CAR (Manager / Admin)
router.post(
  "/",
  protect,
  allowRoles("manager", "admin"),
  upload.array("images", 10), // 🔥 optimized limit
  addCar
);

// ✅ UPDATE CAR (Manager / Admin)
router.put(
  "/:id",
  protect,
  allowRoles("manager", "admin"),
  upload.array("images", 10), // 🔥 consistent
  updateCar
);

// ✅ DELETE CAR (Manager / Admin)
router.delete(
  "/:id",
  protect,
  allowRoles("manager", "admin"),
  deleteCar
);

module.exports = router;