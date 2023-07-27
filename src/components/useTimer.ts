import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useCallback, useState } from "react";
import { useInterval, useIsClient } from "usehooks-ts";

dayjs.extend(duration);

const initialDate = {
  days: "00",
  hours: "00",
  minutes: "00",
  seconds: "00",
};

type IDate = typeof initialDate;

export const useTimer = (finishDate: Date): IDate => {
  const [date, setDate] = useState<IDate>(initialDate);
  const isClient = useIsClient();

  const checkTwoNumber = (time: number): string =>
    time <= 9 ? `0${time}` : String(time);

  const calculateDate = useCallback(() => {
    if (!isClient) return;

    const diff = dayjs(finishDate).diff(dayjs(), "seconds");

    const days = Math.floor(diff / (60 * 60 * 24));
    const hours = Math.floor((diff / (60 * 60)) % 24);
    const minutes = Math.floor((diff / 60) % 60);
    const seconds = Math.floor(diff % 60);

    setDate({
      days: checkTwoNumber(days),
      hours: checkTwoNumber(hours),
      minutes: checkTwoNumber(minutes),
      seconds: checkTwoNumber(seconds),
    });
  }, [finishDate, isClient]);

  useInterval(calculateDate, 1000);

  if (date === initialDate && isClient) {
    calculateDate();
  }

  return date;
};
