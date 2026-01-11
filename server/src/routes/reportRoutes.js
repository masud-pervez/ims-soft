import express from "express";
import {
  getProfitLoss,
  getDailyLedger,
} from "../controllers/reportController.js";
import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/authMiddleware.js";
import { UserRoles } from "../enums/userRoles.js";

const router = express.Router();

router.use(authenticateToken);
router.use(authorizeRoles(UserRoles.SUPER_ADMIN, UserRoles.ADMIN)); // Restricted to Admin

router.get("/profit-loss", getProfitLoss);
router.get("/daily-ledger", getDailyLedger);

export default router;
