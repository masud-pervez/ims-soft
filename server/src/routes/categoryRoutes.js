import express from "express";
import * as controller from "../controllers/categoryController.js";

const router = express.Router();

router.get("/", controller.getCategories);
router.post("/", controller.createCategory);

export default router;
