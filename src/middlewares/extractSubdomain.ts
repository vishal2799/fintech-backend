import { Request, Response, NextFunction } from "express";

export const extractSubdomain = (req: Request, res: Response, next: NextFunction) => {
  const host = req.headers.host || ''; // e.g. "wl1.localhost:3000" or "wallets.mycompany.com"
  const hostname = host.split(':')[0]; // remove port
  const parts = hostname.split('.');

  const isLocalhost = hostname.includes('localhost');
  const isCustomDomain = !isLocalhost && parts.length >= 2 && !hostname.endsWith('yourdomain.com');

  let subdomain: string | null = null;

  if (!isCustomDomain && parts.length > (isLocalhost ? 1 : 2)) {
    subdomain = parts[0]; // extract 'wl1' or 'superadmin'
  }

  console.log('🔍 Full Host:', host);
  console.log('🌐 Extracted Subdomain:', subdomain);

  (req as any).subdomain = subdomain;
  next();
};


// import { Request, Response, NextFunction } from "express";

// export const extractSubdomain = (req: Request, res: Response, next: NextFunction) => {
//   const host = req.headers.host || ''; // e.g. "wl1.localhost:3000"
//   const isLocalhost = host.includes('localhost');

//   const parts = host.split('.');
//   const subdomain = parts.length > (isLocalhost ? 1 : 2)
//     ? parts[0]
//     : null;

//       console.log('🔍 Full Host:', parts);         // Log to debug
//   console.log('🔍 Full Host:', host);         // Log to debug
//   console.log('🌐 Extracted Subdomain:', subdomain);

//   (req as any).subdomain = subdomain;
//   next();
// };
