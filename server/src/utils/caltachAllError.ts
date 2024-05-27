import { NextFunction, Request, Response } from "express";
import { ApiError } from "./apiError.js";

export const caltachAllError = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const message = err.message;
  const status = err.status;
  return res.status(status).json({
    success: false,
    message,
  });
};
