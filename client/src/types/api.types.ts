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
  pinCode: string;
  state: string;
  // userId: string;
};

export type addressResponseType = {
  id: number;
  userId: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: number;
};

export type userResponseTypeforDetails = {
  id: string;
  name: string;
  email: string;
  photo: string;
  role: string;
  gender: string;
  dob: Date;
  createdAt: string;
  updatedAt: string;
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

// stats types

export type statsReturnType = {
  growthData: {
    productGrowth: string;
    orderGrowth: string;
    userGrowth: string;
    revenueGrowth: string;
  };
  count: {
    revenue: string;
    product: string;
    user: string;
    order: string;
  };
  charts: {
    order: string[];
    revenue: string[];
  };
  catagoryPercentage: {};
  genderRatio: {
    male: string;
    female: string;
  };
  LatestTransaction: {
    quantity: string;
    discount: string;
    total: string;
    status: "Processing" | "Shipped" | "Delivered";
    id: string;
  }[];
};

export type lineApiReturn = {
  products: number[];
  users: number[];
  revene: number[];
  discount: number[];
};

export type barApiReturn = {
  orders: number[];
  products: number[];
  users: number[];
};

export type pieChartApiReturn = {
  orderFullfillmentStatus: {
    ordersPrcessing: number;
    ordersShipped: number;
    ordersDelivered: number;
  };
  categoryPercentage: {
    [key: string]: number;
  };
  inventoryCount: {
    outOfStock: number;
    inStock: number;
  };
  revenueDistribution: {
    [key: string]: number;
  };
  adminCustomer: {
    admin: number;
    customer: number;
  };
  ageDistribution: {
    teen: number;
    audult: number;
    old: number;
  };
};
