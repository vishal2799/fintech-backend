import { Response } from 'express';

export const successHandler = (res: Response, {
  data,
  message = 'Success',
  status = 200
}: {
  data: any;
  message?: string;
  status?: number;
}) => {
  return res.status(status).json({
    success: true,
    message,
    data,
    status
  });
};

