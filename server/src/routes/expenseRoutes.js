import express from "express";
import * as controller from "../controllers/expenseController.js";

const router = express.Router();

router.get("/", controller.getExpenses);
router.post("/", controller.createExpense);
router.delete("/:id", controller.deleteExpense);

export default router;
