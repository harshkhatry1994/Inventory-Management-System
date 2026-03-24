const express = require("express");
const router = express.Router();

const { protect, allowRoles } = require("../Helper/authMiddleware");

// 🔥 IMPORTANT: destructure the controller
const {
  createBooking,
  getBookings,
  deleteBooking,
  cancelBooking,
  updateBookingStatus
} = require("../controllers/bookingController");

// ✅ CREATE
router.post("/", protect, allowRoles("customer"), createBooking);

// ✅ GET
router.get("/", getBookings);

// ✅ UPDATE STATUS (🔥 FINAL FIX)
router.put(
  "/:id/status",
  protect,
  allowRoles("employee", "manager", "admin"),
  updateBookingStatus
);

// ✅ DELETE
router.delete(
  "/:id",
  protect,
  allowRoles("manager", "admin"),
  deleteBooking
);

// ✅ CANCEL
router.put("/:id/cancel", protect, cancelBooking);

module.exports = router;