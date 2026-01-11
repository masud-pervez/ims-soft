import pool from "../config/db.js";
import { sendResponse, sendError } from "../utils/responseHandler.js";

export const getProfitLoss = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Default to last 30 days if no date provided
    const start =
      startDate ||
      new Date(new Date().setDate(new Date().getDate() - 30))
        .toISOString()
        .split("T")[0];
    const end = endDate || new Date().toISOString().split("T")[0];

    // Calculate Total Income
    const incomeQuery = `SELECT SUM(amount) as total FROM income WHERE date >= ? AND date <= ?`;
    const [incomeRows] = await pool.query(incomeQuery, [start, end]);
    const totalIncome = incomeRows[0].total || 0;

    // Calculate Total Expense
    const expenseQuery = `SELECT SUM(amount) as total FROM expenses WHERE date >= ? AND date <= ?`;
    const [expenseRows] = await pool.query(expenseQuery, [start, end]);
    const totalExpense = expenseRows[0].total || 0;

    const profitOrLoss = totalIncome - totalExpense;

    sendResponse(res, 200, "Profit/Loss Report", {
      startDate: start,
      endDate: end,
      totalIncome,
      totalExpense,
      profitOrLoss,
      status: profitOrLoss >= 0 ? "Profit" : "Loss",
    });
  } catch (error) {
    sendError(res, 500, error.message, error);
  }
};

export const getDailyLedger = async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date || new Date().toISOString().split("T")[0];

    // Income for the day
    const incomeQuery = `SELECT * FROM income WHERE DATE(date) = ?`;
    const [incomes] = await pool.query(incomeQuery, [targetDate]);

    // Expenses for the day
    const expenseQuery = `SELECT * FROM expenses WHERE DATE(date) = ?`;
    const [expenses] = await pool.query(expenseQuery, [targetDate]);

    const totalIncome = incomes.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );
    const totalExpense = expenses.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );

    sendResponse(res, 200, "Daily Ledger Report", {
      date: targetDate,
      incomes,
      expenses,
      summary: {
        totalIncome,
        totalExpense,
        net: totalIncome - totalExpense,
      },
    });
  } catch (error) {
    sendError(res, 500, error.message, error);
  }
};
