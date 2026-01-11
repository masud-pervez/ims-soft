import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

export class Expense {
  static async create(data) {
    const { category, amount, date } = data;
    const id = uuidv4();
    const query = `INSERT INTO expenses (id, category, amount, date) VALUES (?, ?, ?, ?)`;

    const values = [id, category, amount, date || new Date()];

    await pool.query(query, values);
    return { id, ...data, date: values[3] };
  }

  static async findAll() {
    const query = `SELECT * FROM expenses ORDER BY date DESC`;
    const [rows] = await pool.query(query);
    return rows;
  }

  static async delete(id) {
    const query = `DELETE FROM expenses WHERE id = ?`;
    const [result] = await pool.query(query, [id]);
    return result.affectedRows > 0;
  }
}
