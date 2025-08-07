import type { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { auditLogs } from '../db/schema/auditLogs';
import { methodMappers } from '../constants/methodMappers';

export const auditLogger = (req: Request, res: Response, next: NextFunction) => {
  const originalJson = res.json.bind(res);

  res.json = function (body: any) {
    try {
      const user = req.user;
      const { auditContext } = req;

      const cleanUrl = req.baseUrl + req.path;

      const auditEntry = {
        url: cleanUrl,
        method: req.method,
        activity: auditContext?.resource || 'Resource',
        actorId: user?.id ?? null,
        actorType: user?.staticRole ?? 'UNKNOWN',
        module: auditContext?.module || 'GENERAL',
        tenantId: user?.tenantId ?? null,
        createdAt: new Date(),
      };

      // ✅ Prevent insert if required fields are missing
      if (!auditEntry.tenantId || !auditEntry.actorId) {
        console.warn('⚠️ Skipping audit log due to missing tenantId or actorId');
        return originalJson(body);
      }

      db.insert(auditLogs)
        .values(auditEntry)
        .catch((err) => console.error('Audit log error:', err));
    } catch (err) {
      console.error('Audit logger failed:', err);
    }

    return originalJson(body);
  };

  next();
};

// import type { Request, Response, NextFunction } from 'express';
// import { db } from '../db';
// import { auditLogs } from '../db/schema/auditLogs';
// import { methodMappers } from '../constants/methodMappers';
// import { url } from 'inspector';

// export const auditLogger = (req: Request, res: Response, next: NextFunction) => {
//   const originalJson = res.json.bind(res);
//   // const { module = 'GENERAL', resource = 'Activity' } = req.auditContext || {};

//   res.json = function (body: any) {
//     try {
//       const user = req.user;
//       const { auditContext } = req;

//       // const verb = methodMappers[req.method] || req.method;
//       const resource = auditContext?.resource || 'Resource';
//       // const activity = `${verb} ${resource}`;
//       const cleanUrl = req.baseUrl + req.path;

//       const auditEntry = {
//         // url: req.originalUrl,
//         url: cleanUrl,
//         method: req.method,
//         activity: resource,
//         actorId: user?.id ?? null,
//         actorType: user?.staticRole ?? 'UNKNOWN',
//         module: auditContext?.module || 'GENERAL',
//         tenantId: user?.tenantId ?? null,
//         createdAt: new Date(),
//       };

//       db.insert(auditLogs)
//         .values(auditEntry)
//         .catch((err) => console.error('Audit log error:', err));
//     } catch (err) {
//       console.error('Audit logger failed:', err);
//     }

//     return originalJson(body);
//   };

//   next();
// };


// import type { Request, Response, NextFunction } from 'express';
// import { db } from '../db';
// import { auditLogs } from '../db/schema/auditLogs';
// import { methodMappers } from '../constants/methodMappers';
// // import { makeSensitiveFieldsSafe } from '../utils/makeSensitiveFieldsSafe';

// export const auditLogger = (req: Request, res: Response, next: NextFunction) => {
//   const originalJson = res.json.bind(res);

//   res.json = function (body: any) {
//     const user = req.user;

//     const verb = methodMappers[req.method] || req.method;
//     const resource = req.auditContext?.resource || 'Resource';
//     const activity = `${verb} ${resource}`;

//     const auditEntry = {
//       url: req.originalUrl,
//       method: req.method,
//       activity,
//       // params: truncate(req.params),
//       // query: truncate(req.query),
//       // payload: truncate(makeSensitiveFieldsSafe(req.body)),
//       // response: truncate(makeSensitiveFieldsSafe(body)),
//       actorId: user?.id || null,
//       actorType: user?.staticRole,
//       module: req.auditContext?.module || 'GENERAL',
//       tenantId: user?.tenantId || null,
//       createdAt: new Date(),
//     };

//     // Non-blocking insert
//     db.insert(auditLogs)
//       .values(auditEntry)
//       .catch((err) => console.error('Audit log error:', err));

//     return originalJson(body);
//   };

//   next();
// };

// function truncate(value: any, maxLength = 1000): string {
//   try {
//     const str = typeof value === 'string' ? value : JSON.stringify(value);
//     return str.length > maxLength ? str.slice(0, maxLength) + '... [truncated]' : str;
//   } catch (err) {
//     return '[unserializable]';
//   }
// }
