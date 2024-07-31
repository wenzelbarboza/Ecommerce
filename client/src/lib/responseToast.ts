import toast from "react-hot-toast";
// import { apiResponseType, productData } from "../types/api.types";
import { NavigateFunction } from "react-router-dom";
import { apiResponseType, productData } from "../types/api.types";

type paramsType = {
  res: apiResponseType<productData[] & { toatlPages?: number }>;
  navigate: NavigateFunction;
  url: string;
};

export const responseToast = ({ res, navigate, url }: paramsType) => {
  if (res.success) {
    toast.success(res.message);
    if (navigate) navigate(url);
  } else {
    toast.error(res.message);
  }
};
