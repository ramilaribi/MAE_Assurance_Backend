import mongoose from "mongoose";
const { Schema, model } = mongoose;

const claimSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },
    status : {
      type: String,
      default: "NON TRAITE",
    },
    etatDelete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const ClaimModel = model("Claim", claimSchema);
export default ClaimModel;
