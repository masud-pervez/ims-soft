import { Income } from "../models/incomeModel.js";
import { Expense } from "../models/expenseModel.js";
import { sendResponse, sendError } from "../utils/responseHandler.js";

// Income
export const getAllIncome = async (req, res) => {
  try {
    const income = await Income.findAll();
    sendResponse(res, 200, "Income records retrieved successfully", income);
  } catch (error) {
    sendError(res, 500, error.message, error);
  }
};

export const createIncome = async (req, res) => {
  try {
    const result = await Income.create(req.body);
    sendResponse(res, 201, "Income record created successfully", result);
  } catch (error) {
    sendError(res, 500, error.message, error);
  }
};

export const deleteIncome = async (req, res) => {
  try {
    const success = await Income.delete(req.params.id);
    if (!success) return sendError(res, 404, "Income record not found");
    sendResponse(res, 200, "Income record deleted successfully");
  } catch (error) {
    sendError(res, 500, error.message, error);
  }
};

// Expense
export const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll();
    sendResponse(res, 200, "Expense records retrieved successfully", expenses);
  } catch (error) {
    sendError(res, 500, error.message, error);
  }
};

export const createExpense = async (req, res) => {
  try {
    const result = await Expense.create(req.body);
    sendResponse(res, 201, "Expense record created successfully", result);
  } catch (error) {
    sendError(res, 500, error.message, error);
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const success = await Expense.delete(req.params.id);
    if (!success) return sendError(res, 404, "Expense record not found");
    sendResponse(res, 200, "Expense record deleted successfully");
  } catch (error) {
    sendError(res, 500, error.message, error);
  }
};
