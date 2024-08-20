import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  apiResponseType,
  orderResponesType,
  newOrderType,
  orderDetails,
  orderDetailResponse,
  addressResponseType,
  userResponseTypeforDetails,
} from "../types/api.types";

const orderBase = `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/order`;

// type useCreateOrderMutatue = () => UseMutationResult<
//   AxiosResponse<orderResponseType, any>,
//   Error,
//   newOrderType,
//   unknown
// >;

export const useCreateOrderMutatue = () => {
  const func = async (data: newOrderType) => {
    return (
      await axios.post<apiResponseType<orderResponesType>>(
        `${orderBase}/new`,
        data
      )
    ).data;
  };

  return useMutation({
    mutationFn: (data: newOrderType) => func(data),
  });
};

type myOrdersResponeType = orderResponesType & {
  orderDetails: orderDetailResponse[];
};

export const useMyOrderQuerry = (userId: string) => {
  const func = async () => {
    return (
      await axios.get<apiResponseType<myOrdersResponeType[]>>(
        `${orderBase}/my?id=${userId}`
      )
    ).data;
  };

  return useQuery({
    queryKey: ["my-orders", userId],
    queryFn: func,
  });
};

type allOrdersResponeType = orderResponesType & {
  orderDetails: orderDetailResponse[];
};

export const useGetAllOrders = (userId: string) => {
  const func = async () => {
    return (
      await axios.get<apiResponseType<allOrdersResponeType[]>>(
        `${orderBase}/all?id=${userId}`
      )
    ).data;
  };

  return useQuery({
    queryKey: ["all-orders", userId],
    queryFn: func,
  });
};

type orderDetailsType = orderResponesType & {
  address: addressResponseType;
  user: userResponseTypeforDetails;
  orderDetails: orderDetailResponse[];
};

export const useGetOrderDetails = ({
  productId,
  adminId,
}: {
  productId: number;
  adminId: string;
}) => {
  const func = async () => {
    return (
      await axios.get<apiResponseType<orderDetailsType>>(
        `${orderBase}/${productId}?id=${adminId}`
      )
    ).data;
  };

  return useQuery({
    queryKey: ["order-details", productId, adminId],
    queryFn: func,
  });
};

export const useUpdateOrderMutation = () => {
  const func = async ({
    adminId,
    orderId,
  }: {
    adminId: string;
    orderId: number;
  }) => {
    return (
      await axios.put<apiResponseType<orderResponesType>>(
        `${orderBase}/${orderId}?id=${adminId}`
      )
    ).data;
  };

  return useMutation({
    mutationFn: func,
  });
};

export const useDeleteOrderMutation = () => {
  const func = async ({
    adminId,
    orderId,
  }: {
    adminId: string;
    orderId: number;
  }) => {
    return (
      await axios.delete<apiResponseType<orderResponesType>>(
        `${orderBase}/${orderId}?id=${adminId}`
      )
    ).data;
  };

  return useMutation({
    mutationFn: func,
  });
};

//test the create ored

// const createOrderMutate = useCreateOrderMutatue();

// const handelCreateOrder = async () => {
//   const res = await createOrderMutate.mutateAsync({
//     userId: "dfjsdjfkjikjfddh1",
//     //   addressId       Int
//     adressInfo: {
//       address: "address01",
//       city: "city01",
//       country: "country01",
//       pinCode: 1,
//       state: "state01",
//       userId: "dfjsdjfkjikjfddh1",
//     },
//     subtotal: 3020,
//     tax: 13.2,
//     shippingCharges: 25,
//     discount: 1,
//     total: 3300,
//     orderDetails: [
//       {
//         productId: 4,
//         name: "macbook",
//         photo: "uploads/aee5b60c-505b-49de-bb83-a770d80e7e4f.jpg",
//         quantity: 1,
//         price: 999,
//       },
//     ],
//   });

//   console.log("the response of create product mutation is: ", res.data);
// };

// //test End

// // test myOrder

// const MyOrderQuerry = useMyOrderMutate();

// const handleMyOrder = async () => {
//   console.log("--------inside MyOrder function -----------------");
//   const res = await MyOrderQuerry.mutateAsync("dfjsdjfkjikjfddh1");

//   console.log(res.data);
// };

// //end test
