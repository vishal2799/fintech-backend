import { Request, Response, NextFunction } from 'express';
// import { AuthRequest } from '../types/express'; // your extended type
import jwt from 'jsonwebtoken';

export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      tenantId: string;
      roleNames: string[];
      permissions: string[];
    };

    req.user = {
      id: decoded.userId,
      tenantId: decoded.tenantId,
      roleNames: decoded.roleNames,
      permissions: decoded.permissions,
    };

    return next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
