import { ReactElement, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import { useGetAllProd } from "../../api/product.api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { CardSkeletonLoader } from "../../components/CardSkeletonLoader";
import { useUserStore } from "../../zustand/userStore";

interface DataType {
  photo: ReactElement;
  name: string;
  price: number;
  stock: number;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Photo",
    accessor: "photo",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Price",
    accessor: "price",
  },
  {
    Header: "Stock",
    accessor: "stock",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Products = () => {
  const userStore = useUserStore();

  console.log("user from store is: ", userStore.user);

  const { data, isError, isLoading, error } = useGetAllProd(userStore.user?.id);
  const [rows, setRows] = useState<DataType[]>([]);

  if (isError) toast.error(error.message);

  useEffect(() => {
    if (data?.data) {
      setRows(
        data.data.map((item) => {
          return {
            photo: (
              <img
                src={`${import.meta.env.VITE_SERVER_BASE_URL}/${item.photo}`}
                alt="Shoes"
              />
            ),
            name: item.name,
            price: item.price,
            stock: item.stock,
            action: <Link to={`/admin/product/${item.id}`}>Manage</Link>,
          };
        })
      );
    }
  }, [data]);

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Products",
    rows.length > 6
  )();

  return (
    <>
      <div className="admin-container">
        <AdminSidebar />
        {isLoading ? <CardSkeletonLoader /> : <main>{Table}</main>}
        <Link to="/admin/product/new" className="create-product-btn">
          <FaPlus />
        </Link>
      </div>
      <Toaster />
    </>
  );
};

export default Products;
