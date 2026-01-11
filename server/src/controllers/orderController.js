import { Order } from "../models/orderModel.js";
import { sendResponse, sendError } from "../utils/responseHandler.js";

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    sendResponse(res, 200, "Orders retrieved successfully", orders);
  } catch (error) {
    sendError(res, 500, error.message, error);
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return sendError(res, 404, "Order not found");
    sendResponse(res, 200, "Order retrieved successfully", order);
  } catch (error) {
    sendError(res, 500, error.message, error);
  }
};

export const createOrder = async (req, res) => {
  try {
    const result = await Order.create(req.body);
    sendResponse(res, 201, "Order created successfully", result);
  } catch (error) {
    sendError(res, 500, error.message, error);
  }
};
