import pool from "../config/db.js";

export const getAuditLogs = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 100"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
