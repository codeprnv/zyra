// Register new user

import { AuthError, ValidationError } from '@packages/error-handler/index.js';
import prisma from '@packages/libs/prisma/index.js';
import bcrypt from 'bcryptjs';
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { setCookie } from 'src/utils/cookies/setCookies.js';
import {
  checkOtpRestrictions,
  handleForgotPassword,
  sendOtp,
  trackOtpRequests,
  validateRegistrationData,
  verifyForgotPasswordOtp,
  verifyOtp,
} from '../utils/auth.helper.js';

// Register new user
export const userRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validateRegistrationData(req.body, 'user');
    const { email, name } = req.body;

    const existingUser = await prisma.users.findUnique({ where: { email } });

    if (existingUser) {
      return next(new ValidationError('User already exists with this email!'));
    }

    await checkOtpRestrictions(email);
    await trackOtpRequests(email);
    await sendOtp(name, email, 'user-activation-mail');

    res.status(200).json({
      message: 'OTP sent to email. Please verify your account.',
    });
  } catch (error) {
    next(error);
  }
};

// Verify user with otp
export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp, name, password } = req.body;
    if (!email || !otp || !name || !password) {
      throw new ValidationError('All fields are required!');
    }

    const existingUser = await prisma.users.findUnique({ where: { email } });

    if (existingUser) {
      throw new ValidationError('User already exists with this email!');
    }

    await verifyOtp(email, otp);
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    await prisma.users.create({
      data: { name, email, password: hashPassword },
    });

    res.status(200).json({
      success: true,
      message: 'User registered successfully!',
    });
  } catch (error) {
    next(error);
  }
};

// Login User
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ValidationError('Email and Password is required!');
    }

    const user = await prisma.users.findUnique({ where: { email } });

    if (!user) throw new AuthError('User does not exists!');

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new AuthError('Invalid email or password!');
    }

    // Generate access token and refresh token

    const accessToken = jwt.sign(
      { id: user.id, role: 'user' },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
      { id: user.id, role: 'user' },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: '7d' }
    );

    setCookie(res, 'refresh_token', refreshToken);
    setCookie(res, 'access_token', accessToken);

    res.status(200).json({
      message: 'Login Successful!',
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    next(error);
  }
};

export const userForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await handleForgotPassword(req, res, next, 'user');
};

export const verifyUserForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await verifyForgotPasswordOtp(req, res, next);
};

export const resetUserPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      throw new ValidationError('Email and New Password is required!');
    }

    const user = await prisma.users.findUnique({ where: { email } });

    if (!user) throw new ValidationError('User not found!');

    // Compare new password with existing password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);

    if (isSamePassword) {
      throw new ValidationError('New password cannot be same as old password!');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await prisma.users.update({
      where: { email },
      data: { password: hashedPassword },
    });

    res.status(200).json({
      message: 'Password resetted successfully!',
    });
  } catch (error) {
    next(error);
  }
};
