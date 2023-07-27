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
    name: "Арсенал Лондон - Ноттингем Форест",
    sport: "Футбол",
    league: "Англия/АПЛ",
    start_date: generate_start_date(100),
  },
  {
    id: 2,
    name: "Арсенал Лондон - Ноттингем Форест",
    sport: "Футбол",
    league: "Англия/АПЛ",
    start_date: generate_start_date(200),
  },
  {
    id: 3,
    name: "Арсенал Лондон - Ноттингем Форест",
    sport: "Футбол",
    league: "Англия/АПЛ",
    start_date: generate_start_date(300),
  },
];

function generate_start_date(offset: number) {
  const finishDate = new Date();
  finishDate.setSeconds(finishDate.getSeconds() + offset);

  return finishDate;
}
