import { create } from "zustand";

export type Market = {
  id: number;
  name: string;
  first: number;
  draw: number;
  second: number;
};

type MarketsStateStore = {
  markets: Market[];

  set_markets: (markets: Market[]) => void;
};

export const useMarketsStateStore = create<MarketsStateStore>((set, get) => ({
  markets: [],

  set_markets: (markets: Market[]) => {
    console.log("set_markets", markets);
    set((state) => ({ markets }));
  },
}));
