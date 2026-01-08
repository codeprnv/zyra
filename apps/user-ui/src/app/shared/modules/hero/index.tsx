'use client';
import { MoveRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

const Hero = () => {
  const router = useRouter();
  return (
    <div className='flex h-[85vh] w-full flex-col justify-center bg-[#115061]'>
      <div className='m-auto h-full w-[90%] items-center md:flex md:w-[80%]'>
        <div className='md:w-1/2'>
          <p className='pb-2 font-[Montserrat] text-xl font-normal text-white'>
            Starting from{' '}
            <span className='font-semibold text-yellow-400'>40$</span>
          </p>
          <h1 className='font-[Montserrat] text-6xl font-semibold text-white'>
            The best watch <br />
            Collection 2025
          </h1>
          <p className='pt-4 font-[Poppins] text-3xl text-white'>
            Exclusive offer <span className='text-yellow-400'>10%</span> this
            week
          </p>
          <br />
          <button
            type='button'
            onClick={() => router.push('/products')}
            className='flex h-[40px] w-[140px] items-center justify-center gap-2 rounded-md bg-white font-semibold hover:bg-transparent hover:text-white'
          >
            Shop Now <MoveRight />
          </button>
        </div>
        <div className='flex justify-center md:w-1/2'>
          <Image
            src={
              'https://ik.imagekit.io/codeprnv/products/Boult_Drift__2__1200x768.png_VersionId=RSQt26dQKOCH0fdD4dz7gxZ2_uBCQIpm&size=690:388'
            }
            alt='Hero image'
            width={650}
            height={650}
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
