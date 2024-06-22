import db from './config/DBConnection.js';
import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import authRoute from './routes/AuthRoutes.js';
import ClaimRoutes from './routes/ClaimRoutes.js';
import userRoute from './routes/UserRoute.js';
import contractRoute from './routes/contractRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js';
import transactionRoutes  from './routes/TransactionsRoutes.js'
dotenv.config();
const app = express();
const port = process.env.PORT || 9001;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', authRoute);
app.use('/Claim', ClaimRoutes);
app.use('/user', userRoute);
app.use('/contract', contractRoute);
app.use('/payment', paymentRoutes);
app.use('/transaction',transactionRoutes);

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('MongoDB connection is open');
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });
});
