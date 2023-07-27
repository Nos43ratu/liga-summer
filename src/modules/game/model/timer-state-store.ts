import { create } from "zustand";

type TimerStateStore = {
  time_left: Date;

  set_time_left: (time_left: Date) => void;
};

const mock_date = new Date();
mock_date.setSeconds(mock_date.getSeconds() + 30);

export const useTimerStateStore = create<TimerStateStore>()((set) => ({
  time_left: mock_date,

  set_time_left: (time_left) => set({ time_left }),
}));
