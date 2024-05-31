import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { NewUserRequestBody } from "../types/types.js";
import { PrismaClient } from "@prisma/client";
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

    // validate email
    // if (validator.isEmail(email)) {
    //   throw new ApiError("please provide correct email");
    // }

    //TODO
    // check for create user implementation when it comes to firebase

    const checkUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (checkUser) {
      throw new ApiError(
        "user already exists try different email or try logging in",
        400
      );
    }

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

    return res.status(200).json({
      success: true,
      newUser,
    });
  }
);

export const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await prisma.user.findMany({
    take: 10,
  });

  if (!users) {
    throw new ApiError("users not found or unable to get data");
  }

  return res.status(200).json({
    success: true,
    users,
  });
});

export const getUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw new ApiError("user does not exis, provide valid id");
  }

  return res.status(200).json({
    success: true,
    user,
  });
});

export const deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw new ApiError("user does not exist, provide valid id");
  }

  const deletedUser = await prisma.user.delete({
    where: {
      id,
    },
  });

  return res.status(200).json({
    success: true,
    deletedUser,
  });
});
