import { Request } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  NewProductRequestBody,
  baseQueryType,
  productSearchQueryParams,
} from "../types/types.js";
import { PrismaClient } from "@prisma/client";
import { ApiError } from "../utils/apiError.js";
import { rm } from "fs";
import { myCache } from "../index.js";
import { invlidateCache } from "../utils/features.js";

const prisma = new PrismaClient();

export const newProduct = asyncHandler(
  async (req: Request<{}, {}, NewProductRequestBody>, res) => {
    let { category, name, price, stock } = req.body;

    const photo = req.file;

    if (!photo) {
      throw new ApiError("photo is required", 400);
    }

    if (!category || !name || !price || !stock) {
      rm(photo.path, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("photo deleted successfully");
        }
      });
      throw new ApiError("all the fields are necessary", 400);
    }

    // check for numeric values
    if (Number(price) && Number(stock)) {
      price = Number(price);
      stock = Number(stock);
    } else {
      throw new ApiError("price and stock should be numeric values", 400);
    }

    const newProduct = await prisma.product.create({
      data: {
        category: category.trim().toLocaleLowerCase(),
        name,
        price,
        stock,
        photo: photo.path,
      },
    });

    await invlidateCache({ product: true, admin: true });

    res.status(201).json({
      success: true,
      message: "product created successfully",
      data: newProduct,
    });
  }
);

// Revalidate cache on create, update, delete and new order.
export const getLatestProducts = asyncHandler(async (req, res) => {
  let latestProductResponse;

  if (myCache.has("cached-latest")) {
    latestProductResponse = myCache.get("cached-latest");
  } else {
    latestProductResponse = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });
    myCache.set("cached-latest", latestProductResponse);
  }

  return res.status(200).json({
    success: true,
    message: "fetched the latest record",
    data: latestProductResponse,
  });
});

export const getProducts = asyncHandler(async (req, res) => {
  let productRes;

  if (myCache.has("cached-all")) {
    productRes = myCache.get("cached-all");
  } else {
    productRes = await prisma.product.findMany({});
    myCache.set("cached-all", productRes);
  }

  return res.status(200).json({
    success: true,
    message: "fetched the latest record",
    data: productRes,
  });
});

export const getProductCatagories = asyncHandler(async (req, res) => {
  let categoriesRes;

  if (myCache.has("cached-categories")) {
    categoriesRes = myCache.get("cached-categories");
  } else {
    categoriesRes = await prisma.product.findMany({
      distinct: "category",
      select: {
        category: true,
      },
    });
    myCache.set("cached-categories", categoriesRes);
  }

  const catagoryList = categoriesRes.map((ele) => ele.category);

  return res.status(200).json({
    success: true,
    message: "fetched the latest record",
    data: catagoryList,
  });
});

export const details = asyncHandler(
  async (req: Request<{ id: string }>, res) => {
    let id: string | number = req.params.id;

    if (!req.params.id && Number(id)) {
      throw new ApiError("please provide an intiger id");
    }

    id = Number(id);

    console.log("the product id is: ", id);

    let detailsRes;

    if (myCache.has(`product-${id}`)) {
      detailsRes = myCache.get(`product-${id}`);
    } else {
      detailsRes = await prisma.product.findUnique({
        where: {
          id,
        },
      });

      if (!detailsRes) {
        throw new ApiError("provide a valid id", 400);
      }
      myCache.set(`product-${id}`, detailsRes);
    }

    return res.status(200).json({
      success: true,
      message: "user data found",
      data: detailsRes,
    });
  }
);

export const deleteProduct = asyncHandler(
  async (req: Request<{ id: string }>, res) => {
    let id: string | number = req.params.id;

    if (!req.params.id && Number(id)) {
      throw new ApiError("please provide an intiger id");
    }

    id = Number(id);

    console.log("the product id is: ", id);

    const deleteRes = await prisma.product.delete({
      where: {
        id,
      },
    });

    if (!deleteRes) {
      throw new ApiError("provide a valid id", 400);
    }

    rm(deleteRes.photo, () => {
      console.log("photo deleted");
    });

    invlidateCache({ product: true, admin: true });

    return res.status(200).json({
      success: true,
      message: "user data found",
      data: deleteRes,
    });
  }
);

export const updateProduct = asyncHandler(
  async (req: Request<{ id: string }>, res) => {
    let id: string | number = req.params.id;

    const { name, price, stock, category } = req.body;

    console.log(req.body);

    const photo = req.file;

    try {
      if (!req.params.id && Number(id)) {
        throw new ApiError("please provide an intiger id");
      }

      id = Number(id);

      const product = await prisma.product.findUnique({
        where: {
          id,
        },
      });

      if (!product) {
        throw new ApiError("provide a valid id", 400);
      }

      if (name) product.name = name;
      if (price) {
        if (!Number(price)) {
          throw new ApiError("price should be a number");
        }
        product.price = Number(price);
      }
      if (stock) {
        if (!Number(stock)) {
          throw new ApiError("stock should be a number");
        }
        product.stock = Number(stock);
      }
      if (category) product.category = category;

      if (photo) {
        rm(product.photo, () => {
          console.log("old photo deleted");
        });
        product.photo = photo.path;
      }

      const updatedProduct = await prisma.product.update({
        where: {
          id,
        },
        data: {
          name: product.name,
          price: product.price,
          stock: product.stock,
          category: product.category,
          photo: product.photo,
        },
      });

      // myCache.del("cached-latest");

      await invlidateCache({ product: true, admin: true });

      return res.status(200).json({
        success: true,
        message: "product update success fully",
        data: updatedProduct,
      });
    } catch (error) {
      if (photo) {
        rm(photo.path, () => {
          console.log("request failed, photo deleted from storage");
        });
      }
      throw new ApiError(error.message, error.status || 400);
    }
  }
);

export const filterProduct = asyncHandler(
  async (req: Request<any, any, any, productSearchQueryParams>, res) => {
    let { search, category, price, sort, page } = req.query;

    price = Number(price);
    page = Number(page);

    const pagesize = 10;
    const skip = (page - 1) * pagesize;

    console.log("inside search ---------- ");

    if (price && !Number(price)) {
      throw new ApiError("price should be a numberic value");
    }

    let baseQuery: baseQueryType = {};

    if (search || price || category) {
      baseQuery.where = {};
      if (search) {
        baseQuery.where = {
          ...baseQuery.where,
          name: {
            contains: search,
          },
        };
      }

      if (price) {
        baseQuery.where = {
          ...baseQuery.where,
          price: {
            lte: price,
          },
        };
      }

      if (category) {
        baseQuery.where = {
          ...baseQuery.where,
          category: category,
        };
      }
    }

    //filter is provided or not provided
    let filter;

    if (sort) {
      filter = prisma.product.findMany({
        ...baseQuery,
        take: pagesize,
        skip: page,
        orderBy: {
          price: sort,
        },
      });
    } else {
      filter = prisma.product.findMany({
        ...baseQuery,
        take: pagesize,
        skip: page,
      });
    }

    const [filterRes, allRes] = await Promise.all([
      filter,
      prisma.product.findMany(baseQuery),
    ]);

    const totalPages = Math.ceil(allRes.length / pagesize);

    return res.status(200).json({
      success: true,
      message: "product update success fully",
      data: filterRes,
      totalPages,
    });
  }
);
