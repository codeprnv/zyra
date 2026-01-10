'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { categories } from '../../configs/categories';
import { countries } from '../../configs/countries';
import ShopCard from '../../shared/components/cards/shop-card';
import axiosInstance from '../../utils/axiosInstance';

const Page = () => {
  const [isShopLoading, setIsShopLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [shops, setShops] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const router = useRouter();

  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    if (selectedCategories.length > 0) {
      params.set('categories', selectedCategories.join(','));
    }
    if (selectedCountries.length > 0) {
      params.set('countries', selectedCountries.join(','));
    }
    params.set('page', page.toString());
    router.replace(`/shops?${decodeURIComponent(params.toString())}`);
  }, [selectedCategories, setSelectedCountries, page, router]);

  const fetchFilteredShops = useCallback(async () => {
    setIsShopLoading(true);
    try {
      const query = new URLSearchParams();
      if (selectedCategories.length > 0) {
        query.set('categories', selectedCategories.join(','));
      }
      if (selectedCountries.length > 0) {
        query.set('countries', selectedCountries.join(','));
      }

      query.set('page', page.toString());
      query.set('limit', '12');

      const res = await axiosInstance.get(
        `/product/api/get-filtered-shops?${query.toString()}`
      );

      setShops(res.data.shops);
      setTotalPages(res.data.pagination.totalPages);
    } catch (error) {
      console.error('Failed to fetch filtered offers: ', error);
    } finally {
      setIsShopLoading(false);
    }
  }, [selectedCountries, selectedCategories, page]);

  useEffect(() => {
    updateURL();

    const timeoutId = setTimeout(() => {
      fetchFilteredShops();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [updateURL, fetchFilteredShops]);

  const toggleCategory = (label: string) => {
    setSelectedCategories((prev) =>
      prev.includes(label)
        ? prev.filter((category) => category !== label)
        : [...prev, label]
    );
  };

  const toggleCountry = (country: string) => {
    setSelectedCountries((prev) =>
      prev.includes(country)
        ? prev.filter((coun) => coun !== country)
        : [...prev, country]
    );
  };
  return (
    <div className='w-full bg-[#f5f5f5] pb-10'>
      <div className='m-auto w-[90%] lg:w-[80%]'>
        <div className='pb-[50px]'>
          <h1 className='leading-1 mb-[14px] font-Poppins text-[44px] font-medium md:pt-[40px]'>
            All Shops
          </h1>
          <Link href={'/'} className='text-[#55585b] hover:underline'>
            Home
          </Link>
          <span className='mx-1 inline-block rounded-full bg-[#a8acb0] p-[1.5px]' />
          <span className='text-[#55585b]'>All Shops</span>
        </div>
        <div className='flex w-full flex-col gap-8 lg:flex-row'>
          {/* Sidebar */}
          <aside className='w-full space-y-6 rounded bg-white p-4 shadow-md lg:w-[270px]'>
            <h3 className='border-b border-b-slate-300 pb-[4px] font-Poppins text-xl font-medium'>
              Categories
            </h3>
            <ul className='mt-3! space-y-2'>
              {categories?.map((category: any) => (
                <li
                  key={category.label}
                  className='flex items-center justify-between'
                >
                  <label className='flex cursor-pointer select-none items-center gap-3 text-sm font-medium text-gray-700 duration-200 hover:scale-110 hover:text-blue-400 hover:shadow-md'>
                    <input
                      type='checkbox'
                      checked={selectedCategories.includes(category.value)}
                      onChange={() => toggleCategory(category.value)}
                      className='accent-blue-600'
                    />
                    {category.value}
                  </label>
                </li>
              ))}
            </ul>
            <ul className='mt-3! space-y-2'>
              {countries?.map((country: any) => (
                <li
                  key={country.code}
                  className='flex items-center justify-between'
                >
                  <label className='flex cursor-pointer select-none items-center gap-3 text-sm font-medium text-gray-700 duration-200 hover:scale-110 hover:text-blue-400 hover:shadow-md'>
                    <input
                      type='checkbox'
                      checked={selectedCategories.includes(country.name)}
                      onChange={() => toggleCategory(country.name)}
                      className='accent-blue-600'
                    />
                    {country.name}
                  </label>
                </li>
              ))}
            </ul>
          </aside>

          {/* Shop grid */}
          <div className='flex-1 px-2 lg:px-3'>
            {isShopLoading ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5'>
                {Array.from({ length: 10 }).map((_, index) => (
                  <div
                    key={index}
                    className='h-[250px] animate-pulse rounded-xl bg-gray-300'
                  ></div>
                ))}
              </div>
            ) : shops.length > 0 ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5'>
                {shops.map((shop) => (
                  <ShopCard key={shop.id} shop={shop} />
                ))}
              </div>
            ) : (
              <p className='font-medium text-slate-600'> No Shops found!</p>
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
