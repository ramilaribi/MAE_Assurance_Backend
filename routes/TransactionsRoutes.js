import express from 'express';
import { getAllTransactions, getTransactionsByUserId } from '../controllers/transactionController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// Route to get all transactions (admin only)
router.get('/getall', getAllTransactions);

// Route to get transactions for the authenticated user
router.get('/byid', verifyToken, getTransactionsByUserId);

export default router;
