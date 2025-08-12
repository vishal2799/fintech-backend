import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3, S3_BUCKET } from "../config/aws";

export const generateUploadUrl = async (
  tenantId: string,
  fileName: string,
  mimeType: string,
  docType: 'logo' | 'kyc' | 'receipt' | 'support' = 'logo',
  userId?: string, // for user-specific folders like KYC
  entityId?: string // e.g. transactionId or ticketId for receipts/support
) => {
  let key = `tenants/${tenantId}/`;

  switch (docType) {
    case 'logo':
      key += `logos/logo-${Date.now()}-${fileName}`;
      break;
    case 'kyc':
      if (!userId) throw new Error('userId is required for KYC docs');
      key += `kyc-documents/${userId}/kyc-${Date.now()}-${fileName}`;
      break;
    case 'receipt':
      if (!entityId) throw new Error('transactionId required for receipt');
      key += `transaction-receipts/${entityId}/receipt-${Date.now()}-${fileName}`;
      break;
    case 'support':
      if (!entityId) throw new Error('ticketId required for support attachments');
      key += `support-tickets/${entityId}/attachments/attach-${Date.now()}-${fileName}`;
      break;
    default:
      key += `others/${Date.now()}-${fileName}`;
  }

  const command = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
    ContentType: mimeType,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 5 });
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


