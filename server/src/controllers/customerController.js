import { Customer } from "../models/customerModel.js";
import { sendResponse, sendError } from "../utils/responseHandler.js";

export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll();
    sendResponse(res, 200, "Customers retrieved successfully", customers);
  } catch (error) {
    sendError(res, 500, error.message, error);
  }
};

export const createCustomer = async (req, res) => {
  try {
    const result = await Customer.create(req.body);
    sendResponse(res, 201, "Customer created successfully", result);
  } catch (error) {
    sendError(res, 500, error.message, error);
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const result = await Customer.update(req.params.id, req.body);
    if (!result) return sendError(res, 404, "Customer not found");
    sendResponse(res, 200, "Customer updated successfully", result);
  } catch (error) {
    sendError(res, 500, error.message, error);
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const success = await Customer.delete(req.params.id);
    if (!success) return sendError(res, 404, "Customer not found");
    sendResponse(res, 200, "Customer deleted successfully");
  } catch (error) {
    sendError(res, 500, error.message, error);
  }
};
