export type User = {
  name: string;
  email: string;
  photo: string;
  gender: string;
  role?: string;
  dob: string;
  id: string;
};

export type userResponseType = {
  success: boolean;
  data: User;
};

export type MessageResponseType = {
  success: boolean;
  message: string;
};

export type productData = {
  id: string;
  name: string;
  photo: string;
  price: number;
  stock: number;
  category: string;
  createdAt: string;
  updatedAt: string;
};

export type ProductResponseType = {
  success: boolean;
  message: string;
  data: productData[];
};

export type apiError = {
  success: boolean;
  message: string;
};

export type apiResponseType<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type apiResponseSearchType<T> = apiResponseType<T> & {
  totalPages: number;
};
