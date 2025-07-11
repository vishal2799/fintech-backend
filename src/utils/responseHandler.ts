import { Response } from 'express';

// ✅ Success response
export const successHandler = (
  res: Response,
  data: any,
  message = 'Success',
  status = 200
) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

