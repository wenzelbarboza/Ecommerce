import { NextFunction, Request, Response } from "express";
import { NewUserControllerType } from "../types/types.js";

export const asyncHandler =
  (callback: NewUserControllerType) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await callback(req, res, next);
    } catch (error) {
      return next(error);
    }
  };
