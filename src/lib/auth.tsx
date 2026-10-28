import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { ApiError, api, getToken, setToken } from "./api";
import type { Me } from "./types";

type AuthState = {
  me: Me | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [token, setTokenState] = useState(getToken);

  const meQuery = useQuery({
    queryKey: ["me", token],
    queryFn: () => api<{ user: Me }>("/me").then((r) => r.user),
    enabled: !!token,
    refetchInterval: 60_000,
  });

  const login = useCallback(
    (newToken: string) => {
      setToken(newToken);
      setTokenState(newToken);
      queryClient.invalidateQueries();
    },
    [queryClient],
  );

  const logout = useCallback(() => {
    setToken(null);
    setTokenState(null);
    queryClient.clear();
  }, [queryClient]);

  // An expired or revoked token logs you out.
  useEffect(() => {
    if (meQuery.error instanceof ApiError && meQuery.error.status === 401) logout();
  }, [meQuery.error, logout]);

  return (
    <AuthContext.Provider value={{ me: meQuery.data ?? null, loading: !!token && meQuery.isPending, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
