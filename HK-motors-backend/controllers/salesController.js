const Sale = require("../models/sale.js");
const Booking = require("../models/booking.js");
const Car = require("../models/car.js");
const StockLog = require("../models/stockLog.js");

// CREATE SALE
exports.createSale = async (req, res) => {
  try {
    const { bookingId, paymentMode, invoiceNumber } = req.body;

    const booking = await Booking.findById(bookingId)
      .populate("car")
      .populate("customer");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status !== "delivered") {
      return res.status(400).json({
        message: "Sale allowed only after delivery"
      });
    }

    const existingSale = await Sale.findOne({ booking: bookingId });
    if (existingSale) {
      return res.status(400).json({ message: "Sale already created" });
    }

    const car = await Car.findById(booking.car._id);

    if (!car || car.stock <= 0) {
      return res.status(400).json({ message: "Car out of stock" });
    }

    const sale = await Sale.create({
      booking: bookingId,
      customer: booking.customer._id,
      car: booking.car._id,
      salePrice: booking.car.onRoadPrice,
      paymentMode,
      invoiceNumber,
      saleDate: new Date() // 🔥 FIX (IMPORTANT)
    });

    // Reduce Stock
    car.stock -= 1;
    if (car.stock <= 0) {
      car.status = "out_of_stock";
    }
    await car.save();

    // Stock Log
    await StockLog.create({
      itemType: "car",
      itemId: car._id,
      action: "OUT",
      quantity: 1,
      reason: "Car sold",
      performedBy: req.user ? req.user._id : null
    });

    res.status(201).json({
      message: "Sale recorded successfully",
      sale
    });

  } catch (error) {
    console.error("CREATE SALE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// GET SALES
exports.getSales = async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate("customer", "name phone")
      .populate("car", "modelName variant")
      .sort({ createdAt: -1 }); // 🔥 FIX

    console.log("SALES:", sales); // 🔥 DEBUG

    res.json(sales || []);
  } catch (error) {
    console.error("GET SALES ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// SALES HISTORY
exports.salesHistory = async (req, res) => {
  try {
    const history = await Sale.find()
      .populate("customer", "name phone email")
      .populate("car", "modelName variant fuelType color onRoadPrice")
      .sort({ createdAt: -1 }); // 🔥 FIX

    res.json(history || []);
  } catch (error) {
    console.error("SALES HISTORY ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};