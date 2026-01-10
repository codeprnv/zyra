'use client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { Range } from 'react-range';
import ProductCard from '../../shared/components/cards/product-card';
import axiosInstance from '../../utils/axiosInstance';

const MIN = 0;
const MAX = 1199;

const colors = [
  { name: 'black', code: '#000000' },
  { name: 'white', code: '#FFFFFF' },
  { name: 'red', code: '#FF0000' },
  { name: 'blue', code: '#0000FF' },
  { name: 'green', code: '#00FF00' },
  { name: 'yellow', code: '#FFFF00' },
  { name: 'orange', code: '#FFA500' },
];

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

const Page = () => {
  const [isProductLoading, setIsProductLoading] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1199]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [tempPriceRange, setTempPriceRange] = useState([0, 1199]);

  const router = useRouter();

  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    params.set('priceRange', priceRange.join(','));
    if (selectedCategories.length > 0) {
      params.set('categories', selectedCategories.join(','));
    }
    if (selectedColors.length > 0) {
      params.set('colors', selectedColors.join(','));
    }
    if (selectedSizes.length > 0) {
      params.set('sizes', selectedSizes.join(','));
    }
    params.set('page', page.toString());
    router.replace(`/products?${decodeURIComponent(params.toString())}`);
  }, [
    priceRange,
    selectedCategories,
    selectedColors,
    selectedSizes,
    page,
    router,
  ]);

  const fetchFilteredProducts = useCallback(async () => {
    setIsProductLoading(true);
    try {
      const query = new URLSearchParams();
      query.set('priceRange', priceRange.join(','));
      if (selectedCategories.length > 0) {
        query.set('categories', selectedCategories.join(','));
      }
      if (selectedColors.length > 0) {
        query.set('colors', selectedColors.join(','));
      }
      if (selectedSizes.length > 0) {
        query.set('sizes', selectedSizes.join(','));
      }
      query.set('page', page.toString());
      query.set('limit', '12');

      const res = await axiosInstance.get(
        `/product/api/get-filtered-products?${query.toString()}`
      );

      setProducts(res.data.products);
      setTotalPages(res.data.pagination.totalPages);
    } catch (error) {
      console.error('Failed to fetch filtered products: ', error);
    } finally {
      setIsProductLoading(false);
    }
  }, [priceRange, selectedCategories, selectedColors, selectedSizes, page]);

  useEffect(() => {
    updateURL();

    const timeoutId = setTimeout(() => {
      fetchFilteredProducts();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [updateURL, fetchFilteredProducts]);

  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await axiosInstance.get('/product/api/get-categories');
      return res.data;
    },
    staleTime: 30 * 60 * 1000,
  });

  const toggleCategory = (label: string) => {
    setSelectedCategories((prev) =>
      prev.includes(label)
        ? prev.filter((category) => category !== label)
        : [...prev, label]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };
  return (
    <div className='w-full bg-[#f5f5f5] pb-10'>
      <div className='m-auto w-[90%] lg:w-[80%]'>
        <div className='pb-[50px]'>
          <h1 className='leading-1 mb-[14px] font-Poppins text-[44px] font-medium md:pt-[40px]'>
            All Products
          </h1>
          <Link href={'/'} className='text-[#55585b] hover:underline'>
            Home
          </Link>
          <span className='mx-1 inline-block rounded-full bg-[#a8acb0] p-[1.5px]' />
          <span className='text-[#55585b]'>All Products</span>
        </div>
        <div className='flex w-full flex-col gap-8 lg:flex-row'>
          {/* Sidebar */}
          <aside className='w-full space-y-6 rounded bg-white p-4 shadow-md lg:w-[270px]'>
            <h3 className='font-Poppins text-xl font-medium'>Price Filter</h3>
            <div className='ml-2'>
              <Range
                step={1}
                min={MIN}
                max={MAX}
                values={tempPriceRange}
                onChange={(values) => setTempPriceRange(values)}
                renderTrack={({ props, children }) => {
                  const [min, max] = tempPriceRange;
                  const percentageLeft = ((min - MIN) / (MAX - MIN)) * 100;
                  const percentageRight = ((max - MIN) / (MAX - MIN)) * 100;

                  return (
                    <div
                      {...props}
                      className='relative h-[6px] rounded bg-blue-200'
                      style={{ ...props.style }}
                    >
                      <div
                        className='absolute h-full rounded bg-blue-600'
                        style={{
                          left: `${percentageLeft}%`,
                          width: `${percentageRight - percentageLeft}%`,
                        }}
                      />{' '}
                      {children}
                    </div>
                  );
                }}
                renderThumb={({ props }) => {
                  const { key, ...rest } = props;
                  return (
                    <div
                      key={key}
                      {...rest}
                      className='h-[16px] w-[16px] rounded-full bg-blue-600 shadow-md'
                    />
                  );
                }}
              />
            </div>
            <div className='mt-2 flex items-center justify-between'>
              <div className='text-sm text-gray-600'>
                ${tempPriceRange[0]} - ${tempPriceRange[1]}
              </div>
              <button
                onClick={() => {
                  setPriceRange(tempPriceRange);
                  setPage(1);
                }}
                className='hvoer:text-white cursor-pointer rounded bg-gray-200 px-4 py-1 text-sm font-semibold shadow-md transition-colors duration-200 hover:bg-blue-600 hover:text-white'
              >
                Apply
              </button>
            </div>

            <h3 className='border-b border-b-slate-300 pb-[4px] font-Poppins text-xl font-medium'>
              Categories
            </h3>
            <ul className='mt-3! space-y-2'>
              {isLoading ? (
                <p className='animate-pulse text-base font-medium text-gray-500'>
                  Loading...
                </p>
              ) : (
                data?.categories?.map((category: any) => (
                  <li
                    key={category}
                    className='flex items-center justify-between'
                  >
                    <label className='flex cursor-pointer select-none items-center gap-3 text-sm font-medium text-gray-700 duration-200 hover:scale-110 hover:text-blue-400 hover:shadow-md'>
                      <input
                        type='checkbox'
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className='accent-blue-600'
                      />
                      {category}
                    </label>
                  </li>
                ))
              )}
            </ul>
            {/* Colors */}
            <h3 className='mt-6 border-b border-b-slate-300 pb-[4px] font-Poppins text-xl font-medium'>
              Filter by Color
            </h3>
            <ul className='mt-3! space-y-2'>
              {isLoading ? (
                <p className='animate-pulse text-base font-medium text-gray-500'>
                  Loading...
                </p>
              ) : (
                colors?.map((color: any) => (
                  <li
                    key={color.code}
                    className='flex items-center justify-between'
                  >
                    <label className='flex cursor-pointer select-none items-center gap-3 text-sm font-medium text-gray-700 duration-200 hover:scale-110 hover:text-blue-400 hover:shadow-md'>
                      <input
                        type='checkbox'
                        checked={selectedColors.includes(color.code)}
                        onChange={() => toggleColor(color.code)}
                        className='accent-blue-600'
                      />
                      <span
                        className='h-[16px] w-[16px] rounded-full border border-gray-200'
                        style={{ backgroundColor: color.code }}
                      ></span>
                      {color.name}
                    </label>
                  </li>
                ))
              )}
            </ul>
            <h3 className='mt-6 border-b border-b-slate-300 pb-[4px] font-Poppins text-xl font-medium'>
              Filter by Sizes
            </h3>
            <ul className='mt-3! space-y-2'>
              {isLoading ? (
                <p className='animate-pulse text-base font-medium text-gray-500'>
                  Loading...
                </p>
              ) : (
                sizes?.map((size: any) => (
                  <li key={size} className='flex items-center justify-between'>
                    <label className='flex cursor-pointer select-none items-center gap-3 text-sm font-medium text-gray-700 duration-200 hover:scale-110 hover:text-blue-400 hover:shadow-md'>
                      <input
                        type='checkbox'
                        checked={selectedSizes.includes(size)}
                        onChange={() => toggleSize(size)}
                        className='accent-blue-600'
                      />

                      <span className='font-medium'>{size}</span>
                    </label>
                  </li>
                ))
              )}
            </ul>
          </aside>

          {/* Product grid */}
          <div className='flex-1 px-2 lg:px-3'>
            {isProductLoading ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5'>
                {Array.from({ length: 10 }).map((_, index) => (
                  <div
                    key={index}
                    className='h-[250px] animate-pulse rounded-xl bg-gray-300'
                  ></div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5'>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <p className='font-medium text-slate-600'> No Products found!</p>
            )}
            {totalPages > 1 && (
              <div className='mt-8 flex justify-center gap-2'>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    className={`rounded border border-gray-200 px-3 py-1 text-sm ${page === i + 1 ? 'bg-blue-200 text-white' : 'bg-white text-black'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
