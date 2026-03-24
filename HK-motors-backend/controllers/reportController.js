const Sale = require("../models/sale.js");
const Car = require("../models/car.js");
const User = require("../models/user.js"); // Added to fulfill dashboard stats

// DASHBOARD SUMMARY
exports.dashboardSummary = async (req, res) => {
  try {
    const totalCars = await Car.countDocuments();
    const outOfStock = await Car.countDocuments({ stock: 0 });

    // Inventory total value
    const cars = await Car.find();
    const totalValue = cars.reduce(
      (sum, car) => sum + (car.onRoadPrice || 0) * (car.stock || 0),
      0
    );

    // Recent cars (for dashboard table)
    const recentCars = await Car.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("modelName variant stock exShowroomPrice onRoadPrice");

    res.json({
      totalCars,
      outOfStock,
      totalValue,
      recentCars,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// MONTHLY SALES REPORT
exports.monthlySalesReport = async (req, res) => {
  try {
    const report = await Sale.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$saleDate" },
            month: { $month: "$saleDate" }
          },
          totalSales: { $sum: 1 },
          totalRevenue: { $sum: "$salePrice" }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } }
    ]);

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// BEST SELLING CARS
exports.bestSellingCars = async (req, res) => {
  try {
    const report = await Sale.aggregate([
      { $group: { _id: "$car", soldCount: { $sum: 1 } } },
      { $sort: { soldCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "cars", // Join with Car collection to get names
          localField: "_id",
          foreignField: "_id",
          as: "carDetails"
        }
      },
      { $unwind: "$carDetails" }
    ]);

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};