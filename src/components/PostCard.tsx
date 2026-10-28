import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import { timeAgo } from "../lib/time";
import type { Post } from "../lib/types";
import { Avatar, Button, ErrorNote, UserLink } from "./ui";

export function PostCard({ post: initial, focused = false }: { post: Post; focused?: boolean }) {
  const { me } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // Local copy so likes/doxxes show instantly; resynced when fresh data arrives.
  const [post, setPost] = useState(initial);
  const [justDoxxed, setJustDoxxed] = useState(false);
  const [confirming, setConfirming] = useState(false);
  useEffect(() => setPost(initial), [initial]);

  const like = useMutation({
    mutationFn: () =>
      api<{ liked: boolean; likeCount: number }>(`/posts/${post.id}/like`, { method: post.likedByMe ? "DELETE" : "POST" }),
    onSuccess: (r) => setPost((p) => ({ ...p, likedByMe: r.liked, likeCount: r.likeCount })),
  });

  const dox = useMutation({
    mutationFn: () => api<{ post: Post; doxTokens: number }>(`/posts/${post.id}/dox`, { method: "POST" }),
    onSuccess: (r) => {
      setPost(r.post);
      setJustDoxxed(true);
      setConfirming(false);
      queryClient.invalidateQueries();
    },
  });

  const remove = useMutation({
    mutationFn: () => api(`/posts/${post.id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries();
      if (focused) navigate("/");
    },
  });

  const canDox = !post.doxxed && !post.isMine;
  const open = () => !focused && navigate(`/post/${post.id}`);

  return (
    <article
      onClick={open}
      className={`relative flex gap-3 border-b border-line px-4 py-4 transition ${focused ? "" : "cursor-pointer hover:bg-panel/70"} ${
        justDoxxed ? "animate-reveal" : ""
      }`}
    >
      {post.author ? (
        <Link to={`/u/${post.author.username}`} onClick={(e) => e.stopPropagation()}>
          <Avatar user={post.author} />
        </Link>
      ) : (
        <Avatar user={null} />
      )}

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 text-sm">
          {post.author ? (
            <UserLink user={post.author} className="text-text" />
          ) : (
            <>
              <span className="font-mono text-[13px] font-semibold text-brand">{post.alias}</span>
              <span className="redacted w-16" aria-label="identity hidden" />
            </>
          )}
          {post.isMine && <span className="rounded bg-raised px-1.5 text-[11px] text-muted">you</span>}
          <span className="text-muted">·</span>
          <Link
            to={`/post/${post.id}`}
            onClick={(e) => e.stopPropagation()}
            className="text-muted hover:underline"
            title={new Date(post.createdAt).toLocaleString()}
          >
            {timeAgo(post.createdAt)}
          </Link>
        </div>

        {post.doxxed && (
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
            <span className="stamp rounded px-1.5 py-0.5 font-mono font-semibold">DOXXED</span>
            <span>
              was <span className="font-mono">{post.alias}</span> · unmasked by{" "}
              {post.doxxed.by ? <UserLink user={post.doxxed.by} className="text-text" /> : "a deleted user"} ·{" "}
              {timeAgo(post.doxxed.at)}
            </span>
          </div>
        )}

        <p className={`mt-1.5 whitespace-pre-wrap break-words ${focused ? "text-xl" : ""}`}>{post.content}</p>

        <div className="mt-3 flex items-center gap-6 text-sm text-muted" onClick={(e) => e.stopPropagation()}>
          <Link to={`/post/${post.id}`} className="flex items-center gap-1.5 hover:text-text" aria-label="Replies">
            <Icon d="M4 5h16v11H8l-4 4V5Z" /> {post.replyCount}
          </Link>
          <button
            onClick={() => (me ? like.mutate() : navigate("/login"))}
            disabled={like.isPending}
            className={`flex items-center gap-1.5 hover:text-brand-2 ${post.likedByMe ? "text-brand-2" : ""}`}
            aria-pressed={post.likedByMe}
            aria-label="Like"
          >
            <Icon
              d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"
              fill={post.likedByMe}
            />
            {post.likeCount}
          </button>
          {canDox && (
            <button
              onClick={() => (me ? setConfirming(true) : navigate("/login"))}
              className="flex items-center gap-1.5 rounded-full border border-danger/40 px-3 py-0.5 font-semibold text-danger hover:bg-danger/10"
            >
              <Icon d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Zm5.3-2.2L21 21" /> Dox
            </button>
          )}
          {post.isMine && (
            <button
              onClick={() => confirm("Delete this post for good?") && remove.mutate()}
              className="ml-auto text-xs hover:text-danger"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {confirming && (
        <DoxDialog
          tokens={me?.doxTokens ?? 0}
          pending={dox.isPending}
          error={dox.error}
          onConfirm={() => dox.mutate()}
          onCancel={() => {
            setConfirming(false);
            dox.reset();
          }}
        />
      )}
    </article>
  );
}

function DoxDialog(props: { tokens: number; pending: boolean; error: unknown; onConfirm: () => void; onCancel: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && props.onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [props]);

  return createPortal(
    <div
      className="fixed inset-0 z-50 grid cursor-default place-items-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={(e) => {
        e.stopPropagation();
        props.onCancel();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dox-title"
    >
      <div className="w-full max-w-sm rounded-2xl border border-line bg-panel p-6" onClick={(e) => e.stopPropagation()}>
        <h2 id="dox-title" className="text-xl font-bold">
          Dox this post?
        </h2>
        <p className="mt-2 text-sm text-muted">
          Everyone will see who wrote it — forever. It costs one dox token, and they'll know it was you.
        </p>
        <p className="mt-4 font-mono text-sm">
          Tokens: <span className="text-brand">{"◆".repeat(Math.min(props.tokens, 10)) || "none"}</span> ({props.tokens})
        </p>
        {props.tokens < 1 && <p className="mt-2 text-sm text-danger">You're out of tokens. They refill every day at midnight UTC.</p>}
        <div className="mt-3">
          <ErrorNote error={props.error} />
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={props.onCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={props.onConfirm} disabled={props.pending || props.tokens < 1} autoFocus>
            {props.pending ? "Unmasking…" : "Dox them"}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function Icon({ d, fill = false }: { d: string; fill?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill={fill ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}
