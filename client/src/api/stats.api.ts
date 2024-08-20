import { useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import {
  apiResponseType,
  barApiReturn,
  lineApiReturn,
  pieChartApiReturn,
  statsReturnType,
} from "../types/api.types";

const base = import.meta.env.VITE_SERVER_BASE_URL + "/api/v1/dashboard";

export const useStatsQuerry = () => {
  const fetchData = async () => {
    const apiRoute = "/stats";

    const res: AxiosResponse<apiResponseType<statsReturnType>> =
      await axios.get(`${base}/${apiRoute}`);
    return res.data;
  };

  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => fetchData(),
  });
};

export const useLineChart = () => {
  const apiRoute = "/line";
  const fetchData = async () => {
    return (
      await axios.get<apiResponseType<lineApiReturn>>(`${base}/${apiRoute}`)
    ).data;
  };
  return useQuery({
    queryKey: ["line-chart"],
    queryFn: fetchData,
  });
};

export const useBarChart = () => {
  const apiRoute = "/bar";
  const fetchData = async () => {
    return (
      await axios.get<apiResponseType<barApiReturn>>(`${base}/${apiRoute}`)
    ).data;
  };
  return useQuery({
    queryKey: ["bar-chart"],
    queryFn: fetchData,
  });
};

export const usePieChart = () => {
  const apiRoute = "/pie";
  const fetchData = async () => {
    return (
      await axios.get<apiResponseType<pieChartApiReturn>>(`${base}/${apiRoute}`)
    ).data;
  };
  return useQuery({
    queryKey: ["pie-chart"],
    queryFn: fetchData,
  });
};
