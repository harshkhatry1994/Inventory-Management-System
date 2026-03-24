const express = require("express");
const router = express.Router();

const stockController = require("../controllers/stockController");

// ✅ SAFE IMPORT (NO DESTRUCTURING BUG)
router.post("/in", stockController.stockIn);
router.post("/out", stockController.stockOut);
router.get("/history", stockController.stockHistory);

module.exports = router;