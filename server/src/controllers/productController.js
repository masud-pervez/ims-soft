import { Product } from "../models/productModel.js";
import { sendResponse, sendError } from "../utils/responseHandler.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    sendResponse(res, 200, "Products retrieved successfully", products);
  } catch (error) {
    sendError(res, 500, error.message, error);
  }
};

export const createProduct = async (req, res) => {
  try {
    const result = await Product.create(req.body);
    sendResponse(res, 201, "Product created successfully", result);
  } catch (error) {
    sendError(res, 500, error.message, error);
  }
};

export const updateProduct = async (req, res) => {
  try {
    const result = await Product.update(req.params.id, req.body);
    if (!result) return sendError(res, 404, "Product not found");
    sendResponse(res, 200, "Product updated successfully", result);
  } catch (error) {
    sendError(res, 500, error.message, error);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const success = await Product.delete(req.params.id);
    if (!success) return sendError(res, 404, "Product not found");
    sendResponse(res, 200, "Product deleted successfully");
  } catch (error) {
    sendError(res, 500, error.message, error);
  }
};
