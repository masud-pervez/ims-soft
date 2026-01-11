import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
import { UserRoles } from "../enums/userRoles.js";
import logger from "../utils/logger.js";

/**
 * Middleware to verify JWT token from Authorization header (Bearer token)
 */
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  logger.info(`Auth Header: ${authHeader}`); // DEBUG LOG
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    logger.warn("No token extracted"); // DEBUG LOG
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(
      token,
      config.jwtSecret || "super_secret_jwt_key_ims_v2_2024"
    );
    req.user = decoded; // { id, username, email, role, permissions }
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

/**
 * Middleware to authorize specific roles
 * @param {...string} allowedRoles - Roles allowed to access the route
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    // Admin/Superadmin bypass role checks (optional, but good practice to be explicit)
    if (req.user.role === UserRoles.SUPER_ADMIN) {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Requires one of: ${allowedRoles.join(", ")}`,
      });
    }

    next();
  };
};
