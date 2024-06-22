import express from 'express';
import {
  createClaim,
  getAllClaims,
  getClaimById,
  updateClaim,
  deleteClaim
} from '../controllers/claimController.js';
import { verifyToken } from '../middleware/verifyToken.js'; 

const router = express.Router();

// Create a new claim
router.post('/create', verifyToken, createClaim);

// Get all claims
router.get('/all', getAllClaims);

// Get a single claim by ID
router.post('/getClaimById', verifyToken, getClaimById);

// Update a claim by ID
router.put('/', verifyToken, updateClaim);

// Delete a claim by ID
router.delete('/', verifyToken, deleteClaim);

export default router;
