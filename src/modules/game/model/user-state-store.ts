import { create } from "zustand";

type UserStateStore = {
  balance: number;
  is_lost: boolean;
  is_won: boolean;

  set_balance: (balance: number) => void;
  set_is_lost: (is_lost: boolean) => void;
  set_is_won: (is_won: boolean) => void;
};

export const useUserStateStore = create<UserStateStore>((set, get) => ({
  balance: 1000,
  is_lost: false,
  is_won: false,

  set_balance: (balance: number) => {
    set((state) => ({ balance }));
  },
  set_is_lost: (is_lost: boolean) => {
    set((state) => ({ is_lost }));
  },
  set_is_won: (is_won: boolean) => {
    set((state) => ({ is_won }));
  },
}));
