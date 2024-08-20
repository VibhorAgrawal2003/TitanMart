import express from "express";
import { getPicture, getAdmin } from "../controllers/users.js";
import { addProduct } from "../controllers/products.js";

const router = express.Router();

// product routes
router.post("/product/add", addProduct);

// user routes
router.get("/picture/:username", getPicture);
router.get("/admin/:username", getAdmin);

export default router;
