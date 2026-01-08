'use client';
import { AlignLeft, ChevronDown, HeartIcon, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { navItems } from '../../../../configs/constants';
import user_profile from '../../../assets/images/user-profile.png';
import useUser from '../../../hooks/useUser';
import { useStore } from '../../../store';

const HeaderBottom = () => {
  const [show, setShow] = useState<boolean>(false);
  const [isSticky, setIsSticky] = useState<boolean>(false);
  const { user, isLoading } = useUser();
  const wishlist = useStore((state: any) => state.wishlist);
  const cart = useStore((state: any) => state.cart);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`w-full transition-all duration-300 ${isSticky ? 'fixed left-0 top-0 z-[100] bg-white shadow-lg' : 'relative'}`}
    >
      <div
        className={`relative m-auto flex w-[80%] items-center justify-between ${isSticky ? 'pt-3' : 'py-0'}`}
      >
        <div
          className={`w-[260px] ${isSticky && '-mb-2'} flex h-[50px] cursor-pointer items-center justify-between bg-[#3489ff] px-5`}
          onClick={() => setShow(!show)}
        >
          <div className='flex items-center gap-2'>
            <AlignLeft color='white' />
            <span className='font-medium text-white'>All Departments</span>
          </div>
          <ChevronDown color='white' />
        </div>
        {/* Dropdown menu */}
        {show && (
          <div
            className={`absolute left-0 ${isSticky ? 'top[70px]' : 'top-[50px]'} h-[400px] w-[260px] bg-[#f5f5f5]`}
          ></div>
        )}

        {/* Navigation Links */}
        <div className='flex items-center'>
          {navItems.map((i: NavItemsTypes, index: number) => (
            <Link
              className='px-5 text-lg font-medium'
              href={i.href}
              key={index}
            >
              {i.title}
            </Link>
          ))}
        </div>
        <div>
          {isSticky && (
            <div className='flex items-center gap-8 py-4'>
              <div className='flex items-center gap-2'>
                {!isLoading && user ? (
                  <>
                    <Link
                      href='/profile'
                      className='flex h-[50px] w-[50px] items-center justify-center rounded-full border-2 border-[#010f1c1a]'
                    >
                      <Image
                        src={user_profile}
                        alt='user-profile-pic'
                        width={36}
                      />
                    </Link>
                    <Link href={'/profile'}>
                      <span className='block font-medium'>Hello, </span>
                      <span className='font-bold'>
                        {user?.name?.split(' ')[0]}
                      </span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href={'/login'}
                      className='flex h-[50px] w-[50px] items-center justify-center rounded-full border-2 border-[#010f1c1a]'
                    >
                      <Image
                        src={user_profile}
                        alt='user-profile-pic'
                        width={36}
                      />
                    </Link>
                    <Link href={'/login'}>
                      <span className='block font-medium'>Hello, </span>
                      <span className='font-bold'>
                        {isLoading ? '...' : 'Sign In'}
                      </span>
                    </Link>
                  </>
                )}
              </div>
              <div className='flex items-center gap-5'>
                <Link href={'/wishlist'} className='relative'>
                  <HeartIcon />
                  <div className='absolute -right-[10px] -top-[10px] flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-red-500'>
                    <span className='text-sm font-medium text-white'>
                      {wishlist?.length || 0}
                    </span>
                  </div>
                </Link>
                <Link href={'/cart'} className='relative'>
                  <ShoppingCart />
                  <div className='absolute -right-[10px] -top-[10px] flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-red-500 p-1'>
                    <span className='text-sm font-medium text-white'>
                      {cart?.length || 0}
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderBottom;
