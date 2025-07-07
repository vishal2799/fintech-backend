import { Request, Response, NextFunction } from "express";

// Custom error handler
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    // Optionally, include stack in dev:
    // stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
