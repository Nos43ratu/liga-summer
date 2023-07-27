import Link from "next/link";

const MOCK_LOBBY = [
  {
    id: 1,
    name: "Argentina - Primera Division",
    country: "Argentina",
    league: "Primera Division",
    teams: [
      {
        id: 1,
        name: "Boca Juniors",
        logo: "https://media.api-sports.io/football/teams/1.png",
      },
      {
        id: 2,
        name: "River Plate",
        logo: "https://media.api-sports.io/football/teams/2.png",
      },
    ],
  },
];

export function LobbyList() {
  return (
    <div className="flex flex-col space-y-2 text-black">
      {MOCK_LOBBY.map((lobby) => (
        <Link href={"/game"}>
          <div>{lobby.name}</div>
          <div>{lobby.country}</div>
          <div>{lobby.league}</div>
        </Link>
      ))}
    </div>
  );
}
