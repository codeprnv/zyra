/* import {
    PaymentElement,
    useElements,
    useStripe,
} from '@stripe/react-stripe-js';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import React, { useState } from 'react';

const CheckoutForm = ({
  clientSecret,
  cartItems,
  coupon,
  sessionId,
}: {
  clientSecret: string;
  cartItems: any[];
  coupon: any;
  sessionId: string | null;
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'success' | 'failed' | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const total = cartItems.reduce(
    (acc: number, item: any) => acc + item.sale_price * item.quantity
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success?sessionId=${sessionId}`,
      },
    });

    if (result.error) {
      setStatus('failed');
      setErrorMsg(result.error.message || 'Something went wrong!');
    } else {
      setStatus('success');
    }

    setLoading(false);
  };
  return (
    <div className='my-10 flex min-h-[80vh] items-center justify-center px-4'>
      <form
        className='w-full max-w-lg space-y-6 rounded-md bg-white p-8 shadow'
        onSubmit={handleSubmit}
      >
        <h2 className='mb-2 text-center text-3xl font-bold'>
          Secure Payment Checkout
        </h2>

        <div className='space-y-2 rounded-md bg-gray-100 p-4 text-sm text-gray-700'>
          {cartItems.map((item, idx) => (
            <div key={idx} className='flex justify-between pb-1 text-sm'>
              <span>
                {item.quantity} x {item.title}
              </span>
              <span>${(item.quantity * item.sale_price).toFixed(2)} </span>
            </div>
          ))}

          <div className='flex justify-between border-t border-t-gray-100 pt-2 font-semibold'>
            {coupon?.discountAmount !== 0 && (
              <>
                <span>Discount</span>
                <span className='text-green-600'>
                  ${(coupon?.discountAmount).toFixed(2)}
                </span>
              </>
            )}
          </div>

          <div className='mt-2 flex justify-between font-semibold'>
            <span>Total</span>
            <span>${(total - coupon?.discountAmount).toFixed(2)}</span>
          </div>
        </div>
        <PaymentElement />
        <button
          type='submit'
          disabled={!stripe || loading}
          className='mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#010f1c] py-3 text-white transition-colors duration-200 hover:bg-[#0989FF]'
        >
          {loading && <Loader2 className='h-5 w-5 animate-spin' />}
          {loading ? 'Processing...' : 'Pay Now'}
        </button>

        {errorMsg && (
          <div className='flex items-center justify-center gap-2 text-sm text-red-600'>
            <XCircle className='h-5 w-5' />
            {errorMsg}
          </div>
        )}

        {status === 'success' && (
          <div className='flex items-center justify-center gap-2 text-sm text-green-600'>
            <CheckCircle className='h-5 w-5' />
            Payment Successful!
          </div>
        )}

        {status === 'failed' && (
          <div className='flex items-center justify-center gap-2 text-sm text-red-600'>
            <XCircle className='h-5 w-5' />
            Payment Failed. Please try again!
          </div>
        )}
      </form>
    </div>
  );
};

export default CheckoutForm;
 */

import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import React, { useState } from 'react';

interface CheckoutFormProps {
  orderData: {
    orderId: string;
    amount: number;
    currency: string;
  };
  cartItems: any[];
  coupon: any;
  sessionId: string | null;
  onPaymentClick: () => void; // NEW: Triggers Razorpay popup
}

const CheckoutForm = ({
  orderData,
  cartItems,
  coupon,
  sessionId,
  onPaymentClick,
}: CheckoutFormProps) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'success' | 'failed' | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const total = cartItems.reduce(
    (acc: number, item: any) => acc + item.sale_price * item.quantity,
    0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setStatus(null);

    try {
      // Trigger Razorpay Checkout (loaded in parent component)
      onPaymentClick();
    } catch (error) {
      setStatus('failed');
      setErrorMsg('Something went wrong! Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='my-10 flex min-h-[80vh] items-center justify-center px-4'>
      <form
        className='w-full max-w-lg space-y-6 rounded-md bg-white p-8 shadow'
        onSubmit={handleSubmit}
      >
        <h2 className='mb-2 text-center text-3xl font-bold'>
          Secure Payment Checkout
        </h2>

        {/* Order Summary - Updated currency to ₹ */}
        <div className='space-y-2 rounded-md bg-gray-100 p-4 text-sm text-gray-700'>
          {cartItems.map((item, idx) => (
            <div key={idx} className='flex justify-between pb-1 text-sm'>
              <span>
                {item.quantity} x {item.title}
              </span>
              <span>₹{(item.quantity * item.sale_price).toFixed(2)}</span>
            </div>
          ))}

          {coupon?.discountAmount !== 0 && (
            <div className='flex justify-between border-t border-t-gray-100 pt-2'>
              <span>Discount</span>
              <span className='text-green-600'>
                -₹{(coupon?.discountAmount || 0).toFixed(2)}
              </span>
            </div>
          )}

          <div className='mt-2 flex justify-between text-lg font-semibold'>
            <span>Total</span>
            <span>₹{(total - (coupon?.discountAmount || 0)).toFixed(2)}</span>
          </div>

          {/* Razorpay Order Details */}
          <div className='mt-4 rounded-lg bg-blue-50 p-3 text-xs'>
            <div className='flex justify-between'>
              <span>Order ID:</span>
              <span>{orderData.orderId}</span>
            </div>
            <div className='flex justify-between'>
              <span>Amount:</span>
              <span>₹{(orderData.amount / 100).toFixed(2)}</span>
            </div>
            <div className='flex justify-between'>
              <span>Currency:</span>
              <span>{orderData.currency}</span>
            </div>
          </div>
        </div>

        {/* REMOVED: PaymentElement - Razorpay handles this */}

        <button
          type='submit'
          disabled={loading}
          className='mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#010f1c] py-3 text-white transition-colors duration-200 hover:bg-[#0989FF]'
        >
          {loading && <Loader2 className='h-5 w-5 animate-spin' />}
          {loading ? 'Opening Payment...' : 'Pay Now Securely'}
        </button>

        {errorMsg && (
          <div className='flex items-center justify-center gap-2 text-sm text-red-600'>
            <XCircle className='h-5 w-5' />
            {errorMsg}
          </div>
        )}

        {status === 'success' && (
          <div className='flex items-center justify-center gap-2 text-sm text-green-600'>
            <CheckCircle className='h-5 w-5' />
            Payment Successful! Redirecting...
          </div>
        )}

        {status === 'failed' && (
          <div className='flex items-center justify-center gap-2 text-sm text-red-600'>
            <XCircle className='h-5 w-5' />
            Payment Failed. Please try again!
          </div>
        )}
      </form>
    </div>
  );
};

export default CheckoutForm;
