const Car = require("../models/car");
const fs = require("fs");
const path = require("path");

// ✅ GET ALL CARS
exports.getCars = async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    res.status(200).json(cars);
  } catch (error) {
    console.error("GET CARS ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ GET SINGLE CAR
exports.getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });

    res.status(200).json(car);
  } catch (error) {
    console.error("GET CAR ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ ADD CAR
exports.addCar = async (req, res, next) => {
  try {
    // 🔥 IMPORTANT: store ONLY filename
    const images = req.files
      ? req.files.map(file => file.filename)
      : [];

    const car = await Car.create({
      ...req.body,
      images
    });

    res.status(201).json(car);

  } catch (error) {
    console.error("ADD CAR ERROR:", error);
    next(error);
  }
};

// ✅ UPDATE CAR
exports.updateCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    // update normal fields
    Object.assign(car, req.body);

    // 🔥 append new images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.filename);
      car.images = [...(car.images || []), ...newImages];
    }

    await car.save();

    res.json(car);

  } catch (error) {
    console.error("UPDATE CAR ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ DELETE CAR
exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    // 🔥 delete images from folder
    if (car.images && car.images.length > 0) {
      car.images.forEach(img => {
        const imgPath = path.join(__dirname, "..", "uploads", img);

        if (fs.existsSync(imgPath)) {
          fs.unlinkSync(imgPath);
        }
      });
    }

    await car.deleteOne();

    res.json({ message: "Car deleted successfully" });

  } catch (error) {
    console.error("DELETE CAR ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};