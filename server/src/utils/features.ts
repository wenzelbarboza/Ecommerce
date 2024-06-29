import { myCache } from "../index.js";
import { invalidateOptionTypes } from "../types/types.js";
import { PrismaClient } from "@prisma/client";
import type { Order, Product, User } from "@prisma/client";

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
    const adminKeys = [
      "admin-stats",
      "admin-pie-charts",
      "adimin-bar-charts",
      "adimin-line-charts",
    ];
    myCache.del(adminKeys);
  }
};

export const claculateGrowth = (thisMont: number, lastMonth: number) => {
  if (lastMonth == 0) {
    return thisMont;
  }
  const percent = (thisMont / lastMonth) * 100;
  return Number(percent);
};

type catetgoryRatioType = {
  category: string;
}[];

export const calculateCategoryRatio = (products: catetgoryRatioType) => {
  let catagoryCount = {};

  products.forEach((product) => {
    catagoryCount[product.category] =
      (catagoryCount[product.category] || 0) + 1;
  });

  const totalProducts = products.length;

  const catagoryPercentage = {};
  Object.keys(catagoryCount).forEach((key) => {
    catagoryPercentage[key] = Math.round(
      (catagoryCount[key] / totalProducts) * 100
    );
  });

  return catagoryPercentage;
};

export const calculateAge = (dob: Date) => {
  const today = new Date();
  const thisYear = today.getFullYear();
  const thisMonth = today.getMonth();
  const thisDay = today.getDate();
  const birthYear = dob.getFullYear();
  const birthMonth = dob.getMonth();
  const birthDay = dob.getDate();
  let age = thisYear - birthYear;

  if (
    birthMonth < thisMonth ||
    (thisMonth == birthMonth && birthDay <= thisDay)
  )
    age--;

  return age;
};

type lastSixmonthGrowthType = {
  length: number;
  dataObj:
    | Array<Order>
    | Array<User>
    | Array<Product>
    | Array<{ createdAt: Date }>;
  property?: keyof Order;
};

export const CalculatelastSixmonthGrowth = ({
  length,
  dataObj,
  property,
}: lastSixmonthGrowthType) => {
  const today = new Date();
  let outList = new Array(length).fill(0);

  // console.log("inside calc and this is order list: ", dataObj);

  dataObj.forEach((order) => {
    const creationDate = order.createdAt;
    const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

    if (monthDiff < length) {
      if (property) {
        outList[length - monthDiff - 1] += order[property];
      } else {
        outList[length - monthDiff - 1] += 1;
      }
    }
  });

  return outList;
};
