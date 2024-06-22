import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const paymentSchema = new Schema(
  {
    contract: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contract',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['Failed', 'Succeeded'],
      default: 'Failed',
    },
  },
  {
    timestamps: true,
  }
);

const PaymentModel = model('Payment', paymentSchema);
export default PaymentModel;
