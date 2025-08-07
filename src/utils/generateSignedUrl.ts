import { cloudinary } from "../lib/cloudinary";

export const generateSignedUrl = (
  publicId: string,
  resourceType = 'auto',
  expiresInSec = 300 // default 5 minutes
) => {
  return cloudinary.url(publicId, {
    type: 'authenticated',
    resource_type: resourceType,
    sign_url: true,
    expires_at: Math.floor(Date.now() / 1000) + expiresInSec,
  });
};
