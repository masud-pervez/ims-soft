import pool from "../config/db.js";
import { logAudit } from "../services/auditService.js";

export const getProducts = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM products ORDER BY name ASC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const product = req.body;
    await conn.query(
      "INSERT INTO products (id, name, categoryId, costPrice, sellingPrice, openingStock, currentStock, image) VALUES (?,?,?,?,?,?,?,?)",
      [
        product.id,
        product.name,
        product.categoryId,
        product.costPrice,
        product.sellingPrice,
        product.openingStock,
        product.currentStock,
        product.image,
      ]
    );
    await logAudit(
      conn,
      product.id,
      "Inventory",
      "CREATE",
      null,
      product,
      "Admin"
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

export const updateProduct = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [old] = await conn.query("SELECT * FROM products WHERE id = ?", [
      req.params.id,
    ]);
    const p = req.body;
    await conn.query(
      "UPDATE products SET name=?, categoryId=?, costPrice=?, sellingPrice=?, currentStock=?, image=? WHERE id=?",
      [
        p.name,
        p.categoryId,
        p.costPrice,
        p.sellingPrice,
        p.currentStock,
        p.image,
        req.params.id,
      ]
    );
    await logAudit(
      conn,
      req.params.id,
      "Inventory",
      "UPDATE",
      old[0],
      p,
      "Admin"
    );
    await conn.commit();
    res.json({ success: true });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: err.message });
  } finally {
    conn.release();
  }
};
