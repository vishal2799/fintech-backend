import type { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { auditLogs } from '../db/schema/auditLogs';
import { methodMappers } from '../constants/methodMappers';
import { makeSensitiveFieldsSafe } from '../utils/makeSensitiveFieldsSafe';

export const auditLogger = (req: Request, res: Response, next: NextFunction) => {
  const originalJson = res.json.bind(res);

  res.json = function (body: any) {
    const user = req.user;

    const verb = methodMappers[req.method] || req.method;
    const resource = req.auditContext?.resource || 'Resource';
    const activity = `${verb} ${resource}`;

    const auditEntry = {
      url: req.originalUrl,
      method: req.method,
      activity,
      params: truncate(req.params),
      query: truncate(req.query),
      payload: truncate(makeSensitiveFieldsSafe(req.body)),
      response: truncate(makeSensitiveFieldsSafe(body)),
      actorId: user?.id || null,
      actorType: user?.roleNames?.[0] || 'UNKNOWN',
      module: req.auditContext?.module || 'GENERAL',
      tenantId: user?.tenantId || null,
      createdAt: new Date(),
    };

    // Non-blocking insert
    db.insert(auditLogs)
      .values(auditEntry)
      .catch((err) => console.error('Audit log error:', err));

    return originalJson(body);
  };

  next();
};

function truncate(value: any, maxLength = 1000): string {
  try {
    const str = typeof value === 'string' ? value : JSON.stringify(value);
    return str.length > maxLength ? str.slice(0, maxLength) + '... [truncated]' : str;
  } catch (err) {
    return '[unserializable]';
  }
}
