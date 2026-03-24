const mongoose = require("mongoose");

// ✅ DEFINE SCHEMA FIRST
const invoiceSchema = new mongoose.Schema({

  invoiceNumber: {
    type: String,
    required: true
  },

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

  price: {
    type: Number,
    required: true
  },

  gst: Number,
  totalAmount: Number,

  advanceAmount: {
    type: Number,
    default: 0
  },

  remainingAmount: {
    type: Number,
    default: 0
  },

  chassisNumber: String,
  engineNumber: String,

  paymentMethod: {
    type: String,
    default: "Bank Transfer"
  },

  rtoCharges: {
    type: Number,
    default: 0
  },

  deliveryDate: Date

}, { timestamps: true });

// ✅ SAFE EXPORT (NO OVERWRITE ERROR)
module.exports =
  mongoose.models.Invoice ||
  mongoose.model("Invoice", invoiceSchema);