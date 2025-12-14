import express from "express";
import { login, callback, sessionStatus, afterLogin, logout } from "../controllers/authController.js";

const router = express.Router();

router.get("/login", login);
router.get("/callback", callback);
router.get("/session-status", sessionStatus);
router.get("/after-login", afterLogin);
router.post("/logout", logout);

export default router;
