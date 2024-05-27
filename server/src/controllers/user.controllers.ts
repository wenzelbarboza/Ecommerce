import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { NewUserRequestBody } from "../types/types.js";
import { Gender, PrismaClient } from "@prisma/client";
import { ApiError } from "../utils/apiError.js";
import validator from "validator";

const prisma = new PrismaClient();

export const createUser = asyncHandler(
  async (req: Request<{}, {}, NewUserRequestBody>, res: Response) => {
    const { id, name, email, gender, dob, photo, role } = req.body;

    console.log(req.body);

    if (!id || !name || !email || !gender || !dob || !photo) {
      throw new ApiError("please provide all user fields");
    }
    // console.log("XXXXXXXXX date and time XXXXXXXXXXXXX: ", new Date(dob));
    // validate email
    // if (validator.isEmail(email)) {
    //   throw new ApiError("please provide correct email");
    // }

    const newUser = await prisma.user.create({
      data: {
        dob: new Date(dob),
        email,
        id,
        name,
        photo,
        gender,
      },
    });

    res.status(200).json({
      success: true,
      newUser,
    });
  }
);
