import express from "express";
import * as controller from "../controllers/backupController.js";

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
 *     responses:
 *       200:
 *         description: Backup created successfully
 */
router.get("/", controller.createBackup);

export default router;
