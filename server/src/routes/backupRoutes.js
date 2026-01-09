import express from "express";
import * as controller from "../controllers/backupController.js";
import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Backup
 *   description: System backup management
 */

/**
 * @swagger
 * /backup:
 *   get:
 *     summary: Create a system backup
 *     tags: [Backup]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Backup created successfully
 */
router.get(
  "/",
  authenticateToken,
  authorizeRoles(["admin"]),
  controller.createBackup
);

export default router;
