import { Request } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { NewProductRequestBody } from "../types/types.js";
import { PrismaClient } from "@prisma/client";
import { ApiError } from "../utils/apiError.js";
import { rm } from "fs";
import { error } from "console";

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
    res.status(201).json({
      success: true,
      message: "product created successfully",
      newProduct,
    });
  }
);

export const getLatestProducts = asyncHandler(async (req, res) => {
  const latestProductResponse = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  return res.status(200).json({
    success: true,
    message: "fetched the latest record",
    data: latestProductResponse[0],
  });
});

export const getProducts = asyncHandler(async (req, res) => {
  const productsResponse = await prisma.product.findMany({
    take: 10,
  });

  return res.status(200).json({
    success: true,
    message: "fetched the latest record",
    data: productsResponse,
  });
});

export const getProductCatagories = asyncHandler(async (req, res) => {
  const catagoriesResponse = await prisma.product.findMany({
    distinct: "category",
    select: {
      category: true,
    },
  });

  const catagoryList = catagoriesResponse.map((ele) => ele.category);

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

    const detailsRes = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!detailsRes) {
      throw new ApiError("provide a valid id", 400);
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

    return res.status(200).json({
      success: true,
      message: "user data found",
      data: deleteRes,
    });
  }
);

// export const updateProduct = asyncHandler(
//   async (req: Request<{ id: string }>, res) => {
//     let id: string | number = req.params.id;

//     const { name, price, stock, category } = req.body;

//     const photo = req.file;

//     if (!req.params.id && Number(id)) {
//       if (photo) {
//         rm(photo.path, () => {
//           console.log("request failed, photo deleted from storage");
//         });
//       }
//       throw new ApiError("please provide an intiger id");
//     }

//     id = Number(id);

//     const product = await prisma.product.findUnique({
//       where: {
//         id,
//       },
//     });

//     if (!product) {
//       if (photo) {
//         rm(photo.path, () => {
//           console.log("request failed, photo deleted from storage");
//         });
//       }
//       throw new ApiError("provide a valid id", 400);
//     }

//     if (photo) {
//       rm(product.photo, () => {
//         console.log("old photo deleted");
//       });
//       product.photo = photo.path;
//     }
//     // name, price, stock, catagory
//     if (name) product.name = name;
//     if (price) product.price = price;
//     if (stock) product.stock = stock;
//     if (category) product.category = category;

//     const updatedProduct = await prisma.product.update({
//       where: {
//         id,
//       },
//       data: {
//         name: product.name,
//         price: product.price,
//         stock: product.stock,
//         category: product.category,
//         photo: product.photo,
//       },
//     });

//     return res.status(200).json({
//       success: true,
//       message: "product update success fully",
//       data: updatedProduct,
//     });
//   }
// );
