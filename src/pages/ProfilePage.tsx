import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router";
import { PostCard } from "../components/PostCard";
import { Avatar, Empty, ErrorNote, PageHeader, Spinner, Tabs } from "../components/ui";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import { joinedDate } from "../lib/time";
import type { Post, Profile } from "../lib/types";

export function ProfilePage() {
  const { username } = useParams();
  const { me } = useAuth();
  const [tab, setTab] = useState<"exposed" | "doxxes">("exposed");
  const profile = useQuery({
    queryKey: ["user", username],
    queryFn: () => api<{ user: Profile; exposedPosts: Post[]; doxxedByThem: Post[] }>(`/users/${username}`),
  });

  if (profile.isPending) return <Spinner />;
  if (profile.isError)
    return (
      <div className="p-4">
        <ErrorNote error={profile.error} />
      </div>
    );

  const { user, exposedPosts, doxxedByThem } = profile.data;
  const isMe = me?.username.toLowerCase() === user.username.toLowerCase();
  const list = tab === "exposed" ? exposedPosts : doxxedByThem;

  return (
    <>
      <PageHeader title={`@${user.username}`} />
      <section className="border-b border-line px-4 py-6">
        <Avatar user={user} size={80} />
        <h2 className="mt-3 text-2xl font-bold">@{user.username}</h2>
        {user.bio && <p className="mt-2 whitespace-pre-wrap">{user.bio}</p>}
        <p className="mt-2 text-sm text-muted">Joined {joinedDate(user.createdAt)}</p>
        <div className="mt-4 flex gap-6 text-sm">
          <p>
            <span className="font-mono text-lg font-bold text-danger">{user.timesDoxxed}</span>{" "}
            <span className="text-muted">times doxxed</span>
          </p>
          <p>
            <span className="font-mono text-lg font-bold text-brand">{user.doxxesMade}</span>{" "}
            <span className="text-muted">doxxes made</span>
          </p>
        </div>
        <p className="mt-4 rounded-lg bg-raised/60 px-3 py-2 text-xs text-muted">
          {isMe
            ? "This is what everyone else sees. Your anonymous posts are only listed under My posts."
            : "Only posts that have been doxxed show up here. Everything else they've said is still anonymous."}
        </p>
      </section>
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { value: "exposed", label: `Exposed posts (${exposedPosts.length})` },
          { value: "doxxes", label: `Their doxxes (${doxxedByThem.length})` },
        ]}
      />
      {list.length === 0 ? (
        <Empty title={tab === "exposed" ? `@${user.username} hasn't been caught yet.` : `@${user.username} hasn't doxxed anyone.`} />
      ) : (
        list.map((p) => <PostCard key={p.id} post={p} />)
      )}
    </>
  );
}
