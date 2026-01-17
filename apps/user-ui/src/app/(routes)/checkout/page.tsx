/* 'use client';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, type Appearance } from '@stripe/stripe-js';
import { XCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import CheckoutForm from '../../shared/components/checkout/checkoutForm';
import axiosInstance from '../../utils/axiosInstance';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

const CheckoutPage = () => {
  const [clientSecret, setClientSecret] = useState('');
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [coupon, setCoupon] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const sessionId = searchParams.get('sessionId');

  useEffect(() => {
    const fetchSessionAndClientSecret = async () => {
      if (!sessionId) {
        setError('Invalid session. Please try again!');
        setLoading(false);
        return;
      }
      try {
        const verifyRes = await axiosInstance.get(
          `/order/api/verifying-payment-session?sessionId=${sessionId}`
        );

        const { totalAmount, sellers, cart, coupon } = verifyRes.data.session;

        if (
          !sellers ||
          sellers.length === 0 ||
          totalAmount === undefined ||
          totalAmount === null
        ) {
          throw new Error('Invalid payment session data.');
        }
        setCartItems(cart);
        setCoupon(coupon);
        const sellerStripeAccountId = sellers[0].stripeAccountId;

        const intentRes = await axiosInstance.post(
          `/order/api/create-payment-intent`,
          {
            amount: coupon?.discountAmount
              ? totalAmount - coupon?.discountAmount
              : totalAmount,
            sellerStripeAccountId,
            sessionId,
          }
        );

        setClientSecret(intentRes.data.clientSecret);
      } catch (error) {
        console.error(error);
        setError('Something went wrong while preparing your payment.');
      } finally {
        setLoading(false);
      }
    };

    fetchSessionAndClientSecret();
  }, [sessionId]);

  const appearance: Appearance = {
    theme: 'stripe',
  };

  if (loading) {
    return (
      <div className='flex min-h-[70vh] items-center justify-center'>
        <div className='h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex min-h-[60vh] items-center justify-center px-4'>
        <div className='w-full text-center'>
          <div className='mb-4 flex justify-center'>
            <XCircle className='h-10 w-10 text-red-500' />
          </div>
          <h2 className='mb-2 text-xl font-semibold text-red-600'>
            Payment Failed
          </h2>
          <p className='mb-6 text-sm text-gray-600'>
            {error} <br className='hidden sm:block' /> Please go back and try
            checking out again.
          </p>
          <button
            onClick={() => router.push('/cart')}
            className='cursor-pointer rounded-md bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700'
          >
            Back to cart
          </button>
        </div>
      </div>
    );
  }
  return (
    clientSecret && (
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance,
        }}
      >
        <CheckoutForm
          clientSecret={clientSecret}
          cartItems={cartItems}
          coupon={coupon}
          sessionId={sessionId}
        />
      </Elements>
    )
  );
};

export default CheckoutPage;
 */

'use client';
import { XCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import CheckoutForm from '../../shared/components/checkout/checkoutForm';
import axiosInstance from '../../utils/axiosInstance';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const CheckoutPage = () => {
  const [orderData, setOrderData] = useState<any>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [coupon, setCoupon] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [razorpayInstance, setRazorpayInstance] = useState<any>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const sessionId = searchParams.get('sessionId');

  useEffect(() => {
    const fetchSessionAndOrder = async () => {
      if (!sessionId) {
        setError('Invalid session. Please try again!');
        setLoading(false);
        return;
      }
      try {
        // 1. Verify session (SAME as before)
        const verifyRes = await axiosInstance.get(
          `/order/api/verifying-payment-session?sessionId=${sessionId}`
        );

        const { totalAmount, sellers, cart, coupon } = verifyRes.data.session;

        if (
          !sellers ||
          sellers.length === 0 ||
          totalAmount === undefined ||
          totalAmount === null
        ) {
          throw new Error('Invalid payment session data.');
        }
        setCartItems(cart);
        setCoupon(coupon);

        // 2. CHANGED: Use razorpayAccountId + create Razorpay Order
        const sellerRazorpayAccountId = sellers[0].razorpayAccountId;
        const finalAmount = coupon?.discountAmount
          ? totalAmount - coupon?.discountAmount
          : totalAmount;

        const intentRes = await axiosInstance.post(
          `/order/api/create-payment-intent`,
          {
            amount: finalAmount,
            sellerRazorpayAccountId, // ✅ CHANGED field name
            sessionId,
          }
        );

        setOrderData(intentRes.data); // ✅ orderId instead of clientSecret
      } catch (error) {
        console.error(error);
        setError('Something went wrong while preparing your payment.');
      } finally {
        setLoading(false);
      }
    };

    fetchSessionAndOrder();
  }, [sessionId]);

  // 3. NEW: Load Razorpay Script
  useEffect(() => {
    if (orderData && !razorpayInstance) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        setRazorpayInstance(window.Razorpay);
      };
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [orderData, razorpayInstance]);

  // 4. NEW: Handle Razorpay payment
  const handleRazorpayPayment = () => {
    if (!orderData || !razorpayInstance) return;

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // ✅ NEW env var
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'Zyra', // Your brand name
      description: 'Order Payment',
      order_id: orderData.orderId, // ✅ Replaces clientSecret
      handler: async function (response: any) {
        try {
          // Verify payment on backend (optional)
          await axiosInstance.post('/order/api/verify-payment', {
            orderId: orderData.orderId,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            sessionId,
          });

          // Redirect to success
          router.push(
            `/order-success?sessionId=${sessionId}&paymentId=${response.razorpay_payment_id}`
          );
        } catch (error) {
          console.error('Payment verification failed:', error);
          setError('Payment failed. Please contact support.');
        }
      },
      prefill: {
        name: 'Customer Name', // From session
        email: 'customer@example.com',
        contact: '9999999999',
      },
      theme: {
        color: '#1e40af', // Your brand color
      },
    };

    const rzp = new razorpayInstance(options);
    rzp.open();
  };

  if (loading) {
    return (
      <div className='flex min-h-[70vh] items-center justify-center'>
        <div className='h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex min-h-[60vh] items-center justify-center px-4'>
        <div className='w-full text-center'>
          <div className='mb-4 flex justify-center'>
            <XCircle className='h-10 w-10 text-red-500' />
          </div>
          <h2 className='mb-2 text-xl font-semibold text-red-600'>
            Payment Failed
          </h2>
          <p className='mb-6 text-sm text-gray-600'>
            {error} <br className='hidden sm:block' /> Please go back and try
            checking out again.
          </p>
          <button
            onClick={() => router.push('/cart')}
            className='cursor-pointer rounded-md bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700'
          >
            Back to cart
          </button>
        </div>
      </div>
    );
  }

  return (
    orderData && (
      <div className='min-h-screen bg-gray-50 py-8'>
        {/* Checkout Form UI - pass orderData */}
        <CheckoutForm
          orderData={orderData} // CHANGED prop
          cartItems={cartItems}
          coupon={coupon}
          sessionId={sessionId}
          onPaymentClick={handleRazorpayPayment} // NEW prop
        />
      </div>
    )
  );
};

export default CheckoutPage;
