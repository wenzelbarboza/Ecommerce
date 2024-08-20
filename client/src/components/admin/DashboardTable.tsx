import { Column } from "react-table";
import TableHOC from "./TableHOC";
import { statsReturnType } from "../../types/api.types";

type dataType = {
  quantity: string;
  discount: string;
  total: string;
  status: "Processing" | "Shipped" | "Delivered";
  id: string;
};

const columns: Column<dataType>[] = [
  {
    Header: "Id",
    accessor: "id",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
  },
  {
    Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Amount",
    accessor: "total",
  },
  {
    Header: "Status",
    accessor: "status",
  },
];

const DashboardTable = ({
  data = [],
}: {
  data: statsReturnType["LatestTransaction"];
}) => {
  return TableHOC<dataType>(
    columns,
    data,
    "transaction-box",
    "Top Transaction",
  )();
};

export default DashboardTable;
