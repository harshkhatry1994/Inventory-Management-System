const router = require("express").Router();
const Purchase = require("../models/Purchase");
const Product = require("../models/Product");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, async (req, res) => {
  const { productId, qty, price, supplier } = req.body;

  const purchase = new Purchase({ productId, qty, price, supplier });
  await purchase.save();

  await Product.findByIdAndUpdate(productId, {
    $inc: { stock: qty }
  });

  res.json({ msg: "Purchase saved" });
});

router.get("/", auth, async (req, res) => {
  const history = await Purchase.find().populate("productId");
  res.json(history);
});

module.exports = router;