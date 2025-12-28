/* eslint-disable @typescript-eslint/no-explicit-any */
import { ValidationError } from '@packages/error-handler/index.js';
import prisma from '@packages/libs/prisma/index.js';
import redis from '@packages/libs/redis/index.js';
import crypto from 'crypto';
import type { NextFunction, Request, Response } from 'express';
import { sendMail } from './sendMail/index.js';

const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export const validateRegistrationData = (
  data: any,
  userType: 'user' | 'seller'
) => {
  const { email, name, password, phone_number, country } = data;

  if (
    !name ||
    !email ||
    !password ||
    (userType === 'seller' && (!phone_number || !country))
  ) {
    throw new ValidationError(`Missing required fields!`);
  }

  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format!');
  }
  return true;
};

export const checkOtpRestrictions = async (email: string) => {
  if (await redis.get(`otp_lock:${email}`)) {
    throw new ValidationError(
      'Account locked due to multiple failed attempts! Try again after 30 minutes'
    );
  }

  if (await redis.get(`otp_spam_lock:${email}`)) {
    throw new ValidationError(
      'Too many OTP requests! Please wait 1hour before requesting new OTP'
    );
  }

  if (await redis.get(`otp_cooldown:${email}`)) {
    throw new ValidationError('Please wait 1min before requesting new OTP!');
  }
};

export const trackOtpRequests = async (email: string) => {
  const otpRequestKey = `otp_request_count: ${email}`;
  const otpRequests = parseInt((await redis.get(otpRequestKey)) || '0');

  if (otpRequests >= 2) {
    await redis.set(`otp_spam_lock:${email}`, 'locked', 'EX', 3600); // Lock for 1hour
    throw new ValidationError(
      'Too many OTP Requests! Please wait 1hour before requesting again.'
    );
  }

  await redis.set(otpRequestKey, otpRequests + 1, 'EX', 3600);
};

export const sendOtp = async (
  name: string,
  email: string,
  template: string
) => {
  const otp = crypto.randomInt(1000, 9999).toString();
  // console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  // console.log('📧 SAVING OTP to Redis:');
  // console.log('Email:', email);
  // console.log('OTP:', otp);
  // console.log('Key:', `otp:${email}`);
  // console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // const setResult = await redis.set(`otp:${email}`, otp, 'EX', 300);
  // console.log('SET Result:', setResult);

  // // ✅ Read it back immediately
  // const checkOtp = await redis.get(`otp:${email}`);
  // console.log('Immediate GET:', checkOtp);
  // console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  await redis.set(`otp:${email}`, otp, 'EX', 300);
  await redis.set(`otp_cooldown:${email}`, 'true', 'EX', 60);

  await sendMail(email, 'Zyra: Verify your email', template, { name, otp });
};

export const verifyOtp = async (email: string, otp: string) => {
  const storedOtp = await redis.get(`otp:${email}`);

  // console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  // console.log('🔍 CHECKING OTP from Redis:');
  // console.log('Email:', email);
  // console.log('Key:', `otp:${email}`);
  // console.log('Stored OTP:', storedOtp);
  // console.log('Received OTP:', otp);
  // console.log('Match:', storedOtp === String(otp));
  // console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (!storedOtp) {
    throw new ValidationError('Invalid or expired OTP!');
  }

  const failedAttemptsKey = `otp_attempts:${email}`;

  const failedAttempts = parseInt((await redis.get(failedAttemptsKey)) || '0');

  if (storedOtp !== otp) {
    if (failedAttempts >= 2) {
      await redis.set(`otp_lock:${email}`, 'locked', 'EX', 1800);
      await redis.del(`otp:${email}`, failedAttemptsKey);
      throw new ValidationError(
        'Too many failed attempts. Your account is locked for 30 minutes!'
      );
    }
    await redis.set(failedAttemptsKey, failedAttempts + 1, 'EX', 300);
    throw new ValidationError(
      `Incorrect OTP, ${2 - failedAttempts} attempts left.`
    );
  }

  await redis.del(`otp:${email}`, failedAttemptsKey);
};

export const handleForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
  userType: 'user' | 'seller'
) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new ValidationError('Email is required!');
    }

    // Find user/seller in DB
    const user =
      userType === 'user'
        ? await prisma.users.findUnique({ where: { email } })
        : await prisma.sellers.findUnique({ where: { email } });

    if (!user) {
      throw new ValidationError(`${userType} not found!`);
    }

    await checkOtpRestrictions(email);
    await trackOtpRequests(email);

    // Generate OTP and send email
    await sendOtp(
      user.name,
      email,
      userType === 'user'
        ? 'forgot-password-user-mail'
        : 'forgot-password-seller-mail'
    );

    res.status(200).json({
      message: 'OTP sent to email. Please verify your account.',
    });
  } catch (error) {
    next(error);
  }
};

export const verifyForgotPasswordOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      throw new ValidationError('Email and OTP are required!');
    }

    await verifyOtp(email, otp);

    res.status(200).json({
      message: 'OTP verified. You can now reset your password.',
    });
  } catch (error) {
    next(error);
  }
};
