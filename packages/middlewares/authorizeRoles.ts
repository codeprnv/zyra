import { AuthError } from '@packages/error-handler/index.js';
import type { Response } from 'express';

export const isSeller = (req: any, res: Response) => {
  if (req.role !== 'seller') {
    throw new AuthError('Access denied: Seller Only!');
  }
};

export const isUser = (req: any, res: Response) => {
  if (req.role !== 'user') {
    throw new AuthError('Access denied: User Only!');
  }
};
