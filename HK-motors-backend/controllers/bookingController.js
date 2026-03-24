const Booking = require("../models/booking");
const Car = require("../models/car");
const Invoice = require("../models/invoice");
const StockLog = require("../models/stockLog");

// ✅ CREATE BOOKING
exports.createBooking = async (req, res) => {
  try {
    const { car, advanceAmount, date, time } = req.body;

    // 🔥 GET USER FROM TOKEN (FIXED)
    const customer = req.user?._id;

    if (!customer || !car) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const foundCar = await Car.findById(car);
    if (!foundCar) {
      return res.status(404).json({ message: "Car not found" });
    }

    const newBooking = await Booking.create({
      customer,
      car,
      advanceAmount: advanceAmount || 0,
      date,
      time,
      status: "pending"
    });

    res.status(201).json(newBooking);

  } catch (error) {
    console.error("🔥 CREATE BOOKING ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET BOOKINGS
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("customer", "name phone")
      .populate("car", "modelName price images");

    res.json(bookings);

  } catch (error) {
    console.error("GET BOOKINGS ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// ✅ UPDATE BOOKING STATUS
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const validStatuses = ["pending", "confirmed", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const car = await Car.findById(booking.car);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    // 🔥 CONFIRMED → CREATE INVOICE
    if (status === "confirmed" && booking.status !== "confirmed") {
      await Invoice.create({
        invoiceNumber: "INV-" + Date.now(),
        customer: booking.customer,
        car: booking.car,
        price: car.price || car.onRoadPrice || 100000,
        advanceAmount: booking.advanceAmount || 0
      });
    }

    // 🔥 DELIVERED → REDUCE STOCK
    if (status === "delivered" && booking.status !== "delivered") {
      if (car.stock <= 0) {
        return res.status(400).json({ message: "Out of stock" });
      }

      car.stock -= 1;
      await car.save();

      await StockLog.create({
        itemType: "car",
        itemId: car._id,
        action: "OUT",
        quantity: 1,
        reason: "Car delivered",
        performedBy: req.user?._id || null
      });
    }

    // 🔥 CANCELLED → RESTORE STOCK
    if (status === "cancelled" && booking.status !== "cancelled") {
      car.stock += 1;
      await car.save();

      await StockLog.create({
        itemType: "car",
        itemId: car._id,
        action: "IN",
        quantity: 1,
        reason: "Booking cancelled",
        performedBy: req.user?._id || null
      });
    }

    booking.status = status;
    await booking.save();

    res.json({
      message: "Status updated",
      booking
    });

  } catch (error) {
    console.error("🔥 STATUS ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// ✅ CANCEL BOOKING
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled" });

  } catch (error) {
    console.error("CANCEL ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// ✅ DELETE BOOKING
exports.deleteBooking = async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking deleted" });

  } catch (error) {
    console.error("DELETE ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};