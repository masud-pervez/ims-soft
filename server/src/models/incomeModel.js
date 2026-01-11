import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

export class Income {
  static async create(data) {
    const { source, amount, date } = data;
    const id = uuidv4();
    const query = `INSERT INTO income (id, source, amount, date) VALUES (?, ?, ?, ?)`;

    // Default date to now if not provided
    const values = [id, source, amount, date || new Date()];

    await pool.query(query, values);
    return { id, ...data, date: values[3] };
  }

  static async findAll() {
    const query = `SELECT * FROM income ORDER BY date DESC`;
    const [rows] = await pool.query(query);
    return rows;
  }

  static async delete(id) {
    const query = `DELETE FROM income WHERE id = ?`;
    const [result] = await pool.query(query, [id]);
    return result.affectedRows > 0;
  }
}
