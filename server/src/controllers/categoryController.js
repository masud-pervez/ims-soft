import { Category } from "../models/categoryModel.js";
import { sendResponse, sendError } from "../utils/responseHandler.js";

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    sendResponse(res, 200, "Categories retrieved successfully", categories);
  } catch (error) {
    sendError(res, 500, error.message, error);
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const result = await Category.create(name);
    sendResponse(res, 201, "Category created successfully", result);
  } catch (error) {
    sendError(res, 500, error.message, error);
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const result = await Category.update(req.params.id, name);
    if (!result) return sendError(res, 404, "Category not found");
    sendResponse(res, 200, "Category updated successfully", result);
  } catch (error) {
    sendError(res, 500, error.message, error);
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const success = await Category.delete(req.params.id);
    if (!success) return sendError(res, 404, "Category not found");
    sendResponse(res, 200, "Category deleted successfully");
  } catch (error) {
    sendError(res, 500, error.message, error);
  }
};
