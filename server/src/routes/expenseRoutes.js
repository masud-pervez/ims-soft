import express from "express";
import {
  getAllIncome,
  createIncome,
  deleteIncome,
  getAllExpenses,
  createExpense,
  deleteExpense,
} from "../controllers/expenseController.js";
import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/authMiddleware.js";
import { UserRoles } from "../enums/userRoles.js";

const router = express.Router();

router.use(authenticateToken);
router.use(authorizeRoles(UserRoles.SUPER_ADMIN, UserRoles.ADMIN));

/**
 * @swagger
 * /expenses/income:
 *   get:
 *     summary: Get all income records
 *     tags: [Income]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of income
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *   post:
 *     summary: Create new income record
 *     tags: [Income]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Income'
 *           example:
 *             source: "Consulting"
 *             amount: 5000
 *             date: "2024-01-01"
 *     responses:
 *       201:
 *         description: Income created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get("/income", getAllIncome);
router.post("/income", createIncome);

/**
 * @swagger
 * /expenses/income/{id}:
 *   delete:
 *     summary: Delete an income record
 *     tags: [Income]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Income deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.delete("/income/:id", deleteIncome);

/**
 * @swagger
 * /expenses:
 *   get:
 *     summary: Get all expense records
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of expenses
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *   post:
 *     summary: Create new expense record
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Expense'
 *           example:
 *             category: "Rent"
 *             amount: 1200
 *             date: "2024-01-01"
 *     responses:
 *       201:
 *         description: Expense created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get("/", getAllExpenses);
router.post("/", createExpense);

/**
 * @swagger
 * /expenses/{id}:
 *   delete:
 *     summary: Delete an expense record
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Expense deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.delete("/:id", deleteExpense);

export default router;
