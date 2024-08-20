import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "../components/ui/button";
import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
// import { useAddress } from "../zustand/useAddress";
import { useCreateOrderMutatue } from "../api/order.api";
import { useCartStore } from "../zustand/useCartStore";
import { useUserStore } from "../zustand/userStore";

const stripePromise = loadStripe(
  "pk_test_51PkkQkAyOr5DFvqAY25qaIjE6wvt7TaHpJ9fcxERu1zV6wu8oYLLvdy2W7HZJ7vSttSF7cz76ddDdWcvzfHU5cUt00j7LtKp9z",
);

const CheckoutForm = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const createOrderMutaion = useCreateOrderMutatue();
  const cartStore = useCartStore();
  const userStore = useUserStore();

  // const { total, tax, discount, subTotal, cartItems, shipmentInfo } = cartInfo;

  console.log("the cartInfo is: ", cartStore);

  // console.log("the address is: ", addressStore.address);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    try {
      const result = await stripe.confirmPayment({
        //`Elements` instance that was used to create the Payment Element
        elements,
        confirmParams: {
          return_url: window.location.origin,
        },
        redirect: "if_required",
      });

      if (result.error) {
        throw result.error;
      }

      // TODO
      // make changes in order api so that you can delete order if paymanet failse
      // create order api - status pending
      // make payment
      // if payment success
      // order - status confirmed
      // if payent fail
      // delete order

      if (result.paymentIntent?.status === "succeeded") {
        console.log("Placing order");
        const res = await createOrderMutaion.mutateAsync({
          adressInfo: {
            address: cartStore.shipmentInfo.address,
            city: cartStore.shipmentInfo.city,
            country: cartStore.shipmentInfo.country,
            pinCode: cartStore.shipmentInfo.pinCode,
            state: cartStore.shipmentInfo.state,
          },
          discount: cartStore.discount,
          shippingCharges: cartStore.shipmentCharges,
          subtotal: cartStore.subTotal,
          tax: cartStore.tax,
          total: cartStore.total,
          userId: userStore.user?.id as string,
          orderDetails: cartStore.cartItems.map((item) => ({
            name: item.name,
            photo: item.photo,
            price: item.price,
            productId: Number(item.productId),
            quantity: item.quantity,
          })),
        });

        if (res.data) {
          console.log("the response from the mutetion is: ", res.data);
        }

        setIsProcessing(false);
        navigate("/orders");
      }
    } catch (error) {
      console.log(error || "error in stripe payment");
      setIsProcessing(false);
      toast.error("error in payment");
    }
  };

  // to test order api
  // TODO delete this function
  // const handlecreateorder = async () => {
  //   console.log("inside the creorder func");
  //   try {
  //     const res = await createOrderMutaion.mutateAsync({
  //       adressInfo: {
  //         address: cartStore.shipmentInfo.address,
  //         city: cartStore.shipmentInfo.city,
  //         country: cartStore.shipmentInfo.country,
  //         pinCode: cartStore.shipmentInfo.pinCode,
  //         state: cartStore.shipmentInfo.state,
  //       },
  //       discount: cartStore.discount,
  //       shippingCharges: cartStore.shipmentCharges,
  //       subtotal: cartStore.subTotal,
  //       tax: cartStore.tax,
  //       total: cartStore.total,
  //       userId: userStore.user?.id as string,
  //       orderDetails: cartStore.cartItems.map((item) => ({
  //         name: item.name,
  //         photo: item.photo,
  //         price: item.price,
  //         productId: Number(item.productId),
  //         quantity: item.quantity,
  //       })),
  //     });
  //
  //     console.log("mutation data is", res.data);
  //   } catch (error) {
  //     console.error(error || "problem in order creation");
  //   }
  // };

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <PaymentElement className="mb-3" />
        <Button className="w-full" disabled={isProcessing}>
          {isProcessing ? "processing.." : "submit"}
        </Button>
      </form>
      {/* test order api */}
      {/* <Button onClick={handlecreateorder}>button Visible</Button> */}
    </>
  );
};

const Checkout = () => {
  const location = useLocation();

  const clientSecret: string | undefined = location.state;

  if (!clientSecret) return <Navigate to={"/shipping"} />;

  return (
    <>
      <div className=" flex flex-1 items-center justify-center">
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
          }}
        >
          <CheckoutForm />
        </Elements>
      </div>
      <Toaster />
    </>
  );
};

export default Checkout;
