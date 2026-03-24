let razorpay = null;

try {
  const Razorpay = require("razorpay");

  if (process.env.RAZORPAY_KEY && process.env.RAZORPAY_SECRET) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY,
      key_secret: process.env.RAZORPAY_SECRET
    });
  }
} catch (err) {
  console.log("Razorpay disabled");
}

module.exports = razorpay;