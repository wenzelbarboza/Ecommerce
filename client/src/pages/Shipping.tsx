import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../zustand/useCartStore";
import axios from "axios";
import { apiResponseType } from "../types/api.types";
import { useUserStore } from "../zustand/userStore";
import toast from "react-hot-toast";

const Shipping = () => {
  const navigate = useNavigate();
  const cartStore = useCartStore();
  // const addressStore = useAddress();
  const userStore = useUserStore();

  console.log("cart store is : ", cartStore);

  console.log("this is the cart length ", cartStore.cartItems.length);

  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
  });

  const changeHandler = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    setShippingInfo((prev) => {
      return {
        ...prev,
        [event.target.name]: event.target.value,
      };
    });
  };

  useEffect(() => {
    if (cartStore.cartItems.length == 0) {
      navigate("/");
    }
  }, [cartStore.cartItems]);

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { pinCode, country, city, state, address } = shippingInfo;

    if (!pinCode || !country || !city || !state || !address) {
      toast.error("all form fields are necessary");
      return;
    }

    try {
      const res = await axios.post<apiResponseType<string>>(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/payment/create`,
        { amount: cartStore.total }
      );

      cartStore.setAddress({
        address: address,
        // userId: userStore.user?.id as string,
        state: state,
        city: city,
        country: country,
        pinCode: pinCode,
      });

      // addressStore.setAddress({
      //   address: address,
      //   userId: userStore.user?.id as string,
      //   state: state,
      //   city: city,
      //   country: country,
      //   pinCode: Number(pinCode),
      // });

      navigate("/pay", {
        state: res.data.data,
      });
    } catch (error) {
      console.error(error || "shipping address error");
    }
  };

  // const handleAddress = () => {
  //   addressStore.setAddress({
  //     address: "testaddress",
  //     state: "testState",
  //     city: "testvalue",
  //     country: "testvalue",
  //     userId: "testvalue",
  //     pinCode: 11,
  //   });
  //   console.log("address is set");
  // };

  return (
    <>
      {cartStore.cartItems.length == 0 ? (
        <h1>YOUR CART IS EMPTY</h1>
      ) : (
        <div className="flex flex-col w-full custom-container ">
          <div className="mt-1 ">
            <Button className="" onClick={() => navigate(-1)}>
              <FaArrowLeft className="my-0 mr-1" /> Back
            </Button>
          </div>
          {/* <button className="back-btn" onClick={() => navigate("/cart")}>
        <BiArrowBack />
      </button> */}
          <div className="flex-1 flex flex-col justify-center items-center w-full ">
            <div className="w-60 sm:w-80">
              <form
                onSubmit={submitHandler}
                className=" flex flex-col items-stretch gap-4"
              >
                <h1 className="text-center text-xl">Shipping Address</h1>

                <input
                  className="border-[1px] border-gray-400 rounded-sm p-1"
                  required
                  type="text"
                  placeholder="Address"
                  name="address"
                  value={shippingInfo.address}
                  onChange={changeHandler}
                />

                <input
                  className="border-[1px] border-gray-400 rounded-sm p-1"
                  required
                  type="text"
                  placeholder="City"
                  name="city"
                  value={shippingInfo.city}
                  onChange={changeHandler}
                />

                <input
                  className="border-[1px] border-gray-400 rounded-sm p-1"
                  required
                  type="text"
                  placeholder="State"
                  name="state"
                  value={shippingInfo.state}
                  onChange={changeHandler}
                />

                <select
                  className="border-[1px] border-gray-400 rounded-sm p-1"
                  name="country"
                  required
                  value={shippingInfo.country}
                  onChange={changeHandler}
                >
                  <option value="">Select Country</option>
                  <option value="india">India</option>
                </select>

                <input
                  className="border-[1px] border-gray-400 rounded-sm p-1"
                  required
                  type="number"
                  placeholder="Pin Code"
                  name="pinCode"
                  value={shippingInfo.pinCode}
                  onChange={changeHandler}
                />
                <br />
                <Button type="submit">Pay Now</Button>
              </form>
            </div>
          </div>
          {/* <Button onClick={handleAddress}>setAddress</Button> */}
        </div>
      )}
    </>
  );
};

export default Shipping;
