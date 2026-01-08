import { Eye, Heart, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import useDeviceTracking from '../../../hooks/useDeviceTracking';
import useLocationTracking from '../../../hooks/useLocationTracking';
import useUser from '../../../hooks/useUser';
import { useStore } from '../../../store';
import Ratings from '../ratings';
import ProductDetailsCard from './product-details-card';

const ProductCard = ({
  product,
  isEvent,
}: {
  product: any;
  isEvent?: boolean;
}) => {
  const user = useUser();
  const location = useLocationTracking();
  const deviceInfo = useDeviceTracking();
  const [timeLeft, setTimeLeft] = useState('');
  const [open, setOpen] = useState(false);
  const addToCart = useStore((state: any) => state.addToCart);
  const removeFromCart = useStore((state: any) => state.removeFromCart);
  const addToWishlist = useStore((state: any) => state.addToWishlist);
  const removeFromWishlist = useStore((state: any) => state.removeFromWishlist);
  const wishlist = useStore((state: any) => state.wishlist);
  const isWishlisted = wishlist.some((item: any) => item.id === product.id);
  const cart = useStore((state: any) => state.cart);
  const isInCart = cart.some((item: any) => item.id === product.id);

  useEffect(() => {
    console.log('🧪 ProductCard user:', user.user);
    console.log('🧪 ProductCard location:', location);
    console.log('🧪 ProductCard device:', deviceInfo);
  },[])

  useEffect(() => {
    if (isEvent && product?.ending_date) {
      const interval = setInterval(() => {
        const endTime = new Date(product.ending_date).getTime();
        const now = Date.now();
        const diff = endTime - now;

        if (diff <= 0) {
          setTimeLeft('Expired');
          clearInterval(interval);
          return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        setTimeLeft(`${days}d ${hours}h ${minutes}m left with this price`);
      }, 60000);
      return () => clearInterval(interval);
    }
    return;
  }, [isEvent, product?.ending_date]);
  return (
    <div className='relative h-max min-h-[350px] w-full rounded-lg bg-slate-200'>
      {isEvent && (
        <div className='absolute left-2 top-2 rounded-sm bg-red-600 px-2 py-1 text-[10px] font-semibold text-white shadow-md'>
          OFFER
        </div>
      )}
      {product?.stock <= 5 && (
        <div className='absolute right-2 top-2 bg-yellow-400 p-1 text-[10px] font-semibold text-slate-700 shadow-md'>
          Limited Stock
        </div>
      )}
      <Link href={`/product/${product?.slug}`}>
        <Image
          src={
            product?.images[0]?.url ||
            'https://ik.imagekit.io/codeprnv/products/Boult_Drift__2__1200x768.png_VersionId=RSQt26dQKOCH0fdD4dz7gxZ2_uBCQIpm&size=690:388'
          }
          alt={product?.title}
          width={300}
          height={300}
          className='mx-auto h-[250px] w-full rounded-t-md object-cover'
        />
      </Link>
      <Link
        href={`/shop/${product?.shop?.id}`}
        className='my-2 block px-2 text-sm font-medium text-blue-500'
      >
        {product?.shop?.name}
      </Link>
      <Link href={`/product/${product?.slug}`}>
        <h3 className='line-clamp-3 px-2 text-base font-semibold text-gray-800'>
          {product?.title}
        </h3>
      </Link>
      <div className='mt-2 px-2'>
        <Ratings rating={product?.ratings} />
      </div>
      <div className='mt-3 flex items-center justify-between px-2'>
        <div className='flex items-center gap-2'>
          <span className='text-lg font-bold text-gray-900'>
            $ {product?.sale_price}
          </span>
          <span className='text-sm text-gray-400 line-through'>
            $ {product?.regular_price}
          </span>
        </div>
        <span className='text-sm font-medium text-green-500'>
          {product?.totalSales || 0} sold
        </span>
      </div>
      {isEvent && timeLeft && (
        <div className='mt-2'>
          <span className='inline-block bg-orange-100 text-xs text-orange-600'>
            {timeLeft}
          </span>
        </div>
      )}
      <div className='absolute right-3 top-10 z-10 flex flex-col gap-3'>
        <div className='rounded-full bg-white p-[6px] shadow-md'>
          <Heart
            className='cursor-pointer transition hover:scale-110'
            size={22}
            fill={isWishlisted ? 'red' : 'transparent'}
            stroke={isWishlisted ? 'red' : '#4B5563'}
            onClick={() =>
              isWishlisted
                ? removeFromWishlist(
                    product.id,
                    user?.user?.id,
                    location,
                    deviceInfo
                  )
                : addToWishlist(
                    { ...product, quantity: 1 },
                    user?.user?.id,
                    location,
                    deviceInfo
                  )
            }
          />
        </div>
        <div className='rounded-full bg-white p-[6px] shadow-md'>
          <Eye
            className='cursor-pointer text-[#4b5563] transition hover:scale-110'
            size={22}
            onClick={() => setOpen(!open)}
          />
        </div>
        <div className='rounded-full bg-white p-[6px] shadow-md'>
          <ShoppingBag
            stroke={isInCart ? 'green' : 'black'}
            onClick={() =>
              !isInCart
                ? addToCart(
                    { ...product, quantity: 1 },
                    user?.user?.id,
                    location,
                    deviceInfo
                  )
                : removeFromCart(
                    product.id,
                    user?.user?.id,
                    location,
                    deviceInfo
                  )
            }
            className='cursor-pointer text-[#4b5563] transition hover:scale-110'
            size={22}
          />
        </div>
      </div>
      {open && <ProductDetailsCard data={product} setOpen={setOpen} />}
    </div>
  );
};

export default ProductCard;
