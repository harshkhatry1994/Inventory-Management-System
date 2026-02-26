const router = require("express").Router();
const Product = require("../models/Product");
const auth = require("../middleware/authMiddleware");

let sales = [];

router.post("/", auth, async (req, res) => {
  const { productId, qty, price, customer } = req.body;

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ msg: "Product not found" });

  if (product.stock < qty)
    return res.status(400).json({ msg: "Not enough stock" });

  // reduce stock
  product.stock -= qty;
  await product.save();

  const total = qty * price;

  const sale = {
    customer,
    product: product.name,
    qty,
    price,
    total,
    date: new Date()
  };

  sales.push(sale);

  res.json({ msg: "Sale successful", sale });
});

module.exports = router;