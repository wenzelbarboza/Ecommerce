import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Request } from "express";
import { adminQueryType } from "../types/types.js";
import { ApiError } from "../utils/apiError.js";

const prisma = new PrismaClient();

export const isAdmin = asyncHandler(
  async (req: Request<{}, {}, {}, adminQueryType>, res, next) => {
    const { id } = req.query;

    if (!id) {
      throw new ApiError("login to access this route");
    }

    const adminUser = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        role: true,
      },
    });

    if (!adminUser) {
      throw new ApiError("invalid id, please provide valid id");
    }

    if (adminUser.role == "USER") {
      throw new ApiError("you are not athorised to access this route", 403);
    }

    return next();
  }
);
