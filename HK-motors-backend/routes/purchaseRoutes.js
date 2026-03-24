const express = require("express");
const router = express.Router();

const { protect, allowRoles } = require("../Helper/authMiddleware");

const {
  createPurchase,
  receivePurchase,
  getPurchases
} = require("../controllers/purchaseController");

// CREATE PURCHASE
router.post("/", protect, allowRoles("manager"), createPurchase);

// GET PURCHASES
router.get("/", protect, allowRoles("manager"), getPurchases);

// RECEIVE STOCK
router.put("/:id/receive", protect, allowRoles("manager"), receivePurchase);

module.exports = router;