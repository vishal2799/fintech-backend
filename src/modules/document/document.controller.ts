import fs from 'fs/promises';
import { Request, Response } from 'express';
import { uploadToCloudinary } from '../../utils/uploadToCloudinary';
import { deleteFromCloudinary } from '../../utils/deleteFromCloudinary';
import { generateSignedUrl } from '../../utils/generateSignedUrl';
import { AppError } from '../../utils/AppError';
import { asyncHandler } from '../../utils/asyncHandler';
import { successHandler } from '../../utils/responseHandler';
import { ERRORS } from '../../constants/errorCodes';

export const uploadDocument = asyncHandler(async (req: Request, res: Response) => {
  const file = req.file;
  const { type } = (req as any).validated;
  const tenantId = req.user?.tenantId;

  if (!file || !tenantId) throw new AppError(ERRORS.INVALID_TENANT);

  const result = await uploadToCloudinary(file.path, tenantId, type);
  await fs.unlink(file.path); // cleanup

  return successHandler(res, {
    status: 201,
    message: 'Document uploaded successfully',
    data: {
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
    },
  });
});

export const deleteDocument = asyncHandler(async (req: Request, res: Response) => {
  const { publicId } = (req as any).validated;

  if (!publicId) throw new AppError(ERRORS.MISSING_PUBLIC_ID);

  const result = await deleteFromCloudinary(publicId);

  return successHandler(res, {
    status: 200,
    message: 'Document deleted successfully',
    data: result,
  });
});

export const getSignedUrl = asyncHandler(async (req: Request, res: Response) => {
  const { publicId, resourceType = 'image' } = (req as any).validated;

  if (!publicId) throw new AppError(ERRORS.MISSING_PUBLIC_ID);

  const signedUrl = generateSignedUrl(publicId, resourceType || 'auto');

  return successHandler(res, {
    status: 200,
    message: 'Signed URL generated successfully',
    data: { signedUrl },
  });
});
