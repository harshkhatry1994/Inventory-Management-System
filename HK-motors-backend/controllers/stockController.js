const Car = require("../models/car.js");
const StockLog = require("../models/stockLog.js");

// ✅ STOCK IN
const stockIn = async (req, res) => {
  try {
    const { carId, quantity, reason } = req.body;

    if (!carId || !quantity) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    const qty = Number(quantity);

    car.stock = (car.stock || 0) + qty;
    car.status = "available";
    await car.save();

    await StockLog.create({
      itemType: "car",
      itemId: carId,
      action: "IN",
      quantity: qty,
      reason,
      performedBy: req.user ? req.user._id : null
    });

    res.json({ message: "Stock added successfully", car });

  } catch (error) {
    console.error("STOCK IN ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ STOCK OUT
const stockOut = async (req, res) => {
  try {
    const { carId, quantity, reason } = req.body;

    if (!carId || !quantity) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    const qty = Number(quantity);

    if (car.stock < qty) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    car.stock -= qty;

    if (car.stock === 0) {
      car.status = "out_of_stock";
    }

    await car.save();

    await StockLog.create({
      itemType: "car",
      itemId: carId,
      action: "OUT",
      quantity: qty,
      reason,
      performedBy: req.user ? req.user._id : null
    });

    res.json({ message: "Stock reduced successfully", car });

  } catch (error) {
    console.error("STOCK OUT ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ STOCK HISTORY
const stockHistory = async (req, res) => {
  try {
    const logs = await StockLog.find()
      .populate({
        path: "itemId",
        model: "Car",
        select: "name model modelName"
      })
      .populate("performedBy", "name role")
      .sort({ createdAt: -1 });

    res.json(logs || []);

  } catch (error) {
    console.error("STOCK HISTORY ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  stockIn,
  stockOut,
  stockHistory
};