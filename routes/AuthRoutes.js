import express from "express";
import authController from "../controllers/authController.js";
import {verifyAndAuth } from "../middleware/verifyToken.js"; 
const router = express.Router();

router.post("/newAdmin", authController.newAdmin);
router.post("/login", authController.login);
router.post("/admin/login", authController.loginAdmin);
router.post("/forgetPwd", authController.forgotPwd);
router.post("/otp", verifyAndAuth, authController.otp);
router.post("/newPwd", verifyAndAuth, authController.newPwd);

export default router;
