import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const decoded = verifyAccessToken(token) as {
      userId: string;
      tenantId: string;
      roleNames: string[];
      permissions: string[];
      staticRole?: 'SUPER_ADMIN' | 'WL_ADMIN' | 'SD' | 'D' | 'R' | 'EMPLOYEE';
      isEmployee?: boolean;
    };

    req.user = {
      id: decoded.userId,
      tenantId: decoded.tenantId,
      roleNames: decoded.roleNames,
      permissions: decoded.permissions,
      staticRole: decoded.staticRole,
      isEmployee: decoded.isEmployee ?? false,
    };

    return next();
  } catch (err) {
    console.error('Auth Error:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
};


// import { Request, Response, NextFunction } from 'express';
// // import { AuthRequest } from '../types/express'; // your extended type
// import jwt from 'jsonwebtoken';
// import { verifyAccessToken } from '../utils/jwt';

// export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) {
//       res.status(401).json({ message: 'Unauthorized' });
//       return;
//     }

//     const decoded = verifyAccessToken(token) as {
//       userId: string;
//       tenantId: string;
//       roleNames: string[];
//       permissions: string[];
//     };

//     req.user = {
//       id: decoded.userId,
//       tenantId: decoded.tenantId,
//       roleNames: decoded.roleNames,
//       permissions: decoded.permissions,
//     };

//     return next();
//   } catch (err) {
//     res.status(401).json({ message: 'Invalid token' });
//   }
// };
