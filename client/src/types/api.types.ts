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

// CREATE ORDER TYPES
export type addressType = {
  address: string;
  city: string;
  country: string;
  pinCode: number;
  state: string;
  userId: string;
};

export type orderDetails = {
  productId: number;
  name: string;
  photo: string;
  quantity: number;
  price: number;
};

export type newOrderType = {
  userId: string;
  adressInfo: addressType;
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  orderDetails: orderDetails[];
};

export type orderDetailResponse = {
  id: number;
  orderId: number;
  productId: number;
  name: string;
  photo: string;
  quantity: number;
  price: number;
};

export type orderResponesType = {
  id: number;
  userId: string;
  addressId: number;
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

export type createOrderResponseType = {
  success: boolean;
  message: string;
  data: orderResponesType & { orderDetails: orderDetailResponse[] };
};
