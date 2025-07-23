import { Response } from 'express';

export type SuccessResponse<T = any> = {
  success: true;
  message: string;
  data: T;
  status: number;
  meta?: Record<string, any>;
};

export const successHandler = <T = any>(
  res: Response,
  {
    data,
    message = 'Success',
    status = 200,
    meta,
  }: {
    data: T;
    message?: string;
    status?: number;
    meta?: Record<string, any>;
  }
): Response<SuccessResponse<T>> => {
  return res.status(status).json({
    success: true,
    message,
    data,
    status,
    ...(meta ? { meta } : {}),
  });
};
