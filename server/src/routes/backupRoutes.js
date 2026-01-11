import express from "express";
import mysqldump from "mysqldump";
import fs from "fs";
import path from "path";
import { config } from "../config/env.js";
import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/authMiddleware.js";
import { UserRoles } from "../enums/userRoles.js";
import { sendResponse, sendError } from "../utils/responseHandler.js";

const router = express.Router();

router.use(authenticateToken);
router.use(authorizeRoles(UserRoles.SUPER_ADMIN, UserRoles.ADMIN));

router.get("/download", async (req, res) => {
  try {
    const dumpFileName = `backup-${Date.now()}.sql`;
    const dumpPath = path.join(process.cwd(), "temp", dumpFileName);

    // Ensure temp dir exists
    if (!fs.existsSync(path.join(process.cwd(), "temp"))) {
      fs.mkdirSync(path.join(process.cwd(), "temp"));
    }

    await mysqldump({
      connection: {
        host: config.db.host,
        user: config.db.user,
        password: config.db.password,
        database: config.db.name,
      },
      dumpToFile: dumpPath,
    });

    res.download(dumpPath, dumpFileName, (err) => {
      if (err) {
        console.error(err);
      }
      // Cleanup
      fs.unlinkSync(dumpPath);
    });
    // Note: We can't really use sendResponse here as res.download sends the stream.
    // But if we fail before that, we can use sendError.
  } catch (error) {
    console.error("Backup failed", error);
    sendError(res, 500, "Backup failed: " + error.message, error);
  }
});

export default router;
