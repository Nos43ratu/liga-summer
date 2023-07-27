import { create } from "zustand";

type GameStateStore = {
  round: number | null;
  round_state: "started" | "in_progress" | "ended" | null;
  prize_pool: number;

  set_round: (round: number | null) => void;
  set_round_state: (
    round_state: "started" | "in_progress" | "ended" | null,
  ) => void;
  set_prize_pool: (prize_pool: number) => void;
};

export const useGameStateStore = create<GameStateStore>()((set, get) => ({
  round: null,
  round_state: null,
  prize_pool: 0,

  set_round: (round) => set({ round }),
  set_round_state: (round_state) => set({ round_state }),
  set_prize_pool: (prize_pool) => set({ prize_pool }),
}));
