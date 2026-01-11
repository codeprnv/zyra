'use client';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import useDeviceTracking from '../../hooks/useDeviceTracking';
import useLocationTracking from '../../hooks/useLocationTracking';
import useUser from '../../hooks/useUser';
import { useStore } from '../../store';
import axiosInstance from '../../utils/axiosInstance';

const CartPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const location = useLocationTracking();
  const deviceInfo = useDeviceTracking();
  const cart = useStore((state: any) => state.cart);
  const removeFromCart = useStore((state: any) => state.removeFromCart);
  const [loading, setLoading] = useState(false);
  const [discountedProductId, setDiscountedProductId] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState('');

  const decreaseQuantity = (id: string) => {
    useStore.setState((state: any) => ({
      cart: state.cart.map((item: any) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ),
    }));
  };

  const increaseQuantity = (id: string) => {
    useStore.setState((state: any) => ({
      cart: state.cart.map((item: any) =>
        item.id === id ? { ...item, quantity: (item.quantity ?? 1) + 1 } : item
      ),
    }));
  };

  const removeItem = (id: string) => {
    removeFromCart(id, user, location, deviceInfo);
  };

  const subTotal = cart.reduce(
    (total: number, item: any) =>
      total + (item.sale_price ?? item.price) * (item.quantity ?? 1),
    0
  );

  const { data: addresses = [] } = useQuery<any[], Error>({
    queryKey: ['shipping-addresses'],
    queryFn: async () => {
      const res = await axiosInstance.get('/api/shipping-addresses');
      return res.data.addresses;
    },
  });

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddr = addresses.find((addr) => addr.isDefault);
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
      }
    }
  }, [addresses, selectedAddressId]);

  return (
    <div className='w-full bg-white'>
      <div className='mx-auto min-h-screen w-[95%] md:w-[80%]'>
        <div className='pb-[50px]'>
          <h1 className='mb-[16px ] font-Poppins text-[44px] font-medium leading-[1] md:pt-[50px]'>
            Shopping Cart
          </h1>
          <Link href={'/'} className='text-[#55585b] hover:underline'>
            Home
          </Link>
          <span className='mx-1 inline-block rounded-full bg-[#a8acb0] p-[1.5px]'></span>
          <span className='text-[#55585b]'>Cart</span>
        </div>
        {cart.length === 0 ? (
          <div className='text-center text-lg text-gray-600'>
            Your cart is empty! Start adding products
          </div>
        ) : (
          <div className='items-start gap-10 lg:flex'>
            <table className='w-full border-collapse lg:w-[70%]'>
              <thead className='rounded bg-[#f1f3f4]'>
                <tr>
                  <th className='py-3 pl-6 text-left align-middle'>Product</th>
                  <th className='py-3 text-left align-middle'>Price</th>
                  <th className='py-3 text-left align-middle'>Quantity</th>
                  <th className='py-3 text-left align-middle'>Action</th>
                </tr>
              </thead>
              <tbody>
                {cart?.map((item: any) => (
                  <tr key={item.id} className='border-b border-b-black/85'>
                    <td className='flex items-center gap-4 p-4'>
                      <Image
                        src={item?.images[0]?.url}
                        alt={item?.title || 'Image alt'}
                        width={80}
                        height={80}
                        className='rounded'
                      />
                      <div className='flex flex-col'>
                        <span className='font-medium'>{item.title}</span>
                        {item?.selectedOptions && (
                          <div className='text-sm text-gray-500'>
                            {item?.selectedOptions?.color && (
                              <span>
                                Color:{' '}
                                <span
                                  style={{
                                    backgroundColor:
                                      item?.selectedOptions?.color,
                                    width: '12px',
                                    height: '12px',
                                    borderRadius: '100%',
                                    display: 'inline-block',
                                  }}
                                />
                              </span>
                            )}
                            {item?.selectedOptions.size && (
                              <span className='ml-2'>
                                Size: {item?.selectedOptions?.size}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className='px-6 text-center text-lg'>
                      {item?.id === discountedProductId ? (
                        <div className='flex flex-col items-center'>
                          <span className='text-gray-500 line-through'>
                            ${item?.sale_price.toFixed(2) || 0}
                          </span>
                          <span className='font-semibold text-green-600'>
                            $
                            {(
                              (item?.sale_price * (100 - discountPercent)) /
                              100
                            ).toFixed(2)}
                          </span>
                          <span className='bg-gray-200 text-xs text-green-700'>
                            Discount Applied
                          </span>
                        </div>
                      ) : (
                        <span>${item?.sale_price.toFixed(2) || 0}</span>
                      )}
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
                    <td className='text-center'>
                      <button
                        className='cursor-pointer text-[#818487] transition duration-200 hover:text-[#ff1826]'
                        onClick={() => removeItem(item?.id)}
                      >
                        ❌ Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='w-full rounded-lg bg-[#f9f9f9] p-6 shadow-md lg:w-[30%]'>
              {discountAmount > 0 && (
                <div className='flex justify-between pb-1 text-base font-medium text-[#010f1c]'>
                  <span className='font-Poppins'>
                    Discount ({discountPercent}%)
                  </span>
                  <span className='text-green-600'>
                    - ${discountAmount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className='flex items-center justify-between pb-3 text-[20px] font-medium text-[#010f1c]'>
                <span className='font-Poppins'>Subtotal</span>
                <span>${(subTotal - discountAmount).toFixed(2)}</span>
              </div>
              <hr className='my-4 text-slate-200' />
              <div className='mb-4'>
                <h4 className='mb-[7px] text-base font-medium'>
                  Have a coupon?
                </h4>
                <div className='flex'>
                  <input
                    type='text'
                    value={couponCode}
                    onChange={(e: any) => setCouponCode(e.target.value)}
                    placeholder='Enter coupon code'
                    className='w-full rounded-l-md border border-gray-200 p-2 focus:border-blue-500 focus:outline-none'
                  />
                  <button
                    className='cursor-pointer rounded-lg bg-blue-500 px-4 text-white transition-all hover:bg-blue-600'
                    // onClick={() => couponCodeApply()}
                  >
                    Apply
                  </button>
                  {/* {error && (
                    <p className='pt-2 text-sm text-red-500'>{error}</p>
                  )} */}
                </div>
                <hr className='my-4 text-slate-200' />
                <div className='mb-4'>
                  <h4 className='mb-[7px] text-base font-medium'>
                    Select Shipping Address
                  </h4>
                  {addresses.length !== 0 && (
                    <select
                      className='w-full rounded-md border border-gray-200 p-2 focus:border-blue-600 focus:outline-none'
                      value={selectedAddressId}
                      onChange={(e) => setSelectedAddressId(e.target.value)}
                    >
                      {addresses?.map((address: any) => (
                        <option key={address.id} value={address.id}>
                          {address.label} - {address.city}, {address.country}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <hr className='my-4 text-slate-200' />
                <div className='mb-4'>
                  <h4 className='mb-[7px] text-base font-medium'>
                    Select Payment Method
                  </h4>
                  <select className='w-full rounded-md border border-gray-200 p-2 focus:border-blue-600 focus:outline-none'>
                    <option value='credit_card'>Online Payment</option>
                    <option value='cash_on_delivery'>Cash On Delivery</option>
                  </select>
                </div>
                <hr className='my-4 text-slate-200' />
                <div className='flex items-center justify-between pb-3 text-[20px] font-medium text-[#010f1c]'>
                  <span className='font-Poppins'>Total</span>
                  <span>${(subTotal - discountAmount).toFixed(2)}</span>
                </div>
                <button
                  type='button'
                  disabled={loading}
                  className='mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#010f1c] py-3 text-white transition-colors duration-200 hover:bg-[#0989FF]'
                >
                  {loading && <Loader2 className='h-5 w-5 animate-spin' />}
                  {loading ? 'Redirecting...' : 'Proceed to checkout'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
