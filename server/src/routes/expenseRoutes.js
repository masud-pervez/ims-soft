import express from "express";
import * as controller from "../controllers/expenseController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Expenses
 *   description: Expense management
 */

/**
 * @swagger
 * /expenses:
 *   get:
 *     summary: Retrieve a list of expenses
 *     tags: [Expenses]
 *     responses:
 *       200:
 *         description: A list of expenses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Expense'
 *   post:
 *     summary: Record a new expense
 *     tags: [Expenses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Expense'
 *     responses:
 *       201:
 *         description: Expense recorded
 */
router.get("/", controller.getExpenses);
router.post("/", controller.createExpense);

/**
 * @swagger
 * /expenses/{id}:
 *   delete:
 *     summary: Delete an expense
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Expense deleted
 */
router.delete("/:id", controller.deleteExpense);

export default router;
