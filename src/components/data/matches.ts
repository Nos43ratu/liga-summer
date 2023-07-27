export type Match = {
  id: number;
  name: string;
  sport: string;
  league: string;
  start_date: Date;
};

export const MATCHES_DATA = [
  {
    id: 1,
    name: "Спартак - ЦСК",
    sport: "Футбол",
    league: "Очень крутая лига",
    start_date: generate_start_date(100),
  },
];

function generate_start_date(offset: number) {
  const finishDate = new Date();
  finishDate.setSeconds(finishDate.getSeconds() + offset);

  return finishDate;
}
