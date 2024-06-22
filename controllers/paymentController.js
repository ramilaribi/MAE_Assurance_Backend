import mongoose from 'mongoose';
import stripe from '../config/stripe.js';
import PaymentModel from '../models/paymentModel.js';
import ContractModel from '../models/contratModel.js';
import TransactionModel from '../models/transactionModel.js'; 

// Function to create payment  
export const createPayment = async (req, res) => {
  try {
    const { contractID, amount, currency } = req.body;

    if (!contractID || !mongoose.Types.ObjectId.isValid(contractID)) {
      console.log('Invalid Contract ID');
      return res.status(400).json({ message: 'Valid Contract ID is required' });
    }

    const contract = await ContractModel.findById(contractID);
    if (!contract) {
      console.log('Contract not found');
      return res.status(404).json({ message: 'Contract not found' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: currency,
    });

    console.log('Payment Intent created:', paymentIntent);

    const newPayment = new PaymentModel({
      contract: contract._id,
      amount: amount,
      paymentStatus: 'Failed',
    });

    await newPayment.save();

    console.log('Payment record created:', newPayment);

    return res.json({
      client_secret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      paymentID: newPayment._id,
    });
  } catch (error) {
    console.error('Error during payment creation:', error);
    if (!res.headersSent) {
      return res.status(500).json({ error: 'Erreur lors du paiement' });
    }
  }
};

// Function to confirm payment and update contract dates
export const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, paymentID } = req.body;

    if (!paymentIntentId || !paymentID) {
      console.log('Missing required fields for payment confirmation');
      return res.status(400).json({ message: 'Payment Intent ID and Payment ID are required' });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    console.log('Payment Intent retrieved:', paymentIntent);

    const payment = await PaymentModel.findById(paymentID);
    if (!payment) {
      console.log('Payment not found in database');
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (paymentIntent.status === 'succeeded') {
      payment.paymentStatus = 'Succeeded';
      await payment.save();

      const contract = await ContractModel.findById(payment.contract);
      if (contract) {
        const currentDate = new Date();
        const endDate = new Date(currentDate);
        endDate.setFullYear(endDate.getFullYear() + 1);

        contract.startDate = currentDate;
        contract.endDate = endDate;
        contract.status = 'Active';
        await contract.save();

        // Create a transaction record for the successful payment
        const newTransaction = new TransactionModel({
          user: contract.user._id, // Use the user ID from the contract
          payment: payment._id,
          transactionType: 'Payment',
        });

        await newTransaction.save();

        console.log('Transaction record created:', newTransaction);

        res.status(200).json({
          message: 'Payment succeeded and contract updated successfully',
          payment: payment,
          contract: contract,
          transaction: newTransaction,
        });
      } else {
        res.status(404).json({ message: 'Contract not found' });
      }
    } else {
      payment.paymentStatus = 'Failed';
      await payment.save();

      console.log('Payment failed with status:', paymentIntent.status);

      res.status(400).json({
        message: 'Payment failed',
        status: paymentIntent.status,
        payment: payment,
      });
    }
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ message: 'Error confirming payment', error: error.message });
  }
};
