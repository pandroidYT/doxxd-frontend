import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Link, Route, Routes } from "react-router";
import { Layout } from "./components/Layout";
import { Empty } from "./components/ui";
import "./index.css";
import { ApiError } from "./lib/api";
import { AuthProvider } from "./lib/auth";
import { AuthPage } from "./pages/AuthPage";
import { FeedPage } from "./pages/FeedPage";
import { LeaderboardPage } from "./pages/LeaderboardPage";
import { MePage } from "./pages/MePage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { PostPage } from "./pages/PostPage";
import { ProfilePage } from "./pages/ProfilePage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 15_000,
      // Don't retry things the server deliberately refused.
      retry: (count, err) => !(err instanceof ApiError && err.status >= 400 && err.status < 500) && count < 2,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<AuthPage />} />
            <Route element={<Layout />}>
              <Route index element={<FeedPage key="all" filter="all" />} />
              <Route path="exposed" element={<FeedPage key="doxxed" filter="doxxed" />} />
              <Route path="hall-of-shame" element={<LeaderboardPage />} />
              <Route path="post/:id" element={<PostPage />} />
              <Route path="u/:username" element={<ProfilePage />} />
              <Route path="me" element={<MePage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route
                path="*"
                element={
                  <Empty title="This page has been doxxed out of existence.">
                    <Link to="/" className="text-brand hover:underline">
                      Go home
                    </Link>
                  </Empty>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
