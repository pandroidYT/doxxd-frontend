import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router";
import type { UserRef } from "../lib/types";

export function Avatar({ user, size = 40 }: { user: UserRef | null; size?: number }) {
  if (!user) {
    // Anonymous: a hooded silhouette.
    return (
      <div
        className="grid shrink-0 place-items-center rounded-full border border-line bg-[repeating-linear-gradient(45deg,#121233_0_6px,#0b0b22_6px_12px)] text-muted"
        style={{ width: size, height: size }}
        aria-hidden
      >
        <svg viewBox="0 0 24 24" width={size * 0.55} height={size * 0.55} fill="currentColor">
          <path d="M12 2a7 7 0 0 0-7 7v3.5L3 20h18l-2-7.5V9a7 7 0 0 0-7-7Zm-2.5 9.5a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Zm5 0a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Z" />
        </svg>
      </div>
    );
  }
  return (
    <div
      className="grid shrink-0 place-items-center rounded-full font-bold text-ink"
      style={{ width: size, height: size, background: user.avatarColor, fontSize: size * 0.42 }}
      aria-hidden
    >
      {user.username[0]?.toUpperCase()}
    </div>
  );
}

export function UserLink({ user, className = "" }: { user: { username: string }; className?: string }) {
  return (
    <Link to={`/u/${user.username}`} className={`font-semibold hover:underline ${className}`} onClick={(e) => e.stopPropagation()}>
      @{user.username}
    </Link>
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" };

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const styles = {
    primary: "bg-gradient-to-r from-brand to-brand-2 text-ink hover:brightness-110",
    ghost: "border border-line text-text hover:bg-raised",
    danger: "bg-danger text-ink hover:brightness-110",
  }[variant];
  return (
    <button
      className={`rounded-full px-5 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${styles} ${className}`}
      {...props}
    />
  );
}

export function Spinner() {
  return (
    <div className="flex justify-center py-10" role="status" aria-label="Loading">
      <div className="size-6 animate-spin rounded-full border-2 border-line border-t-brand" />
    </div>
  );
}

export function Empty({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="px-6 py-14 text-center">
      <p className="font-semibold">{title}</p>
      {children && <div className="mt-1 text-sm text-muted">{children}</div>}
    </div>
  );
}

export function ErrorNote({ error }: { error: unknown }) {
  if (!error) return null;
  return (
    <p className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger" role="alert">
      {error instanceof Error ? error.message : String(error)}
    </p>
  );
}

export function Tabs<T extends string>({
  value,
  onChange,
  tabs,
}: {
  value: T;
  onChange: (v: T) => void;
  tabs: { value: T; label: string }[];
}) {
  return (
    <div className="flex border-b border-line" role="tablist">
      {tabs.map((t) => (
        <button
          key={t.value}
          role="tab"
          aria-selected={value === t.value}
          onClick={() => onChange(t.value)}
          className={`flex-1 py-3 text-sm font-semibold transition hover:bg-raised/60 ${
            value === t.value ? "text-text shadow-[inset_0_-3px_0_var(--color-brand)]" : "text-muted"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function PageHeader({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-ink/80 px-4 py-3 backdrop-blur">
      <h1 className="text-lg font-bold">{title}</h1>
      {children}
    </header>
  );
}
