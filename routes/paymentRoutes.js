import express from 'express';
import { createPayment, confirmPayment } from '../controllers/paymentController.js';
import {verifyToken } from "../middleware/verifyToken.js"; 

const router = express.Router();

// Route to create a payment
router.post('/pay', createPayment);
router.post('/confirm', confirmPayment)

export default router;
