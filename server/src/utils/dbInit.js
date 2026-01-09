import mysql from "mysql2/promise";
import { config } from "../config/env.js";
import pool from "../config/db.js";
import logger from "../config/logger.js";

export async function initializeDatabase() {
  logger.info(
    `DB CONFIG: Host=${config.db.host}, User=${config.db.user}, DB=${config.db.database}`
  );
  try {
    const initConn = await mysql.createConnection({
      host: config.db.host,
      user: config.db.user,
      password: config.db.password,
    });

    await initConn.query(`CREATE DATABASE IF NOT EXISTS ${config.db.database}`);
    await initConn.query(`USE ${config.db.database}`);

    // Base Tables
    await initConn.query(
      `CREATE TABLE IF NOT EXISTS categories (id VARCHAR(50) PRIMARY KEY, name VARCHAR(255) NOT NULL)`
    );
    await initConn.query(
      `CREATE TABLE IF NOT EXISTS products (id VARCHAR(50) PRIMARY KEY, name VARCHAR(255) NOT NULL, categoryId VARCHAR(50), costPrice DECIMAL(12, 2) DEFAULT 0.00, sellingPrice DECIMAL(12, 2) DEFAULT 0.00, openingStock INT DEFAULT 0, currentStock INT DEFAULT 0, image LONGTEXT, INDEX (categoryId))`
    );
    await initConn.query(
      `CREATE TABLE IF NOT EXISTS orders (id VARCHAR(50) PRIMARY KEY, productId VARCHAR(50), productName VARCHAR(255), quantity INT DEFAULT 1, unitPrice DECIMAL(12, 2) DEFAULT 0.00, subtotal DECIMAL(12, 2) DEFAULT 0.00, refNumbers JSON, customer JSON, discount JSON, delivery JSON, payment JSON, financials JSON, meta JSON, orderDate DATE NOT NULL)`
    );
    await initConn.query(
      `CREATE TABLE IF NOT EXISTS expenses (id VARCHAR(50) PRIMARY KEY, amount DECIMAL(15, 2) NOT NULL, type VARCHAR(100) NOT NULL, description TEXT, date DATE NOT NULL, createdBy VARCHAR(255) NOT NULL, createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`
    );

    // Resilient Purchase Table Creation
    await initConn.query(`CREATE TABLE IF NOT EXISTS purchases (
      id VARCHAR(50) PRIMARY KEY,
      productId VARCHAR(50) NOT NULL,
      productName VARCHAR(255) NOT NULL,
      quantity INT NOT NULL,
      purchasePrice DECIMAL(12, 2) NOT NULL,
      totalCost DECIMAL(15, 2) NOT NULL,
      supplierName VARCHAR(255),
      purchaseDate DATE NOT NULL,
      createdBy VARCHAR(255) NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX (productId),
      INDEX (purchaseDate)
    )`);

    // Audit Table Migration Logic
    await initConn.query(`CREATE TABLE IF NOT EXISTS audit_logs (
      id INT AUTO_INCREMENT PRIMARY KEY, 
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    const requiredCols = [
      { name: "targetId", type: "VARCHAR(50)", after: "id" },
      { name: "module", type: "VARCHAR(50)", after: "targetId" },
      { name: "action", type: "VARCHAR(50)", after: "module" },
      { name: "oldState", type: "LONGTEXT", after: "action" },
      { name: "newState", type: "LONGTEXT", after: "oldState" },
      { name: "changedBy", type: "VARCHAR(255)", after: "newState" },
    ];

    const [existingCols] = await initConn.query(`SHOW COLUMNS FROM audit_logs`);
    const existingColNames = existingCols.map((c) => c.Field.toLowerCase());

    for (const col of requiredCols) {
      if (!existingColNames.includes(col.name.toLowerCase())) {
        logger.info(
          `MIGRATION: Adding missing column [${col.name}] to audit_logs...`
        );
        await initConn.query(
          `ALTER TABLE audit_logs ADD COLUMN \`${col.name}\` ${col.type} AFTER \`${col.after}\``
        );
      }
    }

    await initConn.end();
    logger.info("STATUS: DATABASE READY & MIGRATED");
  } catch (err) {
    logger.error("INIT FAILED: " + err.message);
    setTimeout(initializeDatabase, 10000);
  }
}
