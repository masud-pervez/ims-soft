import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import { config } from "../config/env.js";
import logger from "./logger.js";
import { getSeedData } from "./seedData.js";

export async function initializeDatabase() {
  let connection;
  try {
    // 1. Connect without Database to Create it if needed
    connection = await mysql.createConnection({
      host: config.db.host,
      user: config.db.user,
      password: config.db.password,
    });

    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${config.db.name}\``
    );
    await connection.query(`USE \`${config.db.name}\``);
    logger.info(`Database '${config.db.name}' checked/created.`);

    // 2. Read and Run Schema
    const schemaPath = path.join(process.cwd(), "schema.sql");
    const schemaSql = fs.readFileSync(schemaPath, "utf-8");

    // Split by semicolon to run statements individually
    const statements = schemaSql
      .split(/;\s*$/m)
      .filter((stmt) => stmt.trim().length > 0);

    for (const statement of statements) {
      await connection.query(statement);
    }
    logger.info("Database schema initialized.");

    // 3. Check for Seed Data (Check if users are empty)
    const [rows] = await connection.query(
      "SELECT COUNT(*) as count FROM users"
    );
    const count = rows[0].count;

    if (count === 0) {
      logger.info("Database is empty. Seeding initial data...");
      const seeds = await getSeedData();

      // Seed Users
      for (const user of seeds.users) {
        await connection.query("INSERT INTO users SET ?", user);
      }

      // Seed Categories
      for (const cat of seeds.categories) {
        await connection.query("INSERT INTO categories SET ?", cat);
      }

      // Seed Products
      for (const prod of seeds.products) {
        await connection.query("INSERT INTO products SET ?", prod);
      }

      // Seed Customers
      for (const cust of seeds.customers) {
        await connection.query("INSERT INTO customers SET ?", cust);
      }

      // Seed Suppliers
      for (const supp of seeds.suppliers) {
        await connection.query("INSERT INTO suppliers SET ?", supp);
      }

      // Seed Expenses
      for (const exp of seeds.expenses) {
        await connection.query("INSERT INTO expenses SET ?", exp);
      }

      // Seed Income
      for (const inc of seeds.income) {
        await connection.query("INSERT INTO income SET ?", inc);
      }

      // Seed Orders (and Order Items)
      for (const order of seeds.orders) {
        const { order_items, ...orderData } = order;
        await connection.query("INSERT INTO orders SET ?", orderData);

        for (const item of order_items) {
          item.order_id = order.id; // Ensure link
          await connection.query("INSERT INTO order_items SET ?", item);
        }
      }

      logger.info("✅ Database seeded successfully!");
    } else {
      logger.info("Database already contains data. Skipped seeding.");
    }
  } catch (err) {
    logger.error("Initialization Failed: " + err.message);
    // process.exit(1); // Optional: Exit if DB is critical
  } finally {
    if (connection) await connection.end();
  }
}
