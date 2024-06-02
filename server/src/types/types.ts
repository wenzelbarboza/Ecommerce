import { NextFunction, Request, Response } from "express";

export type NewUserRequestBody = {
  id: string;
  name: string;
  email: string;
  photo: string;
  // role: "USER" | "ADMIN";
  // gender: "MALE" | "FEMALE";
  role: Role;
  gender: Gender;
  dob: Date;
};

enum Role {
  // "USER",
  // "ADMIN",
  USER = "USER",
  ADMIN = "ADMIN",
}

enum Gender {
  // "MALE",
  // "FEMALE",
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export type NewUserControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<Response<any, Record<string, any>>> | Promise<any>;

export type adminQueryType = {
  id: string;
};

// product
export type NewProductRequestBody = {
  name: string;
  // photo: string;
  price: number;
  stock: number;
  category: string;
};

export interface productSearchQueryParams {
  search?: string;
  sort?: Sort;
  category?: string;
  price?: number;
  page?: number;
}

enum Sort {
  ASC = "asc",
  DESC = "desc",
}

type allProductProperties = NewProductRequestBody & {
  createdAt: Date;
  updatedAt: Date;
};

type allPropertiesUnion = keyof allProductProperties;

export type baseQueryType = {
  where?: {
    name?: {
      contains: string;
    };
    price?: {
      lte: number;
    };
    category?: string;
  };
  orderBy?: {
    [K in allPropertiesUnion]?: "asc" | "desc";
  };
  take?: number;
  skip?: number;
};

export type invalidateOptionTypes = {
  product?: boolean;
  order?: boolean;
  admin?: boolean;
};
