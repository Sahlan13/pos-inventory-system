import dotenv from "dotenv";

dotenv.config({ path: "./.env" });
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import posRoutes from "./routes/pos.js";
import salesRoutes from "./routes/sales.js";

const app = express();
app.use(cors());
app.use(express.json());

connectDB(process.env.MONGO_URI);

app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/pos", posRoutes);
app.use("/sales", salesRoutes);

app.get("/", (req, res) => res.send("Mini POS API"));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
