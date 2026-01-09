import pool from "../config/db.js";
import { logAudit } from "../services/auditService.js";

export const getCategories = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM categories ORDER BY name ASC"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCategory = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const { id, name } = req.body;
    await conn.query("INSERT INTO categories (id, name) VALUES (?,?)", [
      id,
      name,
    ]);
    await logAudit(conn, id, "Category", "CREATE", null, req.body, "Admin");
    await conn.commit();
    res.status(201).json({ success: true });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: err.message });
  } finally {
    conn.release();
  }
};
