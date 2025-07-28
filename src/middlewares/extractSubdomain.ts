import { Request, Response, NextFunction } from "express";

export const extractSubdomain = (req: Request, res: Response, next: NextFunction) => {
  const host = req.headers.host || ''; // e.g. "wl1.localhost:3000"
  const isLocalhost = host.includes('localhost');

  const parts = host.split('.');
  const subdomain = parts.length > (isLocalhost ? 1 : 2)
    ? parts[0]
    : null;

      console.log('🔍 Full Host:', parts);         // Log to debug
  console.log('🔍 Full Host:', host);         // Log to debug
  console.log('🌐 Extracted Subdomain:', subdomain);

  (req as any).subdomain = subdomain;
  next();
};
