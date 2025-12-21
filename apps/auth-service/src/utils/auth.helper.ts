/* eslint-disable @nx/enforce-module-boundaries */
import crypto from 'crypto';
import type { NextFunction } from 'express';
import { ValidationError } from '../../../../packages/error-handler';
import redis from '../../../../packages/libs/redis';
import { sendMail } from './sendMail';

const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export const validateRegistrationData = (
  data: any,
  userType: 'user' | 'seller'
) => {
  const { name, email, password, phone_number, country } = data;

  if (
    !name ||
    !email ||
    !password ||
    (userType === 'seller' && (!phone_number || !country))
  ) {
    return new ValidationError(`Missing required fields!`);
  }

  if (!emailRegex.test(email)) {
    return new ValidationError('Invalid email format!');
  }
};

export const checkOtpRestrictions = async (
  email: string,
  next: NextFunction
) => {
  if (await redis.get(`otp_lock: ${email}`)) {
    return next(
      new ValidationError(
        'Account locked due to multiple failed attempts! Try again after 30 minutes'
      )
    );
  }

  if (await redis.get(`otp_spam_lock: ${email}`)) {
    return next(
      new ValidationError(
        'Too many OTP requests! Please wait 1hour before requesting new OTP'
      )
    );
  }

  if (await redis.get(`otp_cooldown: ${email}`)) {
    return next(
      new ValidationError('Please wait 1min before requesting new OTP!')
    );
  }
};

export const trackOtpRequests = async (email: string, next: NextFunction) => {
  const otpRequestKey = `otp_request_count: ${email}`;
  const otpRequests = parseInt((await redis.get(otpRequestKey)) || '0');

  if (otpRequests >= 2) {
    await redis.set(`otp_spam_lock: ${email}`, 'locked', 'EX', 3600); // Lock for 1hour
    return next(
      new ValidationError(
        'Too many OTP Requests! Please wait 1hour before requesting again.'
      )
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
  await sendMail(email, 'Verify your email', template, { name, otp });
  await redis.set(`otp: ${email}`, otp, 'EX', 300);
  await redis.set(`otp_cooldown: ${email}`, 'true', 'EX', 60);
};
