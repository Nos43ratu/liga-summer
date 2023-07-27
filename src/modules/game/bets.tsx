import {
  Market,
  useMarketsStateStore,
} from "@/modules/game/model/markets-state-store";
import { useState } from "react";
import { useUserStateStore } from "@/modules/game/model/user-state-store";
import Link from "next/link";
import { useBetsStateStore } from "@/modules/game/model/bets-state-store";
import { twMerge } from "tailwind-merge";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export function Bets() {
  const { markets } = useMarketsStateStore();
  const { is_lost } = useUserStateStore();
  const [animationParent] = useAutoAnimate();

  if (markets.length === 0) return null;

  if (is_lost) return null;

  return (
    <div className="flex flex-col p-3 mt-2 space-y-5" ref={animationParent}>
      {markets.map((market) => (
        <Market key={market.id} market={market} />
      ))}
    </div>
  );
}

function Market({ market }: { market: Market }) {
  const { balance, set_balance } = useUserStateStore();
  const { bets, set_bets } = useBetsStateStore();

  const [activeMarket, setActiveMarket] = useState<string | null>(null);
  const [amount, setAmount] = useState(0);

  function handleBet() {
    if (!activeMarket) return;
    set_balance(balance - amount);

    set_bets([
      ...bets,
      {
        id: market.id,
        amount,
        type: activeMarket,
        // @ts-ignore
        coefficient: market[activeMarket],
      },
    ]);

    setActiveMarket(null);
  }

  const isBetted = bets.find((bet) => bet.id === market.id);

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col space-y-2">
        <span className="text-black text-xs leading-[14px]">{market.name}</span>

        <div className="flex space-x-1.5">
          <div
            onClick={() => {
              if (isBetted) return;

              setActiveMarket("first");
            }}
            className={twMerge(
              "rounded border-primary leading-4 font-bold text-[13px] border h-10 flex items-center justify-between px-3 w-full",
              activeMarket === "first" && "bg-primary text-white",
              isBetted?.type === "first" && "bg-primary text-white",
              isBetted && isBetted.type !== "first" && "bg-[#E2E2E2]",
            )}
          >
            <span
              className={twMerge(
                "text-[#7A7A7A]",
                activeMarket === "first" && "text-white",
                isBetted?.type === "first" && "text-white",
              )}
            >
              1
            </span>

            <span
              className={twMerge(
                "text-black",
                activeMarket === "first" && "text-white",
                isBetted?.type === "first" && "text-white",
              )}
            >
              {market.first}
            </span>
          </div>

          <div
            onClick={() => {
              if (isBetted) return;

              setActiveMarket("draw");
            }}
            className={twMerge(
              "rounded border-primary leading-4 font-bold text-[13px] border h-10 flex items-center justify-between px-3 w-full",
              activeMarket === "draw" && "bg-primary text-white",
              isBetted?.type === "draw" && "bg-primary text-white",
              isBetted && isBetted.type !== "draw" && "bg-[#E2E2E2]",
            )}
          >
            <span
              className={twMerge(
                "text-[#7A7A7A]",
                activeMarket === "draw" && "text-white",
                isBetted?.type === "draw" && "text-white",
              )}
            >
              Никто
            </span>

            <span
              className={twMerge(
                "text-black",
                activeMarket === "draw" && "text-white",
                isBetted?.type === "draw" && "text-white",
              )}
            >
              {market.draw}
            </span>
          </div>

          <div
            onClick={() => {
              if (isBetted) return;

              setActiveMarket("second");
            }}
            className={twMerge(
              "rounded border-primary leading-4 font-bold text-[13px] border h-10 flex items-center justify-between px-3 w-full",
              activeMarket === "second" && "bg-primary text-white",
              isBetted?.type === "second" && "bg-primary text-white",
              isBetted && isBetted.type !== "second" && "bg-[#E2E2E2]",
            )}
          >
            <span
              className={twMerge(
                "text-[#7A7A7A]",
                activeMarket === "second" && "text-white",
                isBetted?.type === "second" && "text-white",
              )}
            >
              2
            </span>

            <span
              className={twMerge(
                "text-black",
                activeMarket === "second" && "text-white",
                isBetted?.type === "second" && "text-white",
              )}
            >
              {market.second}
            </span>
          </div>
        </div>
      </div>

      {isBetted && (
        <div className="flex justify-between mt-1 items-center">
          <span className="text black text-sm">Ваша ставка</span>

          <span>{isBetted.amount} L</span>
        </div>
      )}

      {activeMarket && !isBetted && (
        <div className="flex flex-col mt-5">
          <span className="text-center w-full font-medium text-sm">
            Сделайте ставку
          </span>

          <div className="flex flex-col text-lg font-bold text-primary">
            <div>
              <span className="">{amount}</span>
            </div>

            <input
              type="range"
              min="1"
              max={balance}
              value={amount}
              onChange={(e) => {
                setAmount(Number(e.target.value));
              }}
              className="bg-[#E2E2E2] h-2 rounded w-full mt-2 accent-primary"
              id="myRange"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-black">Вы можете поставить</span>

            <span className="text-primary font-bold text-[18px]">
              {balance} L
            </span>
          </div>

          <button
            className="text-sm mt-4 h-10 rounded bg-primary-dark flex items-center justify-center text-white"
            onClick={handleBet}
          >
            Принять
          </button>
        </div>
      )}
    </div>
  );
}
