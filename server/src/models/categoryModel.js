import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

export class Category {
  static async create(name) {
    const id = uuidv4();
    const query = `INSERT INTO categories (id, name) VALUES (?, ?)`;
    await pool.query(query, [id, name]);
    return { id, name };
  }

  static async findAll() {
    const query = `SELECT * FROM categories ORDER BY created_at DESC`;
    const [rows] = await pool.query(query);
    return rows;
  }

  static async findById(id) {
    const query = `SELECT * FROM categories WHERE id = ?`;
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  }

  static async update(id, name) {
    const query = `UPDATE categories SET name = ? WHERE id = ?`;
    await pool.query(query, [name, id]);
    return this.findById(id);
  }

  static async delete(id) {
    const query = `DELETE FROM categories WHERE id = ?`;
    const [result] = await pool.query(query, [id]);
    return result.affectedRows > 0;
  }
}
