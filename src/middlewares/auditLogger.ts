import type { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { auditLogs } from '../db/schema/auditLogs';
import { methodMappers } from '../constants/methodMappers';
import { makeSensitiveFieldsSafe } from '../utils/makeSensitiveFieldsSafe';

export const auditLogger = (req: Request, res: Response, next: NextFunction) => {
  const originalJson = res.json.bind(res);

  res.json = function (body: any) {
    const user = req.user;

    const auditEntry = {
      url: req.originalUrl,
      method: req.method,
      activity: `${methodMappers[req.method] || req.method} ${req.originalUrl.split('/').pop() || ''}`,
      params: JSON.stringify(req.params),
      query: JSON.stringify(req.query),
      payload: JSON.stringify(makeSensitiveFieldsSafe(req.body)),
      response: JSON.stringify(makeSensitiveFieldsSafe(body)),
      actorId: user?.id || null,
      actorType: user?.roleNames[0] || 'UNKNOWN',
      module: req.auditContext?.module || 'GENERAL',
      tenantId: user?.tenantId || null,
      createdAt: new Date(),
    };

    // Insert audit log in background, non-blocking
    db.insert(auditLogs)
      .values(auditEntry)
      .catch((err) => console.error('Audit log error:', err));

    return originalJson(body);
  };

  next();
};
