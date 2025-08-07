import { cloudinary } from "../lib/cloudinary";

export const deleteFromCloudinary = async (publicId: string) => {
  return cloudinary.uploader.destroy(publicId, {
    type: 'authenticated',
    resource_type: 'auto',
  });
};
