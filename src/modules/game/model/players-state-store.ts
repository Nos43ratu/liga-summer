import { create } from "zustand";

export type Player = {
  id: number;
  name: string;
  balance: number;
};

type PlayersStateStore = {
  players: Player[];

  set_players: (players: Player[]) => void;
};

export const usePlayersStateStore = create<PlayersStateStore>()((set, get) => ({
  players: [],

  set_players: (players) => set({ players }),
}));
