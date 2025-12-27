'use client';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import GoogleButton from '../../shared/components/google-button';

type formData = {
  name: string;
  email: string;
  password: string;
};

const Signup = () => {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [canResend, setCanResend] = useState<boolean>(true);
  const [timer, setTimer] = useState(60);
  const [showOtp, setShowOtp] = useState<boolean>(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [userData, setUserData] = useState<formData | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formData>();

  const startResendTimer = () => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const signupMutation = useMutation({
    mutationFn: async (data: formData) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/user-registration`,
        {
          ...data,
        }
      );
      return response.data;
    },
    onSuccess: (_, formData) => {
      setUserData(formData);
      setShowOtp(true);
      setCanResend(false);
      setTimer(60);
      startResendTimer();
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        'Invalid credentials!';
      setServerError(errorMessage);
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      if (!userData) return;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/verify-user`,
        {
          ...userData,
          otp: otp.join(''),
        }
      );
      return response.data;
    },
    onSuccess: () => {
      router.push('/login');
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        'Invalid credentials!';
      setServerError(errorMessage);
    },
  });

  const onSubmit = (data: formData) => {
    signupMutation.mutate(data);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const resendOtp = () => {
    if (userData) {
      signupMutation.mutate(userData);
    }
  };

  return (
    <div className='min-h-[85vh] w-full bg-[#f1f1f1] py-10'>
      <h1 className='text-center font-Poppins text-4xl font-semibold text-black'>
        Signup
      </h1>
      <p className='py-3 text-center text-lg font-medium text-[#00000099]'>
        Home • Signup
      </p>
      <div className='flex w-full justify-center'>
        <div className='rounded-lg bg-white p-8 shadow md:w-[480px]'>
          <h3 className='mb-2 text-center text-3xl font-semibold'>
            Signup to Zyra
          </h3>
          <p className='mb-4 text-center text-gray-500'>
            Already have an account? &nbsp;
            <Link href={'/login'} className='text-blue-500'>
              Login
            </Link>
          </p>

          <GoogleButton />
          <div className='my-5 flex items-center text-sm text-gray-400'>
            <div className='flex-1 border-t border-gray-300' />
            <span className='px-3'>or Sign up with Email</span>
            <div className='flex-1 border-t border-gray-300' />
          </div>

          {!showOtp ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <label className='mb-1 block text-gray-700'>Name</label>
              <input
                type='text'
                placeholder='support'
                className='mb-1 w-full rounded-lg border border-gray-300 p-2 outline-0'
                {...register('name', {
                  required: 'Name is required!',
                })}
              />
              {errors.name && (
                <p className='text-sm text-red-500'>
                  {String(errors.name.message)}
                </p>
              )}
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
                  autoComplete='current-password'
                  type={passwordVisible ? 'text' : 'password'}
                  placeholder='Min. 6 characters'
                  className='mb-1 w-full rounded-lg border border-gray-300 p-2 outline-0'
                  {...register('password', {
                    required: 'Password is required!',
                    minLength: {
                      value: 6,
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

              <button
                type='submit'
                disabled={signupMutation.isPending}
                className='mt-4 w-full cursor-pointer rounded-lg bg-black py-2 text-lg text-white'
              >
                {signupMutation.isPending ? 'Signing up...' : 'Signup'}
              </button>

              {serverError && (
                <p className='mt-2 text-sm text-red-500'>
                  {String(serverError)}
                </p>
              )}
            </form>
          ) : (
            <div>
              <h3 className='mb-4 text-center text-xl font-semibold'>
                Enter OTP
              </h3>
              <div className='flex justify-center gap-6'>
                {otp?.map((digit, index) => (
                  <input
                    type='text'
                    key={index}
                    ref={(el) => {
                      if (el) inputRefs.current[index] = el;
                    }}
                    maxLength={1}
                    className='h-12 w-12 rounded-lg border border-gray-300 text-center outline-none'
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  />
                ))}
              </div>
              <button
                disabled={verifyOtpMutation.isPending}
                onClick={() => verifyOtpMutation.mutate()}
                type='button'
                className='mt-4 w-full cursor-pointer rounded-lg bg-blue-500 py-2 text-lg text-white transition-colors duration-200 hover:bg-blue-800'
              >
                {verifyOtpMutation.isPending ? 'Verifying...' : 'Verify OTP'}
              </button>
              <p className='mt-4 text-center text-sm'>
                {canResend ? (
                  <button
                    onClick={resendOtp}
                    className='cursor-pointer text-blue-500'
                  >
                    Resend OTP
                  </button>
                ) : (
                  `Resend OTP in ${timer}s`
                )}
              </p>
              {verifyOtpMutation?.isError &&
                verifyOtpMutation.error instanceof AxiosError && (
                  <p className='mt-2 text-sm text-red-500'>
                    {typeof verifyOtpMutation.error.response?.data ===
                      'object' &&
                    verifyOtpMutation.error.response?.data &&
                    'message' in verifyOtpMutation.error.response.data
                      ? (
                          verifyOtpMutation.error.response.data as {
                            message?: string;
                          }
                        ).message
                      : verifyOtpMutation.error.message}
                  </p>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
