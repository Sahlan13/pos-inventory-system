import express from "express";
import Product from "../models/Product.js";
import auth from "../middleware/auth.js";
import role from "../middleware/role.js";

const router = express.Router();

// Create product
router.post("/", auth, role("admin"), async (req, res) => {
  const { name, sku, price, stock } = req.body;
  if (!name || !sku || price == null || stock == null)
    return res.status(400).json({ message: "Missing fields" });
  try {
    const product = await Product.create({ name, sku, price, stock });
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Edit product
router.put("/:id", auth, role("admin"), async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete product
router.delete("/:id", auth, role("admin"), async (req, res) => {
  const removed = await Product.findByIdAndDelete(req.params.id);
  if (!removed) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Deleted" });
});

// List products
router.get("/", auth, role("admin"), async (req, res) => {
  const products = await Product.find().sort({ name: 1 });
  res.json(products);
});
export default router;
