import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

// Check if uuid is available, otherwise allow custom ID or throw
// Note: User must ensure uuid package is installed or use an alternative.
// If 'uuid' is not in package.json, we will conditionally import or use a placeholder.
// Checking package.json... it was NOT in the provided file view.
// I will use crypto.randomUUID() which is native in recent Node versions.

const generateId = () => {
  if (global.crypto && global.crypto.randomUUID) {
    return global.crypto.randomUUID();
  }
  // Fallback for older node versions (unlikely for new project, but safe)
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

export class User {
  /**
   * Create a new user
   * @param {Object} userData
   */
  static async create(userData) {
    const {
      email,
      password, // Should be hashed before calling this
      firstName,
      lastName,
      role = "staff",
      accessScope = {},
      permissionsOverride = [],
      status = "active",
    } = userData;

    const id = generateId();
    const query = `
      INSERT INTO users (
        id, email, password, firstName, lastName, role, 
        accessScope, permissionsOverride, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      id,
      email,
      password,
      firstName,
      lastName,
      role,
      JSON.stringify(accessScope),
      JSON.stringify(permissionsOverride),
      status,
    ];

    try {
      const [result] = await pool.query(query, values);
      return { id, ...userData };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find user by Email
   * @param {string} email
   */
  static async findByEmail(email) {
    const query = `SELECT * FROM users WHERE email = ?`;
    const [rows] = await pool.query(query, [email]);
    return rows[0];
  }

  /**
   * Find user by ID
   * @param {string} id
   */
  static async findById(id) {
    const query = `SELECT * FROM users WHERE id = ?`;
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  }

  /**
   * Update User Login Stats
   * @param {string} id
   * @param {boolean} success
   */
  static async updateLoginStats(id, success) {
    if (success) {
      const query = `
        UPDATE users 
        SET lastLoginAt = NOW(), failedLoginAttempts = 0 
        WHERE id = ?
      `;
      await pool.query(query, [id]);
    } else {
      const query = `
        UPDATE users 
        SET failedLoginAttempts = failedLoginAttempts + 1 
        WHERE id = ?
      `;
      await pool.query(query, [id]);
    }
  }

  /**
   * Update User Profile
   * @param {string} id
   * @param {Object} updates
   */
  static async update(id, updates) {
    // Dynamic query building
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      if (
        ["firstName", "lastName", "role", "status", "password"].includes(key)
      ) {
        fields.push(`${key} = ?`);
        values.push(value);
      } else if (["accessScope", "permissionsOverride"].includes(key)) {
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

  /**
   * Find All Users
   */
  static async findAll() {
    const query = `SELECT id, email, firstName, lastName, role, status, lastLoginAt, createdAt FROM users`;
    const [rows] = await pool.query(query);
    return rows;
  }

  /**
   * Delete User
   * @param {string} id
   */
  static async delete(id) {
    const query = `DELETE FROM users WHERE id = ?`;
    const [result] = await pool.query(query, [id]);
    return result.affectedRows > 0;
  }
}
