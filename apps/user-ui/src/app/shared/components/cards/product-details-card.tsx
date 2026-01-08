import { Heart, MapPin, ShoppingCart, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import useDeviceTracking from '../../../hooks/useDeviceTracking';
import useLocationTracking from '../../../hooks/useLocationTracking';
import useUser from '../../../hooks/useUser';
import { useStore } from '../../../store';
import Ratings from '../ratings';

const ProductDetailsCard = ({
  data,
  setOpen,
}: {
  data: any;
  setOpen: (open: boolean) => void;
}) => {
  const [activeImage, setActiveImage] = useState(0);
  const [isSelected, setIsSelected] = useState(data?.colors?.[0] || '');
  const [isSizeSelected, setIsSizeSelected] = useState(data?.sizes?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  const user = useUser();
  const location = useLocationTracking();
  const deviceInfo = useDeviceTracking();
  const [timeLeft, setTimeLeft] = useState('');
  const addToCart = useStore((state: any) => state.addToCart);
  const removeFromCart = useStore((state: any) => state.removeFromCart);
  const addToWishlist = useStore((state: any) => state.addToWishlist);
  const removeFromWishlist = useStore((state: any) => state.removeFromWishlist);
  const wishlist = useStore((state: any) => state.wishlist);
  const isWishlisted = wishlist.some((item: any) => item.id === data?.id);
  const cart = useStore((state: any) => state.cart);
  const isInCart = cart.some((item: any) => item.id === data?.id);

  const router = useRouter();
  return (
    <div className='fixed left-0 top-0 z-50 flex h-screen w-full items-center justify-center bg-[#0000001d]'>
      <div
        className='h-max min-h-[70vh] w-[90%] overflow-scroll rounded-lg bg-white p-4 shadow-md md:mt-14 md:w-[70%] md:p-6 2xl:mt-0'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex w-full flex-col md:flex-row'>
          <div className='h-full w-full md:w-1/2'>
            <Image
              src={data?.images?.[activeImage]?.url}
              alt={data?.images?.[activeImage]?.url}
              width={400}
              height={400}
              className='w-full rounded-lg object-contain'
            />
            <div className='mt-4 flex gap-2'>
              {data?.images?.map((image: any, index: number) => (
                <div
                  className={`cursor-pointer rounded-md border ${activeImage === index ? 'border-gray-500 pt-1' : 'border-transparent'}`}
                  key={index}
                  onClick={() => setActiveImage(index)}
                >
                  <Image
                    src={image?.url}
                    alt={`Thumbnail ${index}`}
                    width={80}
                    height={80}
                    className='rounded-md'
                  />
                </div>
              ))}
            </div>
          </div>
          <div className='mt-6 w-full md:mt-0 md:w-1/2 md:pl-8'>
            <div className='relative flex items-center justify-between border-b border-gray-200 pb-3'>
              <div className='flex items-start gap-3'>
                <Image
                  src={
                    data?.shop?.avatar ||
                    'https://ik.imagekit.io/codeprnv/products/woman-with-long-brown-hair.jpg'
                  }
                  alt='Shop Logo'
                  width={60}
                  height={60}
                  className='h-[60px] w-[60px] rounded-full object-cover'
                />
                <div>
                  <Link
                    href={`/shop/${data?.shop?.id}`}
                    className='text-lg font-medium'
                  >
                    {data?.shop?.name}
                  </Link>
                  <span className='mt-1 block'>
                    <Ratings rating={data?.shop?.ratings} />
                  </span>
                  <p className='mt-1 flex items-center text-gray-600'>
                    <MapPin size={20} />
                    &nbsp;{data?.shop?.address || 'Location not available'}
                  </p>
                </div>
              </div>
              <button
                className='flex cursor-pointer items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-white transition-colors duration-200 hover:scale-110 hover:bg-blue-800'
                onClick={() => router.push(`/inbox?shopId=${data?.shop?.id}`)}
              >
                💬 Chat with seller
              </button>
              <button className='absolute right-[-5px] top-[-5px] my-2 mt-[-10px] flex w-full cursor-pointer justify-end'>
                <X size={25} onClick={() => setOpen(false)} />
              </button>
            </div>
            <h3 className='mt-3 text-xl font-semibold'>{data?.title}</h3>
            <p className='mt-2 w-full whitespace-pre-wrap text-gray-700'>
              {data?.short_description}
            </p>
            {data?.brand && (
              <p className='mt-2'>
                <strong>Brand: </strong> {data.brand}
              </p>
            )}
            <div className='item mt-4 flex flex-col items-start gap-5 md:flex-row'>
              {data?.colors?.length > 0 && (
                <div>
                  <strong>Color: </strong>
                  <div className='mt-1 flex gap-2'>
                    {data?.colors?.map((color: string, index: number) => (
                      <button
                        key={index}
                        className={`h-8 w-8 cursor-pointer rounded-full border-2 transition ${isSelected === color ? 'scale-110 border-gray-400 shadow-md' : 'border-transparent'}`}
                        onClick={() => setIsSelected(color)}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              )}
              {data?.sizes?.length > 0 && (
                <div>
                  <strong>Size: </strong>
                  <div className='mt-1 flex gap-2'>
                    {data?.sizes?.map((size: string, index: number) => (
                      <button
                        key={index}
                        className={`cursor-pointer rounded-md px-4 py-1 transition ${isSizeSelected === size ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}
                        onClick={() => setIsSizeSelected(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className='mt-5 flex items-center gap-4'>
              <h3 className='text-2xl font-semibold text-gray-900'>
                ${data?.sale_price}
              </h3>
              {data?.regular_price && (
                <h3 className='text-lg text-red-600 line-through'>
                  ${data?.regular_price}
                </h3>
              )}
            </div>
            <div className='mt-5 flex items-center gap-5'>
              <div className='flex items-center rounded-md'>
                <button
                  type='button'
                  className='cursor-pointer rounded-l-md bg-gray-300 px-3 py-1 font-semibold text-black hover:bg-gray-400'
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                >
                  -
                </button>
                <span className='bg-gray-100 px-4 py-1'>{quantity}</span>
                <button
                  className='cursor-pointer rounded-r-md bg-gray-300 px-3 py-1 font-semibold text-black hover:bg-gray-400'
                  onClick={() =>
                    setQuantity((prev) => Math.min(data?.stock || 1, prev + 1))
                  }
                >
                  +
                </button>
              </div>
              <button
                onClick={() =>
                  isInCart
                    ? removeFromCart(
                        data.id,
                        user?.user?.id,
                        location,
                        deviceInfo
                      )
                    : addToCart(
                        {
                          ...data,
                          quantity,
                          selectedOptions: {
                            color: isSelected,
                            size: isSizeSelected,
                          },
                        },
                        user?.user?.id,
                        location,
                        deviceInfo
                      )
                }
                className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-white transition-colors duration-200 ${isInCart ? 'bg-[#ff5722] hover:bg-red-700' : 'bg-green-600 hover:bg-green-800'}`}
              >
                <ShoppingCart size={18} />
                {isInCart ? 'Remove from cart' : 'Add to cart'}
              </button>
              <button
                className='cursor-pointer opacity-[0.7]'
                onClick={() =>
                  isWishlisted
                    ? removeFromWishlist(
                        data.id,
                        user?.user?.id,
                        location,
                        deviceInfo
                      )
                    : addToWishlist(
                        {
                          ...data,
                          quantity,
                          selectedOptions: {
                            color: isSelected,
                            size: isSizeSelected,
                          },
                        },
                        user?.user?.id,
                        location,
                        deviceInfo
                      )
                }
              >
                <Heart
                  size={30}
                  fill={isWishlisted ? 'red' : ' transparent'}
                  color={isWishlisted ? 'transparent' : 'black'}
                />
              </button>
            </div>
            <div className='mt-3'>
              {data?.stock > 0 ? (
                <span className='font-semibold text-green-600'>In Stock</span>
              ) : (
                <span className='font-semibold text-red-600'>Out of stock</span>
              )}
            </div>
            <div className='mt-3 text-sm text-gray-600'>
              Estimated Delivery:{' '}
              <strong>{estimatedDelivery.toDateString()}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsCard;
