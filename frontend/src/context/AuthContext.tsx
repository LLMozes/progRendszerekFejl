import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import client from "../api/client";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  createdAt: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (name: string, email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function toMessage(error: unknown) {
  if (typeof error === "string") {
    return error;
  }
  if (error && typeof error === "object" && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    return response?.data?.message ?? "Request failed.";
  }
  return "Request failed.";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadMe = async () => {
      try {
        const response = await client.get<{ user: AuthUser }>("/api/auth/me");
        if (isMounted) {
          setUser(response.data.user);
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadMe();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await client.post<{ user: AuthUser }>("/api/auth/login", {
        email,
        password,
      });
      setUser(response.data.user);
      return response.data.user;
    } catch (error) {
      throw new Error(toMessage(error));
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      const response = await client.post<{ user: AuthUser }>("/api/auth/register", {
        name,
        email,
        password,
      });
      setUser(response.data.user);
      return response.data.user;
    } catch (error) {
      throw new Error(toMessage(error));
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await client.post("/api/auth/logout");
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
