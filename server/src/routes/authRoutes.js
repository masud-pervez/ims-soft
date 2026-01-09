import express from "express";
import { AuthController } from "../controllers/authController.js";
import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *               firstName: { type: string }
 *               lastName: { type: string }
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: User exists
 */
router.post("/register", AuthController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", AuthController.login);

/**
 * @swagger
 * /auth/role:
 *   put:
 *     summary: Update User Role (Admin)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId]
 *             properties:
 *               userId: { type: string }
 *               role: { type: string, enum: [admin, manager, staff] }
 *               permissionsOverride: { type: array, items: { type: string } }
 *     responses:
 *       200:
 *         description: Updated
 */
router.put(
  "/role",
  authenticateToken,
  authorizeRoles(["admin"]),
  AuthController.changeRole
);

export default router;
