import { Request } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import type { Coupon } from "@prisma/client";
import { ApiError } from "../utils/apiError.js";
import { PrismaClient } from "@prisma/client";
import { stripe } from "../index.js";

const prisma = new PrismaClient();

export const createPaymentIntent = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  if (!amount) {
    throw new ApiError("Please send amount", 400);
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(amount) * 100,
      currency: "inr",
    });

    return res.status(200).send({
      success: true,
      message: "intient creted successfully",
      data: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log(error);
    throw new ApiError(error.message || "issue in creating intene", 400);
  }
});
export const newCoupon = asyncHandler(
  async (req: Request<any, any, Coupon>, res) => {
    const couponCode = req.body.couponCode;
    const discount = Number(req.body.discount);
    const minOrder = Number(req.body.minOrder);

    if (discount == 0) {
      throw new ApiError("discount cannot be 0", 400);
    }

    if (!discount || !(minOrder == 0 || minOrder) || couponCode) {
      throw new ApiError("all fields are requires", 400);
    }

    const newCouponRes = await prisma.coupon.create({
      data: {
        discount,
        couponCode,
        minOrder,
      },
    });

    return res.status(200).json({
      success: true,
      message: `coupon ${couponCode} created successfully`,
      data: newCouponRes,
    });
  }
);

export const all = asyncHandler(async (req, res) => {
  const allRes = await prisma.coupon.findMany();

  res.status(200).json({
    success: true,
    message: "coupon list found",
    data: allRes,
  });
});

export const discount = asyncHandler(async (req, res) => {
  const couponCode = req.query.couponCode as string;
  if (!couponCode) {
    throw new ApiError("please enter cupon code");
  }

  const discountRes = await prisma.coupon.findUnique({
    where: {
      couponCode,
    },
    select: {
      discount: true,
    },
  });

  console.log("this is discount findUique response: ", discountRes);

  if (discountRes) {
    return res.status(200).json({
      success: true,
      message: "discount amount found",
      data: discountRes.discount,
    });
  } else {
    return res.status(200).json({
      success: false,
      message: `No discount found for the given code ${couponCode}`,
      data: 0,
    });
  }
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);

  if (!id) {
    throw new ApiError("please provide an id with data type number", 400);
  }

  const deletedRes = await prisma.coupon.delete({
    where: {
      id,
    },
  });

  return res.status(200).json({
    success: true,
    message: "id deleted successfully",
    data: deletedRes,
  });
});
