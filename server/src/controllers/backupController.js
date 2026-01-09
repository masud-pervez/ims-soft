import pool from "../config/db.js";

export const createBackup = async (req, res) => {
  try {
    let sqlDump = `-- OmniOrder Pro Backup\n-- Generated: ${new Date().toISOString()}\n\n`;
    sqlDump += `SET FOREIGN_KEY_CHECKS = 0;\n\n`;
    const tables = [
      "categories",
      "products",
      "orders",
      "expenses",
      "audit_logs",
      "purchases",
    ];
    for (const table of tables) {
      sqlDump += `-- Dumping table: ${table}\n`;
      const [rows] = await pool.query(`SELECT * FROM ${table}`);
      if (rows.length > 0) {
        const columns = Object.keys(rows[0]).join(", ");
        rows.forEach((row) => {
          const values = Object.values(row)
            .map((val) =>
              val === null
                ? "NULL"
                : pool.escape(
                    typeof val === "object" ? JSON.stringify(val) : val
                  )
            )
            .join(", ");
          sqlDump += `INSERT INTO ${table} (${columns}) VALUES (${values});\n`;
        });
      }
      sqlDump += `\n`;
    }
    sqlDump += `SET FOREIGN_KEY_CHECKS = 1;\n`;
    res.setHeader("Content-Type", "text/sql");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=omniorder_backup_${Date.now()}.sql`
    );
    res.send(sqlDump);
  } catch (err) {
    res.status(500).json({ message: "Backup failed" });
  }
};
