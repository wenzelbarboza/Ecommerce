import { asyncHandler } from "../utils/asyncHandler.js";
import { PrismaClient } from "@prisma/client";
import { claculateGrowth } from "../utils/features.js";
import { myCache } from "../index.js";

const prisma = new PrismaClient();

export const dashboardsStats = asyncHandler(async (req, res) => {
  let stats = {};

  if (myCache.has("admin-stats")) {
    stats = myCache.get("admin-stats");
  } else {
    const today = new Date();
    const sixMontsAgo = new Date();
    sixMontsAgo.setDate(sixMontsAgo.getMonth() - 6);

    let dateRange = {
      thisMonth: {
        start: new Date(today.getFullYear(), today.getMonth(), 1),
        end: today,
      },
      lastMonth: {
        start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
        end: new Date(today.getFullYear(), today.getMonth(), 0),
      },
    };

    const thisMonthProductPromise = prisma.product.findMany({
      where: {
        createdAt: {
          gte: dateRange.thisMonth.start,
          lte: dateRange.thisMonth.end,
        },
      },
    });

    const lastMonthProductPromise = prisma.product.findMany({
      where: {
        createdAt: {
          gte: dateRange.lastMonth.start,
          lte: dateRange.lastMonth.end,
        },
      },
    });

    const thisMonthUserPromise = prisma.user.findMany({
      where: {
        createdAt: {
          gte: dateRange.thisMonth.start,
          lte: dateRange.thisMonth.end,
        },
      },
    });

    const lastMonthUserPromise = prisma.user.findMany({
      where: {
        createdAt: {
          gte: dateRange.lastMonth.start,
          lte: dateRange.lastMonth.end,
        },
      },
    });

    const thisMonthOrderPromise = prisma.order.findMany({
      where: {
        createdAt: {
          gte: dateRange.thisMonth.start,
          lte: dateRange.thisMonth.end,
        },
      },
    });

    const lastMonthOrderPromise = prisma.order.findMany({
      where: {
        createdAt: {
          gte: dateRange.lastMonth.start,
          lte: dateRange.lastMonth.end,
        },
      },
    });

    const lastSixMonthsOrderPromise = prisma.order.findMany({
      where: {
        createdAt: {
          gte: sixMontsAgo,
          lte: today,
        },
      },
    });

    const latestOrderPromise = prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        orderDetails: {
          select: {
            quantity: true,
          },
        },
        discount: true,
        total: true,
        status: true,
      },
    });

    const [
      thisMonthProduct,
      thisMonthOrder,
      thisMonthUser,
      lastMonthProduct,
      lastMonthOrder,
      lastMonthUser,
      productCount,
      userCount,
      allOrders,
      lastSixMonthsOrders,
      allproducts,
      femaleUserCount,
      latestOrderList,
    ] = await Promise.all([
      thisMonthProductPromise,
      thisMonthOrderPromise,
      thisMonthUserPromise,
      lastMonthProductPromise,
      lastMonthOrderPromise,
      lastMonthUserPromise,
      prisma.product.count(),
      prisma.user.count(),
      prisma.order.findMany({
        select: {
          total: true,
        },
      }),
      lastSixMonthsOrderPromise,
      prisma.product.findMany({
        select: {
          category: true,
        },
      }),
      prisma.user.count({
        where: {
          gender: "FEMALE",
        },
      }),
      latestOrderPromise,
    ]);

    const thisMonthRewenue = thisMonthOrder.reduce(
      (acc, order) => acc + order.total,
      0
    );
    const lastMonthRewenue = lastMonthOrder.reduce(
      (acc, order) => acc + order.total,
      0
    );

    const revenue = allOrders.reduce((acc, order) => acc + order.total, 0);

    const lastSixMonthsTransaction = new Array(6).fill(0);
    const lastSixMonthsRevenue = new Array(6).fill(0);

    lastSixMonthsOrders.forEach((order) => {
      const creationDate = order.createdAt;
      const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

      if (monthDiff < 6) {
        lastSixMonthsTransaction[6 - monthDiff - 1] += 1;
        lastSixMonthsRevenue[6 - monthDiff - 1] += order.total;
      }
    });

    const growthData = {
      productGrowth: claculateGrowth(
        thisMonthProduct.length,
        lastMonthProduct.length
      ),
      orderGrowth: claculateGrowth(
        thisMonthOrder.length,
        lastMonthOrder.length
      ),
      userGrowth: claculateGrowth(thisMonthUser.length, lastMonthUser.length),
      revenueGrowth: claculateGrowth(thisMonthRewenue, lastMonthRewenue),
    };

    const count = {
      revenue,
      product: productCount,
      user: userCount,
      order: allOrders.length,
    };

    // calculating the catagory percentage
    let catagoryCount = {};

    allproducts.forEach((product) => {
      catagoryCount[product.category] =
        (catagoryCount[product.category] || 0) + 1;
    });

    const totalProducts = allproducts.length;

    const catagoryPercentage = {};
    Object.keys(catagoryCount).forEach((key) => {
      catagoryPercentage[key] = Math.round(
        (catagoryCount[key] / totalProducts) * 100
      );
    });

    // getting the gender ratio
    const genderRatio = {
      male: userCount - femaleUserCount,
      female: femaleUserCount,
    };

    //formating latestOrderList
    const formatedLatestOrderList = latestOrderList.map((order) => {
      return {
        quantity: order.orderDetails.length,
        discount: order.discount,
        total: order.total,
        status: order.status,
      };
    });

    stats = {
      growthData,
      count,
      charts: {
        order: lastSixMonthsTransaction,
        revenue: lastSixMonthsRevenue,
      },
      catagoryPercentage,
      genderRatio,
      LatestTransaction: formatedLatestOrderList,
    };

    myCache.set("admin-stats", stats);
  }

  return res.status(200).json({
    success: true,
    message: "welcome to this api/v1/dashboard/stats",
    data: stats,
  });
});
export const pieChart = asyncHandler(async (req, res) => {});
export const barChart = asyncHandler(async (req, res) => {});
export const lineChart = asyncHandler(async (req, res) => {});
