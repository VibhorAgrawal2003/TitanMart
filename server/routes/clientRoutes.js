import express from "express";
import { getPicture } from "../controllers/client.js";

const router = express.Router();

router.post("/picture", getPicture);

export default router;
