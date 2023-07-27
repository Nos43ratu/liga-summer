import { usePlayersStateStore } from "@/modules/game/model/players-state-store";
import { useGameStateStore } from "@/modules/game/model/game-state-store";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useUserStateStore } from "@/modules/game/model/user-state-store";

export function Leaderboard() {
  const { round } = useGameStateStore();
  const { players } = usePlayersStateStore();

  const [animationParent] = useAutoAnimate();

  return (
    <div className="flex flex-col space-y-3 px-4 mt-8">
      <span className="text-primary font-bold text-center">
        Таблица участников
      </span>

      <div className="flex flex-col space-y-4 pb-10" ref={animationParent}>
        {players.map((player, index) =>
          player.id === 1 ? (
            <div key={player.id} className="flex items-center justify-between">
              <div className="flex space-x-3 items-center text-xs leading-[17px] text-primary font-bold">
                <div className="w-[30px] h-[30px] rounded-full border-2 border-primary flex items-center justify-center">
                  {round ? index + 1 : "..."}
                </div>

                <span className="">{player.name}</span>
              </div>

              <span className="font-bold text-primary">{player.balance}</span>
            </div>
          ) : (
            <div key={player.id} className="flex items-center justify-between">
              <div className="flex space-x-3 items-center text-xs leading-[17px]">
                <div className="w-[30px] h-[30px] rounded-full border border-black flex items-center justify-center">
                  {round ? index + 1 : "..."}
                </div>

                <span className="">{player.name}</span>
              </div>

              <span>{player.balance}</span>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
