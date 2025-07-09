// src/middlewares/permissions.ts
import { Response, NextFunction, Request, RequestHandler } from 'express';

export const checkPermission = (permission: string):RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if (!req.user.permissions.includes(permission)) {
      res.status(403).json({ message: 'Permission denied' });
      return;
    }

    next();
  };
};
