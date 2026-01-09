import express from "express";
import * as controller from "../controllers/backupController.js";

const router = express.Router();

router.get("/", controller.createBackup);

export default router;
