import express from 'express';
import multer from 'multer';
import { uploadDocument, deleteDocument, getSignedUrl } from './document.controller';
import { uploadDocumentSchema, deleteDocumentSchema, signedUrlSchema } from './document.schema';
import { validate } from '../../middlewares/validate';
import { requireAuth } from '../../middlewares/requireAuth';

const upload = multer({ dest: 'temp/' }); // store in temp dir

const router = express.Router();

router.use(requireAuth);
router.post(
  '/upload',
  upload.single('file'),
  validate(uploadDocumentSchema),
  uploadDocument
);

router.post('/delete', validate(deleteDocumentSchema), deleteDocument);

router.post('/signed-url', validate(signedUrlSchema), getSignedUrl);

export default router;
