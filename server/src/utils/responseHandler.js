/**
 * Standard API Response Structure
 * {
 *   "status": true/false,
 *   "message": "Message",
 *   "status_code": 200,
 *   "Data": {} || [],
 *   "Error": {actual error} || null,
 *   "error_message": "error message" || null
 * }
 */

export const sendResponse = (res, statusCode, message, data = null) => {
  res.status(statusCode).json({
    status: statusCode >= 200 && statusCode < 300,
    message: message,
    status_code: statusCode,
    Data: data,
    Error: null,
    error_message: null,
  });
};

export const sendError = (res, statusCode, message, error = null) => {
  res.status(statusCode).json({
    status: false,
    message: message,
    status_code: statusCode,
    Data: null,
    Error: error,
    error_message: error ? error.message || String(error) : message,
  });
};
