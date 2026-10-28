import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import type { Post } from "../lib/types";
import { Avatar, Button, ErrorNote } from "./ui";

const MAX = 280;

export function Composer({ parentId, placeholder }: { parentId?: string; placeholder?: string }) {
  const { me } = useAuth();
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");

  const create = useMutation({
    mutationFn: () => api<{ post: Post }>("/posts", { method: "POST", body: { content, parentId } }),
    onSuccess: () => {
      setContent("");
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["post"] });
      queryClient.invalidateQueries({ queryKey: ["myPosts"] });
    },
  });

  if (!me) {
    return (
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-4">
        <p className="text-sm text-muted">Got something to say? Say it anonymously.</p>
        <Link to="/login">
          <Button>Join DoXXd</Button>
        </Link>
      </div>
    );
  }

  const remaining = MAX - content.length;
  const trimmed = content.trim();

  return (
    <form
      className="flex gap-3 border-b border-line px-4 py-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (trimmed && remaining >= 0) create.mutate();
      }}
    >
      <Avatar user={null} />
      <div className="min-w-0 flex-1">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) e.currentTarget.form?.requestSubmit();
          }}
          placeholder={placeholder ?? "Say what you'd never say with your name on it…"}
          rows={parentId ? 2 : 3}
          readOnly={create.isPending}
          className="w-full resize-none bg-transparent text-lg placeholder:text-muted/70 focus:outline-none"
          aria-label={parentId ? "Write a reply" : "Write a post"}
        />
        <ErrorNote error={create.error} />
        <div className="mt-2 flex items-center justify-between gap-3">
          <span className="text-xs text-muted">Posted under a random alias. Anyone can dox it.</span>
          <div className="flex items-center gap-3">
            <span className={`font-mono text-xs ${remaining < 0 ? "text-danger" : remaining < 20 ? "text-brand-2" : "text-muted"}`}>
              {remaining}
            </span>
            <Button type="submit" disabled={!trimmed || remaining < 0 || create.isPending}>
              {create.isPending ? "Posting…" : parentId ? "Reply" : "Post"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
