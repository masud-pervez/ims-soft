import express from "express";
import * as controller from "../controllers/auditController.js";

const router = express.Router();

router.get("/", controller.getAuditLogs);

export default router;
