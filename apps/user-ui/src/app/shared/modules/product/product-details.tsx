'use client';
import {
  Heart,
  MapPin,
  MessageSquareText,
  Package,
  ShoppingCart,
  WalletMinimal,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import {
  TransformComponent,
  TransformWrapper,
  useControls,
} from 'react-zoom-pan-pinch';
import useDeviceTracking from '../../../hooks/useDeviceTracking';
import useLocationTracking from '../../../hooks/useLocationTracking';
import useUser from '../../../hooks/useUser';
import { useStore } from '../../../store';
import axiosInstance from '../../../utils/axiosInstance';
import ProductCard from '../../components/cards/product-card';
import ProductDescription from '../../components/product/product-description';
import Ratings from '../../components/ratings';

const Controls = () => {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  return (
    <div className='tools absolute right-4 top-4 z-10 flex gap-2 rounded-lg bg-white/90 p-2 shadow-lg backdrop-blur-sm'>
      <button
        onClick={() => zoomIn()}
        className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white transition-all hover:bg-blue-600'
        title='Zoom In (+)'
      >
        +
      </button>
      <button
        onClick={() => zoomOut()}
        className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-500 text-white transition-all hover:bg-gray-600'
        title='Zoom Out (-)'
      >
        −
      </button>
      <button
        onClick={() => resetTransform()}
        className='flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white transition-all hover:bg-red-600'
        title='Reset (x)'
      >
        ↺
      </button>
      {/* <span className='rounded bg-black/50 px-2 py-1 text-xs text-white'>
        {Math.round(zoomLevel * 100)}%
      </span> */}
    </div>
  );
};

const ProductDetails = ({ productDetails }: { productDetails: any }) => {
  const [currentImage, setCurrentImage] = useState(
    productDetails?.images?.[0]?.url || '/placeholder.jpg'
  );
  const [isSelected, setIsSelected] = useState(
    productDetails?.colors?.[0] || ''
  );
  const [isSizeSelected, setIsSizeSelected] = useState(
    productDetails?.sizes?.[0] || ''
  );
  const [quantity, setQuantity] = useState(1);
  const [priceRange, setPriceRange] = useState([
    productDetails?.sale_price,
    1199,
  ]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  const addToCart = useStore((state: any) => state.addToCart);
  const removeFromCart = useStore((state: any) => state.removeFromCart);
  const addToWishlist = useStore((state: any) => state.addToWishlist);
  const removeFromWishlist = useStore((state: any) => state.removeFromWishlist);
  const wishlist = useStore((state: any) => state.wishlist);
  const isWishlisted = wishlist.some(
    (item: any) => item.id === productDetails.id
  );
  const cart = useStore((state: any) => state.cart);
  const isInCart = cart.some((item: any) => item.id === productDetails.id);
  const user = useUser();
  const location = useLocationTracking();
  const deviceInfo = useDeviceTracking();

  const discountPercentage = Math.round(
    ((productDetails.regular_price - productDetails.sale_price) /
      productDetails.regular_price) *
      100
  );

  const fetchFilteredProducts = async () => {
    try {
      const query = new URLSearchParams();
      query.set("priceRange", priceRange.join(","))
      query.set("page", "1")
      query.set('limit', "5")
      
      const res = await axiosInstance.get(`/product/api/get-filtered-products?${query.toString()}`)

      setRecommendedProducts(res.data.products)
    } catch (error) {
      console.error('Error fetching filtered products: ', error)
    }
  }

  useEffect(() => {
    fetchFilteredProducts()
  },[priceRange])

  return (
    <div className='w-full bg-[#f5f5f5] py-5'>
      <div className='mx-auto grid w-[90%] grid-cols-1 gap-6 overflow-hidden bg-white pt-6 lg:w-[80%] lg:grid-cols-[28%_44%_28%]'>
        {/* Left Column - Thumbnails + Zoomable Image */}
        <div className='space-y-4 p-4'>
          {/* Thumbnails */}
          <div className='flex flex-wrap gap-2'>
            {productDetails?.images?.map((img: any, idx: number) => (
              <div
                key={idx}
                className={`h-20 w-20 cursor-pointer overflow-hidden rounded-lg border-2 ${
                  currentImage === img.url
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
                onClick={() => setCurrentImage(img.url)}
              >
                <Image
                  src={img.url}
                  alt={`Thumbnail ${idx}`}
                  width={80}
                  height={80}
                  className='h-full w-full object-cover transition-transform hover:scale-110'
                />
              </div>
            ))}
          </div>

          {/* Main Zoomable Image */}
          <div className='relative h-96 w-full overflow-hidden rounded-xl bg-gray-100 shadow-lg'>
            <TransformWrapper
              initialScale={1}
              minScale={0.5}
              maxScale={5}
              limitToBounds={true}
              centerOnInit={true}
              doubleClick={{
                disabled: false,
                step: 2,
              }}
              wheel={{
                step: 0.1,
                // modifierKey: false,
              }}
              pinch={{
                step: 100,
              }}
            >
              <TransformComponent
                wrapperClass='w-full h-96'
                contentClass='cursor-grab active:cursor-grabbing'
              >
                <Image
                  src={currentImage}
                  alt={productDetails?.title || 'Product'}
                  width={1200}
                  height={1200}
                  //   sizes='(max-width: 768px) 100vw, 50vw'
                  className='object-contain'
                  priority
                />
              </TransformComponent>
              <Controls />
            </TransformWrapper>
          </div>
        </div>

        {/* Middle column - product details */}
        <div className='p-4'>
          <h1 className='mb-2 text-xl font-medium'>{productDetails?.title}</h1>
          <div className='flex w-full items-center justify-between'>
            <div className='mt-2 flex gap-2 text-yellow-500'>
              <Ratings rating={productDetails?.ratings} />
              <Link href={`#reviews`} className='text-blue-500 hover:underline'>
                0 Reviews
              </Link>
            </div>
            <button
              className='cursor-pointer opacity-[0.7]'
              onClick={() =>
                isWishlisted
                  ? removeFromWishlist(
                      productDetails.id,
                      user?.user?.id,
                      location,
                      deviceInfo
                    )
                  : addToWishlist(
                      {
                        ...productDetails,
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
          <div className='border-b border-gray-200 py-2'>
            <span className='text-gray-500'>
              Brand:{' '}
              <span className='text-blue-500'>
                {productDetails?.brand || 'No brand'}
              </span>
            </span>
          </div>
          <div className='mt-3'>
            <span className='text-3xl font-bold text-orange-500'>
              ${productDetails?.sale_price || 0}
            </span>
            <div className='flex gap-2 border-b border-b-slate-200 pb-2 text-lg'>
              <span className='text-gray-400 line-through'>
                ${productDetails?.regular_price}
              </span>
              <span className='text-gray-500'>-{discountPercentage}%</span>
            </div>
            <div className='mt-2'>
              <div className='mt-4 flex flex-col items-start gap-5 md:flex-row'>
                {/* Color Options */}
                {productDetails?.colors?.length > 0 && (
                  <div className=''>
                    <strong>Color: </strong>
                    <div className='mt-1 flex gap-2'>
                      {productDetails?.colors?.map(
                        (color: string, index: number) => (
                          <button
                            key={index}
                            className={`h-8 w-8 cursor-pointer rounded-full border-2 transition ${isSelected === color ? 'scale-110 border-gray-400 shadow-md' : 'border-transparent'}`}
                            onClick={() => setIsSelected(color)}
                            style={{ backgroundColor: color }}
                          />
                        )
                      )}
                    </div>
                  </div>
                )}
                {productDetails?.sizes?.length > 0 && (
                  <div>
                    <strong>Size: </strong>
                    <div className='mt-1 flex gap-2'>
                      {productDetails?.sizes?.map(
                        (size: string, index: number) => (
                          <button
                            key={index}
                            className={`cursor-pointer rounded-md px-4 py-1 transition ${isSizeSelected === size ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}
                            onClick={() => setIsSizeSelected(size)}
                          >
                            {size}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className='mt-6'>
              <div className='flex items-center gap-3'>
                <div className='flex items-center rounded-md'>
                  <button
                    className='cursor-pointer rounded-l-md bg-gray-300 px-3 py-1 font-semibold text-black hover:bg-gray-400'
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  >
                    -
                  </button>
                  <span className='bg-gray-100 px-4 py-1'>{quantity}</span>
                  <button
                    className='cursor-pointer rounded-r-md bg-gray-300 px-3 py-1 font-semibold text-black hover:bg-gray-400'
                    onClick={() =>
                      setQuantity((prev) =>
                        Math.min(productDetails?.stock || 1, prev + 1)
                      )
                    }
                  >
                    +
                  </button>
                </div>
                {productDetails?.stock > 0 ? (
                  <span className='font-semibold text-green-600'>
                    In Stock{' '}
                    <span className='font-semibold text-gray-500'>
                      (Stock {productDetails?.stock})
                    </span>
                  </span>
                ) : (
                  <span className='font-semibold text-red-600'>
                    Out of stock
                  </span>
                )}
              </div>
              <button
                onClick={() =>
                  isInCart
                    ? removeFromCart(
                        productDetails.id,
                        user?.user?.id,
                        location,
                        deviceInfo
                      )
                    : addToCart(
                        {
                          ...productDetails,
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
                className={`mt-6 flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-white transition-colors duration-200 ${isInCart ? 'bg-[#ff5722] hover:bg-red-700' : 'bg-green-600 hover:bg-green-800'}`}
              >
                <ShoppingCart size={18} />
                {isInCart ? 'Remove from cart' : 'Add to cart'}
              </button>
            </div>
          </div>
        </div>

        {/* Right column - seller information */}
        <div className='-mt-6 bg-[#fafafa]'>
          <div className='mb-1 border-b border-b-gray-100 px-3'>
            <span className='text-sm text-gray-600'>Delivery Options</span>
            <div className='flex items-center gap-1 text-gray-600'>
              <MapPin size={18} className='ml-[-5px]' />
              <span className='text-lg font-normal'>
                {location?.city + ', ' + location?.country}
              </span>
            </div>
          </div>
          <div className='mb-1 border-b border-b-gray-100 px-3 pb-1'>
            <span className='text-sm text-gray-600'>Return & Warranty</span>
            <div className='flex items-center gap-1 text-gray-600'>
              <Package size={18} className='ml[-5px]' />
              <span className='text-base font-normal'>7 Days Returns</span>
            </div>
            <div className='flex items-center gap-1 py-2 text-gray-600'>
              <WalletMinimal size={18} className='ml-[-5px]' />
              <span className='text-base font-normal'>
                Warranty not available
              </span>
            </div>
          </div>
          <div className='px-3 py-1'>
            <div className='w-[85%] rounded-lg'>
              <div className='flex items-center justify-between'>
                <div className=''>
                  <span className='text-sm font-light text-gray-600'>
                    Sold by
                  </span>
                  <span className='block max-w-[150px] truncate text-lg font-medium'>
                    {productDetails?.shop?.name}
                  </span>
                </div>
                <Link
                  href={`#`}
                  className='flex items-center gap-1 text-sm text-blue-500'
                >
                  <MessageSquareText size={18} /> Chat now
                </Link>
              </div>
              {/* Seller performance stats */}
              <div className='mt-3 grid grid-cols-3 gap-2 border-t border-t-gray-200 pt-3'>
                <div>
                  <p className='text-[12px] text-gray-500'>
                    Positive Seller Ratings
                  </p>
                  <p className='text-lg font-semibold'>88%</p>
                </div>
                <div>
                  <p className='text-[12px] text-gray-500'>Ship on time</p>
                  <p className='text-lg font-semibold'>100%</p>
                </div>
                <div>
                  <p className='text-[12px] text-gray-500'>
                    Chat response rate
                  </p>
                  <p className='text-lg font-semibold'>90%</p>
                </div>
              </div>
              <div className='mt-4 border-t border-t-gray-200 pt-2 text-center'>
                <Link
                  href={`/shop/${productDetails?.shop?.id}`}
                  className='text-sm font-medium uppercase text-blue-500 hover:underline'
                >
                  Go to store
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='mx-auto mt-5 w-[90%] lg:w-[80%]'>
        <div className='h-full min-h-[60vh] bg-white p-5'>
          <h3 className='text-lg font-semibold'>
            Product Details of {productDetails?.title}
          </h3>
          <ProductDescription
            productDetails={productDetails }
          />
        </div>
      </div>
      <div className='mx-auto w-[90%] lg:w-[80%]'>
        <div className='mt-5 h-full min-h-[50vh] bg-white pt-5'>
          <h3 className='text-lg font-semibold'>
            Ratings & Reviews of {productDetails?.title}
          </h3>
          <p className='pt-14 text-center'>No reviews available yet</p>
        </div>
      </div>
      <div className='mx-auto w-[90%] lg:w-[80%]'>
        <div className='my-5 h-full w-full p-5'>
          <h3 className='mb-2 text-xl font-semibold'>You may also like</h3>
          <div className='m-auto grid grid-cols-1 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
            {recommendedProducts?.map((i: any) => (
              <ProductCard key={i.id} product={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
