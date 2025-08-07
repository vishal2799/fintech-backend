import { Request, Response } from 'express';
import { AppError } from '../../utils/AppError';
import { asyncHandler } from '../../utils/asyncHandler';
import { successHandler } from '../../utils/responseHandler';
import { ERRORS } from '../../constants/errorCodes';
import { cloudinary } from '../../lib/cloudinary';

export const generateSignedUrl = asyncHandler(async (req: Request, res: Response) => {
  // const { publicId } = (req as any).validated;
    const { publicId } = req.query;

  if (!publicId) throw new AppError(ERRORS.MISSING_PUBLIC_ID);

  const signedUrl = cloudinary.utils.private_download_url(publicId, 'image', {
    type: 'authenticated',
    expires_at: Math.floor(Date.now() / 1000) + 60 * 5, // 5 mins
  });

  return successHandler(res, {
    data: { signedUrl },
    message: 'Signed URL generated successfully',
    status: 200,
  });
});
