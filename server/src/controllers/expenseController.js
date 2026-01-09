import pool from "../config/db.js";
import { logAudit } from "../services/auditService.js";

export const getExpenses = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM expenses ORDER BY date DESC"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createExpense = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const { id, amount, type, description, date, createdBy } = req.body;
    await conn.query(
      "INSERT INTO expenses (id, amount, type, description, date, createdBy) VALUES (?,?,?,?,?,?)",
      [id, amount, type, description, date, createdBy]
    );
    await logAudit(conn, id, "Expense", "CREATE", null, req.body, createdBy);
    await conn.commit();
    res.status(201).json({ success: true });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: err.message });
  } finally {
    conn.release();
  }
};

export const deleteExpense = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [rows] = await conn.query("SELECT * FROM expenses WHERE id = ?", [
      req.params.id,
    ]);
    await conn.query("DELETE FROM expenses WHERE id = ?", [req.params.id]);
    await logAudit(
      conn,
      req.params.id,
      "Expense",
      "DELETE",
      rows[0],
      null,
      "System/Admin"
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
