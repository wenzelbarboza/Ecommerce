import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { User } from "../types/api.types";

type userStateType = {
  loading: boolean;
  user: User | null;
  setLoading: (isLoading: boolean) => void;
  setUser: (userState: User | null) => void;
};

export const useUserStore = create<userStateType>()(
  devtools((set) => ({
    loading: true,
    user: null,
    setLoading: (isLoading) => set({ loading: isLoading }),
    setUser: (userState) => set({ user: userState }),
  }))
);
