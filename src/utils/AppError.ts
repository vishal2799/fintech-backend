import type { AppErrorCode } from '../constants/errorCodes';
import { ERRORS } from '../constants/errorCodes';

type ErrorInput =
  | {
      message: string;
      status?: number;
      errorCode?: string;
      isOperational?: boolean;
    }
  | (typeof ERRORS)[AppErrorCode]; // direct ERRORS constant

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  errorCode?: string;

  constructor(error: ErrorInput) {
    super(error.message);
    this.statusCode = error.status ?? 500;
    this.errorCode = 'code' in error ? error.code : undefined;
    this.isOperational = 'isOperational' in error ? error.isOperational! : true;
    Error.captureStackTrace(this, this.constructor);
  }
}
