import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { PostCard } from "../components/PostCard";
import { Button, Empty, ErrorNote, PageHeader, Spinner, Tabs } from "../components/ui";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import { AVATAR_COLORS, type Me, type Post } from "../lib/types";

export function MePage() {
  const { me, loading } = useAuth();
  const [tab, setTab] = useState<"posts" | "settings">("posts");

  if (loading) return <Spinner />;
  if (!me) return <Navigate to="/login" replace />;

  return (
    <>
      <PageHeader title="My posts">
        <p className="text-sm text-muted">Only you can see which anonymous posts are yours.</p>
      </PageHeader>
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { value: "posts", label: "Posts" },
          { value: "settings", label: "Settings" },
        ]}
      />
      {tab === "posts" ? <MyPosts /> : <Settings me={me} />}
    </>
  );
}

function MyPosts() {
  const posts = useQuery({ queryKey: ["myPosts"], queryFn: () => api<{ posts: Post[] }>("/me/posts").then((r) => r.posts) });
  if (posts.isPending) return <Spinner />;
  if (posts.isError) return <ErrorNote error={posts.error} />;
  if (!posts.data.length) return <Empty title="You haven't posted anything yet." />;

  const hidden = posts.data.filter((p) => !p.doxxed).length;
  return (
    <>
      <p className="border-b border-line px-4 py-3 text-sm text-muted">
        <span className="text-text">{hidden}</span> still anonymous ·{" "}
        <span className="text-danger">{posts.data.length - hidden}</span> exposed
      </p>
      {posts.data.map((p) => (
        <PostCard key={p.id} post={p} />
      ))}
    </>
  );
}

function Settings({ me }: { me: Me }) {
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const [bio, setBio] = useState(me.bio);
  const [avatarColor, setAvatarColor] = useState(me.avatarColor);
  const [password, setPassword] = useState("");
  const [saved, setSaved] = useState(false);
  useEffect(() => setSaved(false), [bio, avatarColor]);

  const save = useMutation({
    mutationFn: () => api("/me", { method: "PATCH", body: { bio, avatarColor } }),
    onSuccess: () => {
      setSaved(true);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });

  const del = useMutation({
    mutationFn: () => api("/me", { method: "DELETE", body: { password } }),
    onSuccess: logout,
  });

  return (
    <div className="space-y-10 px-4 py-6">
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate();
        }}
      >
        <h2 className="text-lg font-bold">Public profile</h2>
        <p className="text-sm text-muted">
          This is what people see when they find out a post is yours. Keep real-life details (full name, school, address) out
          of it.
        </p>
        <label className="block">
          <span className="text-sm text-muted">Bio</span>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={160}
            rows={3}
            className="mt-1 w-full resize-none rounded-xl border border-line bg-panel p-3 focus:border-brand focus:outline-none"
          />
        </label>
        <fieldset>
          <legend className="text-sm text-muted">Avatar color</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {AVATAR_COLORS.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setAvatarColor(c)}
                className={`size-9 rounded-full transition ${avatarColor === c ? "ring-2 ring-text ring-offset-2 ring-offset-ink" : ""}`}
                style={{ background: c }}
                aria-label={`Color ${c}`}
                aria-pressed={avatarColor === c}
              />
            ))}
          </div>
        </fieldset>
        <ErrorNote error={save.error} />
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={save.isPending}>
            Save
          </Button>
          {saved && <span className="text-sm text-muted">Saved.</span>}
        </div>
      </form>

      <form
        className="space-y-3 rounded-2xl border border-danger/40 p-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (confirm("Delete your account and every post you've made? This can't be undone.")) del.mutate();
        }}
      >
        <h2 className="font-bold text-danger">Delete account</h2>
        <p className="text-sm text-muted">Removes your account, all your posts, likes and notifications.</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
          autoComplete="current-password"
          className="w-full rounded-xl border border-line bg-panel p-3 focus:border-danger focus:outline-none"
        />
        <ErrorNote error={del.error} />
        <Button variant="danger" type="submit" disabled={!password || del.isPending}>
          Delete my account
        </Button>
      </form>
    </div>
  );
}
