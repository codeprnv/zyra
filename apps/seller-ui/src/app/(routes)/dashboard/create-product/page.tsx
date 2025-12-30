'use client';
import { ChevronRight } from 'lucide-react';
import ColorSelector from 'packages/components/color-selector';
import CustomProperties from 'packages/components/custom-properties';
import CustomSpecifications from 'packages/components/custom-specifications';
import Input from 'packages/components/input';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import ImagePlaceholder from '../../../../shared/components/image-placeholder';

const Page = () => {
  const {
    register,
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [openImageModal, setOpenImageModal] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [images, setImages] = useState<(File | null)[]>([null]);
  const [loading, setLoading] = useState(false);

  const onSubmit = (data: any) => {
    console.log('Data: ', data);
  };

  const handleImageChange = (file: File | null, index: number) => {
    const updatedImages = [...images];

    updatedImages[index] = file;

    if (index === images.length - 1 && images.length < 8) {
      updatedImages.push(null);
    }

    setImages(updatedImages);
    setValue('images', updatedImages);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prevImages) => {
      const updatedImages = [...images];

      if (index === -1) {
        updatedImages[0] = null;
      } else {
        updatedImages.splice(index, 1);
      }

      if (!updatedImages.includes(null) && updatedImages.length < 8) {
        updatedImages.push(null);
      }

      return updatedImages;
    });
    setValue('images', images);
  };

  return (
    <form
      className='mx-auto w-full rounded-lg p-8 text-white shadow-md'
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className='py-2 font-Poppins text-2xl font-semibold text-white'>
        Create Product
      </h2>

      <div className='flex items-center'>
        <span className='cursor-pointer text-[#80Deea]'>Dashboard</span>
        <ChevronRight className='opacity-[0.8]' size={20} />
        <span>Create Product</span>
      </div>

      {/* Content layout */}
      <div className='flex w-full gap-6 py-4'>
        <div className='md:w-[35%]'>
          {images?.length > 0 && (
            <ImagePlaceholder
              setOpenImageModal={setOpenImageModal}
              size='765 x 850'
              small={false}
              index={0}
              onImageChange={handleImageChange}
              onRemove={handleRemoveImage}
            />
          )}
          <div className='mt-4 grid grid-cols-2 gap-3'>
            {images.slice(1).map((_, index) => (
              <ImagePlaceholder
                setOpenImageModal={setOpenImageModal}
                size='765 x 850'
                key={index}
                small={true}
                index={index + 1}
                onImageChange={handleImageChange}
                onRemove={handleRemoveImage}
              />
            ))}
          </div>
        </div>
        <div className='md:w-[65%]'>
          <div className='flex w-full gap-6'>
            {/* Product Title Input */}
            <div className='w-2/4'>
              <Input
                label='Product Title *'
                placeholder='Enter product title'
                {...register('title', {
                  required: 'Title is required!',
                })}
              />
              {errors.title && (
                <p className='mt-1 text-xs text-red-500'>
                  {errors.title.message as string}
                </p>
              )}
              <div className='mt-2'>
                <Input
                  type='textarea'
                  rows={7}
                  cols={10}
                  label='Short Description * (Max 150 words)'
                  placeholder='Enter product description for quick view'
                  {...register('description', {
                    required: 'Description is required!',
                    validate: (value) => {
                      const wordCount = value.trim().split(/\s+/).length;
                      return (
                        wordCount <= 150 ||
                        `Description cannot exceed 150 words (Current: ${wordCount})`
                      );
                    },
                  })}
                />
                {errors.description && (
                  <p className='mt-1 text-xs text-red-500'>
                    {errors.description.message as string}
                  </p>
                )}
              </div>
              <div className='mt-2'>
                <Input
                  label='Tags *'
                  placeholder='apple, flagship'
                  {...register('tags', {
                    required:
                      'Separate related products tags with a comma is required!',
                  })}
                />
                {errors.tags && (
                  <p className='mt-1 text-xs text-red-500'>
                    {errors.tags.message as string}
                  </p>
                )}
              </div>
              <div className='mt-2'>
                <Input
                  label='Warranty *'
                  placeholder='1Year / No Warranty'
                  {...register('warranty', {
                    required: 'Warranty is required!',
                  })}
                />
                {errors.warranty && (
                  <p className='mt-1 text-xs text-red-500'>
                    {errors.warranty.message as string}
                  </p>
                )}
              </div>
              <div className='mt-2'>
                <Input
                  label='Slug *'
                  placeholder='product_slug'
                  {...register('slug', {
                    required: 'Product Slug is required!',
                    pattern: {
                      value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                      message:
                        'Invalid slug format! Use only lowercase letters, numbers and characters',
                    },
                    minLength: {
                      value: 3,
                      message: 'Slug must be at least 3 characters long!',
                    },
                    maxLength: {
                      value: 50,
                      message: 'Slug cannot be longer than 50 characters!',
                    },
                  })}
                />
                {errors.slug && (
                  <p className='mt-1 text-xs text-red-500'>
                    {errors.slug.message as string}
                  </p>
                )}
              </div>
              <div className='mt-2'>
                <Input
                  label='Brand'
                  placeholder='Apple'
                  {...register('brand')}
                />
                {errors.brand && (
                  <p className='mt-1 text-xs text-red-500'>
                    {errors.brand.message as string}
                  </p>
                )}
              </div>
              <div className='mt-2'>
                <ColorSelector control={control} errors={errors} />
              </div>
              <div className='mt-2'>
                <CustomSpecifications control={control} errors={errors} />
              </div>
              <div className='mt-2'>
                <CustomProperties control={control} errors={errors} />
              </div>
              <div className='mt-2'>
                <label className='mb-1 block font-semibold text-gray-300'>
                  Cash on Delivery *
                </label>
                <select
                  {...register('cash_on_delivery', {
                    required: 'Cash on Delivery is required!',
                  })}
                  defaultValue={'yes'}
                  className='w-full border border-gray-700 bg-transparent outline-none'
                >
                  <option value='yes' className='bg-black'>
                    Yes
                  </option>
                  <option value='no' className='bg-black'>
                    No
                  </option>
                </select>
              </div>
            </div>
            <div className="w-2/4">
              <label className="block font-semibold text-gray-300 mb-1">Category *</label>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Page;
