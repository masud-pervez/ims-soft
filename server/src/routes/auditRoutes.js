import express from "express";
import { getAllAuditLogs } from "../controllers/auditController.js";
import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/authMiddleware.js";
import { UserRoles } from "../enums/userRoles.js";

const router = express.Router();

router.use(authenticateToken);
router.use(authorizeRoles(UserRoles.SUPER_ADMIN, UserRoles.ADMIN));

router.get("/", getAllAuditLogs);

export default router;
