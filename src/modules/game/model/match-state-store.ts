import { create } from "zustand";

type MatchStateStore = {
  teams: string[];
  score: string;

  set_score: (score: string) => void;
};

export const useMatchStateStore = create<MatchStateStore>((set, get) => ({
  teams: ["Арсенал Лондон", "Ноттингем Форест"],
  score: "0:0",

  set_score: (score: string) => {
    set((state) => ({ score }));
  },
}));
