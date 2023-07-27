import { generate_start_date, Match } from "@/components/data/matches";
import Link from "next/link";
import Image from "next/image";
import { ClockIcon, FootballIcon, PlayersIcon } from "@/components/Icons";
import { useTimerDown } from "@/components/useTimerDown";
import { AnimateChange } from "@/components/animate-change";
import { useEffect, useState } from "react";
import { spans } from "next/dist/build/webpack/plugins/profiling-plugin";

type MatchCardProps = {
  match: Match;
};

export function MatchCard({ match }: MatchCardProps) {
  const date = generate_start_date(200);

  return (
    <div className="flex flex-col rounded-lg relative">
      <div className="absolute z-[10] w-full h-full rounded-lg overflow-hidden shadow-[13px_20px_12px_0px_rgba(66,139,99,0.43)_inset]">
        <Image
          src="/match-bg.png"
          alt="Picture of the author"
          className="z-10 object-cover"
          fill
        />
      </div>

      <div className="mt-[503px] rounded-lg bg-white p-3 relative z-20 flex flex-col shadow-[-2px_-4px_4px_0px_rgba(0,0,0,0.25)]">
        <div className="flex flex-col space-y-1 text-center">
          <h2 className="text-base leading-6 font-bold">{match.name}</h2>

          <span className="text-xs leading-[15px] font-bold text-text-secondary">
            {match.league}
          </span>
        </div>

        <div className="flex mt-6 px-3 items-center justify-between">
          <div className="flex flex-col space-y-1 items-center">
            <span className="flex text-[10px] font-bold leading-[15px] text-text-secondary">
              Осталось до
            </span>

            <div className="flex items-center space-x-1">
              <ClockIcon />

              <Timer finish_date={date} />
            </div>
          </div>

          <div className="flex flex-col space-y-1 items-center">
            <span className="flex text-[10px] font-bold leading-[15px] text-text-secondary">
              Участники
            </span>

            <div className="flex items-center space-x-1">
              <PlayersIcon />

              <Players players_count={32} />
            </div>
          </div>

          <div className="flex flex-col space-y-1 items-center">
            <span className="flex text-[10px] font-bold leading-[15px] text-text-secondary">
              Вид спорта
            </span>

            <div className="flex items-center space-x-1">
              <FootballIcon />

              <span className="leading-[15px] text-sm font-bold">футбол</span>
            </div>
          </div>
        </div>

        <Link
          className="text-sm mt-4 h-10 rounded bg-primary-dark flex items-center justify-center text-white"
          href="/game"
        >
          Стать королем (королевой) ставок
        </Link>
      </div>
    </div>
  );
}

interface TimerProps {
  finish_date: Date;
}

function Timer({ finish_date }: TimerProps) {
  const { minutes, seconds } = useTimerDown(finish_date);

  return (
    <span className="leading-[15px] text-sm font-bold">
      {minutes}:{seconds}
    </span>
  );
}

interface PlayersProps {
  players_count: number;
}

function Players({ players_count }: PlayersProps) {
  const [players, set_players] = useState(players_count);

  useEffect(() => {
    const interval = setInterval(
      () => {
        if (players < 50) {
          set_players(players + randomInRange(1, 5));
        }
      },
      randomInRange(2000, 5000),
    );

    return () => clearInterval(interval);
  }, [players_count]);

  return (
    <span className="leading-[15px] text-sm font-bold flex">
      <AnimateChange value={players} className="origin-right" /> / 50
    </span>
  );
}

function randomInRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
