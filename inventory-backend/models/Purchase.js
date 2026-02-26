const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
  productId: mongoose.Schema.Types.ObjectId,
  qty: Number,
  price: Number,
  supplier: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Purchase", purchaseSchema);