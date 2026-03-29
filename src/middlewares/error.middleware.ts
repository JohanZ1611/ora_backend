import type { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
  }
}

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`[Error] ${err.message}`);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      ok: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    ok: false,
    message: "Error interno del servidor",
  });
};