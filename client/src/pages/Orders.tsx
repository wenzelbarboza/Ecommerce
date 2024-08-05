import { ReactElement, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import TableHOC from "../components/admin/TableHOC";
import { useMyOrderQuerry } from "../api/order.api";
import { useUserStore } from "../zustand/userStore";

type DataType = {
  _id: string;
  amount: number;
  quantity: number;
  discount: number;
  status: ReactElement;
  action: ReactElement;
};

const column: Column<DataType>[] = [
  {
    Header: "ID",
    accessor: "_id",
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
    accessor: "amount",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Orders = () => {
  const user = useUserStore((state) => state.user);
  const { data, isLoading, isError } = useMyOrderQuerry(user?.id!);
  const [rows, setRows] = useState<DataType[]>([]);

  useEffect(() => {
    if (data?.data) {
      setRows(
        data.data.map((i) => {
          return {
            _id: String(i.id),
            amount: i.total,
            discount: i.discount,
            quantity: i.orderDetails.length,
            status: (
              <span
                className={
                  i.status === "Processing"
                    ? "red"
                    : i.status === "Shipped"
                    ? "green"
                    : "purple"
                }
              >
                {i.status}
              </span>
            ),
            action: <Link to={`/admin/transaction/${i.id}`}>Manage</Link>,
          };
        })
      );
    }
  }, [data]);

  const Table = TableHOC<DataType>(
    column,
    rows,
    "dashboard-product-box",
    "Orders",
    rows.length > 6
  )();

  if (isLoading) return <h3 className=" text-xl">Table is loading...</h3>;

  if (isError) return <h3 className=" text-red-400 text-xl">Error...</h3>;

  return (
    <div className="bg-yellow-200 flex custom-container">
      <div className="flex-1">{Table}</div>
    </div>
  );
};

export default Orders;
