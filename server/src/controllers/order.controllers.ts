import { Request } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { newOrderRequestBody } from "../types/types.js";
import { ApiError } from "../utils/apiError.js";
import { PrismaClient } from "@prisma/client";
import pkg from "validator";
import { myCache } from "../index.js";
import { error } from "console";
import type { $Enums } from "@prisma/client";
import { invlidateCache, isValidNumber } from "../utils/features.js";
const { isFloat } = pkg;

const prisma = new PrismaClient();

// order retrival
export const myOrders = asyncHandler(async (req, res) => {
  const { id } = req.query;

  if (!id) {
    throw new ApiError("please provide valid id");
  }

  const key = `my-order-${id}`;

  let myorder = [];
  if (myCache.has(key)) {
    myorder = myCache.get(key);
  } else {
    myorder = await prisma.order.findMany({
      where: { userId: String(id) },
      include: { orderDetails: true },
    });
    if (!myorder) {
      throw new ApiError("no data found", 400);
    }
    myCache.set(key, myorder);
  }

  return res.status(200).json({
    success: true,
    message: "orders found",
    data: myorder,
  });
});

export const all = asyncHandler(async (req, res) => {
  const key = `all-orders`;

  let orders = [];

  if (myCache.has(key)) {
    orders = myCache.get(key);
  } else {
    orders = await prisma.order.findMany({
      include: {
        orderDetails: true,
      },
    });
    myCache.set(key, orders);
  }
  return res.status(200).json({
    success: true,
    messages: "orders found",
    data: orders,
  });
});

export const singleOrder = asyncHandler(async (req: Request, res) => {
  const { id: orderId } = req.params;
  const key = `order-${orderId}`;

  let singleorder;
  if (myCache.has(key)) {
    singleorder = myCache.get(key);
  } else {
    singleorder = await prisma.order.findUnique({
      where: { id: Number(orderId) },
      include: {
        address: true,
        user: true,
        orderDetails: true,
      },
    });
    if (!singleorder) {
      throw new ApiError("no data found", 400);
    }
    myCache.set(key, singleorder);
  }

  return res.status(200).json({
    success: true,
    message: "order found",
    data: singleorder,
  });
});

// order manipulation
export const newOrder = asyncHandler(
  async (req: Request<any, any, newOrderRequestBody>, res) => {
    console.log("inside firstline");
    console.log(req.body);
    const {
      adressInfo,
      addressId,
      discount,
      shippingCharges,
      subtotal,
      tax,
      total,
      userId,
      orderDetails,
    } = req.body;

    // const numberUserId = Number(userId);

    const { address, city, country, pinCode, state } = adressInfo;

    if (!adressInfo && !addressId) {
      throw new ApiError(
        "either address information or address Id is requires",
      );
    }

    console.log("for discount", isFloat(String(discount)));
    console.log("for shippingcharges", isFloat(String(shippingCharges)));
    const isDiscountPresent = discount;
    if (
      !isFloat(String(discount)) ||
      !isFloat(String(shippingCharges)) ||
      !subtotal ||
      !tax ||
      !total ||
      !userId ||
      !address ||
      !city ||
      !country ||
      !pinCode ||
      !state
    ) {
      console.log("------------throwing error-----------");
      throw new ApiError("all fields are necessary ");
    }

    if (
      !isValidNumber(discount) ||
      !isValidNumber(shippingCharges) ||
      !isValidNumber(subtotal) ||
      !isValidNumber(tax) ||
      !isValidNumber(total) ||
      !isValidNumber(pinCode)
    ) {
      throw new ApiError(
        "discount, shippingCharges, subtotal, tax, total and pincode shoud be numbers",
      );
    }

    let localAddressId: number = addressId;

    if (address) {
      const AdressResponse = await prisma.address.create({
        data: {
          ...adressInfo,
          userId,
          pinCode: Number(pinCode),
        },
      });
      localAddressId = AdressResponse.id;
    }

    const orderResponse = await prisma.order.create({
      data: {
        orderDetails: {
          create: orderDetails,
        },
        addressId: localAddressId,
        discount: Number(discount),
        shippingCharges: Number(shippingCharges),
        subtotal: Number(subtotal),
        tax: Number(tax),
        total: Number(total),
        userId: userId,
      },
      include: {
        orderDetails: true,
      },
    });

    // TODO : decrease the quantity

    invlidateCache({
      product: true,
      order: true,
      admin: true,
      userId: userId,
      productId: orderResponse.orderDetails.map((i) => String(i.id)),
    });

    return res.status(200).json({
      success: true,
      message: "order placed successfully",
      data: orderResponse,
    });
  },
);

export const processOrder = asyncHandler(async (req: Request, res) => {
  const id = Number(req.params.id);
  if (!id) {
    throw new ApiError("provid a valid id");
  }

  const dbres = await prisma.order.findUnique({
    where: { id },
  });

  if (!dbres) {
    throw new ApiError("no data found, provid valid id");
  }

  let newStatus: $Enums.Status;

  switch (dbres.status) {
    case "Processing":
      newStatus = "Shipped";
      break;
    case "Shipped":
      newStatus = "Delivered";
      break;
    default:
      newStatus = "Delivered";
  }

  const updatedOrder = await prisma.order.update({
    where: { id },
    data: {
      status: newStatus,
    },
  });

  invlidateCache({
    admin: true,
    order: true,
    product: true,
    userId: updatedOrder.userId,
    orderId: String(updatedOrder.id),
  });

  return res.status(200).json({
    success: true,
    message: "order processed successfully",
    data: updatedOrder,
  });
});

export const deleteOrder = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);

  if (!id) {
    throw new ApiError("id is missing");
  }

  const deletedOrder = await prisma.order.delete({ where: { id } });

  invlidateCache({
    order: true,
    product: true,
    admin: true,
    orderId: String(deletedOrder.id),
    userId: deletedOrder.userId,
  });

  return res.status(200).json({
    success: true,
    message: "order deleted successfully",
    data: deletedOrder,
  });
});
