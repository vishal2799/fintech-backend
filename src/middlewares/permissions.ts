// src/middlewares/permissions.ts
import { Response, NextFunction, Request, RequestHandler } from 'express';

export const checkPermission = (permission: string): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user || !user.isEmployee) {
      res.status(403).json({ message: 'Access denied: Not an employee' });
      return; // ✅ Ensures function ends here
    }

    if (!user.permissions?.includes(permission)) {
      res.status(403).json({ message: 'Permission denied' });
      return; // ✅ Ensures function ends here
    }

    next(); // ✅ Proceed if permission is valid
  };
};



// export const checkPermission = (permission: string):RequestHandler => {
//   return (req: Request, res: Response, next: NextFunction): void => {
//     if (!req.user) {
//       res.status(401).json({ message: 'Unauthorized' });
//       return;
//     }

//     if (!req.user.permissions.includes(permission)) {
//       res.status(403).json({ message: 'Permission denied' });
//       return;
//     }

//     next();
//   };
// };
