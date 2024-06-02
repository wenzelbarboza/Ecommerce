import { myCache } from "../index.js";
import { invalidateOptionTypes } from "../types/types.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const invlidateCache = async ({
  admin,
  order,
  product,
}: invalidateOptionTypes) => {
  if (product) {
    const productCacheKeys: Array<string> = [
      "cached-latest",
      "cached-all",
      "cached-categories",
    ];
    const allId = await prisma.product.findMany({
      select: {
        id: true,
      },
    });
    allId.forEach((ele) => productCacheKeys.push(String(ele.id)));
    myCache.del(productCacheKeys);
  }
  if (order) {
  }
  if (admin) {
  }
};
