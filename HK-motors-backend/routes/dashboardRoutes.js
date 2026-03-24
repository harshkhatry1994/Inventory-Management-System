const express = require("express");
const router = express.Router();

router.get("/stats", async (req, res) => {
  try {
    res.json({
      totalCars: 10,
      totalSales: 5,
      totalRevenue: 5000000
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;