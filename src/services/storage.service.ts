import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3, S3_BUCKET } from "../config/aws";

export const generateUploadUrl = async (tenantId: string, fileName: string, mimeType: string) => {
  const key = `tenants/${tenantId}/logo-${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
    ContentType: mimeType,
    // keep objects private -> no ACL set
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 5 }); // 5 minutes
  return { uploadUrl, fileKey: key };
};

export const generateDownloadUrl = async (fileKey: string, expiresIn = 60 * 5) => {
  const command = new GetObjectCommand({
    Bucket: S3_BUCKET,
    Key: fileKey,
    // ResponseContentType optional — can help in some browsers
  });

  const downloadUrl = await getSignedUrl(s3, command, { expiresIn });
  return downloadUrl;
};


// import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import { s3, S3_BUCKET } from "../config/aws";

// export const generateUploadUrl = async (tenantId: string, fileName: string, mimeType: string) => {
//   const key = `tenants/${tenantId}/logo-${Date.now()}-${fileName}`;

//   const command = new PutObjectCommand({
//     Bucket: S3_BUCKET,
//     Key: key,
//     ContentType: mimeType
//   });

//   const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 5 }); // 5 min
//   return { uploadUrl, fileKey: key };
// };

// export const generateDownloadUrl = async (fileKey: string) => {
//   const command = new GetObjectCommand({
//     Bucket: S3_BUCKET,
//     Key: fileKey
//   });

//   return await getSignedUrl(s3, command, { expiresIn: 60 * 5 });
// };

