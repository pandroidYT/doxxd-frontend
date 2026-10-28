import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { Avatar, ErrorNote, PageHeader, Spinner } from "../components/ui";
import { api } from "../lib/api";
import type { LeaderboardEntry } from "../lib/types";

export function LeaderboardPage() {
  const board = useQuery({
    queryKey: ["leaderboard"],
    queryFn: () => api<{ mostDoxxed: LeaderboardEntry[]; topDoxxers: LeaderboardEntry[] }>("/leaderboard"),
  });

  return (
    <>
      <PageHeader title="Hall of Shame" />
      {board.isPending ? (
        <Spinner />
      ) : board.isError ? (
        <ErrorNote error={board.error} />
      ) : (
        <div className="grid gap-4 p-4 md:grid-cols-2">
          <Board title="Most doxxed" subtitle="Can't keep a secret" entries={board.data.mostDoxxed} accent="text-danger" />
          <Board title="Top doxxers" subtitle="Nobody is safe" entries={board.data.topDoxxers} accent="text-brand" />
        </div>
      )}
    </>
  );
}

function Board(props: { title: string; subtitle: string; entries: LeaderboardEntry[]; accent: string }) {
  return (
    <section className="rounded-2xl border border-line bg-panel p-4">
      <h2 className="text-lg font-bold">{props.title}</h2>
      <p className="text-sm text-muted">{props.subtitle}</p>
      {props.entries.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted">No one yet.</p>
      ) : (
        <ol className="mt-3 space-y-1">
          {props.entries.map((e, i) => (
            <li key={e.username}>
              <Link to={`/u/${e.username}`} className="flex items-center gap-3 rounded-xl p-2 hover:bg-raised">
                <span className="w-5 text-right font-mono text-sm text-muted">{i + 1}</span>
                <Avatar user={e} size={32} />
                <span className="min-w-0 flex-1 truncate font-semibold">@{e.username}</span>
                <span className={`font-mono font-bold ${props.accent}`}>{e.count}</span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
