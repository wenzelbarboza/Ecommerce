import { FaTrash } from "react-icons/fa";
import { Link, Navigate, useParams } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { orderDetailResponse } from "../../../types/api.types";
import { useGetOrderDetails } from "../../../api/order.api";
import { useUserStore } from "../../../zustand/userStore";

const img =
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8MHx8&w=1000&q=804";

type transactionOrderType = {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: number;
  status: string;
  subtotal: number;
  discount: number;
  shippingCharges: number;
  tax: number;
  total: number;
  orderItems: orderDetailResponse[];
};

const defaultOrder: transactionOrderType = {
  name: "",
  address: "",
  city: "",
  state: "",
  country: "",
  pinCode: 0,
  status: "",
  subtotal: 0,
  discount: 0,
  shippingCharges: 0,
  tax: 0,
  total: 0,
  orderItems: [],
};

// const [order, setOrder] = useState({
//   name: "Puma Shoes",
//   address: "77 black street",
//   city: "Neyword",
//   state: "Nevada",
//   country: "US",
//   pinCode: 242433,
//   status: "Processing",
//   subtotal: 4000,
//   discount: 1200,
//   shippingCharges: 0,
//   tax: 200,
//   total: 4000 + 200 + 0 - 1200,
//   orderItems,
// });

const TransactionManagement = () => {
  const { id } = useParams();
  console.log("the params id is: ", id);
  const user = useUserStore((state) => state.user);

  const { data, isError, isLoading } = useGetOrderDetails({
    productId: Number(id),
    adminId: user?.id!,
  });

  const orderItems = data?.data.orderDetails || [];

  const {
    name,
    address,
    city,
    country,
    state,
    pinCode,
    subtotal,
    shippingCharges,
    tax,
    discount,
    total,
    status,
  } = data?.data
    ? {
        name: data.data.user.name,
        address: data.data.address.address,
        city: data.data.address.city,
        country: data.data.address.country,
        state: data.data.address.state,
        pinCode: data.data.address.pinCode,
        subtotal: data.data.subtotal,
        shippingCharges: data.data.shippingCharges,
        tax: data.data.tax,
        discount: data.data.discount,
        total: data.data.total,
        status: data.data.status,
      }
    : defaultOrder;

  const updateHandler = (): void => {};

  const deleteHandler = () => {};

  if (isError) return <Navigate to="/404" />;

  return (
    <div className="admin-container">
      <AdminSidebar />
      {isLoading ? (
        <h1 className=" text-xl">Loading...</h1>
      ) : (
        <main className="product-management">
          <section
            style={{
              padding: "2rem",
            }}
          >
            <h2>Order Items</h2>

            {orderItems.map((i) => (
              <ProductCard
                key={i.id}
                name={i.name}
                photo={`${import.meta.env.VITE_SERVER_BASE_URL}/${i.photo}`}
                productId={i.productId}
                id={i.id}
                quantity={i.quantity}
                price={i.price}
              />
            ))}
          </section>

          <article className="shipping-info-card">
            <button className="product-delete-btn" onClick={deleteHandler}>
              <FaTrash />
            </button>
            <h1>Order Info</h1>
            <h5>User Info</h5>
            <p>Name: {name}</p>
            <p>
              Address: {`${address}, ${city}, ${state}, ${country} ${pinCode}`}
            </p>
            <h5>Amount Info</h5>
            <p>Subtotal: {subtotal}</p>
            <p>Shipping Charges: {shippingCharges}</p>
            <p>Tax: {tax}</p>
            <p>Discount: {discount}</p>
            <p>Total: {total}</p>

            <h5>Status Info</h5>
            <p>
              Status:{" "}
              <span
                className={
                  status === "Delivered"
                    ? "purple"
                    : status === "Shipped"
                    ? "green"
                    : "red"
                }
              >
                {status}
              </span>
            </p>
            <button className="shipping-btn" onClick={updateHandler}>
              Process Status
            </button>
          </article>
        </main>
      )}
    </div>
  );
};

const ProductCard = ({
  name,
  photo,
  price,
  quantity,
  productId,
}: Omit<orderDetailResponse, "orderId">) => (
  <div className="transaction-product-card">
    <img src={photo} alt={name} />
    <Link to={`/product/${productId}`}>{name}</Link>
    <span>
      ₹{price} X {quantity} = ₹{price * quantity}
    </span>
  </div>
);

export default TransactionManagement;
