import mongoose from "mongoose";
const { Schema, model } = mongoose;

const transactionSchema = new Schema(
  {
   user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
   payment : {
    type: Schema.Types.ObjectId,
    ref: "Payment",
    required: true,
   },
    transactionType: {
      type: String,
      enum:['Payment','Refund'],
      default: 'Payment',
    },
  },
  {
    timestamps: true,
  }
);

const TransactionModel = model("Transaction", transactionSchema);
export default TransactionModel;
