'use client';
import { HeartIcon, Search, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import user_profile from '../../../assets/images/user-profile.png';
import useUser from '../../../hooks/useUser';
import { useStore } from '../../../store';
import HeaderBottom from './header-bottom';

const Header = () => {
  const { user, isLoading } = useUser();
  const wishlist = useStore((state: any) => state.wishlist);
  const cart = useStore((state: any) => state.cart);

  return (
    <div className='w-full bg-white'>
      <div className='m-auto flex w-[80%] items-center justify-between py-5'>
        <div>
          <Link href={'/'}>
            <span className='font-[montserrat] text-4xl font-normal'>Zyra</span>
          </Link>
        </div>
        <div className='relative w-[50%]'>
          <input
            type='text'
            placeholder='Search for products...'
            className='h-[55px] w-full border-[2.5px] border-[#3489FF] px-4 font-[Poppins] font-medium outline-none'
          />
          <div className='absolute right-0 top-0 flex h-[55px] w-[60px] cursor-pointer items-center justify-center bg-[#3489FF]'>
            <Search color='#fff' />
          </div>
        </div>
        <div className='flex items-center gap-8'>
          <div className='flex items-center gap-2'>
            {!isLoading && user ? (
              <>
                <Link
                  href='/profile'
                  className='flex h-[50px] w-[50px] items-center justify-center rounded-full border-2 border-[#010f1c1a]'
                >
                  <Image src={user_profile} alt='user-profile-pic' width={36} />
                </Link>
                <Link href={'/profile'}>
                  <span className='block font-medium'>Hello, </span>
                  <span className='font-bold'>{user?.name?.split(' ')[0]}</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={'/login'}
                  className='flex h-[50px] w-[50px] items-center justify-center rounded-full border-2 border-[#010f1c1a]'
                >
                  <Image src={user_profile} alt='user-profile-pic' width={36} />
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
      </div>
      <div className='border-b border-b-slate-400' />
      <HeaderBottom />
    </div>
  );
};

export default Header;
