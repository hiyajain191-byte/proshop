import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

import connectDB from './config/db.js';

import productRoutes from './routes/productroutes.js';
import userRoutes from './routes/userroutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js'; // ✅ ADD THIS

import { notFound, errorHandler } from './middleware/errormiddleware.js';

dotenv.config();

// Connect DB
connectDB();

const app = express();

// CORS
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// =======================
// 🚀 MAKE UPLOADS PUBLIC
// =======================
app.use('/uploads', express.static(path.join(process.cwd(), '/uploads')));

// Home route
app.get('/', (req, res) => {
  res.send('API Running...');
});

// =======================
// API ROUTES
// =======================
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// ✅ IMAGE UPLOAD ROUTE
app.use('/api/upload', uploadRoutes);

// PayPal config
app.get('/api/config/paypal', (req, res) => {
  res.send({
    clientId: process.env.PAYPAL_CLIENT_ID,
  });
});

// Error middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});