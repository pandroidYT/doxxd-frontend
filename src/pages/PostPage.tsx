import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router";
import { Composer } from "../components/Composer";
import { PostCard } from "../components/PostCard";
import { Empty, ErrorNote, PageHeader, Spinner } from "../components/ui";
import { api } from "../lib/api";
import type { Post } from "../lib/types";

export function PostPage() {
  const { id } = useParams();
  const thread = useQuery({
    queryKey: ["post", id],
    queryFn: () => api<{ post: Post; parent: Post | null; replies: Post[] }>(`/posts/${id}`),
  });

  return (
    <>
      <PageHeader title="Post" />
      {thread.isPending ? (
        <Spinner />
      ) : thread.isError ? (
        <div className="p-4">
          <ErrorNote error={thread.error} />
          <Link to="/" className="mt-3 inline-block text-sm text-brand hover:underline">
            ← Back home
          </Link>
        </div>
      ) : (
        <>
          {thread.data.parent && (
            <div className="opacity-70">
              <PostCard post={thread.data.parent} />
            </div>
          )}
          <PostCard post={thread.data.post} focused />
          <Composer parentId={thread.data.post.id} placeholder="Reply anonymously…" />
          {thread.data.replies.length === 0 ? (
            <Empty title="No replies yet." />
          ) : (
            thread.data.replies.map((r) => <PostCard key={r.id} post={r} />)
          )}
        </>
      )}
    </>
  );
}
