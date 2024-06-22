import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch(err => {
    console.error("Error connecting to MongoDB:", err.message);
  });

export default mongoose.connection;
