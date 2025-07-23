import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny } from 'zod';
import { AppError } from '../utils/AppError';

export const validate =
  (schema: ZodTypeAny, source: 'body' | 'query' | 'params' = 'body') =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const message = result.error.issues.map((i) => i.message).join(', ');
      throw new AppError({
        message,
        status: 422,
        errorCode: 'VALIDATION_ERROR',
      });
    }

    (req as any).validated = result.data;
    next();
  };
