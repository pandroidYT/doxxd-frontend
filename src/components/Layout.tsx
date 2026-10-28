import { Link, NavLink, Outlet } from "react-router";
import { useAuth } from "../lib/auth";
import { timeUntil } from "../lib/time";
import { Avatar, Button } from "./ui";

const ICONS = {
  home: "M3 11 12 4l9 7v9h-6v-6H9v6H3v-9Z",
  exposed: "M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Zm5.3-2.2L21 21",
  shame: "M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4ZM7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3",
  bell: "M6 16V11a6 6 0 1 1 12 0v5l2 2H4l2-2Zm4 4h4",
  me: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-8 9a8 8 0 0 1 16 0",
};

function NavIcon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

export function Layout() {
  const { me, logout } = useAuth();

  const links = [
    { to: "/", label: "Home", icon: ICONS.home, end: true },
    { to: "/exposed", label: "Exposed", icon: ICONS.exposed },
    { to: "/hall-of-shame", label: "Hall of Shame", icon: ICONS.shame },
    ...(me
      ? [
          { to: "/notifications", label: "Notifications", icon: ICONS.bell, badge: me.unreadNotifications },
          { to: "/me", label: "My posts", icon: ICONS.me },
        ]
      : []),
  ];

  return (
    <div className="mx-auto flex min-h-dvh max-w-6xl">
      {/* Desktop / tablet sidebar */}
      <aside className="sticky top-0 hidden h-dvh w-20 shrink-0 flex-col justify-between border-r border-line px-3 py-4 sm:flex xl:w-64">
        <div>
          <Link to="/" className="mb-6 flex items-center gap-3 px-2">
            <img src="/logo.png" alt="" className="size-10 rounded-xl" />
            <span className="hidden text-2xl font-bold tracking-tight xl:inline">
              Do<span className="text-brand">XX</span>d
            </span>
          </Link>
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `relative flex items-center gap-4 rounded-full px-3 py-3 text-lg transition hover:bg-raised ${isActive ? "font-bold text-text" : "text-muted"}`
                }
              >
                <NavIcon d={l.icon} />
                <span className="hidden xl:inline">{l.label}</span>
                {!!l.badge && <Badge n={l.badge} />}
              </NavLink>
            ))}
          </nav>
        </div>
        {me ? (
          <div className="flex items-center gap-3 rounded-full p-2">
            <Link to={`/u/${me.username}`}>
              <Avatar user={me} />
            </Link>
            <div className="hidden min-w-0 flex-1 xl:block">
              <p className="truncate font-semibold">@{me.username}</p>
              <button onClick={logout} className="text-sm text-muted hover:text-text">
                Log out
              </button>
            </div>
          </div>
        ) : (
          <Link to="/login" className="hidden xl:block">
            <Button className="w-full">Log in / Sign up</Button>
          </Link>
        )}
      </aside>

      <main className="min-w-0 flex-1 border-line pb-20 sm:pb-0 lg:border-r">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between border-b border-line px-4 py-2 sm:hidden">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="" className="size-8 rounded-lg" />
            <span className="text-xl font-bold">
              Do<span className="text-brand">XX</span>d
            </span>
          </Link>
          {me ? (
            <span className="font-mono text-sm text-brand">◆ {me.doxTokens}</span>
          ) : (
            <Link to="/login" className="text-sm font-semibold text-brand">
              Log in
            </Link>
          )}
        </div>
        <Outlet />
      </main>

      <aside className="sticky top-0 hidden h-dvh w-80 shrink-0 space-y-4 p-4 lg:block">
        {me && (
          <section className="rounded-2xl border border-line bg-panel p-4">
            <h2 className="text-sm font-semibold text-muted">Your dox tokens</h2>
            <p className="mt-1 font-mono text-3xl text-brand">
              {"◆".repeat(Math.min(me.doxTokens, 10))}
              <span className="text-muted">{"◇".repeat(Math.max(0, 3 - me.doxTokens))}</span>
            </p>
            <p className="mt-1 text-sm text-muted">
              {me.doxTokens} left · refills to 3 in {timeUntil(me.nextRefillAt)}
            </p>
          </section>
        )}
        <section className="rounded-2xl border border-line bg-panel p-4 text-sm">
          <h2 className="mb-2 text-base font-bold">How DoXXd works</h2>
          <ol className="list-decimal space-y-1.5 pl-4 text-muted">
            <li>Every post is anonymous — you get a random alias each time.</li>
            <li>Everyone gets 3 dox tokens a day.</li>
            <li>Spend one to unmask any post's author — for everyone to see.</li>
            <li>Get doxxed? You earn a revenge token.</li>
          </ol>
        </section>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-20 flex justify-around border-t border-line bg-ink/95 py-2 backdrop-blur sm:hidden">
        {[...links, ...(me ? [] : [{ to: "/login", label: "Log in", icon: ICONS.me, end: false }])].map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={"end" in l ? l.end : false}
            aria-label={l.label}
            className={({ isActive }) => `relative p-2 ${isActive ? "text-brand" : "text-muted"}`}
          >
            <NavIcon d={l.icon} />
            {"badge" in l && !!l.badge && <Badge n={l.badge} />}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

function Badge({ n }: { n: number }) {
  return (
    <span className="absolute left-7 top-1.5 min-w-5 rounded-full bg-danger px-1 text-center font-mono text-[11px] font-bold leading-5 text-ink">
      {n > 9 ? "9+" : n}
    </span>
  );
}
