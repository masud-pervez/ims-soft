import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

export class Supplier {
  static async create(supplierData) {
    const { name, phone, email } = supplierData;
    const id = uuidv4();
    const query = `INSERT INTO suppliers (id, name, phone, email) VALUES (?, ?, ?, ?)`;
    await pool.query(query, [id, name, phone, email]);
    return { id, name, phone, email };
  }

  static async findByPhone(phone) {
    const query = `SELECT * FROM suppliers WHERE phone = ?`;
    const [rows] = await pool.query(query, [phone]);
    return rows[0];
  }

  static async findAll() {
    const query = `SELECT * FROM suppliers ORDER BY created_at DESC`;
    const [rows] = await pool.query(query);
    return rows;
  }

  static async findById(id) {
    const query = `SELECT * FROM suppliers WHERE id = ?`;
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  }

  static async update(id, updates) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      if (["name", "phone", "email"].includes(key)) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (fields.length === 0) return null;

    values.push(id);
    const query = `UPDATE suppliers SET ${fields.join(", ")} WHERE id = ?`;
    await pool.query(query, values);
    return this.findById(id);
  }

  static async delete(id) {
    const query = `DELETE FROM suppliers WHERE id = ?`;
    const [result] = await pool.query(query, [id]);
    return result.affectedRows > 0;
  }
}
