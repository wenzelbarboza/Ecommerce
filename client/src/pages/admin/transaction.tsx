import { ReactElement, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import { useGetAllOrders } from "../../api/order.api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { useUserStore } from "../../zustand/userStore";

interface DataType {
  id: string;
  amount: number;
  discount: number;
  quantity: number;
  status: ReactElement;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "User ID",
    accessor: "id",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
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

const Transaction = () => {
  const user = useUserStore((state) => state.user);
  const { data, isLoading, isError } = useGetAllOrders(user?.id!);
  const [rows, setRows] = useState<DataType[]>([]);

  useEffect(() => {
    if (data?.data) {
      setRows(
        data.data.map((item) => {
          return {
            id: String(item.id),
            amount: item.total,
            discount: item.discount,
            status: <span className="red">{item.status}</span>,
            quantity: item.orderDetails.length,
            action: <Link to={`/admin/transaction/${item.id}`}>Manage</Link>,
          };
        })
      );
    }
  }, [data]);

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Transactions",
    rows.length > 6
  )();

  if (isLoading) return <h3 className=" text-xl">Table is loading...</h3>;

  if (isError) return <h3 className=" text-red-400 text-xl">Error...</h3>;

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{Table}</main>
    </div>
  );
};

export default Transaction;
