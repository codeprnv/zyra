'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { ChevronRight, Plus, PlusIcon, Trash, X } from 'lucide-react';
import Link from 'next/link';
import Input from 'packages/components/input';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import DeleteDiscountCodeModal from '../../../../shared/components/modals/delete-discount-codes';
import axiosInstance from '../../../../utils/axiosInstance';

const Page = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<any>();

  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      public_name: '',
      discountType: 'percentage',
      discountValue: '',
      discountCode: '',
    },
  });

  const createDiscountCodeMutation = useMutation({
    mutationFn: async (data) => {
      await axiosInstance.post('/product/api/create-discount-code', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shop-discounts'] });
      reset();
      setShowModal(false);
    },
  });

  const deleteDiscountCodeMutation = useMutation({
    mutationFn: async (discountId) => {
      await axiosInstance.delete(
        `/product/api/delete-discount-code/${discountId}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shop-discounts'] });
     setShowDeleteModal(false)
    },
  });

  const { data: discountCodes = [], isLoading } = useQuery({
    queryKey: ['shop-discounts'],
    queryFn: async () => {
      const res = await axiosInstance.get('/product/api/get-discount-codes');
      return res?.data?.discount_codes || [];
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDeleteClick = async (discount: any) => {
    setSelectedDiscount(discount);
    setShowDeleteModal(true);
  };

  const onSubmit = (data: any) => {
    if (discountCodes.length >= 8) {
      toast.error('You can only create upto 8 discount codes.');
      return;
    }
    createDiscountCodeMutation.mutate(data);
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
          <p className='pt-4 text-center text-gray-400'>
            No discount codes available...
          </p>
        )}
      </div>
      {showModal && (
        <div className='fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50'>
          <div className='w-[450px] rounded-lg bg-gray-800 p-6 shadow-lg'>
            <div className='flex items-center justify-between border-b border-gray-700 pb-3'>
              <h3 className='text-xl text-white'>Create Discount Code</h3>
              <button
                type='button'
                className='text-gray-400 hover:text-white'
                onClick={() => setShowModal(false)}
              >
                <X size={22} />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className='mt-4'>
              {/* Title */}
              <Input
                label='Title (Public Name)'
                {...register('public_name', {
                  required: 'Title is required!',
                })}
              />
              {errors.public_name && (
                <p className='mt-1 text-xs text-red-500'>
                  {errors.public_name.message as string}
                </p>
              )}
              <div className='mt-4'>
                <label className='mb-1 block font-semibold text-gray-300'>
                  Discount Type
                </label>
                <Controller
                  control={control}
                  name='discountType'
                  render={({ field }) => (
                    <select
                      {...field}
                      className='w-full border border-gray-700 bg-transparent text-white outline-none'
                    >
                      <option
                        value='percentage'
                        className='bg-transparent text-black'
                      >
                        Percentage (%)
                      </option>
                      <option
                        value='flat'
                        className='bg-transparent text-black'
                      >
                        Flat Amount ($)
                      </option>
                    </select>
                  )}
                />
              </div>
              <div className='mt-3'>
                <Input
                  label='Discount Value'
                  type='number'
                  min={1}
                  {...register('discountValue', {
                    required: 'Value is required!',
                  })}
                />
              </div>
              <div className='mt-3'>
                <Input
                  label='Discount Code'
                  {...register('discountCode', {
                    required: 'Discount Code is required!',
                  })}
                />
              </div>
              <button
                type='submit'
                className='mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700'
                disabled={createDiscountCodeMutation.isPending}
              >
                <PlusIcon size={18} />
                {createDiscountCodeMutation.isPending
                  ? 'Creating...'
                  : 'Create'}
              </button>
              {createDiscountCodeMutation.isError && (
                <p className='mt-2 text-sm text-red-500'>
                  {(
                    createDiscountCodeMutation.error as AxiosError<{
                      message: string;
                    }>
                  )?.response?.data?.message || 'Something went wrong'}
                </p>
              )}
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && selectedDiscount && (
        <DeleteDiscountCodeModal
          discount={selectedDiscount}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() =>
            deleteDiscountCodeMutation.mutate(selectedDiscount?.id)
          }
        />
      )}
    </div>
  );
};

export default Page;
