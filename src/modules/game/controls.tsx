import { useGameStateStore } from "@/modules/game/model/game-state-store";
import { useCallback, useEffect, useState } from "react";
import {
  Player,
  usePlayersStateStore,
} from "@/modules/game/model/players-state-store";
import { PLAYERS_DATA } from "@/components/data/players";
import { useMarketsStateStore } from "@/modules/game/model/markets-state-store";
import { MARKETS_DATA, WINNING_MARKETS_DATA } from "@/components/data/markets";
import { Modal } from "@/modules/shared/modal";
import { Bet, useBetsStateStore } from "@/modules/game/model/bets-state-store";
import { useUserStateStore } from "@/modules/game/model/user-state-store";

export function Controls() {
  const {
    round,
    round_state,
    prize_pool,
    set_prize_pool,
    set_round,
    set_round_state,
  } = useGameStateStore();
  const { players, set_players } = usePlayersStateStore();
  const { bets, set_bets } = useBetsStateStore();
  const { markets, set_markets } = useMarketsStateStore();
  const { balance, set_balance, is_lost, set_is_lost } = useUserStateStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [won, setWon] = useState(0);
  const [betsWon, setBetsWon] = useState(0);

  //simulate users join
  const addPlayers = useCallback(() => {
    const players_count = players.length;

    // @ts-ignore
    set_players([...PLAYERS_DATA.slice(0, players_count + 1)]);
  }, [players]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (round !== null) return;

      addPlayers();
    }, 500);

    return () => clearTimeout(timer);
  }, [round, players, addPlayers]);

  // Start game
  const handleStartGame = () => {
    set_round(1);

    set_round_state("started");

    // @ts-ignore
    set_players(PLAYERS_DATA);
    set_markets(MARKETS_DATA[0]);
  };

  useEffect(() => {
    let timer: null | ReturnType<typeof setTimeout> = null;

    if (round_state === "started") {
      timer = setTimeout(() => {
        set_round_state("in_progress");
      }, 2000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [round_state]);

  // end round
  const handleEndRound = () => {
    if (bets.length === 0) {
      return set_is_lost(true);
    }

    const [win, count] = calculateWin(bets, round ?? 1);
    setWon(win);
    set_balance(balance + win);

    if (balance + win === 0) {
      return set_is_lost(true);
    }

    set_round_state("ended");

    setModalOpen(true);

    setBetsWon(count);
  };

  //start next round
  const handleStartRound = () => {
    setModalOpen(false);
    set_round_state("started");

    set_round((round ?? 1) + 1);

    const [pl, amount] = simulatePlayersData(players, balance + won);
    // @ts-ignore
    set_players(pl);
    set_prize_pool(prize_pool + amount);
    set_markets(MARKETS_DATA[round ?? 1]);

    set_bets([]);
  };

  const text = round === null ? "Start round" : "Skip round";

  return (
    <>
      <button
        onClick={() => {
          round === null ? handleStartGame() : handleEndRound();
        }}
        className="bg-primary text-white rounded px-2 py-1 fixed bottom-2 right-2"
      >
        {text}
      </button>

      <Modal isOpen={is_lost} onClose={() => {}}>
        <div className="flex flex-col px-4 py-9 items-center text-center">
          <span className="text-primary font-bold text-[32px] leading-6 mt-7">
            Вы проиграли
          </span>

          <span className="text-red-500 font-bold text-[32px] leading-6 mt-7">
            Вы не сделали ни одной ставки
          </span>
        </div>
      </Modal>

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          handleStartRound();
        }}
      >
        <div className="flex flex-col px-4 py-9 items-center text-center">
          <span className="text-[32px] leading-6">Раунд {round}</span>
          <span className="text-primary font-bold text-[32px] leading-6 mt-7">
            ПОБЕДА!
          </span>

          <div className="flex mt-[36px] w-full items-center justify-between">
            <span>Ваш выигрыш</span>
            <span>+${won}</span>
          </div>

          <div className="flex mt-2 w-full items-center justify-between">
            <span>Ваш баланс</span>
            <span>{balance + won}</span>
          </div>

          <div className="flex mt-2 w-full items-center justify-between">
            <span>Ставок выиграло</span>
            <span>
              {betsWon} из {bets.length}
            </span>
          </div>
        </div>
      </Modal>
    </>
  );
}

function calculateWin(bets: Bet[], round: number) {
  let amount = 0;
  let count = 0;
  const winningMarkets = WINNING_MARKETS_DATA[round - 1];

  for (let i = 0; i < winningMarkets.length; i++) {
    const id = winningMarkets[i].id;
    const type = winningMarkets[i].type;

    const bet = bets.find((bet) => bet.id === id && bet.type === type);

    if (bet) {
      amount += bet.amount * bet.coefficient;
      count++;
    }
  }

  return [amount, count];
}

function randomInRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function simulatePlayersData(
  players: Player[],
  balance: number,
): [Player[], number] {
  let new_players = [];

  for (let i = 0; i < players.length; i++) {
    const player = players[i];

    if (player.id === 1) {
      new_players.push({
        ...player,
        balance: balance,
      });
    } else {
      new_players.push({
        ...player,
        balance: randomInRange(0, player.balance + 1000),
      });
    }
  }

  new_players.sort((a, b) => b.balance - a.balance);

  const alive_players = [
    ...new_players.slice(0, Math.floor(new_players.length / 2)),
  ];
  const dead_players_amount = [
    ...new_players.slice(Math.floor(new_players.length / 2)),
  ].reduce((acc, player) => {
    return acc + player.balance;
  }, 0);

  return [alive_players, dead_players_amount];
}
