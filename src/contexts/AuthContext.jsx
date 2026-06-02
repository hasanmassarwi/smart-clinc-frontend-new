import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedAccess = localStorage.getItem("accessToken");
    const storedRefresh = localStorage.getItem("refreshToken");
    const storedUser = localStorage.getItem("user");

    if (storedAccess) setAccessToken(storedAccess);
    if (storedRefresh) setRefreshToken(storedRefresh);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    function handleTokenRefreshed(e) {
      const next = e?.detail?.accessToken;
      if (next) {
        setAccessToken(next);
      }
    }

    function handleLogoutEvent() {
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }

    window.addEventListener("auth:tokenRefreshed", handleTokenRefreshed);
    window.addEventListener("auth:logout", handleLogoutEvent);
    return () => {
      window.removeEventListener("auth:tokenRefreshed", handleTokenRefreshed);
      window.removeEventListener("auth:logout", handleLogoutEvent);
    };
  }, []);

  async function login(email, password, twoFactorCode) {
    const payload = { email, password };
    if (twoFactorCode) payload.twoFactorCode = twoFactorCode;

    const { data } = await api.post("/auth/login", payload);
    const nextAccessToken = data.accessToken;
    const nextRefreshToken = data.refreshToken;
    if (!nextAccessToken) {
      throw new Error("Login response is missing access token.");
    }

    localStorage.setItem("accessToken", nextAccessToken);
    if (nextRefreshToken) {
      localStorage.setItem("refreshToken", nextRefreshToken);
    } else {
      localStorage.removeItem("refreshToken");
    }
    setAccessToken(nextAccessToken);
    setRefreshToken(nextRefreshToken || null);

    const meResponse = await api.get("/users/me", {
      headers: { Authorization: `Bearer ${nextAccessToken}` }
    });
    localStorage.setItem("user", JSON.stringify(meResponse.data));
    setUser(meResponse.data);

    return meResponse.data;
  }

  async function logout() {
    try {
      if (refreshToken) {
        await api.post("/auth/logout", { refreshToken });
      }
    } catch (error) {
      // ignore logout errors and clear local session anyway
    }

    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  }

  const value = useMemo(
    () => ({
      user,
      accessToken,
      refreshToken,
      isAuthenticated: Boolean(accessToken),
      isLoading,
      login,
      logout
    }),
    [user, accessToken, refreshToken, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
