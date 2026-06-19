import express from 'express';
const router = express.Router();

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts, // 👈 ADD THIS
} from '../controllers/productcontroller.js';

import { protect, admin } from '../middleware/authmiddleware.js';

// =====================
// TOP PRODUCTS ROUTE ⭐
// =====================
router.get('/top', getTopProducts);

// =====================
// GET ALL + CREATE
// =====================
router
  .route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

// =====================
// REVIEWS
// =====================
router.route('/:id/reviews').post(protect, createProductReview);

// =====================
// SINGLE PRODUCT + UPDATE + DELETE
// =====================
router
  .route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

export default router;