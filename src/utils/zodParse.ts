// src/utils/zodParse.ts
import { ZodSchema } from 'zod';

export function zParse<T>(schema: ZodSchema<T>, data: unknown) {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error.format() };
}
