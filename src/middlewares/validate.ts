import { ZodSchema } from 'zod'
import { Request, Response, NextFunction } from 'express'

export const validate = (schema: ZodSchema<any>) => (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = schema.parse(req.body)
    next()
  } catch (error) {
    return res.status(400).json({ error: 'Validation failed', details: error })
  }
}
