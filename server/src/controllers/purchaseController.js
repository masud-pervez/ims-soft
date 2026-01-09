import pool from "../config/db.js";
import { logAudit } from "../services/auditService.js";

export const getPurchases = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM purchases ORDER BY purchaseDate DESC"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPurchase = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const purchase = req.body;

    await conn.query(
      "INSERT INTO purchases (id, productId, productName, quantity, purchasePrice, totalCost, supplierName, purchaseDate, createdBy) VALUES (?,?,?,?,?,?,?,?,?)",
      [
        purchase.id,
        purchase.productId,
        purchase.productName,
        purchase.quantity,
        purchase.purchasePrice,
        purchase.totalCost,
        purchase.supplierName,
        purchase.purchaseDate,
        purchase.createdBy,
      ]
    );

    await conn.query(
      "UPDATE products SET currentStock = currentStock + ? WHERE id = ?",
      [purchase.quantity, purchase.productId]
    );
    await logAudit(
      conn,
      purchase.id,
      "Purchase",
      "STOCK_IN",
      null,
      purchase,
      purchase.createdBy
    );

    await conn.commit();
    res.status(201).json({ success: true });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: err.message });
  } finally {
    conn.release();
  }
};
