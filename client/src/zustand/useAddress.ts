import { create } from "zustand";
import { devtools } from "zustand/middleware";

type addressType = {
  address: string;
  city: string;
  country: string;
  pinCode: number;
  state: string;
  userId: string;
};

type addressStore = {
  address: addressType;
  setAddress: (address: addressType) => void;
};

export const useAddress = create<addressStore>()(
  devtools((set) => ({
    address: {
      address: "",
      city: "",
      country: "",
      pinCode: 0,
      state: "",
      userId: "",
    },
    setAddress: (address: addressType) => {
      set(() => ({ address: address }));
    },
  })),
);
