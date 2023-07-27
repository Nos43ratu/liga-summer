import { create } from "zustand";

type UserStateStore = {
  balance: number;
  is_lost: boolean;

  set_balance: (balance: number) => void;
  set_is_lost: (is_lost: boolean) => void;
};

export const useUserStateStore = create<UserStateStore>((set, get) => ({
  balance: 1000,
  is_lost: false,

  set_balance: (balance: number) => {
    console.log(balance);
    set((state) => ({ balance }));
  },
  set_is_lost: (is_lost: boolean) => {
    set((state) => ({ is_lost }));
  },
}));
