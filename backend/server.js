import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';

import productRoutes from './routes/productroutes.js';
import userRoutes from './routes/userroutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

import { notFound, errorHandler } from './middleware/errormiddleware.js';

dotenv.config();

const app = express();

// Path setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL,
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie Parser
app.use(cookieParser());

// Static Uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/config/paypal', (req, res) => {
  res.send({
    clientId: process.env.PAYPAL_CLIENT_ID,
  });
});

// ===========================
// PRODUCTION FRONTEND SERVE
// ===========================
if (process.env.NODE_ENV === 'production') {
  app.use(
    express.static(
      path.join(__dirname, '../frontend/frontened/build')
    )
  );

  app.get('*', (req, res) => {
    res.sendFile(
      path.resolve(
        __dirname,
        '../frontend/frontened/build/index.html'
      )
    );
  });
} else {
  app.get('/', (req, res) => {
    res.send('API Running...');
  });
}

// Error Middleware
app.use(notFound);
app.use(errorHandler);

// Start Server
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ DB connection failed:', error);
    process.exit(1);
  }
};

startServer();