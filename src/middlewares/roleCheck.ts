// src/middlewares/roleCheck.ts
import { Request, Response, NextFunction, RequestHandler } from 'express';

// interface AuthRequest extends Request {
//   user?: {
//     id: string;
//     tenantId?: string;
//     roleNames: string[]; // e.g., ['SUPER_ADMIN', 'WL_ADMIN']
//     // you can also add email, mobile, etc.
//   };
// }

export const roleCheck = (allowedRoles: string[]): RequestHandler => {
  return ((req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
console.log(user);
    if (!user || !user.roleNames) {
      return res.status(401).json({ message: 'Unauthorized: No roles found' });
    }

    const hasRole = user.roleNames.some((role) => allowedRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({ message: 'Forbidden: Role mismatch' });
    }

    next();
  }) as RequestHandler;
};
