import { useInfiniteQuery } from "@tanstack/react-query";
import { Composer } from "../components/Composer";
import { PostCard } from "../components/PostCard";
import { Button, Empty, ErrorNote, PageHeader, Spinner } from "../components/ui";
import { api } from "../lib/api";
import type { Post } from "../lib/types";

type Page = { posts: Post[]; nextCursor: string | null };

export function FeedPage({ filter }: { filter: "all" | "doxxed" }) {
  const feed = useInfiniteQuery({
    queryKey: ["feed", filter],
    queryFn: ({ pageParam }) =>
      api<Page>(`/posts?filter=${filter}${pageParam ? `&cursor=${pageParam}` : ""}`),
    initialPageParam: null as string | null,
    getNextPageParam: (last) => last.nextCursor,
  });

  const posts = feed.data?.pages.flatMap((p) => p.posts) ?? [];

  return (
    <>
      {filter === "all" ? (
        <PageHeader title="Home" />
      ) : (
        <PageHeader title="Exposed">
          <p className="text-sm text-muted">Every post that's been unmasked, most recent first.</p>
        </PageHeader>
      )}
      {filter === "all" && <Composer />}

      {feed.isPending ? (
        <Spinner />
      ) : feed.isError ? (
        <div className="p-4">
          <ErrorNote error={feed.error} />
        </div>
      ) : posts.length === 0 ? (
        filter === "all" ? (
          <Empty title="It's quiet in here.">Be the first to post something anonymously.</Empty>
        ) : (
          <Empty title="Nobody's been doxxed yet.">Everyone's secrets are safe… for now.</Empty>
        )
      ) : (
        <>
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
          {feed.hasNextPage && (
            <div className="flex justify-center py-6">
              <Button variant="ghost" onClick={() => feed.fetchNextPage()} disabled={feed.isFetchingNextPage}>
                {feed.isFetchingNextPage ? "Loading…" : "Load more"}
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
}
