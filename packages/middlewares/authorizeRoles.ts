import { AuthError } from '@packages/error-handler/index.js';
import type { NextFunction, Response } from 'express';

export const isSeller = (req: any, res: Response, next:NextFunction) => {
  if (req.role !== 'seller') {
    throw new AuthError('Access denied: Seller Only!');
  }
  next()
};

export const isUser = (req: any, res: Response, next: NextFunction) => {
  if (req.role !== 'user') {
    throw new AuthError('Access denied: User Only!');
  }
  next()
};
