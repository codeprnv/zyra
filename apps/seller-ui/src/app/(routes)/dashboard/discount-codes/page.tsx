'use client';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, Plus, Trash } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import axiosInstance from '../../../../utils/axiosInstance';

const Page = () => {
  const [showModal, setShowModal] = useState(false);

  const { data: discountCodes = [], isLoading } = useQuery({
    queryKey: ['shop-discounts'],
    queryFn: async () => {
      const res = await axiosInstance.get('/product/api/get-discount-codes');
      return res?.data?.discount_codes || [];
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDeleteClick = async (discount: any) => {
    console.log('');
  };

  return (
    <div className='min-h-screen w-full p-8'>
      <div className='mb-1 flex items-center justify-between'>
        <h2 className='text-2xl font-semibold text-white'>Discount Codes</h2>
        <button
          className='flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} />
          Create Discount
        </button>
      </div>
      <div className='flex items-center text-white'>
        <Link href={'/dashboard'} className='cursor-pointer text-[#80Deea]'>
          Dashboard
        </Link>
        <ChevronRight className='opacity-[0.8]' size={20} />
        <span>Discount Codes</span>
      </div>
      <div className='mt-8 rounded-lg bg-gray-900 p-6 shadow-lg'>
        <h3 className='mb-4 text-lg font-semibold text-white'>
          Your Discount Codes
        </h3>
        {isLoading ? (
          <p className='text-center text-gray-400'>Loading discounts...</p>
        ) : (
          <table className='w-full text-white'>
            <thead>
              <tr className='border-b border-gray-800'>
                <th className='p-3 text-left'>Title</th>
                <th className='p-3 text-left'>Type</th>
                <th className='p-3 text-left'>Value</th>
                <th className='p-3 text-left'>Code</th>
                <th className='p-3 text-left'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {discountCodes?.map((discount: any) => (
                <tr
                  key={discount?.id}
                  className='border-b border-gray-800 transition hover:bg-gray-800'
                >
                  <td className='p-3'>{discount?.public_name}</td>
                  <td className='p-3 capitalize'>
                    {discount.discountType === 'percentage'
                      ? 'Percentage (%)'
                      : 'Flat ($)'}
                  </td>
                  <td className='p-3'>
                    {discount.discountType === 'percentage'
                      ? `${discount.discountValue}%`
                      : `$${discount.discountValue}`}
                  </td>
                  <td className='p-3'>{discount.discountCode}</td>
                  <td className='p-3'>
                    <button
                      type='button'
                      onClick={() => handleDeleteClick(discount)}
                      className='text-red-400 transition hover:text-red-300'
                    >
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!isLoading && discountCodes?.length === 0 && (
          <p className='text-center text-gray-400 pt-4'>
            No discount codes available...
          </p>
        )}
      </div>
    </div>
  );
};

export default Page;
