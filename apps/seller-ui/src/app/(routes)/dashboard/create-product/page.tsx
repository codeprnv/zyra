'use client';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, Wand, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ColorSelector from 'packages/components/color-selector';
import CustomProperties from 'packages/components/custom-properties';
import CustomSpecifications from 'packages/components/custom-specifications';
import Input from 'packages/components/input';
import RichTextEditor from 'packages/components/rich-text-editor';
import SizeSelector from 'packages/components/size-selector';
import React, { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import ImagePlaceholder from '../../../../shared/components/image-placeholder';
import { enhancements } from '../../../../utils/ai-enhancements';
import axiosInstance from '../../../../utils/axiosInstance';

interface UploadedImage {
  fileId: string;
  file_url: string;
}

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
  const [images, setImages] = useState<(UploadedImage | null)[]>([null]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [pictureUploadingLoader, setPictureUploadingLoader] = useState(false);
  const [activeEffect, setActiveEffect] = useState<string | null>('');
  const [processing, setProcessing] = useState(false);

  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get('/product/api/get-categories');
        return res.data;
      } catch (error) {
        console.error('Error fetching products: ', error);
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const { data: discountCodes = [], isLoading: discountLoading } = useQuery({
    queryKey: ['shop-discounts'],
    queryFn: async () => {
      const res = await axiosInstance.get('/product/api/get-discount-codes');
      return res?.data?.discount_codes || [];
    },
  });

  const categories = data?.categories || [];
  const subCategoriesData = data?.subCategories || [];

  const selectedCategory = watch('category');
  const regularPrice = watch('regular_price');

  const subCategories = useMemo(() => {
    return selectedCategory ? subCategoriesData[selectedCategory] || [] : [];
  }, [selectedCategory, subCategoriesData]);

  // console.log(
  //   'Categories: ',
  //   categories,
  //   '\nSubcategories: ',
  //   subCategoriesData
  // );

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      await axiosInstance.post('/product/api/create-product', data);
      router.push('/dashboard/all-products');
    } catch (error: any) {
      toast.error(error?.data?.message);
      console.error('Error creating the product: ', error);
    } finally {
      setLoading(false);
    }
  };

  const convertFileToBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
    });
  };

  const handleImageChange = async (file: File | null, index: number) => {
    if (!file) return;
    setPictureUploadingLoader(true);
    try {
      const fileName = await convertFileToBase64(file);
      const response = await axiosInstance.post(
        `/product/api/upload-product-image`,
        { fileName }
      );
      const updatedImages = [...images];
      const uploadedImage: UploadedImage = {
        fileId: response.data.fileId,
        file_url: response.data.file_url,
      };
      updatedImages[index] = uploadedImage;

      if (index === images.length - 1 && updatedImages.length < 8) {
        updatedImages.push(null);
      }
      setImages(updatedImages);
      setValue('images', updatedImages);
    } catch (error) {
      console.error('Error creating base64 of image: ', error);
    } finally {
      setPictureUploadingLoader(false);
    }
  };

  const handleRemoveImage = async (index: number) => {
    try {
      const updatedImages = [...images];
      const imageToDelete = updatedImages[index];

      if (imageToDelete && typeof imageToDelete === 'object') {
        // delete the picture
        await axiosInstance.delete(`/product/api/delete-product-image`, {
          data: {
            fileId: imageToDelete.fileId,
          },
        });
      }
      updatedImages.splice(index, 1);

      // Add null placeholder
      if (!updatedImages.includes(null) && updatedImages.length < 8) {
        updatedImages.push(null);
      }
      setImages(updatedImages);
      setValue('images', updatedImages);
    } catch (error) {
      console.error('Error in deleting the image: ', error);
    }
  };

  const handleSaveDraft = () => {
    console.log('');
  };

  const applyTransformation = async (transformation: string) => {
    if (!selectedImage || processing) return;
    setProcessing(true);
    setActiveEffect(transformation);

    try {
      const transformedUrl = `${selectedImage}?tr=${transformation}`;
      setSelectedImage(transformedUrl);
    } catch (error) {
      console.error('Error in apply transformations: ', error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form
      className='mx-auto w-full rounded-lg p-8 text-white shadow-md'
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className='py-2 font-Poppins text-2xl font-semibold text-white'>
        Create Product
      </h2>

      <div className='flex items-center text-white'>
        <Link href='/dashboard' className='cursor-pointer text-[#80Deea]'>
          Dashboard
        </Link>
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
              setSelectedImage={setSelectedImage}
              images={images}
              pictureUploadingLoader={pictureUploadingLoader}
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
                setSelectedImage={setSelectedImage}
                pictureUploadingLoader={pictureUploadingLoader}
                images={images}
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
                  {...register('short_description', {
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
                        'Invalid slug format! Use only lowercase letters, numbers and hyphens',
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
            <div className='w-2/4'>
              <label className='mb-1 block font-semibold text-gray-300'>
                Category *
              </label>
              {isLoading ? (
                <p className='text-gray-400'>Loading Categories...</p>
              ) : isError ? (
                <p className='text-red-500'>Failed to load categories</p>
              ) : (
                <Controller
                  name='category'
                  control={control}
                  rules={{ required: 'Category is required!' }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className='w-full border border-gray-700 bg-transparent outline-none'
                    >
                      <option value={''} className='bg-black'>
                        Select Category
                      </option>
                      {categories?.map((category: string) => (
                        <option
                          key={category}
                          value={category}
                          className='bg-black'
                        >
                          {category}
                        </option>
                      ))}
                    </select>
                  )}
                />
              )}
              {errors.category && (
                <p className='mt-1 text-xs text-red-500'>
                  {errors.category.message as string}
                </p>
              )}
              <div className='mt-2'>
                <label className='mb-1 block font-semibold text-gray-300'>
                  Subcategory *
                </label>
                {isLoading ? (
                  <p className='text-gray-400'>Loading SubCategories...</p>
                ) : isError ? (
                  <p className='text-red-500'>Failed to load subcategories</p>
                ) : (
                  <Controller
                    name='subCategory'
                    control={control}
                    rules={{ required: 'SubCategory is required!' }}
                    render={({ field }) => (
                      <select
                        {...field}
                        className='w-full border border-gray-700 bg-transparent outline-none'
                      >
                        <option value={''} className='bg-black'>
                          Select Subcategory
                        </option>
                        {subCategories?.map((subcategory: string) => (
                          <option
                            key={subcategory}
                            value={subcategory}
                            className='bg-black'
                          >
                            {subcategory}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                )}
                {errors.subcategory && (
                  <p className='mt-1 text-xs text-red-500'>
                    {errors.subcategory.message as string}
                  </p>
                )}
              </div>
              <div className='mt-2'>
                <label className='mb-1 block font-semibold text-gray-300'>
                  Detailed Description * (Min 100 words)
                </label>
                <Controller
                  name='detailed_description'
                  control={control}
                  rules={{
                    required: 'Detailed Description is required!',
                    validate: (value) => {
                      // Create a temporary DOM element to decode HTML entities and strip tags
                      const div = document.createElement('div');
                      div.innerHTML = value || '';

                      // Get decoded plain text (converts &nbsp; to actual spaces)
                      const plainText = (
                        div.textContent ||
                        div.innerText ||
                        ''
                      ).trim();

                      // Count words
                      const wordCount = plainText
                        .split(/\s+/)
                        .filter((word: string) => word.length > 0).length;

                      return (
                        wordCount >= 100 ||
                        'Description must be at least 100 words!'
                      );
                    },
                  }}
                  render={({ field }) => (
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />

                {errors.detailed_description && (
                  <p className='mt-1 text-xs text-red-500'>
                    {errors.detailed_description.message as string}
                  </p>
                )}
              </div>
              <div className='mt-2'>
                <Input
                  label='Video URL'
                  placeholder='https://www.youtube.com/embed/xyz123'
                  {...register('video_url', {
                    pattern: {
                      value: /^https?:\/\/(www\.)?youtube\.com\/embed\/[\w-]+$/,
                      message:
                        'Invalid YouTube embed URL! Use format: https://www.youtube.com/embed/xyz123',
                    },
                  })}
                />
                {errors.video_url && (
                  <p className='mt-1 text-xs text-red-500'>
                    {errors.video_url.message as string}
                  </p>
                )}
              </div>
              <div className='mt-2'>
                <Input
                  label='Regular Price'
                  placeholder='20$'
                  {...register('regular_price', {
                    valueAsNumber: true,
                    min: {
                      value: 1,
                      message: 'Price must be at least 1',
                    },
                    validate: (value) =>
                      !isNaN(value) || 'Only numbers are allowed!',
                  })}
                />
                {errors.regular_price && (
                  <p className='mt-1 text-xs text-red-500'>
                    {errors.regular_price.message as string}
                  </p>
                )}
              </div>
              <div className='mt-2'>
                <Input
                  label='Sale Price'
                  placeholder='15$'
                  {...register('sale_price', {
                    required: 'Sale price is required!',
                    valueAsNumber: true,
                    min: {
                      value: 1,
                      message: 'Sale Price must be at least 1',
                    },
                    validate: (value) => {
                      if (isNaN(value)) return 'Only numbers are allowed!';
                      if (regularPrice && value >= regularPrice) {
                        return 'Sale price must be less than Regulare price';
                      }
                      return true;
                    },
                  })}
                />
                {errors.sale_price && (
                  <p className='mt-1 text-xs text-red-500'>
                    {errors.sale_price.message as string}
                  </p>
                )}
              </div>
              <div className='mt-2'>
                <Input
                  type='number'
                  label='Stock *'
                  placeholder='100'
                  {...register('stock', {
                    required: 'Stock is required!',
                    valueAsNumber: true,
                    min: {
                      value: 1,
                      message: 'Stock must be at least 1',
                    },
                    max: {
                      value: 1000,
                      message: 'Stock cannot exceed 1000',
                    },
                    validate: (value) => {
                      if (isNaN(value)) return 'Only numbers are allowed!';
                      if (!Number.isInteger(value)) {
                        return 'Stock must be a whole number';
                      }
                      return true;
                    },
                  })}
                />
                {errors.stock && (
                  <p className='mt-1 text-xs text-red-500'>
                    {errors.stock.message as string}
                  </p>
                )}
              </div>
              <div className='mt-2'>
                <SizeSelector control={control} errors={errors} />
              </div>
              <div className='mt-3'>
                <label className='mb-1 block font-semibold text-gray-300'>
                  Select Discount Codes (optional)
                </label>
                {discountLoading ? (
                  <p className='text-gray-400'>Loading discount codes...</p>
                ) : (
                  <div className='flex flex-wrap gap-2'>
                    {discountCodes?.map((code: any) => (
                      <button
                        key={code}
                        type='button'
                        className={`rounded-md border px-3 py-1 text-sm font-semibold ${watch('discountCodes')?.includes(code.id) ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-600 bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                        onClick={() => {
                          const currentSelection = watch('discountCodes') || [];
                          const updatedSelection = currentSelection?.includes(
                            code.id
                          )
                            ? currentSelection.filter(
                                (id: string) => id !== code.id
                              )
                            : [...currentSelection, code.id];
                          setValue('discountCodes', updatedSelection);
                        }}
                      >
                        {code?.public_name} ({code?.discountValue})
                        {code.discountType === 'percentage' ? '%' : '$'}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {openImageModal && (
        <div className='fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-60'>
          <div className='w-[450px] rounded-lg bg-gray-800 p-6 text-white'>
            <div className='mb-4 flex items-center justify-between pb-3'>
              <h2 className='text-lg font-semibold'>Enhance Product Image</h2>
              <X
                size={20}
                className='cursor-pointer'
                onClick={() => setOpenImageModal(!openImageModal)}
              />
            </div>
            <div className='relative h-[250px] w-full overflow-hidden rounded-md border border-gray-600'>
              <Image
                src={selectedImage}
                alt='product-image'
                layout='fill'
                objectFit='contain'
                unoptimized
                // width={250}
                // height={250}
              />
            </div>
            {selectedImage && (
              <div className='mt-4 space-y-2'>
                <h3 className='text-sm font-semibold text-white'>
                  AI Enhancements
                </h3>
                <div className='grid max-h-[250px] grid-cols-2 gap-2 overflow-auto'>
                  {enhancements?.map(({ label, effect }) => (
                    <button
                      key={effect}
                      className={`flex items-center gap-2 rounded-md p-2 ${activeEffect === effect ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                      onClick={() => applyTransformation(effect)}
                      disabled={processing}
                    >
                      <Wand size={18} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <div className='mt-6 flex justify-end gap-3'>
        {isChanged && (
          <button
            type='button'
            onClick={handleSaveDraft}
            className='rounded-md bg-gray-700 px-4 py-2 text-white'
          >
            Save Draft
          </button>
        )}
        <button
          type='submit'
          className='rounded-md bg-blue-600 px-4 py-2 text-white'
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create'}
        </button>
      </div>
    </form>
  );
};

export default Page;
