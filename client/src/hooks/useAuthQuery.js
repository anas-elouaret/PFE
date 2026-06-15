import { useState, useEffect, useCallback, useRef } from "react";
import * as authApi from "../api/auth";

export function useAuthSession() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const restoreSession = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const savedToken =
        localStorage.getItem("client_token") || sessionStorage.getItem("client_token");
      if (!savedToken) {
        setLoading(false);
        return;
      }
      setToken(savedToken);
      const data = await authApi.getCurrentUser();
      if (mountedRef.current) {
        setUser(data.user);
      }
    } catch (err) {
      if (mountedRef.current) {
        localStorage.removeItem("client_token");
        localStorage.removeItem("client_user");
        sessionStorage.removeItem("client_token");
        sessionStorage.removeItem("client_user");
        setToken(null);
        setUser(null);
        setError(err.message);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    restoreSession();
    return () => { mountedRef.current = false; };
  }, [restoreSession]);

  const login = useCallback(async (email, password, remember = false) => {
    const data = await authApi.signin({ email, password });
    setToken(data.token);
    setUser(data.user);
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem("client_token", data.token);
    storage.setItem("client_user", JSON.stringify(data.user));
    return data;
  }, []);

  const signup = useCallback(async (name, email, password) => {
    const data = await authApi.signup({ name, email, password });
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("client_token", data.token);
    localStorage.setItem("client_user", JSON.stringify(data.user));
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {}
    setToken(null);
    setUser(null);
    localStorage.removeItem("client_token");
    localStorage.removeItem("client_user");
    sessionStorage.removeItem("client_token");
    sessionStorage.removeItem("client_user");
  }, []);

  return {
    user,
    token,
    loading,
    error,
    login,
    signup,
    logout,
    restoreSession,
    isAuthenticated: !!token,
  };
}
