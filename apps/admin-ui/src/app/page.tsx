'use client';
import { useMutation } from '@tanstack/react-query';
import axios, { type AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import Input from 'packages/components/input';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

type FormData = {
  email: string;
  password: string;
};

const Page = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const { register, handleSubmit } = useForm<FormData>();
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/login-admin`,
        {
          ...data,
        },
        {
          withCredentials: true,
        }
      );
      return response.data;
    },
    onSuccess: () => {
      setServerError(null);
      router.push('/dashboard');
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        'Invalid credentials!';
      setServerError(errorMessage);
    },
  });

  const onSubmit = (data: FormData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className='flex h-screen w-full items-center justify-center'>
      <div className='rounded-md bg-slate-800 pb-8 shadow md:w-[450px]'>
        <form className='p-5' onSubmit={handleSubmit(onSubmit)}>
          <h1 className='pb-3 pt-4 text-center font-[Poppins] text-3xl font-semibold text-white'>
            Welcome Admin
          </h1>
          <Input
            label='Email'
            placeholder='support@zyra.com'
            {...register('email', {
              required: 'Email is required!',
              pattern: {
                value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                message: 'Invalid email address',
              },
            })}
          />
          <div className='mt-3'>
            <Input
              label='Password'
              type='password'
              placeholder='******'
              {...register('password', {
                required: 'Password is required!',
              })}
            />
          </div>
          <button
            disabled={loginMutation.isPending}
            type='submit'
            className='font-Poppins mt-5 flex w-full cursor-pointer justify-center rounded-lg bg-blue-600 py-2 text-xl font-semibold text-white'
          >
            {loginMutation.isPending ? (
              <div className='h-6 w-6 animate-spin rounded-full border-2 border-gray-100 border-t-transparent' />
            ) : (
              <div>Login</div>
            )}
          </button>

          {serverError && (
            <p className='mt-2 text-sm text-red-500'>{serverError}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Page;
