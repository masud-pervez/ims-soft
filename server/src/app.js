import express from "express";
import cors from "cors";
import { config } from "./config/env.js";

import purchaseRoutes from "./routes/purchaseRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import auditRoutes from "./routes/auditRoutes.js";
import backupRoutes from "./routes/backupRoutes.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));

// Health Check
app.get("/api/health", (req, res) => res.json({ status: "up" }));

// Routes
app.use("/api/purchases", purchaseRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/audit-logs", auditRoutes);
app.use("/api/backup", backupRoutes);

export default app;
