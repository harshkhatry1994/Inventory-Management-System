const express = require("express");
const router = express.Router();

const { protect, allowRoles } = require("../Helper/authMiddleware");

const {
  addSupplier,
  getSuppliers
} = require("../controllers/supplierController");

router.post("/", protect, allowRoles("manager"), addSupplier);
router.get("/", protect, allowRoles("manager"), getSuppliers);

module.exports = router;
