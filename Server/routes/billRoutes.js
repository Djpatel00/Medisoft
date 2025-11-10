import {createOrder,verifyPayment } from '../controllers/billController.js';
import express from 'express';

const router = express.Router();

// Route for creating razorpay order
router.post('/create-order',createOrder);

// Route for verifying the payment is done or not and also updating
// In database if payment is success full.
router.post('/verify-Payment',verifyPayment);

// Route for updating in the db after payment
router.post('/updateBillDetails',verifyPayments)

export default router