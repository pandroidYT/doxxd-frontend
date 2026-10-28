import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { Button, ErrorNote } from "../components/ui";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";

const inputClass =
  "w-full rounded-xl border border-line bg-panel px-4 py-3 placeholder:text-muted/70 focus:border-brand focus:outline-none";

export function AuthPage() {
  const { me, login } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [form, setForm] = useState({ username: "", email: "", login: "", password: "" });
  const [agreed, setAgreed] = useState(false);
  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [key]: e.target.value });

  const submit = useMutation({
    mutationFn: () =>
      mode === "signup"
        ? api<{ token: string }>("/auth/register", {
            method: "POST",
            body: { username: form.username, email: form.email, password: form.password },
          })
        : api<{ token: string }>("/auth/login", { method: "POST", body: { login: form.login, password: form.password } }),
    onSuccess: ({ token }) => {
      login(token);
      navigate("/");
    },
  });

  if (me) return <Navigate to="/" replace />;

  return (
    <div className="mx-auto grid min-h-dvh max-w-5xl items-center gap-10 px-4 py-10 md:grid-cols-2">
      <section>
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="" className="size-14 rounded-2xl" />
          <span className="text-4xl font-bold tracking-tight">
            Do<span className="text-brand">XX</span>d
          </span>
        </Link>
        <h1 className="mt-8 text-4xl leading-tight font-bold md:text-5xl">
          Say anything.
          <br />
          <span className="bg-gradient-to-r from-brand to-brand-2 bg-clip-text text-transparent">Until someone doxxes you.</span>
        </h1>
        <ul className="mt-6 space-y-2 text-muted">
          <li>🎭 Every post goes up under a random alias.</li>
          <li>🔍 Everyone gets 3 dox tokens a day to unmask any post.</li>
          <li>🚨 Get caught and your name is on it — for everyone.</li>
          <li>😈 Got doxxed? Take a revenge token.</li>
        </ul>
      </section>

      <section className="rounded-3xl border border-line bg-panel/80 p-6 backdrop-blur">
        <div className="mb-6 flex rounded-full bg-ink p-1" role="tablist">
          {(["signup", "login"] as const).map((m) => (
            <button
              key={m}
              role="tab"
              aria-selected={mode === m}
              onClick={() => {
                setMode(m);
                submit.reset();
              }}
              className={`flex-1 rounded-full py-2 text-sm font-semibold transition ${mode === m ? "bg-raised text-text" : "text-muted"}`}
            >
              {m === "signup" ? "Sign up" : "Log in"}
            </button>
          ))}
        </div>

        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            submit.mutate();
          }}
        >
          {mode === "signup" ? (
            <>
              <input className={inputClass} placeholder="Username" autoComplete="username" value={form.username} onChange={set("username")} required minLength={3} maxLength={20} pattern="[A-Za-z0-9_]+" title="Letters, numbers and underscores" />
              <input className={inputClass} placeholder="Email" type="email" autoComplete="email" value={form.email} onChange={set("email")} required />
            </>
          ) : (
            <input className={inputClass} placeholder="Username or email" autoComplete="username" value={form.login} onChange={set("login")} required />
          )}
          <input
            className={inputClass}
            placeholder="Password"
            type="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            value={form.password}
            onChange={set("password")}
            required
            minLength={mode === "signup" ? 8 : undefined}
          />

          {mode === "signup" && (
            <label className="flex gap-3 rounded-xl bg-raised/60 p-3 text-sm text-muted">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 accent-[var(--color-brand)]" required />
              <span>
                I get that <strong className="text-text">any of my posts can be doxxed</strong>, which shows my username to
                everyone. I won't use my real name as my username unless I'm fine with that.
              </span>
            </label>
          )}

          <ErrorNote error={submit.error} />
          <Button type="submit" className="w-full py-3" disabled={submit.isPending}>
            {submit.isPending ? "One sec…" : mode === "signup" ? "Create account" : "Log in"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted">
          <Link to="/" className="hover:text-text">
            Just look around first →
          </Link>
        </p>
      </section>
    </div>
  );
}
