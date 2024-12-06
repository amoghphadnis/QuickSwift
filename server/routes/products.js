import express from "express";
import { getProducts } from "../controllers/products.js";

const router = express.Router();

// Route to fetch products
router.get("/", getProducts);

export default router;
