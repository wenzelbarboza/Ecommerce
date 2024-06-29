import { asyncHandler } from "../utils/asyncHandler.js";
import { PrismaClient } from "@prisma/client";
import {
  calculateAge,
  calculateCategoryRatio,
  CalculatelastSixmonthGrowth,
  claculateGrowth,
} from "../utils/features.js";
import { myCache } from "../index.js";

const prisma = new PrismaClient();

export const dashboardsStats = asyncHandler(async (req, res) => {
  let stats = {};
  const key = "admin-stats";

  if (myCache.has(key)) {
    stats = myCache.get(key);
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

    const lastSixMonthsTransaction = CalculatelastSixmonthGrowth({
      dataObj: lastSixMonthsOrders,
      length: 6,
    });
    const lastSixMonthsRevenue = CalculatelastSixmonthGrowth({
      dataObj: lastSixMonthsOrders,
      property: "total",
      length: 6,
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
    const catagoryPercentage = calculateCategoryRatio(allproducts);

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

    myCache.set(key, stats);
  }

  return res.status(200).json({
    success: true,
    message: "welcome to this api/v1/dashboard/stats",
    data: stats,
  });
});
export const pieChart = asyncHandler(async (req, res) => {
  const key = `admin-pie-charts`;
  let charts = {};

  if (myCache.has(key)) {
    charts = myCache.get(key);
  } else {
    const outofStockPromise = prisma.product.count({
      where: {
        stock: 0,
      },
    });

    const allOrderPromis = prisma.order.findMany({
      select: {
        tax: true,
        total: true,
        discount: true,
        subtotal: true,
        shippingCharges: true,
      },
    });

    const usersPromise = prisma.user.findMany({
      select: {
        dob: true,
        role: true,
      },
    });

    const [
      ordersPrcessing,
      ordersShipped,
      ordersDelivered,
      allOrderCategories,
      outOfStockCount,
      allOrders,
      users,
    ] = await Promise.all([
      prisma.order.count({ where: { status: "Processing" } }),
      prisma.order.count({ where: { status: "Shipped" } }),
      prisma.order.count({ where: { status: "Delivered" } }),
      prisma.product.findMany({
        select: {
          category: true,
        },
      }),
      outofStockPromise,
      allOrderPromis,
      usersPromise,
    ]);

    const orderFullfillmentStatus = {
      ordersPrcessing,
      ordersShipped,
      ordersDelivered,
    };

    const categoryPercentage = calculateCategoryRatio(allOrderCategories);

    const inventoryCount = {
      outOfStock: outOfStockCount,
      inStock: allOrderCategories.length - outOfStockCount,
    };

    const grossIncome = allOrders.map(
      (item, acc) => acc + (item.total || 0),
      0
    );
    const discount = allOrders.map(
      (item, acc) => acc + (item.discount || 0),
      0
    );
    const burn = allOrders.map((item, acc) => acc + (item.tax || 0), 0);
    const productionCost = allOrders.map(
      (item, acc) => acc + (item.shippingCharges || 0),
      0
    );

    const marketingCost = Number(grossIncome) * 0.3;

    const netMargine =
      Number(grossIncome) -
      Number(discount) -
      Number(burn) -
      Number(productionCost) -
      Number(marketingCost);

    const revenueDistribution = {
      netMargine,
      discount,
      productionCost,
      burn,
      marketingCost,
    };

    const ageList = users.map((user) => calculateAge(user.dob));

    // TODO use different logic
    const ageDistribution = ageList.reduce(
      (acc, age) => {
        if (age <= 19) {
          acc.teen = +1;
        } else if (age <= 65) {
          acc.audult += 1;
        } else {
          acc.old += 1;
        }

        return acc;
      },
      {
        teen: 0,
        audult: 0,
        old: 0,
      }
    );

    const adminCount = users.reduce((acc, user) => {
      if (user.role == "ADMIN") {
        return acc + 1;
      } else {
        return acc;
      }
    }, 0);

    const adminCustomer = {
      admin: adminCount,
      customer: users.length - adminCount,
    };

    charts = {
      orderFullfillmentStatus,
      categoryPercentage,
      inventoryCount,
      revenueDistribution,
      adminCustomer,
      ageDistribution,
    };

    myCache.set(key, charts);
  }
  return res.status(200).json({
    success: true,
    message: "welcome to this api/v1/dashboard/piechart",
    data: charts,
  });
});
export const barChart = asyncHandler(async (req, res) => {
  const key = "adimin-bar-charts";
  let charts = {};
  if (myCache.has(key)) {
    charts = myCache.get(key);
  } else {
    const today = new Date();
    const lastSixMonths = new Date();
    lastSixMonths.setMonth(lastSixMonths.getMonth() - 6);
    const lastTwelveMonths = new Date();
    lastTwelveMonths.setMonth(lastTwelveMonths.getMonth() - 6);

    const twelveMonthsOrderPromise = prisma.order.findMany({
      where: {
        createdAt: {
          gte: lastTwelveMonths,
          lte: today,
        },
      },
      select: {
        createdAt: true,
      },
    });
    const sixMonthsProductPromise = prisma.product.findMany({
      where: {
        createdAt: {
          gte: lastSixMonths,
          lte: today,
        },
      },
      select: {
        createdAt: true,
      },
    });
    const sixMonthUserPromise = prisma.user.findMany({
      where: {
        createdAt: {
          gte: lastSixMonths,
          lte: today,
        },
      },
      select: {
        createdAt: true,
      },
    });

    const [orders, products, users] = await Promise.all([
      twelveMonthsOrderPromise,
      sixMonthsProductPromise,
      sixMonthUserPromise,
    ]);

    const twelveMonthsOrderData = CalculatelastSixmonthGrowth({
      dataObj: orders,
      length: 12,
    });
    const sixMonthsProductData = CalculatelastSixmonthGrowth({
      dataObj: products,
      length: 6,
    });
    const sixMonthsUsersData = CalculatelastSixmonthGrowth({
      dataObj: users,
      length: 6,
    });

    charts = {
      orders: twelveMonthsOrderData,
      products: sixMonthsProductData,
      users: sixMonthsUsersData,
    };
    myCache.set(key, charts);
  }

  return res.status(200).json({
    success: true,
    message: "bar chart data found",
    data: charts,
  });
});
export const lineChart = asyncHandler(async (req, res) => {
  const key = "adimin-line-charts";
  let charts = {};
  if (myCache.has(key)) {
    charts = myCache.get(key);
  } else {
    const today = new Date();
    // const lastSixMonths = new Date();
    // lastSixMonths.setMonth(lastSixMonths.getMonth() - 6);
    const lastTwelveMonths = new Date();
    lastTwelveMonths.setMonth(lastTwelveMonths.getMonth() - 6);

    const baseQuery = {
      where: {
        createdAt: {
          gte: lastTwelveMonths,
          lte: today,
        },
      },
      select: {
        createdAt: true,
      },
    };

    const twelMonthsOrderPromise = prisma.order.findMany({
      where: {
        createdAt: {
          gte: lastTwelveMonths,
          lte: today,
        },
      },
    });

    const [products, users, orders] = await Promise.all([
      prisma.product.findMany(baseQuery),
      prisma.user.findMany(baseQuery),
      twelMonthsOrderPromise,
    ]);

    const sixMonthsProductData = CalculatelastSixmonthGrowth({
      dataObj: products,
      length: 12,
    });
    const sixMonthsUsersData = CalculatelastSixmonthGrowth({
      dataObj: users,
      length: 12,
    });

    const twelveMonthsRevenue = CalculatelastSixmonthGrowth({
      dataObj: orders,
      length: 12,
      property: "total",
    });
    const twelveMonthsDiscount = CalculatelastSixmonthGrowth({
      dataObj: orders,
      length: 12,
      property: "discount",
    });

    charts = {
      products: sixMonthsProductData,
      users: sixMonthsUsersData,
      revene: twelveMonthsRevenue,
      discount: twelveMonthsDiscount,
    };
    myCache.set(key, charts);
  }

  return res.status(200).json({
    success: true,
    message: "line chart data found",
    data: charts,
  });
});
