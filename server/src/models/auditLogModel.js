import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

export class AuditLog {
  static async create(logData) {
    const { event, userId } = logData;
    const id = uuidv4();
    const query = `INSERT INTO audit_logs (id, event, user_id) VALUES (?, ?, ?)`;
    try {
      await pool.query(query, [id, event, userId]);
    } catch (error) {
      console.error("Failed to create audit log", error);
      // We don't throw here to prevent blocking main flow if logging fails
    }
  }

  static async findAll() {
    const query = `
      SELECT a.*, u.email as user_email 
      FROM audit_logs a 
      LEFT JOIN users u ON a.user_id = u.id 
      ORDER BY a.timestamp DESC
    `;
    const [rows] = await pool.query(query);
    return rows;
  }
}
