import { create } from "zustand";

type PlayerState = {
  id: string;
  name: string;

  bank: number;
};

export const usePlayerState = create<PlayerState>((set) => ({
  id: "",
  name: "",

  bank: 0,
}));
