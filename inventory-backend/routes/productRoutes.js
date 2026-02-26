const router = require("express").Router();
const Product = require("../models/Product");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.json(product);
});

router.get("/", auth, async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

router.put("/:id", auth, async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete("/:id", auth, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
});

module.exports = router;