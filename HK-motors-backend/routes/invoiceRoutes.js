const express = require("express");
const router = express.Router();

const { createInvoice, getInvoices } = require("../controllers/invoiceController");
const { protect, allowRoles } = require("../Helper/authMiddleware");

// ✅ FIXED ROUTES
router.post("/", protect,createInvoice);
router.get("/", protect, getInvoices);

module.exports = router;