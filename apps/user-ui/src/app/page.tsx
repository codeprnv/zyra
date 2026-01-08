'use client';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import ProductCard from './shared/components/cards/product-card';
import SectionTitle from './shared/components/section/section-title';
import Hero from './shared/modules/hero';
import axiosInstance from './utils/axiosInstance';

const page = () => {
  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await axiosInstance.get(
        '/product/api/get-all-products?page=1&limit=10'
      );
      return res?.data?.products || [];
    },
    staleTime: 2 * 60 * 1000,
  });

  const { data: latestProducts } = useQuery({
    queryKey: ['latest-products'],
    queryFn: async () => {
      const res = await axiosInstance.get(
        '/product/api/get-all-products?page=1&limit=10&type=latest'
      );
      console.log('Data: ',res.data)
      return res?.data?.products || [];
    },
    staleTime: 2 * 60 * 1000,
  });

  return (
    <div className='bg-[#f5f5f5]'>
      <Hero />
      <div className='m-auto my-10 w-[90%] md:w-[80%]'>
        <div className='mb-8'>
          <SectionTitle title='Suggested Products' />
        </div>
        {isLoading && (
          <div className='grid grid-cols-1 gap-5 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5'>
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className='h-[250px] w-[250px] animate-pulse rounded-xl bg-gray-300'
              />
            ))}
          </div>
        )}
        {!isLoading && !isError && (
          <div className="m-auto grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5">
            {products?.map((product: any) => (
              <ProductCard key={product.id} product={product || latestProducts} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
