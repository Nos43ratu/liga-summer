export function TeamCard() {
  return (
    <div className="bg-[#41AD70] px-4 py-6 flex justify-between items-center text-white rounded-xl">
      <div className="flex space-x-3 items-center">
        <div className="w-10 h-10 bg-red-200 rounded-full" />

        <p className="text-sm font-medium leading-5">
          Арсенал
          <br />
          Лондон
        </p>
      </div>

      <div className="text-[32px] font-bold">4:0</div>

      <div className="flex space-x-3 items-center">
        <p className="text-sm font-medium leading-5">
          Арсенал
          <br />
          Лондон
        </p>

        <div className="w-10 h-10 bg-red-200 rounded-full" />
      </div>
    </div>
  );
}
