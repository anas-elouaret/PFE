import { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as notifApi from "../api/notifications";

const NotificationContext = createContext(null);

let toastId = 0;

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      const data = await notifApi.getNotifications();
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
    } catch (_) {} finally {
      setLoading(false);
    }
  }, []);

  const addToast = useCallback((message, type = "success", duration = 4000) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const addNotification = useCallback(async (notif) => {
    try {
      const n = await notifApi.addNotification(notif);
      setNotifications(prev => [n, ...prev]);
      setUnreadCount(c => c + 1);
      addToast(notif.message || "New notification", "info");
      return n;
    } catch (_) {}
  }, [addToast]);

  const markAsRead = useCallback(async (id) => {
    try {
      await notifApi.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      setUnreadCount(c => Math.max(0, c - 1));
    } catch (_) {}
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await notifApi.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (_) {}
  }, []);

  const clearAll = useCallback(async () => {
    try {
      await notifApi.clearNotifications();
      setNotifications([]);
      setUnreadCount(0);
    } catch (_) {}
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return (
    <NotificationContext.Provider value={{
      notifications, toasts, loading, unreadCount,
      addToast, addNotification, markAsRead, markAllAsRead, clearAll, dismissToast, refresh: fetch,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}
