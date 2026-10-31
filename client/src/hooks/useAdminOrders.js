import { useCallback, useEffect, useState } from "react";
import { getProjects, updateProjectStatus } from "../api/projects";

/**
 * Every order placed on the site, for the admin area.
 *
 * This deliberately does not reuse ProjectContext: that one loads
 * `/projects/my`, which returns only the projects owned by the signed-in
 * account. Orders placed by visitors who never created an account have no
 * owner, so the admin would never see them. `/projects` returns all of them
 * and is restricted to staff on the server.
 */
export default function useAdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProjects();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Impossible de charger les commandes.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const changeStatus = useCallback(async (id, status, note) => {
    const updated = await updateProjectStatus(id, status, note);
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, ...(updated || {}), status } : order
      )
    );
    return updated;
  }, []);

  return { orders, loading, error, reload: load, changeStatus };
}
