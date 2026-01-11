import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pool from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const initDb = async () => {
  try {
    const schemaPath = path.join(__dirname, "../../schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");

    // Split queries by semicolon, filtering out empty lines
    const queries = schema
      .split(";")
      .map((query) => query.trim())
      .filter((query) => query.length > 0);

    console.log(`Found ${queries.length} queries to execute.`);

    const connection = await pool.getConnection();

    try {
      for (const query of queries) {
        await connection.query(query);
      }
      console.log("Database initialized successfully.");
    } catch (error) {
      console.error("Error executing query:", error);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Failed to initialize database:", error);
  } finally {
    process.exit();
  }
};

initDb();
