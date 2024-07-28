import {
  MutationFunction,
  UseQueryResult,
  keepPreviousData,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import {
  apiResponseSearchType,
  apiResponseType,
  productData,
  ProductResponseType,
} from "../types/api.types";

const base = import.meta.env.VITE_SERVER_BASE_URL + "/api/v1";

type getLatestProdType = () => UseQueryResult<ProductResponseType, Error>;

export const useGetLatestProd: getLatestProdType = () => {
  const fetchLatestProducts = async () => {
    const apiRoute = "product/latest";

    const res: AxiosResponse<ProductResponseType> = await axios.get(
      `${base}/${apiRoute}`
    );
    return res.data;
  };

  return useQuery({
    queryKey: ["latestProducts"],
    queryFn: () => fetchLatestProducts(),
  });
};

export const useGetAllProd = (id: string | undefined) => {
  const getAllProd = async () => {
    const apiRoute = "product/all";
    const res: AxiosResponse<ProductResponseType> = await axios.get(
      `${base}/${apiRoute}?id=${id}`
    );
    return res.data;
  };

  return useQuery({
    queryKey: ["all-products"],
    queryFn: () => getAllProd(),
  });
};

export const useGetCatagories = () => {
  const getCatagories = async () => {
    const apiRoute = "product/catagories";
    const res: AxiosResponse<apiResponseType<Array<string>>> = await axios.get(
      `${base}/${apiRoute}`
    );
    return res.data;
  };

  return useQuery({
    queryKey: ["product-categories"],
    queryFn: () => getCatagories(),
  });
};

type searchProductProps = {
  search: string;
  category: string;
  price: number;
  sort: string;
  page: number;
};

export const useSearchProducts = ({
  search,
  category,
  price,
  sort,
  page,
}: searchProductProps) => {
  console.log(
    `search: ${search}, category: ${category}, price: ${price}, sort: ${sort}, page: ${page} `
  );

  const getCatagories = async () => {
    let apiRoute = `product/search?search=${search}&page=${page}`;

    if (category) apiRoute += `&category=${category}`;
    if (price) apiRoute += `&price=${price}`;
    if (sort) apiRoute += `&sort=${sort}`;

    const res: AxiosResponse<apiResponseSearchType<productData>> =
      await axios.get(`${base}/${apiRoute}`);
    return res.data;
  };

  return useQuery({
    queryKey: ["search-products", search, category, price, sort, page],
    queryFn: () => getCatagories(),
    placeholderData: keepPreviousData,
  });
};

export const useCreateProductMutation = () => {
  const mutFunction = async ({
    id,
    formData,
  }: {
    id: string;
    formData: FormData;
  }) => {
    const apiRoute = "product/new";
    const res: AxiosResponse<apiResponseType<productData>> = await axios.post(
      `${base}/${apiRoute}?id=${id}`,
      formData
    );
    return res.data;
  };

  return useMutation({
    mutationKey: ["create-product"],
    mutationFn: mutFunction,
  });
};
