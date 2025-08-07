import { cloudinary } from "../lib/cloudinary";

export const uploadToCloudinary = async (
  filePath: string,
  tenantId: string,
  docType: string
) => {
  const folder = `documents/${tenantId}/${docType}`;
  return cloudinary.uploader.upload(filePath, {
    folder,
    type: 'authenticated',
    resource_type: 'auto',
  });
};
