import express from "express";
import * as controller from "../controllers/productController.js";

const router = express.Router();

router.get("/", controller.getProducts);
router.post("/", controller.createProduct);
router.put("/:id", controller.updateProduct);

export default router;
