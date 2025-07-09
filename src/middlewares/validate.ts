import { ZodSchema, ZodError } from 'zod'
import { Request, Response, NextFunction } from 'express'

export const validate = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.errors.map(e => ({
            path: e.path.join('.'),
            message: e.message
          }))
        })
      } else {
        res.status(500).json({ error: 'Internal server error' })
      }
    }
  }
}
