import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import * as authApi from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  const restoreSession = useCallback(async () => {
    setLoading(true);
    try {
      const savedToken = localStorage.getItem("client_token") || sessionStorage.getItem("client_token");
      if (!savedToken) { setLoading(false); return; }
      setToken(savedToken);
      const data = await authApi.getCurrentUser();
      if (mountedRef.current) setUser(data.user);
    } catch {
      if (mountedRef.current) {
        localStorage.removeItem("client_token");
        localStorage.removeItem("client_user");
        sessionStorage.removeItem("client_token");
        sessionStorage.removeItem("client_user");
        setToken(null);
        setUser(null);
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    restoreSession();
    return () => { mountedRef.current = false; };
  }, [restoreSession]);

  const login = useCallback(async (email, password, remember = false) => {
    const data = await authApi.signin({ email, password });
    if (!data || !data.token) {
      throw new Error(data?.message || "La réponse du serveur est invalide. Veuillez réessayer.");
    }
    setToken(data.token);
    setUser(data.user);
    const storage = remember ? localStorage : sessionStorage;
    localStorage.removeItem("auth_token");
    storage.setItem("client_token", data.token);
    storage.setItem("client_user", JSON.stringify(data.user));
    return data;
  }, []);

  const signup = useCallback(async (name, email, password) => {
    const data = await authApi.signup({ name, email, password });
    if (!data || !data.token) {
      throw new Error(data?.message || "La réponse du serveur est invalide. Veuillez réessayer.");
    }
    setToken(data.token);
    setUser(data.user);
    localStorage.removeItem("auth_token");
    localStorage.setItem("client_token", data.token);
    localStorage.setItem("client_user", JSON.stringify(data.user));
    return data;
  }, []);

  const logout = useCallback(() => {
    authApi.logout().catch(() => {});
    setToken(null);
    setUser(null);
    localStorage.removeItem("client_token");
    localStorage.removeItem("client_user");
    sessionStorage.removeItem("client_token");
    sessionStorage.removeItem("client_user");
  }, []);

  const verifyEmail = useCallback(async (verificationToken) => {
    const data = await authApi.verifyEmail(verificationToken);
    if (user) {
      const updated = { ...user, isVerified: true };
      setUser(updated);
      const saved = localStorage.getItem("client_user") || sessionStorage.getItem("client_user");
      if (saved) {
        const storage = localStorage.getItem("client_user") ? localStorage : sessionStorage;
        storage.setItem("client_user", JSON.stringify(updated));
      }
    }
    return data;
  }, [user]);

  const resendVerification = useCallback(async (email) => {
    return authApi.resendVerification(email);
  }, []);

  const forgotPassword = useCallback(async (email) => {
    return authApi.forgotPassword(email);
  }, []);

  const resetPassword = useCallback(async (resetToken, password) => {
    return authApi.resetPassword(resetToken, password);
  }, []);

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
