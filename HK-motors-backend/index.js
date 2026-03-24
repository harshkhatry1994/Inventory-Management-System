const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// 🔥 LOAD ENV FIRST
dotenv.config();

const app = express();

// 🔥 DB
const connectDB = require("./config/db");
connectDB();

// 🔥 ROUTES IMPORT
const paymentRoutes = require("./routes/paymentRoutes");

// ✅ MIDDLEWARE
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// ✅ STATIC
app.use("/uploads", require("express").static("uploads"));

// 🔥 ROUTES
app.use("/api/payment", paymentRoutes);
app.use("/api/invoices", require("./routes/invoiceRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/cars", require("./routes/carRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/sales", require("./routes/salesRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));
app.use("/api/suppliers", require("./routes/supplierRoutes"));
app.use("/api/purchases", require("./routes/purchaseRoutes"));

// 🔥🔥🔥 ADD THIS (MAIN FIX)
app.use("/api/stock", require("./routes/stockRoutes"));

const PORT = process.env.PORT || 5000;

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("HK Motors Backend Running 🚗");
});

// ✅ START SERVER
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});