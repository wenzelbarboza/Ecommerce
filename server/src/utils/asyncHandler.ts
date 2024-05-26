import { NextFunction, Request, Response } from "express";

export const asyncHandler =
  (callback) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await callback(req, res, next);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
