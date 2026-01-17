import { isSeller } from '@packages/middlewares/authorizeRoles';
import isAuthenticated from '@packages/middlewares/isAuthenticated';
import express, { type Router } from 'express';
import {
  createPaymentIntent,
  createPaymentSession,
  getOrderDetails,
  getSellerOrders,
  verifyCouponCode,
  verifyingPaymentSession,
} from '../controllers/order.controller';

const router: Router = express.Router();

router.post('/create-payment-intent', isAuthenticated, createPaymentIntent);
router.post('/create-payment-session', isAuthenticated, createPaymentSession);
router.get(
  '/verifying-payment-session',
  isAuthenticated,
  verifyingPaymentSession
);
router.get('/get-seller-orders', isAuthenticated, isSeller, getSellerOrders);
router.get('/get-order-details/:id', isAuthenticated, getOrderDetails);
router.put('/verify-coupon', isAuthenticated, verifyCouponCode);

export default router;
