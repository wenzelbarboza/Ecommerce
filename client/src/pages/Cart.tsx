import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useValidateCupon } from "../api/product.api";
import CartItem from "../components/CartItem";
import { buttonVariants } from "../components/ui/button";
import useDebounce from "../lib/useDebounce";
import { useCartStore } from "../zustand/useCartStore";
// import { useMyOrderMutate } from "../api/order.api";

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
  const [couponCode, setCouponCode] = useState("");
  // const [isValidCouponCode, setIsValidCouponCode] = useState(true);
  const [debounceCuponCode] = useDebounce(couponCode, 500);

  console.log("this is the debounce value: ", debounceCuponCode);

  const { data: discountData } = useValidateCupon(debounceCuponCode);

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
    if (discountData) {
      console.log("discountData is: ", discountData);
      cartStore.updateDiscount(discountData.data);
    }
    cartStore.calculatePrice();
  }, [cartStore.cartItems, discountData]);

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
            (discountData?.success ? (
              <span className="green">
                ₹{cartStore.discount} off using the <code>{couponCode}</code>
              </span>
            ) : (
              <span className="text-red-400">Invalid Coupon</span>
            ))}

          {cartStore.cartItems.length > 0 && (
            <Link className={buttonVariants()} to="/shipping">
              Checkout
            </Link>
          )}
          {/* test */}
          {/* <button onClick={() => handleMyOrder()}>handelCreateOrder</button> */}
          {/* test end */}
        </div>
      </aside>
    </div>
  );
};

export default Cart;
