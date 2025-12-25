'use client';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import GoogleButton from '../../shared/components/google-button';

type formData = {
  email: string;
  password: string;
};

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formData>();

  const onSubmit = () => {};
  return (
    <div className='min-h-[85vh] w-full bg-[#f1f1f1] py-10'>
      <h1 className='font-Poppins text-center text-4xl font-semibold text-black'>
        Login
      </h1>
      <p className='py-3 text-center text-lg font-medium text-[#00000099]'>
        Home • Login
      </p>
      <div className='flex w-full justify-center'>
        <div className='rounded-lg bg-white p-8 shadow md:w-[480px]'>
          <h3 className='mb-2 text-center text-3xl font-semibold'>
            Login to Zyra
          </h3>
          <p className='mb-4 text-center text-gray-500'>
            Don't have an account? &nbsp;
            <Link href={'/signup'} className='text-blue-500'>
              Sign up
            </Link>
          </p>

          <GoogleButton />
          <div className='my-5 flex items-center text-sm text-gray-400'>
            <div className='flex-1 border-t border-gray-300' />
            <span className='px-3'>or Sign in with Email</span>
            <div className='flex-1 border-t border-gray-300' />
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <label className='mb-1 block text-gray-700'>Email</label>
            <input
              type='email'
              placeholder='support@zyra.com'
              className='mb-1 w-full rounded-lg border border-gray-300 p-2 outline-0'
              {...register('email', {
                required: 'Email is required!',
                pattern: {
                  value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                  message: 'Invalid email address',
                },
              })}
            />
            {errors.email && (
              <p className='text-sm text-red-500'>
                {String(errors.email.message)}
              </p>
            )}

            <label className='mb-1 block text-gray-700'>Password</label>
            <div className='relative'>
              <input
                type={passwordVisible ? 'text' : 'password'}
                placeholder='Min. 6 characters'
                className='mb-1 w-full rounded-lg border border-gray-300 p-2 outline-0'
                {...register('password', {
                  required: 'Password is required!',
                  minLength: {
                    value: 0,
                    message: 'Password must be at least 6 characters!',
                  },
                })}
              />
              <button
                type='button'
                onClick={() => setPasswordVisible(!passwordVisible)}
                className='absolute inset-y-0 right-3 flex items-center text-gray-400'
              >
                {passwordVisible ? <Eye /> : <EyeOff />}
              </button>
            </div>
            {errors.password && (
              <p className='text-sm text-red-500'>
                {String(errors.password.message)}
              </p>
            )}
            <div className='my-4 flex items-center justify-between'>
              <label className='flex items-center text-gray-600'>
                <input
                  type='checkbox'
                  className='mr-2'
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                Remember Me
              </label>
              <Link href={'/forgot-password'} className='text-sm text-blue-500'>
                Forgot Password?
              </Link>
            </div>
            <button
              type='submit'
              className='w-full cursor-pointer rounded-lg bg-black py-2 text-lg text-white'
            >
              Login
            </button>

            {serverError && (
              <p className='text-sm text-red-500 mt-2'>
                {String(serverError)}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
