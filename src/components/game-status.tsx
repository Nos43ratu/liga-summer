import { Pig } from "@/components/Pig";

export function GameStatus() {
  return (
    <div className="w-full relaitve flex">
      <div className="h-full flex-1">
        <span>Раунд</span>
      </div>

      <div className="relative">
        <Pig />

        <span className="absolute text-[24px] font-bold left-[47%] -translate-x-1/2 top-[110px]">
          10 000L
        </span>
      </div>

      <div className="h-full flex-1">
        <span>Осталось</span>
      </div>
    </div>
  );
}
