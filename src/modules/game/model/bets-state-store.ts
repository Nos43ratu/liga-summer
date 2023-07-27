import { create } from "zustand";
import { Market } from "@/modules/game/model/markets-state-store";

export type Bet = {
  id: number;
  type: string;
  coefficient: number;
  amount: number;
};

type BetsStateStore = {
  bets: Bet[];

  set_bets: (bets: Bet[]) => void;
};

export const useBetsStateStore = create<BetsStateStore>((set, get) => ({
  bets: [],

  set_bets: (bets: Bet[]) => {
    set((state) => ({ bets }));
  },
}));
