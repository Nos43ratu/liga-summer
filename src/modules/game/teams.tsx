import { useMatchStateStore } from "@/modules/game/model/match-state-store";
import { useTimer } from "@/components/useTimer";
import { useTimerStateStore } from "@/modules/game/model/timer-state-store";
import { useGameStateStore } from "@/modules/game/model/game-state-store";

export function Teams() {
  const { teams, score } = useMatchStateStore();
  const { round, set_round } = useGameStateStore();

  return (
    <div className="bg-[#41AD70] w-full px-4 py-6 flex justify-between items-center text-white rounded-xl">
      <div className="flex space-x-3 items-center">
        <div className="bg-white overflow-hidden rounded-full ">
          <img src="/spartak.png" alt="" className="w-10 h-10 object-contain" />
        </div>

        <p className="text-sm font-medium leading-5">
          Спартак
          <br />
          Москва
        </p>
      </div>

      {round === null ? (
        <Timer />
      ) : (
        <div className="text-[32px] font-bold">{score}</div>
      )}

      <div className="flex space-x-3 items-center">
        <p className="text-sm font-medium leading-5">ЦСКА</p>

        <div className="bg-white overflow-hidden rounded-full ">
          <img src="/cska.png" alt="" className="w-10 h-10 object-contain" />
        </div>
      </div>
    </div>
  );
}

function Timer() {
  const { time_left } = useTimerStateStore();

  const { minutes, seconds } = useTimer(time_left);

  return (
    <span className="text-[22px] font-bold">
      {minutes}:{seconds}
    </span>
  );
}
