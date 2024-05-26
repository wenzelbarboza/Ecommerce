import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  res.send(
    JSON.stringify({
      mssage: "inside create user",
    })
  );
});
