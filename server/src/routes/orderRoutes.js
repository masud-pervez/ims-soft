import express from "express";
import * as controller from "../controllers/orderController.js";

const router = express.Router();

router.get("/", controller.getOrders);
router.post("/", controller.createOrder);
router.patch("/:id/status", controller.updateOrderStatus);
router.patch("/:id/payment", controller.updateOrderPayment);

export default router;
