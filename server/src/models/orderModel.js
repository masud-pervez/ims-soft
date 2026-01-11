import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

export class Order {
  static async create(orderData) {
    const { type, customerId, supplierId, items } = orderData;
    const id = uuidv4();

    // Calculate total amount
    const totalAmount = items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // 1. Create Order
      const orderQuery = `
          INSERT INTO orders (id, type, customer_id, supplier_id, total_amount) 
          VALUES (?, ?, ?, ?, ?)
        `;
      await connection.query(orderQuery, [
        id,
        type,
        customerId,
        supplierId,
        totalAmount,
      ]);

      // 2. Create Order Items and Update Stock
      for (const item of items) {
        const itemId = uuidv4();
        const itemTotal = item.quantity * item.price;

        // Insert Item
        await connection.query(
          `INSERT INTO order_items (id, order_id, product_id, quantity, price, total) VALUES (?, ?, ?, ?, ?, ?)`,
          [itemId, id, item.productId, item.quantity, item.price, itemTotal]
        );

        // Update Product Stock
        let stockChange = 0;
        if (type === "SALE" || type === "PURCHASE_RETURN") {
          stockChange = -item.quantity;
        } else if (type === "PURCHASE" || type === "SALE_RETURN") {
          stockChange = item.quantity;
        }

        if (stockChange !== 0) {
          await connection.query(
            `UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?`,
            [stockChange, item.productId]
          );
        }
      }

      await connection.commit();
      return { id, ...orderData, totalAmount };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async findAll() {
    const query = `
      SELECT o.*, c.name as customer_name, s.name as supplier_name 
      FROM orders o 
      LEFT JOIN customers c ON o.customer_id = c.id 
      LEFT JOIN suppliers s ON o.supplier_id = s.id 
      ORDER BY o.date DESC
    `;
    const [rows] = await pool.query(query);
    return rows;
  }

  static async findById(id) {
    const orderQuery = `
          SELECT o.*, c.name as customer_name, s.name as supplier_name 
          FROM orders o 
          LEFT JOIN customers c ON o.customer_id = c.id 
          LEFT JOIN suppliers s ON o.supplier_id = s.id 
          WHERE o.id = ?
       `;
    const itemsQuery = `
          SELECT oi.*, p.name as product_name 
          FROM order_items oi 
          JOIN products p ON oi.product_id = p.id 
          WHERE oi.order_id = ?
       `;

    const [orders] = await pool.query(orderQuery, [id]);
    if (!orders.length) return null;

    const [items] = await pool.query(itemsQuery, [id]);

    return { ...orders[0], items };
  }
}
