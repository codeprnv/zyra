'use client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import useDeviceTracking from '../../hooks/useDeviceTracking';
import useLocationTracking from '../../hooks/useLocationTracking';
import useUser from '../../hooks/useUser';
import { useStore } from '../../store';

const WishlistPage = () => {
  const { user } = useUser();
  const location = useLocationTracking();
  const deviceInfo = useDeviceTracking();
  const addToCart = useStore((state: any) => state.addToCart);
  const removeFromWishlist = useStore((state: any) => state.removeFromWishlist);
  const wishlist = useStore((state: any) => state.wishlist);

  const decreaseQuantity = (id: string) => {
    useStore.setState((state: any) => ({
      wishlist: state.wishlist.map((item: any) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ),
    }));
  };

  const removeItem = (id: string) => {
    removeFromWishlist(id, user, location, deviceInfo);
  };

  const increaseQuantity = (id: string) => {
    useStore.setState((state: any) => ({
      wishlist: state.wishlist.map((item: any) =>
        item.id === id ? { ...item, quantity: (item.quantity ?? 1) + 1 } : item
      ),
    }));
  };

  return (
    <div className='w-full bg-white'>
      <div className='mx-auto min-h-screen w-[95%] md:w-[80%]'>
        <div className='pb-[50px]'>
          <h1 className='mb-[16px] font-Poppins text-[44px] font-medium leading-[1] md:pt-[50px]'>
            Wishlist
          </h1>
          <Link href={'/'} className='text-[#55585b] hover:underline'>
            Home
          </Link>
          <span className='mx-1 inline-block rounded-full bg-[#a8acb0] p-[1.5px]'></span>
          <span className='text-[#55585b]'>Wishlist</span>
        </div>
        {wishlist.length === 0 ? (
          <div className='text-center text-lg text-gray-600'>
            Your wishlist is empty! Start adding products
          </div>
        ) : (
          <div className='flex flex-col gap-10'>
            <table className='w-full border-collapse'>
              <thead className='bg-[#f1f3f4]'>
                <tr>
                  <th className='py-3 pl-4 text-left'>Product</th>
                  <th className='py-3 text-left'>Price</th>
                  <th className='py-3 text-left'>Quantity</th>
                  <th className='py-3 text-left'>Action</th>
                  {/* <th className='py-3 text-left'></th> */}
                </tr>
              </thead>
              <tbody>
                {wishlist?.map((item: any) => (
                  <tr key={item.id} className='border-b border-b-black/85'>
                    <td className='flex items-center gap-3 p-4'>
                      <Image
                        src={item.images[0]?.url}
                        alt={item.title}
                        width={80}
                        height={80}
                        className='rounded'
                      />
                      <span>{item.title}</span>
                    </td>
                    <td className='px-6 text-lg'>
                      ${item?.sale_price.toFixed(2)}
                    </td>
                    <td>
                      <div className='flex w-[90px] items-center justify-center rounded-[20px] border border-gray-200 p-[2px]'>
                        <button
                          className='cursor-pointer text-xl text-black'
                          onClick={() => decreaseQuantity(item?.id)}
                        >
                          -
                        </button>
                        <span className='px-4'>{item?.quantity || 0}</span>
                        <button
                          className='cursor-pointer text-xl text-black'
                          onClick={() => increaseQuantity(item?.id)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>
                      <button
                        className='cursor-pointer rounded-md bg-[#2295FF] px-5 py-2 text-white transition-all hover:bg-[#007bff]'
                        onClick={() =>
                          addToCart(item, user, location, deviceInfo)
                        }
                      >
                        Add to Cart
                      </button>
                    </td>{' '}
                    <td>
                      <button
                        className='cursor-pointer text-[#818487] transition duration-200 hover:text-[#ff1826]'
                        onClick={() => removeItem(item.id)}
                      >
                        ❌ Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
