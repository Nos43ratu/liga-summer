import { Modal } from "@/modules/shared/modal";
import { useGameStateStore } from "@/modules/game/model/game-state-store";
import { useBetsStateStore } from "@/modules/game/model/bets-state-store";

export function RoundCompleteModal() {
  const { round, round_state, set_round, set_round_state } =
    useGameStateStore();
  const { bets } = useBetsStateStore();

  const isOpen = round_state === "ended";

  function handleClose() {
    set_round_state("started");
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        handleClose();
      }}
    >
      <div className="flex flex-col px-4 py-9 items-center text-center">
        <span className="text-[32px] leading-6">Раунд {round}</span>

        <span className="text-primary font-bold text-[32px] leading-6 mt-7">
          ПОБЕДА!
        </span>

        <div className="flex flex-col mt-[36px]">Ваш выигрыш +200</div>
      </div>
    </Modal>
  );
}
