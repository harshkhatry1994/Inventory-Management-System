const express = require("express");
const router = express.Router();

const { protect, allowRoles } = require("../Helper/authMiddleware");

const { 
  dashboardSummary, 
  monthlySalesReport, 
  bestSellingCars 
} = require("../controllers/reportController");

/**
 * DASHBOARD
 * Admin + Manager both can access
 */
router.get(
  "/dashboard",
  protect,
  allowRoles("admin", "manager"),
  dashboardSummary
);

/**
 * MONTHLY SALES
 * Admin + Manager
 */
router.get(
  "/monthly-sales",
  protect,
  allowRoles("admin", "manager"),
  monthlySalesReport
);

/**
 * BEST SELLING CARS
 * Admin + Manager
 */
router.get(
  "/best-selling",
  protect,
  allowRoles("admin", "manager"),
  bestSellingCars
);

module.exports = router;