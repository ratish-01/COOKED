import express from "express";
import { roastUser } from "../controllers/roastController.js";

const router = express.Router();

router.post("/ai-roast", roastUser);

export default router;
