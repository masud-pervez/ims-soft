import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

export class Product {
  static async create(productData) {
    const { name, categoryId, purchasePrice, salePrice, stockQuantity } =
      productData;
    const id = uuidv4();
    const query = `
      INSERT INTO products (id, name, category_id, purchase_price, sale_price, stock_quantity) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [
      id,
      name,
      categoryId,
      purchasePrice,
      salePrice,
      stockQuantity || 0,
    ];

    await pool.query(query, values);
    return { id, ...productData };
  }

  static async findAll() {
    const query = `
      SELECT 
        p.id, p.name, p.sku, 
        p.category_id as categoryId, 
        p.purchase_price as costPrice, 
        p.sale_price as price, 
        p.stock_quantity as stock, 
        p.min_stock as minStock,
        p.description, p.status, p.image_url as imageUrl,
        p.created_at as createdAt, p.updated_at as updatedAt,
        c.name as categoryName 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      ORDER BY p.created_at DESC
    `;
    const [rows] = await pool.query(query);
    return rows;
  }

  static async findById(id) {
    const query = `
      SELECT 
        id, name, sku, 
        category_id as categoryId, 
        purchase_price as costPrice, 
        sale_price as price, 
        stock_quantity as stock,
        min_stock as minStock,
        description, status, image_url as imageUrl,
        created_at as createdAt, updated_at as updatedAt
      FROM products WHERE id = ?
    `;
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  }

  static async update(id, updates) {
    const fields = [];
    const values = [];

    // Map camelCase to snake_case for DB
    const mapping = {
      name: "name",
      categoryId: "category_id",
      purchasePrice: "purchase_price",
      salePrice: "sale_price",
      stockQuantity: "stock_quantity",
    };

    for (const [key, value] of Object.entries(updates)) {
      if (mapping[key]) {
        fields.push(`${mapping[key]} = ?`);
        values.push(value);
      }
    }

    if (fields.length === 0) return null;

    values.push(id);
    const query = `UPDATE products SET ${fields.join(", ")} WHERE id = ?`;
    await pool.query(query, values);
    return this.findById(id);
  }

  static async delete(id) {
    const query = `DELETE FROM products WHERE id = ?`;
    const [result] = await pool.query(query, [id]);
    return result.affectedRows > 0;
  }

  static async updateStock(id, quantityChange) {
    const query = `UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?`;
    await pool.query(query, [quantityChange, id]);
  }
}
