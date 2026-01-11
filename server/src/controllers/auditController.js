import { AuditLog } from "../models/auditLogModel.js";
import { sendResponse, sendError } from "../utils/responseHandler.js";

export const getAllAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.findAll();
    sendResponse(res, 200, "Audit logs retrieved successfully", logs);
  } catch (error) {
    sendError(res, 500, error.message, error);
  }
};
