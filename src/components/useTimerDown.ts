import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useCallback, useEffect, useState } from "react";
import { useInterval, useIsClient } from "usehooks-ts";

dayjs.extend(duration);

const initialDate = {
  days: "00",
  hours: "00",
  minutes: "00",
  seconds: "00",
};

type IDate = typeof initialDate;

export const useTimerDown = (finishDate: Date): IDate => {
  const [date, setDate] = useState<IDate>(initialDate);
  const isClient = useIsClient();

  const checkTwoNumber = (time: number): string =>
    time <= 9 ? `0${time}` : String(time);

  const calculateDate = useCallback(() => {
    if (!isClient) return;

    if (dayjs(finishDate).diff(dayjs(), "seconds") <= 0)
      return setDate({
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
      });

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
export const useTimerTo = (args: number[]): string => {
  const [minute, setMinute] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (minute === args[2] && seconds === args[3]) {
        clearInterval(timer);
        return;
      }

      if (seconds === 59) {
        setMinute(minute + 1);
        setSeconds(0);
      } else {
        setSeconds(seconds + 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [args, minute, seconds]);

  return `${minute < 10 ? `0${minute}` : minute}:${
    seconds < 10 ? `0${seconds}` : seconds
  }`;
};
