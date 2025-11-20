import express from "express";
import Sale from "../models/Sale.js";
import auth from "../middleware/auth.js";
import role from "../middleware/role.js";

const router = express.Router();

// List sales
router.get("/", auth, role("admin"), async (req, res) => {
  const sales = await Sale.find().sort({ createdAt: -1 }).limit(200);
  res.json(sales);
});

export default router;
