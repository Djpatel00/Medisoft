import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Razorpay from 'razorpay';
import crypto from 'crypto';


// Define __dirname manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });
// console.log("KEY SECRET:", process.env.RAZORPAY_KEY_SECRET);


// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

//Create a razor Pay order
export const createOrder= async (req, res) => {
  try {
    console.log(req.body)
    const { total, receipt } = req.body;

    const options = {
      amount: total * 100, // Razorpay accepts paise
      currency:"INR",
      receipt: receipt || `rcpt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error("Razorpay Order Error", err);
    res.status(500).json({ error: 'Something went wrong!' });
  }
}

//Verifying the payment done through the razorpay
export const verifyPayment=(req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generatedSignature === razorpay_signature) {
    res.status(200).json({ message: "Payment Successful",show:true });
  } else {
    res.status(400).json({ error: 'Something went wrong!' });
  }
}
