import express from "express";
import * as controller from "../controllers/purchaseController.js";

const router = express.Router();

router.get("/", controller.getPurchases);
router.post("/", controller.createPurchase);

export default router;
