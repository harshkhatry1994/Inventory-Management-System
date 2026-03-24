const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  modelName: {
    type: String,
    required: true
  },

  variant: String,
  fuelType: String,
  color: String,

  // ✅ MAIN PRICE FIELD
  price: {
    type: Number,
    default: 0
  },

  exShowroomPrice: Number,
  onRoadPrice: Number,

  stock: {
    type: Number,
    default: 0
  },

  // ✅ IMAGE STORAGE (VERY IMPORTANT)
  images: {
    type: [String],
    default: []
  },

  // OPTIONAL MULTI-COLOR SUPPORT
  colorImages: {
    type: Map,
    of: [String],
    default: {}
  },

  mileage: String,
  engine: String,
  transmission: String,
  seating: String,
  power: String,
  torque: String

}, { timestamps: true });

module.exports = mongoose.models.Car || mongoose.model("Car", carSchema);