import { create } from "zustand";
import { devtools } from "zustand/middleware";

type cartItem = {
  productId: string;
  photo: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
};

type shipmentInfo = {
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
};

type cartStoreInitialState = {
  loading: boolean;
  cartItems: cartItem[];
  subTotal: number;
  tax: number;
  shipmentCharges: number;
  discount: number;
  total: number;
  shipmentInfo: shipmentInfo;
  setCartItems: (newItem: cartItem) => void;
  deleteCartItem: (productId: string) => void;
  incrementQuantity: (productId: string) => void;
  decrementQuantity: (productId: string) => void;
  calculatePrice: () => void;
  updateDiscount: (discount: number) => void;
};

export const useCartStore = create<cartStoreInitialState>()(
  devtools((set) => ({
    loading: false,
    cartItems: [],
    subTotal: 0,
    tax: 0,
    shipmentCharges: 0,
    discount: 0,
    total: 0,
    shipmentInfo: {
      address: "",
      city: "",
      state: "",
      country: "",
      pinCode: "",
    },
    setCartItems: (newItem: cartItem) =>
      set((state) => {
        console.log("inside set cart and this is the item received: ", newItem);
        let updatedCartItems: cartItem[];

        const oldItemIndex = state.cartItems.findIndex(
          (item) => item.productId == newItem.productId
        );

        console.log("this is old index: ", oldItemIndex);

        if (oldItemIndex !== -1) {
          // updatedCartItems = state.cartItems.map((item, index) => {
          //   return index == oldItemIndex
          //     ? { ...item, quantity: item.quantity + newItem.quantity }
          //     : item;
          // });
          // No change since we already have the item in the cart
          updatedCartItems = state.cartItems;
        } else {
          updatedCartItems = [...state.cartItems, newItem];
        }

        const newState = {
          ...state,
          cartItems: updatedCartItems,
        };

        console.log("this is new state", JSON.stringify(newState));

        return newState;
      }),
    deleteCartItem: (productId: string) =>
      set((state) => {
        console.log("inside delete cart item");

        console.log("product id is: ", productId);

        const updatedCartItems = state.cartItems.filter(
          (item) => item.productId != productId
        );

        console.log("item delete");

        return {
          ...state,
          cartItems: [...updatedCartItems],
        };
      }),
    incrementQuantity: (productId: string) =>
      set((state) => {
        const updatedItms = state.cartItems.map((item) => {
          let result: cartItem;

          if (item.productId == productId) {
            result = {
              ...item,
              quantity: item.quantity + 1,
            };
          } else {
            result = item;
          }

          return result;
        });

        return {
          ...state,
          cartItems: [...updatedItms],
        };
      }),
    decrementQuantity: (productId: string) =>
      set((state) => {
        const updatedItems = state.cartItems.map((item) => {
          if (item.productId == productId) {
            return {
              ...item,
              quantity: item.quantity - 1,
            };
          } else {
            return item;
          }
        });

        return {
          ...state,
          cartItems: [...updatedItems],
        };
      }),
    calculatePrice: () =>
      set((state) => {
        const subTotal = state.cartItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
        const shipmentCharges = subTotal > 1000 ? 0 : 200;
        const tax = Math.round(subTotal * 0.18);
        const total = subTotal + tax + shipmentCharges - state.discount;

        return {
          ...state,
          subTotal,
          shipmentCharges,
          tax,
          total,
        };
      }),
    updateDiscount: (discount: number) =>
      set((state) => {
        return {
          ...state,
          discount: discount,
        };
      }),
  }))
);
