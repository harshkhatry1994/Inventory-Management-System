const Invoice = require("../models/invoice");
const sendInvoiceEmail = require("../utils/sendEmail");

// CREATE INVOICE
const createInvoice = async (req, res) => {
  try {
    const { customer, car, price, advanceAmount } = req.body;

    if (req.user && req.user.role === "customer") {
      return res.status(403).json({ message: "Customers cannot create invoices" });
    }

    const count = await Invoice.countDocuments();
    const invoiceNumber = `HK-INV-${String(count + 1).padStart(4, "0")}`;

    const gst = price * 0.18;
    const totalAmount = price + gst;
    const remainingAmount = totalAmount - (advanceAmount || 0);

    const invoice = await Invoice.create({
      invoiceNumber,
      customer,
      car,
      price,
      gst,
      totalAmount,
      advanceAmount,
      remainingAmount
    });

    // ✅ SAFE POPULATE
    await invoice.populate([
      { path: "customer", select: "name email" },
      { path: "car", select: "modelName name" }
    ]);

    // ✅ SAFE EMAIL
    if (invoice.customer?.email) {
      await sendInvoiceEmail(
        invoice.customer.email,
        `<h2>Your Invoice</h2><p>Invoice No: ${invoiceNumber}</p>`
      );
    }

    res.status(201).json(invoice);

  } catch (error) {
    console.error("Create Invoice Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET INVOICES
const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate({ path: "customer", select: "name" })
      .populate({ path: "car", select: "modelName name" })
      .sort({ createdAt: -1 });

    console.log("INVOICES:", invoices); // 🔥 DEBUG

    res.json(invoices || []);
  } catch (error) {
    console.error("GET INVOICES ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createInvoice,
  getInvoices
};