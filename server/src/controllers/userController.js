import { User } from "../models/userModel.js";

export class UserController {
  /**
   * Get All Users
   */
  static async getAllUsers(req, res) {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Get Single User by ID
   */
  static async getUserById(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Update User
   */
  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Prevent updating sensitive fields via this generic endpoint if needed,
      // but assuming admin control for now.
      delete updates.password; // Use separate endpoint for password reset if needed
      delete updates.id;

      const updatedUser = await User.update(id, updates);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Delete User
   */
  static async deleteUser(req, res) {
    try {
      const success = await User.delete(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Update User Permissions
   * Specific endpoint for updating role/permissions
   */
  static async updatePermissions(req, res) {
    try {
      const { id } = req.params;
      const { role, permissionsOverride, accessScope } = req.body;

      const updates = {};
      if (role !== undefined) updates.role = role;
      if (permissionsOverride !== undefined)
        updates.permissionsOverride = permissionsOverride;
      if (accessScope !== undefined) updates.accessScope = accessScope;

      if (Object.keys(updates).length === 0) {
        return res
          .status(400)
          .json({ message: "No permission fields provided to update" });
      }

      const updatedUser = await User.update(id, updates);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password, ...userWithoutPassword } = updatedUser;
      res.json({
        message: "Permissions updated successfully",
        user: userWithoutPassword,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
