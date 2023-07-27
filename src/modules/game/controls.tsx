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
import Link from "next/link";
import { useRouter } from "next/router";
import { DeadPig } from "@/components/DeadPig";
import { useDeadStateStore } from "@/modules/game/model/dead-state-store";

export function Controls() {
  const router = useRouter();
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
  const { balance, set_balance, is_lost, is_won, set_is_won, set_is_lost } =
    useUserStateStore();
  const { bet } = useDeadStateStore();

  const [isKingWinModal, setIsKingWinModal] = useState(false);
  const [isKingLostModal, setIsKingLostModal] = useState(false);
  const [lostMemModal, setLostMemModal] = useState(false);
  const [lostModal, setLostModal] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [won, setWon] = useState(0);
  const [betsWon, setBetsWon] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      set_round(1);
      set_round_state("started");
    }, 30000);

    if (round) {
      clearTimeout(timer);
      return;
    }

    return () => clearTimeout(timer);
  }, [round]);

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
    const [win, count] = calculateWin(bets, round ?? 1);
    set_balance(Math.floor(balance + win));

    const [pl, amount] = simulatePlayersData(players, balance + win);
    // @ts-ignore
    set_players(pl);
    set_prize_pool(prize_pool + amount);

    if (is_lost) {
      const isBetWon = pl.find((p) => p.id === bet?.id);
      isBetWon ? setIsKingWinModal(true) : setIsKingLostModal(true);

      return;
    }

    if (bets.length === 0) {
      setLostModal(true);
      return set_is_lost(true);
    }

    if (balance + win === 0) {
      setLostMemModal(true);
      return set_is_lost(true);
    }

    if (!pl.find((e) => e.id === 1)) {
      setLostMemModal(true);
      return set_is_lost(true);
    }

    setWon(win);

    set_round_state("ended");

    setModalOpen(true);

    setBetsWon(count);
  };

  //start next round
  const handleStartRound = () => {
    setModalOpen(false);
    set_round_state("started");

    set_round((round ?? 1) + 1);

    set_markets(MARKETS_DATA[round ?? 1]);

    set_bets([]);
  };

  useEffect(() => {
    if (round === null || round < 3) return;

    if (players.length === 1 && players[0].id === 1) {
      set_is_won(true);
      setIsWon(true);
    }
  }, [players]);

  //start leaderboard betting
  function startLeaderboardBetting() {
    // const [pl, amount] = simulatePlayersData(players, 0);
    set_round((round ?? 1) + 1);
    set_round_state("started");

    // @ts-ignore
    // set_players(pl);
    // set_prize_pool(prize_pool + amount);
    set_markets(MARKETS_DATA[round ?? 1]);

    set_bets([]);

    set_is_lost(true);
  }

  const text: Record<number, string> = {
    0: "К началу матча",
    1: "К концу первого раунда",
    2: "К концу второго раунда",
    3: "К концу третьего раунда",
    4: "К концу четвертого раунда",
    5: "К концу пятого раунда",
    6: "К концу шестого раунда",
    7: "К концу матча",
  };

  return (
    <>
      <button
        onClick={() => {
          round === null ? handleStartGame() : handleEndRound();
        }}
        className="bg-primary text-white rounded px-2 py-1 fixed bottom-2 right-2"
      >
        {text[round ?? 0]}
      </button>

      <Modal
        isOpen={lostModal}
        onClose={() => {
          setLostModal(false);
          startLeaderboardBetting();
        }}
      >
        <div className="flex flex-col px-4 py-9 items-center text-center">
          <span className="text-[20px] leading-[24px] font-medium">
            BestBigBetter
          </span>

          <span className="mt-1.5 uppercase text-[#FF4944] text-[32px] leading-[24px] font-bold">
            вы умерли
          </span>

          <p className="mt-[26px] text-center text-black text-base leading-5 italic">
            “Тот, кто не рискнул - выиграть не может.”
          </p>

          <p className="text-[10px] text-end mt-2 leading-3 ml-auto mr-3">
            – книга мудрости
            <br />
            Беспощадных ставок
          </p>

          <img src="/fatality.png" alt="" />

          <button
            className="text-sm mt-8 w-full h-10 rounded bg-primary-dark flex items-center justify-center text-white"
            onClick={() => {
              setLostModal(false);
              startLeaderboardBetting();
            }}
          >
            Поставь на короля
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={lostMemModal}
        onClose={() => {
          setLostMemModal(false);
          startLeaderboardBetting();
        }}
      >
        <div className="flex flex-col px-4 py-9 items-center text-center">
          <span className="text-[20px] leading-[24px] font-medium">
            BestBigBetter
          </span>

          <span className="mt-1.5 uppercase text-[#FF4944] text-[32px] leading-[24px] font-bold">
            вы умерли
          </span>

          <p className="mt-[26px] text-center text-black text-base leading-5 italic">
            “Иногда принятые решения сводят нас
            <br />в могилу”
          </p>

          <p className="text-[10px] text-end mt-2 leading-3 ml-auto mr-3">
            – книга мудрости
            <br />
            Беспощадных ставок
          </p>

          <img src="/fatality.png" alt="" />

          <button
            className="text-sm mt-8 w-full h-10 rounded bg-primary-dark flex items-center justify-center text-white"
            onClick={() => {
              setLostMemModal(false);
              startLeaderboardBetting();
            }}
          >
            Поставь на короля
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          handleStartRound();
        }}
      >
        <div className="flex flex-col px-4 py-9 items-center text-center">
          <span className="text-[20px] leading-[24px] font-medium">
            BestBigBetter
          </span>

          <span className="mt-1.5 uppercase text-primary text-[32px] leading-[24px] font-bold">
            вы выжили!
          </span>

          <p className="text-center  mt-2 text-black text-base leading-5 italic">
            “По пути в следующий раунд не споткнись
            <br />о труп врага”
          </p>

          <p className="text-[10px] text-end leading-3 ml-auto mr-3">
            – книга мудрости
            <br />
            Беспощадных ставок
          </p>

          <div className="flex mt-[36px] w-full items-center justify-between">
            <span>Ваш выигрыш</span>

            <span className="font-bold">+${won}</span>
          </div>

          <div className="flex mt-2 w-full items-center justify-between">
            <span>Ваш баланс</span>

            <span className="font-bold">{balance}</span>
          </div>

          <div className="flex mt-2 w-full items-center justify-between">
            <span>Ставок выиграло</span>
            <span className="font-bold">
              {betsWon} из {bets.length}
            </span>
          </div>

          <button
            className="text-sm mt-8 w-full h-10 rounded bg-primary-dark flex items-center justify-center text-white"
            onClick={handleStartRound}
          >
            Продолжить путь к победе
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isWon}
        onClose={() => {
          router.push("/");
        }}
      >
        <div className="flex flex-col px-4 py-9 items-center text-center">
          <span className="text-[20px] leading-[24px] font-medium">
            BestBigBetter
          </span>

          <span className="flex items-center mt-1.5 uppercase text-primary text-[32px] leading-[24px] font-bold">
            вы король!{" "}
            <svg
              width="35"
              height="40"
              viewBox="0 0 35 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M14.2313 6.51913C16.0373 4.72089 18.9634 4.72086 20.7694 6.51913L25.1742 10.905C25.8555 11.5834 26.8989 11.7527 27.7628 11.3225L28.9825 10.7153C31.1872 9.61783 33.6546 11.7187 32.8647 14.0785L29.7117 23.4964C29.0808 25.3809 27.3116 26.6477 25.324 26.6477H9.67676C7.68901 26.6477 5.91985 25.3809 5.28889 23.4964L2.13603 14.0785C1.346 11.7186 3.81371 9.61785 6.01821 10.7153L7.23792 11.3226C8.10198 11.7527 9.14517 11.5834 9.82652 10.9049L14.2313 6.51913ZM7.9549 29.0341C7.29593 29.0341 6.76172 29.5683 6.76172 30.2273C6.76172 30.8862 7.29593 31.4204 7.9549 31.4204H27.0458C27.7048 31.4204 28.239 30.8862 28.239 30.2273C28.239 29.5683 27.7048 29.0341 27.0458 29.0341H7.9549ZM19.8866 12.7273L17.5002 7.95453L15.1138 12.7273L17.5002 17.5L19.8866 12.7273ZM28.6366 14.4621L29.0853 18.3612L26.2352 21.0597L25.7865 17.1605L28.6366 14.4621ZM9.13908 17.2336L6.36385 14.606L5.92687 18.4027L8.70211 21.0303L9.13908 17.2336Z"
                fill="url(#paint0_linear_106_24706)"
              />
              <path
                d="M6.76172 30.2273C6.76172 29.5683 7.29592 29.0341 7.9549 29.0341H27.0458C27.7048 29.0341 28.239 29.5683 28.239 30.2273C28.239 30.8862 27.7048 31.4205 27.0458 31.4205H7.9549C7.29592 31.4205 6.76172 30.8862 6.76172 30.2273Z"
                fill="url(#paint1_linear_106_24706)"
              />
              <g opacity="0.74" filter="url(#filter0_f_106_24706)">
                <ellipse cx="18" cy="32" rx="7" ry="2" fill="#FF9C07" />
              </g>
              <defs>
                <filter
                  id="filter0_f_106_24706"
                  x="5"
                  y="24"
                  width="26"
                  height="16"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="BackgroundImageFix"
                    result="shape"
                  />
                  <feGaussianBlur
                    stdDeviation="3"
                    result="effect1_foregroundBlur_106_24706"
                  />
                </filter>
                <linearGradient
                  id="paint0_linear_106_24706"
                  x1="17.5003"
                  y1="5.17044"
                  x2="17.5003"
                  y2="31.4204"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#FFC451" />
                  <stop offset="1" stopColor="#E46E00" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_106_24706"
                  x1="17.5005"
                  y1="24.6591"
                  x2="17.5005"
                  y2="33.4091"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#FFA451" />
                  <stop offset="1" stopColor="#E43700" />
                </linearGradient>
              </defs>
            </svg>
          </span>

          <p className="text-center  mt-2 text-black text-base leading-5 italic">
            “Вы выжили, а они нет”
          </p>

          <p className="text-[10px] text-end leading-3 ml-auto mr-3">
            – книга мудрости
            <br />
            Беспощадных ставок
          </p>

          <span className="text-[20px] text-[#E40101] font-bold uppercase mt-10 mb-4">
            Эти кровавые деньги - ваши
          </span>

          <span className="flex items-center font-mono space-x-1 bloody text-[48px] mb-8">
            {prize_pool}{" "}
            <svg
              className="ml-1"
              width="25"
              height="48"
              viewBox="0 0 25 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24.8421 38.7534C24.9474 38.4349 25 37.9394 25 37.267C25 34.6126 24.5263 32.9492 23.5789 32.2768C22.5016 31.5097 20.0076 31.089 16.0971 31.0147C16.5307 30.1389 17.0221 29.1527 17.5713 28.0558C18.1042 26.9916 18.4654 25.7683 18.655 24.3861C18.8541 22.9848 18.8127 22.2125 18.531 22.0689C18.2048 21.9028 17.6455 22.3692 16.8532 23.4683C16.061 24.5674 15.2509 25.9436 14.4231 27.597L12.3973 31.1669C11.3498 31.2344 10.6033 31.2681 10.1579 31.2681C9.49123 31.2681 9.07018 31.1089 8.89474 30.7904C8.7193 30.4365 8.61403 29.9941 8.57895 29.4632V24.7385C8.57895 24.3846 8.54386 22.7035 8.47368 19.6952C8.4386 16.687 8.42105 14.0149 8.42105 11.6791C8.42105 8.21076 7.98246 5.39716 7.10526 3.2383C6.26316 1.07943 5.19298 0 3.89474 0C3.64912 0 3.42105 0.318521 3.21053 0.955563C3 1.5926 2.77193 2.91978 2.52632 4.93708C2.38596 5.60951 2.31579 6.22886 2.31579 6.79512C2.31579 7.36137 2.42105 8.12228 2.63158 9.07785C2.66667 9.14863 2.61403 9.39637 2.47368 9.82106C2.36842 10.2104 2.31579 10.4404 2.31579 10.5112C2.31579 11.9268 2.26316 15.3775 2.15789 20.8631C2.05263 26.3488 2 29.3924 2 29.9941C2 31.2328 1.66667 32.0821 1 32.5422C0.333333 33.0023 0 33.4093 0 33.7632C0.175439 34.1525 0.298246 34.4534 0.368421 34.6657C0.929824 36.046 1.42105 37.09 1.84211 37.7978C1.84211 37.6917 1.85965 37.5147 1.89474 37.267C1.96491 36.9838 2 36.7007 2 36.4176L2.57895 36.2583C3.17544 36.2583 3.66667 36.5414 4.05263 37.1077C4.91142 38.3204 6.37558 38.9395 8.44509 38.9649C8.24748 39.7758 8.18461 40.5564 8.25647 41.3069C8.27262 41.4793 8.29377 41.6416 8.31993 41.7939C8.31717 41.8696 8.31579 41.9355 8.31579 41.9917C8.31579 42.5699 8.468 42.912 8.77241 43.0178C8.89865 43.1901 9.04641 43.3193 9.21571 43.4056C9.46781 43.534 9.70495 43.4878 9.92715 43.2671C10.1737 43.0349 10.3969 42.7193 10.5967 42.3202C11.1105 41.2939 11.8141 39.8515 12.7075 37.993C12.7823 37.8374 12.8562 37.6837 12.9292 37.5321C13.2129 37.5468 13.4997 37.5646 13.7895 37.5855C14.7719 37.6209 15.7895 37.6386 16.8421 37.6386C18.2456 37.6386 19.4211 37.5147 20.3684 37.267C20.6491 37.1962 20.9649 37.0723 21.3158 36.8953C21.5614 36.8953 21.7544 37.1785 21.8947 37.7447C22.0702 38.311 22.1579 38.7003 22.1579 38.9126C22.1579 38.9834 22.0351 39.6382 21.7895 40.8769C21.7193 41.2308 21.6842 41.6024 21.6842 41.9917C21.6842 42.6995 22.0351 43.0534 22.7368 43.0534C22.9474 43.0534 23.1404 42.9649 23.3158 42.788L23.8421 42.3633L24.3684 43.0534C24.4737 42.6641 24.5263 42.381 24.5263 42.204C24.5263 42.0979 24.4211 41.797 24.2105 41.3016C24 41.4431 23.8421 41.5139 23.7368 41.5139C23.4211 41.5139 23.1228 41.3193 22.8421 40.9299C22.5965 40.576 22.4737 40.169 22.4737 39.7089C22.4737 39.3904 22.6491 38.7357 23 37.7447C23.3509 36.7538 23.6316 36.2583 23.8421 36.2583L24.2105 36.4176C24.2456 36.7007 24.2632 37.09 24.2632 37.5855C24.2281 37.9748 24.2105 38.3641 24.2105 38.7534V39.9744C24.5614 39.5143 24.7719 39.1073 24.8421 38.7534Z"
                fill="url(#paint0_linear_111_582)"
              />
              <path
                d="M9.26316 45.5485L9.57895 45.3892L9.26316 44.6991V45.5485Z"
                fill="url(#paint1_linear_111_582)"
              />
              <path
                d="M1.52632 39.4966C1.70175 39.6382 1.91228 39.7443 2.15789 39.8151V39.125C1.91228 38.8773 1.70175 38.718 1.52632 38.6472V39.4966Z"
                fill="url(#paint2_linear_111_582)"
              />
              <path
                d="M7.04951 47.955C7.1978 48.0305 7.39367 48.011 7.63712 47.8965C7.65281 47.6421 7.68698 47.3137 7.73963 46.9112L7.82027 46.4156C7.93248 46.3773 8.02244 46.3278 8.09016 46.2669C8.30284 46.0651 8.54715 45.6887 8.8231 45.1376C8.92777 44.9285 8.98851 44.7329 9.00532 44.5506C9.02213 44.3684 8.97121 44.247 8.85258 44.1866C8.74878 44.1337 8.57151 44.2461 8.32077 44.5239C8.07534 44.8282 7.90981 45.0659 7.82417 45.2369C7.6624 45.56 7.60012 45.8145 7.63732 46.0004C7.65326 46.0801 7.68193 46.1901 7.72332 46.3304C7.58788 46.4523 7.48154 46.5531 7.40431 46.633C7.1726 46.8728 7.00917 47.0877 6.91401 47.2777C6.75225 47.6008 6.79742 47.8265 7.04951 47.955Z"
                fill="url(#paint3_linear_111_582)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_111_582"
                  x1="12.5"
                  y1="0"
                  x2="12.5"
                  y2="48"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#E30000" />
                  <stop offset="1" stop-color="#8C0404" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_111_582"
                  x1="12.5"
                  y1="0"
                  x2="12.5"
                  y2="48"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#E30000" />
                  <stop offset="1" stop-color="#8C0404" />
                </linearGradient>
                <linearGradient
                  id="paint2_linear_111_582"
                  x1="12.5"
                  y1="0"
                  x2="12.5"
                  y2="48"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#E30000" />
                  <stop offset="1" stop-color="#8C0404" />
                </linearGradient>
                <linearGradient
                  id="paint3_linear_111_582"
                  x1="12.5"
                  y1="0"
                  x2="12.5"
                  y2="48"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#E30000" />
                  <stop offset="1" stop-color="#8C0404" />
                </linearGradient>
              </defs>
            </svg>
          </span>

          <DeadPig />

          <button
            className="text-sm mt-8 w-full h-10 rounded bg-primary-dark flex items-center justify-center text-white"
            onClick={() => router.push("/")}
          >
            Показать всем еще раз, кто тут король
          </button>

          <button
            className="text-sm mt-2 w-full h-10 rounded border-primary-dark border bg-white flex items-center justify-center text-primary"
            onClick={() => router.push("/")}
          >
            Главная
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isKingWinModal}
        onClose={() => {
          router.push("/");
        }}
      >
        <div className="flex flex-col px-4 py-9 items-center text-center">
          <span className="text-[20px] leading-[24px] font-medium">
            BestBigBetter
          </span>

          <span className="mt-1.5 uppercase text-primary text-[32px] leading-[24px] font-bold">
            вы мудрец!
          </span>

          <p className="text-center  mt-2 text-black text-base leading-5 italic">
            “мертвый мудрец даже с деньгами
            <br />
            останется мертвым”
          </p>

          <p className="text-[10px] text-end leading-3 ml-auto mr-3">
            – книга мудрости
            <br />
            Беспощадных ставок
          </p>

          <span className="text-[17px] leading-5 font-bold text-black mt-9">
            сила предвидения принесла вам
          </span>

          <span className="text-[40px] mt-2 font-bold">
            {Math.floor((bet?.amount ?? 0) * (bet?.coefficient ?? 0))} L
          </span>

          <button
            className="text-sm mt-9 w-full h-10 rounded border-primary-dark border bg-white flex items-center justify-center text-primary"
            onClick={() => router.push("/")}
          >
            Главная
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isKingLostModal}
        onClose={() => {
          router.push("/");
        }}
      >
        <div className="flex flex-col px-4 py-9 items-center text-center">
          <span className="text-[20px] leading-[24px] font-medium">
            BestBigBetter
          </span>

          <span className="mt-1.5 uppercase text-[#FF4944] text-[24px] leading-[24px] font-bold">
            это был двойной просчет
          </span>

          <p className="text-center  mt-2 text-black text-base leading-5 italic">
            “мёртвому глупцу поможет только
            <br />
            реинкарнация”
          </p>

          <p className="text-[10px] text-end leading-3 ml-auto mr-3">
            – книга мудрости
            <br />
            Беспощадных ставок
          </p>

          <button
            className="text-sm mt-9 w-full h-10 rounded border-primary-dark border bg-white flex items-center justify-center text-primary"
            onClick={() => router.push("/")}
          >
            Главная
          </button>
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

  return [Math.floor(amount), count];
}

function randomInRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function simulatePlayersData(
  players: Player[],
  balance: number,
): [Player[], number] {
  let new_players = [];
  const prev_players = [...players];

  for (let i = 0; i < prev_players.length; i++) {
    const player = prev_players[i];

    if (player.id === 1) {
      new_players.push({
        ...player,
        balance,
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
    ...new_players.slice(0, Math.round(new_players.length / 2)),
  ];
  const dead_players_amount = [
    ...new_players.slice(Math.round(new_players.length / 2)),
  ].reduce((acc, player) => {
    return acc + player.balance;
  }, 0);

  return [alive_players, dead_players_amount];
}
