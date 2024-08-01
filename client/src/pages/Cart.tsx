import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { buttonVariants } from "../components/ui/button";
import CartItem from "../components/CartItem";
import { useCartStore } from "../zustand/useCartStore";

// TODO: remove this
type Item = {
  productId: string;
  photo: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
};

const Cart = () => {
  const cartItems = [
    {
      productId: "jkfdjslD",
      photo: "https://m.media-amazon.com/images/I/61Qe0euJJZL._SX679_.jpg",
      name: "some book",
      price: 999,
      quantity: 1,
      stock: 20,
    },
  ];

  const [couponCode, setCouponCode] = useState("");
  const [isValidCouponCode, setIsValidCouponCode] = useState(true);

  const cartStore = useCartStore();

  const decrementHandler = (item: Item) => {
    if (item.quantity <= 1) return;
    cartStore.decrementQuantity(item.productId);

    console.log("decrementHandler clicked");
  };

  const incrementHandler = (item: Item) => {
    if (item.quantity >= item.stock) return;

    cartStore.incrementQuantity(item.productId);
    console.log("incrementHandler clicked");
  };

  const deletehandler = (item: Item) => {
    cartStore.deleteCartItem(item.productId);
  };

  useEffect(() => {
    cartStore.calculatePrice();
  }, [cartStore.cartItems]);

  return (
    <div className="flex custom-container">
      <main className=" flex-[2] no-scrollbar mt-5">
        {cartStore.cartItems.map((item) => {
          return (
            <CartItem
              decrementHandler={decrementHandler}
              deletehandler={deletehandler}
              incrementHandler={incrementHandler}
              item={item}
              key={item.productId}
            />
          );
        })}
      </main>
      <aside className=" flex-1 flex mt-10 justify-center relative">
        <div className="flex flex-col gap-3">
          <p>Subtotal: ₹{cartStore.subTotal}</p>
          <p>Shipping Charges: ₹{cartStore.shipmentCharges}</p>
          <p>Tax: ₹{cartStore.tax}</p>
          <p>
            Discount: <em className="red"> - ₹{cartStore.discount}</em>
          </p>
          <p>
            <b>Total: ₹{cartStore.total}</b>
          </p>

          <input
            className=" bg-transparent border-[1px] border-solid border-gray-400 p-1 rounded-sm"
            type="text"
            placeholder="Coupon Code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />

          {couponCode &&
            (isValidCouponCode ? (
              <span className="green">
                ₹{cartStore.discount} off using the <code>{couponCode}</code>
              </span>
            ) : (
              <span className="text-red-400">Invalid Coupon</span>
            ))}

          {cartItems.length > 0 && (
            <Link className={buttonVariants()} to="/shipping">
              Checkout
            </Link>
          )}
        </div>
      </aside>
    </div>
  );
};

export default Cart;
