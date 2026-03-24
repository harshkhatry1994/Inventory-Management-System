const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true
    },

    advanceAmount: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "delivered", "cancelled"],
      default: "pending"
    },

    bookingDate: {
      type: Date,
      default: Date.now
    },

    // ⭐ ADD THESE
    testDriveDate: {
      type: String
    },

    testDriveTime: {
      type: String
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);