import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

const generateId = () => {
  return uuidv4();
};

export class User {
  static async create(userData) {
    const {
      username,
      email,
      password,
      role = "staff",
      permissions = {},
    } = userData;
    const id = generateId();
    const query = `INSERT INTO users (id, username, email, password, role, permissions) VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [
      id,
      username,
      email,
      password,
      role,
      JSON.stringify(permissions),
    ];

    try {
      await pool.query(query, values);
      return { id, username, email, role, permissions };
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    const query = `SELECT * FROM users WHERE email = ?`;
    const [rows] = await pool.query(query, [email]);
    return rows[0];
  }

  static async findById(id) {
    const query = `SELECT * FROM users WHERE id = ?`;
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  }

  static async findAll() {
    const query = `SELECT id, username, email, role, permissions, created_at FROM users`;
    const [rows] = await pool.query(query);
    return rows;
  }

  static async update(id, updates) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      if (["username", "email", "role"].includes(key)) {
        fields.push(`${key} = ?`);
        values.push(value);
      } else if (key === "permissions") {
        fields.push(`${key} = ?`);
        values.push(JSON.stringify(value));
      }
    }

    if (fields.length === 0) return null;

    values.push(id);
    const query = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
    await pool.query(query, values);
    return this.findById(id);
  }

  static async delete(id) {
    const query = `DELETE FROM users WHERE id = ?`;
    const [result] = await pool.query(query, [id]);
    return result.affectedRows > 0;
  }
}
