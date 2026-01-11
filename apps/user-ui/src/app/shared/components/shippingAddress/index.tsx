'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MapPin, Plus, Trash2, X } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { countries } from '../../../configs/countries';
import axiosInstance from '../../../utils/axiosInstance';

const ShippingAddressSection = () => {
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      label: 'Home',
      name: '',
      street: '',
      city: '',
      zip: '',
      country: 'India',
      isDefault: 'false',
    },
  });

  const { mutate: addAddress } = useMutation({
    mutationFn: async (payload: any) => {
      const res = await axiosInstance.post('/api/add-address', payload);
      return res.data.address;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping-addresses'] });
      reset();
      setShowModal(false);
    },
  });

  const { data: addresses, isLoading } = useQuery({
    queryKey: ['shipping-addresses'],
    queryFn: async () => {
      const res = await axiosInstance.get('/api/shipping-addresses');
      return res.data.addresses;
    },
  });

  const onSubmit = async (data: any) => {
    addAddress({
      ...data,
      // country: data?.country?.name || "India",
      isDefault: data?.isDefault === 'true',
    });
  };

  const { mutate: deleteAddress } = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/api/delete-address/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping-addresses'] });
    },
  });
  return (
    <div className='space-y-4'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold text-gray-800'>Saved Address</h2>
        <button
          className='flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline'
          onClick={() => setShowModal(true)}
        >
          <Plus className='h-4 w-4' /> Add new address
        </button>
      </div>

      {/* Address list */}
      {isLoading ? (
        <p className='text-sm text-gray-600'>Loading Addresses...</p>
      ) : !addresses || addresses.length === 0 ? (
        <p className='text-sm text-gray-600'>No saved addresses found.</p>
      ) : (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          {addresses.map((address: any) => (
            <div
              key={address.id}
              className='relative rounded-md border border-gray-200 p-4'
            >
              {address.isDefault && (
                <span className='absolute right-2 top-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-600'>
                  Default
                </span>
              )}
              <div className='flex items-start gap-2 text-sm text-gray-700'>
                <MapPin className='mt-0.5 h-5 w-5 text-gray-500' />
                <div>
                  <p className='font-medium'>
                    {address.label} - {address.name}
                  </p>
                  <p>
                    {address.street}, {address.city}, {address.zip},{' '}
                    {address.country}
                  </p>
                </div>
              </div>
              <div className='mt-4 flex gap-3'>
                <button
                  className='flex cursor-pointer items-center gap-1 rounded p-2 text-xs text-red-500 transition-colors duration-200 hover:bg-red-600 hover:text-white'
                  onClick={() => deleteAddress(address.id)}
                >
                  <Trash2 className='h-4 w-4' /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30'>
          <div className='relative w-full max-w-md rounded-md bg-white p-6 shadow-md'>
            <button
              className='absolute right-3 top-3 text-gray-500 hover:text-gray-800'
              onClick={() => setShowModal(false)}
            >
              <X className='h-5 w-5' />
            </button>
            <h3 className='mb-4 text-lg font-semibold text-gray-800'>
              Add New Address
            </h3>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className='flex flex-col gap-2 space-y-3'
            >
              <select {...register('label')} className='form-input'>
                <option value='Home'>Home</option>
                <option value='Work'>Work</option>
                <option value='Other'>Other</option>
              </select>
              <input
                type='text'
                placeholder='Name'
                {...register('name', {
                  required: 'Name is required',
                })}
                className='form-input'
              />
              {errors.name && (
                <p className='text-xs text-red-500'>{errors.name.message}</p>
              )}{' '}
              <input
                type='text'
                placeholder='Street'
                {...register('street', {
                  required: 'Street is required',
                })}
                className='form-input'
              />
              {errors.street && (
                <p className='text-xs text-red-500'>{errors.street.message}</p>
              )}
              <input
                type='text'
                placeholder='City'
                {...register('city', {
                  required: 'City is required',
                })}
                className='form-input'
              />
              {errors.city && (
                <p className='text-xs text-red-500'>{errors.city.message}</p>
              )}
              <input
                type='text'
                placeholder='Zip Code'
                {...register('zip', {
                  required: 'Zip Code is required',
                })}
                className='form-input'
              />
              <select {...register('country')} className='form-input'>
                <option value='' selected={true}>
                  All Countries
                </option>
                {countries.map((country) => (
                  <option value={country.name} key={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
              <select {...register('isDefault')} className='form-input'>
                <option value='' selected>
                  Is Default Address?
                </option>
                <option value='true'>Set as Default</option>
                <option value='false'>Not Default</option>
              </select>
              <button
                type='submit'
                className='rounded-md bg-blue-500 py-2 text-sm text-white transition-colors duration-200 hover:cursor-pointer hover:bg-blue-700'
              >
                Save Address
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingAddressSection;
