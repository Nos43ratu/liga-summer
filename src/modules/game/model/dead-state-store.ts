import { create } from "zustand";

type DeadState = {
  bet: {
    id: number;
    amount: number;
    coefficient: number;
  } | null;

  setBet: (bet: DeadState["bet"]) => void;
};

export const useDeadStateStore = create<DeadState>()((set, get) => ({
  bet: null,

  setBet: (bet) => set({ bet }),
}));
