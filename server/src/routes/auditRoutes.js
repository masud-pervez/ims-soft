import express from "express";
import * as controller from "../controllers/auditController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: AuditLogs
 *   description: Audit log history
 */

/**
 * @swagger
 * /audit-logs:
 *   get:
 *     summary: Retrieve audit logs
 *     tags: [AuditLogs]
 *     responses:
 *       200:
 *         description: A list of audit logs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AuditLog'
 */
router.get("/", controller.getAuditLogs);

export default router;
