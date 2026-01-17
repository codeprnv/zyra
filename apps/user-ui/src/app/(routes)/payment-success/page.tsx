'use client';
import confetti from 'canvas-confetti';
import { CheckCircle, Truck } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { useStore } from '../../store';

const PaymentSuccessPage = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');
  const router = useRouter();

  useEffect(() => {
    useStore.setState({ cart: [] });

    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
    });
  }, []);
  return (
    <div className='flex min-h-[80vh] items-center justify-center px-4'>
      <div className='max-w-lg rounded-lg border border-gray-200 bg-white shadow-sm'>
        <div className='mb-4 text-green-500'>
          <CheckCircle className='mx-auto h-16 w-16' />
        </div>
        <h2 className='mb-2 text-2xl font-semibold text-gray-800'>
          Payment Successful 🎊
        </h2>
        <p className='mb-6 text-sm text-gray-600'>
          Thank you for your purchase. Your order has been placed successfully!
        </p>

        <button
          onClick={() => router.push(`/profile?active=My+Orders`)}
          className='inline-flex items-center gap-2 bg-blue-600 px-5 py-2 text-white'
        >
          <Truck className='h-4 w-4' /> Track Order
        </button>

        <div className='mt-8 text-xs text-gray-400'>
          Payment Session ID: <span className='font-mono'>{sessionId}</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
