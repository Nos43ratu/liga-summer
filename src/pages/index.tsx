import { Layout } from "@/components/layout";
import { MatchCard } from "@/components/MatchCard";
import { MATCHES_DATA } from "@/components/data/matches";

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-col h-full p-4 space-y-2">
        {MATCHES_DATA.map((match) => (
          <MatchCard match={match} key={match.id} />
        ))}
      </div>
    </Layout>
  );
}
