import TransactionModel from '../models/transactionModel.js';
import jwt from 'jsonwebtoken';

// Controller to get all transactions 
export const getAllTransactions = async (req, res) => {
    
  try {
    const transactions = await TransactionModel.find().populate('user').populate('payment');
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching transactions' });
  }
};

// Controller to get transactions for a specific user
export const getTransactionsByUserId = async (req, res) => {
    const authHeader = req.headers['authorization'];

    const token = authHeader.split(' ')[1];
      const decodedToken = jwt.verify(token, 'secretKey');
    try {
      console.log('Decoded Payload:', req.user);
      const userId =  decodedToken._id  // Extract user ID from token
      console.log(`User ID: ${userId}`);
  
      console.log('Fetching transactions from database');
      const transactions = await TransactionModel.find({ user: userId }).populate('payment');
      console.log(`Transactions: ${JSON.stringify(transactions)}`);
  
      res.status(200).json(transactions);
    } catch (error) {
      console.error('Error fetching user transactions:', error);
      res.status(500).json({ error: 'Error fetching user transactions' });
    }
  };
