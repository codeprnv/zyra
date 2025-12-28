import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';
import { shopCategories } from '../../../utils/categories';

type formData = {
  name: string;
  bio: string;
  address: string;
  opening_hours: string;
  website: string;
  email: string;
  password: string;
  phone_number: number;
  category: string;
};

const CreateShop = ({
  sellerId,
  setActiveStep,
}: {
  sellerId: string;
  setActiveStep: (step: number) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formData>();

  const shopCreateMutation = useMutation({
    mutationFn: async (data: formData) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/create-shop`,
        { ...data }
      );
      return response.data;
    },
    onSuccess: () => {
      setActiveStep(3);
    },
  });

  const onSubmit = async (data: any) => {
    const shopData = { ...data, sellerId };
    shopCreateMutation.mutate(shopData);
  };

  const countWords = (text: string) => text.trim().split(/\s+/).length;

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3 className='mb-4 text-center text-2xl font-semibold'>
          Setup new shop
        </h3>
        <label className='mb-1 block text-gray-700'>
          Name <span className='text-red-600'>*</span>
        </label>
        <input
          type='text'
          placeholder='Shop Name'
          className='mb-1 w-full rounded-lg border border-gray-300 p-2 outline-0'
          {...register('name', {
            required: 'Name is required!',
          })}
        />
        {errors.name && (
          <p className='text-sm text-red-500'>{String(errors.name.message)}</p>
        )}
        <label className='mb-1 block text-gray-700'>
          Bio (Max 100 words)<span className='text-red-600'>*</span>
        </label>
        <input
          type='text'
          placeholder='Shop Bio'
          className='mb-1 w-full rounded-lg border border-gray-300 p-2 outline-0'
          {...register('bio', {
            required: 'Shop bio is required!',
            validate: (value) =>
              countWords(value) <= 100 || "Bio can't exceed 100 words",
          })}
        />
        {errors.bio && (
          <p className='text-sm text-red-500'>{String(errors.bio.message)}</p>
        )}
        <label className='mb-1 block text-gray-700'>
          Address <span className='text-red-600'>*</span>
        </label>
        <input
          type='text'
          placeholder='Shop Location'
          className='mb-1 w-full rounded-lg border border-gray-300 p-2 outline-0'
          {...register('address', {
            required: 'Shop Address is required!',
          })}
        />
        {errors.address && (
          <p className='text-sm text-red-500'>
            {String(errors.address.message)}
          </p>
        )}
        <label className='mb-1 block text-gray-700'>
          Opening Hours <span className='text-red-600'>*</span>
        </label>
        <input
          type='text'
          placeholder='e.g., Mon-Fri 9AM - 6PM'
          className='mb-1 w-full rounded-lg border border-gray-300 p-2 outline-0'
          {...register('opening_hours', {
            required: 'Opening hours is required!',
          })}
        />
        {errors.opening_hours && (
          <p className='text-sm text-red-500'>
            {String(errors.opening_hours.message)}
          </p>
        )}
        <label className='mb-1 block text-gray-700'>Website</label>
        <input
          type='url'
          placeholder='https://example.com'
          className='mb-1 w-full rounded-lg border border-gray-300 p-2 outline-0'
          {...register('website', {
            pattern: {
              value:
                /^(https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d{1,5})?(\/[^\s]*)?$/,
              message: 'Enter a valid URL',
            },
          })}
        />
        {errors.website && (
          <p className='text-sm text-red-500'>
            {String(errors.website.message)}
          </p>
        )}

        <label className='mb-1 block text-gray-700'>
          Category <span className='text-red-600'>*</span>
        </label>

        <select
          className='mb-1 w-full rounded-md border border-gray-300 p-2 outline-0'
          {...register('category', {
            required: 'Category is required!',
          })}
        >
          <option value=''>Select a category</option>
          {shopCategories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>

        {errors.category && (
          <p className='text-sm text-red-500'>
            {String(errors.category.message)}
          </p>
        )}

        <button
          type='submit'
          disabled={shopCreateMutation.isPending}
          className='mt-4 w-full cursor-pointer rounded-lg bg-black py-2 text-lg text-white'
        >
          {shopCreateMutation.isPending ? 'Creating...' : 'Create'}
        </button>
      </form>
    </div>
  );
};

export default CreateShop;
