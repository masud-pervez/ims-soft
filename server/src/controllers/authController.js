import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import { config } from "../config/env.js";
import { sendResponse, sendError } from "../utils/responseHandler.js";
import { UserRoles } from "../enums/userRoles.js";

export const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return sendError(res, 400, "User already exists with this email.");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || UserRoles.STAFF,
      permissions: {},
    });

    sendResponse(res, 201, "User registered successfully", {
      userId: newUser.id,
    });
  } catch (error) {
    console.error("Register Error:", error);
    sendError(res, 500, "Internal server error", error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return sendError(res, 401, "Invalid credentials");
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendError(res, 401, "Invalid credentials");
    }

    // Generate Token
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
    };

    const token = jwt.sign(
      payload,
      config.jwtSecret || "super_secret_jwt_key_ims_v2_2024",
      {
        expiresIn: "24h",
      }
    );

    sendResponse(res, 200, "Login successful", { token, user: payload });
  } catch (error) {
    console.error("Login Error:", error);
    sendError(res, 500, "Internal server error", error);
  }
};
