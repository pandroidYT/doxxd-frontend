import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Link, Navigate } from "react-router";
import { Empty, ErrorNote, PageHeader, Spinner } from "../components/ui";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import { timeAgo } from "../lib/time";
import type { Notification } from "../lib/types";

export function NotificationsPage() {
  const { me, loading } = useAuth();
  const queryClient = useQueryClient();
  const list = useQuery({
    queryKey: ["notifications"],
    queryFn: () => api<{ notifications: Notification[] }>("/notifications").then((r) => r.notifications),
    enabled: !!me,
  });
  const markRead = useMutation({
    mutationFn: () => api("/notifications/read", { method: "POST" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["me"] }),
  });

  const hasUnread = list.data?.some((n) => !n.readAt);
  useEffect(() => {
    if (hasUnread) markRead.mutate();
  }, [hasUnread]);

  if (loading) return <Spinner />;
  if (!me) return <Navigate to="/login" replace />;

  return (
    <>
      <PageHeader title="Notifications" />
      {list.isPending ? (
        <Spinner />
      ) : list.isError ? (
        <ErrorNote error={list.error} />
      ) : list.data.length === 0 ? (
        <Empty title="Nothing yet.">You'll hear about it here when someone replies to you — or doxxes you.</Empty>
      ) : (
        list.data.map((n) => (
          <Link
            key={n.id}
            to={n.postId ? `/post/${n.postId}` : "#"}
            className={`flex gap-3 border-b border-line px-4 py-4 hover:bg-panel/70 ${n.readAt ? "" : "bg-brand/5"}`}
          >
            <span className="text-2xl" aria-hidden>
              {n.type === "doxxed" ? "🚨" : "💬"}
            </span>
            <div className="min-w-0 flex-1">
              <p>
                {n.type === "doxxed" ? (
                  <>
                    {n.actor ? <strong>@{n.actor.username}</strong> : "Someone"} <span className="font-bold text-danger">doxxed</span> your
                    post. You earned a revenge token.
                  </>
                ) : (
                  <>An anonymous user replied to your post.</>
                )}
              </p>
              {n.snippet && <p className="mt-1 truncate text-sm text-muted">“{n.snippet}”</p>}
              <p className="mt-1 text-xs text-muted">{timeAgo(n.createdAt)}</p>
            </div>
          </Link>
        ))
      )}
    </>
  );
}
