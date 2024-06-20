import { myCache } from "../index.js";
import { invalidateOptionTypes } from "../types/types.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const invlidateCache = async ({
  admin,
  order,
  product,
  userId,
  orderId,
  productId,
}: invalidateOptionTypes) => {
  if (product) {
    const productCacheKeys: Array<string> = [
      "cached-latest",
      "cached-all",
      "cached-categories",
    ];

    // `product-${id}`

    if (typeof productId == "string") {
      productCacheKeys.push(`product-${productId}`);
    }

    if (typeof productId == "object") {
      productId.forEach((id) => productCacheKeys.push(`product-${id}`));
    }

    myCache.del(productCacheKeys);
  }
  if (order) {
    const keyList = [`all-orders`, `my-order-${userId}`, `order-${orderId}`];

    myCache.del(keyList);
  }
  if (admin) {
  }
};

export const claculateGrowth = (thisMont: number, lastMonth: number) => {
  if (lastMonth == 0) {
    return thisMont;
  }
  const percent = ((thisMont - lastMonth) / lastMonth) * 100;
  return Number(percent);
};
