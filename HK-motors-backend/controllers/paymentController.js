const razorpay = require("../utils/razorpay");

// CREATE ORDER
exports.createOrder = async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(200).json({
        message: "Payment system disabled",
        fake: true,
        id: "demo_order_123"
      });
    }

    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR"
    });

    res.json(order);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};