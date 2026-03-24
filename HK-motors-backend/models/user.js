const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },   // REQUIRED
  password: { type: String, required: true },
  role: { 
  type: String, 
  enum: ["admin", "employee", "customer","manager"],   // add customer
  default: "customer"
}
},
{ timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);