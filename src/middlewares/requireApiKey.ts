// // middlewares/requireApiKey.ts
// import { Request, Response, NextFunction } from 'express';
// import crypto from 'crypto';
// import { db } from '../db';
// import { apiClients } from '../db/schema';
// import { eq } from 'drizzle-orm';

// export const requireApiKey = async (req: Request, res: Response, next: NextFunction) => {
//   const clientKey = req.headers['x-api-key'] as string;
//   const signature = req.headers['x-signature'] as string;
//   const timestamp = req.headers['x-timestamp'] as string;

//   if (!clientKey || !signature || !timestamp)
//     return res.status(401).json({ message: 'Missing authentication headers' });

//   const client = await db.select().from(apiClients).where(eq(apiClients.clientKey, clientKey));
//   if (!client.length || client[0].status !== 'ACTIVE') return res.status(403).json({ message: 'Invalid API key' });

//   const now = Math.floor(Date.now() / 1000);
//   if (Math.abs(now - parseInt(timestamp)) > 300)
//     return res.status(400).json({ message: 'Request timestamp expired' });

//   const payload = JSON.stringify(req.body || {}) + req.originalUrl + req.method + timestamp;

//   const secret = client[0].clientSecret;
//   if (!secret) return res.status(500).json({ message: 'API client secret missing' });

//   const hmac = crypto.createHmac('sha256', secret).update(payload).digest('hex');

//   if (hmac !== signature) return res.status(403).json({ message: 'Invalid signature' });

//   (req as any).apiClient = client[0];
//   next();
// };
