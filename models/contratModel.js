import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const contractSchema = new Schema(
  {
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    coverageDetails: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    prime: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Active', 'Expired'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

const ContractModel = model('Contract', contractSchema);
export default ContractModel;
