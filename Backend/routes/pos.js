import express from "express";
import Product from "../models/Product.js";
import Sale from "../models/Sale.js";
import auth from "../middleware/auth.js";
import role from "../middleware/role.js";
import mongoose from "mongoose";

const router = express.Router();

// Search product
router.get("/search", auth, async (req, res) => {
  const q = req.query.q || "";
  const regex = new RegExp(q, "i");
  const results = await Product.find({
    $or: [{ name: regex }, { sku: regex }],
  }).limit(20);
  res.json(results);
});

//product sale
router.post("/sale", auth, role(["employee", "admin"]), async (req, res) => {
  const { items } = req.body;

  if (!Array.isArray(items) || items.length === 0)
    return res.status(400).json({ message: "No items" });

  try {
    const productIds = items.map(i => i.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    const prodMap = {};
    products.forEach(p => (prodMap[p._id] = p));

    let total = 0;
    const saleItems = [];

    for (const it of items) {
      const p = prodMap[it.productId];
      if (!p) throw new Error("Product not found");

      if (p.stock < it.qty) throw new Error(`Not enough stock for ${p.name}`);

      // reduce stock
      p.stock -= it.qty;
      await p.save();

      saleItems.push({
        productId: p._id,
        name: p.name,
        qty: it.qty,
        price: p.price,
      });

      total += it.qty * p.price;
    }

    const sale = await Sale.create({
      items: saleItems,
      totalAmount: total,
      createdBy: req.user.id,
    });

    res.status(201).json({ sale });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
