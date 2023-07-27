import { Layout } from "@/components/layout";
import { GameHead } from "@/modules/game/game-head";
import { Leaderboard } from "@/modules/game/leaderboard";
import { Teams } from "@/modules/game/teams";
import { Controls } from "@/modules/game/controls";
import { Bets } from "@/modules/game/bets";
import { useAutoAnimate } from "@formkit/auto-animate/react";

function Game() {
  return (
    <Layout>
      <div className="flex flex-col bg-[#F0F0F0]">
        <GameHead />

        <GameBody />

        <Leaderboard />

        <Controls />
      </div>
    </Layout>
  );
}

function GameBody() {
  const [animationParent] = useAutoAnimate();

  return (
    <div
      className="flex flex-col rounded-xl bg-white mx-4"
      ref={animationParent}
    >
      <Teams />

      <Bets />
    </div>
  );
}

export default Game;
