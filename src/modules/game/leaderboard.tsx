import { usePlayersStateStore } from "@/modules/game/model/players-state-store";
import { useGameStateStore } from "@/modules/game/model/game-state-store";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useUserStateStore } from "@/modules/game/model/user-state-store";
import { useState } from "react";
import { useDeadStateStore } from "@/modules/game/model/dead-state-store";
import { twMerge } from "tailwind-merge";

export function Leaderboard() {
  const { round } = useGameStateStore();
  const { is_lost } = useUserStateStore();
  const { players } = usePlayersStateStore();
  const [aciteBet, setActiveBet] = useState<number | null>(null);
  const [betType, setBetType] = useState<null | "round" | "tournament">(null);
  const [amoun, setAmount] = useState(0);
  const { bet, setBet } = useDeadStateStore();

  const [animationParent] = useAutoAnimate();

  function handleBet(id: number, amount: number, coefficient: number) {
    if (!aciteBet) return;

    setBet({
      id,
      amount,
      coefficient,
      type: betType ?? "round",
    });

    setActiveBet(null);
  }

  console.log(aciteBet, betType);

  return (
    <div className="flex flex-col space-y-3 px-4 mt-8">
      <span className="text-primary font-bold text-center">
        Таблица участников
      </span>

      <div className="flex flex-col space-y-4 pb-10" ref={animationParent}>
        {players.map((player, index) =>
          player.id === 1 ? (
            is_lost ? null : (
              <div
                key={player.id}
                className="flex items-center justify-between"
              >
                <div className="flex space-x-3 items-center text-xs leading-[17px] text-primary font-bold">
                  <div className="w-[30px] h-[30px] rounded-full border-2 border-primary flex items-center justify-center">
                    {round ? index + 1 : "..."}
                  </div>

                  <span className="">{player.name}</span>
                </div>

                <span className="font-bold text-primary">{player.balance}</span>
              </div>
            )
          ) : is_lost ? (
            <div className="flex flex-col space-y-2">
              <div
                key={player.id}
                className="flex items-center justify-between"
              >
                <div className="flex space-x-3 items-center text-xs leading-[17px]">
                  <div className="w-[30px] h-[30px] rounded-full border border-black flex items-center justify-center">
                    {round ? index + 1 : "..."}
                  </div>

                  <span className="">{player.name}</span>
                </div>

                <span>{player.balance}</span>
              </div>

              <div className="flex space-x-1 w-full">
                <button
                  onClick={() => {
                    if (bet) return;

                    setBetType("round");
                    setActiveBet(player.id);
                  }}
                  className={twMerge(
                    "rounded flex items-center justify-between border flex-1 border-primary px-4 py-3 leading-4 text-[13px]",
                    aciteBet === player.id && betType === "round"
                      ? "bg-primary text-white"
                      : "text-black",
                    bet?.id === player.id
                      ? bet?.type === "round"
                        ? "bg-primary text-white"
                        : "bg-gray-400 text-white"
                      : "text-black",
                  )}
                >
                  <span className="text-[#7A7A7A]">Победит в раунде</span>

                  <span>{Math.round((index + 1) * 1.2 * 10) / 10}</span>
                </button>

                <button
                  onClick={() => {
                    if (bet) return;

                    setBetType("tournament");
                    setActiveBet(player.id);
                  }}
                  className={twMerge(
                    "rounded flex items-center justify-between text-black border flex-1 border-primary px-4 py-3 leading-4 text-[13px]",
                    aciteBet === player.id && betType === "tournament"
                      ? "bg-primary text-white"
                      : "text-black",
                    bet?.id === player.id
                      ? bet?.type === "tournament"
                        ? "bg-primary text-white"
                        : "bg-gray-400 text-white"
                      : "text-black",
                  )}
                >
                  <span className="text-[#7A7A7A]">Победит в турнире</span>

                  <span>{(Math.round((index + 1) * 1.2 * 20) / 20) * 2}</span>
                </button>
              </div>

              {bet?.id === player.id && (
                <div className="flex justify-between mt-1 items-center">
                  <span className="text black text-sm">Ваша ставка</span>

                  <span>{bet.amount} L</span>
                </div>
              )}

              {aciteBet === player.id && !bet && (
                <div className="flex flex-col mt-5">
                  <span className="text-center w-full font-medium text-sm">
                    Сделайте ставку
                  </span>

                  <div className="flex flex-col text-lg font-bold text-primary">
                    <div>
                      <span className="">{amoun}</span>
                    </div>

                    <input
                      type="range"
                      min="1"
                      max={1213}
                      value={amoun}
                      onChange={(e) => {
                        setAmount(Number(e.target.value));
                      }}
                      className="bg-[#E2E2E2] h-2 rounded w-full mt-2 accent-primary"
                      id="myRange"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-black">
                      Вы можете поставить
                    </span>

                    <span className="text-primary font-bold text-[18px]">
                      {1213} L
                    </span>
                  </div>

                  <button
                    className="text-sm mt-4 h-10 rounded bg-primary-dark flex items-center justify-center text-white"
                    onClick={() =>
                      handleBet(
                        player.id,
                        amoun,
                        Math.round((index + 1) * 1.2 * 10) / 10,
                      )
                    }
                  >
                    Принять
                  </button>
                </div>
              )}
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
