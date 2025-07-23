// src/middlewares/ErrorHandler.ts

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

const globalErrorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const isAppError = err instanceof AppError;

  const statusCode = isAppError ? err.statusCode : 500;
  const message = err.message || 'Something went wrong';

  const responseBody: {
    success: false;
    message: string;
    status: number;
    errorCode?: string;
    stack?: string;
  } = {
    success: false,
    message,
    status: statusCode,
  };

  if (isAppError && err.errorCode) {
    responseBody.errorCode = err.errorCode;
  }

  if (process.env.NODE_ENV === 'development' && err.stack) {
    responseBody.stack = err.stack;
  }

  res.status(statusCode).json(responseBody);
};

export default globalErrorHandler;
