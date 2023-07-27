import { create } from "zustand";
import { PLAYERS } from "@/components/data";

interface GameState {
  round: number | null;
  prize_pool: number;
  players: {
    id: number;
    name: string;
    bank: number;
  }[];

  set_round: (round: number | null) => void;
  set_prize_pool: (prize_pool: number) => void;
  set_players: (players: { id: number; name: string; bank: number }[]) => void;
}

export const useGameState = create<GameState>()((set) => ({
  round: null,
  prize_pool: 0,
  players: PLAYERS,

  set_round: (round) => set({ round }),
  set_prize_pool: (prize_pool) => set({ prize_pool }),
  set_players: (players) => set({ players }),
}));
