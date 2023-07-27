import { useTimerDown, useTimerTo } from "@/components/useTimerDown";
import { useGameStateStore } from "@/modules/game/model/game-state-store";
import { twMerge } from "tailwind-merge";
import { animated, useSpring } from "react-spring";
import React, { useEffect, useMemo } from "react";
import { generate_start_date } from "@/components/data/matches";
import { EVENTS_DATA } from "@/components/data/events";

const minues_mock: Record<number, string> = {
  1: "10",
  2: "25",
  3: "43",
  4: "51",
  5: "63",
  6: "75",
  7: "89",
};

export function Teams() {
  const { round, round_state } = useGameStateStore();

  return (
    <div
      className={twMerge(
        "bg-[#41AD70] overflow-hidden relative w-full text-white rounded-xl",
        round !== null && "pb-2",
      )}
    >
      <div className="px-4 py-6 flex justify-between items-center ">
        <div className="flex space-x-3 items-center z-20">
          <div className="bg-white overflow-hidden rounded-full ">
            <img
              src="/spartak.png"
              alt=""
              className="w-10 h-10 object-contain"
            />
          </div>

          <p className="text-sm font-medium leading-5">
            Спартак
            <br />
            Москва
          </p>
        </div>

        {round === null ? <Timer /> : <Score />}

        <div className="flex space-x-3 items-center z-20">
          <p className="text-sm font-medium leading-5">ЦСКА</p>

          <div className="bg-white overflow-hidden rounded-full ">
            <img src="/cska.png" alt="" className="w-10 h-10 object-contain" />
          </div>
        </div>
      </div>

      {round !== null && round_state === "in_progress" && <Progress />}

      <div className="flex flex-col px-4 text-sm">
        {EVENTS_DATA[(round ?? 0) - 2]?.map((e) => (
          <span className="text-base font-normal">
            {minues_mock[round ?? 0]}` {"   "} {e.title}
          </span>
        ))}
      </div>
    </div>
  );
}

function Progress() {
  const { round_state } = useGameStateStore();

  const progressSpring = useSpring({
    from: { right: round_state === "ended" ? "110%" : "95%" },
    to: { right: "0%" },
    config: {
      duration: 300000,
    },
  });

  const opcaitySpring = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: {
      duration: 1000,
      delay: 1000,
    },
  });

  useEffect(() => {
    if (round_state === "ended") {
      progressSpring;
    }
  }, [round_state]);

  return (
    <>
      <animated.div
        style={{ ...progressSpring, ...opcaitySpring }}
        className="absolute top-0 z-10"
      >
        <svg
          width="173"
          height="111"
          viewBox="0 0 173 111"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 0H166V104H0V0Z"
            fill="url(#paint0_linear_127_4752)"
            fill-opacity="0.4"
          />
          <path
            d="M16 104L159 103.007C159.551 103.003 160 103.449 160 104V104C160 104.551 159.551 104.997 159 104.993L16 104Z"
            fill="#005B2A"
          />
          <path
            d="M166 97C162.141 97 159 100.141 159 104C159 107.859 162.141 111 166 111C169.859 111 172.999 107.859 172.999 104C172.999 100.141 169.859 97 166 97ZM160.03 104.614L161.96 103.214L162.899 103.519L163.775 106.211L163.194 107.011H160.818C160.399 106.292 160.12 105.481 160.03 104.614ZM161.285 102.468L160.033 103.378C160.123 102.52 160.395 101.717 160.809 101.004L161.285 102.468ZM164.649 105.664L163.812 103.093L166 101.504L168.186 103.093L167.352 105.664H164.649ZM168.804 107.011L168.224 106.212L169.099 103.52L170.038 103.214L171.968 104.615C171.879 105.482 171.601 106.292 171.181 107.011H168.804V107.011ZM170.714 102.468L171.191 101.004C171.603 101.717 171.879 102.52 171.967 103.378L170.714 102.468ZM170.464 100.005L169.73 102.263L169.05 102.484L166.5 100.631V99.917L168.425 98.517C169.207 98.864 169.9 99.375 170.464 100.005ZM167.253 98.134L166 99.044L164.747 98.134C165.151 98.048 165.57 98 166 98C166.429 98 166.848 98.048 167.253 98.134ZM163.574 98.517L165.5 99.917V100.631L162.948 102.484L162.27 102.263L161.536 100.005C162.101 99.375 162.792 98.864 163.574 98.517ZM161.55 108.011H163.085L163.562 109.478C162.791 109.133 162.108 108.63 161.55 108.011ZM164.74 109.864L164.003 107.598L164.684 106.663H167.318L167.998 107.599L167.261 109.864C166.854 109.952 166.434 110 166.001 110C165.568 110 165.147 109.952 164.74 109.864ZM168.438 109.478L168.914 108.011H170.449C169.891 108.63 169.209 109.133 168.438 109.478Z"
            fill="#005B2A"
          />
          <defs>
            <linearGradient
              id="paint0_linear_127_4752"
              x1="166"
              y1="52"
              x2="2.03335e-06"
              y2="52"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#005B2A" />
              <stop offset="0.760417" stop-color="#41AD70" />
            </linearGradient>
          </defs>
        </svg>
      </animated.div>
    </>
  );
}

function Timer() {
  const date = useMemo(() => generate_start_date(30), []);

  const { minutes, seconds } = useTimerDown(date);

  return (
    <span className="text-[22px] font-bold">
      {minutes}:{seconds}
    </span>
  );
}

const score_mock: Record<number, string> = {
  1: "0:0",
  2: "0:1",
  3: "0:2",
  4: "1:2",
  5: "2:2",
  6: "3:2",
  7: "4:2",
};

function Score() {
  const { round } = useGameStateStore();

  const date = useMemo(() => {
    const dates: Record<number, number> = {
      1: 900,
      2: 900,
      3: 900,
      4: 600,
      5: 600,
      6: 600,
      7: 600,
    };

    return generate_start_date(dates[round ?? 0]);
  }, [round]);

  const { minutes, seconds } = useTimerDown(date);

  return (
    <div className="flex flex-col text-center">
      <div className="text-[32px] font-bold z-20">
        {score_mock[(round ?? 0) - 1]}
      </div>

      <div>
        <span className="text-[18px] font-bold z-20">
          До конца раунда: {minutes}:{seconds}
        </span>
      </div>
    </div>
  );
}
