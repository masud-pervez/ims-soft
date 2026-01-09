import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import { config } from "../config/env.js";

const generateToken = (user) => {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      scope: user.accessScope,
    },
    config.jwtSecret || "default_dev_secret",
    { expiresIn: "24h" }
  );
};

export class AuthController {
  /**
   * Register a new user
   */
  static async register(req, res) {
    try {
      const { email, password, firstName, lastName } = req.body;

      // Check if exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const newUser = await User.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: "staff", // Default role
        accessScope: { warehouses: [], stores: [] },
      });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = newUser;

      res.status(201).json({
        message: "User registered successfully",
        user: userWithoutPassword,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * User Login
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findByEmail(email);
      if (!user) {
        await User.updateLoginStats(null, false); // security placeholder (needs ID, skipping for now)
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        await User.updateLoginStats(user.id, false);
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Success
      await User.updateLoginStats(user.id, true);

      const token = generateToken(user);
      const { password: _, ...userWithoutPassword } = user;

      res.json({
        message: "Login successful",
        token,
        user: userWithoutPassword,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Change User Role & Permissions
   * Admin only (Middleware should verify this)
   */
  static async changeRole(req, res) {
    try {
      const { userId, role, permissionsOverride, accessScope } = req.body;

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const updates = {};
      if (role) updates.role = role;
      if (permissionsOverride)
        updates.permissionsOverride = permissionsOverride;
      if (accessScope) updates.accessScope = accessScope;

      const updatedUser = await User.update(userId, updates);

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password: _, ...userWithoutPassword } = updatedUser;

      res.json({
        message: "User role/permissions updated",
        user: userWithoutPassword,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
