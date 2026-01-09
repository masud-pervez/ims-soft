import express from "express";
import * as controller from "../controllers/purchaseController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Purchases
 *   description: Purchase records
 */

/**
 * @swagger
 * /purchases:
 *   get:
 *     summary: Retrieve purchase history
 *     tags: [Purchases]
 *     responses:
 *       200:
 *         description: A list of purchases
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Purchase'
 *   post:
 *     summary: Record a new purchase
 *     tags: [Purchases]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Purchase'
 *     responses:
 *       201:
 *         description: Purchase recorded
 */
router.get("/", controller.getPurchases);
router.post("/", controller.createPurchase);

export default router;
