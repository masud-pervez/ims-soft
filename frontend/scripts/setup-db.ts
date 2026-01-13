/* eslint-disable @typescript-eslint/no-explicit-any */
import { createConnection } from "mysql2/promise";
import dotenv from "dotenv";
import { exec } from "child_process";
import util from "util";

dotenv.config();

const execAsync = util.promisify(exec);

async function main() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error("❌ DATABASE_URL is not defined in .env");
    process.exit(1);
  }

  // Parse DATABASE_URL to get connection details
  // Format: mysql://USER:PASSWORD@HOST:PORT/DB_NAME
  const match = databaseUrl.match(
    /mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/
  );

  if (!match) {
    console.error("❌ Invalid DATABASE_URL format.");
    console.error("Expected: mysql://USER:PASSWORD@HOST:PORT/DB_NAME");
    process.exit(1);
  }

  const [, userEncoded, passwordEncoded, host, port, dbNameEncoded] = match;
  const user = decodeURIComponent(userEncoded);
  const password = decodeURIComponent(passwordEncoded);
  const dbName = decodeURIComponent(dbNameEncoded);

  try {
    // 1. Create Database if strictly needed
    console.log(`🔌 Connecting to MySQL server at ${host}:${port}...`);
    try {
      const connection = await createConnection({
        host,
        port: parseInt(port),
        user,
        password,
      });

      console.log(`🔨 Checking if database '${dbName}' exists...`);
      await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
      console.log(`✅ Database '${dbName}' checked/created.`);
      await connection.end();
    } catch (dbError: any) {
      if (
        dbError.code === "ER_DBACCESS_DENIED_ERROR" ||
        dbError.code === "ER_ACCESS_DENIED_ERROR"
      ) {
        console.warn(
          `⚠️  Warning: Could not create database. Access denied for user '${user}'.`
        );
        console.warn(
          `   Assuming database '${dbName}' already exists or you have created it manually.`
        );
        console.warn(`   Proceeding to schema push...`);
      } else {
        throw dbError;
      }
    }

    // 1.5 Verify connection to the specific database
    console.log(`🔍 Verifying connection to '${dbName}'...`);
    try {
      const dbConnection = await createConnection({
        host,
        port: parseInt(port),
        user,
        password,
        database: dbName,
      });
      await dbConnection.end();
      console.log(`✅ Connection to '${dbName}' successful.`);
    } catch (err: any) {
      console.error("Detailed Error:", err.code, err.message);
      if (
        err.code === "ER_BAD_DB_ERROR" ||
        err.code === "ER_ACCESS_DENIED_ERROR" ||
        err.code === "ER_DBACCESS_DENIED_ERROR"
      ) {
        console.error(
          `❌ Error: Database '${dbName}' does not exist or access is denied.`
        );
        console.error(
          `   Your user '${user}' does not have permission to create it automatically.`
        );
        console.error(
          `   Please create the database manually using a SQL client:`
        );
        console.error(`   CREATE DATABASE \`${dbName}\`;`);
        process.exit(1);
      } else {
        throw err;
      }
    }

    // 2. Push Schema
    console.log("🚀 Pushing Prisma schema...");
    await execAsync("npx prisma db push");
    console.log("✅ Schema pushed successfully.");

    // 3. Seed Data
    console.log("🌱 Seeding database...");
    // We intentionally don't capture the output here to let the seed script log to console if it wants,
    // but exec returns stdout/stderr in the object.
    // For better visibility, let's just log what we get.
    const { stdout, stderr } = await execAsync("npx prisma db seed");
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    console.log("✅ Seeding process finished.");

    console.log(
      "✨ Setup completed successfully! You can now run `npm run dev`."
    );
  } catch (error: any) {
    console.error("❌ Setup failed:", error.message);
    process.exit(1);
  }
}

main();
